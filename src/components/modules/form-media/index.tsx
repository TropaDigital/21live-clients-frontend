import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';

import { MediaService } from '../../../core/services/MediaService';
import type { IMedia, IMediaCat } from '../../../core/types/IMedia';

import { IconCheck, IconMoney, IconTextRename } from '../../../assets/icons';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';

import * as S from './styles';
import { InputCheckbox } from '../../UI/form/input-checkbox';
import { SelectDefault } from '../../UI/form/select-default';
import { unmaskMoney } from '../../../core/utils/replaces';
import { LabelCheckbox } from '../../UI/form/input-checkbox/styles';

interface IProps {
    id: number | null;
    onSubmit?: (data: IMedia) => void;
    onLoad?: (data: IMedia) => void;
}

interface IPropsEdit extends IMedia {

}

export const FormMedia = ({ id, onSubmit, onLoad }: IProps) => {

    const { tenant } = useTenant();
    const { addAlert } = useAlert();

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({} as IPropsEdit);

    const [dataCats, setDataCats] = useState<IMediaCat[]>([])

    const [showValue, setShowValue] = useState(false)

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await MediaService.getById(id);
                if (onLoad) onLoad(response.item)
                setData({ ...response.item });
                if (response.item.value) {
                    setShowValue(true)
                }
            }
            const responseCats = await MediaService.getCats();
            setDataCats([...responseCats.items])
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

            if (!data.name) throw new Error('Campo nome é obrigatório')
            if (!data.media_cat_id) throw new Error('Campo categoria é obrigatório')

            setLoadingSubmit(true)
            const response = await MediaService.set({
                id: id ? Number(id) : null,
                tenant_id: tenant?.tenant_id ?? 0,
                media_cat_id: data.media_cat_id,
                name: data.name,
                measure: data.measure,
                sizeable: data.sizeable,
                value: Number(unmaskMoney(data.value, true))
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

    const LIST_CATS = dataCats.map((item) => {
        return {
            name: item.title,
            value: String(item.media_cat_id),
        }
    })

    const SELECTED_MEDIA = LIST_CATS.find((obj) => obj.value === String(data.media_cat_id))

    const LIST_UNITS = [
        {
            name: 'Centímetro',
            value: 'cm'
        },
        {
            name: 'Metro',
            value: 'm'
        },
        {
            name: 'Pixel',
            value: 'px'
        }
    ]

    const SELECTED_UNIT = LIST_UNITS.find((obj) => obj.value === data.measure)

    return (
        <S.Container color={tenant?.colorhigh} colorBg={tenant?.colorhigh} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>


            <div className='tab'>

                <div className='inputs'>

                    <div className='row-input'>
                        <InputDefault
                            label='Nome'
                            value={data?.name || ''}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            icon={<IconTextRename />}
                            loading={loading}
                        />
                    </div>

                    <div className='column-input'>

                        <SelectDefault
                            label='Categoria'
                            options={LIST_CATS}
                            value={{
                                name: SELECTED_MEDIA?.name ?? 'Selecionar',
                                value: SELECTED_MEDIA?.value ?? ''
                            }}
                            onChange={(e) => setData((prev) => ({ ...prev, media_cat_id: Number(e.value) }))}
                        />

                    </div>

                    <div className='column-input'>
                        <SelectDefault
                            label='Unidade de Medida'
                            options={LIST_UNITS}
                            value={{
                                name: SELECTED_UNIT?.name ?? LIST_UNITS[2].name,
                                value: SELECTED_UNIT?.value ?? LIST_UNITS[2].value
                            }}
                            onChange={(e) => setData((prev) => ({ ...prev, measure: e.value }))}
                        />
                    </div>

                    <div className='column-input'>
                        <LabelCheckbox>
                            <InputCheckbox
                                label='Necessita Tamanho'
                                checked={data.sizeable}
                                loading={loading}
                                onChange={(bol) => setData((prev) => ({ ...prev, sizeable: bol }))}
                            />
                        </LabelCheckbox>


                        <LabelCheckbox>
                            <InputCheckbox
                                label='Habilitar Valores'
                                checked={showValue}
                                loading={loading}
                                onChange={(bol) => { setShowValue(bol); setData((prev) => ({ ...prev, value: bol === false ? '0' : prev.value })) }}
                            />
                        </LabelCheckbox>

                        {showValue &&
                            <InputDefault
                                label='Preço do Formato'
                                value={data?.value || ''}
                                onChange={(e) => setData({ ...data, value: e.target.value })}
                                icon={<IconMoney />}
                                loading={loading}
                                mask='money'
                            />
                        }

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