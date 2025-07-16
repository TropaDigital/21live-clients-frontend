import { useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { DashboardService } from '../../core/services/DashboardService';
import type { IDashBanner, IDashboardInfo, IDashInfo, IDashPost, UnitStatusData } from '../../core/types/IDashboard';
import { IconAnnouncement, IconArchive, IconArchiveMultiple, IconChevronDown, IconDownload, IconFolder, IconPencil, IconProfile, IconRefresh, IconSolicitation, IconStar, IconStatus, IconUnits } from '../../assets/icons';
import { Skeleton } from '../../components/UI/loading/skeleton/styles';
import { useTenant } from '../../core/contexts/TenantContext';
import type { IFolderFileItem } from '../../core/types/iFolder';
import { CardArchive } from '../../components/modules/cards/card-archive';
import { CardArchiveLoading } from '../../components/modules/cards/card-archive/card-loading';
import { ModalViewArchive } from '../../components/modules/modal-view-archive';
import { AvatarUser } from '../../components/UI/avatar/avatar-user';
import moment from 'moment';
import { ButtonDefault } from '../../components/UI/form/button-default';
import { BarChart, PieChart } from '@mui/x-charts';
import { useAuth } from '../../core/contexts/AuthContext';
import { ModalDefault } from '../../components/UI/modal/modal-default';

export default function Home() {

    return (
        <S.Container>

            <CardBanner />
            <CardInfos />

            <div className='row'>
                <CardRecents />
                <CardPosts />
            </div>

            <CardGraphs />
        </S.Container>
    )
}

const CardBanner = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IDashBanner[]>([])
    const [item, setItem] = useState<number>(0)

    const getData = async () => {
        setLoading(true);
        const response = await DashboardService.getBanners();
        if (response.items) setData([...response.items])
        setLoading(false)
    }

    useEffect(() => {
        if (data.length) setItem(0)
    }, [data])

    useEffect(() => {
        getData();
    }, [])

    const handleOnPrev = () => {
        setItem((prev) => (prev === 0 ? data.length - 1 : prev - 1))
    }

    const handleOnNext = () => {
        setItem((prev) => (prev === data.length - 1 ? 0 : prev + 1))
    }

    const banner = data.length > 0 ? data[item] : {} as IDashBanner

    const LazyBlurImage = ({ src, alt }: { src: string, alt: string }) => {

        const [loaded, setLoaded] = useState(false);

        return (
            <S.StyledImage
                src={src}
                alt={alt}
                loaded={loaded}
                onLoad={() => setLoaded(true)}
                loading="lazy"
            />
        );
    };

    return loading || data.length > 0 ? (
        <S.ContainerBanners>
            {data.length > 1 &&
                <div className='controls'>
                    <button className='prev' onClick={handleOnPrev}><IconChevronDown /></button>
                    <button className='next' onClick={handleOnNext}><IconChevronDown /></button>
                </div>
            }
            <div className='image'>
                {loading &&
                    <Skeleton width='100%' height='30vh' />
                }
                {!loading && banner.urlFullPath &&
                    <a href={banner.fullLink} target='_blank'>
                        <LazyBlurImage src={banner.urlFullPath} alt={banner.title} />
                    </a>
                }
            </div>
        </S.ContainerBanners>
    ) : ''
}

const CardInfos = () => {

    const { tenant } = useTenant();
    const [data, setData] = useState<IDashInfo>({} as IDashInfo)
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        const response = await DashboardService.getInfo();
        setData({ ...response.data })
        setLoading(false)
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <S.ContainerInfo colorBg={tenant?.colormain} color={tenant?.colorhigh} colorText={tenant?.colorsecond}>
            <div className='card'>
                <i>
                    <IconArchive />
                </i>
                <div className='info'>
                    <p>Total de Peças Enviadas</p>

                    {loading ? <Skeleton width={'27px'} height='27px' /> : <b>{data.fileCount}</b>}
                </div>
            </div>

            <div className='card'>
                <i>
                    <IconPencil />
                </i>
                <div className='info'>
                    <p>Total de Peças Editaveis</p>
                    {loading ? <Skeleton width={'27px'} height='27px' /> : <b>{data.customCount}</b>}
                </div>
            </div>

            <div className='card'>
                <i>
                    <IconSolicitation />
                </i>
                <div className='info'>
                    <p>Total de Pedidos Solicitados</p>
                    {loading ? <Skeleton width={'27px'} height='27px' /> : <b>{data.ticketCount}</b>}
                </div>
            </div>

            {data.mostMedia?.name &&
                <div className='card'>
                    <i>
                        <IconRefresh />
                    </i>
                    <div className='info'>
                        <p>Tipo de pedido mais realizado</p>
                        {loading ? <Skeleton widthAuto={true} height='27px' /> : <b>{data.mostMedia?.name}</b>}
                    </div>
                </div>
            }
        </S.ContainerInfo>
    )
}

