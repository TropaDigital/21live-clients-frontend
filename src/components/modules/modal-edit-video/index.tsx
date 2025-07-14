import { useEffect, useState } from 'react'
import { InputDefault } from '../../UI/form/input-default'
import { SelectDefault } from '../../UI/form/select-default'
import { ModalDefault } from '../../UI/modal/modal-default'

import type { IFolderVideo } from '../../../core/types/iFolder'
import { ButtonDefault } from '../../UI/form/button-default'
import { ModalConfirm } from '../../UI/modal/modal-confirm'

import * as S from './styles'
import { FolderTree, type IFolderTree } from '../folder-tree'
import { FoldersService } from '../../../core/services/FoldersService'
import { TabsDefault } from '../../UI/tabs-default'
import { IconTag, IconTextRename, IconVideo } from '../../../assets/icons'
import { detectVideoHost, extractVideoCodeFromUrl, getVideoEmbedUrl } from '../../../core/utils/videos'
import { VideoService } from '../../../core/services/VideoService'
import { useAlert } from '../../../core/contexts/AlertContext'
import { useTenant } from '../../../core/contexts/TenantContext'
import { InputTags } from '../../UI/form/input-tags'


export const ModalEditVideo = ({
    item,
    opened,
    onClose,
    onDelete,
    onSave,
}: {
    opened: boolean;
    onClose(): void;
    onDelete(id: number): void;
    onSave(type: string, item: IFolderVideo): void;
    item: IFolderVideo
}) => {

    const TABS_EDIT = ["Informações Básicas", "Local da Pasta"];

    const { addAlert } = useAlert()
    const { tenant } = useTenant();

    const [loadingSave, setLoadingSave] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [DTOEdit, setDTOEdit] = useState(false);

    const [loadingTree, setLoadingTree] = useState(false);
    const [dataTree, setDataTree] = useState<Record<string, IFolderTree[]>>({});

    const [tab, setTab] = useState(TABS_EDIT[0]);

    const [DTO, setDTO] = useState<IFolderVideo>({ ...item })

    useEffect(() => {
        setDTO({ ...item })
    }, [item])

    const onChangeDTO = (name: string, value: any) => {
        setDTO({ ...DTO, [name]: value });
        setDTOEdit(true);
    }

    const onCloseModal = () => {
        if (DTOEdit) {
            setModalConfirm(true);
        } else {
            onClose()
        }
    }

    const getDataTree = async () => {
        setLoadingTree(true);
        const response = await FoldersService.getTree();
        setDataTree({ ...response.items })
        setLoadingTree(false);
    }

    useEffect(() => {
        if (opened == true) {
            getDataTree();
        } else {
            setDataTree({})
            setTab(TABS_EDIT[0])
        }
    }, [opened])

    const handleOnSave = async () => {
        try {
            if (!DTO.name) throw new Error('O nome do vídeo é obrigatório');
            if (!DTO.code) throw new Error('O link do vídeo é obrigatório');
            setLoadingSave(true);
            DTO.tenant_id = tenant?.tenant_id ?? 0;
            const response = await VideoService.set({ ...DTO })
            onSave(DTO.video_id ? 'update' : 'new', response.item);
            setDTOEdit(false);
            onClose();
            setLoadingSave(false);
            if (DTO.folder_id !== item.folder_id) onDelete(item.video_id)
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
        } catch (error: any) {
            setLoadingSave(false)
            addAlert('error', 'Ops', error.message);
        }
    }

    const onChangeHost = (host: string, code: string) => {
        setDTO({ ...DTO, host, code })
    }

    return (
        <>
            <ModalDefault
                layout="right"
                title={`${item.video_id ? `Editar` : `Adicionar`} Vídeo`}
                onClose={onCloseModal}
                opened={opened}
                padding={'0px'}
                paddingHeader={'20px 40px'}
            >
                <S.Container>

                    <TabsDefault
                        selected={tab}
                        onSelected={(e) => setTab(e)}
                        tabs={TABS_EDIT}
                        className='tab-modal'
                    />

                    {tab === TABS_EDIT[0] && <RenderTabInfo onChangeHost={onChangeHost} item={item} DTO={DTO} onChangeDTO={onChangeDTO} />}
                    {tab === TABS_EDIT[1] && <RenderTabMove loading={loadingTree} tree={dataTree} DTO={DTO} onChangeDTO={onChangeDTO} />}

                    <div className='foot-buttons'>
                        <ButtonDefault onClick={onCloseModal} variant='lightWhite'>Cancelar</ButtonDefault>
                        <ButtonDefault loading={loadingSave} onClick={handleOnSave}>Confirmar</ButtonDefault>
                    </div>
                </S.Container>
            </ModalDefault>
            <ModalConfirm
                type='info'
                onCancel={() => setModalConfirm(false)}
                onConfirm={() => {
                    onClose();
                    setModalConfirm(false)
                }}
                opened={modalConfirm}
                title='Atenção'
                description='Você tem alterações não salvas, deseja descartar?'
            />
        </>
    )
}

