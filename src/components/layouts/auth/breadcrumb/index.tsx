import { useEffect, useState, type ReactNode } from 'react'
import * as S from './styles'
import { useRedirect } from '../../../../core/hooks/useRedirect';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { FoldersService } from '../../../../core/services/FoldersService';
import { FilesService } from '../../../../core/services/FilesService';
import { VideoService } from '../../../../core/services/VideoService';
import { LinkService } from '../../../../core/services/LinkService';
import { useTenant } from '../../../../core/contexts/TenantContext';
import { useParams } from 'react-router-dom';

export interface IPropsBreadcrumb {
    folder_id?: number;
    icon?: ReactNode;
    name: string;
    redirect?: string;
    here?: boolean
}

export const BreadCrumbAuthLayout = ({ data, onDelete }: {
    data: IPropsBreadcrumb[];
    onDelete?(type: string, id: number | string): void;
}) => {

    const { id: IDParam } = useParams();
    const { verifyPermission } = useAuth();
    const { redirectSlug } = useRedirect();

    const [items, setItems] = useState<IPropsBreadcrumb[]>([])

    useEffect(() => {
        setItems([...data])
    }, [data])

    const handleRedirect = (redirect: string, key: number) => {
        const newItems: IPropsBreadcrumb[] = [];

        items.map((item, index) => {
            if (index <= key) newItems.push(item)
        })
        setItems([...newItems])
        redirectSlug(redirect ?? '');
    }

    const [isOver, setIsOver] = useState<number | null>(0);

    const { tenant } = useTenant();

    const handleMove = async (type: string, id: string, folderId: number, DTO: any) => {

        if (type === 'folder' && String(IDParam) === String(folderId)) return;
        if (!onDelete) return;


        const folderIdParent = folderId === 0 ? null : Number(folderId)

        if (DTO) DTO = JSON.parse(DTO)

        switch (type) {
            case 'folder':
                FoldersService.update({
                    folder_id: Number(id),
                    parent_id: folderIdParent,
                    tenant_id: tenant?.tenant_id ?? 0,
                    name: DTO.name,
                    icon: DTO.icon
                })
                onDelete('folder', id);
                break;
            case 'file':
                // moverArquivo(fileId, novaPasta)
                FilesService.set({
                    file_id: Number(id),
                    folder_id: folderIdParent,
                    tenant_id: tenant?.tenant_id ?? 0,
                    name: DTO.name,
                })
                onDelete('file', id);
                break;
            case 'video':
                VideoService.set({
                    video_id: Number(id),
                    folder_id: folderIdParent,
                    tenant_id: tenant?.tenant_id ?? 0,
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
                    folder_id: folderIdParent,
                })
                onDelete('link', id);
                break;
        }

    }

    return (
        <S.Container className='breadcrumb'>
            <div className='overflow'>
                {items.map((item, key) =>
                    <li
                        className={`${item.here ? 'active' : 'normal'} ${isOver === item.folder_id ? 'over' : 'nonover'}`}
                        key={`${key}-${item.name}`}
                        onDrop={(e) => {
                            const type = e.dataTransfer.getData('type');
                            const id = e.dataTransfer.getData('id');
                            const DTO = e.dataTransfer.getData('DTO');
                            const folderId = Number(item.folder_id);
                            setIsOver(0);
                            verifyPermission('folders_edit') && handleMove(type, id, folderId, DTO);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            verifyPermission('folders_edit') && setIsOver(item.folder_id === null ? null : Number(item.folder_id));
                        }}
                        onDragLeave={() => {
                            verifyPermission('folders_edit') && setIsOver(0);
                        }}
                    >
                        {key > 0 && <span className='division'>/</span>}
                        <a onClick={() => handleRedirect(item.redirect ?? '', key)}>
                            {item.icon &&
                                <i>
                                    {item.icon}
                                </i>
                            }
                            <span>{item.name}</span>
                        </a>
                    </li>
                )}
            </div>
        </S.Container>
    )
}