const CardRecents = () => {

    const { tenant } = useTenant();

    const [data, setData] = useState<IFolderFileItem[]>([])
    const [loading, setLoading] = useState(true);
    const [modalViewArchive, setModalViewArchive] = useState<IFolderFileItem>({} as IFolderFileItem);

    const refContainerCarrousel = useRef<HTMLDivElement>(null);
    const refCard = useRef<HTMLDivElement>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);

    const getData = async () => {
        setLoading(true);
        const response = await DashboardService.getRecents();
        if (response.data) setData([...response.data])
        setLoading(false)
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        if (!refContainerCarrousel.current || !refCard.current || !data) return;

        const containerWidth = refContainerCarrousel.current.offsetWidth;
        const cardWidth = refCard.current.offsetWidth;

        if (cardWidth === 0) return;

        const itemsPerPage = Math.floor(containerWidth / cardWidth);
        const totalPages = Math.ceil(data.length / itemsPerPage);

        setPageCount(totalPages);
    }, [data, refContainerCarrousel.current, refCard.current]);

    const goToPage = (pageIndex: number) => {
        if (!refContainerCarrousel.current || !refCard.current) return;

        const cardWidth = refCard.current.offsetWidth;
        const scrollX = pageIndex * cardWidth * Math.floor(refContainerCarrousel.current.offsetWidth / cardWidth);

        refContainerCarrousel.current.scrollTo({
            left: scrollX,
            behavior: 'smooth',
        });

        setCurrentPage(pageIndex);
    };

    return (

        <S.ContainerRecents colorBg={tenant?.colormain} color={tenant?.colorhigh} colorText={tenant?.colorsecond}>
            <div className='box-dash'>
                <div className='head'>
                    <i>
                        <IconArchiveMultiple />
                    </i>
                    <p className='title-head'>Novos Arquivos Disponíveis</p>
                </div>

                <ModalViewArchive
                    item={modalViewArchive}
                    opened={modalViewArchive.file_id ? true : false}
                    onClose={() => setModalViewArchive({} as IFolderFileItem)}
                />

                <div className='overflow' ref={refContainerCarrousel}>
                    {loading && <CardArchiveLoading type={'card'} quantity={10} />}
                    {!loading && data?.map((item) =>
                        <CardArchive
                            ref={refCard}
                            type={'card'}
                            key={`folder-archive-${item.file_id}`}
                            item={item}
                            onView={() => setModalViewArchive(item)}
                        />
                    )}

                    {!loading && data.length === 0 && <CardEmpty text='Nenhum novo arquivo.' onClick={getData} />}
                </div>

                {(data.length > 0 || loading) &&
                    <div className="bullets">
                        {Array.from({ length: pageCount }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className={currentPage === index ? 'active' : ''}
                            />
                        ))}
                    </div>
                }
            </div>
        </S.ContainerRecents>
    )
}

const CardPosts = () => {

    const [data, setData] = useState<IDashPost[]>([])
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        const response = await DashboardService.getPosts();
        if (response.items) setData([...response.items])
        setLoading(false)
    }

    useEffect(() => {
        getData();
    }, [])

    const [preview, setPreview] = useState<IDashPost>({} as IDashPost)

    return (
        <S.ContainerPosts>
            <div className='box-dash'>
                <div className='head'>
                    <i>
                        <IconAnnouncement />
                    </i>
                    <p className='title-head'>Publicações</p>
                </div>

                <ModalDefault padding='0px' layout='center' title={preview.title} opened={preview.message_id ? true : false} onClose={() => setPreview({} as IDashPost)}>
                    <div className='preview-post'>
                        <div className='head-preview-post'>
                            <img src={preview.thumb} />
                        </div>
                        <div className='msg' dangerouslySetInnerHTML={{ __html: preview.msg }} />
                    </div>
                </ModalDefault>

                <div className='overflow'>
                    {loading &&
                        <div className='post'>
                            <Skeleton width='50px' height='50px' borderRadius='100px' />
                            <div className='info'>
                                <div className='head-info'>
                                    <Skeleton widthAuto={true} height='18px' />
                                </div>
                                <Skeleton widthAuto={true} height='17px' />
                            </div>
                        </div>
                    }
                    {data.map((item) =>
                        <div className='post' onClick={() => setPreview(item)}>
                            <AvatarUser fontSize={20} size={50} name={item.user?.name ?? 'Sistema'} image={item.user.avatar} />
                            <div className='info'>
                                <div className='head-info'>
                                    <b className='name'>{item.user?.name ?? 'Sistema'}</b>
                                    <span>{moment(item.created).format('DD/MM/YYYY HH:mm')}</span>
                                </div>
                                <p>{item.title}</p>
                            </div>
                            <div className='preview' style={{ backgroundImage: `url(${item.thumb})` }} />
                        </div>
                    )}
                    {!loading && data.length === 0 && <CardEmpty text='Nenhuma nova publicação.' onClick={getData} />}
                </div>
            </div>
        </S.ContainerPosts>
    )
}

