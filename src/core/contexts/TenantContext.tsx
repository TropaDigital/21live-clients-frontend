import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { TenantService } from '../services/TenantService';
import { getSlug } from '../utils/params-location';
import type { ITenant } from '../types/iTenants';
import type { IOrganization, IOrganizationGroup } from '../types/IOrganization';
import { OrganizationService } from '../services/OrganizationService';
import type { IUser } from '../types/iUser';
import { UserService } from '../services/UserService';

// Definição da interface para o contexto do Tenant
interface TenantContextType {
    getTenant(): void;
    loadingTenant: boolean;
    tenant: ITenant | null;
    setTenant(tenant: ITenant | null): void;

    //organization
    getOrganizations(): void;
    organizations: IOrganization[];
    loadingOrganization: boolean;

    //organization group
    getOrganizationsGroup(): void;
    organizationsGroup: IOrganizationGroup[];
    loadingOrganizatonsGroup: boolean;

    //users tenant
    getUsers(): void;
    users: IUser[];
    loadingUsers: boolean;
}

// Criação do contexto com um valor inicial de null
const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
    children: ReactNode;
}

// Provider que gerencia o tenant e os eventos
export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {

    const slug = getSlug();

    const [loadingTenant, setLoadingTenant] = useState(true)
    const [tenant, setTenant] = useState<ITenant | null>(null);

    const [organizations, setOrganizations] = useState<IOrganization[]>([])
    const [loadingOrganization, setLoadingOrganization] = useState(true);

    const [organizationsGroup, setOrganizationsGroup] = useState<IOrganizationGroup[]>([])
    const [loadingOrganizatonsGroup, setLoadingOrganizationsGroup] = useState(true)

    const [users, setUsers] = useState<IUser[]>([])
    const [loadingUsers, setLoadingUsers] = useState(true);

    const getTenant = async () => {
        try {
            if (!slug) return;
            if (tenant?.tenant_id) return;
            setLoadingTenant(true);
            const response = await TenantService.getBySlug(slug);
            setTenant({ ...response.item });

            document.title = `${response.item?.name} | 21Live`;

            const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            favicon.href = response.item?.images.icon ?? '';

        } catch (error) {
            //window.location.href = `/`
        }
    }

    useEffect(() => {
        if (tenant?.tenant_id) {
            setLoadingTenant(false);
        }
    }, [tenant])

    const getOrganizations = async () => {
        try {
            setLoadingOrganization(true);
            setOrganizations([]);
            const totalPerPage = 2000;
            const response = await OrganizationService.get(1, totalPerPage);
            setOrganizations([...response.items])
            setLoadingOrganization(false);
        } catch (error: any) {
            setLoadingOrganization(false);
        }
    }

    const getOrganizationsGroup = async () => {
        try {
            setLoadingOrganizationsGroup(true);
            const response = await OrganizationService.getGroup();
            setOrganizationsGroup([...response.items])
            setLoadingOrganizationsGroup(false);
        } catch (error: any) {
            setLoadingOrganizationsGroup(false);
        }
    }

    const getUsers = async () => {
        try {
            setLoadingUsers(true);
            const totalPerPage = 2000;
            const response = await UserService.get(1, totalPerPage);
            setUsers([...response.items])
            setLoadingUsers(false);
        } catch (error: any) {
            setLoadingUsers(false);
        }
    }

    return (
        <TenantContext.Provider value={{
            getTenant,
            setTenant,
            tenant,
            loadingTenant,
            getOrganizations,
            organizations,
            loadingOrganization,
            getOrganizationsGroup,
            organizationsGroup,
            loadingOrganizatonsGroup,
            getUsers,
            users,
            loadingUsers

        }}>
            {children}
        </TenantContext.Provider>
    );
};

// Hook personalizado para acessar o tenant de qualquer componente
export const useTenant = (): TenantContextType => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant deve ser usado dentro de um TenantProvider');
    }
    return context;
};
