import type { ButtonHTMLAttributes, ReactNode } from 'react'
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext'

// Interface estendendo as props nativas do botão
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    icon?: ReactNode // Aceita SVG ou qualquer elemento React
    iconPosition?: 'left' | 'right' // Opcional: controle da posição do ícone
    loading?: boolean;
    flex?: boolean;
    total?: number;
    variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'lightWhite'
    | 'dark'
    | 'blocked'
}

export const ButtonDefault = ({
    children,
    icon,
    flex = true,
    iconPosition = 'left',
    variant = 'primary',
    loading,
    total,
    ...rest
}: ButtonProps) => {

    const { tenant } = useTenant();

    return (
        <S.Container
            flex={flex}
            variant={variant}
            colorBg={tenant?.colormain}
            color={tenant?.colorhigh}
            colorText={tenant?.colorsecond}
            {...rest}
            onClick={loading ? undefined : rest.onClick}
            disabled={loading ? true : variant === 'blocked' ? true : rest.disabled}
        >
            <div className='relative'>
                {iconPosition === 'left' && icon && <i>{icon}</i>}
                {!loading ? children : <IconLoadingBounce />}
                {iconPosition === 'right' && icon && <i>{icon}</i>}
            </div>
            {total && total > 0 ?
                <div className='total'>
                    {total}
                </div>
                : null}
        </S.Container>
    )
}

export const IconLoadingBounce = () => (
    <S.SpinnerContainer>
        <S.Bouce1 />
        <S.Bouce2 />
    </S.SpinnerContainer>
)