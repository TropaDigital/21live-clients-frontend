import { useEffect, useState } from 'react';
import { useTenant } from '../../../core/contexts/TenantContext'
import type { ITenant } from '../../../core/types/iTenants';
import { AvatarTenant } from '../../UI/avatar/avatar-tenant';
import { ModalDefault } from '../../UI/modal/modal-default'
import * as S from './styles'
import { TenantService } from '../../../core/services/TenantService';
import { Skeleton } from '../../UI/loading/skeleton/styles';
import { useAlert } from '../../../core/contexts/AlertContext';

export const ModalTreeTenant = ({ opened, onClose }: { opened: boolean, onClose(): void }) => {

    const { tenant } = useTenant();
    const [tenants, setTenants] = useState<ITenant[]>([])
    const [loadingTenants, setLoadingTenants] = useState(true);
    const { addAlert } = useAlert();

    function buildTenantTree(items: ITenant[]): ITenant[] {
        const byId = new Map<number, ITenant>();
        const roots: ITenant[] = [];

        // 1) Clona raso e inicializa children para evitar compartilhar referência
        for (const it of items) {
            byId.set(it.tenant_id, { ...it, children: [] });
        }

        // 2) Liga cada nó ao seu pai (se houver); se não houver, vira root
        for (const node of byId.values()) {
            const pid = node.parent_id;
            if (pid != null && byId.has(pid)) {
                byId.get(pid)!.children!.push(node);
            } else {
                roots.push(node);
            }
        }

        // (Opcional) Excluir arrays vazios de children
        const prune = (n: ITenant) => {
            if (n.children && n.children.length === 0) delete (n as any).children;
            n.children?.forEach(prune);
        };
        roots.forEach(prune);

        return roots;
    }

    const getTenants = async (id: number) => {
        try {
            setLoadingTenants(true);

            const response = await TenantService.getById(id);
            const allChildren: ITenant[] = response.item.children ?? [];
            const tree = buildTenantTree(allChildren);
            setTenants([...tree]);
        } catch (e) {
            console.error(e);
            // trate erro se precisar
        } finally {
            setLoadingTenants(false);
        }
    };

    useEffect(() => {
        if (loadingTenants === false && tenants.length === 0){
            onClose();
            addAlert('error', 'Ops', 'Não existe estrutura de árvore para a Instância');
        }
    }, [loadingTenants, tenants])

    useEffect(() => {
        if (opened && tenant?.tenant_id) getTenants(tenant.tenant_id);
    }, [tenant?.tenant_id, opened])

    return (
        <ModalDefault title='Estrutura de Árvore' opened={opened} onClose={onClose} layout='right'>
            <S.Container>

                {loadingTenants && [0, 1, 2, 3, 4, 5, 6].map((load) =>
                    <CardTenantTree key={`load-${load}`} loading={true} tenant={{} as ITenant} />
                )}

                {!loadingTenants && tenants.map((tenant) =>
                    <CardTenantTree loading={false} tenant={tenant} />
                )}

            </S.Container>
        </ModalDefault>
    )
}

const CardTenantTree = ({ tenant, loading }: { tenant: ITenant, loading: boolean }) => {

    return (
        <S.ContainerCardTree>

            <div className='principal'>
                <span className='id'>
                    {loading ? <Skeleton height='15px' width='15px' borderRadius='100px' /> : `#${tenant.tenant_id}`}
                </span>
                {loading ?
                    <Skeleton width='45px' height='45px' borderRadius='0.75rem' />
                    :
                    <AvatarTenant
                        name={tenant.name}
                        colorBg={`#${tenant.colormain.replace('#', '')}`}
                        color={`#${tenant.colorhigh.replace('#', '')}`}
                        colorText={`#${tenant.colorsecond.replace('#', '')}`}
                        image={tenant.images?.touch}
                    />
                }
                <div className='infos'>
                    <b className='title'>{loading ? <Skeleton width='150px' height='19px' /> : tenant.name}</b>
                    <div className='slug'>
                        {loading ? <Skeleton width='50px' height='15px' /> : tenant.slug}
                    </div>
                </div>
            </div>

            {tenant?.children?.length > 0 &&
                <div className='children'>
                    {tenant?.children?.map((children) =>
                        <CardTenantTree loading={false} tenant={children} />
                    )}

                </div>
            }

        </S.ContainerCardTree>
    )

}