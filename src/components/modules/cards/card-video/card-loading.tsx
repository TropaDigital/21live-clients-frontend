import { Skeleton } from '../../../UI/loading/skeleton/styles'
import * as S from './styles'

type CardFolderLoadingProps = {
    quantity: 'random' | number;
    type: 'card' | 'list'
}

export const CardVideoLoading = ({ type, quantity }: CardFolderLoadingProps) => {
    const length = quantity === 'random'
        ? Math.floor(Math.random() * 5) + 2 // entre 2 e 6
        : quantity;

    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <S.Container type={type} key={index} loading={true}>

                    <div className='thumbnail'>
                        <div className='preview'>
                            <Skeleton width='100%' height='100%' />
                        </div>
                    </div>

                    <div className='infos' style={{ width: '200px' }}>
                        <Skeleton height='19px' widthAuto />
                        <Skeleton height='19px' widthAuto />
                    </div>

                </S.Container>
            ))}
        </>
    );
}
