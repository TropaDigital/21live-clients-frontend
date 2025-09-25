import { useEffect, useState } from "react";
import { theme } from "../../assets/theme/theme";
import { useTenant } from "../../core/contexts/TenantContext";
import { useRedirect } from "../../core/hooks/useRedirect";
import { UserService } from "../../core/services/UserService";
import { useAuth } from "../../core/contexts/AuthContext";

import { ButtonDefault } from "../../components/UI/form/button-default";
import { InputCheckbox } from "../../components/UI/form/input-checkbox";
import { InputDefault } from "../../components/UI/form/input-default";

import { IconEnvelope, IconPassword, IconWarning } from "../../assets/icons";
import * as S from "./styles";
import { getSlug } from "../../core/utils/params-location";
import { LoadingMain } from "../../components/UI/loading/loading-main";
import { useLocation } from "react-router-dom";

export default function Login() {

    const slug = getSlug();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');

    const { tenant, getTenant, loadingTenant } = useTenant();
    const { handleLogin } = useAuth();
    const { redirectSlug } = useRedirect();

    const [loading, setLoading] = useState(false);
    const [rememberLogin, setRememberLogin] = useState(false);

    const [DTO, setDTO] = useState({
        username: 'admin',
        password: 'tigre@123'
    })

    const [error, setError] = useState('');

    useEffect(() => {
        getTenant();
    }, [slug])

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true);
            const response = await UserService.login(slug, DTO.username, DTO.password, rememberLogin);
            handleLogin(response.token, response.user)
            redirectSlug(redirect ? redirect.replace(`/${slug}/`, '') : '/');
        } catch (error: any) {
            setError('Login ou senha incorretos.')
            setLoading(false);
        }
    }

    const onChangeDTO = (name: string, value: string) => {
        setDTO({ ...DTO, [name]: value });
        setError('');
    }

    return (
        <S.Container color={tenant?.colormain} colorText={tenant?.colorsecond}>

            <LoadingMain loading={loadingTenant} />

            <div className="container">
                <div className="head">
                    <img className="logo" alt={tenant?.name} src={tenant?.images.logo} />
                </div>
                <div className="card">
                    <form onSubmit={handleSubmit}>

                        <div className="head-form">
                            <h1>Bem-vindo</h1>
                            <p>Digite seu login e senha para prosseguir</p>
                        </div>

                        <div className="card-form">

                            {error && <div className="error">
                                <IconWarning />
                                <p>{error}</p>
                            </div>}

                            <div className="inputs">
                                <InputDefault
                                    value={DTO.username}
                                    onChange={(e) => onChangeDTO('username', e.target.value)}
                                    icon={<IconEnvelope />}
                                    label="Login"
                                    placeholder="email@exemplo.com"

                                />
                                <InputDefault
                                    value={DTO.password}
                                    onChange={(e) => onChangeDTO('password', e.target.value)}
                                    icon={<IconPassword />}
                                    label="Senha"
                                    placeholder="Senha"
                                    type="password"
                                />

                                <div className="after-input">
                                    <InputCheckbox checked={rememberLogin} onChange={setRememberLogin} label="Mantenha-me conectado" />
                                    <a target="_blank" href={`https://app.21live.com.br/${tenant?.slug}/forgot/`}>Esqueceu a senha?</a>
                                </div>
                                <ButtonDefault loading={loading}>Entrar</ButtonDefault>
                            </div>
                            <p className="or-line">
                                <span>Ou</span>
                            </p>
                            <ButtonDefault variant="dark" onClick={() => window.open("https://21live.com.br/", "_blank")}>Cadastre-se</ButtonDefault>

                        </div>
                    </form>
                    <div className="bg" style={{
                        backgroundImage: `url(${tenant?.images.bg_login})`
                    }}>
                        <svg width="99" height="862" viewBox="0 0 99 862" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M53.5 60.5351C40.1667 40.6903 13.1 0 11.5 0H0V862H53L33 815.973L16 744.432L12.5 671.389L20.5 601.349L33 523.304L40.5 485.782L50 436.753L68.5 357.207L79 279.162V193.112L53.5 60.5351Z" fill={theme.colors.background.surface} />
                            <path d="M93.9415 137.319C90.3407 89.207 68.7694 25.7264 58.4338 0H7.43457C41.9346 67 46.9346 102 61.4346 178.5C76.1836 256.314 71.4346 310 57.4346 385C53.0479 408.5 37.943 489 28.9346 537.5C19.9261 586 18.4171 589 4.43457 681.5C-3.50148 734 3.93457 782 10.4346 805.5C15.6346 824.3 25.2679 851 29.4346 862H78.4381C67.9359 851.476 27.0994 753.509 22.9261 692.607C16.9163 604.904 37.0959 503 52.4325 446.035C59.9341 415.631 83.593 346.882 90.9413 297.691C103.444 213.997 98.4424 197.458 93.9415 137.319Z" fill={tenant?.colormain} />
                        </svg>
                    </div>
                </div>
            </div>
        </S.Container>
    )
}