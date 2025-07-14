import { Skeleton } from '../../../UI/loading/skeleton/styles'
import * as S from './styles'

type CardFolderLoadingProps = {
    quantity: 'random' | number
    type: 'card' | 'list'
}

export const CardFolderLoading = ({ quantity, type }: CardFolderLoadingProps) => {
    const length = quantity === 'random'
        ? Math.floor(Math.random() * 5) + 2 // entre 2 e 6
        : quantity;

    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <S.Container type={type} key={index} loading={true}>
                    <div className='head-item'>
                        <Skeleton width='45px' height='45px' />
                    </div>

                    <div className='infos' style={{ width: '200px' }}>
                        <Skeleton height='19px' widthAuto />
                        <Skeleton height='19px' widthAuto />
                    </div>
                </S.Container >
            ))}
        </>
    );
}
