import { useRedirect } from "../../core/hooks/useRedirect";
import * as S from "./styles";

export default function Favorites() {

    const { redirectSlug } = useRedirect();

    return (
        <S.Container>
            <h1>Welcome to the Favorityes Page</h1>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <a href="/21panda/folders/bookmarks">21panda</a>
                <a href="/ancora/folders/bookmarks">ancora</a>
                <a href="/ivecobrandcenter/folders/bookmarks">ivecobrandcenter</a>
                <a href="/cnh/folders/bookmarks">cnh</a>
                <a href="/titan/folders/bookmarks">titan</a>
                <a href="/21adm/folders/bookmarks">21adm</a>
                <a href="/mequi/folders/bookmarks">mequi</a>
                <a href="/linkbelt/folders/bookmarks">linkbelt</a>
            </div>
            <button onClick={() => redirectSlug('dashboard')}>Ir para dashboard</button>
        </S.Container>
    )
}