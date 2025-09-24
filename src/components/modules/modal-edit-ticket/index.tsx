import { useEffect, useState } from 'react'
import { FormTicketFields } from '../form-ticket-fields'
import * as S from './styles'
import type { IMedia } from '../../../core/types/IMedia'
import type { ITicket, ITicketCat, ITicketDetail, ITicketField } from '../../../core/types/ITckets'
import { TicketService } from '../../../core/services/TicketService'
import { MediaService } from '../../../core/services/MediaService'
import { SelectDefault } from '../../UI/form/select-default'
import { ModalDefault } from '../../UI/modal/modal-default'
import { useTenant } from '../../../core/contexts/TenantContext'
import { ButtonDefault } from '../../UI/form/button-default'
import { useAlert } from '../../../core/contexts/AlertContext'

import type { IFileInputUpload } from '../../UI/form/input-upload'
import { IconSolicitation } from '../../../assets/icons'

interface IProps {
    ticket?: ITicket;
    opened: boolean;
    onClose(): void;
    onSubmit(item: ITicket, type: 'edit' | 'new'): void;
}

export const ModalEditTicket = ({ opened, ticket, onClose, onSubmit }: IProps) => {

    const [id, setId] = useState<number | null>(null)

    const [dataForm, setDataForm] = useState<ITicketCat>({
        use_title: true,
        default_fields: false,
        allow_files: true,
        use_media: false,
    } as ITicketCat);

    const { addAlert } = useAlert();
    const { tenant, organizations, getOrganizations, users, getUsers, ticketCats, loadingTicketCats, getTicketCats } = useTenant();

    const [dataMedias, setDataMedias] = useState<IMedia[]>([])

    const [loadingForm, setLoadingForm] = useState(false)
    const [dataFields, setDataFields] = useState<ITicketField[]>([]);

    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [percentSubmit, setPercentSubmit] = useState('0%');
    const [DTO, setDTO] = useState<any>({});
    const [DTOFields, setDTOFields] = useState<any>({})
    const [files, setFiles] = useState<IFileInputUpload[]>([])

    const [DTOEdit, setDTOEDit] = useState<ITicketDetail | null>(null)

    useEffect(() => {
        if (ticket?.ticket_cat_id) {
            setId(ticket?.ticket_cat_id)
        } else {
            setId(null)
        }
    }, [ticket, opened])

    const getData = async (id: number) => {
        try {
            setDataFields([])

            const response = ticketCats.find((obj) => obj.ticket_cat_id === id)

            if (response?.ticket_cat_id) {
                setDataForm({ ...response })
                if (response.fields && response.fields.length > 0) setDataFields([...response.fields]);
            }

            if (ticket?.ticket_id) {
                setLoadingForm(true);
                const response = await TicketService.getById(ticket.ticket_id);
                setDTOEDit({ ...response.item })
                setLoadingForm(false);
            } else {
                setDTOEDit(null)
            }

            if (response?.use_media) {
                const responseMedias = await MediaService.get();
                setDataMedias([...responseMedias.items])
            }

        } catch (error) {
            setLoadingForm(false);
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (id) {
            getData(id)
        }
    }, [id])

    useEffect(() => {
        if (opened) {
            if (organizations.length === 0) getOrganizations();
            if (users.length === 0) getUsers();
            if (ticketCats.length === 0) getTicketCats();
        }
    }, [id, organizations, users, ticketCats, opened])

    const handleSubmit = async () => {
        try {
            setLoadingSubmit(true);

            DTO.tenant_id = tenant?.tenant_id;
            DTO.app = 'clients'

            if (DTO.user_id) DTO.user_id = Number(DTO.user_id)
            if (DTO.organization_id) DTO.organization_id = Number(DTO.organization_id)
            if (id) DTO.ticket_cat_id = Number(id)

            if (dataForm.use_title && !DTO.title) throw new Error('Título obrigatório.')

            if (DTO.media_id) {
                if (!DTO.width) throw new Error('Largura obrigatório.')
                if (!DTO.height) throw new Error('Altura obrigatório.')
            }

            if (dataFields.filter((obj) => obj.required).length > 0) {
                dataFields.filter((obj) => obj.required).forEach((item) => {
                    if (!DTOFields[item.ticketcat_field_id]) throw new Error(item.name + ' é obrigatório')
                })
            }

            const payloadFields = Object.entries(DTOFields).map(([key, value]: any) => {
                let finalValue = value;

                if (Array.isArray(value)) {
                    // pega apenas os .value de cada item
                    finalValue = value.map(v => v.value).join(",");
                } else if (typeof value === "object" && value !== null) {
                    // pega só o .value do objeto
                    finalValue = value.value ?? "";
                }

                return {
                    ticketcat_field_id: Number(key),
                    value: finalValue
                };
            });

            if (DTO.media_id) {
                DTO.media_id = Number(DTO.media_id)
            } else {
                DTO.media_id = null
            }

            const response = await TicketService.set(DTO, ticket?.ticket_id);
            onSubmit(response.item, ticket?.ticket_id ? 'edit' : 'new');

            setPercentSubmit('40%');
            if (payloadFields.length > 0) {
                await TicketService.setFields(payloadFields, response.item.ticket_id, ticket?.ticket_id ? true : false);
            }

            let percent = 60;
            let percentPerFile = 40 / files.length;
            setPercentSubmit(`${percent}%`);

            for (const item of files) {
                percent = percent + percentPerFile;
                setPercentSubmit(`${percent}%`);
                await TicketService.setFiles(item.file, response.item.ticket_id);
            }

            setPercentSubmit('100%');
        } catch (error: any) {
            console.log('error', error)
            if (error.errors) {
                addAlert('error', 'Ops', error.errors[0]);
            } else {
                addAlert('error', 'Ops', error.message);
            }
            setPercentSubmit('0%')
            setLoadingSubmit(false);
        }
    }

    useEffect(() => {
        if (percentSubmit === '100%') {
            setTimeout(() => {
                setLoadingSubmit(false)
                setPercentSubmit('0%')
                addAlert('success', 'Sucesso', 'A solicitação foi aberta.');
                onClose();
            }, 2000)
        }
    }, [percentSubmit])

    const LIST_FORMS = ticketCats.map((row) => {
        return {
            name: row.title,
            value: String(row.ticket_cat_id),
        }
    })

    const FORM_SELECTED = ticketCats.find((obj) => obj.ticket_cat_id === id)

    return (
        <ModalDefault
            title={`${ticket?.ticket_id ? 'Editar' : 'Nova'} Solicitação`}
            opened={opened}
            onClose={onClose}
            layout='center'
            padding={'0px'}
            paddingHeader={'20px 40px'}
        >

            <S.Container>
                {!ticket?.ticket_id &&
                    <div className='head-select-form'>
                        <SelectDefault
                            isValidEmpty='Nenhum Selecionado'
                            label='Formulário'
                            options={LIST_FORMS}
                            loading={loadingTicketCats}
                            onChange={(e) => setId(Number(e.value))}
                            search={true}
                            icon={<IconSolicitation />}
                            value={{
                                name: FORM_SELECTED?.title ?? 'Nenhum selecionado',
                                value: String(FORM_SELECTED?.ticket_cat_id) ?? ''
                            }}
                        />
                    </div>
                }

                {(id === dataForm.ticket_cat_id) &&
                    <>
                        <div className='form'>
                            <FormTicketFields
                                id={id}
                                admin={false}
                                loading={loadingForm}
                                data={dataForm}
                                dataFields={dataFields}
                                dataMedias={dataMedias}
                                DTOEdit={DTOEdit ?? undefined}
                                onChangeDTO={(data) => {
                                    setDTO({ ...data.DTO });
                                    setDTOFields({ ...data.DTOFields });
                                    setFiles([...data.files])
                                }}
                            />
                        </div>
                        <div className='foot-buttons'>
                            <ButtonDefault onClick={onClose} variant='light'>Cancelar</ButtonDefault>
                            <ButtonDefault onClick={handleSubmit} loading={loadingSubmit}>Confirmar</ButtonDefault>
                        </div>
                    </>
                }

                {!id &&
                    <div className='empty-form'>
                        <i style={{ backgroundColor: tenant?.colorhigh }}>
                            <IconSolicitation />
                        </i>
                        <div className='texts'>
                            <p className='title'>Nova Solicitação</p>
                            <p className='description'>Selecione um formulário para preencher a Solicitação</p>
                        </div>
                    </div>
                }

                {loadingSubmit &&
                    <div className='loading-submit'>

                        <div className='round-icon'>
                            <div className='icon normal'>
                                <i>
                                    <IconSolicitation />
                                </i>
                            </div>

                            <div className='icon success' style={{ height: percentSubmit }}>
                                <i style={{ backgroundColor: tenant?.colormain, color: 'white' }}>
                                    <IconSolicitation />
                                </i>
                            </div>
                        </div>

                        <p>
                            Confirmando a solicitação, aguarde alguns segundos.
                        </p>

                    </div>
                }

            </S.Container>
        </ModalDefault>
    )
}