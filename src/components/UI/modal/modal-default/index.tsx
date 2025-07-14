import { useRef, type ReactNode } from 'react';
import { IconClose } from '../../../../assets/icons'
import * as S from './styles'

interface IProps {
    opened: boolean;
    padding?: string;
    paddingHeader?: string;
    onClose?(): void;
    title?: string;
    children: ReactNode;
    zIndex?: number;
    layout: 'left' | 'center' | 'bottom' | 'top' | 'right'
}

export const ModalDefault = ({ zIndex = 10, padding = "10px 40px 40px 40px", paddingHeader = "40px 40px 0px 40px", layout = 'center', title, onClose, children, opened }: IProps) => {

    const refBox = useRef<any>(null)

    const handleOnClose = () => {
        if (opened && onClose) {
            onClose();
        }
    }

    return (
        <S.Container zIndex={zIndex} paddingHeader={paddingHeader} padding={padding} layout={layout} opened={opened}>

            <button className='outside' onClick={handleOnClose} />
            
            {opened &&
                <div ref={refBox} className='box'>

                    <div className='head-box'>
                        {title &&
                            <p className='title'>
                                {title}
                            </p>
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