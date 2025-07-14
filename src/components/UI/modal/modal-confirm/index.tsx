import { IconTrash, IconWarning } from '../../../../assets/icons';
import { ButtonDefault } from '../../form/button-default';
import { ModalDefault } from '../modal-default';
import * as S from './styles'

interface IProps {
    title?: string;
    description?: string;
    opened: boolean;
    type: IPropsTypeModalConfirm;
    loading?: boolean;
    onConfirm(): void;
    onCancel(): void;
}

export type IPropsTypeModalConfirm = 'danger' | 'info'

export const ModalConfirm = ({ title, description, type, opened, loading, onConfirm, onCancel }: IProps) => {
    return (
        <ModalDefault layout='center' opened={opened} onClose={!loading ? onCancel : () => { }}>
            <S.Container type={type}>
                <i className='icon'>
                    {type === 'danger' &&
                        <IconTrash />
                    }
                    {type === 'info' &&
                        <IconWarning />
                    }
                </i>
                <div className='texts'>
                    <p className='title-confirm'>{title}</p>
                    <p className='description-confirm'>
                        {description}
                    </p>
                </div>
                <div className='foot-buttons'>
                    <ButtonDefault disabled={loading} flex={true} variant='lightWhite' onClick={onCancel}>Cancelar</ButtonDefault>
                    <ButtonDefault loading={loading} flex={true} onClick={onConfirm}>Confirmar</ButtonDefault>
                </div>
            </S.Container>
        </ModalDefault>
    )
}