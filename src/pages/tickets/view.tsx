import { useParams } from 'react-router-dom'
import { IconSolicitation } from '../../assets/icons'
import { BreadCrumbAuthLayout } from '../../components/layouts/auth/breadcrumb'
import * as S from './styles'

export default function TicketView() {

    const { id } = useParams();

    return (
        <S.Container>
            <BreadCrumbAuthLayout
                data={[
                    {
                        name: 'Solicitações',
                        icon: <IconSolicitation />,
                        redirect: `/tickets`
                    },
                    {
                        name: `Solicitação ${id}`,
                        icon: <IconSolicitation />,
                        redirect: `/tickets/${id}`
                    }
                ]}
            />

            <div className='content-page'>
            </div>
        </S.Container>

    )
}