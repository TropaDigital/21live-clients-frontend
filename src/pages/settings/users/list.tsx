import { useEffect, useState } from 'react'

import { TableDefault } from '../../../components/UI/table/table-default'
import { AvatarUser } from '../../../components/UI/avatar/avatar-user'

import { UserService } from '../../../core/services/UserService'

import type { IUser } from '../../../core/types/iUser'
import * as S from './styles'
import moment from 'moment'
import { ButtonDefault } from '../../../components/UI/form/button-default'
import { InputCheckbox } from '../../../components/UI/form/input-checkbox'
import { IconPencil, IconPlus, IconProfile, IconTrash } from '../../../assets/icons'
import { type ISubmenuSelect } from '../../../components/UI/submenu-select'
import { useRedirect } from '../../../core/hooks/useRedirect'
import { useParams } from 'react-router-dom'
import { FormUserProfile } from '../../../components/modules/form-user-profile'
import { ModalConfirm } from '../../../components/UI/modal/modal-confirm'
import { BtnsActionTable } from '../../../components/UI/table/btns-action'

export default function SettingsListUsers({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { id } = useParams();
    const { redirectSlug } = useRedirect();

    const TABLE_HEAD = [
        {
            name: 'Nome',
            value: 'name',
            order: true,
        },
        {
            name: 'Tipo',
            value: 'role_title',
        },
        {
            name: 'Usuário',
            value: 'username',
            order: true,
        },
        {
            name: 'E-mail',
            value: 'email',
            order: true,
        },
        {
            name: 'Unidade Principal',
            value: 'organization_name',
        },
        {
            name: 'Data de Criação',
            value: 'created',
            order: true,
        },
        {
            name: '',
            value: '',
            width: 80,
        }
    ]

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IUser[]>([])

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
        const response = await UserService.get(pagination.page, pagination.limit, search, order, deleted)
        setPagination({ page, limit, total: response.total, total_show: response.items.length })
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData(pagination.page, pagination.limit, search, order, deleted);
    }, [pagination.page, pagination.limit, search, order, deleted])

    const handleSaveEdit = (item: IUser) => {
        setData([...data.map((row) => {
            return row.user_id === item.user_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(<IconProfile />, item.name, `/settings/users/${item.user_id}`);
    }

    const handleSaveNew = () => {
        getData(pagination.page, pagination.limit, search, order, deleted);
        redirectSlug(`/settings/users`)
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        await UserService.delete(Number(DTODelete));
        getData(pagination.page, pagination.limit, search, order, deleted);
        setDTODelete(null)
        setLoadingDelete(false);
    }

    return (
        <S.Container>

            {(id && id !== 'new') &&
                <FormUserProfile
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(<IconProfile />, item.name, `/settings/users/${item.user_id}`)}
                    id={Number(id)} admin={true}
                />
            }

            {id === 'new' &&
                <FormUserProfile
                    onSubmit={handleSaveNew}
                    onLoad={(item) => addBreadCrumb(<IconProfile />, item.name, `/settings/users/${item.user_id}`)}
                    id={null} admin={true}
                />
            }

            {!id &&
                <div className='list'>
                    <div className='head-setting'>
                        <h1>Usuários</h1>
                        <div className='buttons'>
                            <InputCheckbox checked={deleted} label='Arquivados' onChange={() => !loading && setDeleted(!deleted)} />
                            <ButtonDefault onClick={() => redirectSlug(`/settings/users/new`)} icon={<IconPlus />}>Novo Usuário</ButtonDefault>
                        </div>
                    </div>
                    <ModalConfirm
                        title="Atenção"
                        description={"Você deseja realmente arquivar esse usuario?"}
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
                        download={'usuarios'}
                        getDataDownload={() => UserService.get(pagination.page, 99999999, search, order, deleted)}
                        order={order}
                        loading={loading}
                        pagination={pagination}
                        tbody={<RenderTBody onDelete={setDTODelete} data={data} />}
                    />
                </div>
            }

        </S.Container>
    )
}

const RenderTBody = ({ data, onDelete }: { data: IUser[], onDelete(id: number): void }) => {
    return (
        <tbody>
            {data.map((row, index) =>
                <RenderTDUser onDelete={onDelete} key={`td-user-${row.user_id}-${index}`} row={row} />
            )}
        </tbody>
    )
}

const RenderTDUser = ({ row, onDelete }: { row: IUser, onDelete(id: number): void }) => {

    const { redirectSlug } = useRedirect()

    const submenu: ISubmenuSelect[] = [
        {
            name: 'Editar',
            icon: <IconPencil />,
            onClick: () => redirectSlug(`settings/users/${row.user_id}`),
            permission: 'users_edit',
        },
        {
            name: 'Remover',
            icon: <IconTrash />,
            onClick: () => onDelete(row.user_id),
            permission: 'users_delete'
        }
    ]

    return (
        <tr key={`user-${row.user_id}`}>
            <td>
                <div className='user'>
                    <AvatarUser
                        name={row.name}
                        image={row.avatar ?? ''}
                        size={35}
                        fontSize={15}
                    />
                    <span>
                        {row.name}
                    </span>
                </div>
            </td>
            <td>
                {row.role_title}
            </td>
            <td>
                {row.username}
            </td>
            <td>
                {row.email}
            </td>
            <td>
                {row.organization_name}
            </td>
            <td>
                {moment(row.created).format('DD/MM/YYYY HH:mm')}
            </td>
            <td>
                <BtnsActionTable submenu={submenu} />
            </td>
        </tr>
    )
}