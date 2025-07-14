import { useEffect, useState, type JSX } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingMain } from '../../components/UI/loading/loading-main'

interface Props {
    children: JSX.Element
}

export const AuthRoute = ({
    children,
}: Props) => {

    const { user, isLogged, handleRefreshToken, getUserProfileRoles, getMenus } = useAuth();
    const { slug } = useParams();

    const [loadingAuthLayout, setLoadingAuthLayout] = useState(true);
    const [permissionLayout, setPermissionLayout] = useState(false);

    const handleRefresh = async () => {
        await handleRefreshToken();
        setPermissionLayout(user?.tenant_slug !== slug ? false : true)
        setLoadingAuthLayout(false);
    }

    useEffect(() => {
        if (!isLogged) {
            setLoadingAuthLayout(false);
            setPermissionLayout(false);
        } else if (user?.tenant_slug && user.tenant_slug !== slug) {
            handleRefresh();
        } else if (user?.tenant_slug) {
            getUserProfileRoles().finally(() => {
                getMenus().finally(() => {
                    setLoadingAuthLayout(false);
                    setPermissionLayout(true);
                })

            })
        }
    }, [isLogged, user, slug])


    if (!permissionLayout && loadingAuthLayout === false) {
        return <Navigate to={`/${slug}/login`} replace />
    }

    return permissionLayout && !loadingAuthLayout ? children : <LoadingMain />
}