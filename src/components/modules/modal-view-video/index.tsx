import { useState } from 'react';
import type { IFolderVideo } from '../../../core/types/iFolder';
import { ModalConfirm } from '../../UI/modal/modal-confirm';
import { ModalDefault } from '../../UI/modal/modal-default';
import * as S from './styles';

export const ModalViewVideo = ({ item, opened, onClose }: {
    item: IFolderVideo,
    opened: boolean;
    onClose(): void;
}) => {

    const [modalConfirm, setModalConfirm] = useState(false);

    return (
        <>
            <ModalDefault
                padding='0px'
                paddingHeader='30px 40px'
                layout='center'
                title={`${item.name}`}
                opened={opened}
                onClose={() => setModalConfirm(true)}
            >
                <S.Container>
                    <iframe src={item.url_path?.replace(`https//`, `https://`)} />
                </S.Container>
            </ModalDefault>
            <ModalConfirm
                type='info'
                title='Atenção'
                description='Você deseja mesmo sair do vídeo?'
                onConfirm={() => {
                    onClose();
                    setModalConfirm(false)
                }}
                onCancel={() => setModalConfirm(false)}
                opened={modalConfirm}
            />
        </>
    );
};