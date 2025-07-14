import { useEffect, useState } from 'react';
import { useTenant } from '../../../../core/contexts/TenantContext'
import * as S from './styles'
import { useAuth } from '../../../../core/contexts/AuthContext';

export const LoadingMain = () => {

    const { tenant, loadingTenant } = useTenant();

    const { loadingMenus, loadingProfile, isLogged } = useAuth();

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setTimeout(() => {

            if (!isLogged) {
                setLoading(false)
            } else if (isLogged && !loadingTenant && !loadingProfile) {
                setLoading(false)
            } else {
                setLoading(true);
            }
        }, 1000)

    }, [loadingTenant, loadingMenus, loadingProfile, isLogged])


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