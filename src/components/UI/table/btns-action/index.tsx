import { useEffect, useState } from 'react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { type ISubmenuSelect } from '../../submenu-select';
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext';

interface IProps {
    submenu: ISubmenuSelect[]
}

export const BtnsActionTable = ({ submenu }: IProps) => {

    const { verifyPermission } = useAuth();
    const [options, setOptions] = useState<ISubmenuSelect[]>([])
    const { tenant } = useTenant();

    useEffect(() => {

        const newOtions: ISubmenuSelect[] = []
        submenu.forEach((item) => {
            if ((item.permission && verifyPermission(item.permission) && !item.jobs) || !item.permission) {
                newOtions.push(item)
            }
            if (item.jobs && tenant?.jobs && newOtions.filter((obj) => obj.name === item.name).length === 0) {
                newOtions.push(item)
            }
        })
        setOptions([...newOtions]);

    }, [submenu])

    return (
        <S.Container>
            {options.map((item) =>
                <button
                    data-tooltip-place="top"
                    data-tooltip-id="tooltip"
                    data-tooltip-content={item.name}
                    onClick={item.onClick ? () => item.onClick(item.name) : undefined}
                    type='button'
                >
                    {item.icon}
                </button>
            )}
        </S.Container>

    )
}