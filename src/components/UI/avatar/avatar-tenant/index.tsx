import { useEffect, useState } from 'react';
import * as S from './styles'

interface IProps {
    name: string;
    color: string;
    colorBg: string;
    colorText: string;
    image: string;
    size?: 'small' | 'medium' | 'large'
}

export const AvatarTenant = ({ name, color, colorBg, colorText, image, size = 'small' }: IProps) => {

    const [imageExist, setImageExist] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setImageExist(true);
        img.onerror = () => setImageExist(false);
        img.src = image;
    }, [image])

    return (
        <S.Container size={size} color={color} colorBg={colorBg} colorText={colorText}>
            <div className='name'>
                <span>
                    {!imageExist &&
                        name.slice(0, 3)
                    }
                </span>
            </div>
            {imageExist &&
                <div className='icon' style={{ backgroundImage: `url(${image})` }}></div>
            }
        </S.Container>
    )
}