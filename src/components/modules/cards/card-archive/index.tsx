import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { useTenant } from '../../../../core/contexts/TenantContext';

import type { IFolderFileItem } from '../../../../core/types/iFolder'

import * as S from './styles'
import { SubmenuSelect, type ISubmenuSelect } from '../../../UI/submenu-select';
import { IconMoreVertical, IconPencil, IconStar, IconTextRename, IconTrash } from '../../../../assets/icons';
import { InputCheckbox } from '../../../UI/form/input-checkbox';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { ModalConfirm } from '../../../UI/modal/modal-confirm';
import { FilesService } from '../../../../core/services/FilesService';

interface IProps {
    ref?: any;
    item: IFolderFileItem;
    type: 'card' | 'list';
    checked?: boolean;
    onChecked?(): void;

    onView(): void;
    onEdit?(e: IFolderFileItem): void;
    onDelete?(type: string, id: string): void;
}

export const CardArchive = ({ ref, checked, onChecked, onView, onEdit, onDelete, type, item }: IProps) => {

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


    useEffect(() => {
        const newList: ISubmenuSelect[] = []
        if (verifyPermission('files_edit') && onEdit) {
            newList.push({
                name: 'Renomar',
                icon: <IconTextRename />,
                onClick: () => handleOnRename()
            })
        }
        if (verifyPermission('files_edit') && onEdit) {
            newList.push({
                name: 'Editar',
                icon: <IconPencil />,
                onClick: () => onEdit(item)
            })
        }
        if (verifyPermission('files_delete') && onDelete) {
            newList.push({
                name: 'Excluir',
                icon: <IconTrash />,
                onClick: () => setModalDelete(true)
            })
        }
        setList([...newList])
    }, [role, item])

    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRename(true);
        await FilesService.set({
            ...item,
            name: rename,
        });
        item.name = rename;
        setEditableName(false)
        setLoadingRename(false);
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await FilesService.delete({ id: item.file_id });
        setLoadingDelete(false);
        setModalDelete(false)
        if (onDelete) onDelete('file', String(item.file_id));
    }

    return (
        <>
            <S.Container
                ref={ref}
                className='card-archive'
                draggable
                checked={checked}
                type={type}
                color={tenant?.colorhigh}
                colorBg={tenant?.colormain}
                colorText={tenant?.colorsecond}
                onDragStart={(e) => {
                    e.dataTransfer.setData('type', 'file');
                    e.dataTransfer.setData('id', String(item.file_id));
                    e.dataTransfer.setData('DTO', JSON.stringify(item));
                }}
            >
                <div className='thumbnail' onClick={() => onView()}>
                    <div className='preview' style={{
                        backgroundImage: `url(${item.thumbnail})`
                    }} />

                </div>
                {onChecked &&
                    <div className='item-checkbox'>
                        <InputCheckbox checked={checked ?? false} onChange={onChecked} />
                    </div>
                }
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
                <div className='infos' onClick={() => onView()}>
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
                description={"Você deseja realmente Excluir esse arquivo?"}
                type="danger"
                opened={modalDelete}
                onCancel={() => setModalDelete(false)}
                onConfirm={handleDelete}
                loading={loadingDelete}
            />
        </>
    )
}