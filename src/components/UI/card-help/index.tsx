import type { ReactNode } from 'react';
import { IconWarning } from '../../../assets/icons';
import * as S from './styles'
import { useTenant } from '../../../core/contexts/TenantContext';

export const CardHelp = ({ title, children }: { title: string; children: ReactNode }) => {

    const { tenant } = useTenant();

    return (
        <S.Container colorBg={tenant?.colormain} color={tenant?.colorhigh} colorText={tenant?.colorsecond}>
            <div className='head-info'>
                <i>
                    <IconWarning />
                </i>
                <p>{title}</p>
            </div>

            <ul className='content-info'>
                {children}
            </ul>
        </S.Container>
    )
}