const CardGraphs = () => {

    const { verifyPermission } = useAuth();
    const { tenant } = useTenant();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IDashboardInfo>({} as IDashboardInfo)

    const getData = async () => {
        setLoading(true);
        const response = await DashboardService.getGraphs();
        setData({ ...response.data })
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [])

    const chartConvertData = (data: { labelName: string, labels: string[], values: number[] }) => {

        if (!data.labels) return { dataset: [], xAxis: [], series: [] };

        const datasetEntry: Record<string, any> = { label: data.labelName };
        data.labels.forEach((row, index) => {
            datasetEntry[row] = data.values[index];
        });
        const dataset = [datasetEntry];
        const xAxis = [{ dataKey: 'label' }];
        const series: any = data.labels.map((row) => ({
            dataKey: row,
            label: row,
        }));

        series[0].color = tenant?.colormain

        return { dataset, xAxis, series };
    };

    const convertUnitStatusToBarSeries = (data: UnitStatusData): {
        series: {
            data: number[];
            label: string;
            stack?: string;
            color?: string;
        }[];
        xAxis: { id: string; data: string[] }[];
    } => {
        if (!data?.labels || !data.datasets) return { series: [], xAxis: [] };

        const unitIds = Object.keys(data.labels);
        const unitNames = unitIds.map((id) => data.labels[id]);

        const series = Object.entries(data.datasets).map(([_, dataset]) => {
            const values = unitIds.map((unitId) => dataset.data[unitId] ?? 0);
            return {
                data: values,
                label: dataset.label,
                stack: 'Total',
                color: dataset.backgroundColor,
            };
        });

        return {
            series,
            xAxis: [
                {
                    id: 'axis1',
                    data: unitNames,
                },
            ],
        };
    };

    const chartUserAcces = chartConvertData({ labelName: 'Acessos', labels: data?.userAccess?.users, values: data?.userAccess?.values })
    const chartUnitActiveAll = chartConvertData({ labelName: 'Tickets Abertos', labels: data?.unitTickets?.units, values: data?.unitTickets?.values })
    const chartFileDownloads = chartConvertData({ labelName: 'Downloads', labels: data?.fileDownloads?.files, values: data?.fileDownloads?.values })
    const chartUsersDownloads = chartConvertData({ labelName: 'Downloads', labels: data?.userDownloads?.users, values: data?.userDownloads?.values })
    const chartUnitStatus = convertUnitStatusToBarSeries(data?.unitStatus);

    console.log('chartUnitStatus', chartUnitStatus)

    return (
        <S.ContainerGraphs>

            <div className='row'>

                {/* Usuarios mais ativos nos ultimos 15 dias */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || chartUserAcces.dataset.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconProfile />
                                    </i>
                                    <p className='title-head'>Usuários mais ativos nos últimos 15 dias</p>
                                </div>

                                <div className='chart-dash'>
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <BarChart
                                                dataset={chartUserAcces.dataset}
                                                xAxis={chartUserAcces.xAxis}
                                                series={chartUserAcces.series}
                                                height={300}
                                                borderRadius={15}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

                {/* Status Geral */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || data?.statusFreq?.status.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconStatus />
                                    </i>
                                    <p className='title-head'>Status Geral</p>
                                </div>

                                <div className='chart-dash'>
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <PieChart
                                                series={[
                                                    {
                                                        data: data?.statusFreq?.status.map((status, index) => {
                                                            return {
                                                                id: index,
                                                                value: data?.statusFreq?.values[index],
                                                                label: status,
                                                                color: data?.statusFreq?.colors[index]
                                                            }
                                                        }),
                                                        innerRadius: 30,
                                                        outerRadius: 100,
                                                        paddingAngle: 5,
                                                        cornerRadius: 10,
                                                        startAngle: -45,
                                                    },
                                                ]}
                                                width={280}
                                                height={280}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

                {/* Unidades mais ativas */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || chartUnitActiveAll.series.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconUnits />
                                    </i>
                                    <p className='title-head'>Unidades mais ativas</p>
                                </div>

                                <div className='chart-dash'>
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <BarChart
                                                dataset={chartUnitActiveAll.dataset.slice(0, 5)}
                                                xAxis={chartUnitActiveAll.xAxis.slice(0, 5)}
                                                series={chartUnitActiveAll.series.slice(0, 5)}
                                                height={300}
                                                borderRadius={15}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

                {/* Peças Mais Baixadas */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || chartFileDownloads.series.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconDownload />
                                    </i>
                                    <p className='title-head'>Peças Mais Baixadas</p>
                                </div>

                                <div className='chart-dash'>
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <BarChart
                                                dataset={chartFileDownloads.dataset}
                                                xAxis={chartFileDownloads.xAxis}
                                                series={chartFileDownloads.series}
                                                height={300}
                                                borderRadius={15}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

                {/* Downloads por Usuários nos últimos 15 dias */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || chartUsersDownloads.series.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconDownload />
                                    </i>
                                    <p className='title-head'>Downloads por Usuários nos últimos 15 dias</p>
                                </div>

                                <div className='chart-dash'>
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <BarChart
                                                dataset={chartUsersDownloads.dataset}
                                                xAxis={chartUsersDownloads.xAxis}
                                                series={chartUsersDownloads.series}
                                                height={300}
                                                borderRadius={15}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

                {/* Solicitações por Unidade nos últimos 15 dias */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || chartUnitActiveAll.series.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconSolicitation />
                                    </i>
                                    <p className='title-head'>Solicitações por Unidade nos últimos 15 dias</p>
                                </div>

                                <div className='chart-dash'>
                                    {!loading &&
                                        <span className='tag'>
                                            Total de Solicitações: <b>{data?.unitTickets?.total}</b>
                                        </span>
                                    }
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <BarChart
                                                dataset={chartUnitActiveAll.dataset}
                                                xAxis={chartUnitActiveAll.xAxis}
                                                series={chartUnitActiveAll.series}
                                                height={300}
                                                borderRadius={15}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

                {/* Status Geral das Unidades */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || chartUnitStatus.series.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconStatus />
                                    </i>
                                    <p className='title-head'>Status Geral das Unidades</p>
                                </div>

                                <div className='chart-dash'>
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <BarChart
                                                series={chartUnitStatus.series}
                                                xAxis={chartUnitStatus.xAxis}
                                                height={300}
                                                borderRadius={15}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

                {/* Formato mais Solicitado nos últimos 15 dias */}
                {verifyPermission('dashboard_admin') &&
                    <>
                        {(loading || data?.mediaTickets?.medias.length > 0) &&
                            <div className='box-dash'>
                                <div className='head'>
                                    <i>
                                        <IconStar />
                                    </i>
                                    <p className='title-head'>Formato mais Solicitado nos últimos 15 dias</p>
                                </div>

                                <div className='chart-dash'>
                                    {loading ? <Skeleton width='100%' height='300px' /> :
                                        <div className='chart-padding'>
                                            <PieChart
                                                series={[
                                                    {
                                                        data: data?.mediaTickets?.medias.map((row, index) => {
                                                            return {
                                                                id: index,
                                                                value: data?.mediaTickets?.values[index],
                                                                label: row,
                                                                color: index === 0 ? tenant?.colormain : undefined
                                                            }
                                                        }),
                                                        innerRadius: 30,
                                                        outerRadius: 100,
                                                        paddingAngle: 5,
                                                        cornerRadius: 10,
                                                        startAngle: -45,
                                                    },
                                                ]}
                                                width={280}
                                                height={280}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

            </div>

        </S.ContainerGraphs>
    )
}


const CardEmpty = ({ text, onClick }: { text: string, onClick(): void }) => {
    return (
        <S.ContainerEmpty>
            <i>
                <IconFolder />
            </i>
            <p>{text}</p>
            <div>
                <ButtonDefault variant='dark' onClick={onClick} icon={<IconRefresh />}>Recarregar</ButtonDefault>
            </div>
        </S.ContainerEmpty>
    )
}