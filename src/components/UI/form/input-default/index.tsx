import { useState, type InputHTMLAttributes } from 'react';
import * as S from './styles'
import { IconEye, IconEyeClose } from '../../../../assets/icons';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: any;
    // Você pode adicionar outras props customizadas aqui
}

export const InputDefault = ({ label, icon, ...rest }: IProps) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <S.Container>
            {label &&
                <p className='label'>{label}</p>
            }
            <div className='input'>
                {icon &&
                    <i>
                        {icon}
                    </i>
                }
                <input
                    {...rest}
                    type={showPassword ? 'text' : rest.type}
                />
                {rest.type === 'password' &&
                    <i className='icon-eye' onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <IconEye /> : <IconEyeClose />}
                    </i>
                }
            </div>
        </S.Container>
    )
}