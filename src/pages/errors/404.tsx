import { ButtonDefault } from "../../components/UI/form/button-default";
import * as S from "./styles";

export default function Home() {
    return (
        <S.Container>
            <h1>404</h1>
            <p>Página não encontrada.</p>
            <ButtonDefault variant="dark">Voltar</ButtonDefault>
        </S.Container>
    )
}