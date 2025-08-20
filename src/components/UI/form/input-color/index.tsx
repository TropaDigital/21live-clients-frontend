import { useRef, type InputHTMLAttributes } from 'react';
import * as S from './styles';
import { Skeleton } from '../../loading/skeleton/styles';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    loading?: boolean;
}

export const InputColor = ({ loading, label, description, ...rest }: IProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpenColor = () => {
        inputRef.current?.click();
    };


    return (
        <S.Container>

            {label && <p className='label'>{label}</p>}
            {description && <p className='description'>{description}</p>}

            <div className={`input ${rest.disabled ? 'disabled' : 'normal'}`}>

                <div onClick={handleOpenColor} className='color-preview' style={{ backgroundColor: `${rest.value}` }} />

                <input type="color" ref={inputRef} className='input-color' onChange={rest.onChange} />

                {loading ? <Skeleton style={{ marginLeft: 10 }} width='80%' height='20px' /> :
                    <input
                        {...rest}
                    />
                }

            </div>
        </S.Container>
    );
};
