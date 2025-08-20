import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';

import { TicketService } from '../../../core/services/TicketService';
import type { ITicketStatus } from '../../../core/types/ITckets';

import { IconCheck, IconTextRename } from '../../../assets/icons';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';

import * as S from './styles';
import { SelectDefault } from '../../UI/form/select-default';
import { InputColor } from '../../UI/form/input-color';

interface IProps {
    id: number | null;
    onSubmit?: (data: ITicketStatus) => void;
    onLoad?: (data: ITicketStatus) => void;
}

interface IPropsEdit extends ITicketStatus {

}

export const FormTicketStatus = ({ id, onSubmit, onLoad }: IProps) => {

    const { tenant } = useTenant();
    const { addAlert } = useAlert();

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({} as IPropsEdit);

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await TicketService.getStatusById(id);
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
            const response = await TicketService.setStatus({
                id: id ? Number(id) : null,
                tenant_id: tenant?.tenant_id ?? 0,
                name: data.name,
                color: data.color,
                type: data.type,
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

    const LIST_TYPES = [
        {
            name: 'Normal',
            value: 'normal'
        },
        {
            name: 'Inicial',
            value: 'inicial'
        },
        {
            name: 'Aprovado',
            value: 'aprovado'
        },
        {
            name: 'Final',
            value: 'final'
        }
    ]

    const SELECETED_TYPE = LIST_TYPES.find((obj) => obj.value === data.type)

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

                        <InputColor
                            label='Cor'
                            value={data?.color || ''}
                            onChange={(e) => setData({ ...data, color: e.target.value })}
                            loading={loading}
                        />
                    </div>

                    <div className='column-input'>
                        <SelectDefault
                            label='Formato de Peça Fixo'
                            description='Força que todas as solicitações feitas usem o formato de peça pré-definido'
                            options={LIST_TYPES}
                            value={{
                                name: SELECETED_TYPE?.name ?? 'Normal',
                                value: SELECETED_TYPE?.value ?? 'normal'
                            }}
                            onChange={(e) => setData((prev) => ({ ...prev, type: e.value }))}
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