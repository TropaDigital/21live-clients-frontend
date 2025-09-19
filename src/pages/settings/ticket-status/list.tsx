import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//core hooks
import { useAuth } from '../../../core/contexts/AuthContext'
import { useRedirect } from '../../../core/hooks/useRedirect'

//services types
import { TicketService } from '../../../core/services/TicketService'
import type { ITicketStatus } from '../../../core/types/ITckets'

//components
import { TableDefault } from '../../../components/UI/table/table-default'
import { ButtonDefault } from '../../../components/UI/form/button-default'
import { type ISubmenuSelect } from '../../../components/UI/submenu-select'
import { ModalConfirm } from '../../../components/UI/modal/modal-confirm'
import { BtnsActionTable } from '../../../components/UI/table/btns-action'
import { FormTicketStatus } from '../../../components/modules/form-ticket-status'

//styles
import * as S from './styles'
import { IconPencil, IconPlus, IconStatus, IconTrash } from '../../../assets/icons'
import { BadgeSimpleColor } from '../../../components/UI/badge/badge-simple-color'

const CONFIG_PAGE_EDIT = {
    title: 'Status de Solicitações',
    name: 'Status de Solicitação',
    url: 'ticket-status',
    button_new: 'Novo Status',
    permission_add: 'ticket_status_add',
    permission_edit: 'ticket_status_edit',
    permission_remove: 'ticket_status_delete',
    icon_breadcrumb: <IconStatus />,
    FormEdit: FormTicketStatus,
}

export default function SettingsTicketsStatus({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { verifyPermission } = useAuth();
    const { id } = useParams();
    const { redirectSlug } = useRedirect();

    const TABLE_HEAD = [
        {
            name: 'Nome',
            value: 'name',
            order: true
        },
        {
            name: 'Cor',
            value: 'color',
        },
        {
            name: 'Tipo',
            value: 'type',
            order: true,
        },
        {
            name: '',
            value: '',
            width: 80,
        }
    ]

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ITicketStatus[]>([])

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
        const response = await TicketService.getStatus(pagination.page, pagination.limit, search, order)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order);
    }, [pagination.page, pagination.limit, search, order])

    const handleSaveEdit = (item: ITicketStatus) => {
        setData([...data.map((row) => {
            return row.ticket_status_id === item.ticket_status_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_status_id}`);
    }

    const handleSaveNew = () => {
        getData(pagination.page, pagination.limit, search, order);
        redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}`)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await TicketService.deleteStatus(Number(DTODelete));
        getData(pagination.page, pagination.limit, search, order);
        setDTODelete(null)
        setLoadingDelete(false);
    }

    return (
        <S.Container>

            {(id && id !== 'new') &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_status_id}`)}
                    id={Number(id)}
                />
            }

            {id === 'new' &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveNew}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_status_id}`)}
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
                        getDataDownload={() => TicketService.getCats(pagination.page, 99999999, search, order)}
                        order={order}
                        loading={loading}
                        pagination={pagination}
                        tbody={
                            <tbody>
                                {data.map((row, index) =>
                                    <RenderTD onDelete={setDTODelete} key={`td-row-${row.ticket_status_id}-${index}`} row={row} />
                                )}
                            </tbody>
                        }
                    />
                </div>
            }

        </S.Container>
    )
}

const RenderTD = ({ row, onDelete }: { row: ITicketStatus, onDelete(id: number): void }) => {

    const { redirectSlug } = useRedirect();

    const submenu: ISubmenuSelect[] = [
        {
            name: 'Editar',
            icon: <IconPencil />,
            onClick: () => redirectSlug(`settings/${CONFIG_PAGE_EDIT.url}/${row.ticket_status_id}`),
            permission: CONFIG_PAGE_EDIT.permission_edit,
        },
        {
            name: 'Excluir',
            icon: <IconTrash />,
            onClick: () => onDelete(row.ticket_status_id),
            permission: CONFIG_PAGE_EDIT.permission_remove
        }
    ]

    return (
        <tr key={`tr-${row.ticket_status_id}`}>
            <td>
                {row.name}
            </td>
            <td>
                <BadgeSimpleColor name={row.name} color='white' bg={row.color} />
            </td>
            <td>
                {row.type}
            </td>
            <td>
                {(row.ticket_status_id !== 7 && row.ticket_status_id !== 9 && row.ticket_status_id !== 1 && row.ticket_status_id !== 2 && row.ticket_status_id !== 3 && row.ticket_status_id !== 4) &&
                    <BtnsActionTable submenu={submenu} />
                }
            </td>
        </tr>
    )
}