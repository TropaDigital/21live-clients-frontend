import { useEffect, useState } from 'react'
import { ModalDefault } from '../../UI/modal/modal-default'

import type { IFolderFileItem } from '../../../core/types/iFolder'
import { ButtonDefault } from '../../UI/form/button-default'
import { ModalConfirm } from '../../UI/modal/modal-confirm'

import * as S from './styles'
import { FolderTree, type IFolderTree } from '../folder-tree'
import { FoldersService } from '../../../core/services/FoldersService'
import { TabsDefault } from '../../UI/tabs-default'
import { useAlert } from '../../../core/contexts/AlertContext'
import { useTenant } from '../../../core/contexts/TenantContext'
import { InputUpload, type UploadResult } from '../../UI/form/input-upload'
import { FilesService } from '../../../core/services/FilesService'
import { useAuth } from '../../../core/contexts/AuthContext'


export const ModalUploadArchives = ({
    opened,
    folder_id,
    onClose,
    onSave,
}: {
    opened: boolean;
    folder_id: number | null;
    onClose(): void;
    onSave(item: IFolderFileItem): void;
}) => {

    const TABS_EDIT = ["Informações Básicas", "Local da Pasta"];

    const { addAlert } = useAlert()
    const { tenant } = useTenant();
    const { user } = useAuth();

    const [progressPercent, setProgressPercent] = useState(0);
    const [progressSizeText, setProgressSizeText] = useState('0 KB de 0 KB');
    const [loadingSave, setLoadingSave] = useState(false);

    const [modalConfirm, setModalConfirm] = useState(false);
    const [DTOEdit, setDTOEdit] = useState(false);

    const [tab, setTab] = useState(TABS_EDIT[0]);

    const [loadingTree, setLoadingTree] = useState(false);
    const [dataTree, setDataTree] = useState<Record<string, IFolderTree[]>>({});

    const [files, setFiles] = useState<UploadResult | null>(null)

    const [DTO, setDTO] = useState({ folder_id: folder_id })

    useEffect(() => {
        setDTO({ ...DTO, folder_id })
    }, [folder_id])

    const onCloseModal = () => {
        if (loadingSave) return;
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
        setFiles(null)
        setDTOEdit(false)
        if (opened == true) {
            getDataTree();
        } else {
            setDataTree({})
            setTab(TABS_EDIT[0])
        }
    }, [opened])

    const onChangeDTO = (name: string, value: any) => {
        setDTO({ ...DTO, [name]: value });
        setDTOEdit(true);
    }

    const formatSize = (bytes: number): string => {
        const sizeInKB = bytes / 1024;
        return sizeInKB > 1024
            ? `${(sizeInKB / 1024).toFixed(2)} MB`
            : `${sizeInKB.toFixed(0)} KB`;
    };

    const handleOnSave = async () => {
        try {
            if (!files?.files || files.files.length === 0) return;

            setLoadingSave(true);
            setProgressPercent(0);
            setProgressSizeText('0 KB');

            const totalBytes = files.files.reduce((sum, item) => sum + item.file.size, 0);
            let uploadedBytes = 0;

            for (const item of files.files) {
                const response = await FilesService.set({
                    name: item.file.name,
                    folder_id: DTO.folder_id,
                    user_id: user?.user_id ?? 0,
                    path: item.file,
                    tenant_id: tenant?.tenant_id,
                });

                uploadedBytes += item.file.size;
                const percent = (uploadedBytes / totalBytes) * 100;

                onSave(response.item)
                setProgressPercent(Math.round(percent));
                setProgressSizeText(`${formatSize(uploadedBytes)} de ${formatSize(totalBytes)}`);
            }

            setLoadingSave(false);
            onClose();
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
        } catch (error: any) {
            setLoadingSave(false);
            addAlert('error', 'Ops', error.message);
        }
    };

    return (
        <>
            <ModalDefault
                layout="right"
                title={`Upload de múltiplos arquivos`}
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

                    {loadingSave &&
                        <div className='loading-percent'>

                            <div className='center-loading'>
                                <p>Fazendo upload de <b>{files?.files.length}</b> arquivos</p>
                                <div className='progress-bar'>
                                    <div style={{ width: `${progressPercent}%`, backgroundColor: tenant?.colormain }} className='progress' />
                                </div>
                                <p>{progressSizeText}</p>
                            </div>

                        </div>
                    }

                    {tab === TABS_EDIT[0] &&
                        <RenderTabInfo
                            files={files}
                            setFiles={setFiles}
                        />
                    }

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

const RenderTabInfo = ({ files, setFiles }: {
    files: UploadResult | null;
    setFiles(e: UploadResult | null): void;
}) => {

    return (
        <div className='inputs-flex'>

            <InputUpload
                multiple={true}
                label="Arquivos"
                typeFile="file"
                maxSizeMB={1536}
                value={files}
                onChange={(e) => setFiles(e)}
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