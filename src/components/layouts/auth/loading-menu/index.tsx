import { Skeleton } from '../../../UI/loading/skeleton/styles'
import * as S from './styles'

type CardFolderLoadingProps = {
    quantity: 'random' | number;
}

export const LoadingMenu = ({ quantity }: CardFolderLoadingProps) => {
    const length = quantity === 'random'
        ? Math.floor(Math.random() * 5) + 2 // entre 2 e 6
        : quantity;

    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <S.Container key={index}>

                    <Skeleton height='45px' width='100%' />

                </S.Container>
            ))}
        </>
    );
}
