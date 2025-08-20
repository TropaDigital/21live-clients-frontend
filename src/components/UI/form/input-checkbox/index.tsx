import * as S from './styles'
import { IconCheck, IconLoading } from '../../../../assets/icons';
import { useTenant } from '../../../../core/contexts/TenantContext';


interface IProps {
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    onChange(bol: boolean): void;
    checked: boolean;
}

export const InputCheckbox = ({ label, loading, checked, disabled, onChange }: IProps) => {

    const { tenant } = useTenant();

    return (
        <S.Container disabled={disabled} color={tenant?.colormain} colorText={tenant?.colorsecond} checked={loading ? false : checked}>
            <div onClick={() => (!disabled && !loading) && onChange(!checked)} className='checkbox'>
                <i>
                    <IconCheck />
                </i>
            </div>

            {loading && <IconLoading size={18} />}

            {label &&
                <p onClick={() => (!disabled && !loading) && onChange(!checked)} className='label'>
                    {label}
                </p>
            }
        </S.Container>
    )
}