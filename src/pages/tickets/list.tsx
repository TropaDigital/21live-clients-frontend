import { BreadCrumbAuthLayout } from '../../components/layouts/auth/breadcrumb'
import * as S from './styles'
import { TableDefault, TDViewByHead, type ITHead } from '../../components/UI/table/table-default'
import { useEffect, useState } from 'react'
import type { ITicket } from '../../core/types/ITckets'
import { TicketService } from '../../core/services/TicketService'
import { IconEye, IconSolicitation } from '../../assets/icons'
import { BadgeSimpleColor } from '../../components/UI/badge/badge-simple-color'
import { AvatarUser } from '../../components/UI/avatar/avatar-user'
import moment from 'moment'
import { BtnsActionTable } from '../../components/UI/table/btns-action'
import { Toolbar } from '../../components/layouts/auth/toolbar'
import { useParams } from 'react-router-dom'
import { ModalViewTicket } from '../../components/modules/modal-view-ticket'

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
            "name": "Formato da Peça",
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
            "name": "Formato da Peça",
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

    const getData = async (page: number, limit: number, search: string, order: string) => {
        setLoading(true);
        const response = await TicketService.get(pagination.page, pagination.limit, search, order)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order);
    }, [pagination.page, pagination.limit, search, order])

    return (
        <S.Container>
            <BreadCrumbAuthLayout
                data={[
                    {
                        name: 'Solicitações',
                        icon: <IconSolicitation />,
                        here: true,
                        redirect: `/tickets`
                    }
                ]}
            />
            <Toolbar>
                aqui pod entrar configs
            </Toolbar>

            <ModalViewTicket id={id} />

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
                    getDataDownload={() => TicketService.get(pagination.page, 99999999, search, order)}
                    order={order}
                    loading={loading}
                    pagination={pagination}
                    tbody={
                        <tbody>
                            {data.map((item) =>
                                <tr>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[0].name}>
                                        <span className='td-id'>
                                            #{item.ticket_id}
                                        </span>
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[1].name}>
                                        {item.ticket_cat_title}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[2].name}>
                                        {item.title}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[3].name}>
                                        {item.media_name}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[4].name}>
                                        <BadgeSimpleColor bg={item.ticket_status_color} name={item.ticket_status_name} color={'white'} />
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[5].name}>
                                        {item.organization_name}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[5].name}>
                                        <div className='user'>
                                            <AvatarUser
                                                name={item.user_name}
                                                image={item.user_avatar}
                                            />
                                            <span>{item.user_name}</span>
                                        </div>
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[6].name}>
                                        {moment(item.created).format('DD/MM/YYYY MM:mm')}
                                    </TDViewByHead>
                                    <TDViewByHead thead={thead} nameTH={TABLE_HEAD[7].name}>
                                        {item.finished ? moment(item.finished).format('DD/MM/YYYY MM:mm') : '----'}
                                    </TDViewByHead>
                                    <td>
                                        <BtnsActionTable
                                            submenu={[
                                                {
                                                    name: 'Visualizar',
                                                    icon: <IconEye />,
                                                    path: `/tickets/${item.ticket_id}`,
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