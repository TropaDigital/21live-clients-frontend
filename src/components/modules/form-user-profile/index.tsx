import { useEffect, useState } from 'react';

//core
import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';
import { ButtonUpload } from '../../UI/form/button-upload';
import { useAuth } from '../../../core/contexts/AuthContext';
import { OrganizationService } from '../../../core/services/OrganizationService';

//services types
import { UserService } from '../../../core/services/UserService';
import { RoleService } from '../../../core/services/RoleService';
import { TenantService } from '../../../core/services/TenantService';
import type { ICitie, ICountries, IState } from '../../../core/types/ILocations';
import type { IUser } from '../../../core/types/iUser';
import type { ITenant } from '../../../core/types/iTenants';
import type { IOrganization } from '../../../core/types/IOrganization';
import type { IRole } from '../../../core/types/IRoles';

//components
import { AvatarUser } from '../../UI/avatar/avatar-user';
import { Skeleton } from '../../UI/loading/skeleton/styles';
import { ButtonDefault } from '../../UI/form/button-default';
import { IconCheck, IconEnvelope, IconGPS, IconHome, IconImage, IconLoading, IconPassword, IconPencil, IconPhone, IconProfile, IconUnits, IconWhatsapp } from '../../../assets/icons';
import { InputDefault } from '../../UI/form/input-default';
import { SelectDefault } from '../../UI/form/select-default';
import { LocationService } from '../../../core/services/LocationService';
import { InputCheckbox } from '../../UI/form/input-checkbox';
import { SelectMultiple, type IOptionSelect } from '../../UI/form/select-multiple';
import { CardHelp } from '../../UI/card-help';
import { CardTenant } from '../cards/card-tenant';
import { CardOrganization } from '../cards/card-organization';


import * as S from './styles';

interface IProps {
    admin: boolean;
    id: number | null;
    onSubmit?: (data: IUser) => void;
    onLoad?: (data: IUser) => void;
}

interface IUserEdit extends IUser {
    password: string;
    password_confirm: string;
    email2: string;
}

