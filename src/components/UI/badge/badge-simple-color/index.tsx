import * as S from './styles'

export const BadgeSimpleColor = ({ name, bg, color }: { name: string; bg: string; color: string }) => {

    return (
        <S.Container>
            <span style={{ backgroundColor: bg, color }}>
                {name}
            </span>
        </S.Container>
    )

}