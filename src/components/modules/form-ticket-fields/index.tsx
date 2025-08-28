import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';
import { useAuth } from '../../../core/contexts/AuthContext';

import { TicketService } from '../../../core/services/TicketService';
import type { ITicketCat, ITicketField } from '../../../core/types/ITckets';
import type { IMedia } from '../../../core/types/IMedia';
import type { IOptionSelect } from '../../UI/form/select-multiple';

import { IconButtonRadio, IconCheck, IconHeight, IconInput, IconMovePoints, IconPencil, IconPlus, IconSelect, IconSelectMultiple, IconTextarea, IconTrash, IconWidth } from '../../../assets/icons';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';

import * as S from './styles';
import EditorTextSlash from '../../UI/form/editor-text-slash';
import { SelectDefault } from '../../UI/form/select-default';
import { FILE_ACCEPTED_EXTENSIONS, InputUpload, type IFileInputUpload } from '../../UI/form/input-upload';
import { ContainerEditorStatic } from '../../UI/form/editor-text-slash/styles';
import { Skeleton } from '../../UI/loading/skeleton/styles';
import { ReactSortable } from 'react-sortablejs';
import { RenderField } from './render-field';
import { ModalConfirm } from '../../UI/modal/modal-confirm';
import { ModalDefault } from '../../UI/modal/modal-default';
import { useRedirect } from '../../../core/hooks/useRedirect';
import { useParams, useSearchParams } from 'react-router-dom';

interface IProps {
    id: number | null;
    admin: boolean;
    data: ITicketCat;
    loading?: boolean;
    onSubmit?: (data: any) => void;
    dataFields: ITicketField[];
    onChangeField(data: ITicketField): void;
    onChangeFields?(data: ITicketField[]): void;
    dataMedias: IMedia[];
}

