import { useEffect } from "react";
import { useAuth } from "../../core/contexts/AuthContext"
import { useRedirect } from "../../core/hooks/useRedirect";

export default function IndexPermission() {

    const { role, user, verifyPermission } = useAuth();
    const { redirectSlug } = useRedirect();

    useEffect(() => {
        if (!user?.user_id) return;
        if (role?.role.length === 0) return;
        if (verifyPermission('dashboard_admin') || verifyPermission('dashboard_user')) {
            redirectSlug('dashboard')
        } else if (verifyPermission('folders_view')) {
            redirectSlug('folders')
        } else if (verifyPermission('tickets_view')) {
            redirectSlug('tickets')
        } else {
            redirectSlug('permissions')
        }
    }, [role, user])

    return (
        <div>Carregando permissões</div>
    )
}