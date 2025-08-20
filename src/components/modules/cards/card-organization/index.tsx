import moment from "moment";

import { AvatarUser } from "../../../UI/avatar/avatar-user";
import { Skeleton } from "../../../UI/loading/skeleton/styles";
import { IconTrash } from "../../../../assets/icons";
import * as S from './styles'

export const CardOrganization = ({ name, logo, created, onRemove, loading }: { name?: string; logo?: string; created?: string, onRemove?(): void, loading?: boolean }) => (
    <S.Container>
        {loading ?
            <Skeleton
                width='60px'
                height='60px'
                borderRadius='100px'
            />
            :
            <AvatarUser
                name={name ?? ''}
                image={logo ?? ''}
                size={60}
                fontSize={22}
            />
        }

        <div className='infos'>
            {loading ? <Skeleton widthAuto height='20px' /> :
                <p className='name'>{name}</p>
            }
            {loading ? <Skeleton widthAuto height='17px' /> :
                <p className='date'>{moment(created).format('DD/MM/YYYY')}</p>
            }
        </div>

        {onRemove && !loading &&
            <button className='more' onClick={onRemove} type='button'>
                <IconTrash />
            </button>
        }
    </S.Container>
)