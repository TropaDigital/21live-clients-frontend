import { useEffect, useState } from 'react';

import { useTenant } from '../../../core/contexts/TenantContext';
import { useAlert } from '../../../core/contexts/AlertContext';
import { useAuth } from '../../../core/contexts/AuthContext';

import { TenantService } from '../../../core/services/TenantService';
import type { ITenant } from '../../../core/types/iTenants';

import { IconCalendarDay, IconCheck, IconHome, IconImage, IconTextRename, IconWebsite } from '../../../assets/icons';
import { Skeleton } from '../../UI/loading/skeleton/styles';
import { ButtonDefault } from '../../UI/form/button-default';
import { InputDefault } from '../../UI/form/input-default';
import { ButtonUpload } from '../../UI/form/button-upload';
import { SelectDefault } from '../../UI/form/select-default';

import * as S from './styles';
import EditorTextSlash from '../../UI/form/editor-text-slash';
import { InputCheckbox } from '../../UI/form/input-checkbox';
import { CardTenant } from '../cards/card-tenant';
import { ContainerEditorStatic } from '../../UI/form/editor-text-slash/styles';
import { AvatarTenant } from '../../UI/avatar/avatar-tenant';
import { InputColor } from '../../UI/form/input-color';
import { useRedirect } from '../../../core/hooks/useRedirect';
import { LabelCheckbox } from '../../UI/form/input-checkbox/styles';


interface IProps {
    id: number | null;
    onSubmit?: (data: ITenant) => void;
    onLoad?: (data: ITenant) => void;
}

interface IPropsEdit extends ITenant {

}

