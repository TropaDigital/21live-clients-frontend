import { useEffect, useRef, useState } from 'react';
import * as S from './styles'
import { useTenant } from '../../../../core/contexts/TenantContext';
import { FoldersService } from '../../../../core/services/FoldersService';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';
import type { IFolderItem } from '../../../../core/types/iFolder';
import { Skeleton } from '../../../UI/loading/skeleton/styles';

interface IProps {
    onSubmit(item: IFolderItem): void;
    type: 'card' | 'list'
}

export const CardNewFolder = ({ type, onSubmit }: IProps) => {

    const { slug, id } = useParams();

    const { tenant } = useTenant();
    const { user } = useAuth();

    const [name, setName] = useState('Nova pasta')
    const [loading, setLoading] = useState(false);

    const refTitle = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Espera o input focar e depois seleciona o conteúdo
        const timer = setTimeout(() => {
            refTitle.current?.select();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        if (!user?.tenant_id) return;
        if (!slug) return;
        if (loading) return;
        setLoading(true);
        const response = await FoldersService.new({
            name: name,
            tenant_id: user?.tenant_id,
            parent_id: id ? parseInt(id) : null
        })
        setLoading(false);
        onSubmit(response.item);
    }


    return (
        <S.Container
            type={type}
            color={tenant?.colorhigh}
            colorBg={tenant?.colormain}
            colorText={tenant?.colorsecond}

        >
            <div className='head-item' style={{ flex: 1 }}>
                <div className='icon'>
                    <i className='fa fa-folder'></i>
                </div>

                {loading &&
                    <div className='tools'>
                        <Skeleton width='40px' height='40px' />
                        <Skeleton width='40px' height='40px' />
                        <Skeleton width='40px' height='40px' />
                    </div>
                }
            </div>

            <form className='infos' onSubmit={handleOnSubmit}>
                <input
                    disabled={loading}
                    onBlur={handleOnSubmit}
                    autoFocus
                    ref={refTitle}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='title'
                />
                {loading && <Skeleton widthAuto height='17px' />}
            </form>

        </S.Container>
    )
}