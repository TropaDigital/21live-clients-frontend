import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';

import { LocationService } from '../../../core/services/LocationService';
import { OrganizationService } from '../../../core/services/OrganizationService';
import type { IOrganization, IOrganizationGroup } from '../../../core/types/IOrganization';
import type { ICitie, ICountries, IState } from '../../../core/types/ILocations';

import { IconCheck, IconChevronDown, IconClock, IconEnvelope, IconFacebook, IconGPS, IconHome, IconImage, IconInstagram, IconPencil, IconPhone, IconWebsite, IconWhatsapp } from '../../../assets/icons';
import { AvatarUser } from '../../UI/avatar/avatar-user';
import { Skeleton } from '../../UI/loading/skeleton/styles';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';
import { ButtonUpload } from '../../UI/form/button-upload';
import { SelectDefault } from '../../UI/form/select-default';

import * as S from './styles';
import { InputCheckbox } from '../../UI/form/input-checkbox';
import { SelectMultiple, type IOptionSelect } from '../../UI/form/select-multiple';
import { CardOrganization } from '../cards/card-organization';

interface IProps {
    id: number | null;
    onSubmit?: (data: IOrganization) => void;
    onLoad?: (data: IOrganization) => void;
}

interface IPropsEdit extends IOrganization {

}

