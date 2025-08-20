import { useEffect, useState } from 'react'
import { InputDefault } from '../../UI/form/input-default'
import { SelectDefault } from '../../UI/form/select-default'
import { ModalDefault } from '../../UI/modal/modal-default'

import type { IFolder } from '../../../core/types/iFolder'
import { IconEye, IconEyeClose, IconHome, IconProfile, IconSort, IconTextRename, IconUnits } from '../../../assets/icons'
import { LIST_ICONS } from '../../../core/constants/icons'
import { LIST_ORDER_FOLDER } from '../../../core/constants/order'
import { InputCheckbox } from '../../UI/form/input-checkbox'
import { ButtonDefault } from '../../UI/form/button-default'
import { ModalConfirm } from '../../UI/modal/modal-confirm'
import { FoldersService } from '../../../core/services/FoldersService'
import { TabsDefault } from '../../UI/tabs-default'
import { useTenant } from '../../../core/contexts/TenantContext'
import { SelectMultiple, type IOptionSelect } from '../../UI/form/select-multiple'
import { FolderTree, type IFolderTree } from '../folder-tree'

import * as S from './styles'
import { CardHelp } from '../../UI/card-help'
import { useAlert } from '../../../core/contexts/AlertContext'
import { useAuth } from '../../../core/contexts/AuthContext'

interface IPropsEditFolder extends IFolder {
    organizations?: IOptionSelect[]
    organizationsGroup?: IOptionSelect[]
    users?: IOptionSelect[]
}

