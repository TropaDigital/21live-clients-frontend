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
        setLoadingAuthLayout(true);
        setPermissionLayout(false);
        await getUserProfileRoles();
        await getMenus();
        setLoadingAuthLayout(false);
        setPermissionLayout(true);
    }


    useEffect(() => {
        if (loadingAuthLayout === false && loadingTenant === false) {
            setLoadingMain(false)
        } else {
            setLoadingMain(true);
        }
    }, [loadingAuthLayout, loadingTenant])

    useEffect(() => {
        console.log('user', user)
        if (!isLogged) {
            console.log('!isLogged = user?.tenant_slug', user?.tenant_slug)
            console.log('!isLogged = slug', slug)
            setLoadingAuthLayout(false);
            setPermissionLayout(false);
        } else if (user?.tenant_slug && user.tenant_slug !== slug) {
            console.log('handleRefresh = user?.tenant_slug', user?.tenant_slug)
            console.log('handleRefresh = slug', slug)
            handleChangeTenant();
        } else if (user?.tenant_slug && user?.tenant_slug === slug) {
            console.log('getuser = user?.tenant_slug', user?.tenant_slug)
            console.log('getuser = slug', slug)
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