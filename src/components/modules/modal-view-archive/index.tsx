import {
    TransformWrapper,
    TransformComponent,
    useControls
} from "react-zoom-pan-pinch";
import type { IFolderFileItem } from '../../../core/types/iFolder';
import { ModalDefault } from '../../UI/modal/modal-default';
import * as S from './styles';
import { ButtonDefault } from "../../UI/form/button-default";
import { IconDownload, IconFolder, IconMinus, IconPlus } from "../../../assets/icons";
import { getFileTypeFromURL } from "../../../core/utils/files";
import { useRedirect } from "../../../core/hooks/useRedirect";
import { folder } from "jszip";

export const ModalViewArchive = ({ item, folder_id, opened, onClose }: {
    item: IFolderFileItem,
    folder_id?: number | null;
    opened: boolean;
    onClose(): void;
}) => {

    const extension = getFileTypeFromURL(item?.url_path ?? '');

    const { redirectSlug } = useRedirect()

    return (
        <ModalDefault padding='0px' paddingHeader='30px 40px' layout='center' title={`${item.name}`} opened={opened} onClose={onClose}>
            <S.Container>

                {extension === 'image' &&
                    <div className="preview-render">
                        <TransformWrapper
                            initialScale={1}
                        >
                            <TransformComponent>
                                <img src={item.url_path} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            </TransformComponent>
                            <Controls folder_id={folder_id} url={item.url_path} />
                        </TransformWrapper>
                    </div>
                }
                {extension === 'other' &&
                    <div className="preview-render">
                        <img src={item.thumbnail} alt={item.name} style={{ maxWidth: '100%', maxHeight: '400px' }} />
                        <div className="tools">
                            {folder_id &&
                                <ButtonDefault variant="dark" onClick={() => redirectSlug(`folders/${folder_id}`)} icon={<IconFolder />}>
                                    Ir para pasta
                                </ButtonDefault>
                            }
                            <ButtonDownload url={item.url_path} />
                        </div>
                    </div>
                }
                {extension === 'video' &&
                    <div className="preview-render">
                        <video controls src={item.url_path}>
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                        <div className="tools">
                            {folder_id &&
                                <ButtonDefault variant="dark" onClick={() => redirectSlug(`folders/${folder_id}`)} icon={<IconFolder />}>
                                    Ir para pasta
                                </ButtonDefault>
                            }
                            <ButtonDownload url={item.url_path} />
                        </div>
                    </div>
                }

                {extension === 'pdf' &&
                    <div className="preview-render">
                        <iframe src={item.url_inline} />
                        <div className="tools">
                            {folder_id &&
                                <ButtonDefault variant="dark" onClick={() => redirectSlug(`folders/${folder_id}`)} icon={<IconFolder />}>
                                    Ir para pasta
                                </ButtonDefault>
                            }
                            <ButtonDownload url={item.url_path} />
                        </div>
                    </div>
                }
            </S.Container>
        </ModalDefault>
    );
};

const Controls = ({ url, folder_id }: { url: string, folder_id?: number | null }) => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    const { redirectSlug } = useRedirect();

    return (
        <div className="tools">
            {folder_id &&
                <ButtonDefault variant="dark" onClick={() => redirectSlug(`folders/${folder_id}`)} icon={<IconFolder />}>
                    Ir para pasta
                </ButtonDefault>
            }
            <ButtonDefault variant="lightWhite" icon={<IconPlus />} onClick={() => zoomIn()}>
                ZoomIn
            </ButtonDefault>
            <ButtonDefault variant="lightWhite" icon={<IconMinus />} onClick={() => zoomOut()}>
                ZoomOut
            </ButtonDefault>
            <ButtonDefault variant="lightWhite" onClick={() => resetTransform()}>
                Resetar
            </ButtonDefault>
            <ButtonDownload url={url} />
        </div>
    );
};

const ButtonDownload = ({ url }: { url: string }) => {
    return (
        <ButtonDefault onClick={() => window.open(url, "_blank")} icon={<IconDownload />}>
            Download
        </ButtonDefault>
    )
}