export const FormOrganization = ({ id, onSubmit, onLoad }: IProps) => {

    const { tenant, getOrganizationsGroup, organizationsGroup, loadingOrganizatonsGroup } = useTenant();
    const { addAlert } = useAlert();

    const [tab, setTab] = useState('basic');

    const [loadingAddress, setLoadingAddress] = useState(true)
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({} as IPropsEdit);

    const [workHours, setWorkHours] = useState(false)

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoURL, setLogoURL] = useState<string>('');

    const [logoWFile, setLogoWFile] = useState<File | null>(null);
    const [logoWURL, setLogoWURL] = useState<string>('');

    const [logoBFile, setLogoBFile] = useState<File | null>(null);
    const [logoBURL, setLogoBURL] = useState<string>('');

    const [dataCountries, setDataCountries] = useState<ICountries[]>([])
    const [dataStates, setDataStates] = useState<IState[]>([])
    const [dataCities, setDataCities] = useState<ICitie[]>([])

    const [groupsOrganization, setGroupsOrganization] = useState<IOrganizationGroup[]>([])

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await OrganizationService.getById(id);
                const responseGroups = await OrganizationService.getGroupsOrgById(id)
                if (onLoad) onLoad(response.item)
                setLogoURL(response.item.images?.logo || '');
                setLogoWURL(response.item.images?.logo_w || '');
                setLogoBURL(response.item.images?.logo_b || '');
                setWorkHours(response.item.workhours > 0 ? true : false)
                setData({ ...response.item });
                setGroupsOrganization([...responseGroups.item.groups])
            }
            setLoading(false);

            setLoadingAddress(true);
            const responseCountrie = await LocationService.getCountries(1, 10000);
            setDataCountries([...responseCountrie.items])
            const responseState = await LocationService.getStates(1, 10000);
            setDataStates([...responseState.items])
            const responseCitie = await LocationService.getCities(1, 10000)
            setDataCities([...responseCitie.items])
            setLoadingAddress(false)

        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    const getDataGroupOrganization = async () => {
        if (organizationsGroup.length === 0) await getOrganizationsGroup();
    }

    useEffect(() => {
        getData();
    }, [id])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoadingSubmit(true)
            const response = await OrganizationService.set({ ...data, logo: logoFile, logo_b: logoBFile, logo_w: logoWFile, tenant_id: tenant?.tenant_id, organization_id: id });
            if (id) {
                await OrganizationService.setOrganizationGroups({
                    id: id, groups: organizationsGroup.map((row) => {
                        return row.orggroup_id
                    })
                });
            }
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

    useEffect(() => {
        if (tab === 'group-organization') {
            getDataGroupOrganization()
        }
    }, [tab, data])

    //address
    const countrieSelected = dataCountries.find((obj) => obj.country_id === data.country_id)
    const stateSelected = dataStates.find((obj) => obj.state_id === data.state_id)
    const citieSelected = dataCities.find((obj) => obj.city_id === data.city_id)

    //orgs group
    const LIST_GROUP_ORGANIZATIONS = organizationsGroup.map((item) => {
        return {
            name: item.title,
            value: String(item.orggroup_id)
        }
    })

    const handleChangeGroupOrganization = (items: IOptionSelect[]) => {
        const itemIds = new Set(items.map(item => Number(item.value)));
        setGroupsOrganization(
            organizationsGroup.filter(group => itemIds.has(group.orggroup_id))
        );
    }
    return (
        <S.Container color={tenant?.colorhigh} colorBg={tenant?.colorhigh} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>

            <div className='tabs'>
                <button type='button' onClick={() => setTab('basic')} className={`${tab === 'basic' ? 'active' : 'normal'}`}>Informações Básicas</button>
                {id && <button type='button' onClick={() => setTab('group-organization')} className={`${tab === 'group-organization' ? 'active' : 'normal'}`}>Grupos de Unidades</button>}
            </div>

            {tab === 'basic' &&
                <div className='tab organization'>

                    <div className='inputs'>

                        <div className='column-input'>
                            <InputDefault
                                label='Nome da unidade'
                                value={data?.name || ''}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                icon={<IconHome />}
                                loading={loading}
                            />
                        </div>

                        <div className='row-input'>
                            <SelectDefault
                                loading={loadingAddress}
                                label='Pais'
                                options={dataCountries.map((row) => {
                                    return {
                                        name: row.name,
                                        value: String(row.country_id)
                                    }
                                })}
                                onChange={(value) => setData((prev) => ({ ...prev, country_id: Number(value.value) }))}
                                value={{
                                    name: countrieSelected?.name ?? '',
                                    value: String(countrieSelected?.country_id) ?? ''
                                }}
                                search
                            />
                            {(countrieSelected?.country_id === 1 || countrieSelected?.country_id === 15) &&
                                <SelectDefault
                                    loading={loadingAddress}
                                    label='Estado'
                                    options={dataStates.map((row) => {
                                        return {
                                            name: row.name,
                                            value: String(row.state_id)
                                        }
                                    })}
                                    onChange={(value) => setData((prev) => ({ ...prev, city_id: 0, state_id: Number(value.value) }))}
                                    value={{
                                        name: stateSelected?.name ?? '',
                                        value: String(stateSelected?.state_id) ?? ''
                                    }}
                                    search
                                />
                            }

                            {(countrieSelected?.country_id === 1 || countrieSelected?.country_id === 15) &&
                                <SelectDefault
                                    loading={loadingAddress}
                                    label='Cidade'
                                    options={dataCities.filter((obj) => obj.state_id === data.state_id).map((row) => {
                                        return {
                                            name: row.name,
                                            value: String(row.city_id)
                                        }
                                    })}
                                    onChange={(value) => setData((prev) => ({ ...prev, city_id: Number(value.value) }))}
                                    value={{
                                        name: citieSelected?.name ?? '',
                                        value: String(citieSelected?.city_id) ?? ''
                                    }}
                                    search
                                />
                            }
                        </div>

                        <div className='column-input'>
                            <InputDefault
                                label='Endereço Completo'
                                value={data?.address || ''}
                                onChange={(e) => setData({ ...data, address: e.target.value })}
                                icon={<IconGPS />}
                                loading={loading}
                            />
                        </div>

                        <div className='column-input'>
                            <InputDefault
                                label='CNPJ'
                                value={data?.cnpj || ''}
                                onChange={(e) => setData({ ...data, cnpj: e.target.value })}
                                icon={<IconEnvelope />}
                                loading={loading}
                                mask='cnpj'
                            />
                        </div>

                        <div className='row-input'>
                            <InputDefault
                                label='E-mail'
                                value={data?.email || ''}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                icon={<IconEnvelope />}
                                loading={loading}
                            />
                            <InputDefault
                                label='Telefone'
                                value={data?.phone || ''}
                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                                icon={<IconPhone />}
                                loading={loading}
                                mask='phone'
                            />
                            <InputDefault
                                label='Whatsapp'
                                value={data?.whatsapp || ''}
                                onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                                icon={<IconWhatsapp />}
                                loading={loading}
                                mask="phone"
                            />
                        </div>

                        <div className='row-input'>
                            <InputDefault
                                label='Facebook'
                                value={data?.facebook || ''}
                                onChange={(e) => setData({ ...data, facebook: e.target.value })}
                                icon={<IconFacebook />}
                                loading={loading}
                            />
                            <InputDefault
                                label='Instagram'
                                value={data?.instagram || ''}
                                onChange={(e) => setData({ ...data, instagram: e.target.value })}
                                icon={<IconInstagram />}
                                loading={loading}
                            />
                            <InputDefault
                                label='Site'
                                value={data?.website || ''}
                                onChange={(e) => setData({ ...data, website: e.target.value })}
                                icon={<IconWebsite />}
                                loading={loading}
                            />
                        </div>

                        {tenant?.social &&
                            <div className='column-input'>
                                <InputDefault
                                    label='Rodapé em Postagens de Rede Social'
                                    value={data?.social_footer || ''}
                                    onChange={(e) => setData({ ...data, social_footer: e.target.value })}
                                    icon={<IconPencil />}
                                    loading={loading}
                                />
                            </div>
                        }


                        <div className='column-input'>
                            <InputCheckbox
                                label='Calcular horas de trabalho'
                                checked={workHours}
                                onChange={(bol) => {
                                    setWorkHours(bol);
                                    bol === false && setData((prev) => ({ ...prev, workhours: 0 }))
                                }}
                            />
                            {workHours &&
                                <InputDefault
                                    label='Horas de Trabalho'
                                    value={data?.workhours || ''}
                                    onChange={(e) => setData({ ...data, workhours: Number(e.target.value) })}
                                    icon={<IconClock />}
                                    loading={loading}
                                    type='number'
                                />
                            }
                        </div>

                        <div className='head-area'>
                            <h2>Personalização</h2>
                        </div>

                        <CardLogoToggle
                            label='Logo Padrão'
                            loading={loading}
                            name={data.name}
                            url={logoURL}
                            onChange={(file, url) => {
                                setLogoFile(file);
                                setLogoURL(url)
                            }}
                        />
                        <CardLogoToggle
                            label='Logo Preto'
                            loading={loading}
                            name={data.name}
                            url={logoBURL}
                            onChange={(file, url) => {
                                setLogoBFile(file);
                                setLogoBURL(url)
                            }}
                        />
                        <CardLogoToggle
                            label='Logo Branco'
                            loading={loading}
                            name={data.name}
                            url={logoWURL}
                            onChange={(file, url) => {
                                setLogoWFile(file);
                                setLogoWURL(url)
                            }}
                        />

                        <div className='line' />

                        <div className='foot'>
                            <div>
                                <ButtonDefault loading={loadingSubmit} icon={<IconCheck />}>Salvar</ButtonDefault>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {tab === 'group-organization' &&
                <div className='tab group-organization'>
                    <div className='inputs'>
                        <div className='column-input'>
                            <SelectMultiple
                                search={true}
                                loading={loadingOrganizatonsGroup || loading}
                                icon={<IconHome />}
                                label="Grupos de Unidade"
                                options={LIST_GROUP_ORGANIZATIONS}
                                onChange={handleChangeGroupOrganization}
                                selecteds={groupsOrganization.map((row) => {
                                    return {
                                        name: row.title,
                                        value: String(row.orggroup_id)
                                    }
                                })}
                                position='left'
                                onRefresh={getOrganizationsGroup}
                            />

                            <div className='list-cards'>
                                {(loading || loadingOrganizatonsGroup) &&
                                    <CardOrganization
                                        name={''}
                                        logo={''}
                                        created={''}
                                        loading={true}
                                    />
                                }
                                {groupsOrganization.map((item) =>
                                    <CardOrganization
                                        name={item.title}
                                        logo={''}
                                        created={item.created}
                                        onRemove={() => setGroupsOrganization((prev) => ([...prev.filter((obj) => obj.orggroup_id !== item.orggroup_id)]))}
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
            }

        </S.Container >
    )
}

const CardLogoToggle = ({ loading, label, name, url, onChange }: { loading: boolean, label: string; name: string, url?: string, onChange(file: File, url: string): void }) => {

    const [opened, setOpened] = useState(false)

    return (
        <S.CardLogoToggle>
            <div className='head'>
                {loading ? <Skeleton width={'30px'} height={'30px'} borderRadius='100px' /> :
                    <AvatarUser
                        size={30}
                        fontSize={12}
                        name={name ?? ''}
                        image={url ?? ''}
                    />
                }
                <p className='label-toggle'>{label}</p>
                <button className={`btn-toggle ${opened ? 'opened' : 'closed'}`} type='button' onClick={() => setOpened(!opened)}>
                    <IconChevronDown />
                </button>
            </div>
            {opened &&
                <div className='photo-profile'>
                    {loading ? <Skeleton width={'70px'} height={'70px'} borderRadius='100px' /> :
                        <AvatarUser
                            size={70}
                            fontSize={25}
                            name={name}
                            image={url ?? ''}
                        />
                    }
                    <div className='options'>
                        <div className='buttons'>
                            <ButtonUpload
                                onChange={onChange}
                                icon={<IconImage />}
                                variant="dark"
                                label='Alterar Logo'
                            />
                        </div>
                        <p>
                            Tamanho sugerido: <b>200x200</b>
                        </p>
                    </div>
                </div>
            }
        </S.CardLogoToggle>
    )
}