export const FormTicketFields = ({ id, admin, data, loading, onSubmit, dataFields, onChangeFields, dataMedias }: IProps) => {

    const { user } = useAuth();
    const { addAlert } = useAlert();
    const { redirectSlug } = useRedirect();
    const { tenant, organizations, loadingOrganization, users, loadingUsers } = useTenant();

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [dataUsers, setDataUsers] = useState<IOptionSelect[]>([])

    const [DTO, setDTO] = useState<any>({
        user_id: user?.user_id,
        organization_id: user?.organization_id
    })
    const [DTOFields, setDTOFields] = useState<any>({});
    const [files, setFiles] = useState<IFileInputUpload[]>([])

    console.log('files', files)
    console.log('loadingSubmit', loadingSubmit)

    const [searchParams] = useSearchParams();
    const modal = searchParams.get("modal");

    const [loadingDuplicate, setLoadingDuplicate] = useState<number | null>(null)
    const [loadingNew, setLoadingNew] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);

    const [showModalRemove, setShowModalRemove] = useState(false);

    const [showModalEdit, setShowModalEdit] = useState(modal === 'new' ? true : false);
    const [DTOModal, setDTOModal] = useState<ITicketField>({ ordem: 1 } as ITicketField);


    const handleChangeDTO = (name: string, value: string) => {
        setDTO((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleChangeDTOField = (name: string, value: string) => {
        setDTOFields((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoadingSubmit(true);
            alert('enviar backend');
            if (onSubmit) onSubmit(DTOFields);
            setLoadingSubmit(false);
        } catch (error) {
            console.error('Error saving form:', error);
            setLoadingSubmit(false);
        }
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

    const handleDuplicate = async (field: ITicketField) => {
        setLoadingDuplicate(field.ticketcat_field_id);

        const response = await TicketService.setField({
            tenant_id: tenant?.tenant_id ?? 0,
            ticket_cat_id: Number(id),
            name: field.name + ' (Cópia)',
            label: field.label + ' (Cópia)',
            description: field.label,
            type: field.type,
            required: field.required,
            options: field.options,
            ordem: dataFields.length + 1,
        });

        let newFields = [];
        newFields = [...dataFields, response.item];
        if (onChangeFields) onChangeFields(newFields);

        setLoadingDuplicate(null);
    }

    const handleModal = (type: 'edit' | 'delete' | 'duplicate', field: ITicketField) => {
        setDTOModal(field);
        if (type === 'edit') {
            setShowModalEdit(true);
        } else if (type === 'delete') {
            setShowModalRemove(true)
        } else if (type === 'duplicate') {
            handleDuplicate(field)
        }
    }

    const handleModalAdd = async () => {

        try {
            setLoadingNew(true);
            if (!data.title && !id) throw new Error('Você precisa inserir um titulo ao formulario antes de adicionar campos.');
            if (!id) {
                const response = await TicketService.setCat({
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
                redirectSlug(`settings/ticket-forms/${response.item.ticket_cat_id}?modal=new`)
            }
            setDTOModal({ ordem: dataFields.length + 1 } as ITicketField);
            setShowModalEdit(true);
            setLoadingNew(false);
        } catch (error: any) {
            setLoadingNew(false);
            addAlert('error', 'Ops', error.message);
        }

    }

    const handleDelete = async () => {
        if (DTOModal?.ticketcat_field_id) {
            setLoadingRemove(true)
            await TicketService.deleteField(DTOModal.ticketcat_field_id);
            if (onChangeFields) onChangeFields(dataFields.filter((item) => item.ticketcat_field_id !== DTOModal.ticketcat_field_id));
            setShowModalRemove(false);
            setLoadingRemove(false)
        }
    }

    const handleSaveField = (field: ITicketField) => {
        let newFields = [];
        if (dataFields.filter((obj) => obj.ticketcat_field_id === field.ticketcat_field_id).length > 0) {
            newFields = dataFields.map((item) => item.ticketcat_field_id === field.ticketcat_field_id ? field : item)
        } else {
            newFields = [...dataFields, field];
        }
        if (onChangeFields) onChangeFields(newFields);
        setShowModalEdit(false);
    }

    const arraysHaveDifferentOrder = (a: any[], b: any[], key: keyof any): boolean => {
        if (a.length !== b.length) return true;

        for (let i = 0; i < a.length; i++) {
            if (a[i][key] !== b[i][key]) return true;
        }

        return false; // mesma ordem
    };

    const handleReorder = async (fields: ITicketField[]) => {

        fields.map((item, index) => {
            item.ordem = index + 1
            return item
        })
        if (onChangeFields) onChangeFields(fields)

        if (arraysHaveDifferentOrder(fields, dataFields, 'ticketcat_field_id')) {
            for (const [index, item] of fields.entries()) {
                TicketService.setField({ ...item, id: item.ticketcat_field_id, ordem: index + 1 });
            }
        }


    };

    const SELECTED_USER = dataUsers.find((obj) => Number(obj.value) === Number(DTO.user_id));
    const SELECTED_ORGANIZATION = organizations.find((obj) => obj.organization_id);

    const LIST_MEDIAS = dataMedias.map((item) => {
        return {
            name: item.name,
            value: String(item.media_id),
        }
    })

    const SELECETED_MEDIA = LIST_MEDIAS.find((obj) => obj.value === String(data.default_media_id));
    const SELECETED_MEDIA_FULL = dataMedias.find((obj) => obj.media_id === data.default_media_id);

    return (
        <>
            <S.Container admin={admin} color={tenant?.colorhigh} colorBg={tenant?.colormain} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>

                <ModalConfirm
                    title="Atenção"
                    description={"Você deseja realmente remover esse campo?"}
                    type="danger"
                    opened={showModalRemove}
                    onCancel={() => setShowModalRemove(false)}
                    onConfirm={handleDelete}
                    loading={loadingRemove}
                />

                <div className='inputs'>

                    {admin &&
                        <>
                            <div className='head-area'>
                                <h2>Campos Fixos</h2>
                                <p>Campos fixos de acordo com as configurações do formulário.</p>
                            </div>
                            <div className='line' />
                        </>
                    }

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
                                            label='Altura'
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
                                            onChange={(e) => handleChangeDTO('media_id', e.value)}
                                        />
                                    }
                                </div>
                            }
                        </>
                    }
                    {data.default_fields &&
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
                </div>

                {(admin || (!admin && dataFields.length > 0)) &&
                    <div className={`${admin ? 'editable-fields' : 'inputs'}`}>

                        {admin &&
                            <div className='head-area row-head'>
                                <div className='icon-head'>
                                    <IconPencil />
                                </div>
                                <div className='title'>
                                    <h2>Campos Customizaveis</h2>
                                    <p>Adicione, edite e reordene campos personalizados para o formulário.</p>
                                </div>
                            </div>
                        }

                        {loading &&
                            [0, 1, 2].map((load) =>
                                <InputLoad key={`load-input-${load}`} />
                            )
                        }

                        {!admin && dataFields.length > 0 &&
                            <div className='list-inputs'>
                                {dataFields.map((field) =>
                                    <RenderField
                                        admin={false}
                                        field={field}
                                        value={DTOFields[`fields-${field.ticketcat_field_id}`] ?? ''}
                                        onChange={(value) => handleChangeDTOField(`fields-${field.ticketcat_field_id}`, value)}
                                    />
                                )}
                            </div>
                        }

                        {admin && dataFields.length > 0 &&
                            <ReactSortable
                                className='list-inputs'
                                list={dataFields.map((row) => {
                                    return {
                                        id: row.ticketcat_field_id,
                                        ...row,
                                    };
                                })}
                                setList={handleReorder}
                                handle='.sortable'
                            >
                                {dataFields.map((field) =>
                                    <RenderField
                                        admin={true}
                                        field={field}
                                        value={DTOFields[`fields-${field.ticketcat_field_id}`] ?? ''}
                                        onChange={(value) => handleChangeDTOField(`fields-${field.ticketcat_field_id}`, value)}
                                        onClickAction={handleModal}
                                        loadingDuplicate={loadingDuplicate === field.ticketcat_field_id}
                                    />
                                )}
                            </ReactSortable>
                        }

                        {admin &&
                            <div className='list-inputs'>
                                <ButtonDefault loading={loadingNew} onClick={() => handleModalAdd()} variant='dark' icon={<IconPlus />} type='button'>Adicionar Campo</ButtonDefault>
                            </div>
                        }


                    </div>
                }

                {data.allow_files &&
                    <div className='inputs'>

                        {admin &&
                            <>
                                <div className='head-area'>
                                    <h2>Upload de arquivos</h2>
                                    <p>Habilitado o envio de arquivos de referência ao abrir a solicitação</p>
                                </div>
                                <div className='line' />
                            </>
                        }

                        <div className='column-input'>
                            <InputUpload
                                label='Arquivos de Referência'
                                multiple
                                onChange={(data) => data?.files && setFiles(data.files)}
                                typeFile={'file'}
                                accept={FILE_ACCEPTED_EXTENSIONS}
                                disabled={admin}
                                maxSizeMB={20}
                            />
                        </div>
                    </div>
                }
            </S.Container>

            <ModalDefault padding='0px' paddingHeader='20px 40px' layout='right' opened={showModalEdit} onClose={() => setShowModalEdit(false)} title={`${DTOModal?.ticketcat_field_id ? 'Editar' : 'Novo'} Campo`}>
                <FieldEditable onClose={() => setShowModalEdit(false)} onSubmit={handleSaveField} field={DTOModal} />
            </ModalDefault>
        </>
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

export const FieldEditable = ({ field, onClose, onSubmit }: { field: ITicketField, onClose(): void, onSubmit(field: ITicketField): void }) => {

    const { addAlert } = useAlert();

    const TYPES = [
        {
            name: 'Campo Simples',
            value: 'input',
            icon: <IconInput />,
        },
        {
            name: 'Campo de Texto',
            value: 'textarea',
            icon: <IconTextarea />,
        },
        {
            name: 'Selecionável',
            value: 'select',
            icon: <IconSelect />,
        },
        {
            name: 'Selecionar Múltiplos',
            value: 'selmultiple',
            icon: <IconSelectMultiple />,
        }
    ]


    const { tenant } = useTenant();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [data, setData] = useState<ITicketField>({ ...field });
    const { id } = useParams();

    useEffect(() => {
        field.options = field.options ?? [];
        field.options = String(field.options) === '[]' ? [] : field.options;
        setData(field);
    }, [field]);

    const handleChange = (name: string, value: string) => {
        setData((prev) => ({ ...prev, [name]: value }));
    }

    const handleAddOption = () => {
        data.options.push(`Opção ${data.options.length + 1}`);
        setData((prev) => ({ ...prev, options: [...data.options] }));
    }

    const handleOnSave = async () => {
        try {
            setLoadingSubmit(true);
            if (!data.type) throw new Error('Selecione um tipo de campo');
            if (!data.label) throw new Error('Digite um título para o campo');
            if (!data.name) throw new Error('Digite um nome para o campo');
            if ((data.type === 'select' || data.type === 'selmultiple') && data.options.length === 0) throw new Error('Adicione ao menos uma opção para o campo');
            data.ticket_cat_id = Number(id)
            data.tenant_id = tenant?.tenant_id ?? 0;
            const response = await TicketService.setField({ id: field.ticketcat_field_id, ...data });
            onSubmit(response.item)
            setLoadingSubmit(false)
            onClose();
        } catch (error: any) {
            setLoadingSubmit(false)
            addAlert('error', 'Ops', error.message);
        }
    }

    console.log('field', field);

    return (
        <S.ContainerEditable admin={true} color={tenant?.colorhigh} colorBg={tenant?.colormain} colorText={tenant?.colorsecond}>

            <div className='form'>

                <div className='types-input'>
                    {TYPES.map((type) => (
                        <div onClick={() => handleChange('type', type.value)} key={type.value} className={`type ${data?.type === type.value ? 'active' : ''}`}>
                            {type.icon}
                            <span>{type.name}</span>
                        </div>
                    ))}
                </div>


                <div className='inputs-edit'>
                    <InputDefault
                        label='Nome do Campo'
                        description='Título do campo dentro da solicitação realizada'
                        value={data?.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <InputDefault
                        label='Título do Campo'
                        description='Texto que aparece como título na hora de preencher a solicitação'
                        value={data?.label || ''}
                        onChange={(e) => handleChange('label', e.target.value)}
                    />
                    <InputDefault
                        label='Descrição'
                        description='Mostra um texto cinza abaixo do título'
                        value={data?.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                {(data.type === 'select' || data.type === 'selmultiple') &&
                    <div className='options'>

                        <div className='label'>Opções</div>

                        <ReactSortable
                            className='list-inputs'
                            list={data.options.map((option, index) => ({
                                id: index,
                                name: option,
                            }))}
                            setList={(items) => setData((prev) => ({ ...prev, options: items.map(item => item.name) }))}
                            handle='.sortable'


                            ghostClass="drag-ghost"
                            chosenClass="drag-chosen"
                        >
                            {data?.options && String(data?.options) !== '[]' && data?.options?.map((item, indice) =>
                                <div className='option'>
                                    <div className='sortable'>
                                        <IconMovePoints />
                                    </div>
                                    <InputDefault
                                        placeholder='Digite o nome da opção'
                                        value={item}
                                        onChange={(e) => {
                                            const newOptions = [...data.options];
                                            newOptions[indice] = e.target.value;
                                            setData((prev) => ({ ...prev, options: newOptions }));
                                        }}
                                        autoFocus={indice === data.options.length - 1}
                                        icon={data.type === 'select' ? <IconButtonRadio /> : <IconCheck />}
                                    />
                                    <ButtonDefault
                                        icon={<IconTrash />}
                                        onClick={() => {
                                            const newOptions = [...data.options];
                                            newOptions.splice(indice, 1);
                                            setData((prev) => ({ ...prev, options: newOptions }));
                                        }}
                                        variant="danger"
                                        type='button'
                                        data-tooltip-place="top" data-tooltip-id="tooltip" data-tooltip-content={'Remover opção'}
                                    />
                                </div>
                            )}
                        </ReactSortable>

                        <ButtonDefault variant="dark" icon={<IconPlus />} onClick={() => handleAddOption()} type='button'>Adicionar opção</ButtonDefault>

                    </div>
                }
            </div>

            <div className='foot-buttons'>
                <ButtonDefault onClick={onClose} variant='lightWhite' type='button'>Cancelar</ButtonDefault>
                <ButtonDefault loading={loadingSubmit} onClick={handleOnSave} type='button'>Confirmar</ButtonDefault>
            </div>

        </S.ContainerEditable>
    )

}