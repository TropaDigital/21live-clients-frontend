import { useEffect, useRef, useState } from 'react';
import { IconLink, IconMoreVertical, IconPencil, IconStar, IconTextRename, IconTrash } from '../../../../assets/icons';
import type { IFolderLink } from '../../../../core/types/iFolder'
import { SubmenuSelect, type ISubmenuSelect } from '../../../UI/submenu-select';
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext';
import moment from 'moment';
import { useRedirect } from '../../../../core/hooks/useRedirect';
import { ModalConfirm } from '../../../UI/modal/modal-confirm';
import { IconLoadingBounce } from '../../../UI/form/button-default';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { LinkService } from '../../../../core/services/LinkService';

interface IProps {
    type: 'card' | 'list'
    item: IFolderLink;
    draggable?: boolean;
    onDelete(type: string, id: string): void;
    onEdit(item: IFolderLink): void;
}

export const CardLink = ({ onDelete, onEdit, type, item }: IProps) => {

    const { tenant } = useTenant();
    const { verifyPermission, role } = useAuth();

    const refTitle = useRef<any>(null);

    const [isOver, setIsOver] = useState(false);
    const [editableName, setEditableName] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [modalDelete, setModalDelete] = useState(false);

    const [rename, setRename] = useState(item.name)
    const [loadingRename, setLoadingRename] = useState(false);

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
        await LinkService.delete({ id: item.link_id });
        setLoadingDelete(false);
        setModalDelete(false)
        onDelete('link', String(item.link_id));
    }


    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRename(true);
        await LinkService.set({
            ...item,
            name: rename,
        });
        item.name = rename;
        setEditableName(false);
        setLoadingRename(false);
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
    }, [role, item]);

    const redirectLink = () => {
        if (item.type === 'internal') {
            if (item.target_type === 'folder') {
                redirectSlug(`${item.target_id ? `/folders/${item.target_id}` : `folders/`}`)
            } else {
                window.open(`https://dev.21live.com.br/21panda/Files/Jobs/${item.target_id}`, "_blank")
            }
        } else {
            window.open(`${item.url}`, "_blank")
        }
    }

    return (
        <>
            <S.Container
                className='card card-link'
                drop={isOver}
                type={type}
                draggable={modalDelete || !verifyPermission('links_edit') ? false : true}
                onDragStart={(e) => {
                    e.dataTransfer.setData('type', 'link');
                    e.dataTransfer.setData('id', String(item.link_id));
                    e.dataTransfer.setData('DTO', JSON.stringify(item));
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    verifyPermission('links_edit') && setIsOver(true);
                }}
                onDragLeave={() => setIsOver(false)}
                onDragEnd={() => setIsOver(false)}
                color={tenant?.colorhigh}
                colorBg={tenant?.colormain}
                colorText={tenant?.colorsecond}
            >
                <div className='head-item'>
                    <div className='icon' onClick={() => editableName ? {} : redirectLink()}>
                        {item.icon ?
                            <i className={`fa fa-${item.icon}`}></i> :
                            <IconLink />
                        }
                        {loadingRename && <i className='load-icon'><IconLoadingBounce /></i>}
                    </div>

                    <div className='tools'>
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

                <form onClick={() => editableName ? {} : redirectLink()} className='infos' onSubmit={handleSaveName}>
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
                description={"Você deseja realmente remover esse link?"}
                type="danger"
                opened={modalDelete}
                onCancel={() => setModalDelete(false)}
                onConfirm={handleDelete}
                loading={loadingDelete}
            />

        </>
    )
}