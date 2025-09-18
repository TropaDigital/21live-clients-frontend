import { useEffect, useState } from 'react';
import { IconClock, IconLogout } from '../../../assets/icons';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useTenant } from '../../../core/contexts/TenantContext';
import { useSessionTimer } from '../../../core/hooks/useSessionTimer';
import { ButtonDefault } from '../../UI/form/button-default';
import * as S from './styles'
import { STORAGE_TOKEN, STORAGE_USER } from '../../../core/constants';

export const ModalExpireToken = () => {

    const { isExpired, countdown, percentage, showWarningModal } = useSessionTimer();
    const { tenant } = useTenant();
    const { token, setIsLogged, handleRefreshToken } = useAuth();

    const [modalOpened, setModalOpened] = useState(false)

    const [loadingRefresh, setLoadingRefresh] = useState(false);

    useEffect(() => {
        if (token && isExpired) {
            setModalOpened(true)
        } else if (token && showWarningModal) {
            setModalOpened(true)
        } else {
            setModalOpened(false)
        }
    }, [token, isExpired, showWarningModal])

    useEffect(() => {
        if (modalOpened && isExpired) {
            handleLogout();
        }

    }, [modalOpened, isExpired])

    const handleRenewToken = async () => {
        setLoadingRefresh(true);
        await handleRefreshToken();
        setLoadingRefresh(false);
    }

    const handleLogout = async () => {
        window.localStorage.removeItem(STORAGE_TOKEN);
        window.localStorage.removeItem(STORAGE_USER);
        setIsLogged(false)
    }

    return (
        <>
            <S.Container
                colorBg={tenant?.colormain}
                color={tenant?.colorhigh}
                colorText={tenant?.colorsecond}
                opened={modalOpened}
            >

                {showWarningModal &&
                    <div className='box'>
                        <div className='head'>
                            <p className='title'>Alguem ai?</p>
                            <p className='description'>Parece que você está inativo. Sua sessão irá expirar em breve, deseja continuar?</p>
                        </div>

                        <div className='coutdown'>
                            <IconClock />
                            <b>{countdown}</b>
                        </div>

                        <div className='bar-percentage'>

                            <div className='bar'>
                                <div className='percentage' style={{ width: `${percentage}%` }}>
                                    <div className='solid' />
                                    <div className='linear' />
                                </div>
                            </div>
                            <div className='limit'>
                                <IconLogout />
                            </div>

                        </div>
                        <ButtonDefault loading={loadingRefresh} onClick={handleRenewToken} variant="dark">Continuar navegando</ButtonDefault>
                    </div>
                }

                {isExpired &&
                    <div className='box'>
                        <div className='head'>
                            <p className='title'>Sessão expirada</p>
                            <p className='description'>Por segurança, sua sessão foi encerrada após um período de inatividade. Faça login novamente para continuar.</p>
                        </div>
                        <ButtonDefault onClick={() => {
                            window.location.reload();
                        }}
                            variant="dark">
                            Fazer login
                        </ButtonDefault>
                    </div>
                }

            </S.Container>
        </>
    )
}