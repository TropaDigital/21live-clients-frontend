import { useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { DashboardService } from '../../core/services/DashboardService';
import type { IDashBanner, IDashInfo, IDashPost } from '../../core/types/IDashboard';
import { IconAnnouncement, IconArchive, IconArchiveMultiple, IconChevronDown, IconFolder, IconPencil, IconRefresh, IconSolicitation } from '../../assets/icons';
import { Skeleton } from '../../components/UI/loading/skeleton/styles';
import { useTenant } from '../../core/contexts/TenantContext';
import type { IFolderFileItem } from '../../core/types/iFolder';
import { CardArchive } from '../../components/modules/cards/card-archive';
import { CardArchiveLoading } from '../../components/modules/cards/card-archive/card-loading';
import { ModalViewArchive } from '../../components/modules/modal-view-archive';
import { AvatarUser } from '../../components/UI/avatar/avatar-user';
import moment from 'moment';
import { ButtonDefault } from '../../components/UI/form/button-default';

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
                        <img src={banner.urlFullPath} alt={banner.title} />
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

    return (
        <S.ContainerPosts>
            <div className='box-dash'>
                <div className='head'>
                    <i>
                        <IconAnnouncement />
                    </i>
                    <p className='title-head'>Publicações</p>
                </div>
                <div className='overflow'>
                    {loading &&
                        <>
                            <Skeleton borderRadius='20px' width='100%' height='70px' />
                            <Skeleton borderRadius='20px' width='100%' height='70px' />
                            <Skeleton borderRadius='20px' width='100%' height='70px' />
                        </>
                    }
                    {data.map((item) =>
                        <div className='post'>
                            <AvatarUser fontSize={20} size={50} name={item.user?.name ?? 'Sistema'} image={item.user.avatar} />
                            <div className='info'>
                                <b className='name'>{item.user?.name ?? 'Sistema'}</b>
                                <p>{item.title}</p>
                                <span>{moment(item.created).format('DD/MM/YYYY HH:mm')}</span>
                            </div>
                            <div className='preview' style={{ backgroundImage: `url('https://dev.21live.com.br/public/img/placeholder.new.jpg')` }} />
                        </div>
                    )}
                    {!loading && data.length === 0 && <CardEmpty text='Nenhuma nova publicação.' onClick={getData} />}
                </div>
            </div>
        </S.ContainerPosts>
    )
}

const CardGraphs = () => {

    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        await DashboardService.getGraphs();
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div>Graphs - {loading ? 'load' : 'loaded'}</div>
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