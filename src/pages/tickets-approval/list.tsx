import * as S from './styles'
import { useEffect, useState } from 'react'
import type { ITicketApproval } from '../../core/types/ITckets'
import { TicketService } from '../../core/services/TicketService'
import { IconDislike, IconLike, IconSearch, IconStatus, IconStatusWait } from '../../assets/icons'
import { useParams } from 'react-router-dom'
import { ModalViewTicket } from '../../components/modules/modal-view-ticket'
import { useAuth } from '../../core/contexts/AuthContext'
import { CardTicketApproval } from '../../components/modules/cards/card-ticekt-approval'
import { STATUS_TICKET_INTERACTION } from '../../core/utils/status'
import { Skeleton } from '../../components/UI/loading/skeleton/styles'

export default function TicketsApproval() {

    const { id } = useParams();

    const { setUser, user } = useAuth();

    const [loadingPagination, setLoadingPagination] = useState(false);
    const [loading, setLoading] = useState(true);

    const [loadingStats, setLoadingStats] = useState(true);
    const [stats, setStats] = useState({
        wait: 0,
        pass: 0,
        fail: 0,
    })

    const [data, setData] = useState<ITicketApproval[]>([])

    const [search, setSearch] = useState('');
    const order = '-created'
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 30,
        total: 0,
        total_show: 0,
    })

    const getDataStatusApproval = async () => {
        setLoadingStats(true);
        const responseStatus = await TicketService.getApprovalStatus(search);
        setStats({ ...responseStatus.info })
        setLoadingStats(false);
    }

    const getData = async (page: number, limit: number, search: string, order: string) => {
        setLoading(true);
        getDataStatusApproval()
        const response = await TicketService.getApproval({
            page: pagination.page,
            limit: pagination.limit,
            order,
            search: search,
        })
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(1, pagination.limit, search, order);
    }, [pagination.limit, order])

    const onPaginate = async () => {
        if (loadingPagination || loading) return;
        if (pagination.page * pagination.limit >= pagination.total) return;
        setLoadingPagination(true);
        const newPage = pagination.page + 1;
        const response = await TicketService.getApproval({
            page: newPage,
            limit: pagination.limit,
            order,
            search
        })
        setPagination({ ...pagination, page: newPage, total_show: pagination.total_show + response.items.length })
        setData((prev) => [...prev, ...response.items]);
        setLoadingPagination(false);
    }

    useEffect(() => {
        const el = document.getElementById("overflow-page");
        if (!el) return;

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = el;
            const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // margem de 10px
            if (isBottom) {
                onPaginate();
            }
        };

        el.addEventListener("scroll", handleScroll);
        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, [onPaginate]);

    return (
        <S.Container>

            <div className='header'>
                <h1>Aprovações</h1>
            </div>

            <div className='sub-header'>
                <div className='stats'>
                    <div className='item'>
                        <div className='text'>
                            <span className='title'>Total</span>
                            {loadingStats ? <Skeleton height='30px' width='60px' /> :
                                <span className='value'>{stats.wait + stats.fail + stats.pass}</span>
                            }
                        </div>
                        <i>
                            <IconStatus />
                        </i>
                    </div>
                    <div className='item'>
                        <div className='text'>
                            <span className='title'>{STATUS_TICKET_INTERACTION.wait.name}</span>
                            {loadingStats ? <Skeleton height='30px' width='60px' /> :
                                <span style={{ color: STATUS_TICKET_INTERACTION.wait.colorText }} className='value'>{stats.wait}</span>
                            }
                        </div>
                        <i style={{ background: STATUS_TICKET_INTERACTION.wait.colorBadge, color: STATUS_TICKET_INTERACTION.wait.colorText }}>
                            <IconStatusWait />
                        </i>
                    </div>
                    <div className='item'>
                        <div className='text'>
                            <span className='title'>{STATUS_TICKET_INTERACTION.pass.name}</span>
                            {loadingStats ? <Skeleton height='30px' width='60px' /> :
                                <span style={{ color: STATUS_TICKET_INTERACTION.pass.colorText }} className='value'>{stats.pass}</span>
                            }
                        </div>
                        <i style={{ background: STATUS_TICKET_INTERACTION.pass.colorBadge, color: STATUS_TICKET_INTERACTION.pass.colorText }}>
                            <IconLike />
                        </i>
                    </div>
                    <div className='item'>
                        <div className='text'>
                            <span className='title'>{STATUS_TICKET_INTERACTION.fail.name}</span>
                            {loadingStats ? <Skeleton height='30px' width='60px' /> :
                                <span style={{ color: STATUS_TICKET_INTERACTION.fail.colorText }} className='value'>{stats.fail}</span>
                            }
                        </div>
                        <i style={{ background: STATUS_TICKET_INTERACTION.fail.colorBadge, color: STATUS_TICKET_INTERACTION.fail.colorText }}>
                            <IconDislike />
                        </i>
                    </div>
                </div>
                <form className='search' onSubmit={(e) => {
                    e.preventDefault();
                    getData(1, pagination.limit, search, order);
                }}>
                    <input onChange={(e) => setSearch(e.target.value)} placeholder='Buscar por código ou título' />
                    <button><IconSearch /></button>
                </form>
            </div>

            <ModalViewTicket
                onUpdate={(name, value) => {
                    setData([...data.map((item) => {
                        if (item.ticket_id === Number(id)) {
                            if (name === 'notifications') {
                                item.notifications = value;
                            }
                            if (name === 'awaiting_approval') {
                                if (user) {
                                    getDataStatusApproval();
                                    setUser({
                                        ...user, notifications: {
                                            ...user.notifications,
                                            approval: user.notifications.approval - item.awaiting_approval + Number(value)
                                        }
                                    })
                                }
                                item.awaiting_approval = value;
                            }
                        }
                        return item;
                    })])
                }}
                id={id}
            />

            <div className='content-page'>

                <div className='list-cards'>
                    {!loading && data.filter((obj) => obj.awaiting_approval > 0).map((item) =>
                        <CardTicketApproval item={item} />
                    )}
                    {(loading || loadingPagination) && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() =>
                        <CardTicketApproval item={null} loading={true} />
                    )}
                </div>

            </div>
        </S.Container>
    )
}