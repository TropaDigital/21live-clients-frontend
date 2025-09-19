import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";

import { useTenant } from "../../../../core/contexts/TenantContext";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { LinkSlug } from "../../../../core/utils/link-slug";
import { useClickOutside } from "../../../../core/hooks/useClickOutside";
import { useSessionTimer } from "../../../../core/hooks/useSessionTimer";

import { AvatarTenant } from "../../../UI/avatar/avatar-tenant";

import * as S from "./styles";
import { IconConfig, IconDashboard, IconHome, IconLike, IconLogout, IconMenu, IconProfile, IconSearch, IconSolicitation, IconSortable, IconStar } from "../../../../assets/icons";
import type { IFolder } from "../../../../core/types/iFolder";
import { FoldersService } from "../../../../core/services/FoldersService";
import { LoadingMenu } from "../loading-menu";
import { useRedirect } from "../../../../core/hooks/useRedirect";

export default function AuthLayout() {

    const { user } = useAuth();
    const { tenant } = useTenant();
    const { handleRefreshToken, verifyPermission } = useAuth();

    const { pathname } = useLocation();
    const { timeLeft } = useSessionTimer();

    const { redirectSlug } = useRedirect();

    const isMobile = window.innerWidth < 600 ? true : false;

    //siderbar toggle
    const [siderbarToggle, setSidebarToggle] = useState(isMobile ? false : true);
    const [siderbarToggleMobile, setSidebarToggleMobile] = useState(false);

    //sidebar resize
    const [isResizing, setIsResizing] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number | null>(null);

    const [search, setSearch] = useState('')

    const query = new URLSearchParams(window.location.search);
    const searchQuery = query.get('search');

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault(); // previne seleção de texto

            if (!isResizing) return;

            if (startXRef.current === null) {
                startXRef.current = e.clientX;
                return;
            }

            const deltaX = e.clientX - startXRef.current;

            if (deltaX < -10) { // arrastou para a esquerda
                setSidebarToggle(false);
                startXRef.current = e.clientX;
            } else if (deltaX > 10) { // arrastou para a direita
                setSidebarToggle(true);
                startXRef.current = e.clientX;
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            startXRef.current = null;

            // Restaura seleção de texto
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        if (isResizing) {
            // Bloqueia seleção de texto enquanto arrasta
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'ew-resize';

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            // Restaura caso saia do efeito
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isResizing]);

    useEffect(() => {
        if (timeLeft <= 180) {
            handleRefreshToken();
        }
    }, [pathname]);

    useClickOutside(menuRef, () => {
        if (isMobile) {
            setSidebarToggleMobile(false);
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        redirectSlug(`/folders/?search=${search}`)
    }

    useEffect(() => {
        setSearch(searchQuery ?? '')
    }, [searchQuery])

    return (
        <S.Container isMobile={isMobile} opened={siderbarToggle}>

            <S.ContainerSidebar
                colorText={tenant?.colorsecond}
                color={tenant?.colorhigh}
                colorBg={tenant?.colormain}
                opened={isMobile ? true : siderbarToggle}
                openedMobile={siderbarToggleMobile}
                ref={menuRef}
            >

                <div className="tenant-info">
                    <AvatarTenant
                        name={tenant?.name ?? ""}
                        color={tenant?.colorhigh ?? ""}
                        colorBg={tenant?.colormain ?? ""}
                        colorText={tenant?.colorsecond ?? ""}
                        image={tenant?.images.touch ?? ""}
                    />
                    <div className="tenant-text">
                        <h1>{tenant?.name}</h1>
                        <p>Brand Center</p>
                    </div>
                </div>


                <ul className="menu">
                    {verifyPermission('folders_view') &&
                        <MenuSidebarDefault opened={isMobile ? true : siderbarToggle} name="Início" icon={<IconHome />} redirect="folders" />
                    }
                    {(verifyPermission('dashboard_admin') || verifyPermission('dashboard_user')) &&
                        <MenuSidebarDefault opened={isMobile ? true : siderbarToggle} name="Dashboard" icon={<IconDashboard />} redirect="dashboard" />
                    }
                    {verifyPermission('folders_view') &&
                        <MenuSidebarDefault opened={isMobile ? true : siderbarToggle} name="Favoritos" icon={<IconStar />} redirect="folders/bookmarks" />
                    }
                    {verifyPermission('tickets_view') &&
                        <MenuSidebarDefault opened={isMobile ? true : siderbarToggle} name="Solicitações" icon={<IconSolicitation />} redirect="tickets" total={user?.notifications.interactions} />
                    }
                    {verifyPermission('tickets_view') &&
                        <MenuSidebarDefault opened={isMobile ? true : siderbarToggle} name="Aprovações" icon={<IconLike />} redirect="approval" total={user?.notifications.approval} />
                    }
                </ul>

                <ul className="menu folders">

                    <li>
                        <p className="title-session">Acesso Rápido</p>
                    </li>

                    <RenderMenusFolder siderbarToggle={siderbarToggle} isMobile={isMobile} />

                </ul>

                <div className="resize" onMouseDown={() => setIsResizing(true)} />

            </S.ContainerSidebar>
            <div className="content">
                <header>
                    <button
                        data-tooltip-place="right"
                        data-tooltip-id="tooltip"
                        data-tooltip-content={siderbarToggle ? 'Fechar menu' : 'Abrir Menu'}
                        onClick={() => isMobile ? setSidebarToggleMobile(!siderbarToggleMobile) : setSidebarToggle(!siderbarToggle)}
                        className="sidebar-toggle"
                    >
                        <IconMenu />
                    </button>
                    <form className="search" onSubmit={handleSearch}>
                        <i>
                            <IconSearch />
                        </i>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Digite sua pesquisa e pressione enter" />
                    </form>
                    <div className="right">
                        <MenuProfile setSideBar={(bol) => isMobile ? setSidebarToggleMobile(bol) : setSidebarToggle(bol)} />
                    </div>
                </header>
                <section id="overflow-page">
                    <Outlet />
                </section>

            </div>
        </S.Container >
    );
}

const RenderMenusFolder = ({ isMobile, siderbarToggle }: { isMobile: boolean; siderbarToggle: boolean }) => {

    const { verifyPermission, menus, loadingMenus, setMenus } = useAuth();

    //siderbar sortable
    const [isDragging, setIsDragging] = useState(false);

    const arraysHaveDifferentOrder = (a: any[], b: any[], key: keyof any): boolean => {
        if (a.length !== b.length) return true;

        for (let i = 0; i < a.length; i++) {
            if (a[i][key] !== b[i][key]) return true;
        }

        return false; // mesma ordem
    };

    const onChangeOrderMenu = async (folders: IFolder[]) => {
        folders.map((item, index) => {
            item.order = index
            return item
        })
        setMenus([...folders]);
        if (arraysHaveDifferentOrder(folders, menus, 'folder_id')) {
            for (const [index, item] of folders.entries()) {
                FoldersService.update({ ...item, order: index });
            }
        }
    };

    const permissionSotable = !isMobile && verifyPermission('folders_edit');

    return loadingMenus ?
        (
            <div className="folders">
                <LoadingMenu quantity={4} />
            </div>
        ) : (
            <>
                {!permissionSotable ?
                    <div className="folders">
                        {
                            menus.map((item) => (
                                <MenuSidebarFolder
                                    key={item.folder_id}
                                    sortable={false}
                                    name={item.name}
                                    icon={item.icon}
                                    redirect={`folders/${item.folder_id}`}
                                    isDragging={false}
                                    opened={isMobile ? true : siderbarToggle}
                                />
                            ))
                        }
                    </div>
                    :
                    <ReactSortable
                        className="folders sortable-items"
                        list={menus.map((row) => {
                            return {
                                id: row.folder_id,
                                ...row,
                            };
                        })}
                        setList={onChangeOrderMenu}
                        onStart={() => setIsDragging(true)}
                        onEnd={() => setIsDragging(false)}
                    >
                        {
                            menus.map((item) => (
                                <MenuSidebarFolder
                                    key={item.folder_id}
                                    sortable={true}
                                    name={item.name}
                                    icon={item.icon}
                                    redirect={`folders/${item.folder_id}`}
                                    isDragging={isDragging}
                                    opened={isMobile ? true : siderbarToggle}
                                />
                            ))
                        }
                    </ReactSortable>
                }
            </>
        )
}

const MenuProfile = ({ setSideBar }: { setSideBar(bol: boolean): void }) => {

    const { user, handleLogout } = useAuth();
    const [opened, setOpened] = useState(false)
    const refSubmenu = useRef<any>(null);

    const { pathname } = useLocation();

    useClickOutside(refSubmenu, () => {
        setOpened(false);
    });

    useEffect(() => {
        setOpened(false)
    }, [pathname])

    return (
        <S.ContainerMenuProfile>
            <div onClick={() => setOpened(!opened)} className="btn-profile">
                <div className="photo" style={{ backgroundImage: `url(${user?.avatar})` }} />
                <div className="text">
                    <b>{user?.name}</b>
                    <span>{user?.email}</span>
                </div>
            </div>

            <ul ref={refSubmenu} className={`submenu ${opened ? 'opened' : 'closed'}`}>
                <li>
                    <LinkSlug path={"/profile"}>
                        <i>
                            <IconProfile />
                        </i>
                        <span>Minha Conta</span>
                    </LinkSlug>
                </li>

                <li onClick={() => setSideBar(false)}>
                    <LinkSlug path={"/settings/profile"}>
                        <i>
                            <IconConfig />
                        </i>
                        <span>Configurações</span>
                    </LinkSlug>
                </li>

                <li>
                    <a onClick={handleLogout}>
                        <i>
                            <IconLogout />
                        </i>
                        <span>Sair</span>
                    </a>
                </li>
            </ul>
        </S.ContainerMenuProfile>
    )
}

const MenuSidebarDefault = ({ opened, icon, name, redirect, total }: { opened: boolean; icon: any, name: string, redirect: string, total?: number }) => {

    const { tenant } = useTenant();

    const pathSegments = window.location.pathname.split('/')
    const page = pathSegments.length > 1 ? pathSegments[2] : ''
    const pageParam = pathSegments.length > 3 ? '/' + pathSegments[3] : ''
    const isActive = page + pageParam === redirect;

    return (
        <S.ContainerMenuSidebarButton
            colorText={tenant?.colorsecond}
            colorBg={tenant?.colormain}
            color={tenant?.colorhigh}
            active={isActive}
            opened={opened}
        >
            <LinkSlug path={`/${redirect}`}>
                <div className="icon">
                    {icon}
                </div>
                <span className="name">{name}</span>
                {total && total > 0 ?
                    <div className="total">
                        {total}
                    </div>
                    : null}
            </LinkSlug>
        </S.ContainerMenuSidebarButton>
    )
}

const MenuSidebarFolder = ({ opened, sortable, isDragging, icon, name, redirect, total }: { opened: boolean; sortable?: boolean, isDragging?: boolean; icon: string, name: string, redirect: string, total?: number }) => {

    const { tenant } = useTenant();

    const pathSegments = window.location.pathname.split('/')
    const page = pathSegments.length > 1 ? pathSegments[2] : ''
    const pageParam = pathSegments.length > 3 ? '/' + pathSegments[3] : ''
    const isActive = page + pageParam === redirect;

    return (
        <S.ContainerMenuSidebarFolder
            drop={false}
            colorText={tenant?.colorsecond}
            colorBg={tenant?.colormain}
            color={tenant?.colorhigh}
            active={isActive}
            sortable={sortable}
            opened={opened}
            className={isDragging ? 'no-hover' : 'hover'}

            data-tooltip-place="right"
            data-tooltip-id="tooltip"
            data-tooltip-content={opened ? undefined : name}

        >
            <LinkSlug path={`/${redirect}`}>
                <div className="sortable">
                    <IconSortable />
                </div>
                <div className="icon">
                    <i className={`fa fa-${icon}`}></i>
                </div>
                <span className="name">{name}</span>
                {total &&
                    <div className="total">
                        {total}
                    </div>
                }
            </LinkSlug>
        </S.ContainerMenuSidebarFolder>
    )
}