const RenderTabInfo = ({ item, DTO, onChangeDTO, onChangeHost }: {
    item: IFolderVideo
    DTO: any;
    onChangeDTO(name: string, value: any): void;
    onChangeHost(host: string, code: string): void;
}) => {

    const [url, setURL] = useState(DTO.url)

    const LIST_HOST = [
        {
            name: 'Youtube',
            value: 'youtube',
        },
        {
            name: 'Vimeo',
            value: 'vimeo',
        },
        {
            name: 'Loom',
            value: 'loom',
        }
    ]

    const valueHost = LIST_HOST.filter((obj) => obj.value === DTO.host).length > 0 ? LIST_HOST.filter((obj) => obj.value === DTO.host)[0] : {
        name: '',
        value: '',
    }

    useEffect(() => {
        if (item.code && item.host && !DTO.url) {
            const urlFinal = getVideoEmbedUrl(item.host, item.code)
            setURL(urlFinal)
        }
    }, [item.code, item.host])

    useEffect(() => {
        if (url) {
            const detectHost = detectVideoHost(url);
            if (detectHost) {
                const detectCode = extractVideoCodeFromUrl(url, detectHost);
                if (detectCode) {
                    onChangeHost(detectHost ?? "", detectCode ?? "")
                }
            }
        }
    }, [url])

    const onChangeUrl = (value: string) => {
        onChangeDTO('url', value)
        setURL(value)
    }

    return (
        <div className='inputs-flex'>

            <div className='render-video'>
                {DTO.code && (
                    <iframe
                        width="100%"
                        height="300"
                        src={getVideoEmbedUrl(DTO.host, DTO.code)}
                        allowFullScreen
                    />
                )}
            </div>

            <InputDefault
                label="Nome"
                value={DTO.name}
                onChange={(e) => onChangeDTO('name', e.target.value)}
                icon={<IconTextRename />}
            />

            {DTO.host &&
                <SelectDefault
                    label='Provedor'
                    onChange={(e) => onChangeDTO('host', e.value)}
                    value={valueHost}
                    options={LIST_HOST}
                />
            }

            {/**
             * 
            <InputDefault
                label="Code"
                onChange={(e) => onChangeDTO('code', e.target.value)}
                icon={<IconVideo />}
                value={DTO.code}
            />
             */}

            <InputDefault
                label="Link do vídeo"
                onChange={(e) => onChangeUrl(e.target.value)}
                icon={<IconVideo />}
                value={url}
            />

            <InputTags
                label="Tags"
                tags={DTO.tags}
                onChange={(e) => onChangeDTO('tags', e)}
                placeholder='Digite as tags separando por virgula'
                icon={<IconTag />}
            />
        </div>
    )
}

const RenderTabMove = ({ tree, loading, DTO, onChangeDTO }: {
    loading: boolean;
    DTO: any;
    onChangeDTO(name: string, value: any): void;
    tree: Record<string, IFolderTree[]>
}) => {

    return (
        <div className='inputs-flex'>
            <FolderTree
                loading={loading}
                onChange={(folder_id) => onChangeDTO('folder_id', folder_id)}
                data={tree}
                folder_id={DTO.folder_id}
            />
        </div>
    )
}