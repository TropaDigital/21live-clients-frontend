import { useEffect, useRef, useState } from 'react';
import * as S from './styles'
import { ModalDefault } from '../../UI/modal/modal-default'
import type { ITicketDetail, ITicketFile, ITicketInteraction, ITicketStatus } from '../../../core/types/ITckets';
import { useRedirect } from '../../../core/hooks/useRedirect';
import { TabsDefault } from '../../UI/tabs-default';
import { TicketService } from '../../../core/services/TicketService';
import { AvatarUser } from '../../UI/avatar/avatar-user';
import { BadgeSimpleColor } from '../../UI/badge/badge-simple-color';
import moment from 'moment';
import { IconCheck, IconChevronDown, IconDislike, IconEye, IconEyeClose, IconFile, IconHome, IconImage, IconLike, IconPencil, IconRefresh, IconSolicitation, IconStatusWait, IconTextarea } from '../../../assets/icons';
import { ModalViewArchive } from '../modal-view-archive';
import { useTenant } from '../../../core/contexts/TenantContext';
import { InputSendTicket } from '../chat/ticket/input-send';
import { CommentTicket } from '../chat/ticket/comment';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Skeleton } from '../../UI/loading/skeleton/styles';
import { SubmenuSelect } from '../../UI/submenu-select';
import { CardOrganization } from '../cards/card-organization';
import { CardTicketApprove } from '../chat/ticket/card-ticket-approve';
import { ModalViewInteraction } from '../modal-view-interaction';
import { STATUS_TICKET_INTERACTION } from '../../../core/utils/status';
import { InputSendTicketApprove } from '../chat/ticket/input-send-approve';

interface IProps {
    id: string | undefined;
    onUpdate(name: string, value: any): void;
}

interface IPreviewFile {
    name: string;
    path: string;
}

interface ITicketInteractionGroup {
    job_service: string;
    approves: ITicketInteraction[];
    stats: IGlobalStats;
}

interface IGlobalStats {
    total: number;
    totalPass: number;
    totalFail: number;
    totalWait: number;
    percentagePass: number;
    percentageFail: number;
    percentageWait: number;
    totalFiles: number;
    totalTexts: number;
}

