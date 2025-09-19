import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { useTenant } from '../../../../core/contexts/TenantContext';

import type { IFolderVideo } from '../../../../core/types/iFolder'

import * as S from './styles'
import { SubmenuSelect, type ISubmenuSelect } from '../../../UI/submenu-select';
import { IconMoreVertical, IconPencil, IconStar, IconTextRename, IconTrash, IconVideo } from '../../../../assets/icons';
import { ModalConfirm } from '../../../UI/modal/modal-confirm';
import { VideoService } from '../../../../core/services/VideoService';
import { useAuth } from '../../../../core/contexts/AuthContext';

interface IProps {
    type: 'card' | 'list'
    item: IFolderVideo;
    onDelete(type: string, id: string): void;
    onView(): void;
    onEdit(item: IFolderVideo): void;
}

export const CardVideo = ({ type, item, onView, onEdit, onDelete }: IProps) => {

    const refTitle = useRef<any>(null);
    const { tenant } = useTenant();
    const { role, verifyPermission } = useAuth();

    const [editableName, setEditableName] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [modalDelete, setModalDelete] = useState(false);

    const [rename, setRename] = useState(item.name)
    const [loadingRename, setLoadingRename] = useState(false);

    const [list, setList] = useState<ISubmenuSelect[]>([])

    const handleOnRename = () => {
        setEditableName(true);
        setTimeout(() => {
            refTitle.current.focus()
        }, 100)
    }

    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRename(true);
        await VideoService.set({
            video_id: item.video_id,
            folder_id: item.folder_id,
            tenant_id: item.tenant_id,
            code: item.code,
            host: item.host,
            name: rename,
            tags: item.tags,
        });
        setEditableName(false)
        setLoadingRename(false);
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await VideoService.delete({ id: item.video_id });
        setLoadingDelete(false);
        setModalDelete(false)
        onDelete('video', String(item.video_id));
    }

    useEffect(() => {

        const newList: ISubmenuSelect[] = []

        if (verifyPermission('videos_edit')) {
            newList.push({
                name: 'Renomar',
                icon: <IconTextRename />,
                onClick: () => handleOnRename()
            })
        }
        if (verifyPermission('videos_edit')) {
            newList.push({
                name: 'Editar',
                icon: <IconPencil />,
                onClick: () => onEdit(item)
            })
        }
        if (verifyPermission('videos_delete')) {
            newList.push({
                name: 'Excluir',
                icon: <IconTrash />,
                onClick: () => setModalDelete(true)
            })
        }
        setList([...newList])
    }, [role, item]);

    return (
        <>
            <S.Container
                type={type}
                onDragStart={(e) => {
                    e.dataTransfer.setData('type', 'video');
                    e.dataTransfer.setData('id', String(item.video_id));
                    e.dataTransfer.setData('DTO', JSON.stringify({
                        tenant_id: item.tenant_id,
                        code: item.code,
                        host: item.host,
                        name: item.name,
                        tags: item.tags
                    }));
                }}
                draggable
                host={item.host}
                color={tenant?.colorhigh}
                colorBg={tenant?.colormain}
                colorText={tenant?.colorsecond}
            >
                <div onClick={onView} className='thumbnail'>
                    <div className='preview' style={{
                        backgroundImage: `url(${item.thumbnail})`
                    }}>
                        <IconVideo />
                    </div>
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
                <div className='infos' onClick={onView}>

                    {!editableName ?
                        <p className='title' ref={refTitle}>{item.name}</p>
                        :
                        <form onSubmit={handleSaveName}>
                            <input
                                ref={refTitle}
                                disabled={loadingRename}
                                onBlur={handleSaveName}
                                autoFocus
                                value={rename}
                                onChange={(e) => setRename(e.target.value)}
                                className='title'
                            />
                        </form>
                    }

                    <p className='date'>
                        {moment(item.created).format('DD/MM/YYYY HH:mm')}
                    </p>
                </div>
            </S.Container>
            <ModalConfirm
                title="Atenção"
                description={"Você deseja realmente Excluir esse vídeo?"}
                type="danger"
                opened={modalDelete}
                onCancel={() => setModalDelete(false)}
                onConfirm={handleDelete}
                loading={loadingDelete}
            />
        </>
    )
}