export const ModalEditFolder = ({
    item,
    opened,
    onClose,
    onDelete,
    onSave,
}: {
    opened: boolean;
    onClose(): void;
    onDelete(id: number): void;
    onSave(item: IFolder): void;
    item: IFolder
}) => {

    const { addAlert } = useAlert();
    const { organizations, organizationsGroup, users } = useTenant();
    const { getMenus } = useAuth();

    const TABS_EDIT = ["Informações Básicas", "Permissões", "Local da Pasta"];

    const [loadingSave, setLoadingSave] = useState(false);

    const [modalConfirm, setModalConfirm] = useState(false);
    const [DTOEdit, setDTOEdit] = useState(false);

    const [loadingTree, setLoadingTree] = useState(false);
    const [dataTree, setDataTree] = useState<Record<string, IFolderTree[]>>({});

    const [tab, setTab] = useState('Informações Básicas');

    const [DTO, setDTO] = useState<IPropsEditFolder>({
        ...item
    })

    const [loadingPermissions, setLoadingPermissions] = useState(false)
    const [DTOPermissions, setDTOPermissions] = useState<{
        organizations: number[];
        orggroups: number[];
        users: number[];
    }>({
        organizations: [],
        orggroups: [],
        users: [],
    })

    const handleOnSave = async () => {
        try {
            if (!DTO.name) throw new Error('O nome da pasta é obrigatório');
            setLoadingSave(true);
            const response = await FoldersService.update({ ...DTO })
            await FoldersService.setPermissions({
                folder_id: DTO.folder_id,
                organizations: DTO.organizations ? DTO.organizations.map((item) => {
                    return Number(item.value)
                }) : [],
                orggroups: DTO.organizationsGroup ? DTO.organizationsGroup.map((item) => {
                    return Number(item.value)
                }) : [],
                users: DTO.users ? DTO.users.map((item) => {
                    return Number(item.value)
                }) : []
            })
            onSave(response.item);
            setDTOEdit(false);
            onClose();
            setLoadingSave(false);
            if (DTO.parent_id !== item.parent_id) onDelete(item.folder_id)
            if ((DTO.menulink !== item.menulink) || (!item.folder_id && DTO.menulink)) {
                getMenus()
            }
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
        } catch (error: any) {
            setLoadingSave(false)
            addAlert('error', 'Ops', error.message);
        }
    }

    useEffect(() => {
        setDTO({
            ...item,
            organizations: [],
            organizationsGroup: [],
            users: [],
        })
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

    const getDataPermissions = async () => {
        setLoadingPermissions(true);
        const response = await FoldersService.getPermissions(item.folder_id);
        const folderPermission = response.item.permissions;
        setDTOPermissions({ organizations: folderPermission.organizations, orggroups: folderPermission.orggroups, users: folderPermission.users })
        setLoadingPermissions(false);
    }

    useEffect(() => {
        if (DTOPermissions.organizations.length > 0 && organizations.length > 0) {
            const newDTO = organizations
                .filter((obj) => DTOPermissions.organizations.includes(obj.organization_id))
                .map((row) => ({
                    name: row.name,
                    value: String(row.organization_id),
                }));
            setDTO((prev) => ({ ...prev, organizations: newDTO }));
        }
    }, [DTOPermissions.organizations, organizations]);

    useEffect(() => {
        if (DTOPermissions.orggroups.length > 0 && organizationsGroup.length > 0) {
            const newDTO = organizationsGroup
                .filter((obj) => DTOPermissions.orggroups.includes(obj.orggroup_id))
                .map((row) => ({
                    name: row.title,
                    value: String(row.orggroup_id),
                }));
            setDTO((prev) => ({ ...prev, organizationsGroup: newDTO }));
        }
    }, [DTOPermissions.orggroups, organizationsGroup]);

    useEffect(() => {
        if (DTOPermissions.users.length > 0 && users.length > 0) {
            const newDTO = users
                .filter((obj) => DTOPermissions.users.includes(obj.user_id))
                .map((row) => ({
                    name: row.name,
                    value: String(row.user_id),
                    avatar: row.avatar ?? '',
                }));
            setDTO((prev) => ({ ...prev, users: newDTO }));
        }
    }, [DTOPermissions.users, users]);

    const getDataTree = async () => {
        setLoadingTree(true);
        const response = await FoldersService.getTree();
        setDataTree({ ...response.items })
        setLoadingTree(false);
    }

    useEffect(() => {
        if (opened == true) {
            getDataTree();
            getDataPermissions();
        } else {
            setDataTree({})
            setTab(TABS_EDIT[0])
        }
    }, [opened])

    return (
        <>
            <ModalDefault
                layout="right"
                title='Editar Pasta'
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

                    {tab === TABS_EDIT[0] && <RenderTabInfo DTO={DTO} onChangeDTO={onChangeDTO} />}
                    {tab === TABS_EDIT[1] && <RenderTabPermission loading={loadingPermissions} DTO={DTO} onChangeDTO={onChangeDTO} />}
                    {tab === TABS_EDIT[2] && <RenderTabMove tree={dataTree} loading={loadingTree} DTO={DTO} onChangeDTO={onChangeDTO} />}

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

const RenderTabInfo = ({ DTO, onChangeDTO }: {
    DTO: any;
    onChangeDTO(name: string, value: any): void;
}) => {
    return (
        <div className='inputs-flex'>
            <InputDefault
                label="Nome"
                value={DTO.name}
                onChange={(e) => onChangeDTO('name', e.target.value)}
                icon={<IconTextRename />}
            />
            <SelectDefault
                search={true}
                iconFont={DTO.icon}
                label="Icone"
                options={LIST_ICONS.map((item: any) => {
                    return {
                        name: item.label,
                        value: item.value,
                        iconFont: item.value,
                    }
                })}
                onChange={(e) => onChangeDTO('icon', e.value)}
                value={{
                    value: LIST_ICONS.filter((obj: any) => obj.value === DTO.icon)[0]?.value ?? '',
                    name: LIST_ICONS.filter((obj: any) => obj.value === DTO.icon)[0]?.label ?? '',
                }}
            />
            <SelectDefault
                icon={<IconSort />}
                label="Ordem padrão dos arquivos da pasta"
                options={LIST_ORDER_FOLDER}
                onChange={(e) => onChangeDTO('listOrder', e.value)}
                value={LIST_ORDER_FOLDER.filter((obj) => obj.value === DTO.listOrder)[0] ?? ''}
            />
            <InputCheckbox label='Adicionar ao menu lateral' checked={DTO.menulink} onChange={() => onChangeDTO('menulink', !DTO.menulink)} />
        </div>
    )
}

const RenderTabPermission = ({ loading, DTO, onChangeDTO }: {
    loading: boolean;
    DTO: any;
    onChangeDTO(name: string, value: any): void;
}) => {

    const {
        getOrganizations,
        organizations,
        loadingOrganization,
        getOrganizationsGroup,
        organizationsGroup,
        loadingOrganizatonsGroup,
        getUsers,
        users,
        loadingUsers
    } = useTenant();

    const LIST_ACCESS = [
        {
            name: 'Público',
            value: 'public',
            icon: <IconEye />
        },
        {
            name: 'Privado',
            value: 'private',
            icon: <IconEyeClose />
        }
    ]

    const LIST_ORGANIZATIONS = organizations.map((item) => {
        return {
            name: item.name,
            value: String(item.organization_id)
        }
    })

    const LIST_ORGANIZATIONS_GROUP = organizationsGroup.map((item) => {
        return {
            name: item.title,
            value: String(item.orggroup_id)
        }
    })

    const LIST_USERS = users.map((item) => {
        return {
            name: `${item.name}`,
            value: String(item.user_id),
            avatar: item.avatar ?? undefined
        }
    })

    useEffect(() => {
        if (organizations.length === 0) {
            getOrganizations();
        }
        if (organizationsGroup.length === 0) {
            getOrganizationsGroup();
        }
        if (users.length === 0) {
            getUsers();
        }
    }, [])

    return (
        <div className='inputs-flex'>
            <SelectDefault
                icon={<IconEye />}
                label="Acesso"
                options={LIST_ACCESS}
                onChange={(e) => onChangeDTO('access', e.value)}
                value={LIST_ACCESS.filter((obj) => obj.value === DTO.access)[0]}
            />

            <SelectMultiple
                search={true}
                loading={loadingOrganization || loading}
                icon={<IconHome />}
                label="Unidades"
                options={LIST_ORGANIZATIONS}
                onChange={(e) => onChangeDTO('organizations', e)}
                selecteds={DTO.organizations}
                position='left'
                onRefresh={getOrganizations}
            />

            <SelectMultiple
                search={true}
                loading={loadingOrganizatonsGroup || loading}
                icon={<IconUnits />}
                label="Grupos de Unidades"
                options={LIST_ORGANIZATIONS_GROUP}
                onChange={(e) => onChangeDTO('organizationsGroup', e)}
                selecteds={DTO.organizationsGroup}
                position='left'
                onRefresh={getOrganizationsGroup}
            />

            <SelectMultiple
                search={true}
                loading={loadingUsers || loading}
                icon={<IconProfile />}
                label="Usuários"
                options={LIST_USERS}
                onChange={(e) => onChangeDTO('users', e)}
                selecteds={DTO.users}
                position='left'
                onRefresh={getUsers}
            />

            <div style={{ marginTop: 15 }}>

                <CardHelp title='Como funciona'>
                    <li>
                        <b>Unidades</b>
                        <p>Unidades que podem visualizar a pasta e seus arquivos.</p>
                    </li>
                    <li>
                        <b>Grupo de Unidades</b>
                        <p>Grupos de Unidades que podem visualizar a pasta e seus arquivos.</p>
                    </li>
                    <li>
                        <b>Usuários</b>
                        <p>Usuário que tem acesso direto, indepentende da unidade para visualizar a pasta e seus arquivos.</p>
                    </li>
                </CardHelp>
            </div>
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
                onChange={(folder_id) => onChangeDTO('parent_id', folder_id)}
                data={tree}
                folder_id={DTO.parent_id}
            />
        </div>
    )
}