import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';
import { useAuth } from '../../../core/contexts/AuthContext';

import { TicketService } from '../../../core/services/TicketService';
import { MediaService } from '../../../core/services/MediaService';
import type { ITicketCat, ITicketField } from '../../../core/types/ITckets';
import type { IMedia } from '../../../core/types/IMedia';
import type { IOptionSelect } from '../../UI/form/select-multiple';

import { IconCheck, IconHeight, IconSortable, IconWidth } from '../../../assets/icons';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';

import * as S from './styles';
import EditorTextSlash from '../../UI/form/editor-text-slash';
import { SelectDefault } from '../../UI/form/select-default';
import { InputUpload, type IFileInputUpload } from '../../UI/form/input-upload';
import { ContainerEditorStatic } from '../../UI/form/editor-text-slash/styles';
import { Skeleton } from '../../UI/loading/skeleton/styles';
import { ReactSortable } from 'react-sortablejs';

interface IProps {
    id: number | null;
    admin: boolean;
    onSubmit?: (data: ITicketCat) => void;
    onLoad?: (data: ITicketCat) => void;
}

interface IPropsEdit extends ITicketCat {

}

export const FormTicketFields = ({ id, admin, onSubmit, onLoad }: IProps) => {

    const { user } = useAuth();
    const { tenant } = useTenant();
    const { addAlert } = useAlert();

    const { organizations, loadingOrganization, getOrganizations, users, loadingUsers, getUsers } = useTenant();

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({} as IPropsEdit);

    const [dataFields, setDataFields] = useState<ITicketField[]>([]);
    const [dataMedias, setDataMedias] = useState<IMedia[]>([])
    const [dataUsers, setDataUsers] = useState<IOptionSelect[]>([])

    const [DTO, setDTO] = useState<any>({
        user_id: user?.user_id,
        organization_id: user?.organization_id
    })

    const [files, setFiles] = useState<IFileInputUpload[]>([])

    console.log('files', files)

    const getData = async () => {
        try {
            setLoading(true);
            const response = await TicketService.getCatById(Number(id));
            if (onLoad) onLoad(response.item)

            const responseFields = await TicketService.getFields(1, 99999, '', '', false, Number(id));

            if (response.item.use_media) {
                const responseMedias = await MediaService.get();
                setDataMedias([...responseMedias.items])
            }

            setData({ ...response.item });
            setDataFields([...responseFields.items])
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
        getOrganizations();
        getUsers();
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

    const handleChangeDTO = (name: string, value: string) => {
        setDTO((prev: any) => ({ ...prev, [name]: value }))
    }



    useEffect(() => {
        const LIST_USERS: IOptionSelect[] = [
            {
                name: user?.name ?? '',
                avatar: user?.avatar ?? '',
                value: String(user?.user_id)
            },
        ]
        users.map((item) => {
            LIST_USERS.push({
                name: item.name,
                value: String(item.user_id),
                avatar: item.avatar ?? '',
            })
        })
        setDataUsers([...LIST_USERS])
    }, [users])


    const SELECTED_USER = dataUsers.find((obj) => Number(obj.value) === Number(DTO.user_id));
    const SELECTED_ORGANIZATION = organizations.find((obj) => obj.organization_id);

    const LIST_MEDIAS = dataMedias.map((item) => {
        return {
            name: item.name,
            value: String(item.media_id),
        }
    })

    const SELECETED_MEDIA = LIST_MEDIAS.find((obj) => obj.value === String(data.default_media_id))
    const SELECETED_MEDIA_FULL = dataMedias.find((obj) => obj.media_id === data.default_media_id)

    return (
        <S.Container color={tenant?.colorhigh} colorBg={tenant?.colorhigh} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>

            <div className='inputs'>

                {data.use_title &&
                    <div className='column-input'>
                        <InputDefault
                            label='Título da Solicitação'
                            onChange={(e) => handleChangeDTO('title', e.target.value)}
                            disabled={admin}
                        />
                    </div>
                }

                <div className='row-input'>
                    {admin ?
                        <InputDefault
                            label='Usuário'
                            value={SELECTED_USER?.name}
                            disabled={admin}
                        />
                        :
                        <SelectDefault
                            label='Usuário'
                            options={dataUsers}
                            value={{
                                name: SELECTED_USER?.name ?? '',
                                value: SELECTED_USER?.value ?? '',
                                avatar: SELECTED_USER?.avatar,
                            }}
                            onChange={(e) => handleChangeDTO('user_id', e.value)}
                            loading={loadingUsers || loading}
                            search
                        />
                    }

                    {admin ?
                        <InputDefault
                            label='Unidade'
                            value={SELECTED_ORGANIZATION?.name}
                            disabled={admin}
                        />
                        :
                        <SelectDefault
                            label='Unidade'
                            options={organizations.map((item) => {
                                return {
                                    name: item.name,
                                    value: String(item.organization_id),
                                }
                            })}
                            value={{
                                name: SELECTED_ORGANIZATION?.name ?? '',
                                value: String(SELECTED_ORGANIZATION?.organization_id) ?? '',
                            }}
                            onChange={(e) => handleChangeDTO('organization_id', e.value)}
                            loading={loadingOrganization || loading}
                            search
                        />
                    }
                </div>

                {loading && [0, 1, 2, 3, 4, 5, 6, 7].map((load) =>
                    <InputLoad key={`load-input-${load}`} />
                )}

                {data.use_media &&
                    <>
                        {data.default_media_id ?
                            <>
                                <div className='column-input'>
                                    <InputDefault
                                        label='Formato da Peça solicitada'
                                        disabled={true}
                                        value={SELECETED_MEDIA?.name}
                                    />
                                </div>
                                <div className='row-input'>
                                    <InputDefault
                                        label='Largura'
                                        description={SELECETED_MEDIA_FULL?.measure}
                                        value={DTO.width}
                                        onChange={(e) => handleChangeDTO('width', e.target.value)}
                                        icon={<IconWidth />}
                                        type='number'
                                        disabled={admin}
                                    />
                                    <InputDefault
                                        label='Largura'
                                        description={SELECETED_MEDIA_FULL?.measure}
                                        value={DTO.height}
                                        onChange={(e) => handleChangeDTO('height', e.target.value)}
                                        icon={<IconHeight />}
                                        type='number'
                                        disabled={admin}
                                    />
                                </div>
                            </>
                            :
                            <div className='column-input'>
                                {admin ?
                                    <InputDefault
                                        label='Formato da Peça solicitada'
                                        disabled={true}
                                        value={SELECETED_MEDIA?.name}
                                    />
                                    :
                                    <SelectDefault
                                        loading={loading}
                                        label='Formato da Peça solicitada'
                                        options={LIST_MEDIAS}
                                        disabled={data.default_media_id ? true : false}
                                        value={{
                                            name: SELECETED_MEDIA?.name ?? 'Nenhum pré selecionado',
                                            value: SELECETED_MEDIA?.value ?? ''
                                        }}
                                        isValidEmpty='Nenhum pré selecionado'
                                        onChange={(e) => setData((prev) => ({ ...prev, default_media_id: Number(e.value) }))}
                                    />
                                }
                            </div>
                        }
                    </>
                }

                {data.setas_default &&
                    <>
                        <div className='head-area'>
                            <h2>Informações que devem estar na peça</h2>
                        </div>
                        <div className='column-input'>
                            <ContainerEditorStatic disabled={admin} style={{ minHeight: 80 }}>
                                {!admin &&
                                    <EditorTextSlash
                                        value={DTO.info}
                                        onChange={(value) => !admin ? handleChangeDTO('info', value) : undefined}
                                    />
                                }
                            </ContainerEditorStatic>
                        </div>

                        <div className='column-input'>
                            <InputDefault
                                label='Objetivo a ser atingido com essa solicitação'
                                value={DTO.target}
                                onChange={((e) => handleChangeDTO('target', e.target.value))}
                                disabled={admin}
                            />
                            <InputDefault
                                label='Formato de Arquivo'
                                description='Ex: JPG, PNG, GIF, PDF...'
                                value={DTO.file_format}
                                onChange={((e) => handleChangeDTO('file_format', e.target.value))}
                                disabled={admin}
                            />
                        </div>

                        <div className='head-area'>
                            <h2>Informações Extras e Observações</h2>
                        </div>
                        <div className='column-input'>
                            <ContainerEditorStatic disabled={admin} style={{ minHeight: 80 }}>
                                {!admin &&
                                    <EditorTextSlash
                                        value={DTO.obs}
                                        onChange={(value) => handleChangeDTO('obs', value)}
                                    />
                                }
                            </ContainerEditorStatic>
                        </div>
                    </>
                }

                <ReactSortable
                    className='sortable-inputs'
                    list={dataFields.map((row) => {
                        return {
                            id: row.ticketcat_field_id,
                            ...row,
                        };
                    })}
                    setList={setDataFields}
                >
                    {dataFields.map((item) =>
                        <div className='item-sortable'>
                            <i>
                                <IconSortable />
                            </i>
                            <InputDefault
                                label={item.name}
                            />
                        </div>
                    )}
                </ReactSortable>

                {data.allow_files &&
                    <div className='column-input'>
                        <InputUpload
                            label='Imagens de Referência'
                            multiple
                            onChange={(data) => data?.files && setFiles(data.files)}
                            typeFile={'file'}
                            accept={['.jpg', '.png', '.gif', '.png', '.webp']}
                            disabled={admin}
                        />
                    </div>
                }

                {!admin &&
                    <>
                        <div className='line' />

                        <div className='foot'>
                            <div>
                                <ButtonDefault loading={loadingSubmit} icon={<IconCheck />}>Enviar</ButtonDefault>
                            </div>
                        </div>
                    </>
                }
            </div>

        </S.Container >
    )
}

export const InputLoad = () => (
    <div className='column-input'>
        <div className='fake-input'>
            <div>
                <Skeleton widthAuto={true} height='18px' />
            </div>
            <div>
                <Skeleton width='100%' height='40px' />
            </div>
        </div>
    </div>
)