export const FormTenant = ({ id, onSubmit, onLoad }: IProps) => {

    const { tenant, getTenants, loadingTenants, tenants } = useTenant();
    const { verifyPermission } = useAuth()
    const { addAlert } = useAlert();
    const { redirectSlug } = useRedirect();

    const [tab, setTab] = useState('info-basic');

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [data, setData] = useState<IPropsEdit>({ type: '' } as IPropsEdit);

    const [tickets_deadline, setTickets_deadline] = useState(false);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [loginBGFile, setLoginBGFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [touchFile, setTouchFile] = useState<File | null>(null);

    const getData = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await TenantService.getById(id);
                if (onLoad) onLoad(response.item);

                response.item.allow_hour_limit = response.item.tickets_hourlimitreached ? true : false;
                response.item.termset = response.item.privacyterms ? true : false;

                setData({ ...response.item });
                if (response.item.tickets_deadline > 0) {
                    setTickets_deadline(true);
                }
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

            const response = await TenantService.set(id, data, {
                logo: logoFile,
                bg_login: loginBGFile,
                icon: faviconFile,
                touch: touchFile,
            });
            if (onSubmit) {
                onSubmit(response.item);
            }
            setLoadingSubmit(false)
            addAlert('success', 'Sucesso', 'Alterações realizadas com sucesso.');
            redirectSlug(`/settings/tenants/${response.item.tenant_id}`)
        } catch (error: any) {
            setLoadingSubmit(false)
            if (error.errors) {
                addAlert('error', 'Ops', error.errors[0]);
            } else if (error.error) {
                addAlert('error', 'Ops', error.error);
            } else {
                addAlert('error', 'Ops', error.message);
            }
        }
    };

    const TABS_PERMISSIONS = [
        {
            name: 'Informações Básicas',
            value: 'info-basic',
        },
        {
            name: 'Informações Avançadas',
            value: 'info-advanced',
            permission: 'tenants_edit',
        },
        {
            name: 'Módulos Adicionais',
            value: 'modules',
            permission: 'tenants_edit'
        },
        {
            name: 'Solicitações',
            value: 'solicitacions',
            permission: 'tenants_edit'
        },
        {
            name: 'Privacidade & Cookies',
            value: 'privacity',
            permission: 'tenants_edit',
            haveId: true,
        },
    ]

    useEffect(() => {
        //alert('change tab')
        if (tab === 'info-advanced' && tenants.length === 0 && loadingTenants === false) {
            getTenants();
        }
    }, [tab, data])

    const handleOnChangeUpload = (file: File, url: string, type: string) => {
        if (type === 'logo') {
            setLogoFile(file);
            setData((prev) => ({ ...prev, images: { ...prev.images, logo: url } }))
        } else if (type === 'bg') {
            setLoginBGFile(file);
            setData((prev) => ({ ...prev, images: { ...prev.images, bg_login: url } }))
        } else if (type === 'favicon') {
            setFaviconFile(file);
            setData((prev) => ({ ...prev, images: { ...prev.images, icon: url } }))
        } else if (type === 'touch') {
            setTouchFile(file);
            setData((prev) => ({ ...prev, images: { ...prev.images, touch: url } }))
        }
    }

    const TENANT_SELECTED = tenants.find((obj) => data.parent_id && obj.tenant_id === data.parent_id)

    const LIST_CATS = [
        {
            name: 'Institucional',
            value: '',
        },
        {
            name: 'Brands',
            value: 'brands',
        },
        {
            name: 'Brands Teste Grátis',
            value: 'brandstrial',
        },
        {
            name: 'Agência',
            value: 'agency',
        },
        {
            name: 'Agência Teste Grátis',
            value: 'agencytrial',
        },
        {
            name: 'Área do Cliente/Sub-Instância',
            value: 'subitem',
        }
    ]
    const SELECTED_TYPE = LIST_CATS.find((obj) => data.type ? obj.value === data.type : obj.value === '')

    const LIST_JOBS_TREE = [
        {
            name: 'Singular: Todos os clientes acessam a mesma área',
            value: 'single',
        },
        {
            name: 'Múltipla: Cada cliente possui sua própria área',
            value: 'multiple',
        }
    ]
    const SELECTED_JOBS_TREE = LIST_JOBS_TREE.find((obj) => data.jobs_tree ? obj.value === data.jobs_tree : obj.value === 'multiple')

    const LIST_JOBS_AUTOCREATE = [
        {
            name: 'Sempre Perguntar',
            value: 'ask'
        },
        {
            name: 'Sempre Criar',
            value: 'always'
        },
        {
            name: 'Nunca Criar',
            value: 'never'
        }
    ]

    const SELECTED_JOBS_AUTOCREATE = LIST_JOBS_AUTOCREATE.find((obj) => data.jobs_autocreate ? obj.value === data.jobs_autocreate : obj.value === 'ask')

    return (
        <S.Container color={tenant?.colorhigh} colorBg={tenant?.colorhigh} colorText={tenant?.colorsecond} onSubmit={handleSubmit}>

            <div className='tabs'>
                {TABS_PERMISSIONS.map((row) => {

                    const show = row.permission ? verifyPermission(row.permission) : row.haveId && !id ? false : true;

                    return show && (
                        <button key={`tab-${row.value}`} type='button' onClick={() => setTab(row.value)} className={`${tab === row.value ? 'active' : 'normal'}`}>{row.name}</button>
                    )
                }
                )}
            </div>

            <div className='tab'>
                <div className='inputs'>

                    {tab === 'info-basic' && (verifyPermission('tenants_edit') || verifyPermission('tenants_customize')) &&
                        <>
                            <div className='head-area'>
                                <h2>Informações Básicas</h2>
                            </div>
                            <div className='column-input gap-20'>
                                <InputDefault
                                    label='Nome'
                                    value={data?.name || ''}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    icon={<IconHome />}
                                    loading={loading}
                                />

                                {verifyPermission('tenants_edit') &&
                                    <InputDefault
                                        label='Slug'
                                        description={`Código para a url. NÃO deve conter caracteres especiais.`}
                                        value={data?.slug || ''}
                                        onChange={(e) => setData({ ...data, slug: e.target.value })}
                                        icon={<IconWebsite />}
                                        loading={loading}
                                    />
                                }

                                {verifyPermission('tenants_edit') &&
                                    <SelectDefault
                                        loading={loading}
                                        label='Categoria de Instância'
                                        value={{
                                            name: SELECTED_TYPE?.name ?? '',
                                            value: SELECTED_TYPE?.value ?? '',
                                        }}
                                        options={LIST_CATS}
                                        onChange={(value) => setData((prev) => ({ ...prev, type: value.value }))}
                                    />
                                }

                            </div>

                            <>
                                <div className='head-area'>
                                    <h2>Cores</h2>
                                </div>
                                <div className='row-input gap-10'>
                                    <InputColor
                                        label='Cor Primária'
                                        value={data.colormain}
                                        loading={loading}
                                        onChange={(e) => setData((prev) => ({ ...prev, colormain: e.target.value }))}
                                    />
                                    <InputColor
                                        label='Cor Secundária'
                                        value={data.colorhigh}
                                        loading={loading}
                                        onChange={(e) => setData((prev) => ({ ...prev, colorhigh: e.target.value }))}
                                    />
                                    <InputColor
                                        label='Cor Texto'
                                        value={data.colorsecond}
                                        loading={loading}
                                        onChange={(e) => setData((prev) => ({ ...prev, colorsecond: e.target.value }))}
                                    />
                                </div>

                                {id &&
                                    <>
                                        <div className='head-area'>
                                            <h2>Imagens</h2>
                                        </div>
                                        <div className='column-input'>
                                            <div className='list-uploads'>
                                                <CardUploadToggle
                                                    label='Logo'
                                                    loading={loading}
                                                    onChange={(file, url) => handleOnChangeUpload(file, url, 'logo')}
                                                    description='Extensões válidas: .png; Tamanho sugerido: 200x80px'
                                                    url={data?.images?.logo}
                                                    type='logo'
                                                />
                                                <CardUploadToggle
                                                    label='Fundo da Tela de Login'
                                                    loading={loading}
                                                    onChange={(file, url) => handleOnChangeUpload(file, url, 'bg')}
                                                    description='Extensões válidas: .jpg; Tamanho sugerido: 780x600px'
                                                    url={data?.images?.bg_login}
                                                    type="bg"
                                                />
                                                <CardUploadToggle
                                                    label='Ícone do Navegador'
                                                    loading={loading}
                                                    onChange={(file, url) => handleOnChangeUpload(file, url, 'favicon')}
                                                    description='Extensões válidas: .ico'
                                                    url={data?.images?.icon}
                                                    type="favicon"
                                                />
                                                <CardUploadToggle
                                                    label='Ícone'
                                                    loading={loading}
                                                    onChange={(file, url) => handleOnChangeUpload(file, url, 'touch')}
                                                    description='Extensões válidas: .png; Tamanho sugerido: 192x192px'
                                                    url={data?.images?.touch}
                                                    tenant={data}
                                                    type="tenant"
                                                />
                                            </div>
                                        </div>
                                    </>
                                }

                            </>
                        </>
                    }

                    {tab === 'info-advanced' &&
                        <>
                            <div className='head-area'>
                                <h2>Área do Cliente Matriz</h2>
                                <p>
                                    Usuários moderadores da área do cliente matriz podem logar e possuem as mesmas permissões nesta área do cliente filial.
                                </p>
                            </div>
                            <div className='column-input'>
                                <SelectDefault
                                    onChange={(e) => setData((prev) => ({ ...prev, parent_id: e.value ? Number(e.value) : null }))}
                                    label='Matriz'
                                    search={true}
                                    loading={loading || loadingTenants}
                                    isValidEmpty={'Nenhuma Matriz'}
                                    options={tenants.map((row) => {
                                        return {
                                            name: row.name,
                                            value: String(row.tenant_id)
                                        }
                                    })}
                                    value={{
                                        name: TENANT_SELECTED?.name ?? 'Nenhuma Matriz',
                                        value: TENANT_SELECTED?.tenant_id ? String(TENANT_SELECTED?.tenant_id) : ''
                                    }}
                                />
                                {(loading || loadingTenants || data.parent_id) &&
                                    <div className='list-cards'>
                                        <CardTenant
                                            loading={loading || loadingTenants}
                                            color={TENANT_SELECTED?.colorhigh}
                                            colorBg={TENANT_SELECTED?.colormain}
                                            colorText={TENANT_SELECTED?.colorsecond}
                                            logo={TENANT_SELECTED?.images.touch}
                                            name={TENANT_SELECTED?.name}
                                        />
                                    </div>
                                }
                            </div>

                            <div className='head-area'>
                                <h2>White Label</h2>
                                <p>
                                    Desativa a exibição do logo da 21 LIVE e do Número de Versão do Sistema
                                </p>
                            </div>
                            <div className='column-input'>
                                <InputCheckbox
                                    label='Ativar White Label'
                                    checked={data.whiteLabel}
                                    onChange={(bol) => setData((prev) => ({ ...prev, whiteLabel: bol }))}
                                />
                            </div>

                            <div className='head-area'>
                                <h2>Arquivos</h2>
                            </div>
                            <div className='column-input'>

                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar Limite de Downloads'
                                        checked={data.downlimit}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, downlimit: bol }))}
                                    />
                                    <p>Adiciona a opção de limitar por unidade o número de downloads disponíveis para os usuários.</p>
                                </LabelCheckbox>

                                {id &&
                                    <LabelCheckbox>
                                        <InputCheckbox
                                            label='Ativar Aprovação de Customizações'
                                            checked={data.customApproval}
                                            loading={loading}
                                            onChange={(bol) => setData((prev) => ({ ...prev, customApproval: bol }))}
                                        />
                                        <p>Faz necessária a aprovação das criações de peças customizadas, através do Solicitações, antes de liberar o download.</p>
                                    </LabelCheckbox>
                                }
                            </div>
                        </>
                    }

                    {tab === 'modules' &&
                        <>
                            <div className='head-area'>
                                <h2>Cadastro de Usuários</h2>
                            </div>
                            <div className='column-input'>

                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar registro de novos usuários'
                                        checked={data.register}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, register: bol }))}
                                    />
                                    <p>Habilita novos usuários criarem contas na tela inicial</p>

                                </LabelCheckbox>

                                {id &&
                                    <>
                                        <LabelCheckbox>
                                            <InputCheckbox
                                                label='Validar registro de novos usuários'
                                                disabled={data.register === false ? true : false}
                                                checked={data.register_validate}
                                                loading={loading}
                                                onChange={(bol) => setData((prev) => ({ ...prev, register_validate: bol }))}
                                            />
                                            <p>Faz com que os usuários cadastrados na opção acima não recebam acesso de imediato, ao invés disso, eles caem numa tela para terem seu cadastro aprovados ou não pela administraçãoƒ</p>
                                        </LabelCheckbox>

                                        <LabelCheckbox>
                                            <InputCheckbox
                                                label='Travar registro à Unidades existentes'
                                                disabled={data.register === false ? true : false}
                                                checked={data.register_setOrganization}
                                                loading={loading}
                                                onChange={(bol) => setData((prev) => ({ ...prev, register_setOrganization: bol }))}
                                            />
                                            <p>Ao ativar essa opção você impede que novos usuários sejam criados junto de novas unidades, forçando os mesmo a se atrelarem a uma unidade já cadastrada.</p>
                                        </LabelCheckbox>

                                        <LabelCheckbox>
                                            <InputCheckbox
                                                label='Ativar preenchimento completo de dados'
                                                checked={data.complete_fill}
                                                loading={loading}
                                                onChange={(bol) => setData((prev) => ({ ...prev, complete_fill: bol }))}
                                            />
                                            <p>Usuários cadastrados pelo Registro de Novos Usuários ou por integrações externas(hotmart) caem numa tela de passo a passo para preencher todos os dados de sua conta. Caso essa opção seja desabilitada, o novo usuário cai numa tela simples, resumida, apenas com os dados necessários.</p>
                                        </LabelCheckbox>

                                        <LabelCheckbox>
                                            <InputCheckbox
                                                label='Ativar cadastro de anônimos'
                                                checked={data.register_asAnon}
                                                loading={loading}
                                                onChange={(bol) => setData((prev) => ({ ...prev, register_asAnon: bol }))}
                                            />
                                            <p>Habilita novos usuários criarem contas anônimas a partir da tela inicial.</p>
                                        </LabelCheckbox>
                                    </>
                                }
                            </div>

                            {id &&
                                <>
                                    <div className='head-area'>
                                        <h2>Tarefas</h2>
                                    </div>
                                    <div className='column-input gap-20'>
                                        <LabelCheckbox>
                                            <InputCheckbox
                                                label='Ativar módulo tarefas'
                                                checked={data.jobs}
                                                loading={loading}
                                                onChange={(bol) => setData((prev) => ({ ...prev, jobs: bol }))}
                                            />
                                            <p>Habilita o módulo de gerenciamento de tarefas, amarrando as entregas com as solicitações e disponibilizando os arquivos direto nas pastas da plataforma.</p>
                                        </LabelCheckbox>
                                        {data.jobs &&
                                            <>
                                                <SelectDefault
                                                    label='Organização das Áreas dos Clientes'
                                                    description="Define se os clientes possuem suas próprias áreas ou se todos acessam a mesma."
                                                    onChange={(e) => setData((prev) => ({ ...prev, jobs_tree: e.value }))}
                                                    options={LIST_JOBS_TREE}
                                                    loading={loading}
                                                    value={{
                                                        name: SELECTED_JOBS_TREE?.name ?? '',
                                                        value: SELECTED_JOBS_TREE?.value ?? ''
                                                    }}
                                                />

                                                <SelectDefault
                                                    label='Criar Solicitação a partir de Tarefa'
                                                    onChange={(e) => setData((prev) => ({ ...prev, jobs_autocreate: e.value }))}
                                                    options={LIST_JOBS_AUTOCREATE}
                                                    loading={loading}
                                                    value={{
                                                        name: SELECTED_JOBS_AUTOCREATE?.name ?? '',
                                                        value: SELECTED_JOBS_AUTOCREATE?.value ?? ''
                                                    }}
                                                />
                                            </>
                                        }
                                    </div>
                                </>
                            }
                            <div className='head-area'>
                                <h2>Cursos</h2>
                            </div>
                            <div className='column-input'>
                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar modo e-learning'
                                        checked={data.elearning}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, elearning: bol }))}
                                    />
                                    <p>Habilita o módulo de cursos, permitindo o acompanhamento do progresso dos usuarios.</p>
                                </LabelCheckbox>
                            </div>
                            <div className='head-area'>
                                <h2>Módulos Extras</h2>
                            </div>
                            <div className='column-input'>
                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar Produtos'
                                        checked={data.products}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, products: bol }))}
                                    />
                                    <p>Ativa o módulo de produtos, além de habilitar o uso de suas imagens nas customizações.</p>
                                </LabelCheckbox>
                                {id &&
                                    <LabelCheckbox>
                                        <InputCheckbox
                                            label='Ativar Materiais'
                                            checked={data.materials}
                                            loading={loading}
                                            onChange={(bol) => setData((prev) => ({ ...prev, materials: bol }))}
                                        />
                                        <p>Ativa o módulo de materiais, habilitando sua associação as unidades e solicitações.</p>
                                    </LabelCheckbox>
                                }
                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar Redes Sociais'
                                        checked={data.social}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, social: bol }))}
                                    />
                                    <p>Ativa as opções para conectar o sistema ao Facebook, permitindo publicar artes diretamenta em suas páginas.</p>
                                </LabelCheckbox>
                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar Verba Compartilhada'
                                        checked={data.sharedMedia}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, sharedMedia: bol }))}
                                    />
                                    <p>Ativa o módulo de lançamento de verbas compartilhada de mídia para as unidades.</p>
                                </LabelCheckbox>
                            </div>
                        </>
                    }

                    {tab === 'solicitacions' &&
                        <>
                            <div className='head-area'>
                                <h2>Solicitações</h2>
                            </div>
                            <div className='column-input'>
                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar Solicitações'
                                        checked={data.tickets}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, tickets: bol }))}
                                    />
                                    <p>Ativa o módulo de solitações, onde os clientes podem abrir tickets para solicitar novas artes.</p>
                                </LabelCheckbox>
                            </div>

                            {data.tickets &&
                                <>
                                    <div className='head-area'>
                                        <h2>Opções</h2>
                                    </div>
                                    <div className='column-input'>
                                        {id &&
                                            <LabelCheckbox>
                                                <InputCheckbox
                                                    label='Desativar visualizar tickets da unidade'
                                                    checked={data.tickets_userview}
                                                    loading={loading}
                                                    onChange={(bol) => setData((prev) => ({ ...prev, tickets_userview: bol }))}
                                                />
                                                <p>Usuário só poderá visualizar tickets que ele mesmo criou.</p>
                                            </LabelCheckbox>
                                        }

                                        <LabelCheckbox>
                                            <InputCheckbox
                                                label='Habilitar prazo de Entrega'
                                                checked={tickets_deadline}
                                                loading={loading}
                                                onChange={(bol) => {
                                                    setData((prev) => ({ ...prev, tickets_deadline: 0 }))
                                                    setTickets_deadline(bol)
                                                }}
                                            />
                                        </LabelCheckbox>

                                        {tickets_deadline &&
                                            <InputDefault
                                                label='Prazo de Entrega'
                                                description={`O prazo de entrega é considerado em dias.`}
                                                value={data?.tickets_deadline || ''}
                                                type='number'
                                                onChange={(e) => setData({ ...data, tickets_deadline: Number(e.target.value) })}
                                                icon={<IconCalendarDay />}
                                                loading={loading}
                                            />
                                        }

                                        {id &&
                                            <LabelCheckbox>
                                                <InputCheckbox
                                                    label='Ativar Mensagem de Limite de Horas'
                                                    checked={data.allow_hour_limit}
                                                    loading={loading}
                                                    onChange={(bol) => setData((prev) => ({ ...prev, allow_hour_limit: bol }))}
                                                />
                                                <p>Configura uma mensagem para ser exibida caso o cliente atinja o limite de horas de trabalho</p>
                                            </LabelCheckbox>
                                        }

                                        {data.allow_hour_limit &&
                                            <ContainerEditorStatic>
                                                <EditorTextSlash
                                                    value={data.tickets_hourlimitreached}
                                                    onChange={(value) => setData((prev) => ({ ...prev, tickets_hourlimitreached: value }))}
                                                />
                                            </ContainerEditorStatic>
                                        }
                                    </div>
                                </>
                            }
                        </>
                    }

                    {tab === 'privacity' &&
                        <>
                            <div className='head-area'>
                                <h2>Privacidade & Cookies</h2>
                            </div>
                            <div className='column-input'>
                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar Aviso de Cookies'
                                        checked={data.cookiejar}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, cookiejar: bol }))}
                                    />
                                    <p>Exibe na tela de login o aviso de política de cookies conforme pede a LGPD</p>
                                </LabelCheckbox>

                                <LabelCheckbox>
                                    <InputCheckbox
                                        label='Ativar Política de Privacidade Customizada'
                                        checked={data.termset}
                                        loading={loading}
                                        onChange={(bol) => setData((prev) => ({ ...prev, termset: bol }))}
                                    />
                                    <p>Por padrão, o sistema usa o seguinte os seguintes termos: Política de Privacidade</p>
                                    <p>Marque essa opção caso queira definir um política customizada para sua área do cliente</p>
                                </LabelCheckbox>

                                {data.termset &&
                                    <ContainerEditorStatic>
                                        <EditorTextSlash
                                            value={data.privacyterms ?? ''}
                                            onChange={(value) => setData((prev) => ({ ...prev, privacyterms: value }))}
                                        />
                                    </ContainerEditorStatic>
                                }
                            </div>
                        </>
                    }

                    {tab === 'pricing' &&
                        <>
                            <div className='head-area'>
                                <h2>Precificação</h2>
                            </div>
                            <div className='column-input gap-20'>
                                <InputDefault
                                    label='Código de Cliente do Asaas'
                                    value={data?.asaas_id || ''}
                                    onChange={(e) => setData({ ...data, asaas_id: Number(e.target.value) })}
                                    icon={<IconTextRename />}
                                    loading={loading}
                                />
                            </div>
                        </>
                    }


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

