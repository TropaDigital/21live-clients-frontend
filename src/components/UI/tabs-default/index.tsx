import { useTenant } from '../../../core/contexts/TenantContext';
import { Skeleton } from '../loading/skeleton/styles';
import * as S from './styles'

interface IProps {
    onSelected(value: string): void;
    selected: string;
    tabs: string[];
    style?: React.StyleHTMLAttributes<Element>
    className?: string;
    loading?: boolean;
}

export const TabsDefault = ({ loading, className = "", style, onSelected, selected, tabs }: IProps) => {

    const { tenant } = useTenant();

    return (
        <S.Container
            color={tenant?.colorhigh}
            colorBg={tenant?.colormain}
            colorText={tenant?.colorsecond}
            style={style}
            className={className}
        >
            {loading && [0, 1].map(() => <button><Skeleton width='50px' height='15px' /></button>)}
            {!loading && tabs.map((item) =>
                <button onClick={() => onSelected(item)} className={`${selected === item ? 'active' : 'normal'}`}>
                    {item}
                </button>
            )}
        </S.Container>
    )
}