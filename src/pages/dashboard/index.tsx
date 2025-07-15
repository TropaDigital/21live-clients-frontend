import { useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { DashboardService } from '../../core/services/DashboardService';
import type { IDashBanner, IDashInfo, IDashPost } from '../../core/types/IDashboard';
import { IconAnnouncement, IconArchive, IconArchiveMultiple, IconChevronDown, IconPencil, IconRefresh, IconSolicitation } from '../../assets/icons';
import { Skeleton } from '../../components/UI/loading/skeleton/styles';
import { useTenant } from '../../core/contexts/TenantContext';
import type { IFolderFileItem } from '../../core/types/iFolder';
import { CardArchive } from '../../components/modules/cards/card-archive';
import { CardArchiveLoading } from '../../components/modules/cards/card-archive/card-loading';
import { ModalViewArchive } from '../../components/modules/modal-view-archive';
import { AvatarUser } from '../../components/UI/avatar/avatar-user';
import moment from 'moment';

export default function Home() {

    return (
        <S.Container>

            <CardBanner />
            <CardInfos />

            <div className='row'>
                <CardRecents />
                <CardPosts />
            </div>
        </S.Container>
    )
}

const CardBanner = () => {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState<IDashBanner[]>([])

    const [item, setItem] = useState<number>(0)

    const getData = async () => {
        setLoading(true);
        //const response = await DashboardService.getBanners();
        setTimeout(() => {
            setData([{
                "banner_id": 8,
                "tenant_id": 2,
                "title": "Teste 1",
                "description": "",
                "link": "https://www.google.com",
                "path": "https://21live-275-mcdonald-s.s3.amazonaws.com/banners/191/20250602173512683e0b00c3405.jpg",
                "order": 0,
                "screens": null,
                "access": "public",
                "created": "2023-01-11 17:56:32",
                "updated": "2023-01-11 17:56:32"
            },
            {
                "banner_id": 9,
                "tenant_id": 2,
                "title": "Teste 2",
                "description": "",
                "link": "https://www.google.com",
                "path": "https://21live-304-21panda.s3.amazonaws.com/banners/248/20250715123323687674c34ffba.jpg",
                "order": 0,
                "screens": null,
                "access": "public",
                "created": "2023-01-11 17:56:32",
                "updated": "2023-01-11 17:56:32"
            }])
            setLoading(false);
        }, 1000)
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

    return (
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
                {!loading &&
                    <a href={banner.link} target='_blank'>
                        <img src={banner.path} alt={banner.title} />
                    </a>
                }
            </div>
        </S.ContainerBanners>
    )
}

const CardInfos = () => {

    const { tenant } = useTenant();
    const [data, setData] = useState<IDashInfo>({} as IDashInfo)
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        await DashboardService.getInfo();

        setTimeout(() => {
            setData({
                "fileCount": 31,
                "customCount": 9,
                "ticketCount": 56,
                "jobsCount": 0,
                "mostDownloaded": {
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                },
                "mostMedia": {
                    "media_id": 2,
                    "tenant_id": 2,
                    "media_cat_id": 2,
                    "name": "Post de Facebook",
                    "measure": "px",
                    "sizeable": false,
                    "value": 69.9,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32"
                }
            })
            setLoading(false);
        }, 2000)
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

            <div className='card'>
                <i>
                    <IconRefresh />
                </i>
                <div className='info'>
                    <p>Tipo de pedido mais realizado</p>
                    {loading ? <Skeleton widthAuto={true} height='27px' /> : <b>{data.mostMedia?.name}</b>}
                </div>
            </div>
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
        //const response = await DashboardService.getPosts();

        setTimeout(() => {
            setData([
                {
                    "url_inline": "",
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                },
                {
                    "url_inline": "",
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                },
                {
                    "url_inline": "",
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                },
                {
                    "url_inline": "",
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                },
                {
                    "url_inline": "",
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                },
                {
                    "url_inline": "",
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                },
                {
                    "url_inline": "",
                    "file_id": 209093,
                    "folder_id": 34426,
                    "user_id": 20109,
                    "tenant_id": 5,
                    "name": "S-Way - Folder Publicitário Digital",
                    "path": "2024081217471666ba74d4b29c0.pdf",
                    "thumb": "202501151810216788243d41a3a.jpg",
                    "tags": "material, folder",
                    "customizable": true,
                    "dpi": 300,
                    "cmyk": true,
                    "publishable": false,
                    "social_caption": null,
                    "social_hashtags": null,
                    "aws": true,
                    "created": "2023-01-11 17:56:32",
                    "updated": "2023-01-11 17:56:32",
                    "_table": "file",
                    "_pk": "file_id",
                    "url_path": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.pdf",
                    "thumbnail": "https://21live-5-brooks.s3.amazonaws.com/files/34426/2024081217471666ba74d4b29c0.thumb.jpg"
                }
            ])
            setLoading(false);
        }, 3000)
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
                </div>

                <div className="bullets">
                    {Array.from({ length: pageCount }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={currentPage === index ? 'active' : ''}
                        />
                    ))}
                </div>
            </div>
        </S.ContainerRecents>
    )
}

