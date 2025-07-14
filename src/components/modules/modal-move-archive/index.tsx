import { useEffect, useState } from 'react'
import { ModalDefault } from '../../UI/modal/modal-default'

import type { IFolderFileItem } from '../../../core/types/iFolder'
import { ButtonDefault } from '../../UI/form/button-default'
import { ModalConfirm } from '../../UI/modal/modal-confirm'

import * as S from './styles'
import { FolderTree, type IFolderTree } from '../folder-tree'
import { FoldersService } from '../../../core/services/FoldersService'
import { useAlert } from '../../../core/contexts/AlertContext'
import { FilesService } from '../../../core/services/FilesService'


export const ModalMoveArchive = ({
    item,
    folder_id,
    opened,
    onClose,
    onSave,
}: {
    item: IFolderFileItem[]
    folder_id: string | undefined;
    opened: boolean;
    onClose(): void;
    onSave(id: number): void;
}) => {


    const { addAlert } = useAlert()

    const [loadingSave, setLoadingSave] = useState(false);

    const [modalConfirm, setModalConfirm] = useState(false);
    const [DTOEdit, setDTOEdit] = useState(false);

    const [loadingTree, setLoadingTree] = useState(false);
    const [dataTree, setDataTree] = useState<Record<string, IFolderTree[]>>({});

    const [DTO, setDTO] = useState({ folder_id: folder_id })

    useEffect(() => {
        setDTO({ folder_id: folder_id })
    }, [item])

    const onChangeDTO = (name: string, value: any) => {
        setDTO({ ...DTO, [name]: value });
        setDTOEdit(true);
    }

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
        if (opened == true) {
            getDataTree();
        } else {
            setDataTree({})
        }
    }, [opened])


    const handleOnSave = async () => {
        try {

            setLoadingSave(true);
            for (const folder of item) {
                onSave(Number(folder.file_id));
                await FilesService.set({
                    ...folder,
                    folder_id: DTO.folder_id ? Number(DTO.folder_id) : null,
                });
            }

            addAlert('success', 'Sucesso', 'Arquivos movidos com sucesso.');
            onClose()
        } catch (error: any) {
            setLoadingSave(false)
            addAlert('error', 'Ops', error.message);
        }
    }

    return (
        <>
            <ModalDefault
                layout="right"
                title={`Mover Arquivo(s)`}
                onClose={onCloseModal}
                opened={opened}
                padding={'0px'}
                paddingHeader={'20px 40px'}
            >
                <S.Container>

                    <RenderTabMove loading={loadingTree} tree={dataTree} DTO={DTO} onChangeDTO={onChangeDTO} />

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