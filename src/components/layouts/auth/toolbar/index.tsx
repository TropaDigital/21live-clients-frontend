import type { ReactNode } from 'react'
import * as S from './styles'

interface IProps {
    children: ReactNode
}

export const Toolbar = ({ children }: IProps) => {
    return (
        <S.Container>
            {children}
        </S.Container>
    )
}