export const FormUserProfile = ({ admin, id, onSubmit, onLoad }: IProps) => {

    const { user, verifyPermission } = useAuth();
    const { tenant, getOrganizations, organizations, loadingOrganization, } = useTenant();
    const { addAlert } = useAlert();

    const [tab, setTab] = useState('user');

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IUserEdit>({} as IUserEdit);
    const [dataOrganization, setDataOrganization] = useState<IOrganization>({} as IOrganization)
    const [dataTenants, setDataTenants] = useState<ITenant[]>([])
    const [dataRoles, setDataRoles] = useState<IRole[]>([])

    const [organizationsUser, setOrganizationsUser] = useState<IOptionSelect[]>([])
    const [tenantsUser, setTenantsUser] = useState<IOptionSelect[]>([])

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string>('');

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoURL, setLogoURL] = useState<string>('');

    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameValid, setUsernameValid] = useState(true);

    const [changePassword, setChangePassword] = useState(id === null ? true : false);

    const [dataCountries, setDataCountries] = useState<ICountries[]>([])
    const [dataStates, setDataStates] = useState<IState[]>([])
    const [dataCities, setDataCities] = useState<ICitie[]>([])

    const handleCheckUsername = async (username: string) => {
        try {
            setUsernameValid(false)
            setUsernameLoading(true);
            await UserService.getUsername(username)
            setUsernameLoading(false);
            setUsernameValid(true)
        } catch (error) {
            setUsernameValid(false)
            setUsernameLoading(false)
        }
    }

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await UserService.getById(id);
                if (onLoad) onLoad(response.item)
                setAvatarURL(response.item.avatar || '');
                setData({ ...response.item });
            }
            if (admin) {
                const response = await RoleService.get();
                setDataRoles([...response.items])
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    const getDataOrganization = async () => {

        setLoading(true);

        if (data.organization_id && dataOrganization.organization_id !== data.organization_id && !admin) {
            const responseOrg = await OrganizationService.getById(data.organization_id);
            setLogoURL(responseOrg.item.images?.logo)
            setDataOrganization({ ...responseOrg.item })
        }

        if (tab === 'my-organization') {
            if (tenant?.register) {
                if (dataCountries.length === 0) {
                    const responseCountrie = await LocationService.getCountries(1, 10000);
                    setDataCountries([...responseCountrie.items])
                }
                if (dataStates.length === 0) {
                    const responseState = await LocationService.getStates(1, 10000);
                    setDataStates([...responseState.items])
                }
                if (dataCities.length === 0) {
                    const responseCitie = await LocationService.getCities(1, 10000)
                    setDataCities([...responseCitie.items])
                }
            }
        } else if (tab === 'organization') {

            if (organizations.length === 0) await getOrganizations();

            if (dataTenants.length === 0) {
                const response = await TenantService.getById(data.tenant_id);
                const allTenants: ITenant[] = []
                allTenants.push(response.item);

                response.item?.children?.forEach((item: ITenant) =>
                    allTenants.push(item)
                )
                response.item?.parent?.forEach((item: ITenant) =>
                    allTenants.push(item)
                )
                setDataTenants([...allTenants])

                if (tenantsUser.length === 0 && id && tenant?.tenant_id === data.tenant_id) {
                    const responseTenantsUsers = await UserService.getByIdTenants(id);
                    if (responseTenantsUsers.item.tenants) {
                        setTenantsUser([...responseTenantsUsers.item.tenants.map((tenant: ITenant) => {
                            return {
                                name: tenant.name ?? '',
                                value: String(tenant.tenant_id),
                            }
                        })])
                    }
                }

                if (tenantsUser.length === 0 && id && tenant?.tenant_id !== data.tenant_id) {
                    if (user && user?.tenants) {
                        setTenantsUser([...user.tenants.map((tenant) => {
                            return {
                                name: tenant.name ?? "",
                                value: String(tenant.tenant_id),
                            }
                        })])
                    }
                }
            }

            if (organizationsUser.length === 0 && id && tenant?.tenant_id === data.tenant_id) {
                const responseOrganizationsUsers = await UserService.getByIdOrganizations(id);
                if (responseOrganizationsUsers.item.organizations) {
                    setOrganizationsUser([...responseOrganizationsUsers.item.organizations.map((row: IOrganization) => {
                        return {
                            name: row.name,
                            value: String(row.organization_id),
                        }
                    })])
                }
            }

            if (organizationsUser.length === 0 && id && tenant?.tenant_id !== data.tenant_id) {
                if (user && user?.organizations) {
                    setOrganizationsUser([...user.organizations.map((row: IOrganization) => {
                        return {
                            name: row.name,
                            value: String(row.organization_id),
                        }
                    })])
                }
            }

        }
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [id])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoadingSubmit(true)
            if (data.password && data.password !== data.password_confirm) throw new Error('A confirmação da senha não confere')
            const response = await UserService.set({ ...data, tenant_id: tenant?.tenant_id, avatar: avatarFile, user_id: id });
            if (!admin && user?.organization_id) {
                await OrganizationService.set({
                    tenant_id: tenant?.tenant_id,
                    organization_id: dataOrganization.organization_id,
                    logo: logoFile,
                    social_footer: dataOrganization.social_footer,
                    name: dataOrganization.name,
                    country_id: dataOrganization.country_id,
                    state_id: dataOrganization.state_id,
                    city_id: dataOrganization.city_id,
                    address: dataOrganization.address,
                    cnpj: dataOrganization.cnpj,
                    email: dataOrganization.email,
                    phone: dataOrganization.phone,
                    whatsapp: dataOrganization.whatsapp,
                });
            }
            if ((admin && id) || (verifyPermission('users_edit') && id)) {
                await UserService.setByIdOrganizations(id, organizationsUser.map((item) => {
                    return Number(item.value)
                }))
                await UserService.setByIdTenants(id, tenantsUser.filter((obj) => Number(obj.value) !== data.tenant_id).map((item) => {
                    return Number(item.value)
                }))
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
        if ((tab === 'my-organization' || tab === 'organization')) {
            getDataOrganization()
        }
    }, [tab, data, dataOrganization])

    //address
    const LIST_ALL_ORGANIZATIONS = tenant?.tenant_id === data.tenant_id ? organizations : user?.organizations ?? [];

    const countrieSelected = dataCountries.find((obj) => obj.country_id === dataOrganization.country_id)
    const stateSelected = dataStates.find((obj) => obj.state_id === dataOrganization.state_id)
    const citieSelected = dataCities.find((obj) => obj.city_id === dataOrganization.city_id)

    //roles
    const LIST_ROLES = dataRoles.map((item) => {
        return {
            name: `${item.title} - ${item.description} <${item.module}>`,
            value: String(item.role_id)
        }
    })
    const ROLE_USER = LIST_ROLES.find((obj) => Number(obj.value) === data.role_id)

    //organizations
    const LIST_ORGANIZATIONS = LIST_ALL_ORGANIZATIONS.map((item) => {
        return {
            name: item.name,
            value: String(item.organization_id),
        }
    })
    const ORGANIZATION_USER = LIST_ORGANIZATIONS.find((obj) => Number(obj.value) === data.organization_id);
    const ORGANIZATION_USER_INFO = LIST_ALL_ORGANIZATIONS.find((obj) => obj.organization_id === Number(ORGANIZATION_USER?.value))

    //tenants
    const LIST_TENANTS = dataTenants.map((item) => {
        return {
            name: item.name,
            value: String(item.tenant_id),
            required: item.tenant_id === data.tenant_id ? true : false
        }
    })

    //get info unique organization
    const getOrganizationById = (id: number) => {
        return LIST_ALL_ORGANIZATIONS.find((obj) => obj.organization_id === id)
    }

    console.log('tenantsUser', tenantsUser)
    console.log('dataTenants', dataTenants)
    //get info unique tenant
    const getTenantById = (id: number) => {
        console.log('getTenantById:', id)
        return dataTenants.find((obj) => obj.tenant_id === id)
    }

    return (
        <S.Container color={tenant?.colorhigh} colorBg={tenant?.colorhigh} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>

            <div className='tabs'>
                <button type='button' onClick={() => setTab('user')} className={`${tab === 'user' ? 'active' : 'normal'}`}>Informações Básicas</button>
                {(!admin && data.organization_id) ?
                    <button type='button' onClick={() => setTab('my-organization')} className={`${tab === 'my-organization' ? 'active' : 'normal'}`}>Minha Unidade</button>
                    : null}

                {admin &&
                    <button type='button' onClick={() => setTab('organization')} className={`${tab === 'organization' ? 'active' : 'normal'}`}>Informações Avançadas</button>
                }
                {!admin && data.organization_id &&
                    <button type='button' onClick={() => setTab('organization')} className={`${tab === 'organization' ? 'active' : 'normal'}`}>Informações Avançadas</button>
                }
            </div>

            {tab === 'user' &&
                <div className='tab user'>
                    <div className='photo-profile'>
                        {loading ? <Skeleton width={'100px'} height={'100px'} borderRadius='100px' /> :
                            <AvatarUser
                                size={100}
                                fontSize={40}
                                name={data?.name}
                                image={avatarURL}
                            />
                        }
                        <div className='options'>
                            <div className='buttons'>
                                <div>
                                    <ButtonUpload
                                        onChange={(file, url) => {
                                            setAvatarFile(file);
                                            setAvatarURL(url)
                                        }}
                                        icon={<IconImage />}
                                        variant="dark"
                                        label='Alterar Avatar'
                                    />
                                </div>
                            </div>
                            <p>
                                Extensões permitidas: <strong>PNG, JPG, JPEG</strong> Tamanho máximo: <strong>2MB</strong>
                            </p>
                        </div>
                    </div>
                    <div className='inputs'>
                        <div className='line' />
                        <div className='row-input'>
                            <InputDefault
                                label='Nome'
                                value={data?.name || ''}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                icon={<IconProfile />}
                                loading={loading}
                            />
                            <div className='username-input'>
                                <InputDefault
                                    label='Usuário'
                                    value={data?.username || ''}
                                    onChange={(e) => {
                                        setUsernameLoading(true);
                                        setData({ ...data, username: e.target.value })
                                    }}
                                    icon={<IconProfile />}
                                    onBlur={(e) => handleCheckUsername(e.target.value)}
                                    loading={loading}
                                />
                                <div className='validate'>
                                    {usernameLoading && <IconLoading />}
                                    {(!usernameValid && !usernameLoading) && <span><b>{data.username}</b> não está dísponivel.</span>}
                                </div>
                            </div>
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
                                label='E-mail Secundário'
                                value={data?.email2 || ''}
                                onChange={(e) => setData({ ...data, email2: e.target.value })}
                                icon={<IconEnvelope />}
                                loading={loading}
                            />
                            <InputDefault
                                label='Whatsapp'
                                value={data?.whatsapp || ''}
                                onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                                type='tel'
                                icon={<IconWhatsapp />}
                                loading={loading}
                                mask="phone"
                            />
                        </div>

                        <div className='head-area'>
                            <h2>Segurança</h2>
                        </div>

                        <div className='row-input'>
                            <div>
                                <InputDefault
                                    label='Senha'
                                    value={data?.password || ''}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                    type='password'
                                    icon={<IconPassword />}
                                    disabled={!changePassword}
                                    loading={loading}
                                />
                            </div>
                            {!changePassword ?
                                <div>
                                    <ButtonDefault
                                        variant='light'
                                        type='button'
                                        icon={<IconPassword />}
                                        onClick={() => setChangePassword(true)}
                                    >
                                        Alterar Senha
                                    </ButtonDefault>
                                </div>
                                :
                                <div>
                                    <InputDefault
                                        label='Confirmação da senha'
                                        value={data?.password_confirm || ''}
                                        onChange={(e) => setData({ ...data, password_confirm: e.target.value })}
                                        type='password'
                                        icon={<IconPassword />}
                                        disabled={!changePassword}
                                        loading={loading}
                                    />
                                </div>
                            }
                        </div>

                        {admin &&
                            <div className='column-input'>
                                <SelectDefault
                                    label='Tipo'
                                    options={LIST_ROLES}
                                    loading={loading}
                                    value={{
                                        name: ROLE_USER?.name ?? '',
                                        value: ROLE_USER?.value ?? ''
                                    }}
                                    onChange={(e) => setData((prev) => ({ ...prev, role_id: Number(e.value) }))}
                                />
                            </div>
                        }

                        {admin ?
                            <div className='column-input'>
                                <InputCheckbox checked={data.askpswd} onChange={(bol) => setData((prev) => ({ ...prev, askpswd: bol }))} label='Pedir nova senha' />
                                <CardHelp title='Pedir nova senha'>
                                    <li>
                                        <p>Na próxima vez que o usuário logar, ele deverá preencher uma nova senha.</p>
                                    </li>
                                </CardHelp>
                            </div>
                            : null}

                        <div className='line' />

                        <div className='foot'>
                            <div>
                                <ButtonDefault loading={loadingSubmit} disabled={!usernameValid} icon={<IconCheck />}>Salvar</ButtonDefault>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {tab === 'my-organization' &&
                <div className='tab organization'>
                    <div className='photo-profile'>
                        {loading ? <Skeleton width={'100px'} height={'100px'} borderRadius='100px' /> :
                            <AvatarUser
                                size={100}
                                fontSize={40}
                                name={dataOrganization?.name}
                                image={logoURL}
                            />
                        }
                        <div className='options'>
                            <div className='buttons'>
                                <ButtonUpload
                                    onChange={(file, url) => {
                                        setLogoFile(file);
                                        setLogoURL(url)
                                    }}
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

                    <div className='inputs'>
                        <div className='line' />

                        <div className='column-input'>
                            <InputDefault
                                label='Nome da unidade'
                                value={dataOrganization?.name || ''}
                                onChange={(e) => setDataOrganization({ ...dataOrganization, name: e.target.value })}
                                icon={<IconHome />}
                                loading={loading}
                                disabled={tenant?.register ? false : true}
                            />
                        </div>

                        {tenant?.register &&
                            <div className='row-input'>
                                <SelectDefault
                                    loading={loading}
                                    label='Pais'
                                    options={dataCountries.map((row) => {
                                        return {
                                            name: row.name,
                                            value: String(row.country_id)
                                        }
                                    })}
                                    onChange={(value) => setDataOrganization((prev) => ({ ...prev, country_id: Number(value.value) }))}
                                    value={{
                                        name: countrieSelected?.name ?? '',
                                        value: String(countrieSelected?.country_id) ?? ''
                                    }}
                                    search
                                />
                                {(countrieSelected?.country_id === 1 || countrieSelected?.country_id === 15) &&
                                    <SelectDefault
                                        loading={loading}
                                        label='Estado'
                                        options={dataStates.map((row) => {
                                            return {
                                                name: row.name,
                                                value: String(row.state_id)
                                            }
                                        })}
                                        onChange={(value) => setDataOrganization((prev) => ({ ...prev, city_id: 0, state_id: Number(value.value) }))}
                                        value={{
                                            name: stateSelected?.name ?? '',
                                            value: String(stateSelected?.state_id) ?? ''
                                        }}
                                        search
                                    />
                                }

                                {(countrieSelected?.country_id === 1 || countrieSelected?.country_id === 15) &&
                                    <SelectDefault
                                        loading={loading}
                                        label='Cidade'
                                        options={dataCities.filter((obj) => obj.state_id === dataOrganization.state_id).map((row) => {
                                            return {
                                                name: row.name,
                                                value: String(row.city_id)
                                            }
                                        })}
                                        onChange={(value) => setDataOrganization((prev) => ({ ...prev, city_id: Number(value.value) }))}
                                        value={{
                                            name: citieSelected?.name ?? '',
                                            value: String(citieSelected?.city_id) ?? ''
                                        }}
                                        search
                                    />
                                }
                            </div>
                        }

                        {tenant?.register &&
                            <div className='column-input'>
                                <InputDefault
                                    label='Endereço Completo'
                                    value={dataOrganization?.address || ''}
                                    onChange={(e) => setDataOrganization({ ...dataOrganization, address: e.target.value })}
                                    icon={<IconGPS />}
                                    loading={loading}
                                />
                            </div>
                        }

                        {tenant?.register &&
                            <div className='column-input'>
                                <InputDefault
                                    label='CNPJ'
                                    value={dataOrganization?.cnpj || ''}
                                    onChange={(e) => setDataOrganization({ ...dataOrganization, cnpj: e.target.value })}
                                    icon={<IconEnvelope />}
                                    loading={loading}
                                    mask='cnpj'
                                />
                            </div>
                        }

                        {tenant?.register &&
                            <div className='row-input'>
                                <InputDefault
                                    label='E-mail'
                                    value={dataOrganization?.email || ''}
                                    onChange={(e) => setDataOrganization({ ...dataOrganization, email: e.target.value })}
                                    icon={<IconEnvelope />}
                                    loading={loading}
                                />
                                <InputDefault
                                    label='Telefone'
                                    value={dataOrganization?.phone || ''}
                                    onChange={(e) => setDataOrganization({ ...dataOrganization, phone: e.target.value })}
                                    icon={<IconPhone />}
                                    loading={loading}
                                    mask='phone'
                                />
                                <InputDefault
                                    label='Whatsapp'
                                    value={dataOrganization?.whatsapp || ''}
                                    onChange={(e) => setDataOrganization({ ...dataOrganization, whatsapp: e.target.value })}
                                    icon={<IconWhatsapp />}
                                    loading={loading}
                                    mask="phone"
                                />
                            </div>
                        }

                        {tenant?.social &&
                            <div className='column-input'>
                                <InputDefault
                                    label='Rodapé em Postagens de Rede Social'
                                    value={dataOrganization?.social_footer || ''}
                                    onChange={(e) => setDataOrganization({ ...dataOrganization, social_footer: e.target.value })}
                                    icon={<IconPencil />}
                                    loading={loading}
                                />
                            </div>
                        }

                        <div className='line' />

                        <div className='foot'>
                            <div>
                                <ButtonDefault loading={loadingSubmit} disabled={!usernameValid} icon={<IconCheck />}>Salvar</ButtonDefault>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {tab === 'organization' &&
                <div className='tab organization'>
                    <div className='inputs'>

                        {(verifyPermission('users_edit') || data.organization_id) &&
                            <div className='head-area'>
                                <h2>Unidade Principal</h2>
                                <p>Unidade padrão utilizada para solicitações e personalizações de artes.</p>
                            </div>
                        }

                        {(verifyPermission('users_edit') || data.organization_id) &&
                            <div className='column-input'>
                                {((data?.tenant_id === tenant?.tenant_id) && verifyPermission('users_edit')) &&
                                    <SelectDefault
                                        search={true}
                                        icon={<IconHome />}
                                        loading={loadingOrganization || loading}
                                        options={LIST_ORGANIZATIONS}
                                        onChange={(e) => setData((prev) => ({ ...prev, organization_id: Number(e.value) }))}
                                        value={{
                                            name: ORGANIZATION_USER?.name ?? '',
                                            value: ORGANIZATION_USER?.value ?? '',
                                        }}
                                    />
                                }
                                {data.organization_id &&
                                    <CardOrganization
                                        name={ORGANIZATION_USER_INFO?.name}
                                        logo={ORGANIZATION_USER_INFO?.images?.logo ?? ''}
                                        created={ORGANIZATION_USER_INFO?.created}
                                        loading={loading}
                                    />
                                }

                            </div>
                        }

                        {((id && organizationsUser.length > 0) || verifyPermission('users_edit')) &&
                            <div className='head-area'>
                                <h2>Unidades Extras</h2>
                                <p>Permite ao usuário, caso tenha acesso a mais de uma unidade, escolher qual utilizar no momento de abrir uma solicitação ou personalizar uma arte.</p>
                            </div>
                        }

                        {((id && organizationsUser.length > 0) || verifyPermission('users_edit')) &&
                            <div className='column-input'>
                                {((data?.tenant_id === tenant?.tenant_id) && verifyPermission('users_edit')) &&
                                    <SelectMultiple
                                        search={true}
                                        loading={loadingOrganization || loading}
                                        icon={<IconUnits />}
                                        options={LIST_ORGANIZATIONS}
                                        onChange={(e) => setOrganizationsUser([...e])}
                                        selecteds={organizationsUser}
                                        position='left'
                                        onRefresh={getOrganizations}
                                    />
                                }
                                <div className='list-cards'>
                                    {loading &&
                                        <CardOrganization
                                            name={''}
                                            logo={''}
                                            created={''}
                                            loading={true}
                                        />
                                    }
                                    {organizationsUser.map((item) =>
                                        <CardOrganization
                                            name={getOrganizationById(Number(item.value))?.name}
                                            logo={getOrganizationById(Number(item.value))?.images?.logo ?? ''}
                                            created={getOrganizationById(Number(item.value))?.created}
                                            onRemove={verifyPermission('users_edit') && tenant?.tenant_id === data.tenant_id ? () => setOrganizationsUser([...organizationsUser.filter((obj) => obj.value !== item.value)]) : undefined}
                                        />
                                    )}
                                </div>
                            </div>
                        }

                        {id &&
                            <div className='head-area'>
                                <h2>Acesso a Instâncias</h2>
                                <p>Define quais subáreas ou seções do portal o usuário poderá acessar e realizar login com o mesmo perfil, caso o portal possua múltiplas instâncias.</p>
                            </div>
                        }

                        {id &&
                            <div className='column-input'>
                                {((data?.tenant_id === tenant?.tenant_id) && verifyPermission('users_edit')) &&
                                    <SelectMultiple
                                        search={true}
                                        loading={loadingOrganization || loading}
                                        icon={<IconPassword />}
                                        options={LIST_TENANTS}
                                        onChange={(e) => setTenantsUser([...e])}
                                        selecteds={tenantsUser}
                                        position='left'
                                        onRefresh={getOrganizations}
                                    />
                                }
                                <div className='list-cards'>
                                    {loading &&
                                        <CardTenant
                                            name={''}
                                            logo={''}
                                            created={''}
                                            loading={true}
                                        />
                                    }
                                    {tenantsUser.map((item) =>
                                        <CardTenant
                                            name={getTenantById(Number(item.value))?.name}
                                            logo={getTenantById(Number(item.value))?.images?.touch ?? ''}
                                            created={getTenantById(Number(item.value))?.created}
                                            color={`${getTenantById(Number(item.value))?.colorhigh}`}
                                            colorBg={`${getTenantById(Number(item.value))?.colormain}`}
                                            colorText={`${getTenantById(Number(item.value))?.colorsecond}`}
                                            onRemove={Number(item.value) !== data.tenant_id ? () => setTenantsUser([...tenantsUser.filter((obj) => obj.value !== item.value)]) : undefined}
                                            loading={loading}
                                        />
                                    )}
                                </div>

                            </div>
                        }

                        {((data?.tenant_id === tenant?.tenant_id) && verifyPermission('users_edit')) &&
                            <>
                                <div className='line' />
                                <div className='foot'>
                                    <div>
                                        <ButtonDefault loading={loadingSubmit} disabled={!usernameValid} icon={<IconCheck />}>Salvar</ButtonDefault>
                                    </div>
                                </div>
                            </>
                        }
                    </div>

                </div>
            }

        </S.Container >
    )
}