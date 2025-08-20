import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//core hooks
import { useAuth } from '../../../core/contexts/AuthContext'
import { useRedirect } from '../../../core/hooks/useRedirect'

//services types
import { OrganizationService } from '../../../core/services/OrganizationService'
import type { IOrganization } from '../../../core/types/IOrganization'

//components
import { TableDefault } from '../../../components/UI/table/table-default'
import { AvatarUser } from '../../../components/UI/avatar/avatar-user'
import { ButtonDefault } from '../../../components/UI/form/button-default'
import { InputCheckbox } from '../../../components/UI/form/input-checkbox'
import { type ISubmenuSelect } from '../../../components/UI/submenu-select'
import { ModalConfirm } from '../../../components/UI/modal/modal-confirm'
import { FormOrganization } from '../../../components/modules/form-organization'
import { BtnsActionTable } from '../../../components/UI/table/btns-action'

//styles
import * as S from './styles'
import { IconHome, IconPencil, IconPlus, IconTrash } from '../../../assets/icons'

const CONFIG_PAGE_EDIT = {
    title: 'Unidades',
    name: 'Unidade',
    url: 'organizations',
    button_new: 'Nova Unidade',
    permission_add: 'organizations_add',
    permission_edit: 'organizations_edit',
    permission_remove: 'organizations_remove',
    icon_breadcrumb: <IconHome />,
    FormEdit: FormOrganization,
}

export default function SettingsListOrganizations({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { verifyPermission } = useAuth();
    const { id } = useParams();
    const { redirectSlug } = useRedirect();

    const TABLE_HEAD = [
        {
            name: 'Nome',
            value: 'name',
            order: true,
        },
        {
            name: 'CNPJ',
            value: 'cnpj',
        },
        {
            name: '',
            value: '',
            width: 80,
        }
    ]

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IOrganization[]>([])

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [DTODelete, setDTODelete] = useState<number | null>(null)

    const [deleted, setDeleted] = useState(false)
    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('-created')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_show: 0,
    })

    const getData = async (page: number, limit: number, search: string, order: string, deleted: boolean) => {
        setLoading(true);
        const response = await OrganizationService.get(pagination.page, pagination.limit, search, order, deleted)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order, deleted);
    }, [pagination.page, pagination.limit, search, order, deleted])

    const handleSaveEdit = (item: IOrganization) => {
        setData([...data.map((row) => {
            return row.organization_id === item.organization_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.organization_id}`);
    }

    const handleSaveNew = () => {
        getData(pagination.page, pagination.limit, search, order, deleted);
        redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}`)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await OrganizationService.delete(Number(DTODelete));
        getData(pagination.page, pagination.limit, search, order, deleted);
        setDTODelete(null)
        setLoadingDelete(false);
    }

    return (
        <S.Container>

            {(id && id !== 'new') &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.organization_id}`)}
                    id={Number(id)}
                />
            }

            {id === 'new' &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveNew}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.organization_id}`)}
                    id={null}
                />
            }

            {!id &&
                <div className='list'>
                    <div className='head-setting'>
                        <h1>{CONFIG_PAGE_EDIT.title}</h1>
                        <div className='buttons'>
                            <InputCheckbox checked={deleted} label='Arquivados' onChange={() => !loading && setDeleted(!deleted)} />
                            {verifyPermission(CONFIG_PAGE_EDIT.permission_add) &&
                                <ButtonDefault onClick={() => redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}/new`)} icon={<IconPlus />}>{CONFIG_PAGE_EDIT.button_new}</ButtonDefault>
                            }
                        </div>
                    </div>
                    <ModalConfirm
                        title="Atenção"
                        description={`Você deseja realmente arquivar ${CONFIG_PAGE_EDIT.name}?`}
                        type="danger"
                        opened={DTODelete ? true : false}
                        onCancel={() => setDTODelete(null)}
                        onConfirm={handleDelete}
                        loading={loadingDelete}
                    />
                    <TableDefault
                        thead={TABLE_HEAD}
                        onSearch={(value) => setSearch(value)}
                        onSort={(value) => setOrder(value)}
                        onPaginate={(page) => setPagination((prev) => ({ ...prev, page }))}
                        onLimit={(limit) => setPagination((prev) => ({ ...prev, limit }))}
                        download={CONFIG_PAGE_EDIT.name}
                        getDataDownload={() => OrganizationService.get(pagination.page, 99999999, search, order, deleted)}
                        order={order}
                        loading={loading}
                        pagination={pagination}
                        tbody={
                            <tbody>
                                {data.map((row, index) =>
                                    <RenderTD onDelete={setDTODelete} key={`td-row-${row.organization_id}-${index}`} row={row} />
                                )}
                            </tbody>
                        }
                    />
                </div>
            }

        </S.Container>
    )
}

const RenderTD = ({ row, onDelete }: { row: IOrganization, onDelete(id: number): void }) => {

    const { redirectSlug } = useRedirect();

    const submenu: ISubmenuSelect[] = [
        {
            name: 'Editar',
            icon: <IconPencil />,
            onClick: () => redirectSlug(`settings/${CONFIG_PAGE_EDIT.url}/${row.organization_id}`),
            permission: CONFIG_PAGE_EDIT.permission_edit,
        },
        {
            name: 'Remover',
            icon: <IconTrash />,
            onClick: () => onDelete(row.organization_id),
            permission: CONFIG_PAGE_EDIT.permission_remove
        }
    ]

    return (
        <tr key={`tr-${row.organization_id}`}>
            <td>
                <div className='user'>
                    <AvatarUser
                        name={row.name}
                        image={row.images?.logo ?? ''}
                        size={35}
                        fontSize={15}
                    />
                    <span>
                        {row.name}
                    </span>
                </div>
            </td>
            <td>
                {row.cnpj ?? '--'}
            </td>
            <td>
                <BtnsActionTable submenu={submenu} />
            </td>
        </tr>
    )
}