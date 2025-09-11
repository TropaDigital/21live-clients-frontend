import type { ITicketInteraction } from '../../../../core/types/ITckets';
import { STATUS_TICKET_INTERACTION } from '../../../../core/utils/status';
import { AvatarUser } from '../../../UI/avatar/avatar-user';
import { BadgeSimpleColor } from '../../../UI/badge/badge-simple-color';
import * as S from './styles'
import moment from 'moment';

interface IProps {
    avatar?: string;
    name: string;
    created: string;
    message: string;
    thumbnail?: string;
    status: 'pass' | 'fail' | 'wait';
    interactions: ITicketInteraction[];
    onClick?(): void;
    loading?: boolean;
}

export const CardTicketApprove = ({ avatar, name, status, created, thumbnail, interactions }: IProps) => {

    return (
        <S.ContainerCardApprove>

            <div className='header-card'>
                <div className='name'>
                    <AvatarUser
                        size={30}
                        name={name}
                        image={avatar ?? ''}
                    />
                    <span>{name}</span>
                </div>
                <div className='date'>
                    {moment(created).format('DD/MM/YYYY HH:mm')}
                </div>
            </div>

            <div className='thumb' style={{ backgroundImage: `url(${thumbnail})` }}>
                <div className='overlay' style={{ backgroundColor: STATUS_TICKET_INTERACTION[status].colorOpacity }}></div>
            </div>

            <div className='foot-card'>
                <div className='list-reply'>
                    {interactions.map((user) =>
                        <AvatarUser
                            name={user.user_name}
                            image={user.user_avatar}
                            border={user.status && STATUS_TICKET_INTERACTION[user.status].colorFull}
                        />
                    )}
                </div>
                <BadgeSimpleColor
                    name={STATUS_TICKET_INTERACTION[status].name ?? ''}
                    bg={STATUS_TICKET_INTERACTION[status].colorBadge}
                    color={STATUS_TICKET_INTERACTION[status].colorText}
                />
            </div>

        </S.ContainerCardApprove>
    )
}

