import type { ReactNode } from 'react'
import * as S from './styles'
import { LinkSlug } from '../../../../core/utils/link-slug';

export interface IPropsBreadcrumb {
    icon?: ReactNode;
    name: string;
    redirect?: string;
    here?: boolean
}

export const BreadCrumbAuthLayout = ({ data }: {
    data: IPropsBreadcrumb[]
}) => {

    const RenderLinkExist = ({ redirect, children }: { redirect?: string; children: ReactNode }) => {
        return redirect ? <LinkSlug path={redirect}>{children}</LinkSlug> : <a>{children}</a>
    }

    return (
        <S.Container>
            <div className='overflow'>
                {data.map((item, key) =>
                    <li className={item.here ? 'active' : 'normal'} key={`${key}-${item.name}`}>
                        {key > 0 && <span className='division'>/</span>}
                        <RenderLinkExist redirect={item.redirect}>
                            {item.icon &&
                                <i>
                                    {item.icon}
                                </i>
                            }
                            <span>{item.name}</span>
                        </RenderLinkExist>
                    </li>
                )}
            </div>
        </S.Container>
    )
}