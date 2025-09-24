import { useState } from 'react'
import { IconChevronBack, IconStatusWait } from '../../../../assets/icons'
import { STATUS_TICKET_INTERACTION } from '../../../../core/utils/status'
import * as S from './styles'
import type { ITicketApproval } from '../../../../core/types/ITckets'
import { LinkSlug } from '../../../../core/utils/link-slug'
import { useRedirect } from '../../../../core/hooks/useRedirect'
import { Skeleton } from '../../../UI/loading/skeleton/styles'
import { useTenant } from '../../../../core/contexts/TenantContext'

export const CardTicketApproval = ({ item, loading }: {
    item: ITicketApproval | null;
    loading?: boolean;
}) => {

    const { redirectSlug } = useRedirect();
    const { tenant } = useTenant();

    const images = (item ? item.awaiting_approval_interactions.map((row) => {
        return row.thumbnail
    }) : [])

    const [imageSelected, setImageSelected] = useState(0)

    return (
        <S.Container>

            <div className='head'>
                <div onClick={() => item ? redirectSlug(`/approval/${item.ticket_id}`) : {}} className='image-thumb' style={{ backgroundImage: `url(${images[imageSelected]})` }}>

                    {loading && <Skeleton width='100%' height='100%' borderRadius='15px 15px 0px 0px' />}
                </div>
                {images.length > 1 &&
                    <div className='controls'>
                        <button className='prev' onClick={() => setImageSelected(imageSelected - 1 < 0 ? images.length - 1 : imageSelected - 1)}>
                            <IconChevronBack />
                        </button>
                        <button className='next' onClick={() => setImageSelected((imageSelected + 1) % images.length)}>
                            <IconChevronBack />
                        </button>
                    </div>
                }
            </div>

            {item &&
                <LinkSlug style={{ textDecoration: 'none' }} path={`/approval/${item.ticket_id}`}>
                    <div className='body'>
                        <div className='stats'>
                            <div style={{ background: STATUS_TICKET_INTERACTION.wait.colorBadge }} className='icon'>
                                <IconStatusWait />
                            </div>
                            <p style={{ color: STATUS_TICKET_INTERACTION.wait.colorText }}><b>{item.awaiting_approval}</b> aguardando aprovação</p>
                        </div>

                        <div className='text'>
                            <span style={{ backgroundColor: tenant?.colormain }} className='id'>#{item.ticket_id}</span>
                            <p>{item.title}</p>
                        </div>
                    </div>
                </LinkSlug>
            }

            {loading &&
                <div className='body'>
                    <div className='stats'>
                        <div style={{ background: STATUS_TICKET_INTERACTION.wait.colorBadge }} className='icon'>
                            <IconStatusWait />
                        </div>
                        <Skeleton width='calc(100% - 60px)' height='17px' />
                    </div>

                    <div className='text'>
                        <Skeleton height='18px' />
                    </div>
                </div>
            }

        </S.Container>
    )
}