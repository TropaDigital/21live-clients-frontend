import { useEffect, useState, type InputHTMLAttributes } from 'react';
import * as S from './styles';
import { IconEye, IconEyeClose } from '../../../../assets/icons';
import { Skeleton } from '../../loading/skeleton/styles';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    icon?: any;
    loading?: boolean;
    mask?: 'phone' | 'cpf' | 'cnpj' | 'cep' | 'custom' | 'money';
    currency?: 'BRL';
    customMask?: (value: string) => string;
}

export const InputDefault = ({ loading, currency = 'BRL', label, description, icon, mask, customMask, ...rest }: IProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState(rest.value?.toString() || '');

    useEffect(() => {
        if (mask) {
            setValue(formatValue(value))
        } else {
            setValue(rest.value?.toString() || '')
        }
    }, [rest.value])

    const formatValue = (val: string) => {
        val = val.replace(/\D/g, '');

        switch (mask) {
            case 'phone':
                if (val.length > 2 && val.length <= 7) {
                    return `(${val.slice(0, 2)}) ${val.slice(2)}`;
                } else if (val.length > 7) {
                    return `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7, 11)}`;
                }
                return val;

            case 'cpf':
                return val
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            case 'cnpj':
                return val
                    .replace(/^(\d{2})(\d)/, '$1.$2')
                    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                    .replace(/\.(\d{3})(\d)/, '.$1/$2')
                    .replace(/(\d{4})(\d)/, '$1-$2');

            case 'cep':
                return val.replace(/^(\d{5})(\d)/, '$1-$2');

            case 'money':
                const numberValue = Number(val) / 100; // divide por 100 para ter 2 casas decimais
                return numberValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency,
                });

            case 'custom':
                return customMask ? customMask(val) : val;

            default:
                return val;
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = mask ? formatValue(e.target.value) : e.target.value;
        setValue(maskedValue);
        rest.onChange?.({
            ...e,
            target: { ...e.target, value: maskedValue }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <S.Container>

            {label && <p className='label'>{label}</p>}
            {description && <p className='description'>{description}</p>}

            <div className={`input ${rest.disabled ? 'disabled' : 'normal'}`}>
                {icon && <i>{icon}</i>}

                {loading ? <Skeleton style={{ marginLeft: 10 }} width='80%' height='20px' /> :
                    <input
                        {...rest}
                        value={value}
                        onChange={handleChange}
                        type={showPassword ? 'text' : rest.type}
                    />
                }


                {rest.type === 'password' && !rest.disabled && (
                    <i className='icon-eye' onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <IconEye /> : <IconEyeClose />}
                    </i>
                )}
            </div>
        </S.Container>
    );
};
