import * as S from './styles'
import { TableDefault, TDViewByHead, type ITHead } from '../../components/UI/table/table-default'
import { useEffect, useState } from 'react'
import type { ITicket, ITicketStatus } from '../../core/types/ITckets'
import { TicketService } from '../../core/services/TicketService'
import { IconCheck, IconClone, IconEye, IconFilter, IconPencil, IconRefresh, IconSolicitation, IconTrash } from '../../assets/icons'
import { BadgeSimpleColor } from '../../components/UI/badge/badge-simple-color'
import { AvatarUser } from '../../components/UI/avatar/avatar-user'
import moment from 'moment'
import { BtnsActionTable } from '../../components/UI/table/btns-action'
import { useParams } from 'react-router-dom'
import { ModalViewTicket } from '../../components/modules/modal-view-ticket'
import { ButtonDefault } from '../../components/UI/form/button-default'
import { ModalEditTicket } from '../../components/modules/modal-edit-ticket'
import Confetti from 'react-confetti'
import { useTenant } from '../../core/contexts/TenantContext'
import { ModalConfirm } from '../../components/UI/modal/modal-confirm'
import { FILTER_DEFAULT, ModalFilterTicket, NAME_STORAGE_FILTER_TICKET, type IFilterTicket } from '../../components/modules/cards/modal-filter-ticket'
import { useAuth } from '../../core/contexts/AuthContext'
import { BulletStatus } from '../../components/modules/modal-view-ticket/styles'
import { SubmenuSelect } from '../../components/UI/submenu-select'

