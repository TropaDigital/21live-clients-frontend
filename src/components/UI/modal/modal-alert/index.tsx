import { useEffect, useState } from 'react';
import { IconCheck, IconWarning } from '../../../../assets/icons';
import { ButtonDefault } from '../../form/button-default';
import { ModalDefault } from '../modal-default';
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext';

interface IProps {
    title?: string;
    description?: string;
    opened: boolean;
    type: IPropsTypeModalAlert;
    onConfirm(): void;
    duration: number;
}

export type IPropsTypeModalAlert = 'error' | 'success' | 'info'

export const ModalAlert = ({ title, description, type, opened, onConfirm, duration }: IProps) => {

    return (
        <>
            {type === 'success' ?
                <S.ContainerAlertSuccess opened={opened}>

                    <div className='box-alert' onClick={onConfirm}>
                        <i>
                            <IconCheck />
                        </i>
                        <div className='text'>
                            <p className='title'>{title}</p>
                            <p className='description'>{description}</p>
                        </div>
                    </div>

                    {opened &&
                        <div style={{ display: 'none' }}>
                            <ProgressBar onComplete={onConfirm} duration={duration} />
                        </div>
                    }

                </S.ContainerAlertSuccess>
                :
                <ModalDefault padding='0px' zIndex={15} layout='center' opened={opened} onClose={onConfirm}>
                    <S.Container type={type}>

                        <div className='item-padding'>
                            <i className='icon'>
                                <IconWarning />
                            </i>
                            <div className='texts'>
                                <p className='title-confirm'>{title}</p>
                                <p className='description-confirm'>
                                    {description}
                                </p>
                            </div>
                            <div className='foot-buttons'>
                                <ButtonDefault flex={true} onClick={onConfirm}>Confirmar</ButtonDefault>
                            </div>
                        </div>
                        <ProgressBar onComplete={onConfirm} duration={duration} />
                    </S.Container>
                </ModalDefault>
            }
        </>
    )
}

const ProgressBar = ({ duration = 10000, onComplete }: { duration?: number, onComplete(): void }) => {

    const { tenant } = useTenant();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const percentage = Math.min((elapsed / duration) * 100, 100);
            setProgress(percentage);

            if (percentage >= 100) {
                clearInterval(interval);
                onComplete();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [duration]);

    return (
        <S.ContainerProgressBar>
            <div
                className='progress'
                style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: tenant?.colormain,
                    borderRadius: 10,
                    transition: 'width 0.1s linear',
                }}
            />
        </S.ContainerProgressBar>
    );
};