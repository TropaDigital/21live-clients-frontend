import { useTenant } from '../../../core/contexts/TenantContext';
import * as S from './styles'

interface IProps {
    onSelected(value: string): void;
    selected: string;
    tabs: string[];
    style?: React.StyleHTMLAttributes<Element>
    className?: string;
}

export const TabsDefault = ({ className = "", style, onSelected, selected, tabs }: IProps) => {

    const { tenant } = useTenant();

    return (
        <S.Container
            color={tenant?.colorhigh}
            colorBg={tenant?.colormain}
            colorText={tenant?.colorsecond}
            style={style}
            className={className}
        >
            {tabs.map((item) =>
                <button onClick={() => onSelected(item)} className={`${selected === item ? 'active' : 'normal'}`}>
                    {item}
                </button>
            )}
        </S.Container>
    )
}