import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { LinkSlug } from '../../core/utils/link-slug';

import { BreadCrumbAuthLayout } from '../../components/layouts/auth/breadcrumb';

import SettingsMyAccount from './my-account';
import SettingsListUsers from './users/list';
import SettingsListOrganizations from './organizations/list';
import SettingsListGroupOrganizations from './group-organizations/list';
import SettingsListTenants from './tenants/list';
import SettingsTicketsForms from './ticket-forms/list';
import SettingsTicketsStatus from './ticket-status/list';
import SettingsMedias from './medias/list';
import SettingsMediaCats from './media-cats/list';

import * as S from './styles';
import { IconConfig, IconHamburger, IconHome, IconImage, IconPencil, IconProfile, IconStatus, IconTag, IconTenant, IconUnits, IconUsers } from '../../assets/icons';
import { useTenant } from '../../core/contexts/TenantContext';
import { useAuth } from '../../core/contexts/AuthContext';

export default function Settings() {

    const { menu, id } = useParams();
    const { tenant } = useTenant();
    const { verifyPermission } = useAuth();

    const { pathname } = useLocation();
    const { params } = useParams();

    const [menuOpened, setMenuOpened] = useState(true);
    const isMobile = window.innerWidth < 600 ? true : false;

    const [dataBreadCrumb, setDataBreadCrumb] = useState([
        { icon: <IconConfig />, name: 'Configurações', redirect: `/settings/${menu}` }
    ])
    const [dataBreadCrumbDetail, setDataBreadCrumbDetail] = useState({ icon: <IconProfile />, name: '', redirect: '' })

    const addBreadCrumb = (icon: any, name: string, redirect: string) => {
        setDataBreadCrumbDetail({
            icon, name, redirect
        })
    }

    const MENUS_GERAL = [
        {
            name: 'Minha Conta',
            icon: <IconProfile />,
            redirect: '/settings/profile',
            render: <SettingsMyAccount />,
            cat: 'my',
        },
        {
            name: 'Usuários',
            icon: <IconUsers />,
            redirect: '/settings/users',
            render: <SettingsListUsers addBreadCrumb={addBreadCrumb} />,
            cat: 'geral',
            permission: 'users_view'
        },
        {
            name: 'Unidades',
            icon: <IconHome />,
            redirect: '/settings/organizations',
            render: <SettingsListOrganizations addBreadCrumb={addBreadCrumb} />,
            cat: 'geral',
            permission: 'organizations_view'
        },
        {
            name: 'Grupos de Unidades',
            icon: <IconUnits />,
            redirect: '/settings/organizations-group',
            render: <SettingsListGroupOrganizations addBreadCrumb={addBreadCrumb} />,
            cat: 'geral',
            permission: 'orggroups_view'
        },
        {
            name: 'Instâncias',
            icon: <IconTenant />,
            redirect: '/settings/tenants',
            render: <SettingsListTenants addBreadCrumb={addBreadCrumb} />,
            cat: 'geral',
            permission: 'tenants_view'
        },
        {
            name: 'Formularios',
            icon: <IconPencil />,
            redirect: '/settings/ticket-forms',
            render: <SettingsTicketsForms addBreadCrumb={addBreadCrumb} />,
            cat: 'solicitations',
            permission: 'ticket_cats_view'
        },
        {
            name: 'Status de Solicitações',
            icon: <IconStatus />,
            redirect: '/settings/ticket-status',
            render: <SettingsTicketsStatus addBreadCrumb={addBreadCrumb} />,
            cat: 'solicitations',
            permission: 'ticket_status_view'
        },
        {
            name: 'Formato de Peça',
            icon: <IconImage />,
            redirect: '/settings/medias',
            render: <SettingsMedias addBreadCrumb={addBreadCrumb} />,
            cat: 'parts',
            permission: 'medias_view'
        },
        {
            name: 'Categoria de Formatos',
            icon: <IconTag />,
            redirect: '/settings/media-cats',
            render: <SettingsMediaCats addBreadCrumb={addBreadCrumb} />,
            cat: 'parts',
            permission: 'media_cats_view'
        },
    ]

    const menuSelected = MENUS_GERAL.find(item => item.redirect === `/settings/${menu}`);

    useEffect(() => {
        setDataBreadCrumbDetail({ icon: <></>, name: '', redirect: '' })
    }, [id])

    useEffect(() => {
        const menuHere = MENUS_GERAL.find(item => item.redirect === `/settings/${menu}`);
        if (menuHere?.icon) {
            const BREAD_DEFAULT = [
                { icon: <IconConfig />, name: 'Configurações', redirect: `/settings/${menu}` },
                { icon: menuHere.icon, name: menuSelected?.name ?? '', redirect: menuHere?.redirect }
            ]
            if (id) {
                BREAD_DEFAULT.push(dataBreadCrumbDetail)
            }
            setDataBreadCrumb([...BREAD_DEFAULT])
        }
    }, [menu, dataBreadCrumbDetail])

    useEffect(() => {
        if (isMobile) {
            setMenuOpened(false)
        }
    }, [params, pathname, isMobile])

    const LIST_MENUS_GERAL = MENUS_GERAL.filter((obj) => obj.cat === 'geral').filter((obj) => obj.permission && verifyPermission(obj.permission));
    const LIST_MENUS_TICKETS = MENUS_GERAL.filter((obj) => obj.cat === 'solicitations').filter((obj) => obj.permission && verifyPermission(obj.permission));
    const LIST_MENUS_PART = MENUS_GERAL.filter((obj) => obj.cat === 'parts').filter((obj) => obj.permission && verifyPermission(obj.permission));

    return (
        <S.Container isMobile={isMobile} menuOpened={menuOpened} color={tenant?.colorhigh} colorBg={tenant?.colormain} colorText={tenant?.colorsecond}>

            <BreadCrumbAuthLayout
                data={dataBreadCrumb}
            />

            <div className='content-settings'>
                <nav>
                    <ul>
                        <li className='menu-toggle'>
                            <button onClick={() => setMenuOpened(!menuOpened)}>
                                <IconHamburger />
                            </button>
                        </li>
                        {MENUS_GERAL.filter((obj) => obj.cat === 'my').map((item, index) => (
                            <li data-tooltip-id="tooltip" data-tooltip-content={!menuOpened ? item.name : undefined} className={`${item.redirect === `/settings/${menu}` ? 'active' : 'normal'}`} key={`sub-${index}`}>
                                <LinkSlug path={item.redirect}>
                                    <i>
                                        {item.icon}
                                    </i>
                                    <span>{item.name}</span>
                                </LinkSlug>
                            </li>
                        ))}
                        {LIST_MENUS_GERAL.length > 0 &&
                            <li>
                                <h4>Gerais</h4>
                            </li>
                        }
                        {LIST_MENUS_GERAL.map((item, index) => (
                            <li data-tooltip-id="tooltip" data-tooltip-content={!menuOpened ? item.name : undefined} className={`${item.redirect === `/settings/${menu}` ? 'active' : 'normal'}`} key={`sub-${index}`}>
                                <LinkSlug path={item.redirect}>
                                    <i>
                                        {item.icon}
                                    </i>
                                    <span>{item.name}</span>
                                </LinkSlug>
                            </li>
                        ))}
                        {LIST_MENUS_TICKETS.length > 0 &&
                            <li>
                                <h4>Solicitações</h4>
                            </li>
                        }
                        {LIST_MENUS_TICKETS.map((item, index) => (
                            <li data-tooltip-id="tooltip" data-tooltip-content={!menuOpened ? item.name : undefined} className={`${item.redirect === `/settings/${menu}` ? 'active' : 'normal'}`} key={`sub-${index}`}>
                                <LinkSlug path={item.redirect}>
                                    <i>
                                        {item.icon}
                                    </i>
                                    <span>{item.name}</span>
                                </LinkSlug>
                            </li>
                        ))}

                        {LIST_MENUS_PART.length > 0 &&
                            <li>
                                <h4>Peças</h4>
                            </li>
                        }
                        {LIST_MENUS_PART.map((item, index) => (
                            <li data-tooltip-id="tooltip" data-tooltip-content={!menuOpened ? item.name : undefined} className={`${item.redirect === `/settings/${menu}` ? 'active' : 'normal'}`} key={`sub-${index}`}>
                                <LinkSlug path={item.redirect}>
                                    <i>
                                        {item.icon}
                                    </i>
                                    <span>{item.name}</span>
                                </LinkSlug>
                            </li>
                        ))}
                    </ul>
                </nav>
                <section className='render-menu'>
                    {(menuSelected && menuSelected.render) && menuSelected?.render}
                </section>
            </div>
        </S.Container>
    )
}