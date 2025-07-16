import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { BreadCrumbAuthLayout, type IPropsBreadcrumb } from '../../components/layouts/auth/breadcrumb';
import { Toolbar } from '../../components/layouts/auth/toolbar';
import { ButtonDefault } from '../../components/UI/form/button-default';
import { SelectDefault } from '../../components/UI/form/select-default';
import { SubmenuSelect, type ISubmenuSelect } from '../../components/UI/submenu-select';
import { FoldersService } from '../../core/services/FoldersService';

import { IconArchive, IconArchiveMultiple, IconCheckboxOff, IconCheckboxOn, IconChevronDown, IconDownload, IconFolder, IconFolderUpload, IconFolderVideo, IconHome, IconLink, IconLoading, IconPlus, IconSort, IconTrash, IconVideo, IconViewCard, IconViewList } from '../../assets/icons';
import * as S from './styles';
import type { IFolder, IFolderBreadcrumb, IFolderFileItem, IFolderItem, IFolderLink, IFolderVideo } from '../../core/types/iFolder';
import { CardFolder } from '../../components/modules/cards/card-folder';
import { CardFolderLoading } from '../../components/modules/cards/card-folder/card-loading';
import { CardLink } from '../../components/modules/cards/card-link';
import { CardLinkLoading } from '../../components/modules/cards/card-link/card-loading';
import { CardVideo } from '../../components/modules/cards/card-video';
import { CardVideoLoading } from '../../components/modules/cards/card-video/card-loading';
import { CardArchiveLoading } from '../../components/modules/cards/card-archive/card-loading';
import { CardArchive } from '../../components/modules/cards/card-archive';
import { CardNewFolder } from '../../components/modules/cards/card-folder/new';
import { Skeleton } from '../../components/UI/loading/skeleton/styles';
import { useRedirect } from '../../core/hooks/useRedirect';
import { ModalViewArchive } from '../../components/modules/modal-view-archive';
import { ModalViewVideo } from '../../components/modules/modal-view-video';
import { ModalEditFolder } from '../../components/modules/modal-edit-folder';
import { ModalEditVideo } from '../../components/modules/modal-edit-video';
import { ModalEditLink } from '../../components/modules/modal-edit-link';
import { ModalEditArchive } from '../../components/modules/modal-edit-archive';
import { ModalUploadFolder } from '../../components/modules/modal-upload-folder';
import { ModalUploadArchives } from '../../components/modules/modal-upload-archives';
import { FilesService } from '../../core/services/FilesService';
import { downloadZipFromUrls, type IFileItemDownload } from '../../core/utils/download';
import { useAuth } from '../../core/contexts/AuthContext';
import { ModalMoveArchive } from '../../components/modules/modal-move-archive';
import { useTenant } from '../../core/contexts/TenantContext';


interface IPropsModalArchive extends IFolderFileItem {
    opened: boolean
}
interface IPropsModalVideo extends IFolderVideo {
    opened: boolean
}
interface IPropsModalLink extends IFolderLink {
    opened: boolean
}

