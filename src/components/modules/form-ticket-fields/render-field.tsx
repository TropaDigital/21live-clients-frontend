
import * as S from './styles';
import type { ITicketField } from "../../../core/types/ITckets";
import EditorTextSlash from '../../UI/form/editor-text-slash';

import { ContainerEditorStatic, ContainerEditorStaticLabel } from '../../UI/form/editor-text-slash/styles';
import { IconClone, IconMovePoints, IconPencil, IconTrash } from '../../../assets/icons';
import { InputDefault } from '../../UI/form/input-default';
import { SelectDefault } from '../../UI/form/select-default';
import { InputCheckbox } from '../../UI/form/input-checkbox';
import { useEffect, useState } from 'react';
import { TicketService } from '../../../core/services/TicketService';
import { useAlert } from '../../../core/contexts/AlertContext';
import { ButtonDefault } from '../../UI/form/button-default';
import { SelectMultiple } from '../../UI/form/select-multiple';

interface IProps {
    admin: boolean;
    field: ITicketField;
    value: any;
    loadingDuplicate?: boolean;
    onChange?: (e: any) => void;
    onClickAction?(type: 'duplicate' | 'edit' | 'delete', field: ITicketField): void;
}

export const RenderField = ({ admin, field, value, loadingDuplicate, onChange, onClickAction }: IProps) => {

    const [data, setData] = useState<ITicketField>(field);
    const { addAlert } = useAlert();

    useEffect(() => {
        setData(field);
    }, [field]);

    const handleSubmit = async (required?: boolean) => {
        if (required !== undefined) data.required = required;
        await TicketService.setField({ id: field.ticketcat_field_id, ...data });
        addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
    }

    const handleChangeRequired = (bol: boolean) => {
        setData((prev) => ({ ...prev, required: bol }));
        handleSubmit(bol);
    }

    const VALUES_SELECTED = data.type === 'selmultiple' && !value ? [] : value;

    return (
        <S.ContainerField admin={admin}>

            {admin &&
                <div className='sortable'>
                    <IconMovePoints />
                </div>
            }

            <div className='input-render'>
                {data.type === 'input' &&
                    <InputDefault
                        label={data.label}
                        description={data.description}
                        value={value ?? ''}
                        onChange={(e) => onChange && onChange(e.target.value)}
                    />
                }

                {data.type === 'textarea' &&
                    <ContainerEditorStaticLabel>
                        {data.label && <p className='label'>{data.label}</p>}
                        {data.description && <p className='description'>{data.description}</p>}
                        {!admin ?
                            <EditorTextSlash
                                layout='static'
                                value={value}
                                onChange={(e) => onChange && onChange(e)}
                            />
                            :
                            <ContainerEditorStatic disabled={admin} style={{ minHeight: 50 }}></ContainerEditorStatic>
                        }
                    </ContainerEditorStaticLabel>
                }

                {data.type === 'select' &&
                    <SelectDefault
                        label={data.label}
                        description={data.description}
                        options={data.options ? data.options.map((opt) => ({ name: opt, value: opt })) : []}
                        onChange={(e) => onChange && onChange(e)}
                        value={{
                            name: value.name ?? 'Selecionar',
                            value: value.value ?? '',
                        }}
                    />
                }


                {data.type === 'selmultiple' &&
                    <SelectMultiple
                        label={data.label}
                        description={data.description}
                        options={data.options ? data.options.map((opt) => ({ name: opt, value: opt })) : []}
                        onChange={(e) => onChange && onChange(e)}
                        selecteds={VALUES_SELECTED}
                    />
                }
            </div>

            {admin && (
                <div className='actions'>
                    <InputCheckbox label='Obrigatório' checked={data.required} onChange={(bol) => handleChangeRequired(bol)} />
                    <div className='buttons'>
                        <ButtonDefault data-tooltip-place="top" data-tooltip-id="tooltip" data-tooltip-content={'Duplicar campo'} loading={loadingDuplicate} onClick={() => onClickAction && onClickAction('duplicate', data)} icon={<IconClone />} variant='light' type='button' className='edit' />
                        <ButtonDefault data-tooltip-place="top" data-tooltip-id="tooltip" data-tooltip-content={'Editar campo'} onClick={() => onClickAction && onClickAction('edit', data)} icon={<IconPencil />} type='button' className='edit' />
                        <ButtonDefault data-tooltip-place="top" data-tooltip-id="tooltip" data-tooltip-content={'Remover campo'} onClick={() => onClickAction && onClickAction('delete', data)} icon={<IconTrash />} variant="danger" type='button' className='edit' />
                    </div>
                </div>
            )}

        </S.ContainerField>
    )

}