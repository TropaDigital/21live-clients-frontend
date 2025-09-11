import { useEffect, useState } from 'react'
import EditorTextSlash from '../../../UI/form/editor-text-slash'
import * as S from './styles'
import { IconClose, IconLoading, IconReply, IconSend, IconUpload } from '../../../../assets/icons'
import { useTenant } from '../../../../core/contexts/TenantContext'
import type { ITicketInteraction } from '../../../../core/types/ITckets'
import { TicketService } from '../../../../core/services/TicketService'
import { useAuth } from '../../../../core/contexts/AuthContext'
import { ModalDefault } from '../../../UI/modal/modal-default'
import { FILE_ACCEPTED_EXTENSIONS, InputUpload, type UploadResult } from '../../../UI/form/input-upload'
import { ButtonDefault } from '../../../UI/form/button-default'
import { useAlert } from '../../../../core/contexts/AlertContext'
import { InputCheckbox } from '../../../UI/form/input-checkbox'

export const InputSendTicket = ({ id, reply, approve, onRemoveReply, onSubmit }: {
    id: number;
    approve: boolean,
    reply: ITicketInteraction | null;
    onRemoveReply(): void;
    onSubmit(item: ITicketInteraction, approve: boolean): void;
}) => {

    const [file, setFile] = useState<UploadResult | null>(null)

    const [DTOFile, setDTOFile] = useState<{ name: string, file: File | null }>({
        name: '',
        file: null
    })

    const [checkApprove, setCheckApprove] = useState(approve)

    useEffect(() => {
        setCheckApprove(approve)
    }, [approve])

    const [modalFile, setModalFile] = useState(false)

    const { user } = useAuth();
    const { tenant } = useTenant()
    const [value, setValue] = useState<string>("")

    const [loading, setLoading] = useState(false);

    const { addAlert } = useAlert();

    const handleSubmit = async (file?: File | null) => {
        try {

            if (checkApprove && !file) {
                setModalFile(true);
                return false;
            }

            setLoading(true);
            const payload: any = {
                ticket_id: id,
                user_id: user?.user_id,
                message: value,
                status: null,
                annex: null,
                annex_title: null,
            };

            if (!file && ((!checkApprove && !value) || (!checkApprove && value === '<p></p>'))) {
                throw new Error('Mensagem é obrigatória')
            }

            payload.status = checkApprove ? 'wait' : undefined;
            payload.reply_id = reply?.ticket_interaction_id ?? null;
            payload.annex = file;
            payload.annex_title = file?.name;

            const response = await TicketService.setInteraction(payload)

            handleCloseUpload()
            setFile(null)
            setValue("");
            onSubmit(response.item, checkApprove);
            onRemoveReply();
            setLoading(false);
            ;
        } catch (error: any) {
            setLoading(false)
            addAlert('error', 'Ops', error.message);
        }

    }

    const handleConfirmUpload = () => {
        try {
            handleSubmit(file?.files[0].file ?? null);
            setModalFile(false);
        } catch (error: any) {
            addAlert('error', 'Ops', error.message);
        }
    }

    const handleCloseUpload = () => {
        setDTOFile({ name: '', file: null });
        setModalFile(false);
        setFile(null)
    }

    return (
        <>
            <S.ContainerInputSend>

                {reply && !reply.status &&
                    <div className='reply-content'>
                        <i>
                            <IconReply />
                        </i>
                        <div className='render' dangerouslySetInnerHTML={{ __html: reply.message }} />
                        <button onClick={onRemoveReply}>
                            <IconClose />
                        </button>
                    </div>
                }
                <div className='message-principal'>
                    <EditorTextSlash value={value ?? ''} onChange={(value) => !loading && setValue(value)} />
                    <div className='btn-action'>
                        <button onClick={() => setModalFile(true)}>
                            {DTOFile.file && <i>1</i>}
                            <IconUpload />
                        </button>
                        <button onClick={() => handleSubmit()} disabled={loading} style={{ backgroundColor: tenant?.colorhigh, color: 'white' }}>
                            {loading ? <IconLoading /> : <IconSend />}
                        </button>
                    </div>
                </div>
            </S.ContainerInputSend>

            <ModalDefault layout='center' title='Anexar Arquivo' opened={modalFile} onClose={() => setModalFile(false)}>
                <S.ContainerModalUpload>
                    <InputUpload
                        multiple={false}
                        label="Arquivos"
                        typeFile="file"
                        maxSizeMB={1536}
                        accept={FILE_ACCEPTED_EXTENSIONS}
                        value={file}
                        onChange={(e) => setFile(e)}
                    />

                    <div className='label-checkbox'>
                        <InputCheckbox
                            label='Pedir aprovação'
                            checked={checkApprove}
                            onChange={() => setCheckApprove(!checkApprove)}
                        />
                        <p>Permitir aprovação de arquivo</p>
                    </div>

                    <div className='foot'>
                        <ButtonDefault variant='light' onClick={handleCloseUpload}>Descartar</ButtonDefault>
                        <ButtonDefault disabled={file?.files[0].file ? false : true} onClick={handleConfirmUpload}>Confirmar</ButtonDefault>
                    </div>

                </S.ContainerModalUpload>
            </ModalDefault>
        </>
    )
}