export default function Folder() {

    const { id } = useParams();

    const { redirectSlug } = useRedirect();
    const { role, verifyPermission } = useAuth();

    const refPage = useRef<HTMLDivElement>(null)
    const [typeCard, setTypeCard] = useState<'card' | 'list'>('card')

    const [loadingActionArchive, setLoadingActionArchive] = useState(false);
    const [loadingFolder, setLoadingFolder] = useState(true);
    const [folder, setFolder] = useState<IFolderItem>({} as IFolderItem);

    const [modalUploadArchives, setModalUploadArchives] = useState(false);
    const [modalUploadFolder, setModalUploadFolder] = useState(false);
    const [showAddFolder, setShowAddFolder] = useState(false);

    const [modalViewArchive, setModalViewArchive] = useState<IFolderFileItem>({} as IFolderFileItem);
    const [modalEditArchive, setModalEdiArchive] = useState<IPropsModalArchive>({} as IPropsModalArchive);
    const [modalMoveArchives, setModalMoveArchives] = useState<IFolderFileItem[]>([]);

    const [modalViewVideo, setModalViewVideo] = useState<IFolderVideo>({} as IFolderVideo);
    const [modalEditVideo, setModalEditVideo] = useState<IPropsModalVideo>({} as IPropsModalVideo);

    const [modalEditFolder, setModalEditFolder] = useState<IFolder>({} as IFolder);

    const [modalEditLink, setModalEditLink] = useState<IPropsModalLink>({} as IPropsModalLink);

    const [optionsButtonAdd, setOptionButtonAdd] = useState<ISubmenuSelect[]>([])

    const [breadcrumb, setBreadcrumb] = useState<IPropsBreadcrumb[]>([
        {
            name: 'Início',
            icon: <IconHome />,
            redirect: '/folders',
            here: true,
        }
    ])
    const [order, setOrder] = useState({
        value: 'created',
        name: 'Mais recente'
    })

    const [archivesChecked, setArchivesChecked] = useState<number[]>([]);

    const query = new URLSearchParams(window.location.search);
    const search = query.get('search');

    useEffect(() => {
        const PermissionButotns: ISubmenuSelect[] = [];

        if (verifyPermission('folders_edit')) {
            PermissionButotns.push({
                name: 'Criar nova pasta',
                icon: <IconFolder />,
                onClick: () => setShowAddFolder(true)
            })
        }

        if (verifyPermission('folders_edit') && verifyPermission('files_edit')) {
            PermissionButotns.push({
                name: 'Upload de pasta',
                icon: <IconFolderUpload />,
                onClick: () => setModalUploadFolder(true)
            })
        }

        if (verifyPermission('files_edit')) {
            PermissionButotns.push({
                name: 'Upload de arquivo',
                icon: <IconArchive />,
                onClick: () => setModalEdiArchive({ opened: true, folder_id: id ? Number(id) : null } as IPropsModalArchive)
            })
        }

        if (verifyPermission('files_edit')) {
            PermissionButotns.push({
                name: 'Upload de múltiplos arquivos',
                icon: <IconArchiveMultiple />,
                onClick: () => setModalUploadArchives(true)
            })
        }

        if (verifyPermission('links_edit')) {
            PermissionButotns.push({
                name: 'Novo link',
                icon: <IconLink />,
                onClick: () => setModalEditLink({ opened: true, folder_id: Number(id) ?? 0 } as IPropsModalLink)
            })
        }

        if (verifyPermission('videos_edit')) {
            PermissionButotns.push({
                name: 'Novo vídeo',
                icon: <IconVideo />,
                onClick: () => setModalEditVideo({ opened: true, folder_id: Number(id) ?? 0 } as IPropsModalVideo)
            })
        }

        setOptionButtonAdd([...PermissionButotns])
    }, [role, id])

    const getData = async () => {
        setLoadingFolder(true);
        const response = await FoldersService.get({
            id: id,
            sort: order.value,
            search: search
        });
        const newBreadcrumb: IPropsBreadcrumb[] = response.item.breacrumb.map((item: IFolderBreadcrumb, key: number) => {
            return {
                name: item.name,
                icon: item.name === 'Início' ? <IconHome /> : <IconFolder />,
                redirect: item.name === 'Início' ? '/folders' : `/folders/${item.folder_id}`,
                here: response.item.breacrumb.length === (key + 1) ? true : false,
            }
        })
        setBreadcrumb([...newBreadcrumb])
        setFolder({ ...response.item })
        setLoadingFolder(false);
    }

    useEffect(() => {
        if (order.value) getData();
    }, [id, order, search])

    useEffect(() => {
        setArchivesChecked([]);

        const el = document.getElementById('overflow-page');
        if (el) {
            el.scrollTop = 0;
        }

    }, [id]);

    const handleAddFolder = (item: IFolderItem) => {
        const newFolders: IFolder[] = [item];
        folder.children.folders.map((fol) => {
            newFolders.push(fol)
        })
        folder.children.folders = newFolders;
        setFolder({ ...folder });
        setShowAddFolder(false);
    }

    const handleToggleCheckArchives = (file_id: number) => {
        const exist = archivesChecked.filter((obj) => obj === file_id)
        if (exist.length) {
            setArchivesChecked([...archivesChecked.filter((obj) => obj !== file_id)])
        } else {
            archivesChecked.push(file_id);
            setArchivesChecked([...archivesChecked])
        }
    }

    const handleToggleCheckAllArchives = (type: 'check' | 'uncheck') => {
        if (type === 'check') {
            setArchivesChecked([...folder.children.files.map((item) => {
                return item.file_id
            })])
        } else {
            setArchivesChecked([])
        }
    }

    const handleOnRemoveChildren = (type: string, id: number) => {

        switch (type) {
            case 'folder':
                folder.children.folders = folder.children.folders.filter((obj) => obj.folder_id !== id);
                break;
            case 'file':
                folder.children.files = folder.children.files.filter((obj) => obj.file_id !== id);
                break;
            case 'video':
                folder.children.videos = folder.children.videos.filter((obj) => obj.video_id !== id);
                break;
            case 'link':
                folder.children.links = folder.children.links.filter((obj) => obj.link_id !== id);
                break;
        }
        setFolder({ ...folder })

    }

    const handleSaveFolder = (item: IFolder) => {
        folder.children.folders = folder.children.folders.map((row) => {
            if (row.folder_id === item.folder_id) row = item
            return row;
        })
        setFolder({ ...folder })
    }

    const handleSaveLArchive = (type: string, item: IFolderFileItem) => {
        if (type === 'new') {
            if (String(item.folder_id) === id || !item.folder_id) {
                const newFile: IFolderFileItem[] = [item];
                folder.children.files.map((row) => {
                    newFile.push(row)
                })
                folder.children.files = newFile;
                setFolder({ ...folder });
            }
        } else {
            const newFiles = folder.children.files.map((row) => {
                if (Number(row.file_id) === Number(item.file_id)) row = item
                return row;
            })
            setFolder((prev) => ({ ...prev, children: { ...prev.children, files: newFiles } }))
        }
    }

    const handleSaveVideo = (type: string, item: IFolderVideo) => {
        if (type === 'new') {
            if (String(item.folder_id) === id || !item.folder_id) {
                const newVideo: IFolderVideo[] = [item];
                folder.children.videos.map((row) => {
                    newVideo.push(row)
                })
                folder.children.videos = newVideo;
                setFolder({ ...folder });
            }
        } else {
            const newVideos = folder.children.videos.map((row) => {
                if (row.video_id === item.video_id) row = item
                return row;
            })
            setFolder((prev) => ({ ...prev, children: { ...prev.children, videos: newVideos } }))
        }
    }

    const handleSaveLink = (type: string, item: IFolderLink) => {
        if (type === 'new') {
            if (String(item.folder_id) === id || !item.folder_id) {
                const newLink: IFolderLink[] = [item];
                folder.children.links.map((row) => {
                    newLink.push(row)
                })
                folder.children.links = newLink;
                setFolder({ ...folder });
            }
        } else {
            const newLinks = folder.children.links.map((row) => {
                if (row.link_id === item.link_id) row = item
                return row;
            })
            setFolder((prev) => ({ ...prev, children: { ...prev.children, links: newLinks } }))
        }
    }

    const handleActionArchive = async (type: string, checkeds: number[]) => {
        if (type === 'remove') {
            setLoadingActionArchive(true);
            for (const id of checkeds) {
                await FilesService.delete({ id })
                folder.children.files = folder.children.files.filter((obj) => Number(obj.file_id) !== Number(id));
                setFolder({ ...folder })
                setArchivesChecked((prevState) => prevState.filter((obj) => obj !== id));
            }
            setLoadingActionArchive(false);
        }
        if (type === 'download') {
            setLoadingActionArchive(true);
            const itemsDownload: IFileItemDownload[] = folder.children.files.map((item) => {
                return {
                    name: item.name,
                    url: item.url_path
                }
            })
            const response = await downloadZipFromUrls(itemsDownload);
            setArchivesChecked([]);
            setLoadingActionArchive(false);
        }
        if (type === 'move') {
            setModalMoveArchives(
                folder.children.files.filter((row) =>
                    archivesChecked.includes(row.file_id)
                )
            );
        }
    }

    const handleAddFilesUpload = async (item: IFolderFileItem) => {
        folder.children.files.push(item);
        setFolder({ ...folder })
    }

    return (
        <S.Container ref={refPage}>
            <BreadCrumbAuthLayout
                data={breadcrumb}
            />
            <Toolbar>
                <div className='toolbar-filters'>
                    <div className='left'>
                        {verifyPermission('folders_view') &&
                            <div className='total'>
                                <i>
                                    <IconFolder />
                                </i>
                                <span>{loadingFolder ? <Skeleton width={'8px'} height={'18px'} /> : <b>{folder.childrenCount.folders}</b>} Pastas</span>
                            </div>
                        }
                        <div className='total'>
                            <i>
                                <IconArchive />
                            </i>
                            <span>{loadingFolder ? <Skeleton width={'8px'} height={'18px'} /> : <b>{folder.childrenCount.files}</b>} Arquivos</span>
                        </div>
                        <div className='total'>
                            <i>
                                <IconFolderVideo />
                            </i>
                            <span>{loadingFolder ? <Skeleton width={'8px'} height={'18px'} /> : <b>{folder.childrenCount.videos}</b>} Vídeos</span>
                        </div>
                        <div className='total'>
                            <i>
                                <IconLink />
                            </i>
                            <span>{loadingFolder ? <Skeleton width={'8px'} height={'18px'} /> : <b>{folder.childrenCount.links}</b>} Links</span>
                        </div>
                    </div>
                    <div className='right'>

                        <S.ToolBarTypeView type={typeCard}>
                            <button className='card' onClick={() => setTypeCard('card')}>
                                <IconViewCard />
                            </button>
                            <button className='list' onClick={() => setTypeCard('list')}>
                                <IconViewList />
                            </button>
                        </S.ToolBarTypeView>

                        <SelectDefault
                            icon={<IconSort />}
                            value={order}
                            onChange={(e) => setOrder(e)}
                            options={[
                                {
                                    value: 'name',
                                    name: 'Alfabética'
                                },
                                {
                                    value: 'created',
                                    name: 'Mais recente'
                                },
                                {
                                    value: 'download',
                                    name: 'Mais baixados'
                                }
                            ]}
                        />

                        <SubmenuSelect whiteSpace={"nowrap"} position='right' submenu={optionsButtonAdd}>
                            <ButtonDefault iconPosition='right' variant="success" icon={<IconPlus />}>
                                Adicionar
                            </ButtonDefault>
                        </SubmenuSelect>
                    </div>
                </div>
            </Toolbar>

            {!loadingFolder && folder.children.folders.length === 0 && folder.children.files.length === 0 && folder.children.videos.length === 0 && folder.children.links.length === 0 &&
                <div className='empty'>
                    <i>
                        <IconFolder />
                    </i>
                    <p className='description'>Nenhum registro encontrado.</p>
                    <div className='buttons'>
                        <ButtonDefault variant='dark' onClick={() => redirectSlug(`${breadcrumb[breadcrumb.length - 2].redirect}`)}>Voltar</ButtonDefault>
                    </div>
                </div>
            }

            <ModalUploadFolder
                opened={modalUploadFolder}
                onClose={() => setModalUploadFolder(false)}
                folder_id={id ? Number(id) : null}
                onSave={(e) => handleAddFolder(e)}
                onSaveFile={(e) => handleSaveLArchive('new', e)}
            />
            <ModalUploadArchives
                opened={modalUploadArchives}
                onClose={() => setModalUploadArchives(false)}
                folder_id={id ? Number(id) : null}
                onSave={(items) => handleAddFilesUpload(items)}
            />
            {(loadingFolder || showAddFolder || folder.children.folders.length > 0) &&
                <RenderTab name='Pastas' icon={<IconFolder />}>
                    <ModalEditFolder
                        opened={modalEditFolder.folder_id ? true : false}
                        onClose={() => setModalEditFolder({} as IFolderItem)}
                        item={modalEditFolder}
                        onDelete={(id) => handleOnRemoveChildren('folder', Number(id))}
                        onSave={(item) => handleSaveFolder(item)}
                    />
                    <div className={`list-folders ${typeCard}`}>
                        {loadingFolder === false && showAddFolder && <CardNewFolder type={typeCard} onSubmit={handleAddFolder} />}
                        {loadingFolder && <CardFolderLoading type={typeCard} quantity={'random'} />}
                        {!loadingFolder && folder.children?.folders?.map((item) =>
                            <CardFolder
                                type={typeCard}
                                key={`folder-${item.folder_id}`}
                                item={item}
                                onDelete={(type, id) => handleOnRemoveChildren(type, Number(id))}
                                onEdit={(e) => setModalEditFolder({ ...e })}
                            />
                        )}
                    </div>
                </RenderTab>
            }

            <ModalEditArchive
                item={modalEditArchive}
                opened={modalEditArchive.opened}
                onClose={() => setModalEdiArchive({} as IPropsModalArchive)}
                onDelete={(id) => handleOnRemoveChildren('file', Number(id))}
                onSave={(type, item) => handleSaveLArchive(type, item)}
                onView={(item) => setModalViewArchive(item)}
            />
            {(loadingFolder || folder.children.files.length > 0) &&
                <RenderTab
                    totalItems={loadingFolder ? undefined : folder.children?.files?.length}
                    checkeds={loadingFolder ? undefined : archivesChecked}
                    onCheck={loadingFolder ? undefined : handleToggleCheckAllArchives}
                    loadingAction={loadingActionArchive}
                    onActionSelected={(e) => handleActionArchive(e, archivesChecked)}
                    name='Arquivos' icon={<IconArchiveMultiple />}
                >
                    <ModalViewArchive
                        item={modalViewArchive}
                        opened={modalViewArchive.file_id ? true : false}
                        onClose={() => setModalViewArchive({} as IFolderFileItem)}
                    />
                    <ModalMoveArchive
                        item={modalMoveArchives}
                        opened={modalMoveArchives.length ? true : false}
                        onClose={() => setModalMoveArchives([])}
                        onSave={(item) => { handleOnRemoveChildren('file', item); setArchivesChecked((prev) => ([...prev.filter((obj) => obj !== item)])) }}
                        folder_id={id}
                    />
                    <div className={`list-archives ${typeCard}`}>
                        {loadingFolder && <CardArchiveLoading type={typeCard} quantity={'random'} />}
                        {!loadingFolder && folder.children?.files?.map((item) =>
                            <CardArchive
                                checked={archivesChecked.filter((obj) => obj === item.file_id).length ? true : false}
                                onChecked={() => handleToggleCheckArchives(item.file_id)}
                                type={typeCard}
                                key={`folder-archive-${item.file_id}`}
                                item={item}
                                onView={() => setModalViewArchive(item)}
                                onDelete={(type, id) => handleOnRemoveChildren(type, Number(id))}
                                onEdit={(e) => setModalEdiArchive({ ...e, opened: true })}
                            />
                        )}
                    </div>
                </RenderTab>
            }

            <ModalEditVideo
                item={modalEditVideo}
                opened={modalEditVideo.opened}
                onClose={() => setModalEditVideo({} as IPropsModalVideo)}
                onDelete={(id) => handleOnRemoveChildren('video', Number(id))}
                onSave={(type, item) => handleSaveVideo(type, item)}
            />
            {(loadingFolder || folder.children.videos.length > 0) &&
                <RenderTab name='Vídeos' icon={<IconFolderVideo />}>
                    <ModalViewVideo
                        item={modalViewVideo}
                        opened={modalViewVideo.video_id ? true : false}
                        onClose={() => setModalViewVideo({} as IFolderVideo)}
                    />
                    <div className={`list-videos ${typeCard}`}>
                        {loadingFolder && <CardVideoLoading type={typeCard} quantity={'random'} />}
                        {!loadingFolder && folder.children?.videos?.map((item) =>
                            <CardVideo
                                type={typeCard}
                                key={`folder-video-${item.video_id}`}
                                item={item}
                                onDelete={(type, id) => handleOnRemoveChildren(type, Number(id))}
                                onView={() => setModalViewVideo(item)}
                                onEdit={(e) => setModalEditVideo({ ...e, opened: true })}
                            />
                        )}
                    </div>
                </RenderTab>
            }

            <ModalEditLink
                item={modalEditLink}
                opened={modalEditLink.opened}
                onClose={() => setModalEditLink({} as IPropsModalLink)}
                onDelete={(id) => handleOnRemoveChildren('link', Number(id))}
                onSave={(type, item) => handleSaveLink(type, item)}
            />
            {(loadingFolder || folder.children.links.length > 0) &&
                <RenderTab name='Links' icon={<IconLink />}>
                    <div className={`list-links ${typeCard}`}>
                        {loadingFolder && <CardLinkLoading type={typeCard} quantity={'random'} />}
                        {!loadingFolder && folder.children?.links?.map((item) =>
                            <CardLink
                                type={typeCard}
                                key={`link-${item.link_id}`}
                                item={item}
                                onDelete={(type, id) => handleOnRemoveChildren(type, Number(id))}
                                onEdit={(e) => setModalEditLink({ ...e, opened: true })}
                            />
                        )}
                    </div>
                </RenderTab>
            }

        </S.Container>
    )
}

