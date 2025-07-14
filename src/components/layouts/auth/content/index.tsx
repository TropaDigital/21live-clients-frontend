import type { ReactNode } from 'react';
import * as S from './styles'

interface IProps {
    name: string;
    icon?: ReactNode;
    children: ReactNode;
    padding?: boolean;
}

export const ContentAuthLayout = ({ name, icon, padding = true, children }: IProps) => {
    return (
        <S.Container padding={padding}>
            <div className='head-page'>
                {icon &&
                    <i>
                        {icon}
                    </i>
                }
                <h2>{name}</h2>
            </div>
            <div className='content-page'>
                {children}
            </div>
        </S.Container>
    )
}