import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as S from './styles'
import { useClickOutside } from '../../../core/hooks/useClickOutside';
import { AvatarUser } from '../avatar/avatar-user';

interface IProps {
    search?: boolean;
    submenu: ISubmenuSelect[];
    button?: ReactNode;
    children?: ReactNode;
    childrenRight?: ReactNode;
    label?: string;
    disabled?: boolean;
    description?: string;
    position?: 'left' | 'right'
    onSelected?(): void
    closeOnSelected?: boolean;
    loading?: boolean;
    whiteSpace?: 'nowrap' | 'normal'
}

export interface ISubmenuSelect {
    name: string;
    avatar?: string;
    icon?: ReactNode;
    iconFont?: string;
    onClick?(name: string): void;
    path?: string;
    required?: boolean
    permission?: string;
    jobs?: boolean;
}

export const SubmenuSelect = ({
    label,
    description,
    loading = false,
    onSelected,
    closeOnSelected = true,
    search,
    submenu,
    button,
    position = 'left',
    childrenRight,
    children,
    whiteSpace = 'normal',
}: IProps) => {

    const [opened, setOpened] = useState(false);

    const refSubmenu = useRef<any>(null)
    const refMenu = useRef<any>(null)

    const [menuRect, setMenuRect] = useState({
        widthMenu: 0,
        heightMenu: 0,
        topMenu: 0,
        bottomMenu: 0,
        width: 0,
        height: 0,
        top: 0,
        bottom: 0,
    });

    const handleOpenMenu = () => {
        if (!loading) {
            setOpened(true);
        }
    };

    useEffect(() => {
        if (refSubmenu.current) {
            const rectMenu = refMenu.current.getBoundingClientRect();
            const rectSub = refSubmenu.current.getBoundingClientRect();
            setMenuRect({
                widthMenu: rectMenu.width,
                heightMenu: rectMenu.height,
                topMenu: rectMenu.top,
                bottomMenu: rectMenu.bottom,
                width: rectSub.width,
                height: rectSub.height,
                top: rectSub.top,
                bottom: rectSub.bottom
            });
        }
    }, [refSubmenu, opened])

    useClickOutside(refSubmenu, () => {
        setOpened(false);
    });

    const handleOnClick = ({ onClick }: {
        onClick(): void;
    }) => {
        onClick();
        if (closeOnSelected) setOpened(false);
        if (onSelected) onSelected();
    }

    return (
        <S.Container

            menuWidth={menuRect?.widthMenu ?? 0}
            menuHeight={menuRect?.heightMenu ?? 0}
            menuTop={menuRect?.topMenu ?? 0}
            menuBottom={window.innerHeight - (menuRect?.bottomMenu ?? 0)}

            subWidth={menuRect?.width ?? 0}
            subHeight={menuRect?.height ?? 0}
            subTop={menuRect?.top ?? 0}
            subBottom={menuRect?.bottom ?? 0}

            heightWindow={window.innerHeight}
            position={position}
            whiteSpace={whiteSpace}
        >

            {label && <p className='label'>{label}</p>}
            {description && <p className='description'>{description}</p>}

            <div ref={refMenu} className='row'>
                <div className='content-button' onClick={handleOpenMenu}>
                    {children ? children : search ?
                        <input /> :
                        <button type='button'>
                            <span>{button}</span>
                        </button>
                    }
                </div>
                {childrenRight}
            </div>

            {opened &&
                <ul ref={refSubmenu}>
                    {submenu.length === 0 &&
                        <li>
                            <button type='button'>
                                <i></i>
                                <span>Nenhum registro encontrado.</span>
                            </button>
                        </li>}
                    {submenu.map((item, key) =>
                        <li key={`sub-select-${item.name}-${key}`}>
                            <button className={`${item.required ? 'required' : 'normal'}`} type='button' onClick={() => item.required !== true && handleOnClick({
                                onClick: () => item.onClick && item.onClick(item.name),
                            })}>
                                <i className='icon-svg'>
                                    {item.icon}
                                </i>
                                {item.iconFont &&
                                    <div className='icon-font'>
                                        <i className={`fa fa-${item.iconFont}`} />
                                    </div>
                                }
                                {item.avatar &&
                                    <AvatarUser size={30} name={item.name} image={item.avatar} />
                                }
                                <span>
                                    {item.name}
                                </span>
                            </button>
                        </li>
                    )}
                </ul>
            }

        </S.Container>
    )
}