import { useEffect, useState } from 'react'
import { InputDefault } from '../../UI/form/input-default'
import { ModalDefault } from '../../UI/modal/modal-default'

import type { IFolderFileItem } from '../../../core/types/iFolder'
import { ButtonDefault } from '../../UI/form/button-default'
import { ModalConfirm } from '../../UI/modal/modal-confirm'

import * as S from './styles'
import { FolderTree, type IFolderTree } from '../folder-tree'
import { FoldersService } from '../../../core/services/FoldersService'
import { TabsDefault } from '../../UI/tabs-default'
import { IconConfig, IconTag, IconTextRename } from '../../../assets/icons'
import { useAlert } from '../../../core/contexts/AlertContext'
import { useTenant } from '../../../core/contexts/TenantContext'
import { FilesService } from '../../../core/services/FilesService'
import { InputTags } from '../../UI/form/input-tags'
import { InputUpload, type UploadResult } from '../../UI/form/input-upload'
import { InputCheckbox } from '../../UI/form/input-checkbox'
import { CardHelp } from '../../UI/card-help'


export const ModalEditArchive = ({
    item,
    opened,
    onClose,
    onDelete,
    onSave,
    onView
}: {
    opened: boolean;
    onClose(): void;
    onDelete(id: number): void;
    onSave(type: string, item: IFolderFileItem): void;
    onView(item: IFolderFileItem): void;
    item: IFolderFileItem
}) => {

    const TABS_EDIT = ["Informações Básicas", "Customização", "Local da Pasta"];

    const { addAlert } = useAlert()
    const { tenant } = useTenant();

    const [loadingSave, setLoadingSave] = useState(false);

    const [modalConfirm, setModalConfirm] = useState(false);
    const [DTOEdit, setDTOEdit] = useState(false);

    const [loadingTree, setLoadingTree] = useState(false);
    const [dataTree, setDataTree] = useState<Record<string, IFolderTree[]>>({});

    const [tab, setTab] = useState(TABS_EDIT[0]);

    const [DTO, setDTO] = useState<IFolderFileItem>({ ...item })

    const [files, setFiles] = useState<UploadResult | null>(null)
    const [filesThumb, setFilesThumb] = useState<UploadResult | null>(null)

    useEffect(() => {
        setDTO({ ...item })
        setFiles(null)
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

            if (!DTO.name) throw new Error('O nome do arquivo é obrigatório');
            if ((!files || files.files.length === 0) && !item.file_id) throw new Error('O upload do arquivo é obrigatório');
            setLoadingSave(true);

            const path: any = files?.files[0].file ?? null;
            DTO.path = path;

            DTO.tenant_id = tenant?.tenant_id ?? 0;
            const response = await FilesService.set({ ...DTO })
            onSave(DTO.file_id ? 'update' : 'new', response.item);
            setDTOEdit(false);
            onClose();
            setLoadingSave(false);
            if (DTO.folder_id !== item.folder_id) onDelete(item.file_id)
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
        } catch (error: any) {
            setLoadingSave(false)
            addAlert('error', 'Ops', error.message);
        }
    }

    return (
        <>
            <ModalDefault
                layout="right"
                title={`${item.file_id ? `Editar` : `Adicionar`} Arquivo`}
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

                    {tab === TABS_EDIT[0] &&
                        <RenderTabInfo
                            onView={() => onView(item)}
                            files={files}
                            setFiles={setFiles}
                            filesThumb={filesThumb}
                            setFilesThumb={setFilesThumb}
                            item={item}
                            DTO={DTO}
                            onChangeDTO={onChangeDTO}
                        />
                    }
                    {tab === TABS_EDIT[1] && <RenderTabCustomizable DTO={DTO} onChangeDTO={onChangeDTO} />}
                    {tab === TABS_EDIT[2] && <RenderTabMove loading={loadingTree} tree={dataTree} DTO={DTO} onChangeDTO={onChangeDTO} />}

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

const RenderTabInfo = ({ onView, files, setFiles, filesThumb, setFilesThumb, item, DTO, onChangeDTO }: {
    onView(): void;

    files: UploadResult | null;
    setFiles(e: UploadResult | null): void;

    filesThumb: UploadResult | null;
    setFilesThumb(e: UploadResult | null): void;

    item: IFolderFileItem;

    DTO: any;
    onChangeDTO(name: string, value: any): void;
}) => {

    return (
        <div className='inputs-flex'>

            <InputUpload
                label="Arquivo"
                typeFile="file" // ou "folder"
                maxSizeMB={1536}
                value={files}
                onChange={(e) => setFiles(e)}
            />

            {item.path &&
                <InputUpload
                    accept={['.jpg']}
                    label="Thumbnail"
                    typeFile="file" // ou "folder"
                    maxSizeMB={2}
                    value={filesThumb}
                    onChange={(e) => setFilesThumb(e)}
                />
            }

            {item.path &&
                <div onClick={onView} className='preview-file'>
                    <div className='image' style={{
                        backgroundImage: `url(${DTO.thumbnail})`
                    }} />
                    <div className='infos-preview'>
                        <p>Arquivo atual</p>
                        <a>Pré visualizar</a>
                    </div>
                </div>
            }

            <InputDefault
                label="Nome"
                value={DTO.name}
                onChange={(e) => onChangeDTO('name', e.target.value)}
                icon={<IconTextRename />}
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

const RenderTabCustomizable = ({ DTO, onChangeDTO }: {
    DTO: any;
    onChangeDTO(name: string, value: any): void;
}) => {

    return (
        <div className='inputs-flex'>
            <CardHelp title='Atenção'>
                <li>
                    <b>Versão Beta</b>
                    <p>A customização de arquivos não está disponível na versão beta. Você pode enviar arquivos e ativar a opção de customização, mas as configurações personalizadas só terão efeito na versão antiga do sistema.</p>
                </li>
                {DTO.customizable &&
                    <li>
                        <b>DPI</b>
                        <p>Padrões: 72 - Digital/Online; 300 - Impresso</p>
                    </li>
                }
            </CardHelp>
            <InputCheckbox
                label='Habilitar Customização'
                checked={DTO.customizable}
                onChange={(e) => onChangeDTO('customizable', e)}
            />

            {DTO.customizable &&
                <>
                    <InputCheckbox
                        label='Utilizar cores em CMYK para impressões gráficas'
                        checked={DTO.cmyk}
                        onChange={(e) => onChangeDTO('cmyk', e)}
                    />
                    <InputDefault
                        label="DPI"
                        type='number'
                        value={DTO.dpi ?? 72}
                        onChange={(e) => onChangeDTO('dpi', e.target.value)}
                        icon={<IconConfig />}
                    />
                </>
            }
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