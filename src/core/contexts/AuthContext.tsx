import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { IUser, IUserRole } from '../types/iUser';
import { STORAGE_TOKEN, STORAGE_USER } from '../constants';
import { UserService } from '../services/UserService';
import { getSlug } from '../utils/params-location';
import type { IFolder } from '../types/iFolder';
import { FoldersService } from '../services/FoldersService';


// Definição da interface para o contexto do User
interface UserContextType {
    token: string | null;
    setToken(token: string | null): void;
    user: IUser | null;
    setUser(user: IUser | null): void;
    handleLogin(token: string, user: IUser): void;
    handleLogout(): void;
    isLogged: boolean;
    loadingProfile: boolean;
    setIsLogged(bol: boolean): void;
    handleRefreshToken(): void;
    getUserProfileRoles(): Promise<void>
    role: {
        role: IUserRole[];
        permissions: string[]
    };
    verifyPermission(name: string): boolean;
    setMenus(menus: IFolder[]): void;
    addMenu(folder: IFolder): void;
    getMenus(): Promise<void>;
    loadingMenus: boolean;
    menus: IFolder[]
}

// Criação do contexto com um valor inicial de null
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

// Provider que gerencia o user e os eventos
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

    const slug = getSlug();

    const [isLogged, setIsLogged] = useState(window.localStorage.getItem(STORAGE_TOKEN) ? true : false)
    const [token, setToken] = useState<string | null>(window.localStorage.getItem(STORAGE_TOKEN))

    const [user, setUser] = useState<IUser | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [role, setRole] = useState<{ role: IUserRole[]; permissions: string[] }>({
        role: [],
        permissions: []
    })

    const [loadingMenus, setLoadingMenus] = useState(false);
    const [menus, setMenus] = useState<IFolder[]>([]);

    const getUserProfileRoles = async () => {
        setLoadingProfile(true);
        const response = await UserService.profile();
        setRole({
            role: response.item.role,
            permissions: response.item.permissions
        })
        window.localStorage.setItem(STORAGE_USER, JSON.stringify({ ...user, ...response.item }));
        setUser({ ...user, ...response.item })
        setLoadingProfile(false);
    }

    const getMenus = async () => {
        try {
            if (!user?.user_id) return;
            if (user.tenant_slug !== slug) return;
            if (!slug) return;
            setLoadingMenus(true);
            const response = await FoldersService.getMenu();
            setMenus([...response.items.filter((obj: any) => obj.folder_id)])
            setLoadingMenus(false);
            //handleRefreshToken();
        } catch (error: any) {
            console.log('error', error)
        }
    }

    const addMenu = (menu: IFolder) => {
        alert('adiciona menu' + menu)
    }

    const verifyPermission = (name: string) => {
        return role.permissions.filter((obj) => obj === name).length > 0 ? true : false;
    }

    const handleLogin = async (token: string, user: IUser) => {
        try {
            user.tenant_slug = slug;
            window.localStorage.setItem(STORAGE_TOKEN, token);
            window.localStorage.setItem(STORAGE_USER, JSON.stringify(user));
            setUser({ ...user })
            setToken(token)
            setIsLogged(true);
        } catch (error) {
            alert('error handleLogin')
            console.log('error', error)
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem(STORAGE_TOKEN);
        window.localStorage.removeItem(STORAGE_USER);
        setUser(null);
        setToken(null);
        setIsLogged(false)
    }

    const handleRefreshToken = async () => {
        try {
            if (slug && user) {
                const response = await UserService.refreshToken(slug)
                user.tenant_slug = slug;
                window.localStorage.setItem(STORAGE_TOKEN, response.token);
                window.localStorage.setItem(STORAGE_USER, JSON.stringify(user));
                //setUser({ ...user })
                setToken(response.token)
                return response;
            } else {
                throw new Error('Sem slug e sem user.')
            }
        } catch (error) {
            if (user && user.tenant_slug) {
                window.location.href = `/${user?.tenant_slug}/login`
            } else {
                window.location.href = `/`
            }
        }
    }

    useEffect(() => {
        const getUser = window.localStorage.getItem(STORAGE_USER);
        const getToken = window.localStorage.getItem(STORAGE_TOKEN);
        if (getUser) {
            setUser({ ...JSON.parse(getUser) })
            setToken(getToken)
        }
    }, []);

    useEffect(() => {
        if (token) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, [token])

    return (
        <UserContext.Provider value={{
            isLogged,
            token,
            user,
            role,
            loadingProfile,
            loadingMenus,
            menus,
            setMenus,
            addMenu,
            getMenus,
            getUserProfileRoles,
            setIsLogged,
            setToken,
            setUser,
            handleLogin,
            handleLogout,
            handleRefreshToken,
            verifyPermission
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para acessar o user de qualquer componente
export const useAuth = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um UserProvider');
    }
    return context;
};