import { IconReply } from '../../../../assets/icons';
import { STATUS_TICKET_INTERACTION } from '../../../../core/utils/status';
import { AvatarUser } from '../../../UI/avatar/avatar-user';
import { BadgeSimpleColor } from '../../../UI/badge/badge-simple-color';
import { Skeleton } from '../../../UI/loading/skeleton/styles';
import * as S from './styles'
import moment from 'moment';

interface IProps {
    avatar?: string;
    name: string;
    created: string;
    message: string;
    repply?: string;
    position: 'left' | 'right'
    thumbnail?: string;
    status?: 'pass' | 'fail' | 'wait' | null;
    onClick?(): void;
    onReply?(): void;
    loading?: boolean;
}

export const CommentTicket = ({ avatar, name, status, created, message, repply, position, thumbnail, loading, onClick, onReply }: IProps) => {
    return (
        <S.ContainerComment position={position}>

            {loading ?
                <Skeleton height='30px' width='30px' borderRadius='100px' />
                :
                <AvatarUser
                    name={name}
                    image={avatar ?? ''}
                />
            }

            <div className='message-center'>
                <div className='message'>
                    {loading ?
                        <div style={{ width: '100%', minWidth: 200, boxSizing: 'border-box', gap: 10, display: 'flex' }}>
                            <Skeleton height='18px' widthAuto />
                        </div>
                        :
                        <div className='user'>
                            <b>{name}</b>
                            <span>{moment(created).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                    }
                    {repply &&
                        <div className='repply'>
                            <i>
                                <IconReply />
                            </i>
                            <div className='render-repply' dangerouslySetInnerHTML={{ __html: repply }} />
                        </div>
                    }
                    {thumbnail &&
                        <div className='preview' style={{ backgroundImage: `url(${thumbnail})` }} onClick={onClick}>
                            {status &&
                                <div className='overlay' style={{ backgroundColor: STATUS_TICKET_INTERACTION[status].colorOpacity }} />
                            }
                            {status &&
                                <div className='status-interaction'>
                                    <BadgeSimpleColor
                                        name={STATUS_TICKET_INTERACTION[status].name}
                                        color={STATUS_TICKET_INTERACTION[status].colorText}
                                        bg={STATUS_TICKET_INTERACTION[status].colorBadge}
                                    />
                                </div>
                            }
                        </div>
                    }

                    <div className='text' dangerouslySetInnerHTML={{ __html: message }} />
                    {loading && <div style={{ width: '100%', display: 'flex' }}><Skeleton height='17px' widthAuto /></div>}
                </div>

                <div className='btns'>
                    {!status &&
                        <button onClick={() => onReply && onReply()}>
                            <IconReply />
                        </button>
                    }
                </div>
            </div>

        </S.ContainerComment>
    )
}