export const RenderTab = ({ totalItems, checkeds, loadingAction, onActionSelected, onCheck, name, icon, children }: {
    totalItems?: number;
    checkeds?: number[]
    loadingAction?: boolean;
    onCheck?(type: 'check' | 'uncheck'): void;
    onActionSelected?(type: 'download' | 'remove' | 'move'): void;
    name: string;
    icon: ReactNode;
    children: ReactNode
}) => {

    const [toggleShow, setToggleShow] = useState(true)
    const { tenant } = useTenant();

    return (
        <S.ContainerListItems color={tenant?.colorhigh} colorBg={tenant?.colormain} colorText={tenant?.colorsecond}>
            <div className='head'>

                <div className='info-fab'>
                    <div className='toggle'>
                        <button className={`${toggleShow ? 'show' : 'hide'}`} onClick={() => setToggleShow(!toggleShow)}>
                            <IconChevronDown />
                        </button>
                    </div>
                    <i>
                        {icon}
                    </i>
                    <p className='title'>{name}</p>
                </div>

                {toggleShow && (onCheck && onActionSelected) &&
                    <div className='selected-function'>

                        {loadingAction && checkeds &&
                            <div className='loading-action'>
                                <IconLoading />
                                <span>{checkeds.length} Selecionado{checkeds.length > 1 ? 's' : ''}</span>
                            </div>
                        }

                        {!loadingAction && totalItems !== checkeds?.length &&
                            <ButtonDefault flex={false} onClick={() => onCheck('check')} icon={<IconCheckboxOn />} variant='light'>Selecionar todos arquivos</ButtonDefault>
                        }

                        {!loadingAction && checkeds && checkeds?.length > 0 &&
                            <ButtonDefault flex={false} onClick={() => onCheck('uncheck')} icon={<IconCheckboxOff />} variant='light'>Desmarcar todos</ButtonDefault>
                        }

                        {!loadingAction && checkeds && checkeds.length > 0 &&
                            <SubmenuSelect position='right' submenu={[
                                {
                                    name: 'Baixar',
                                    icon: <IconDownload />,
                                    onClick: () => onActionSelected('download')
                                },
                                {
                                    name: 'Apagar',
                                    icon: <IconTrash />,
                                    onClick: () => onActionSelected('remove')
                                },
                                {
                                    name: 'Mover',
                                    icon: <IconSort />,
                                    onClick: () => onActionSelected('move')
                                },
                            ]}>
                                <ButtonDefault iconPosition='right' variant="dark">
                                    {checkeds.length} Selecionado{checkeds.length > 1 ? 's' : ''}
                                </ButtonDefault>
                            </SubmenuSelect>
                        }
                    </div>
                }
            </div>

            {toggleShow &&
                <div className='content-toggle'>
                    {children}
                </div>
            }
        </S.ContainerListItems>
    )
}