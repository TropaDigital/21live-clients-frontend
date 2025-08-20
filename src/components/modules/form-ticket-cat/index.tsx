import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';

import { TicketService } from '../../../core/services/TicketService';
import { MediaService } from '../../../core/services/MediaService';
import type { ITicketCat } from '../../../core/types/ITckets';
import type { IMedia } from '../../../core/types/IMedia';

import { IconCheck, IconTextRename } from '../../../assets/icons';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';

import * as S from './styles';
import { InputCheckbox } from '../../UI/form/input-checkbox';
import { SelectDefault } from '../../UI/form/select-default';
import { useAuth } from '../../../core/contexts/AuthContext';

interface IProps {
    id: number | null;
    onSubmit?: (data: ITicketCat) => void;
    onLoad?: (data: ITicketCat) => void;
}

interface IPropsEdit extends ITicketCat {

}

export const FormTicketCat = ({ id, onSubmit, onLoad }: IProps) => {

    const { verifyPermission } = useAuth();
    const { tenant } = useTenant();
    const { addAlert } = useAlert();

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({
        use_title: true,
        default_fields: true,
        allow_files: true,
        use_media: true,
    } as IPropsEdit);

    const [dataMedias, setDataMedias] = useState<IMedia[]>([])

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await TicketService.getCatById(id);
                if (onLoad) onLoad(response.item)
                setData({ ...response.item });
            }
            const responseMedias = await MediaService.get();
            setDataMedias([...responseMedias.items])
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
            const response = await TicketService.setCat({
                id: id ? Number(id) : null,
                tenant_id: tenant?.tenant_id ?? 0,
                title: data.title,
                setas_default: data.setas_default,
                private_media: data.private,
                use_title: data.use_title,
                default_fields: data.default_fields,
                allow_files: data.allow_files,
                use_media: data.use_media,
                default_media_id: data.default_media_id,
                jobs: data.jobs,
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

    const LIST_MEDIAS = dataMedias.map((item) => {
        return {
            name: item.name,
            value: String(item.media_id),
        }
    })

    const SELECETED_MEDIA = LIST_MEDIAS.find((obj) => obj.value === String(data.default_media_id))

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

                    <div className='column-input'>
                        {tenant?.jobs &&
                            <div className='label-checkbox'>
                                <InputCheckbox
                                    label='Habilitar em Tarefas'
                                    checked={data.jobs}
                                    loading={loading}
                                    onChange={(bol) => setData((prev) => ({ ...prev, jobs: bol }))}
                                />
                            </div>
                        }
                        <div className='label-checkbox'>
                            <InputCheckbox
                                label='Habilitar Categoria Padrão'
                                checked={data.setas_default}
                                loading={loading}
                                onChange={(bol) => setData((prev) => ({ ...prev, setas_default: bol }))}
                            />
                            <p>Sobrescreve a categoria "Padrão" do sistema e fica no topo da lista. Se múltiplas padrão forem cadastradas, elas aparecem primeiro em ordem alfabética.</p>
                        </div>

                        {!data.setas_default && verifyPermission('tickets_viewall') &&
                            <div className='label-checkbox'>
                                <InputCheckbox
                                    label='Habilitar Categoria Privada'
                                    checked={data.private}
                                    loading={loading}
                                    onChange={(bol) => setData((prev) => ({ ...prev, private: bol }))}
                                />
                                <p>Essa categoria só será visível pra usuários com permissão pra visualizar todas as solicitações.</p>
                            </div>
                        }

                        <div className='label-checkbox'>
                            <InputCheckbox
                                label='Habilitar Campo Título'
                                checked={data.use_title}
                                loading={loading}
                                onChange={(bol) => setData((prev) => ({ ...prev, use_title: bol }))}
                            />
                        </div>

                        <div className='label-checkbox'>
                            <InputCheckbox
                                label='Habilitar Campos padrões'
                                checked={data.default_fields}
                                loading={loading}
                                onChange={(bol) => setData((prev) => ({ ...prev, default_fields: bol }))}
                            />
                            <p>Habilita na solicitação os campos: Informações, Objetivo, Observações e Formato do Arquivo</p>
                        </div>

                        <div className='label-checkbox'>
                            <InputCheckbox
                                label='Habilitar Envio de Imagens de Referência'
                                checked={data.allow_files}
                                loading={loading}
                                onChange={(bol) => setData((prev) => ({ ...prev, allow_files: bol }))}
                            />
                            <p>Habilita o envio de arquivos de referência ao abrir a solicitação</p>
                        </div>

                        <div className='label-checkbox'>
                            <InputCheckbox
                                label='Habilitar Formato de Peça'
                                checked={data.use_media}
                                loading={loading}
                                onChange={(bol) => setData((prev) => ({ ...prev, use_media: bol }))}
                            />
                            <p>Habilita definir um Formato de Peça para a Solicitação.</p>
                        </div>

                    </div>

                    {data.use_media &&
                        <div className='column-input'>
                            <SelectDefault
                                label='Formato de Peça Fixo'
                                description='Força que todas as solicitações feitas usem o formato de peça pré-definido'
                                options={LIST_MEDIAS}
                                value={{
                                    name: SELECETED_MEDIA?.name ?? 'Nenhum pré selecionado',
                                    value: SELECETED_MEDIA?.value ?? ''
                                }}
                                isValidEmpty='Nenhum pré selecionado'
                                onChange={(e) => setData((prev) => ({ ...prev, default_media_id: Number(e.value) }))}
                            />
                        </div>
                    }

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