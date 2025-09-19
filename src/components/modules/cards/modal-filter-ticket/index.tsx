import { useEffect, useState } from 'react';
import { IconHome, IconProfile, IconSolicitation, IconStatus } from '../../../../assets/icons';
import { useTenant } from '../../../../core/contexts/TenantContext';
import { InputDateRange } from '../../../UI/form/input-date-range';
import { SelectDefault } from '../../../UI/form/select-default';
import { ModalDefault } from '../../../UI/modal/modal-default'
import * as S from './styles'
import { ButtonDefault } from '../../../UI/form/button-default';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { LabelCheckbox } from '../../../UI/form/input-checkbox/styles';
import { InputCheckbox } from '../../../UI/form/input-checkbox';

interface IProps {
    opened: boolean;
    onClose(): void;
    DTOFilter: IFilterTicket;
    setDTOFilter(DTO: IFilterTicket): void;
}

export interface IFilterTicket {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    organization_id: number | undefined;
    ticket_cat_id: number | undefined;
    ticket_status_id: number | undefined;
    user_id: number | undefined
}

export const FILTER_DEFAULT: IFilterTicket = {
    toDate: undefined,
    fromDate: undefined,
    organization_id: undefined,
    ticket_cat_id: undefined,
    ticket_status_id: undefined,
    user_id: undefined,
}

export const NAME_STORAGE_FILTER_TICKET = '@21filter-ticket'

export const ModalFilterTicket = ({ opened, onClose, DTOFilter, setDTOFilter }: IProps) => {

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
        if (ticketCats.length === 0) getTicketCats();
        if (ticketStatus.length === 0) getTicketStatus();
        if (users.length === 0) getUsers();
        if (organizations.length === 0) getOrganizations();
    }, [ticketCats, ticketStatus, users, organizations])

    useEffect(() => {
        const STORAGE_FILTER = window.localStorage.getItem(NAME_STORAGE_FILTER_TICKET);
        if (STORAGE_FILTER) {
            setSaveStorage(true);
        }
    }, [])

    const handleConfirm = () => {

        if (saveStorage) {
            const JSON_FILTER = JSON.stringify(DTO);
            window.localStorage.setItem(NAME_STORAGE_FILTER_TICKET, JSON_FILTER);
        } else {
            window.localStorage.removeItem(NAME_STORAGE_FILTER_TICKET)
        }

        setDTOFilter(DTO);
        onClose();
    }

    const handleReset = () => {
        window.localStorage.removeItem(NAME_STORAGE_FILTER_TICKET);
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
                        dates={{ to: DTO.toDate, from: DTO.fromDate }}
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