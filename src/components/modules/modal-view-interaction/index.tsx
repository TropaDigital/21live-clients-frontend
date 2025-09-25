import {
    TransformWrapper,
    TransformComponent,
    useControls
} from "react-zoom-pan-pinch";
import { ModalDefault } from '../../UI/modal/modal-default';
import * as S from './styles';
import { ButtonDefault } from "../../UI/form/button-default";
import { IconChevronDown, IconDislike, IconHamburger, IconLike, IconMinus, IconPlus } from "../../../assets/icons";
import { getFileTypeFromURL } from "../../../core/utils/files";
import type { ITicketInteraction } from "../../../core/types/ITckets";
import { CommentTicket } from "../chat/ticket/comment";
import { useAuth } from "../../../core/contexts/AuthContext";
import { AvatarUser } from "../../UI/avatar/avatar-user";
import { BadgeSimpleColor } from "../../UI/badge/badge-simple-color";
import { STATUS_TICKET_INTERACTION } from "../../../core/utils/status";
import { useEffect, useState } from "react";
import { TicketService } from "../../../core/services/TicketService";
import { useAlert } from "../../../core/contexts/AlertContext";
import EditorTextSlash from "../../UI/form/editor-text-slash";
import { useTenant } from "../../../core/contexts/TenantContext";

