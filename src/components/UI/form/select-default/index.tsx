import { useEffect, useState, type ReactNode } from 'react';
import { SubmenuSelect, type ISubmenuSelect } from '../../submenu-select';
import * as S from './styles'
import { IconCheck, IconChevronDown, IconLoading } from '../../../../assets/icons';

interface IProps {
    label?: string;
    description?: string;
    search?: boolean;
    icon?: ReactNode;
    iconFont?: string;
    value: IOption;
    isValidEmpty?: string;
    onChange(value: IOption): void;
    options: IOption[]
    loading?: boolean;
    disabled?: boolean;
}

interface IOption {
    value: string;
    name: string;
    iconFont?: string;
    avatar?: string | null;
}

export const SelectDefault = ({ loading, disabled, label, description, search, icon, iconFont, value, isValidEmpty, options, onChange }: IProps) => {

    const [optionsInternal, setOptionsInternal] = useState<ISubmenuSelect[]>([]);
    const [fullOptions, setFullOptions] = useState<ISubmenuSelect[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const OPTION_EMPTY = isValidEmpty ? isValidEmpty : 'Nenhuma opção'

    const onChangeInternal = (value: string | null) => {
        if (value) {
            onChange(options.filter((obj) => obj.name === value)[0])
        } else {
            onChange({
                value: '',
                name: OPTION_EMPTY
            })
        }
    }

    useEffect(() => {

        const newOptions: ISubmenuSelect[] = []

        if (isValidEmpty) {
            newOptions.push({
                name: OPTION_EMPTY,
                icon: !value.value ? <IconCheck /> : null,
                onClick: () => onChangeInternal(null)
            })
        }

        options.map((item) => (newOptions.push({
            name: item.name,
            avatar: item.avatar ?? undefined,
            icon: value.value === item.value ? <IconCheck /> : null,
            iconFont: item.iconFont,
            onClick: () => onChangeInternal(item.name)
        })));

        setFullOptions(newOptions);
        setOptionsInternal(newOptions);
    }, [value, options]);


    useEffect(() => {
        const filtered = fullOptions.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setOptionsInternal(filtered);
    }, [searchTerm, fullOptions]);

    const handleOnSearch = (value: string) => {
        setSearchTerm(value);
    };

    return (
        <SubmenuSelect disabled={disabled} loading={loading} description={description} label={label} onSelected={() => setSearchTerm("")} position='left' submenu={optionsInternal}>
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
                    {search ? <input value={searchTerm} placeholder={loading ? 'Carregando...' : value.name} onChange={(e) => handleOnSearch(e.target.value)} /> : <span>{value?.name}</span>}
                    <i className='icon-svg'>
                        <IconChevronDown />
                    </i>
                </div>
            </S.Container>
        </SubmenuSelect>
    )
}
