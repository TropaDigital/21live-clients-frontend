import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import * as S from './styles';
import { useClickOutside } from '../../../core/hooks/useClickOutside';
import { AvatarUser } from '../avatar/avatar-user';
import { createPortal } from "react-dom";

interface IProps {
    search?: boolean;
    submenu: ISubmenuSelect[];
    button?: ReactNode;
    children?: ReactNode;
    childrenRight?: ReactNode;
    label?: string;
    disabled?: boolean;
    description?: string;
    position?: 'left' | 'right';
    onSelected?(): void;
    closeOnSelected?: boolean;
    loading?: boolean;
    whiteSpace?: 'nowrap' | 'normal';
}

export interface ISubmenuSelect {
    name: string;
    avatar?: string;
    icon?: ReactNode;
    iconFont?: string;
    onClick?(name: string): void;
    path?: string;
    required?: boolean;
    permission?: string;
    jobs?: boolean;
    total?: number
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
    const refSubmenu = useRef<HTMLUListElement>(null);
    const refMenu = useRef<HTMLDivElement>(null);
    const refChildrenRight = useRef<HTMLDivElement>(null);

    const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});

    const handleOpenMenu = () => {
        if (!loading) setOpened(true);
    };

    useLayoutEffect(() => {
        if (!refMenu.current || !opened) return;

        const updatePosition = () => {
            if (!refMenu.current) return;

            const rect = refMenu.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const maxHeight = 250;

            let style: React.CSSProperties = {
                position: "absolute",
                zIndex: 9999,
            };

            // Vertical
            const spaceBelow = viewportHeight - rect.bottom - 5;
            const spaceAbove = rect.top - 5;

            if (spaceBelow >= maxHeight || spaceBelow >= spaceAbove) {
                // abre para baixo
                style.top = rect.bottom + window.scrollY + 5;
                style.maxHeight = Math.min(maxHeight, spaceBelow);
            } else {
                // abre para cima
                style.bottom = viewportHeight - rect.top + window.scrollY + 5;
                style.maxHeight = Math.min(maxHeight, spaceAbove);
            }

            // 🔑 Ajuste horizontal ANTES de renderizar
            let left = rect.left + window.scrollX;

            // largura estimada do submenu: usa o parent como base
            const estimatedWidth = refSubmenu.current?.offsetWidth || rect.width;

            if (left + estimatedWidth > viewportWidth - 8) {
                left = viewportWidth - estimatedWidth - 8 + window.scrollX;
            }

            left = Math.max(left, 8 + window.scrollX);
            style.left = left;

            setPositionStyle(style);
        };

        updatePosition();

        const observer = new ResizeObserver(updatePosition);
        observer.observe(refMenu.current);

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition);
        };
    }, [opened]);

    useClickOutside(refSubmenu, () => setOpened(false));

    // Dentro do seu componente SubmenuSelect
    useEffect(() => {
        if (!opened) return;

        const handleScrollOutside = (event: Event) => {
            if (!refSubmenu.current) return;

            // Pega o elemento alvo do scroll, se houver
            const target = event.target as HTMLElement;
            if (!refSubmenu.current.contains(target)) {
                setOpened(false);
            }
        };

        // Scroll global (window)
        window.addEventListener("scroll", handleScrollOutside, true); // capture phase

        return () => {
            window.removeEventListener("scroll", handleScrollOutside, true);
        };
    }, [opened]);

    const handleOnClick = (onClick?: (name: string) => void, name?: string) => {
        if (onClick) onClick(name ?? "");
        if (closeOnSelected) setOpened(false);
        if (onSelected) onSelected();
    };

    return (
        <S.Container
            position={position}
            whiteSpace={whiteSpace}
            widthChildrenRight={refChildrenRight.current?.clientWidth}
        >
            {label && <p className='label'>{label}</p>}
            {description && <p className='description'>{description}</p>}

            <div ref={refMenu} className='row'>
                <div className="content-button" onClick={handleOpenMenu}>
                    {children ? children : search ? (
                        <input />
                    ) : (
                        <button type='button'>
                            <span>{button}</span>
                        </button>
                    )}
                </div>
                {childrenRight && (
                    <div ref={refChildrenRight} className='children-right'>
                        {childrenRight}
                    </div>
                )}
            </div>

            {opened &&
                createPortal(
                    <S.ContainerSubPortal ref={refSubmenu} style={positionStyle}>
                        {submenu.length === 0 ? (
                            <li>
                                <button type='button'>
                                    <i></i>
                                    <span>Nenhum registro encontrado.</span>
                                </button>
                            </li>
                        ) : (
                            submenu.map((item, key) => (
                                <li key={`sub-select-${item.name}-${key}`}>
                                    <button
                                        className={item.required ? 'required' : 'normal'}
                                        type='button'
                                        onClick={() =>
                                            item.required !== true &&
                                            handleOnClick(item.onClick, item.name)
                                        }
                                    >
                                        <i className='icon-svg'>{item.icon}</i>
                                        {item.iconFont && (
                                            <div className='icon-font'>
                                                <i className={`fa fa-${item.iconFont}`} />
                                            </div>
                                        )}
                                        {item.avatar && (
                                            <AvatarUser
                                                size={30}
                                                name={item.name}
                                                image={item.avatar}
                                            />
                                        )}
                                        <span>{item.name}</span>
                                    </button>
                                </li>
                            ))
                        )}
                    </S.ContainerSubPortal>,
                    document.body
                )}
        </S.Container>
    );
};
