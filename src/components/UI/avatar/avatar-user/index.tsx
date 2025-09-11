import { useEffect, useState } from 'react';
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext';
import { theme } from '../../../../assets/theme/theme';

export const AvatarUser = ({ name, border, image, size = 30, fontSize = 11 }: { name: string, border?: string | null; image: string, size?: number, fontSize?: number }) => {

    const { tenant } = useTenant();

    const [imageExist, setImageExist] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setImageExist(true);
        img.onerror = () => setImageExist(false);
        img.src = image;
    }, [image])

    return (
        <S.Container style={{ minWidth: size, minHeight: size, width: size, height: size, border: border ? `2px solid ${theme.colors.background.default}` : 'none', boxShadow: border ? `0px 0px 0px 2px ${border}` : 'none' }}>
            {!imageExist &&
                <div className='name' style={{ fontSize, backgroundColor: tenant?.colormain, color: tenant?.colorsecond }}>
                    {name ? name.slice(0, 2) : null}
                </div>
            }
            {imageExist &&
                <div className='avatar' style={{ backgroundImage: `url(${image})` }}></div>
            }
        </S.Container>
    )

}