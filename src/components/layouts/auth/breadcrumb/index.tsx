import { useEffect, useState, type ReactNode } from 'react'
import * as S from './styles'
import { useRedirect } from '../../../../core/hooks/useRedirect';

export interface IPropsBreadcrumb {
    icon?: ReactNode;
    name: string;
    redirect?: string;
    here?: boolean
}

export const BreadCrumbAuthLayout = ({ data }: {
    data: IPropsBreadcrumb[]
}) => {

    const { redirectSlug } = useRedirect();

    const [items, setItems] = useState<IPropsBreadcrumb[]>([])

    useEffect(() => {
        setItems([...data])
    }, [data])

    const handleRedirect = (redirect: string, key: number) => {
        const newItems: IPropsBreadcrumb[] = [];

        items.map((item, index) => {
            if (index <= key) newItems.push(item)
        })
        setItems([...newItems])
        redirectSlug(redirect ?? '');
    }

    return (
        <S.Container>
            <div className='overflow'>
                {items.map((item, key) =>
                    <li className={item.here ? 'active' : 'normal'} key={`${key}-${item.name}`}>
                        {key > 0 && <span className='division'>/</span>}
                        <a onClick={() => handleRedirect(item.redirect ?? '', key)}>
                            {item.icon &&
                                <i>
                                    {item.icon}
                                </i>
                            }
                            <span>{item.name}</span>
                        </a>
                    </li>
                )}
            </div>
        </S.Container>
    )
}