import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';

import { MediaService } from '../../../core/services/MediaService';
import type { IMediaCat } from '../../../core/types/IMedia';

import { IconCheck, IconTextRename } from '../../../assets/icons';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';

import * as S from './styles';

interface IProps {
    id: number | null;
    onSubmit?: (data: IMediaCat) => void;
    onLoad?: (data: IMediaCat) => void;
}

interface IPropsEdit extends IMediaCat {

}

export const FormMediaCat = ({ id, onSubmit, onLoad }: IProps) => {

    const { tenant } = useTenant();
    const { addAlert } = useAlert();

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({} as IPropsEdit);

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await MediaService.getCatById(id);
                if (onLoad) onLoad(response.item)
                setData({ ...response.item });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [id])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoadingSubmit(true)
            const response = await MediaService.setCat({
                id: id ? Number(id) : null,
                tenant_id: tenant?.tenant_id ?? 0,
                title: data.title,
            });
            if (onSubmit) {
                onSubmit(response.item);
            }
            setLoadingSubmit(false)
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
        } catch (error: any) {
            setLoadingSubmit(false)
            if (error.errors) {
                addAlert('error', 'Ops', error.errors[0]);
            } else {
                addAlert('error', 'Ops', error.message);
            }
        }
    };

    return (
        <S.Container color={tenant?.colorhigh} colorBg={tenant?.colorhigh} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>


            <div className='tab'>

                <div className='inputs'>

                    <div className='row-input'>
                        <InputDefault
                            label='Titulo'
                            value={data?.title || ''}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            icon={<IconTextRename />}
                            loading={loading}
                        />
                    </div>

                    <div className='line' />

                    <div className='foot'>
                        <div>
                            <ButtonDefault loading={loadingSubmit} icon={<IconCheck />}>Salvar</ButtonDefault>
                        </div>
                    </div>
                </div>
            </div>


        </S.Container >
    )
}