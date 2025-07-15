import { useTenant } from '../../../../core/contexts/TenantContext'
import * as S from './styles'

export const LoadingMain = ({ loading }: { loading: boolean }) => {

    const { tenant } = useTenant();

    return (
        <S.Container
            color={tenant?.colorhigh}
            colorBg={tenant?.colormain}
            colorText={tenant?.colorsecond}
            loading={loading}
        >

            <div className='loading-square'>
                <div className='line-move' />
            </div>

        </S.Container>
    )
}