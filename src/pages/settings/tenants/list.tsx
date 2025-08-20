import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//core hooks
import { useAuth } from '../../../core/contexts/AuthContext'
import { useRedirect } from '../../../core/hooks/useRedirect'

//services types
import { TenantService } from '../../../core/services/TenantService'
import type { ITenant } from '../../../core/types/iTenants'
import { type ISubmenuSelect } from '../../../components/UI/submenu-select'

//components
import { TableDefault } from '../../../components/UI/table/table-default'
import { AvatarTenant } from '../../../components/UI/avatar/avatar-tenant'
import { ButtonDefault } from '../../../components/UI/form/button-default'
import { ModalConfirm } from '../../../components/UI/modal/modal-confirm'
import { BtnsActionTable } from '../../../components/UI/table/btns-action'

//styles
import * as S from './styles'
import { IconHome, IconPencil, IconPlus, IconTrash, IconTree } from '../../../assets/icons'
import { FormTenant } from '../../../components/modules/form-tenant'
import { ModalTreeTenant } from '../../../components/modules/modal-tree-tenant'

const CONFIG_PAGE_EDIT = {
    title: 'Instâncias',
    name: 'Instância',
    url: 'tenants',
    button_new: 'Nova Instância',
    permission_add: 'tenants_add',
    permission_edit: 'tenants_edit',
    permission_remove: 'tenants_delete',
    icon_breadcrumb: <IconHome />,
    FormEdit: FormTenant,
}

export default function SettingsListTenants({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { verifyPermission } = useAuth();
    const { id } = useParams();
    const { redirectSlug } = useRedirect();

    const TABLE_HEAD = [
        {
            name: 'Titulo',
            value: 'name',
            order: true,
        },
        {
            name: 'Tipo',
            value: 'type',
        },
        {
            name: 'Endereço',
            value: 'slug',
            order: true,
        },
        {
            name: 'Cores',
            value: 'colors',
        },
        {
            name: 'Matriz',
            value: 'parent_name',
        },
        {
            name: '',
            value: '',
            width: 80,
        }
    ]

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ITenant[]>([])

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [DTODelete, setDTODelete] = useState<number | null>(null)

    const [showTree, setShowTree] = useState(false);

    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('name')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_show: 0,
    })

    const getData = async (page: number, limit: number, search: string, order: string) => {
        setLoading(true);
        const response = await TenantService.get(pagination.page, pagination.limit, search, order)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order);
    }, [pagination.page, pagination.limit, search, order])

    const handleSaveEdit = (item: ITenant) => {
        setData([...data.map((row) => {
            return row.tenant_id === item.tenant_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.tenant_id}`);
    }

    const handleSaveNew = () => {
        getData(pagination.page, pagination.limit, search, order);
        redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}`)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await TenantService.delete(Number(DTODelete));
        getData(pagination.page, pagination.limit, search, order);
        setDTODelete(null)
        setLoadingDelete(false);
    }

    return (
        <S.Container>

            <ModalTreeTenant opened={showTree} onClose={() => setShowTree(false)} />

            {(id && id !== 'new') &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.tenant_id}`)}
                    id={Number(id)}
                />
            }

            {id === 'new' &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveNew}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.name, `/settings/${CONFIG_PAGE_EDIT.url}/${item.tenant_id}`)}
                    id={null}
                />
            }

            {!id &&
                <div className='list'>
                    <div className='head-setting'>
                        <h1>{CONFIG_PAGE_EDIT.title}</h1>
                        <div className='buttons'>
                            <ButtonDefault onClick={() => setShowTree(true)} variant='lightWhite' icon={<IconTree />}>Estrutura de Árvore</ButtonDefault>
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
                        getDataDownload={() => TenantService.get(pagination.page, 99999999, search, order)}
                        order={order}
                        loading={loading}
                        pagination={pagination}
                        tbody={
                            <tbody>
                                {data.map((row, index) =>
                                    <RenderTD onDelete={setDTODelete} key={`td-row-${row.tenant_id}-${index}`} row={row} />
                                )}
                            </tbody>
                        }
                    />
                </div>
            }

        </S.Container>
    )
}

const RenderTD = ({ row, onDelete }: { row: ITenant, onDelete(id: number): void }) => {

    const { redirectSlug } = useRedirect();

    const submenu: ISubmenuSelect[] = [
        {
            name: 'Editar',
            icon: <IconPencil />,
            onClick: () => redirectSlug(`settings/${CONFIG_PAGE_EDIT.url}/${row.tenant_id}`),
            permission: CONFIG_PAGE_EDIT.permission_edit,
        },
        {
            name: 'Remover',
            icon: <IconTrash />,
            onClick: () => onDelete(row.tenant_id),
            permission: CONFIG_PAGE_EDIT.permission_remove
        }
    ]

    return (
        <tr>
            <td>
                <div className='user'>
                    <AvatarTenant
                        name={row.name}
                        image={row.images?.touch ?? ''}
                        size='small'
                        color={row.colorhigh}
                        colorBg={row.colormain}
                        colorText={row.colorsecond}
                    />
                    <span>
                        {row.name}
                    </span>
                </div>
            </td>
            <td>
                {row.type}
            </td>
            <td>
                <a href={`/${row.slug}`} target='_blank'>
                    /{row.slug}
                </a>
            </td>
            <td>
                <div className='row-gap'>
                    <div data-tooltip-id="tooltip" data-tooltip-content="Cor Primária" className='bullet' style={{ backgroundColor: row.colormain }} />
                    <div data-tooltip-id="tooltip" data-tooltip-content="Cor Secundária" className='bullet' style={{ backgroundColor: row.colorhigh }} />
                    <div data-tooltip-id="tooltip" data-tooltip-content="Cor Texto" className='bullet' style={{ backgroundColor: row.colorsecond }} />
                </div>
            </td>
            <td>
                {row.parent_name}
            </td>
            <td>
                <BtnsActionTable submenu={submenu} />
            </td>
        </tr>
    )
}