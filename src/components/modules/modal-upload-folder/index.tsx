import { useEffect, useState } from 'react'
import { ModalDefault } from '../../UI/modal/modal-default'

import type { IFolderFileItem, IFolderItem } from '../../../core/types/iFolder'
import { ButtonDefault } from '../../UI/form/button-default'
import { ModalConfirm } from '../../UI/modal/modal-confirm'

import * as S from './styles'
import { FolderTree, type IFolderTree } from '../folder-tree'
import { FoldersService } from '../../../core/services/FoldersService'
import { TabsDefault } from '../../UI/tabs-default'
import { useAlert } from '../../../core/contexts/AlertContext'
import { useTenant } from '../../../core/contexts/TenantContext'
import { FilesService } from '../../../core/services/FilesService'
import { InputUpload, type UploadResult } from '../../UI/form/input-upload'


export const ModalUploadFolder = ({
    opened,
    folder_id,
    onClose,
    onSave,
    onSaveFile,
}: {
    opened: boolean;
    folder_id: number | null;
    onClose(): void;
    onSave(item: IFolderItem): void;
    onSaveFile(item: IFolderFileItem): void;
}) => {

    const TABS_EDIT = ["Informações Básicas", "Local da Pasta"];

    const { addAlert } = useAlert()
    const { tenant } = useTenant();

    const [loadingSave, setLoadingSave] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressSizeText, setProgressSizeText] = useState('0 KB de 0 KB');

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

    interface FolderNode {
        name: string;
        path: string;
        children: FolderNode[];
    }

    function buildFolderTreeFromPaths(paths: string[]): FolderNode[] {
        const root: FolderNode[] = [];

        for (const fullPath of paths) {
            const parts = fullPath.split('/');
            let currentLevel = root;
            let currentPath = '';

            for (const part of parts) {
                currentPath = currentPath ? `${currentPath}/${part}` : part;

                let existing = currentLevel.find(folder => folder.name === part);

                if (!existing) {
                    existing = {
                        name: part,
                        path: currentPath,
                        children: [],
                    };
                    currentLevel.push(existing);
                }

                currentLevel = existing.children;
            }
        }

        return root;
    }

    const formatSize = (bytes: number): string => {
        const sizeInKB = bytes / 1024;
        return sizeInKB > 1024
            ? `${(sizeInKB / 1024).toFixed(2)} MB`
            : `${sizeInKB.toFixed(0)} KB`;
    };


    const handleOnSave = async () => {
        try {
            if (!files || files.files.length === 0) return;

            setLoadingSave(true);
            setProgressPercent(0);
            setProgressSizeText('0 KB');

            // 1. Constrói árvore de pastas
            const tree = buildFolderTreeFromPaths(files.folders);
            const folderMap: Record<string, number> = {}; // path => folder_id

            // 2. Cria as pastas recursivamente e preenche o folderMap
            const createFoldersRecursively = async (
                nodes: FolderNode[],
                parentId: number | null
            ) => {
                for (const node of nodes) {

                    const res = await FoldersService.new({
                        parent_id: parentId,
                        name: node.name,
                        tenant_id: tenant?.tenant_id ?? 0,
                    });

                    if (String(parentId) === String(folder_id)) {
                        onSave(res.item)
                    }

                    const folderId = res.item.folder_id;
                    folderMap[node.path] = folderId;

                    if (node.children.length > 0) {
                        await createFoldersRecursively(node.children, folderId);
                    }
                }
            };

            await createFoldersRecursively(tree, folder_id);

            // 3. Calcula total de bytes para exibir progresso real
            const totalBytes = files.files.reduce((sum, item) => sum + item.file.size, 0);
            let uploadedBytes = 0;

            // 4. Envia arquivos com progresso por upload
            for (const fil of files.files) {
                const folderPath = fil.folder;
                const targetFolderId = folderMap[folderPath];

                if (!targetFolderId) {
                    console.warn(`ID não encontrado para pasta "${folderPath}", ignorando ${fil.file.name}`);
                    continue;
                }

                const responseFile = await FilesService.set({
                    path: fil.file,
                    folder_id: targetFolderId,
                    tenant_id: tenant?.tenant_id,
                    name: fil.file.name,
                }, {
                    onUploadProgress: (progressEvent: ProgressEvent) => {
                        const currentFileProgress = progressEvent.loaded;
                        const estimatedUploaded = uploadedBytes + currentFileProgress;
                        const percent = (estimatedUploaded / totalBytes) * 100;

                        setProgressPercent(Math.round(percent));
                        setProgressSizeText(`${formatSize(estimatedUploaded)} de ${formatSize(totalBytes)}`);
                    },
                });

                if (targetFolderId === folder_id) {
                    onSaveFile(responseFile.item)
                }

                uploadedBytes += fil.file.size;
            }

            addAlert('success', 'Sucesso', 'Arquivos enviados com sucesso.');
            onClose();
        } catch (error: any) {
            setLoadingSave(false);
            console.log('error', error)
            addAlert('error', 'Ops', 'Não foi possível enviar os arquivos. Tente novamente mais tarde.');
        } finally {
            setLoadingSave(false);
        }
    };

    return (
        <>
            <ModalDefault
                layout="right"
                title={`Upload de Pastas`}
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
                                <p>Criando <b>{files?.folders.length}</b> pasta{files !== null && files?.folders.length > 1 ? 's' : ''}</p>
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
                label="Pasta"
                typeFile="folder"
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