import moment from "moment";

import { AvatarTenant } from "../../../UI/avatar/avatar-tenant";
import { Skeleton } from "../../../UI/loading/skeleton/styles";
import { IconTrash } from "../../../../assets/icons";
import * as S from './styles'

export const CardTenant = ({ name, logo, color, colorBg, colorText, created, onRemove, loading }: { name?: string; logo?: string; color?: string; colorBg?: string; colorText?: string; created?: string, onRemove?(): void, loading?: boolean }) => (
    <S.Container>
        {loading ?
            <Skeleton
                width='45px'
                height='45px'
                borderRadius='14px'
            />
            :
            <AvatarTenant
                name={name ?? ''}
                image={logo ?? ''}
                color={color ?? ''}
                colorBg={colorBg ?? ''}
                colorText={colorText ?? ''}
                size={'small'}
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