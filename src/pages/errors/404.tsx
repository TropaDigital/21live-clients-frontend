import { useNavigate } from "react-router-dom";
import { ButtonDefault } from "../../components/UI/form/button-default";
import * as S from "./styles";
import { AvatarTenant } from "../../components/UI/avatar/avatar-tenant";
import { useTenant } from "../../core/contexts/TenantContext";

export default function Home() {

    const navigate = useNavigate();
    const { tenant } = useTenant();

    return (
        <S.Container>

            <div className="central">
                <AvatarTenant
                    size="large"
                    color={tenant?.colorhigh ?? ""}
                    colorBg={tenant?.colormain ?? ""}
                    colorText={tenant?.colorsecond ?? ""}
                    image={tenant?.images.touch ?? ""}
                    name={tenant?.name ?? ""}
                />
                <div className="text">
                    <h1>404</h1>
                    <p>Página não encontrada.</p>
                </div>
                <ButtonDefault onClick={() => navigate(-1)} variant="dark">Voltar</ButtonDefault>
            </div>
        </S.Container>
    )
}