import * as S from './styles'
import { IconCheck } from '../../../../assets/icons';
import { useTenant } from '../../../../core/contexts/TenantContext';


interface IProps {
    label?: string;
    onChange(bol: boolean): void;
    checked: boolean;
}

export const InputCheckbox = ({ label, checked, onChange }: IProps) => {

    const { tenant } = useTenant();

    return (
        <S.Container color={tenant?.colormain} colorText={tenant?.colorsecond} checked={checked}>
            <div onClick={() => onChange(!checked)} className='checkbox'>
                <i>
                    <IconCheck />
                </i>
            </div>
            {label &&
                <p onClick={() => onChange(!checked)} className='label'>
                    {label}
                </p>
            }
        </S.Container>
    )
}