export const ModalViewInteraction = ({ item, interactions, opened, onSubmit, onClose }: {
    item: ITicketInteraction;
    interactions: ITicketInteraction[];
    opened: boolean;
    onClose(): void;
    onSubmit(item: ITicketInteraction, newItem: ITicketInteraction): void;
}) => {

    const extension = getFileTypeFromURL(item?.annex ?? '');

    const { tenant } = useTenant();
    const { user } = useAuth();
    const { addAlert } = useAlert();

    const [dataReply, setDataReply] = useState<ITicketInteraction[]>([])

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [DTOVote, setDTOVote] = useState<{ status: 'pass' | 'fail' | 'wait' | null, message: string; file: File | null }>({
        status: null,
        message: '',
        file: null,
    })

    const handleResetDTO = () => {
        setDTOVote({
            status: null,
            message: '',
            file: null,
        })
    }

    useEffect(() => {
        handleResetDTO();
    }, [item])

    useEffect(() => {
        setDataReply([...interactions])
    }, [interactions])

    const handleSubmit = async () => {
        try {

            setLoadingSubmit(true);
            const payload: any = {
                ticket_id: item.ticket_id,
                user_id: user?.user_id,
                message: DTOVote.message,
                status: DTOVote.status,
                annex: null,
                annex_title: null,
            };

            if (((!DTOVote.message) || (DTOVote.message === '<p></p>'))) {
                throw new Error('Mensagem é obrigatória')
            }

            payload.reply_id = item.ticket_interaction_id;
            payload.annex = DTOVote.file;
            payload.annex_title = DTOVote.file?.name;
            const response = await TicketService.setInteraction(payload);
            item.status = DTOVote.status;
            await TicketService.setInteraction({ ticket_id: item.ticket_id, ticket_interaction_id: item.ticket_interaction_id, status: item.status, user_id: item.user_id, message: item.message });
            onSubmit(item, response.item)
            handleResetDTO();

            setDataReply([response.item, ...dataReply])
            setLoadingSubmit(false)
        } catch (error: any) {
            setLoadingSubmit(false)
            addAlert('error', 'Ops', error.message);
        }

    }

    const [openedMobile, setOpenedMobile] = useState(false);

    return (
        <ModalDefault padding='0px' paddingHeader='30px 40px' layout='right' title={item.task_text ? 'Texto' : item.annex_title} opened={opened} onClose={onClose}>
            <S.Container color={tenant?.colorhigh}>

                <button onClick={() => setOpenedMobile(!openedMobile)} className="hamburger-mobile">
                    <IconHamburger />
                </button>

                {extension === 'image' &&
                    <div className="preview-render">
                        <TransformWrapper
                            initialScale={1}
                        >
                            <Controls />
                            <TransformComponent>
                                <img src={item.annex} alt={item.annex_title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                }
                {extension === 'other' && item?.annex &&
                    <div className="preview-render">
                        <img src={item.thumbnail} alt={item.annex_title} style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    </div>
                }

                {!item?.annex && item.message &&
                    <div className="preview-render">
                        <div className="text-render">
                            <EditorTextSlash
                                value={item.task_text?.annex_text ?? ''}
                            />
                        </div>
                    </div>
                }

                {extension === 'video' &&
                    <div className="preview-render">
                        <video controls src={item.annex}>
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                }

                {extension === 'pdf' &&
                    <div className="preview-render">
                        <iframe src={item.annex} />
                    </div>
                }

                <div className={`right-interactions ${openedMobile ? 'opened' : ''}`}>

                    <div className="head-infos">
                        {item.annex_title &&
                            <div className='label'>
                                <b>Arquivo:</b>
                                <span>{item.annex_title}</span>
                            </div>
                        }
                        <div className='label'>
                            <b>Usuário:</b>
                            <AvatarUser
                                name={item.user_name}
                                image={item.user_avatar}
                                size={25}
                            />
                            <span>{item.user_name}</span>
                        </div>
                        {item.annex && item.message && item.message !== '<p></p>' &&
                            <div className='label'>
                                <b>Texto:</b>
                                <div dangerouslySetInnerHTML={{ __html: item.message }} />
                            </div>
                        }

                        {item.status &&
                            <div className='label'>
                                <b>Status:</b>
                                <BadgeSimpleColor
                                    name={STATUS_TICKET_INTERACTION[item.status].name}
                                    bg={STATUS_TICKET_INTERACTION[item.status].colorBadge}
                                    color={STATUS_TICKET_INTERACTION[item.status].colorText}
                                />
                            </div>
                        }
                    </div>

                    <RenderToggle title="Aprovação">
                        <div className="vote">
                            <div className="type-vote">
                                <button
                                    onClick={() => setDTOVote((prev) => ({ ...prev, status: 'pass' }))}
                                    className={`${DTOVote.status === 'pass' ? 'pass' : 'normal'}`}
                                >
                                    <IconLike />
                                    <span>Aprovar</span>
                                </button>
                                <button
                                    onClick={() => setDTOVote((prev) => ({ ...prev, status: 'fail' }))}
                                    className={`${DTOVote.status === 'fail' ? 'fail' : 'normal'}`}
                                >
                                    <IconDislike />
                                    <span>Reprovar</span>
                                </button>
                            </div>
                            {DTOVote.status &&
                                <EditorTextSlash
                                    layout="static"
                                    enableCommands={false}
                                    value={DTOVote.message ?? ''}
                                    onChange={(value) => !loadingSubmit && setDTOVote((prev) => ({ ...prev, message: value }))}
                                />
                            }
                            {DTOVote.status &&
                                <ButtonDefault loading={loadingSubmit} onClick={handleSubmit}>Confirmar</ButtonDefault>
                            }
                        </div>
                    </RenderToggle>

                    {dataReply.length > 0 &&
                        <RenderToggle title="Todas avaliações" flex="1">
                            <div className="all-interactions">
                                <div className="list-messages">
                                    {dataReply.map((item) =>
                                        <CommentTicket
                                            key={`interaction-${item.ticket_interaction_id}`}
                                            name={item.user_name}
                                            avatar={item.user_avatar}
                                            message={item.message}
                                            thumbnail={item.thumbnail}
                                            created={item.created}
                                            status={item.status ?? null}
                                            position={user?.user_id === item.user_id ? 'right' : 'left'}
                                        />
                                    )}
                                </div>
                            </div>
                        </RenderToggle>
                    }

                </div>
            </S.Container>
        </ModalDefault>
    );
};

const RenderToggle = ({ children, title, flex }: { children: React.ReactNode, title: string, flex?: string; }) => {

    const [opened, setOpened] = useState(true);

    return (
        <S.ContainerToggle style={{ flex }}>
            <div onClick={() => setOpened(!opened)} className="head-toggle">
                <span>{title}</span>
                <i className={opened ? 'opened' : 'closed'}>
                    <IconChevronDown />
                </i>
            </div>
            {opened &&
                <div className="render-toggle">
                    {children}
                </div>
            }
        </S.ContainerToggle>
    )
}

const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="tools">
            <ButtonDefault variant="dark" icon={<IconPlus />} onClick={() => zoomIn()}>
                ZoomIn
            </ButtonDefault>
            <ButtonDefault variant="dark" icon={<IconMinus />} onClick={() => zoomOut()}>
                ZoomOut
            </ButtonDefault>
            <ButtonDefault variant="dark" onClick={() => resetTransform()}>
                Resetar
            </ButtonDefault>
        </div>
    );
};