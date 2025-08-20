import { useParams } from "react-router-dom"

import * as S from './styles'

import { FormTicketFields } from "../../../components/modules/form-ticket-fields"

export const PreviewFormFields = () => {

    const { id } = useParams();

    return (
        <S.ContainerPreview>
            <div className="zoom">
                <FormTicketFields
                    id={Number(id)}
                    admin={false}
                />
            </div>
        </S.ContainerPreview>
    )
}