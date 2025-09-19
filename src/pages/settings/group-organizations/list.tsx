import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//core hooks
import { useAuth } from '../../../core/contexts/AuthContext'
import { useRedirect } from '../../../core/hooks/useRedirect'

//services types
import { OrganizationService } from '../../../core/services/OrganizationService'
import type { IOrganizationGroup } from '../../../core/types/IOrganization'

//components
import { TableDefault } from '../../../components/UI/table/table-default'
import { ButtonDefault } from '../../../components/UI/form/button-default'
import { type ISubmenuSelect } from '../../../components/UI/submenu-select'
import { ModalConfirm } from '../../../components/UI/modal/modal-confirm'
import { BtnsActionTable } from '../../../components/UI/table/btns-action'
import { FormGroupOrganization } from '../../../components/modules/form-group-organization'

//styles
import * as S from './styles'
import { IconHome, IconPencil, IconPlus, IconTrash } from '../../../assets/icons'

const CONFIG_PAGE_EDIT = {
    title: 'Grupos de Unidades',
    name: 'Grupo de Unidade',
    url: 'organizations-group',
    button_new: 'Novo Grupo de Unidades',
    permission_add: 'orggroups_add',
    permission_edit: 'orggroups_edit',
    permission_remove: 'orggroups_delete',
    icon_breadcrumb: <IconHome />,
    FormEdit: FormGroupOrganization,
}

export default function SettingsListGroupOrganizations({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { verifyPermission } = useAuth();
    const { id } = useParams();
    const { redirectSlug } = useRedirect();

    const TABLE_HEAD = [
        {
            name: 'Titulo',
            value: 'title',
            order: true,
        },
        {
            name: 'Descrição',
            value: 'description',
        },
        {
            name: '',
            value: '',
            width: 80,
        }
    ]

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IOrganizationGroup[]>([])

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [DTODelete, setDTODelete] = useState<number | null>(null)

    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('-created')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_show: 0,
    })

    const getData = async (page: number, limit: number, search: string, order: string) => {
        setLoading(true);
        const response = await OrganizationService.getGroup(pagination.page, pagination.limit, search, order)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order);
    }, [pagination.page, pagination.limit, search, order])

    const handleSaveEdit = (item: IOrganizationGroup) => {
        setData([...data.map((row) => {
            return row.orggroup_id === item.orggroup_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.orggroup_id}`);
    }

    const handleSaveNew = () => {
        getData(pagination.page, pagination.limit, search, order);
        redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}`)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await OrganizationService.delete(Number(DTODelete));
        getData(pagination.page, pagination.limit, search, order);
        setDTODelete(null)
        setLoadingDelete(false);
    }

    return (
        <S.Container>

            {(id && id !== 'new') &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.orggroup_id}`)}
                    id={Number(id)}
                />
            }

            {id === 'new' &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveNew}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.orggroup_id}`)}
                    id={null}
                />
            }

            {!id &&
                <div className='list'>
                    <div className='head-setting'>
                        <h1>{CONFIG_PAGE_EDIT.title}</h1>
                        <div className='buttons'>
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
                        getDataDownload={() => OrganizationService.get(pagination.page, 99999999, search, order)}
                        order={order}
                        loading={loading}
                        pagination={pagination}
                        tbody={
                            <tbody>
                                {data.map((row, index) =>
                                    <RenderTD onDelete={setDTODelete} key={`td-row-${row.orggroup_id}-${index}`} row={row} />
                                )}
                            </tbody>
                        }
                    />
                </div>
            }

        </S.Container>
    )
}

const RenderTD = ({ row, onDelete }: { row: IOrganizationGroup, onDelete(id: number): void }) => {

    const { redirectSlug } = useRedirect();

    const submenu: ISubmenuSelect[] = [
        {
            name: 'Editar',
            icon: <IconPencil />,
            onClick: () => redirectSlug(`settings/${CONFIG_PAGE_EDIT.url}/${row.orggroup_id}`),
            permission: CONFIG_PAGE_EDIT.permission_edit,
        },
        {
            name: 'Excluir',
            icon: <IconTrash />,
            onClick: () => onDelete(row.orggroup_id),
            permission: CONFIG_PAGE_EDIT.permission_remove
        }
    ]

    return (
        <tr key={`tr-${row.orggroup_id}`}>
            <td>
                {row.title}
            </td>
            <td>
                {row.description}
            </td>
            <td>
                <BtnsActionTable submenu={submenu} />
            </td>
        </tr>
    )
}