import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//core hooks
import { useAuth } from '../../../core/contexts/AuthContext'
import { useRedirect } from '../../../core/hooks/useRedirect'

//services types
import { TicketService } from '../../../core/services/TicketService'
import type { ITicketCat } from '../../../core/types/ITckets'

//components
import { TableDefault } from '../../../components/UI/table/table-default'
import { ButtonDefault } from '../../../components/UI/form/button-default'
import { type ISubmenuSelect } from '../../../components/UI/submenu-select'
import { ModalConfirm } from '../../../components/UI/modal/modal-confirm'
import { BtnsActionTable } from '../../../components/UI/table/btns-action'
import { FormTicketCat } from '../../../components/modules/form-ticket-cat'

//styles
import * as S from './styles'
import { IconClone, IconHome, IconPencil, IconPlus, IconTag, IconTrash } from '../../../assets/icons'
import { ModalDefault } from '../../../components/UI/modal/modal-default'
import { useTenant } from '../../../core/contexts/TenantContext'
import type { ITenant } from '../../../core/types/iTenants'
import { TenantService } from '../../../core/services/TenantService'
import { SelectMultiple, type IOptionSelect } from '../../../components/UI/form/select-multiple'
import { CardTenant } from '../../../components/modules/cards/card-tenant'
import { useAlert } from '../../../core/contexts/AlertContext'

const CONFIG_PAGE_EDIT = {
    title: 'Formularios',
    name: 'Formulario',
    url: 'ticket-forms',
    button_new: 'Novo Formulário',
    permission_add: 'ticket_cats_add',
    permission_edit: 'ticket_cats_edit',
    permission_remove: 'ticket_cats_delete',
    icon_breadcrumb: <IconTag />,
    FormEdit: FormTicketCat,
}