const CardPosts = () => {

    const [data, setData] = useState<IDashPost[]>([])
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        //const response = await DashboardService.getRecents();

        setTimeout(() => {
            setData([
                {
                    "avatar": 'https://21live-304-21panda.s3.amazonaws.com/users/25993/0b69481425331ba1c974.jpeg',
                    "name": 'Vitor Deco',
                    "message_id": 15,
                    "tenant_id": 2,
                    "user_id": 1,
                    "title": "Teste de Post Público",
                    "msg": "<p>Vamos ver com imagem</p>\r\n",
                    "type": "post",
                    "access": "public",
                    "path": "20210430174158608c6b96178fb.jpg",
                    "created": "2025-05-16 10:54:14",
                    "updated": "2025-05-16 10:54:14"
                },
                {
                    "avatar": '',
                    "name": 'Kaique Steck',
                    "message_id": 15,
                    "tenant_id": 2,
                    "user_id": 1,
                    "title": "Teste de Post Público com um titulo maior para ver como fica",
                    "msg": "<p>Vamos ver com imagem</p>\r\n",
                    "type": "post",
                    "access": "public",
                    "path": "20210430174158608c6b96178fb.jpg",
                    "created": "2025-05-16 10:54:14",
                    "updated": "2025-05-16 10:54:14"
                },
                {
                    "avatar": 'https://21live-304-21panda.s3.amazonaws.com/users/25993/0b69481425331ba1c974.jpeg',
                    "name": 'Vitor Deco',
                    "message_id": 15,
                    "tenant_id": 2,
                    "user_id": 1,
                    "title": "Teste de Post Público",
                    "msg": "<p>Vamos ver com imagem</p>\r\n",
                    "type": "post",
                    "access": "public",
                    "path": "20210430174158608c6b96178fb.jpg",
                    "created": "2025-05-16 10:54:14",
                    "updated": "2025-05-16 10:54:14"
                },
                {
                    "avatar": '',
                    "name": 'Kaique Steck',
                    "message_id": 15,
                    "tenant_id": 2,
                    "user_id": 1,
                    "title": "Teste de Post Público com um titulo maior para ver como fica",
                    "msg": "<p>Vamos ver com imagem</p>\r\n",
                    "type": "post",
                    "access": "public",
                    "path": "20210430174158608c6b96178fb.jpg",
                    "created": "2025-05-16 10:54:14",
                    "updated": "2025-05-16 10:54:14"
                },
                {
                    "avatar": 'https://21live-304-21panda.s3.amazonaws.com/users/25993/0b69481425331ba1c974.jpeg',
                    "name": 'Vitor Deco',
                    "message_id": 15,
                    "tenant_id": 2,
                    "user_id": 1,
                    "title": "Teste de Post Público",
                    "msg": "<p>Vamos ver com imagem</p>\r\n",
                    "type": "post",
                    "access": "public",
                    "path": "20210430174158608c6b96178fb.jpg",
                    "created": "2025-05-16 10:54:14",
                    "updated": "2025-05-16 10:54:14"
                },
                {
                    "avatar": '',
                    "name": 'Kaique Steck',
                    "message_id": 15,
                    "tenant_id": 2,
                    "user_id": 1,
                    "title": "Teste de Post Público com um titulo maior para ver como fica",
                    "msg": "<p>Vamos ver com imagem</p>\r\n",
                    "type": "post",
                    "access": "public",
                    "path": "20210430174158608c6b96178fb.jpg",
                    "created": "2025-05-16 10:54:14",
                    "updated": "2025-05-16 10:54:14"
                }
            ])
            setLoading(false);
        }, 4000
        )
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
                            <AvatarUser fontSize={20} size={50} name={item.name} image={item.avatar} />
                            <div className='info'>
                                <b className='name'>{item.name}</b>
                                <p>{item.title}</p>
                                <span>{moment(item.created).format('DD/MM/YYYY HH:mm')}</span>
                            </div>
                            <div className='preview' style={{ backgroundImage: `url('https://dev.21live.com.br/public/img/placeholder.new.jpg')` }} />
                        </div>
                    )}
                </div>
            </div>
        </S.ContainerPosts>
    )
}

/*
const CardGraphs = () => {

    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        const response = await DashboardService.getGraphs();
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div>Graphs - {loading ? 'load' : 'loaded'}</div>
    )
}
    */