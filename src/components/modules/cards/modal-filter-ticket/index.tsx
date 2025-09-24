import { useEffect, useState } from 'react';
import { IconCheck, IconHome, IconProfile, IconSolicitation, IconStatus } from '../../../../assets/icons';
import { useTenant } from '../../../../core/contexts/TenantContext';
import { InputDateRange } from '../../../UI/form/input-date-range';
import { SelectDefault } from '../../../UI/form/select-default';
import { ModalDefault } from '../../../UI/modal/modal-default'
import * as S from './styles'
import { ButtonDefault } from '../../../UI/form/button-default';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { LabelCheckbox } from '../../../UI/form/input-checkbox/styles';
import { InputCheckbox } from '../../../UI/form/input-checkbox';
import moment from 'moment';

interface IProps {
    opened: boolean;
    onClose(): void;
    DTOFilter: IFilterTicket;
    setDTOFilter(DTO: IFilterTicket): void;
    pageStorage: string;
}

export interface IFilterTicket {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    organization_id: number | undefined;
    ticket_cat_id: number | undefined;
    finish: string;
    ticket_status_id: number | undefined;
    user_id: number | undefined
    approval?: boolean
}

export const FILTER_DEFAULT: IFilterTicket = {
    toDate: undefined,
    fromDate: undefined,
    organization_id: undefined,
    ticket_cat_id: undefined,
    ticket_status_id: undefined,
    user_id: undefined,
    finish: '',
}

export const FILTER_APPROVAL_DEFAULT: IFilterTicket = {
    toDate: undefined,
    fromDate: undefined,
    organization_id: undefined,
    ticket_cat_id: undefined,
    ticket_status_id: undefined,
    user_id: undefined,
    finish: '',
}

export const NAME_STORAGE_FILTER_TICKET = '@21filter-ticket'
export const NAME_STORAGE_FILTER_TICKET_APPROVAL = '@21filter-ticket-approval'

