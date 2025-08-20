import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//core hooks
//import { useAuth } from '../../../core/contexts/AuthContext'
//import { useRedirect } from '../../../core/hooks/useRedirect'

//services types
import { TicketService } from '../../../core/services/TicketService'
import type { ITicketCat } from '../../../core/types/ITckets'

//components
import { InputCheckbox } from '../../../components/UI/form/input-checkbox'
import { FormTicketFields } from '../../../components/modules/form-ticket-fields'

//styles
import * as S from './styles'
import { IconPencil } from '../../../assets/icons'
//import { useTenant } from '../../../core/contexts/TenantContext'
import { LinkSlug } from '../../../core/utils/link-slug'

const CONFIG_PAGE_EDIT = {
    title: 'Formulários',
    name: 'Formulário',
    url: 'ticket-forms',
    permission_edit: 'fields_edit',
    icon_breadcrumb: <IconPencil />,
    FormEdit: FormTicketFields,
}

export default function SettingsTicketsForms({ addBreadCrumb }: { addBreadCrumb(icon: any, name: string, redirect: string): void }) {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ITicketCat[]>([])

    const getData = async () => {
        setLoading(true);
        const response = await TicketService.getCats()
        setData([...response.items]);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [])

    const handleSaveEdit = (item: ITicketCat) => {
        setData([...data.map((row) => {
            return row.ticket_cat_id === item.ticket_cat_id ? { ...row, ...item } : row
        })])
        addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_cat_id}`);
    }

    return (
        <S.Container>

            {(id && id !== 'new') &&
                <CONFIG_PAGE_EDIT.FormEdit
                    admin={true}
                    onSubmit={handleSaveEdit}
                    onLoad={(item) => addBreadCrumb(CONFIG_PAGE_EDIT.icon_breadcrumb, item.title, `/settings/${CONFIG_PAGE_EDIT.url}/${item.ticket_cat_id}`)}
                    id={Number(id)}
                />
            }

            {!id &&
                <div className='list'>
                    <div className='head-setting'>
                        <h1>{CONFIG_PAGE_EDIT.title}</h1>
                    </div>
                    <div className='list-forms'>
                        {loading && <div>loading</div>}
                        {data.map((item) =>
                            <CardForm
                                item={item}
                                key={`form-${item.ticket_cat_id}`}
                            />
                        )}
                    </div>
                </div>
            }

        </S.Container>
    )
}

const CardForm = ({ item }: { item: ITicketCat }) => {

    return (
        <S.ContainerCard>
            <div className='preview'>
                <InputCheckbox
                    label='Título'
                    checked={item.use_title}
                    onChange={() => { }}
                    disabled
                />
                <InputCheckbox
                    label='Campos padrões'
                    checked={item.default_fields}
                    onChange={() => { }}
                    disabled
                />
                <InputCheckbox
                    label='Imagens de Referência'
                    checked={item.allow_files}
                    onChange={() => { }}
                    disabled
                />
                <InputCheckbox
                    label='Formato de Peça'
                    checked={item.use_media}
                    onChange={() => { }}
                    disabled
                />
                <InputCheckbox
                    label='Formato de Peça'
                    checked={item.use_media}
                    onChange={() => { }}
                    disabled
                />
            </div>
            <div className='infos'>
                <LinkSlug path={`/settings/ticket-forms/${item.ticket_cat_id}`}>
                    {item.title}
                </LinkSlug>
            </div>
        </S.ContainerCard>
    )
}