export const ModalViewTicket = ({ id, onUpdate }: IProps) => {

    const { tenant, getTicketStatus, ticketStatus } = useTenant();
    const { user, verifyPermission } = useAuth();
    const { redirectSlug } = useRedirect();

    const [opened, setOpened] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);

    const [loadingInteractions, setLoadingInteractions] = useState(true)

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ITicketDetail>({} as ITicketDetail);

    const [reply, setReply] = useState<ITicketInteraction | null>(null)

    const [dataInteractions, setDataInteractions] = useState<ITicketInteraction[]>([])
    const [dataFiles, setDataFiles] = useState<ITicketFile[]>([])
    const [dataInteractionsGroup, setDataInteractionsGroup] = useState<ITicketInteractionGroup[]>([])

    const [statsApprove, setStatsApprove] = useState<IGlobalStats>({} as IGlobalStats)
    const [statusApprove, setStatusApprove] = useState<string>("wait");
    const [serviceSelected, setServiceSelected] = useState("")

    const [previewFile, setPreviewFile] = useState<IPreviewFile | null>(null);
    const [previewApprove, setPreviewApprove] = useState<ITicketInteraction | null>(null)

    const TAB_NAME_INTERACTION = 'Mensagens';
    const TAB_NAME_APPROVE = 'Aprovações';

    const TABS = [TAB_NAME_INTERACTION, TAB_NAME_APPROVE]
    const [tabSelected, setTabSelected] = useState(TAB_NAME_INTERACTION)

    useEffect(() => {
        if (data?.app === 'jobs') {
            setTabSelected(TAB_NAME_APPROVE);
        } else {
            setTabSelected(TAB_NAME_INTERACTION)
        }
    }, [data])

    const TABS_INFOS = [
        {
            name: 'form',
            label: 'Solicitação',
            icon: <IconPencil />,
            visible: (data.fields?.length > 0 || data.media_id || loading) ? true : false
        },
        {
            name: 'organization',
            label: 'Unidade',
            icon: <IconHome />,
            visible: data.organization_id || loading ? true : false
        },
        {
            name: 'reference',
            label: 'Referências',
            icon: <IconImage />,
            visible: dataFiles.length > 0 || loading ? true : false
        },
        /*
        {
            name: 'materials',
            label: 'Materiais',
            icon: <IconListBullet />,
            visible: true,
        },
        {
            name: 'history',
            label: 'Historico',
            icon: <IconHistory />,
            visible: true,
        }
        */
    ]

    const [tabInfoSelected, setTabInfoSelected] = useState(TABS_INFOS[0].name)

    const STATUS_STATS = [
        {
            name: STATUS_TICKET_INTERACTION.wait.name,
            icon: <IconStatusWait />,
            status: 'wait',
            colors: STATUS_TICKET_INTERACTION.wait,
            stats: {
                total: statsApprove.totalWait,
                percent: statsApprove.percentageWait
            },
        },
        {
            name: STATUS_TICKET_INTERACTION.pass.name,
            icon: <IconLike />,
            status: 'pass',
            colors: STATUS_TICKET_INTERACTION.pass,
            stats: {
                total: statsApprove.totalPass,
                percent: statsApprove.percentagePass
            },
        },
        {
            name: STATUS_TICKET_INTERACTION.fail.name,
            icon: <IconDislike />,
            status: 'fail',
            colors: STATUS_TICKET_INTERACTION.fail,
            stats: {
                total: statsApprove.totalFail,
                percent: statsApprove.percentageFail
            },
        }
    ]

    useEffect(() => {
        const findTab = TABS_INFOS.filter((obj) => obj.visible === true);
        if (findTab.length) {
            setTabInfoSelected(TABS_INFOS.filter((obj) => obj.visible === true)[0].name)
        } else {
            setTabInfoSelected('')
        }
    }, [id, loading])

    useEffect(() => {
        if (ticketStatus.length === 0) { getTicketStatus(); }
    }, [ticketStatus])

    function groupByJobService(
        interactions: ITicketInteraction[],
        status: string
    ): ITicketInteractionGroup[] {
        const map = new Map<string, ITicketInteraction[]>();

        for (const item of interactions) {
            if (status && item.status !== status) continue;

            const jobService =
                item.task_file?.job_service || item.task_text?.job_service || "";

            if (!map.has(jobService)) {
                map.set(jobService, []);
            }
            map.get(jobService)!.push(item);
        }

        const groups: ITicketInteractionGroup[] = Array.from(map.entries()).map(
            ([job_service, approves]) => {
                const total = approves.length;
                const totalPass = approves.filter((a) => a.status === "pass").length;
                const totalFail = approves.filter((a) => a.status === "fail").length;
                const totalWait = approves.filter((a) => a.status === "wait").length;
                const totalFiles = approves.filter((a) => a.task_file).length;
                const totalTexts = approves.filter((a) => a.task_text).length;

                return {
                    job_service,
                    approves,
                    stats: {
                        total,
                        totalPass,
                        totalFail,
                        totalWait,
                        percentagePass: total
                            ? Number(((totalPass / total) * 100).toFixed(2))
                            : 0,
                        percentageFail: total
                            ? Number(((totalFail / total) * 100).toFixed(2))
                            : 0,
                        percentageWait: total
                            ? Number(((totalWait / total) * 100).toFixed(2))
                            : 0,
                        totalFiles,
                        totalTexts,
                    },
                };
            }
        );

        return groups.sort((a, b) =>
            a.job_service === "" ? -1 : b.job_service === "" ? 1 : 0
        );
    }

    function calculateGlobalStats(
        interactions: ITicketInteraction[]
    ): IGlobalStats {
        const filtered = status
            ? interactions.filter((a) => a.status === status)
            : interactions;

        const total = filtered.length;
        const totalPass = filtered.filter((a) => a.status === "pass").length;
        const totalFail = filtered.filter((a) => a.status === "fail").length;
        const totalWait = filtered.filter((a) => a.status === "wait").length;
        const totalFiles = filtered.filter((a) => a.task_file).length;
        const totalTexts = filtered.filter((a) => a.task_text).length;

        return {
            total,
            totalPass,
            totalFail,
            totalWait,
            percentagePass: total
                ? Number(((totalPass / total) * 100).toFixed(2))
                : 0,
            percentageFail: total
                ? Number(((totalFail / total) * 100).toFixed(2))
                : 0,
            percentageWait: total
                ? Number(((totalWait / total) * 100).toFixed(2))
                : 0,
            totalFiles,
            totalTexts,
        };
    }

    useEffect(() => {
        if (dataInteractions.length) {
            const interactionsFilter = dataInteractions.filter((obj: any) => obj.annex || obj.task_text)
            setDataInteractionsGroup([...groupByJobService(interactionsFilter, statusApprove)])
            setStatsApprove(calculateGlobalStats(interactionsFilter))
        } else {
            setDataInteractionsGroup([])
            setStatsApprove({
                percentageFail: 0,
                percentagePass: 0,
                percentageWait: 0,
                total: 0,
                totalFail: 0,
                totalFiles: 0,
                totalPass: 0,
                totalTexts: 0,
                totalWait: 0
            })
        }

    }, [dataInteractions, statusApprove])

    useEffect(() => {

    }, [statsApprove])

    useEffect(() => {
        if (!loading && !loadingInteractions) {
            onUpdate('notifications', dataInteractionsFilter.length)
            onUpdate('awaiting_approval', statsApprove.totalWait)
        }
    }, [loading, loadingInteractions, statsApprove])

    useEffect(() => {
        if (dataInteractionsGroup.length > 0) {
            setServiceSelected(dataInteractionsGroup[0].job_service)
        }
    }, [dataInteractionsGroup])

    const getData = async () => {
        setLoading(true);
        setLoadingInteractions(true);

        setDataInteractions([]);

        const response = await TicketService.getById(Number(id))
        setData({ ...response.item })
        setLoading(false);

        const responseFiles = await TicketService.getFiles(Number(id));
        setDataFiles([...responseFiles.items])

        const responseInteractions = await TicketService.getInteractions(Number(id))
        setDataInteractions([...responseInteractions.items])

        setLoadingInteractions(false);
    }

    useEffect(() => {
        setOpened(id ? true : false)
        if (id) getData();
    }, [id])

    const dataInteractionsFilter = dataInteractions;
    const dataApprovesFilter = dataInteractions.filter((obj) => obj.status && !obj.reply_id);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [dataInteractionsFilter, dataApprovesFilter, id]);

    const handleChangeStatus = async (status: ITicketStatus) => {
        const newData = {
            ...data,
            ticket_status: {
                ...data.ticket_status,
                name: status.name,
                color: status.color,
                ticket_status_id: status.ticket_status_id,
            }
        }
        setData({ ...newData })
        onUpdate('status', status)
        await TicketService.set({
            ticket_status_id: status.ticket_status_id
        }, data.ticket_id)
    }

    const handleVoteTicket = (item: ITicketInteraction, newItem: ITicketInteraction) => {

        const newData = dataInteractions.map((row) => {
            return row.ticket_interaction_id === item.ticket_interaction_id ? item : row
        })

        setDataInteractions([...newData, newItem]);
    }

    return (
        <ModalDefault
            padding='0px'
            paddingHeader='20px 40px 20px 40px'
            title={`#${id} ${loading ? '' : data?.title ?? ''}`}
            layout={"center"}
            onClose={() => redirectSlug(`/tickets`)}
            opened={opened}
            maxWidth='100%'
        >

            <ModalViewArchive opened={previewFile ? true : false} onClose={() => setPreviewFile(null)} item={{
                _pk: '',
                _table: '',
                aws: true,
                cmyk: true,
                created: '',
                customizable: false,
                dpi: 320,
                file_id: 0,
                folder_id: 0,
                name: previewFile?.name ?? '',
                path: previewFile?.path ?? '',
                publishable: false,
                social_caption: '',
                social_hashtags: '',
                tags: '',
                tenant_id: 0,
                thumb: previewFile?.path ?? '',
                thumbnail: previewFile?.path ?? '',
                updated: '',
                url_inline: previewFile?.path ?? '',
                url_path: previewFile?.path ?? '',
                user_id: 0,
            }} />

            <ModalViewInteraction
                opened={previewApprove?.ticket_interaction_id ? true : false}
                onClose={() => setPreviewApprove(null)}
                item={previewApprove ?? {} as ITicketInteraction}
                interactions={dataInteractions.filter((obj) => obj.reply_id === previewApprove?.ticket_interaction_id)}
                onSubmit={handleVoteTicket}
            />

            <S.Container color={tenant?.colorhigh ?? ''}>

                <div className='infos pd-right'>

                    <div className='item-text'>

                        {(data.ticket_cat || loading) &&
                            <div className='label'>
                                <b>Formulário:</b>
                                {loading ? <Skeleton width='120px' height='18px' /> :
                                    <span>{data.ticket_cat?.title}</span>
                                }
                            </div>
                        }

                        {(data.created || loading) &&
                            <div className='label'>
                                <b>Data de Criação:</b>
                                {loading ? <Skeleton width='100px' height='18px' /> :
                                    <span>{moment(data.created).format('DD/MM/YYYY HH:mm')}</span>
                                }
                            </div>
                        }

                        {((data.app === 'jobs' && data.deadline) || loading) &&
                            <div className='label'>
                                <b>Previsão de Entrega:</b>
                                {loading ? <Skeleton width='100px' height='18px' /> :
                                    <span>{data.deadline}</span>
                                }
                            </div>
                        }

                        {(data.ticket_status?.type === 'final' || loading) &&
                            <div className='label'>
                                <b>Data de Entrega:</b>
                                {loading ? <Skeleton width='100px' height='18px' /> :
                                    <span>{moment(data.finished).format('DD/MM/YYYY HH:mm')}</span>
                                }
                            </div>
                        }

                        {(data.updated || loading) &&
                            <div className='label'>
                                <b>Data de Atualização:</b>
                                {loading ? <Skeleton width='100px' height='18px' /> :
                                    <span>{moment(data.updated).format('DD/MM/YYYY HH:mm')}</span>
                                }
                            </div>
                        }

                        {(data.ticket_status?.type === 'final' || loading) &&
                            <div className='label'>
                                <b>Tempo Utilizado:</b>
                                {loading ? <Skeleton width='100px' height='18px' /> :
                                    <span>{data.workminutes} minuto{data.workminutes > 1 ? 's' : ''}</span>
                                }
                            </div>
                        }

                        {(data.ticket_status_id || loading) &&
                            <div className='label'>
                                <b>Status:</b>
                                {loading ? <Skeleton width='80px' height='18px' /> :
                                    <>
                                        {verifyPermission('tickets_edit') ?
                                            <div className='status-change'>
                                                <SubmenuSelect
                                                    whiteSpace='nowrap'
                                                    submenu={ticketStatus.map((item) => {
                                                        return {
                                                            name: item.name,
                                                            onClick: () => handleChangeStatus(item),
                                                            icon: item.ticket_status_id === data.ticket_status.ticket_status_id ?
                                                                <S.BulletStatus style={{ backgroundColor: item.color }}><IconCheck /></S.BulletStatus>
                                                                :
                                                                <S.BulletStatus style={{ backgroundColor: item.color }} />
                                                        }
                                                    })}>
                                                    <BadgeSimpleColor color='white' bg={data?.ticket_status?.color} name={data?.ticket_status?.name} />
                                                </SubmenuSelect>
                                                <i className='icon-refresh'>
                                                    <IconRefresh />
                                                </i>
                                            </div>
                                            :
                                            <BadgeSimpleColor color='white' bg={data?.ticket_status?.color} name={data?.ticket_status?.name} />
                                        }
                                    </>
                                }
                            </div>
                        }

                        {(data.user?.name || loading) &&
                            <div className='label'>
                                <b>Solicitante:</b>
                                {loading ? <Skeleton width='25px' height='25px' borderRadius='100px' /> :
                                    <AvatarUser
                                        name={data.user?.name}
                                        image={data.user?.avatar}
                                        size={25}
                                    />
                                }
                                {loading ? <Skeleton width='100px' height='18px' /> :
                                    <span>{data.user?.name}</span>
                                }

                            </div>
                        }
                    </div>

                    <div className='tabs-infos'>
                        {loading && [0, 1, 2, 3].map(() =>
                            <Skeleton height='32px' borderRadius='100px' width='100px' />
                        )}
                        {!loading && TABS_INFOS.filter((obj) => obj.visible === true).map((tab) =>
                            <button onClick={() => setTabInfoSelected(tab.name)} className={`${tab.name === tabInfoSelected ? 'selected' : 'normal'}`}>
                                <i>
                                    {tab.icon}
                                </i>
                                <span>
                                    {tab.label}
                                </span>
                            </button>
                        )}
                    </div>

                    {tabInfoSelected === 'form' &&
                        <div className='item-text'>

                            {(data?.media?.name || loading) &&
                                <div className='label'>
                                    <b>Formato da Peça:</b>
                                    {loading ? <Skeleton width='100px' height='18px' /> :
                                        <span>{data?.media.name}</span>
                                    }
                                </div>
                            }

                            {(data.width || loading) &&
                                <div className='label'>
                                    <b>Largura:</b>
                                    {loading ? <Skeleton width='30px' height='18px' /> :
                                        <span>{data?.width} <i>{data.media?.measure}</i></span>
                                    }
                                </div>
                            }
                            {(data.height || loading) &&
                                <div className='label'>
                                    <b>Altura:</b>
                                    {loading ? <Skeleton width='30px' height='18px' /> :
                                        <span>{data?.height} <i>{data.media?.measure}</i></span>
                                    }
                                </div>
                            }

                            {(data?.media?.name && data.width && data.height || loading) &&
                                <div className='line' />
                            }

                            {(data?.info || loading) &&
                                <div className='label column'>
                                    <b>Informações que devem estar na peça:</b>
                                    {loading ? <Skeleton width='100px' height='18px' /> :
                                        <TextMinius text={data?.info} />
                                    }
                                </div>
                            }

                            {(data?.target || loading) &&
                                <div className='label column'>
                                    <b>Objetivo a ser atingido com essa solicitação:</b>
                                    {loading ? <Skeleton width='150px' height='18px' /> :
                                        <span>{data?.target}</span>
                                    }
                                </div>
                            }

                            {(data?.obs || loading) &&
                                <div className='label column'>
                                    <b>Informações Extras e Observações:</b>
                                    {loading ? <Skeleton width='100px' height='18px' /> :
                                        <TextMinius text={data?.obs} />
                                    }
                                </div>
                            }

                            {(data?.file_format || loading) &&
                                <div className='label column'>
                                    <b>Formato de Arquivo:</b>
                                    {loading ? <Skeleton width='50px' height='18px' /> :
                                        <span>{data.file_format}</span>
                                    }
                                </div>
                            }

                            {(data?.fields?.length > 0 && !loading && (!data?.media?.name && !data.width && !data.height)) &&
                                <div className='line' />
                            }

                            {!loading && data?.fields?.map((field) =>
                                <div className='label column'>
                                    <b>{field.ticketcat_field_name}:</b>
                                    {loading ? <Skeleton width='140px' height='18px' /> :
                                        <TextMinius text={field.value} />
                                    }
                                </div>
                            )}
                        </div>
                    }

                    {tabInfoSelected === 'organization' &&
                        <div className='list-organizations'>
                            <CardOrganization
                                name={data.organization?.name}
                                created={data.organization?.created}
                                logo={data.organization?.logo}
                            />
                        </div>
                    }

                    {tabInfoSelected === 'reference' &&
                        <div className='list-references'>
                            {loading && [0, 1, 2, 3, 4, 5, 6].map(() => <Skeleton width='80px' height='80px' borderRadius='10px' />)}
                            {!loading && dataFiles.map((file, index) =>
                                <button onClick={() => setPreviewFile({ path: file.path, name: `Referência ${index + 1}` })} style={{ backgroundImage: `url(${file.thumbnail})` }}>
                                    <span>
                                        <IconEye />
                                    </span>
                                </button>
                            )}
                        </div>
                    }



                </div>

                <div className='center-row'>
                    <div className='interactions'>

                        <TabsDefault
                            className='tabs'
                            tabs={TABS}
                            selected={tabSelected}
                            onSelected={setTabSelected}
                            loading={loading}
                        />


                        {tabSelected === TAB_NAME_APPROVE &&
                            <div className='tab-approve'>

                                {!loadingInteractions &&
                                    <div className='status'>
                                        {STATUS_STATS.map((status) =>
                                            <div onClick={() => setStatusApprove(status.status)} className='item-status' style={{ backgroundColor: status.status === statusApprove ? status.colors.colorBadge : 'transparent', border: `1px solid ${status.colors.colorBadge}` }}>
                                                <div className='head-status'>
                                                    <i style={{ backgroundColor: status.colors.colorFull }}>
                                                        {status.icon}
                                                    </i>
                                                    <span>
                                                        {status.name}
                                                    </span>
                                                </div>
                                                <div className='stats-status' style={{ borderColor: status.colors.colorFull }}>
                                                    <p style={{ color: status.colors.colorFull }}>{status.stats.total}</p>
                                                    <span style={{ backgroundColor: status.colors.colorFull }}>{status.stats.percent}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }

                                {!loadingInteractions && dataInteractionsGroup.length > 0 &&
                                    <div className='percent-status'>
                                        {STATUS_STATS.map((status) =>
                                            <div style={{ width: `${status.stats.percent}%`, backgroundColor: status.colors.colorFull }} />
                                        )}
                                    </div>
                                }

                                {!loadingInteractions &&
                                    <div className='btn-new' style={{ marginTop: dataInteractionsGroup.length === 0 ? 20 : 0 }}>
                                        <InputSendTicketApprove
                                            id={Number(id)}
                                            onSubmit={(item) => {
                                                setDataInteractions((prev) => ([...prev, item]));
                                            }}
                                        />
                                    </div>
                                }

                                <div className='list-cards'>

                                    {!loadingInteractions && dataInteractionsGroup.length === 0 &&
                                        <div style={{ color: STATUS_TICKET_INTERACTION[statusApprove === 'pass' ? 'pass' : statusApprove === 'fail' ? 'fail' : 'wait'].colorFull, borderColor: STATUS_TICKET_INTERACTION[statusApprove === 'pass' ? 'pass' : statusApprove === 'fail' ? 'fail' : 'wait'].colorFull }} className='empty-interactions'>
                                            <i>
                                                <IconEyeClose />
                                            </i>
                                            <p>Nenhum arquivo encontrado em <b>{STATUS_TICKET_INTERACTION[statusApprove === 'pass' ? 'pass' : statusApprove === 'fail' ? 'fail' : 'wait'].name}</b>.</p>
                                        </div>
                                    }


                                    {loadingInteractions &&
                                        <div className='group-service opened'>
                                            <div className='items-group' style={{ paddingTop: 15 }}>
                                                {[0, 1, 2, 3, 4, 5].map(() =>
                                                    <CardTicketApprove
                                                        loading={true}
                                                        status={'wait'}
                                                        name={''}
                                                        avatar={''}
                                                        message={''}
                                                        thumbnail={''}
                                                        created={''}
                                                        interactions={[]}
                                                        onClick={() => undefined}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    }

                                    {!loadingInteractions && dataInteractionsGroup.map((group) =>

                                        <div onClick={() => setServiceSelected(group.job_service)} className={`group-service ${group.job_service === '' || group.job_service === serviceSelected ? 'opened' : 'closed'}`}>

                                            {group.job_service &&
                                                <div className='head-group'>
                                                    <div className='name'>
                                                        <i><IconChevronDown /></i>
                                                        <span>{group.job_service}</span>
                                                    </div>
                                                    <div className='totals'>
                                                        {group.stats.totalFiles > 0 &&
                                                            <div className='total' style={{ backgroundColor: STATUS_TICKET_INTERACTION[statusApprove === 'pass' ? 'pass' : statusApprove === 'fail' ? 'fail' : 'wait'].colorFull }}>
                                                                <IconFile />
                                                                <span>{group.stats.totalFiles}</span>
                                                            </div>
                                                        }

                                                        {group.stats.totalTexts > 0 &&
                                                            <div className='total' style={{ backgroundColor: STATUS_TICKET_INTERACTION[statusApprove === 'pass' ? 'pass' : statusApprove === 'fail' ? 'fail' : 'wait'].colorFull }}>
                                                                <IconTextarea />
                                                                <span>{group.stats.totalTexts}</span>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }

                                            <div className={`items-group`}>
                                                {group.approves.map((item) =>
                                                    <CardTicketApprove
                                                        key={`approve-${item.ticket_interaction_id}`}
                                                        status={item.status ?? 'wait'}
                                                        name={item.user_name}
                                                        avatar={item.user_avatar}
                                                        message={item.message}
                                                        thumbnail={item.thumbnail}
                                                        created={item.created}
                                                        interactions={dataInteractions.filter((obj) => obj.reply_id === item.ticket_interaction_id)}
                                                        onClick={() => setPreviewApprove({ ...item })}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                    )}
                                </div>

                            </div>
                        }

                        {tabSelected === TAB_NAME_INTERACTION &&

                            <div className='conversation'>
                                <div className='list-overflow' ref={listRef}>

                                    {!loadingInteractions && dataInteractionsFilter.length === 0 &&
                                        <div className='empty-interactions'>
                                            <i>
                                                <IconSolicitation />
                                            </i>
                                            <p>Nenhuma mensagem encontrada.</p>
                                        </div>
                                    }

                                    {loadingInteractions && [0, 1, 2, 3, 4, 5].map(() =>
                                        <CommentTicket
                                            loading={true}
                                            name=''
                                            status={null}
                                            message={''}
                                            thumbnail={''}
                                            created={''}
                                            position={'left'}
                                        />
                                    )}
                                    {!loadingInteractions && dataInteractionsFilter.map((item) =>
                                        <CommentTicket
                                            key={`interaction-${item.ticket_interaction_id}`}
                                            name={item.user_name}
                                            avatar={item.user_avatar}
                                            message={item.message}
                                            thumbnail={item.thumbnail}
                                            created={item.created}
                                            status={item.status ?? null}
                                            repply={dataInteractions.find((obj) => obj.ticket_interaction_id === item.reply_id)}
                                            position={user?.user_id === item.user_id ? 'right' : 'left'}
                                            onClick={(type) => {
                                                type === 'reply' ? setPreviewApprove({ ...dataInteractions.find((obj) => obj.ticket_interaction_id === item.reply_id) ?? {} as ITicketInteraction }) : type === 'aprove' ? setPreviewApprove({ ...item }) : setPreviewFile({ name: item.annex_title, path: item.annex });
                                            }}
                                            onReply={() => setReply(item)}
                                        />
                                    )}
                                </div>
                                {!loadingInteractions &&
                                    <div className='input-send' style={{ position: 'relative', zIndex: 8 }}>
                                        <InputSendTicket
                                            id={Number(id)}
                                            onExcluireply={() => setReply(null)}
                                            reply={reply}
                                            onSubmit={(item) => setDataInteractions((prev) => ([...prev, item]))}
                                        />
                                    </div>
                                }

                            </div>
                        }

                    </div>
                </div>
            </S.Container>
        </ModalDefault >
    )
}

const TextMinius = ({ text }: { text?: string | null | undefined }) => {

    const { tenant } = useTenant();

    const [minius, setMinius] = useState(true);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    const stripHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const onlyText = stripHtml(text ?? '');

    useEffect(() => {
        if (textRef.current) {
            const { scrollWidth, clientWidth } = textRef.current;
            setIsOverflowing(scrollWidth > clientWidth);
        }
    }, [onlyText, text, minius]);

    return (
        <S.ContainerTextMinius className={`text-minius ${minius ? 'minius' : 'completed'}`}>

            {minius ?
                <div className='render-text'>
                    <p ref={textRef}>{onlyText}</p>
                </div>
                :
                <div className='render-text' dangerouslySetInnerHTML={{ __html: text ?? '' }} />
            }

            {isOverflowing && (
                <button
                    style={{ color: tenant?.colormain }}
                    onClick={() => setMinius(!minius)}
                >
                    Mostrar {minius ? "tudo" : "menos"}
                </button>
            )}
        </S.ContainerTextMinius>
    )

}