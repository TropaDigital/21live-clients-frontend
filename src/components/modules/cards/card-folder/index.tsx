import { useEffect, useRef, useState } from 'react';
import { IconEye, IconEyeClose, IconMoreVertical, IconPencil, IconStar, IconTextRename, IconTrash } from '../../../../assets/icons';
import type { IFolder } from '../../../../core/types/iFolder'
import { SubmenuSelect, type ISubmenuSelect } from '../../../UI/submenu-select';
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext';
import moment from 'moment';
import { useRedirect } from '../../../../core/hooks/useRedirect';
import { ModalConfirm } from '../../../UI/modal/modal-confirm';
import { FoldersService } from '../../../../core/services/FoldersService';
import { VideoService } from '../../../../core/services/VideoService';
import { IconLoadingBounce } from '../../../UI/form/button-default';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { LinkService } from '../../../../core/services/LinkService';
import { FilesService } from '../../../../core/services/FilesService';

interface IProps {
    type: 'card' | 'list'
    item: IFolder;
    onDelete(type: string, id: string): void;
    onEdit(item: IFolder): void;
}

export const CardFolder = ({ onDelete, onEdit, type, item }: IProps) => {

    const { tenant } = useTenant();
    const { verifyPermission, role, getMenus } = useAuth();

    const refTitle = useRef<any>(null);

    const [isOver, setIsOver] = useState(false);
    const [editableName, setEditableName] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [modalDelete, setModalDelete] = useState(false);

    const [rename, setRename] = useState(item.name)
    const [loadingRename, setLoadingRename] = useState(false);

    const [access, setAccess] = useState(item.access)

    const [list, setList] = useState<ISubmenuSelect[]>([])

    const { redirectSlug } = useRedirect();

    const handleOnRename = () => {
        setEditableName(true);
        setTimeout(() => {
            refTitle.current.focus()
        }, 100)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await FoldersService.delete({ id: item.folder_id });
        if (item.menulink) getMenus()
        setLoadingDelete(false);
        setModalDelete(false)
        onDelete('folder', String(item.folder_id));
    }


    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRename(true);
        await FoldersService.update({
            folder_id: item.folder_id,
            parent_id: item.parent_id,
            tenant_id: item.tenant_id,
            name: rename,
            icon: item.icon,
            menulink: item.menulink,
        });
        if (item.menulink) getMenus()
        item.name = rename;
        setEditableName(false);
        setLoadingRename(false);
    }

    const handleMove = async (type: string, id: string, folderId: number, DTO: any) => {

        if (type === 'folder' && id === String(folderId)) return

        if (DTO) DTO = JSON.parse(DTO)

        switch (type) {
            case 'folder':
                FoldersService.update({
                    folder_id: Number(id),
                    parent_id: Number(folderId),
                    tenant_id: item.tenant_id,
                    name: DTO.name,
                    icon: DTO.icon
                })
                onDelete('folder', id);
                break;
            case 'file':
                // moverArquivo(fileId, novaPasta)
                FilesService.set({
                    file_id: Number(id),
                    folder_id: Number(folderId),
                    tenant_id: item.tenant_id,
                    name: DTO.name,
                })
                onDelete('file', id);
                break;
            case 'video':
                VideoService.set({
                    video_id: Number(id),
                    folder_id: Number(folderId),
                    tenant_id: item.tenant_id,
                    code: DTO.code,
                    host: DTO.host,
                    name: DTO.name,
                    tags: DTO.tags,
                })
                onDelete('video', id);
                break;
            case 'link':
                LinkService.set({
                    ...DTO,
                    folder_id: Number(folderId),
                })
                onDelete('link', id);
                break;
        }
    }

    useEffect(() => {
        const newList: ISubmenuSelect[] = []
        if (verifyPermission('links_edit')) {
            newList.push({
                name: 'Renomar',
                icon: <IconTextRename />,
                onClick: () => handleOnRename()
            })
        }
        if (verifyPermission('links_edit')) {
            newList.push({
                name: 'Editar',
                icon: <IconPencil />,
                onClick: () => onEdit(item)
            })
        }
        if (verifyPermission('links_delete')) {
            newList.push({
                name: 'Remover',
                icon: <IconTrash />,
                onClick: () => setModalDelete(true)
            })
        }
        setList([...newList])
    }, [role, item])

    const [modalConfirmAccess, setModalConfirmAccess] = useState(false);
    const [loadingAccess, setLoadingAccess] = useState(false);

    const handleChangeVisibility = async () => {
        setLoadingAccess(true);
        const visibility = item.access === 'public' ? 'private' : 'public'
        await FoldersService.update({ ...item, access: visibility })
        setModalConfirmAccess(false)
        item.access = visibility;
        setAccess(visibility);
        setLoadingAccess(false);
    }

    return (
        <>
            <ModalConfirm
                title='Anteção'
                onConfirm={handleChangeVisibility}
                onCancel={() => setModalConfirmAccess(false)}
                opened={modalConfirmAccess}
                description={access === 'public' ? 'Você deseja tornar essa pasta privada?' : 'Você deseja tornar essa pasta pública?'}
                type='info'
                loading={loadingAccess}
            />
            <S.Container
                className='card card-folder'
                drop={isOver}
                type={type}
                draggable={modalDelete || !verifyPermission('folders_edit') ? false : true}
                onDragStart={(e) => {
                    e.dataTransfer.setData('type', 'folder');
                    e.dataTransfer.setData('id', String(item.folder_id));
                    e.dataTransfer.setData('DTO', JSON.stringify(item));
                }}
                onDrop={(e) => {
                    const type = e.dataTransfer.getData('type');
                    const id = e.dataTransfer.getData('id');
                    const DTO = e.dataTransfer.getData('DTO');
                    const folderId = item.folder_id;
                    setIsOver(false);
                    verifyPermission('folders_edit') && handleMove(type, id, folderId, DTO);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    verifyPermission('folders_edit') && setIsOver(true);
                }}
                onDragLeave={() => setIsOver(false)}
                color={tenant?.colorhigh}
                colorBg={tenant?.colormain}
                colorText={tenant?.colorsecond}
            >
                {!editableName &&
                    <div className='redirect-absolute' onClick={() => redirectSlug(`/folders/${item.folder_id}`)} />
                }
                <div className='head-item'>

                    <div className='icon' onClick={() => editableName ? {} : redirectSlug(`/folders/${item.folder_id}`)}>
                        <i className={`fa fa-${item.icon}`}></i>
                        {loadingRename && <i className='load-icon'><IconLoadingBounce /></i>}
                    </div>

                    <div className='tools'>
                        {verifyPermission('folders_edit') &&
                            <button data-tooltip-id="tooltip" data-tooltip-content={access === 'public' ? 'Marcar pasta como privada' : 'Marcar pasta como pública'} onClick={() => setModalConfirmAccess(true)} className={`more star`}>
                                {access === 'public' ? <IconEye /> : <IconEyeClose />}
                            </button>
                        }

                        <button className={`more star`}>
                            <IconStar />
                        </button>

                        {list.length > 0 &&
                            <SubmenuSelect position='right' submenu={list}>
                                <button className='more'>
                                    <IconMoreVertical />
                                </button>
                            </SubmenuSelect>
                        }
                    </div>
                </div>

                <form onClick={() => editableName ? {} : redirectSlug(`/folders/${item.folder_id}`)} className='infos' onSubmit={handleSaveName}>
                    {!editableName ?
                        <p className='title' ref={refTitle}>{item.name}</p>
                        :
                        <input
                            ref={refTitle}
                            disabled={loadingRename}
                            onBlur={handleSaveName}
                            autoFocus
                            value={rename}
                            onChange={(e) => setRename(e.target.value)}
                            className='title'
                        />
                    }

                    <p className='date'>
                        {moment(item.created).format('DD/MM/YYYY HH:mm')}
                    </p>
                </form>
            </S.Container>

            <ModalConfirm
                title="Atenção"
                description={"Você deseja realmente remover essa pasta?"}
                type="danger"
                opened={modalDelete}
                onCancel={() => setModalDelete(false)}
                onConfirm={handleDelete}
                loading={loadingDelete}
            />

        </>
    )
}