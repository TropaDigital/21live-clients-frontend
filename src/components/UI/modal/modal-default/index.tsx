import { useRef, type ReactNode } from 'react';
import { IconClose } from '../../../../assets/icons'
import * as S from './styles'

interface IProps {
    opened: boolean;
    padding?: string;
    paddingHeader?: string;
    onClose?(): void;
    title?: string;
    subTitle?: string;
    children: ReactNode;
    zIndex?: number;
    layout: 'left' | 'center' | 'bottom' | 'top' | 'right'
}

export const ModalDefault = ({
    zIndex = 10,
    padding = "10px 40px 40px 40px",
    paddingHeader = "40px 40px 0px 40px",
    layout = 'center',
    title,
    subTitle,
    onClose,
    children,
    opened
}: IProps) => {

    const refBox = useRef<any>(null)

    const handleOnClose = () => {
        if (opened && onClose) {
            onClose();
        }
    }

    return (
        <S.Container zIndex={zIndex} paddingHeader={paddingHeader} padding={padding} layout={layout} opened={opened}>

            <button type='button' className='outside' onClick={handleOnClose} />

            {opened &&
                <div ref={refBox} className='box'>

                    <div className='head-box'>
                        {title &&
                            <div className='head-title'>
                                <p className='title'>
                                    {title}
                                </p>
                                {subTitle &&
                                    <p className='sub'>
                                        {subTitle}
                                    </p>
                                }
                            </div>
                        }

                        {onClose &&
                            <button onClick={onClose} className='close'>
                                <IconClose />
                            </button>
                        }
                    </div>

                    <div className='children-box'>
                        {children}
                    </div>

                </div>
            }
        </S.Container>
    )
}