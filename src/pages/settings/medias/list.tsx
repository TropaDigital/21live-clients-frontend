import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//core hooks
import { useAuth } from '../../../core/contexts/AuthContext'
import { useRedirect } from '../../../core/hooks/useRedirect'

//services types
import { MediaService } from '../../../core/services/MediaService'
import type { IMedia } from '../../../core/types/IMedia'

//components
import { TableDefault } from '../../../components/UI/table/table-default'
import { ButtonDefault } from '../../../components/UI/form/button-default'
import { type ISubmenuSelect } from '../../../components/UI/submenu-select'
import { ModalConfirm } from '../../../components/UI/modal/modal-confirm'
import { BtnsActionTable } from '../../../components/UI/table/btns-action'
import { FormMedia } from '../../../components/modules/form-media'

//styles
import * as S from './styles'
import { IconImage, IconPencil, IconPlus, IconTrash } from '../../../assets/icons'
import { getMeasure } from '../../../core/utils/replaces'

const CONFIG_PAGE_EDIT = {
    title: 'Formatos de Peça',
    name: 'Formato de Peça',
    url: 'medias',
    button_new: 'Novo Formato',
    permission_add: 'medias_add',
    permission_edit: 'medias_edit',
    permission_remove: 'medias_delete',
    icon_breadcrumb: <IconImage />,
    FormEdit: FormMedia,
}

export default function SettingsMedias({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { verifyPermission } = useAuth();
    const { id } = useParams();
    const { redirectSlug } = useRedirect();

    const TABLE_HEAD = [
        {
            name: 'ID',
            value: 'media_id',
            width: 10,
        },
        {
            name: 'Nome',
            value: 'name',
            order: true
        },
        {
            name: 'Categoria',
            value: 'media_cat_title',
            order: true
        },
        {
            name: 'Unidade de Medida',
            value: 'measure',
            order: true
        },
        {
            name: '',
            value: '',
            width: 80,
        }
    ]

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IMedia[]>([])

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [DTODelete, setDTODelete] = useState<number | null>(null)

    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('-name')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_show: 0,
    })

    const getData = async (page: number, limit: number, search: string, order: string) => {
        setLoading(true);
        const response = await MediaService.get(pagination.page, pagination.limit, search, order)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order);
    }, [pagination.page, pagination.limit, search, order])

    const handleSaveEdit = (item: IMedia) => {
        setData([...data.map((row) => {
            return row.media_id === item.media_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.media_id}`);
    }

    const handleSaveNew = () => {
        getData(pagination.page, pagination.limit, search, order);
        redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}`)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await MediaService.delete(Number(DTODelete));
        getData(pagination.page, pagination.limit, search, order);
        setDTODelete(null)
        setLoadingDelete(false);
    }

    return (
        <S.Container>

            {(id && id !== 'new') &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.media_id}`)}
                    id={Number(id)}
                />
            }

            {id === 'new' &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveNew}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.media_id}`)}
                    id={null}
                />
            }

            {!id &&
                <div className='list'>
                    <div className='head-setting'>
                        <h1>{CONFIG_PAGE_EDIT.title}</h1>
                        <div className='buttons'>
                            {verifyPermission(CONFIG_PAGE_EDIT.permission_add) &&
                                <ButtonDefault onClick={() => redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}/new`)} icon={<IconPlus />}>{CONFIG_PAGE_EDIT.button_new}</ButtonDefault>
                            }
                        </div>
                    </div>
                    <ModalConfirm
                        title="Atenção"
                        description={`Você deseja realmente arquivar ${CONFIG_PAGE_EDIT.name}?`}
                        type="danger"
                        opened={DTODelete ? true : false}
                        onCancel={() => setDTODelete(null)}
                        onConfirm={handleDelete}
                        loading={loadingDelete}
                    />
                    <TableDefault
                        thead={TABLE_HEAD}
                        onSearch={(value) => setSearch(value)}
                        onSort={(value) => setOrder(value)}
                        onPaginate={(page) => setPagination((prev) => ({ ...prev, page }))}
                        onLimit={(limit) => setPagination((prev) => ({ ...prev, limit }))}
                        download={CONFIG_PAGE_EDIT.name}
                        getDataDownload={() => MediaService.getCats(pagination.page, 99999999, search, order)}
                        order={order}
                        loading={loading}
                        pagination={pagination}
                        tbody={
                            <tbody>
                                {data.map((row, index) =>
                                    <RenderTD onDelete={setDTODelete} key={`td-row-${row.media_id}-${index}`} row={row} />
                                )}
                            </tbody>
                        }
                    />
                </div>
            }

        </S.Container>
    )
}

const RenderTD = ({ row, onDelete }: { row: IMedia, onDelete(id: number): void }) => {

    const { redirectSlug } = useRedirect();

    const submenu: ISubmenuSelect[] = [
        {
            name: 'Editar',
            icon: <IconPencil />,
            onClick: () => redirectSlug(`settings/${CONFIG_PAGE_EDIT.url}/${row.media_id}`),
            permission: CONFIG_PAGE_EDIT.permission_edit,
        },
        {
            name: 'Excluir',
            icon: <IconTrash />,
            onClick: () => onDelete(row.media_id),
            permission: CONFIG_PAGE_EDIT.permission_remove
        }
    ]

    return (
        <tr key={`tr-${row.media_id}`}>
            <td>
                <span className='td-id'>
                    #{row.media_id}
                </span>
            </td>
            <td>
                {row.name}
            </td>
            <td>
                {row.media_cat_title}
            </td>
            <td>
                {getMeasure(row.measure)} ({row.measure})
            </td>
            <td>
                {row.media_id !== 1 && row.media_id !== 2 &&
                    <BtnsActionTable submenu={submenu} />
                }
            </td>
        </tr>
    )
}