export const ModalFilterTicket = ({ opened, onClose, DTOFilter, setDTOFilter, pageStorage }: IProps) => {

    const { user } = useAuth();

    const {
        getTicketCats,
        loadingTicketCats,
        ticketCats,
        getTicketStatus,
        loadingTicketStatus,
        ticketStatus,
        getUsers,
        loadingUsers,
        users,
        getOrganizations,
        loadingOrganization,
        organizations,
    } = useTenant();

    const [saveStorage, setSaveStorage] = useState(false)
    const [DTO, setDTO] = useState<IFilterTicket>({} as IFilterTicket);

    useEffect(() => {
        setDTO({ ...DTOFilter })
    }, [DTOFilter, opened])

    useEffect(() => {
        if (opened) {
            if (ticketCats.length === 0) getTicketCats();
            if (ticketStatus.length === 0) getTicketStatus();
            if (users.length === 0) getUsers();
            if (organizations.length === 0) getOrganizations();
        }
    }, [ticketCats, ticketStatus, users, organizations, opened])

    useEffect(() => {
        const STORAGE_FILTER = window.localStorage.getItem(pageStorage);
        if (STORAGE_FILTER) {
            setSaveStorage(true);
        }
    }, [])

    const handleConfirm = () => {

        if (saveStorage) {
            const JSON_FILTER = JSON.stringify(DTO);
            window.localStorage.setItem(pageStorage, JSON_FILTER);
        } else {
            window.localStorage.removeItem(pageStorage)
        }

        setDTOFilter(DTO);
        onClose();
    }

    const handleReset = () => {
        window.localStorage.removeItem(pageStorage);
        setSaveStorage(false)
        setDTOFilter({ ...FILTER_DEFAULT });
        onClose();
    }

    const LIST_STATUS = ticketStatus.map((row) => {
        return {
            name: row.name,
            value: String(row.ticket_status_id),
        }
    })
    const STATUS_SELECTED = LIST_STATUS.find((obj) => Number(obj.value) === DTO.ticket_status_id)

    const LIST_FORMS = ticketCats.map((row) => {
        return {
            name: row.title,
            value: String(row.ticket_cat_id),
        }
    })
    const FORM_SELECTED = LIST_FORMS.find((obj) => Number(obj.value) === DTO.ticket_cat_id);

    const LIST_FINISH = [
        {
            name: 'Ambos',
            value: '',
        },
        {
            name: 'Pendentes',
            value: 'false',
        },
        {
            name: 'Finalizados',
            value: 'true',
        },

    ]
    const FINISH_SELECTED = LIST_FINISH.find((obj) => obj.value === DTO.finish);

    const LIST_USERS = [
        {
            name: user?.name ?? '',
            value: String(user?.user_id) ?? '',
            avatar: user?.avatar ?? ''
        },
        ...users
            .filter((row) => row.user_id !== user?.user_id)
            .map((row) => ({
                name: row.name,
                value: String(row.user_id),
                avatar: row.avatar
            }))
    ];

    const SELECTED_USER = LIST_USERS.find((obj) => Number(obj.value) === Number(DTO.user_id));

    const LIST_ORGANIZATIONS = organizations.map((row) => {
        return {
            name: row.name,
            value: String(row.organization_id),
        }
    })
    const SELECTED_ORGANIZATION = LIST_ORGANIZATIONS.find((obj) => Number(obj.value) === Number(DTO.organization_id));

    return (
        <ModalDefault opened={opened} onClose={onClose} layout='right' title='Filtros' padding={'0px'} paddingHeader={'20px 40px'}>
            <S.Container>

                <div className='form'>

                    <InputDateRange
                        dates={{ to: DTO.toDate ? moment(DTO.toDate).toDate() : undefined, from: DTO.fromDate ? moment(DTO.fromDate).toDate() : undefined }}
                        label='Data de criação'
                        setDates={(dates) => setDTO((prev) => ({ ...prev, fromDate: dates?.from, toDate: dates?.to }))}

                    />

                    <SelectDefault
                        isValidEmpty='Nenhum Selecionado'
                        label='Formulário'
                        options={LIST_FORMS}
                        loading={loadingTicketCats}
                        onChange={(e) => setDTO((prev) => ({ ...prev, ticket_cat_id: Number(e.value) }))}
                        search={true}
                        icon={<IconSolicitation />}
                        value={{
                            name: FORM_SELECTED?.name ?? 'Nenhum selecionado',
                            value: FORM_SELECTED?.value ?? ''
                        }}
                    />

                    <SelectDefault
                        isValidEmpty='Nenhum Selecionado'
                        label='Status'
                        options={LIST_STATUS}
                        loading={loadingTicketStatus}
                        onChange={(e) => setDTO((prev) => ({ ...prev, ticket_status_id: Number(e.value) }))}
                        search={true}
                        icon={<IconStatus />}
                        value={{
                            name: STATUS_SELECTED?.name ?? 'Nenhum selecionado',
                            value: STATUS_SELECTED?.value ?? ''
                        }}
                    />

                    <SelectDefault
                        isValidEmpty='Nenhum Selecionado'
                        label='Solicitante'
                        options={LIST_USERS}
                        value={{
                            name: SELECTED_USER?.name ?? 'Nenhum selecionado',
                            value: SELECTED_USER?.value ?? '',
                            avatar: SELECTED_USER?.avatar,
                        }}
                        icon={<IconProfile />}
                        onChange={(e) => setDTO((prev) => ({ ...prev, user_id: Number(e.value) }))}
                        loading={loadingUsers}
                        search
                    />

                    <SelectDefault
                        isValidEmpty='Nenhum Selecionado'
                        label='Unidade'
                        options={organizations.map((item) => {
                            return {
                                name: item.name,
                                value: String(item.organization_id),
                            }
                        })}
                        value={{
                            name: SELECTED_ORGANIZATION?.name ?? 'Nenhum selecionado',
                            value: SELECTED_ORGANIZATION?.value ?? '',
                        }}
                        onChange={(e) => setDTO((prev) => ({ ...prev, organization_id: Number(e.value) }))}
                        loading={loadingOrganization}
                        icon={<IconHome />}
                        search
                    />

                    <SelectDefault
                        label='Entrega'
                        options={LIST_FINISH}
                        onChange={(e) => setDTO((prev) => ({ ...prev, finish: e.value }))}
                        search={true}
                        icon={<IconCheck />}
                        value={{
                            name: FINISH_SELECTED?.name ?? 'Ambos',
                            value: FINISH_SELECTED?.value ?? ''
                        }}
                    />

                    <LabelCheckbox>
                        <InputCheckbox
                            label='Salvar Filtros'
                            checked={saveStorage}
                            onChange={setSaveStorage}
                        />
                    </LabelCheckbox>

                </div>

                <div className='foot-buttons'>
                    <ButtonDefault variant='light' onClick={handleReset}>
                        Limpar Filtro
                    </ButtonDefault>
                    <ButtonDefault onClick={handleConfirm}>Confirmar</ButtonDefault>
                </div>
            </S.Container>
        </ModalDefault >
    )
}