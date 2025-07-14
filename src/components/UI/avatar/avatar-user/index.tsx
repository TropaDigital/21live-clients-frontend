import { useEffect, useState } from 'react';
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext';

export const AvatarUser = ({ name, image, size = 30, fontSize = 11 }: { name: string, image: string, size?: number, fontSize?: number }) => {

    const { tenant } = useTenant();

    const [imageExist, setImageExist] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setImageExist(true);
        img.onerror = () => setImageExist(false);
        img.src = image;
    }, [image])

    return (
        <S.Container style={{ width: size, height: size }}>
            {!imageExist &&
                <div className='name' style={{ fontSize, backgroundColor: tenant?.colormain, color: tenant?.colorsecond }}>
                    {name.slice(0, 2)}
                </div>
            }
            {imageExist &&
                <div className='avatar' style={{ backgroundImage: `url(${image})` }}></div>
            }
        </S.Container>
    )

}