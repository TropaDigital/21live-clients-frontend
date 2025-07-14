import { useEffect, useState } from 'react';
import * as S from './styles'

interface IProps {
    name: string;
    color: string;
    colorBg: string;
    colorText: string;
    image: string;
}

export const AvatarTenant = ({ name, color, colorBg, colorText, image }: IProps) => {

    const [imageExist, setImageExist] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setImageExist(true);
        img.onerror = () => setImageExist(false);
        img.src = image;
    }, [image])

    return (
        <S.Container color={color} colorBg={colorBg} colorText={colorText}>
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