export default function Tickets() {

    const [thead, setThead] = useState<ITHead[]>([
        {
            "name": "Código",
            "value": "ticket_id",
            "width": 10,
            "order": true
        },
        {
            "name": "Formulário",
            "value": "ticket_cat_title",
            "order": true
        },
        {
            "name": "Titulo",
            "value": "title",
            "order": true
        },
        {
            "name": "Status",
            "value": "ticket_status_name",
            "order": true
        },
        {
            "name": "Unidade",
            "value": "organization_name",
            "order": true
        },
        {
            "name": "Solicitante",
            "value": "user_name",
            "order": true
        },
        {
            "name": "Data de Criação",
            "value": "created",
            "order": true
        },
        {
            "name": "Data de Entrega",
            "value": "finished",
            "order": true
        },
        {
            "name": "",
            "value": "",
            "width": 80
        }
    ])

    const TABLE_HEAD = [
        {
            "name": "Código",
            "value": "ticket_id",
            "width": 10,
            "order": true
        },
        {
            "name": "Formulário",
            "value": "ticket_cat_title",
            "order": true
        },
        {
            "name": "Titulo",
            "value": "title",
            "order": true
        },
        {
            "name": "Formato",
            "value": "media_name",
            "order": true
        },
        {
            "name": "Status",
            "value": "ticket_status_name",
            "order": true
        },
        {
            "name": "Unidade",
            "value": "organization_name",
            "order": true
        },
        {
            "name": "Solicitante",
            "value": "user_name",
            "order": true
        },
        {
            "name": "Data de Criação",
            "value": "created",
            "order": true
        },
        {
            "name": "Data de Entrega",
            "value": "finished",
            "order": true
        },
        {
            "name": "",
            "value": "",
            "width": 80
        }
    ]

    const { id } = useParams();

    const { tenant, ticketStatus, getTicketStatus } = useTenant();
    const { user, verifyPermission } = useAuth();

    const [newTicket, setNewTicket] = useState(false)

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ITicket[]>([])

    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('-created')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_show: 0,
    })

    const STORAGE_FILTER_SAVE = window.localStorage.getItem(NAME_STORAGE_FILTER_TICKET)

    const [modalTicket, setModalTicket] = useState(false);
    const [modalTicketItem, setModalTicketItem] = useState<ITicket | null>(null)

    const [loadingClone, setLoadingClone] = useState(false)
    const [DTOClone, setDTOClone] = useState<ITicket | null>(null)

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [DTODelete, setDTODelete] = useState<ITicket | null>(null)

    const [modalFilter, setModalFilter] = useState(false)
    const [DTOFilter, setDTOFilter] = useState<IFilterTicket>(STORAGE_FILTER_SAVE ? JSON.parse(STORAGE_FILTER_SAVE) : FILTER_DEFAULT)

    useEffect(() => {
        if (ticketStatus.length === 0) getTicketStatus();
    }, [ticketStatus])

    const getData = async (page: number, limit: number, search: string, order: string, filter: IFilterTicket) => {
        setLoading(true);
        const response = await TicketService.get({
            page: pagination.page,
            limit: pagination.limit,
            search,
            order,
            filter
        })
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order, DTOFilter);
    }, [pagination.page, pagination.limit, search, order, DTOFilter])

    const handleCloseModalTicket = () => {
        setModalTicket(false);
        setModalTicketItem(null);
    }

    const handleOpenModalTicket = (type: 'new' | 'edit', ticket?: ITicket) => {
        if (type === 'edit' && ticket) {
            setModalTicket(true);
            setModalTicketItem(ticket);
        } else {
            setModalTicket(true);
            setModalTicketItem(null);
        }
    }

    const handleOnSubmitTicket = (item: ITicket, type: 'edit' | 'new') => {
        if (type === 'new') {
            console.log('item', item, 'new')
            setData((prev) => ([item, ...prev]));
            setNewTicket(data.length === 1);
            setTimeout(() => {
                setNewTicket(false)
            }, 4000)
        } else {
            setData([
                ...data.map((row) => {
                    return row.ticket_id === item.ticket_id ? item : row
                })
            ])
        }
    }

    const handleClone = async () => {
        try {
            if (!DTOClone) return;

            setLoadingClone(true);
            const responseGet = await TicketService.getById(DTOClone.ticket_id);

            const responseSend = await TicketService.set({
                ticket_cat_id: DTOClone.ticket_cat_id,
                tenant_id: DTOClone.tenant_id,
                title: DTOClone.title + ' (Cópia)',
                organization_id: DTOClone.organization_id,
                user_id: user?.user_id,
                width: DTOClone.width,
                height: DTOClone.height,
                media_id: DTOClone.media_id,
                info: DTOClone.info,
                target: DTOClone.target,
                file_format: DTOClone.file_format,
                obs: DTOClone.obs
            })

            if (responseGet.item.fields && responseGet.item.fields.length > 0) {
                let payloadFields: any = []
                responseGet.item.fields.forEach((item: any) => {
                    payloadFields.push({
                        ticketcat_field_id: item.ticketcat_field_id,
                        value: item.value,
                    })
                })

                await TicketService.setFields(payloadFields, responseSend.item.ticket_id);
            }

            const response = await TicketService.get({
                page: pagination.page,
                limit: pagination.limit,
                search,
                order,
                filter: DTOFilter
            })
            setData([...response.items]);

            setLoadingClone(false);
            setDTOClone(null)

        } catch (error) {
            setLoadingClone(false);
        }
    }

    const handleSetFilter = (filter: IFilterTicket) => {
        setDTOFilter({ ...filter })
    }

    const handleDelete = async () => {
        if (!DTODelete?.ticket_id) return false;
        setLoadingDelete(true);
        await TicketService.delete(DTODelete?.ticket_id)

        setData([...data.filter((obj) => obj.ticket_id !== DTODelete.ticket_id)])

        setDTODelete(null)
        setLoadingDelete(false)

        const response = await TicketService.get({
            page: pagination.page,
            limit: pagination.limit,
            search,
            order,
            filter: DTOFilter
        })
        setData([...response.items]);
    }

    const countFilled = Object.values(DTOFilter)
        .filter((value) => value !== undefined && value !== 0 && value !== null && value !== '')
        .length;

    const handleChangeStatus = async (item: ITicket, status: ITicketStatus) => {

        item.ticket_status_color = status.color;
        item.ticket_status_name = status.name;
        item.ticket_status_id = status.ticket_status_id;

        console.log('item', item)

        setData([...data.map((row) => {
            return item.ticket_id === row.ticket_id ? item : row;
        })])

        await TicketService.set({
            ticket_status_id: status.ticket_status_id
        }, item.ticket_id)
    }

    return (
        <S.Container>

            {data.length === 1 && !loading &&
                <Confetti
                    numberOfPieces={newTicket ? 300 : 0}
                    run={true}
                    colors={[tenant?.colorhigh ?? '', tenant?.colormain ?? '']}
                />
            }

            <div className='header'>
                <h1>Solicitações</h1>
                <div className='right'>
                    <ButtonDefault total={countFilled} onClick={() => setModalFilter(true)} variant='light' flex={false} icon={<IconFilter />}>
                        Filtros
                    </ButtonDefault>
                    <ButtonDefault onClick={() => handleOpenModalTicket('new')} flex={false} icon={<IconSolicitation />}>
                        Nova Solicitação
                    </ButtonDefault>
                </div>
            </div>

            {!id &&
                <ModalFilterTicket
                    opened={modalFilter}
                    onClose={() => setModalFilter(false)}
                    DTOFilter={DTOFilter}
                    setDTOFilter={handleSetFilter}
                    pageStorage={NAME_STORAGE_FILTER_TICKET}
                />
            }

            {!id &&
                <ModalEditTicket
                    ticket={modalTicketItem ?? undefined}
                    opened={modalTicket}
                    onClose={handleCloseModalTicket}
                    onSubmit={handleOnSubmitTicket}
                />
            }

            <ModalViewTicket
                onUpdate={(name, value) => {
                    setData([...data.map((item) => {
                        if (item.ticket_id === Number(id)) {
                            if (name === 'status') {
                                item.ticket_status_name = value.name
                                item.ticket_status_color = value.color
                                item.ticket_status_id = value.ticket_status_id
                            }
                            if (name === 'notifications') {
                                item.notifications = value
                            }
                            if (name === 'awaiting_approval') {
                                item.awaiting_approval = value
                            }
                        }
                        return item;
                    })])
                }}
                id={id}
            />

            <ModalConfirm
                opened={DTOClone?.ticket_id ? true : false}
                title='Duplicar'
                description={`Deseja duplicar a solicitação ${DTOClone?.title}`}
                onCancel={() => setDTOClone(null)}
                onConfirm={handleClone}
                loading={loadingClone}
                type="info"
            />

            <ModalConfirm
                opened={DTODelete?.ticket_id ? true : false}
                title='Excluir'
                description={`Deseja Excluir a solicitação ${DTODelete?.title}`}
                onCancel={() => setDTODelete(null)}
                onConfirm={handleDelete}
                loading={loadingDelete}
                type="danger"
            />

            <div className='content-page'>

                <TableDefault
                    theadShow={thead}
                    setTheadShow={setThead}
                    thead={TABLE_HEAD}
                    onSearch={(value) => setSearch(value)}
                    onSort={(value) => setOrder(value)}
                    onPaginate={(page) => setPagination((prev) => ({ ...prev, page }))}
                    onLimit={(limit) => setPagination((prev) => ({ ...prev, limit }))}
                    download={'Solicitações'}
                    theadNameStorage="tickets"
                    getDataDownload={() => TicketService.get({
                        page: pagination.page,
                        limit: pagination.limit,
                        search,
                        order,
                        filter: DTOFilter
                    })}
                    order={order}
                    loading={loading}
                    pagination={pagination}
                    tbody={
                        <tbody>
                            {data.map((item) =>
                                <tr>
                                    <TDViewByHead path={verifyPermission('tickets_view') ? `/tickets/${item.ticket_id}` : undefined} thead={thead} nameTH={TABLE_HEAD[0].name}>
                                        <span className='td-id'>
                                            #{item.ticket_id}
                                        </span>
                                    </TDViewByHead>
                                    <TDViewByHead path={verifyPermission('tickets_view') ? `/tickets/${item.ticket_id}` : undefined} thead={thead} nameTH={TABLE_HEAD[1].name}>
                                        {item.ticket_cat_title}
                                    </TDViewByHead>
                                    <TDViewByHead path={verifyPermission('tickets_view') ? `/tickets/${item.ticket_id}` : undefined} thead={thead} nameTH={TABLE_HEAD[2].name}>
                                        {item.title}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[3].name}>
                                        {item.media_name}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[4].name}>
                                        {verifyPermission('tickets_edit') ?
                                            <div className='status-change'>
                                                <SubmenuSelect
                                                    whiteSpace='nowrap'
                                                    submenu={ticketStatus.map((status) => {
                                                        return {
                                                            name: status.name,
                                                            onClick: () => handleChangeStatus(item, status),
                                                            icon: status.ticket_status_id === item.ticket_status_id ?
                                                                <BulletStatus style={{ backgroundColor: status.color }}><IconCheck /></BulletStatus>
                                                                :
                                                                <BulletStatus style={{ backgroundColor: status.color }} />
                                                        }
                                                    })}>
                                                    <BadgeSimpleColor bg={item.ticket_status_color} name={item.ticket_status_name} color={'white'} />
                                                </SubmenuSelect>
                                                <i className='icon-refresh'>
                                                    <IconRefresh />
                                                </i>
                                            </div>
                                            :
                                            <BadgeSimpleColor bg={item.ticket_status_color} name={item.ticket_status_name} color={'white'} />
                                        }

                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[5].name}>
                                        {item.organization_name}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[6].name}>
                                        <div className='user'>
                                            <AvatarUser
                                                name={item.user_name}
                                                image={item.user_avatar}
                                            />
                                            <span>{item.user_name}</span>
                                        </div>
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[7].name}>
                                        {moment(item.created).format('DD/MM/YYYY MM:mm')}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[8].name}>
                                        {item.finished ? moment(item.finished).format('DD/MM/YYYY MM:mm') : '----'}
                                    </TDViewByHead>
                                    <td>
                                        <BtnsActionTable
                                            submenu={[
                                                {
                                                    name: 'Visualizar',
                                                    icon: <IconEye />,
                                                    path: `/tickets/${item.ticket_id}`,
                                                    permission: 'tickets_view',
                                                    total: item.notifications,
                                                },
                                                {
                                                    name: 'Editar',
                                                    icon: <IconPencil />,
                                                    onClick: () => handleOpenModalTicket('edit', item),
                                                    permission: 'tickets_edit',
                                                },
                                                {
                                                    name: 'Duplicar',
                                                    icon: <IconClone />,
                                                    onClick: () => setDTOClone(item),
                                                    permission: 'tickets_add',
                                                },
                                                {
                                                    name: 'Excluir',
                                                    icon: <IconTrash />,
                                                    onClick: () => setDTODelete(item),
                                                    permission: 'tickets_delete'
                                                }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    }
                />
            </div>
        </S.Container>
    )
}