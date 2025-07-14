import { Skeleton } from '../../UI/loading/skeleton/styles';
import * as S from './styles'

type CardFolderLoadingProps = {
    quantity: 'random' | number;
}

export const LoadingTree = ({ quantity }: CardFolderLoadingProps) => {
    const length = quantity === 'random'
        ? Math.floor(Math.random() * 5) + 2 // entre 2 e 6
        : quantity;

    return (
        <>
            {Array.from({ length }).map((_) => (
                <S.ItemWrapper>

                    <div className='folder'>
                        <button className='children-open'>
                            <Skeleton width='20px' height='20px' />
                        </button>
                        <Skeleton width='30px' height='30px' />
                        <Skeleton widthAuto={true} height='30px' />
                    </div>

                </S.ItemWrapper>
            ))}
        </>
    );
}