const CardUploadToggle = (
    {
        loading,
        label,
        type,
        description,
        url,
        tenant,
        onChange
    }:
        {
            type: string;
            loading: boolean,
            label: string,
            description: string,
            url?: string,
            tenant?: ITenant;
            onChange(file: File, url: string): void
        }) => {

    return (
        <S.CardUploadToggle>
            <div className='render-image'>
                {type === 'tenant' ?
                    <>
                        {loading ?
                            <Skeleton width='45px' height='45px' borderRadius='0.75rem' />
                            :
                            <AvatarTenant
                                name={tenant?.name ?? ''}
                                colorBg={tenant?.colormain ?? ''}
                                color={tenant?.colorhigh ?? ''}
                                colorText={tenant?.colorsecond ?? ''}
                                image={tenant?.images?.touch ?? ''}
                                size='small'
                            />
                        }
                    </>
                    :
                    <div className={`render-preview ${type}`} style={{ backgroundImage: `url(${url})` }}>
                        {loading && <Skeleton width='100%' height='100%' />}
                    </div>
                }
            </div>
            <div className='buttons'>
                <p className='title'>
                    {label}
                </p>

                <ButtonUpload
                    onChange={onChange}
                    icon={<IconImage />}
                    variant="dark"
                    label={`Alterar`}
                />
                <p className='description'>{description}</p>
            </div>
        </S.CardUploadToggle>
    )
}