import { useEffect, useState, type ReactNode } from 'react';
import { SubmenuSelect, type ISubmenuSelect } from '../../submenu-select';
import * as S from './styles'
import { IconCheck, IconCheckboxOff, IconCheckboxOn, IconChevronDown, IconLoading, IconRefresh } from '../../../../assets/icons';

interface IProps {
    loading?: boolean;
    label?: string;
    description?: string;
    search?: boolean;
    icon?: ReactNode;
    iconFont?: string;
    selecteds: IOptionSelect[];
    onChange(value: IOptionSelect[]): void;
    options: IOptionSelect[]
    position?: 'left' | 'right'
    onRefresh?(): void;
}

export interface IOptionSelect {
    value: string;
    name: string;
    avatar?: string;
    iconFont?: string;
    required?: boolean;
}

export const SelectMultiple = ({ onRefresh, position = 'left', loading, label, description, search, icon, iconFont, selecteds, options, onChange }: IProps) => {

    const [optionsInternal, setOptionsInternal] = useState<ISubmenuSelect[]>([]);
    const [fullOptions, setFullOptions] = useState<ISubmenuSelect[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const onChangeInternal = ({ name, value }: {
        name: string;
        value: any;
    }) => {
        if (selecteds.filter((obj) => obj.value === value).length) {
            onChange(selecteds.filter((obj) => obj.value !== value))
        } else {
            selecteds.push({
                value, name
            })
            onChange(selecteds)
        }
    }

    useEffect(() => {
        const newOptions: ISubmenuSelect[] = options.map((item) => ({
            name: item.name,
            icon: selecteds.filter((obj) => obj.value === item.value).length ? <IconCheck /> : null,
            avatar: item.avatar,
            iconFont: item.iconFont,
            required: item.required,
            onClick: () => onChangeInternal({
                name: item.name,
                value: item.value,
            })
        }));

        setFullOptions(newOptions);
        //setOptionsInternal(newOptions);
    }, [selecteds, options]);

    useEffect(() => {
        const filtered = fullOptions.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setOptionsInternal(filtered);
    }, [searchTerm, fullOptions]);

    const handleOnSearch = (value: string) => {
        setSearchTerm(value);
    };

    const selectedsJoin = selecteds.map(item => item.name || '').filter(Boolean).join(', ');
    const placeholder = selectedsJoin === '' ? label ? label : 'Nenhuma opção selecionada' : selectedsJoin

    return (
        <SubmenuSelect
            label={label}
            description={description}
            loading={loading}
            closeOnSelected={false}
            position={position}
            submenu={optionsInternal}
            childrenRight={(!loading) &&
                <S.ContainerRightOptions>
                    {optionsInternal.length !== selecteds.length &&
                        <button type='button' data-tooltip-id="tooltip" data-tooltip-content="Marcar todos" onClick={() => onChange(options.map((item) => {
                            return {
                                name: item.name,
                                value: item.value
                            }
                        }))}>
                            <IconCheckboxOff />
                        </button>
                    }
                    {selecteds.length > 0 &&
                        <button type='button' data-tooltip-id="tooltip" data-tooltip-content="Desmarcar todos" onClick={() => onChange(options.filter((obj) => obj.required === true))}>
                            <IconCheckboxOn />
                        </button>
                    }

                    {!loading && onRefresh &&
                        <button type='button' data-tooltip-id="tooltip" data-tooltip-content="Atualizar" onClick={() => onRefresh && onRefresh()}>
                            <IconRefresh />
                        </button>
                    }

                </S.ContainerRightOptions>
            }
        >
            <S.Container>
                <div className='input-select'>
                    {icon &&
                        <i className='icon-svg'>
                            {icon}
                        </i>
                    }
                    {loading &&
                        <i className='icon-svg'>
                            <IconLoading />
                        </i>
                    }
                    {iconFont &&
                        <div className='icon-font'>
                            <i className={`fa fa-${iconFont}`} />
                        </div>
                    }
                    {search ? <input disabled={loading} value={searchTerm} placeholder={loading ? 'Carregando...' : placeholder} onChange={(e) => handleOnSearch(e.target.value)} /> : <span>{placeholder}</span>}
                    <i className='icon-svg'>
                        <IconChevronDown />
                    </i>
                </div>
            </S.Container>
        </SubmenuSelect >
    )
}
