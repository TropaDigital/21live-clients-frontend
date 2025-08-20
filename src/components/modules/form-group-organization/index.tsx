import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';

import { OrganizationService } from '../../../core/services/OrganizationService';
import type { IOrganization, IOrganizationGroup } from '../../../core/types/IOrganization';

import { IconCheck, IconEnvelope, IconHome, IconUnits } from '../../../assets/icons';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';

import * as S from './styles';
import { SelectMultiple } from '../../UI/form/select-multiple';
import { CardOrganization } from '../cards/card-organization';

interface IProps {
    id: number | null;
    onSubmit?: (data: IOrganizationGroup) => void;
    onLoad?: (data: IOrganizationGroup) => void;
}

interface IPropsEdit extends IOrganizationGroup {

}

export const FormGroupOrganization = ({ id, onSubmit, onLoad }: IProps) => {

    const { tenant, getOrganizations, loadingOrganization, organizations } = useTenant();
    const { addAlert } = useAlert();

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({} as IPropsEdit);

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await OrganizationService.getGroupById(id);
                if (onLoad) onLoad(response.item)
                setData({ ...response.item });
            }
            if (organizations.length === 0) {
                getOrganizations();
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [id])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoadingSubmit(true)
            const response = await OrganizationService.setGroup({
                title: data.title,
                description: data.description,
                id: id ? Number(id) : null,
                tenant_id: tenant?.tenant_id ?? 0,
                organizations: data.organizations ?? []
            });
            if (onSubmit) {
                onSubmit(response.item);
            }
            setLoadingSubmit(false)
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
        } catch (error: any) {
            setLoadingSubmit(false)
            if (error.errors) {
                addAlert('error', 'Ops', error.errors[0]);
            } else {
                addAlert('error', 'Ops', error.message);
            }
        }
    };

    const LIST_ORGANIZATIONS = organizations.map((item) => {
        return {
            name: item.name,
            value: String(item.organization_id)
        }
    })

    const orgIds = new Set<number>(data.organizations);

    const SELECTEDS_ORGANIZATIONS = organizations
        .filter((org: IOrganization) => orgIds.has(org.organization_id))
        .map((org: IOrganization) => ({
            name: org.name,
            value: String(org.organization_id)
        }));

    //get info unique organization
    const getOrganizationById = (id: number) => {
        return organizations.find((obj) => obj.organization_id === id)
    }

    return (
        <S.Container color={tenant?.colorhigh} colorBg={tenant?.colorhigh} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>


            <div className='tab'>

                <div className='inputs'>

                    <div className='row-input'>
                        <InputDefault
                            label='Titulo'
                            value={data?.title || ''}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            icon={<IconUnits />}
                            loading={loading}
                        />
                        <InputDefault
                            label='Descrição'
                            value={data?.description || ''}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            icon={<IconEnvelope />}
                            loading={loading}
                        />
                    </div>
                    <div className='column-input'>
                        <SelectMultiple
                            search={true}
                            loading={loadingOrganization || loading}
                            icon={<IconHome />}
                            label="Unidades"
                            options={LIST_ORGANIZATIONS}
                            onChange={(e) => setData((prev) => ({
                                ...prev, organizations: e.map((item) => {
                                    return Number(item.value)
                                })
                            }))}
                            selecteds={SELECTEDS_ORGANIZATIONS}
                            position='left'
                            onRefresh={getOrganizations}
                        />

                        <div className='list-cards'>
                            {(loading || loadingOrganization) &&
                                <CardOrganization
                                    name={''}
                                    logo={''}
                                    created={''}
                                    loading={true}
                                />
                            }
                            {SELECTEDS_ORGANIZATIONS.map((item) =>
                                <CardOrganization
                                    name={getOrganizationById(Number(item.value))?.name}
                                    logo={getOrganizationById(Number(item.value))?.images.logo ?? ''}
                                    created={getOrganizationById(Number(item.value))?.created}
                                    onRemove={() => setData((prev) => ({
                                        ...prev, organizations: SELECTEDS_ORGANIZATIONS.filter((obj) => obj.value !== item.value).map((row) => {
                                            return Number(row.value)
                                        })
                                    }))}
                                />
                            )}
                        </div>
                    </div>

                    <div className='line' />

                    <div className='foot'>
                        <div>
                            <ButtonDefault loading={loadingSubmit} icon={<IconCheck />}>Salvar</ButtonDefault>
                        </div>
                    </div>
                </div>
            </div>


        </S.Container >
    )
}