import { useState } from 'react'
import EditorTextSlash from '../../../UI/form/editor-text-slash'
import * as S from './styles'
import { IconFile } from '../../../../assets/icons'
import type { ITicketInteraction } from '../../../../core/types/ITckets'
import { TicketService } from '../../../../core/services/TicketService'
import { useAuth } from '../../../../core/contexts/AuthContext'
import { ModalDefault } from '../../../UI/modal/modal-default'
import { FILE_ACCEPTED_EXTENSIONS, InputUpload, type IFileInputUpload, type UploadResult } from '../../../UI/form/input-upload'
import { ButtonDefault } from '../../../UI/form/button-default'
import { useAlert } from '../../../../core/contexts/AlertContext'

export const InputSendTicketApprove = ({ id, onSubmit }: {
    id: number;
    onSubmit(item: ITicketInteraction, approve: boolean): void;
}) => {

    const [file, setFile] = useState<UploadResult | null>(null)

    const [opened, setOpened] = useState(false);

    const { user } = useAuth();
    const [value, setValue] = useState<string>("")

    const [loading, setLoading] = useState(false);

    const { addAlert } = useAlert();

    const handleSubmit = async (files: IFileInputUpload[]) => {
        try {
            setLoading(true);

            for (const file of files) {
                const payload: any = {
                    ticket_id: id,
                    user_id: user?.user_id,
                    message: value,
                    status: "wait",
                    annex: file.file,
                    annex_title: file.file?.name,
                };

                const response = await TicketService.setInteraction(payload);

                handleCloseUpload();
                setFile(null);
                setValue("");
                onSubmit(response.item, true);
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            addAlert("error", "Ops", error.message);
        }
    };

    const handleConfirmUpload = () => {
        try {
            if (!file) return;

            handleSubmit(file.files);
        } catch (error: any) {
            addAlert('error', 'Ops', error.message);
        }
    }

    const handleCloseUpload = () => {
        setOpened(false)
        setFile(null)
    }

    return (
        <S.ContainerInputSendApprove>
            <ButtonDefault icon={<IconFile />} onClick={() => setOpened(true)}>Adicionar Arquivo para Aprovação</ButtonDefault>
            <ModalDefault layout='center' title='Anexar Arquivo' opened={opened} onClose={handleCloseUpload}>
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

                    <EditorTextSlash layout='static' value={value ?? ''} onChange={(value) => !loading && setValue(value)} />

                    <div className='foot'>
                        <ButtonDefault variant='light' onClick={handleCloseUpload}>Descartar</ButtonDefault>
                        <ButtonDefault disabled={file?.files[0].file ? false : true} loading={loading} onClick={handleConfirmUpload}>Confirmar</ButtonDefault>
                    </div>

                </S.ContainerModalUpload>
            </ModalDefault>
        </S.ContainerInputSendApprove>
    )
}