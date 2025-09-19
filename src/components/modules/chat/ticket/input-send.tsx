import { useState } from 'react'
import EditorTextSlash from '../../../UI/form/editor-text-slash'
import * as S from './styles'
import { IconClose, IconLoading, IconReply, IconSend, IconUpload } from '../../../../assets/icons'
import { useTenant } from '../../../../core/contexts/TenantContext'
import type { ITicketInteraction } from '../../../../core/types/ITckets'
import { TicketService } from '../../../../core/services/TicketService'
import { useAuth } from '../../../../core/contexts/AuthContext'
import { ModalDefault } from '../../../UI/modal/modal-default'
import { FILE_ACCEPTED_EXTENSIONS, InputUpload, type IFileInputUpload, type UploadResult } from '../../../UI/form/input-upload'
import { ButtonDefault } from '../../../UI/form/button-default'
import { useAlert } from '../../../../core/contexts/AlertContext'
import { Skeleton } from '../../../UI/loading/skeleton/styles'

export const InputSendTicket = ({ id, reply, onExcluireply, onSubmit }: {
    id: number;
    reply: ITicketInteraction | null;
    onExcluireply(): void;
    onSubmit(item: ITicketInteraction): void;
}) => {

    const [file, setFile] = useState<UploadResult | null>(null)

    const [DTOFile, setDTOFile] = useState<{ name: string, file: File | null }>({
        name: '',
        file: null
    })


    const [modalFile, setModalFile] = useState(false)

    const { user } = useAuth();
    const { tenant } = useTenant()
    const [value, setValue] = useState<string>("")

    const [loading, setLoading] = useState(false);

    const { addAlert } = useAlert();

    const handleSubmit = async (files?: IFileInputUpload[]) => {
        try {

            setLoading(true);

            if (files && files?.length > 0) {
                for (const file of files) {
                    const payload: any = {
                        ticket_id: id,
                        user_id: user?.user_id,
                        message: value,
                        status: null,
                        annex: null,
                        annex_title: null,
                    };

                    if (!file && ((!value) || (value === '<p></p>'))) {
                        throw new Error('Mensagem é obrigatória')
                    }

                    payload.reply_id = reply?.ticket_interaction_id ?? null;
                    payload.annex = file.file;
                    payload.annex_title = file.file.name;

                    const response = await TicketService.setInteraction(payload)

                    handleCloseUpload()
                    setFile(null)
                    setValue("");
                    onSubmit(response.item);
                    onExcluireply();
                }
            } else {
                const payload: any = {
                    ticket_id: id,
                    user_id: user?.user_id,
                    message: value,
                    status: null,
                    annex: null,
                    annex_title: null,
                };

                if (!file && ((!value) || (value === '<p></p>'))) {
                    throw new Error('Mensagem é obrigatória')
                }

                payload.reply_id = reply?.ticket_interaction_id ?? null;

                const response = await TicketService.setInteraction(payload)

                handleCloseUpload()
                setFile(null)
                setValue("");
                onSubmit(response.item);
                onExcluireply();
            }

            setLoading(false);

        } catch (error: any) {
            setLoading(false)
            addAlert('error', 'Ops', error.message);
        }

    }

    const handleConfirmUpload = () => {
        try {
            handleSubmit(file?.files);
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
                        <button onClick={onExcluireply}>
                            <IconClose />
                        </button>
                    </div>
                }
                <div className='message-principal'>
                    {!loading ?
                        <EditorTextSlash value={value ?? ''} onChange={(value) => !loading && setValue(value)} />
                        :
                        <div style={{ flex: 1 }}>
                            <Skeleton borderRadius='14px 0px 0px 14px' height={'58px'} />
                        </div>
                    }
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
                        multiple={true}
                        label="Arquivos"
                        typeFile="file"
                        maxSizeMB={1536}
                        accept={FILE_ACCEPTED_EXTENSIONS}
                        value={file}
                        onChange={(e) => setFile(e)}
                    />

                    <div className='foot'>
                        <ButtonDefault variant='light' onClick={handleCloseUpload}>Descartar</ButtonDefault>
                        <ButtonDefault disabled={file?.files[0].file ? false : true} onClick={handleConfirmUpload}>Confirmar</ButtonDefault>
                    </div>

                </S.ContainerModalUpload>
            </ModalDefault>
        </>
    )
}