import { FormUserProfile } from '../../../components/modules/form-user-profile';
import { useAuth } from '../../../core/contexts/AuthContext';
import * as S from './styles';

export default function SettingsMyAccount() {

    const { user, setUser } = useAuth();

    return (
        <S.Container>
            <FormUserProfile admin={false} onSubmit={(data) => setUser({ ...user, ...data })} id={Number(user?.user_id)} />
        </S.Container>
    )
}