export default function SettingsTicketsForms({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { addAlert } = useAlert();
    const { tenant } = useTenant();
    const { verifyPermission } = useAuth();
    const { id } = useParams();
    const { redirectSlug } = useRedirect();

    const TABLE_HEAD = [
        {
            name: 'Ordem',
            value: 'ordem',
            width: 10,
        },
        {
            name: 'Titulo',
            value: 'title',
            order: true
        },
        {
            name: '',
            value: '',
            width: 80,
        }
    ]

    const [loadingTenantChildren, setLoadingTenantChildren] = useState(false);
    const [tenantsChildren, setTenantsChildren] = useState<ITenant[]>([])

    const [modalDuplicate, setModalDuplicate] = useState(false)
    const [loadingSubmitDuplicate, setLoadingSubmitDuplicate] = useState(false);
    const [DTOModalDuplicate, setDTOModalDuplicate] = useState<ITicketCat>({} as ITicketCat);
    const [DTOListModalDuplicate, setDTOListModalDuplicate] = useState<IOptionSelect[]>([]);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ITicketCat[]>([])

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
        const response = await TicketService.getCats(pagination.page, pagination.limit, search, order)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    const getTenantsChildren = async () => {
        setLoadingTenantChildren(true);
        const response = await TenantService.getById(tenant?.tenant_id ?? 0);
        setTenantsChildren([response.item, ...response.item.children])
        setLoadingTenantChildren(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order);
        getTenantsChildren();
    }, [pagination.page, pagination.limit, search, order])

    const handleSaveEdit = (item: ITicketCat) => {
        setData([...data.map((row) => {
            return row.ticket_cat_id === item.ticket_cat_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_cat_id}`);
    }

    const handleSaveNew = () => {
        getData(pagination.page, pagination.limit, search, order);
        redirectSlug(`/settings/${CONFIG_PAGE_EDIT.url}`)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await TicketService.deleteCat(Number(DTODelete));
        getData(pagination.page, pagination.limit, search, order);
        setDTODelete(null)
        setLoadingDelete(false);
    }

    const handleSubmitDuplicate = async (ticket_cat_id?: number, ids?: number[]) => {
        try {
            setLoadingSubmitDuplicate(true);
            const response = await TicketService.duplicateCat(ticket_cat_id ? ticket_cat_id : DTOModalDuplicate.ticket_cat_id, ids ? ids : DTOListModalDuplicate.map((row) => {
                return Number(row.value)
            }))

            const findInMyTenant = response.items.filter((obj: ITicketCat) => obj.tenant_id === tenant?.tenant_id)

            if (findInMyTenant.length > 0) {

                const myForm = findInMyTenant[0];

                myForm.ordem = 1;
                myForm.title = myForm.title + ' Cópia';
                myForm.use_title = myForm.use_title === 1 ? true : false;
                myForm.setas_default = myForm.setas_default === 1 ? true : false;
                myForm.default_fields = myForm.default_fields === 1 ? true : false;
                myForm.allow_files = myForm.allow_files === 1 ? true : false;
                myForm.use_media = myForm.use_media === 1 ? true : false;
                myForm.jobs = myForm.jobs === 1 ? true : false;
                myForm.id = myForm.ticket_cat_id;

                await TicketService.setCat({ ...myForm })

                const newData = [myForm]
                data.forEach((item) => {
                    item.ordem++;
                    newData.push(item)
                })
                setData([...newData])
            }

            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
            setModalDuplicate(false);
            setDTOListModalDuplicate([])
            setLoadingSubmitDuplicate(false)
        } catch (error) {
            setLoadingSubmitDuplicate(false)
        }
    }

    //tenants
    const LIST_TENANTS = tenantsChildren.map((item) => {
        return {
            name: item.name,
            value: String(item.tenant_id)
        }
    })

    //get info unique tenant
    const getTenantById = (id: number) => {
        return tenantsChildren.find((obj) => obj.tenant_id === id)
    }

    const onCloseModalDuplicate = () => {
        setModalDuplicate(false);
        setDTOListModalDuplicate([])
    }

    const handleDuplicate = async (item: ITicketCat) => {
        if (tenant?.jobs) {
            setModalDuplicate(true);
            setDTOModalDuplicate({ ...item })
        } else {
            setLoading(true);
            setDTOModalDuplicate({ ...item })
            await handleSubmitDuplicate(item.ticket_cat_id, [tenant?.tenant_id ?? 0]);
            setLoading(false)
        }
    }

    return (
        <S.Container>

            <ModalDefault layout='center' opened={modalDuplicate} title='Clonar Formulário' onClose={onCloseModalDuplicate}>

                <div className='search-tenant'>
                    {(verifyPermission(CONFIG_PAGE_EDIT.permission_add)) &&
                        <SelectMultiple
                            search={true}
                            loading={loadingTenantChildren}
                            icon={<IconHome />}
                            options={LIST_TENANTS}
                            onChange={(e) => setDTOListModalDuplicate([...e])}
                            selecteds={DTOListModalDuplicate}
                            position='left'
                        />
                    }
                </div>
                <div className='list-tenants'>
                    {loading &&
                        <CardTenant
                            name={''}
                            logo={''}
                            created={''}
                            loading={true}
                        />
                    }
                    {DTOListModalDuplicate.map((item) =>
                        <CardTenant
                            name={getTenantById(Number(item.value))?.name}
                            logo={getTenantById(Number(item.value))?.images?.touch ?? ''}
                            created={getTenantById(Number(item.value))?.created}
                            color={`#${getTenantById(Number(item.value))?.colorhigh}`}
                            colorBg={`#${getTenantById(Number(item.value))?.colormain}`}
                            colorText={`#${getTenantById(Number(item.value))?.colorsecond}`}
                            onRemove={() => setDTOListModalDuplicate([...DTOListModalDuplicate.filter((obj) => obj.value !== item.value)])}
                            loading={loading}
                        />
                    )}
                </div>
                {DTOListModalDuplicate.length > 0 &&
                    <div className="buttons-modal-internal">
                        <div>
                            <ButtonDefault
                                type='button'
                                variant="lightWhite"
                                onClick={() => onCloseModalDuplicate()}
                            >
                                Cancelar
                            </ButtonDefault>
                            <ButtonDefault
                                type='button'
                                variant="primary"
                                loading={loadingSubmitDuplicate}
                                onClick={() => {
                                    handleSubmitDuplicate();
                                }}
                            >
                                Confirmar
                            </ButtonDefault>
                        </div>
                    </div>
                }
            </ModalDefault>

            {(id && id !== 'new') &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_cat_id}`)}
                    id={Number(id)}
                />
            }

            {id === 'new' &&
                <CONFIG_PAGE_EDIT.FormEdit
                    onSubmit={handleSaveNew}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_cat_id}`)}
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
                        getDataDownload={() => TicketService.getCats(pagination.page, 99999999, search, order)}
                        order={order}
                        loading={loading}
                        pagination={pagination}
                        tbody={
                            <tbody>
                                {data.map((row, index) =>
                                    <RenderTD
                                        key={`td-row-${row.ticket_cat_id}-${index}`}
                                        onDuplicate={() => handleDuplicate(row)}
                                        onDelete={setDTODelete}
                                        row={row}
                                    />
                                )}
                            </tbody>
                        }
                    />
                </div>
            }

        </S.Container>
    )
}

const RenderTD = ({ row, onDelete, onDuplicate }: { row: ITicketCat, onDuplicate(): void; onDelete(id: number): void }) => {

    const { redirectSlug } = useRedirect();

    const submenu: ISubmenuSelect[] = [
        {
            name: 'Clonar Formulário',
            icon: <IconClone />,
            onClick: () => onDuplicate(),
            permission: CONFIG_PAGE_EDIT.permission_add,
        },
        {
            name: 'Editar',
            icon: <IconPencil />,
            onClick: () => redirectSlug(`settings/${CONFIG_PAGE_EDIT.url}/${row.ticket_cat_id}`),
            permission: CONFIG_PAGE_EDIT.permission_edit,
        },
        {
            name: 'Excluir',
            icon: <IconTrash />,
            onClick: () => onDelete(row.ticket_cat_id),
            permission: CONFIG_PAGE_EDIT.permission_remove
        }
    ]

    return (
        <tr key={`tr-${row.ticket_cat_id}`}>
            <td>
                <span className='td-id'>
                    #{row.ordem}
                </span>
            </td>
            <td>
                {row.title}
            </td>
            <td>
                {row.tenant_id !== 0 &&
                    <BtnsActionTable submenu={submenu} />
                }
            </td>
        </tr>
    )
}