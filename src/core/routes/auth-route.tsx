import { useEffect, useState, type JSX } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingMain } from '../../components/UI/loading/loading-main'
import { useTenant } from '../contexts/TenantContext'

interface Props {
    children: JSX.Element
}

export const AuthRoute = ({
    children,
}: Props) => {

    const { user, isLogged, handleRefreshToken, getUserProfileRoles, getMenus } = useAuth();
    const { getTenant, loadingTenant } = useTenant();
    const { slug } = useParams();

    const [loadingMain, setLoadingMain] = useState(true);
    const [loadingAuthLayout, setLoadingAuthLayout] = useState(true);
    const [permissionLayout, setPermissionLayout] = useState(false);

    const handleRefresh = async () => {
        await handleRefreshToken();
        setPermissionLayout(user?.tenant_slug !== slug ? false : true)
        setLoadingAuthLayout(false);
    }

    useEffect(() => {
        getTenant();
    }, [slug])

    const handleChangeTenant = async () => {
        setLoadingAuthLayout(true);
        await handleRefresh();
        await handleGetUserInfos()
    }

    const handleGetUserInfos = async () => {
        try {
            setLoadingAuthLayout(true);
            setPermissionLayout(false);
            await getUserProfileRoles();
            await getMenus();
            setLoadingAuthLayout(false);
            setPermissionLayout(true);
        } catch (e: any) {
            if (e.code === 401) {
                setLoadingAuthLayout(false);
                setPermissionLayout(false);
            }
        }
    }


    useEffect(() => {
        if (loadingAuthLayout === false && loadingTenant === false) {
            setLoadingMain(false)
        } else {
            setLoadingMain(true);
        }
    }, [loadingAuthLayout, loadingTenant])

    useEffect(() => {
        if (!isLogged) {
            setLoadingAuthLayout(false);
            setPermissionLayout(false);
        } else if (user?.tenant_slug && user.tenant_slug !== slug) {
            handleChangeTenant();
        } else if (user?.tenant_slug && user?.tenant_slug === slug) {
            handleGetUserInfos();
        }
    }, [isLogged, user, slug])


    if (!permissionLayout && loadingAuthLayout === false) {
        return <Navigate to={`/${slug}/login`} replace />
    }

    return <>
        {permissionLayout && children}
        <LoadingMain loading={loadingMain} />
    </>
}