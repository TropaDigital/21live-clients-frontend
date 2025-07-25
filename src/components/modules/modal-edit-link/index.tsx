import { useEffect, useState } from 'react'
import { InputDefault } from '../../UI/form/input-default'
import { SelectDefault } from '../../UI/form/select-default'
import { ModalDefault } from '../../UI/modal/modal-default'

import type { IFolderLink } from '../../../core/types/iFolder'
import { ButtonDefault } from '../../UI/form/button-default'
import { ModalConfirm } from '../../UI/modal/modal-confirm'

import * as S from './styles'
import { FolderTree, type IFolderTree } from '../folder-tree'
import { FoldersService } from '../../../core/services/FoldersService'
import { TabsDefault } from '../../UI/tabs-default'
import { IconConfig, IconLink, IconSolicitation, IconTextRename } from '../../../assets/icons'
import { useAlert } from '../../../core/contexts/AlertContext'
import { LinkService } from '../../../core/services/LinkService'
import { LIST_ICONS } from '../../../core/constants/icons'
import { useTenant } from '../../../core/contexts/TenantContext'


export const ModalEditLink = ({
    item,
    opened,
    onClose,
    onDelete,
    onSave,
}: {
    opened: boolean;
    onClose(): void;
    onDelete(id: number): void;
    onSave(type: string, item: IFolderLink): void;
    item: IFolderLink
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

    const [DTO, setDTO] = useState<IFolderLink>({ ...item })

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
            if (!DTO.name) throw new Error('O nome do link é obrigatório');
            if (!DTO.type) throw new Error('O tipo do link é obrigatório');
            if (DTO.type === 'external' && !DTO.url) throw new Error('A URL é obrigatório');
            setLoadingSave(true);
            DTO.tenant_id = tenant?.tenant_id ?? 0;
            const response = await LinkService.set({ ...DTO })
            onSave(DTO.link_id ? 'update' : 'new', response.item);
            setDTOEdit(false);
            onClose();
            setLoadingSave(false);
            if (DTO.folder_id !== item.folder_id) onDelete(item.link_id)
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
        } catch (error: any) {
            setLoadingSave(false)
            addAlert('error', 'Ops', error.message);
        }
    }


    const onChangeType = (type: string, target_type: string) => {
        setDTO({ ...DTO, type, target_type })
    }

    return (
        <>
            <ModalDefault
                layout="right"
                title={`${item.link_id ? `Editar` : `Adicionar`} Link`}
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

                    {tab === TABS_EDIT[0] && <RenderTabInfo onChangeType={onChangeType} loading={loadingTree} tree={dataTree} DTO={DTO} onChangeDTO={onChangeDTO} />}
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

const RenderTabInfo = ({ loading, tree, DTO, onChangeDTO, onChangeType }: {

    DTO: any;
    onChangeDTO(name: string, value: any): void;

    onChangeType(type: string, target_type: string): void;

    loading: boolean;
    tree: Record<string, IFolderTree[]>
}) => {

    const LIST_TYPE = [
        {
            name: 'Link externo',
            value: 'external',
        },
        {
            name: 'Link interno',
            value: 'internal',
        }
    ]

    const LIST_TYPE_TARGET = [
        {
            name: 'Pasta',
            value: 'folder',
        },
        /**
         * 
        {
            name: 'Job',
            value: 'job',
        }
         */
    ]

    const VALUE_TYPE = {
        value: DTO.type ? LIST_TYPE.filter((obj: any) => obj.value === DTO.type)[0]?.value : '',
        name: DTO.type ? LIST_TYPE.filter((obj: any) => obj.value === DTO.type)[0]?.name : '',
    }

    const VALUE_TYPE_TARGET = {
        value: DTO.target_type ? LIST_TYPE_TARGET.filter((obj: any) => obj.value === DTO.target_type)[0]?.value : '',
        name: DTO.target_type ? LIST_TYPE_TARGET.filter((obj: any) => obj.value === DTO.target_type)[0]?.name : '',
    }

    useEffect(() => {
        if (!DTO.type && DTO.opened) {
            onChangeType('external', 'folder')
        }
    }, [DTO])

    return (
        <div className='inputs-flex'>
            <InputDefault
                label="Nome"
                value={DTO.name}
                onChange={(e) => onChangeDTO('name', e.target.value)}
                icon={<IconTextRename />}
            />

            <SelectDefault
                iconFont={DTO.type}
                label="Icone"
                icon={<IconConfig />}
                options={LIST_TYPE.map((item: any) => {
                    return {
                        name: item.name,
                        value: item.value,
                    }
                })}
                onChange={(e) => onChangeDTO('type', e.value)}
                value={VALUE_TYPE}
            />

            {DTO.type === 'external' ?
                <>
                    <SelectDefault
                        search={true}
                        iconFont={DTO.icon}
                        label="Icone"
                        options={LIST_ICONS.map((item: any) => {
                            return {
                                name: item.icon,
                                value: item.value,
                                iconFont: item.value,
                            }
                        })}
                        onChange={(e) => onChangeDTO('icon', e.value)}
                        value={{
                            value: LIST_ICONS.filter((obj: any) => obj.value === DTO.icon)[0]?.value ?? '',
                            name: LIST_ICONS.filter((obj: any) => obj.value === DTO.icon)[0]?.icon ?? '',
                        }}
                        key={`input-icon`}
                    />
                    <InputDefault
                        label="Endereço"
                        value={DTO.url}
                        onChange={(e) => onChangeDTO('url', e.target.value)}
                        icon={<IconLink />}
                        placeholder='https://exemplo.com'
                        key={`input-url`}
                    />
                </>
                :
                <>
                    <SelectDefault
                        iconFont={DTO.target_type}
                        label="Alvo do link"
                        icon={<IconConfig />}
                        options={LIST_TYPE_TARGET.map((item: any) => {
                            return {
                                name: item.name,
                                value: item.value,
                            }
                        })}
                        onChange={(e) => onChangeDTO('target_type', e.value)}
                        value={VALUE_TYPE_TARGET}
                        key={`input-target-type`}
                    />
                    {DTO.target_type === 'job' ?
                        <InputDefault
                            label="Job"
                            value={DTO.target_id}
                            onChange={(e) => onChangeDTO('target_id', e.target.value)}
                            icon={<IconSolicitation />}
                            placeholder='1234'
                            key={`input-job`}
                        />
                        :
                        <FolderTree
                            loading={loading}
                            onChange={(folder_id) => onChangeDTO('target_id', folder_id)}
                            data={tree}
                            folder_id={DTO.target_id}
                        />
                    }
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