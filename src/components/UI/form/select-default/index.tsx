import { useEffect, useState, type ReactNode } from 'react';
import { SubmenuSelect, type ISubmenuSelect } from '../../submenu-select';
import * as S from './styles'
import { IconCheck, IconChevronDown } from '../../../../assets/icons';

interface IProps {
    label?: string;
    search?: boolean;
    icon?: ReactNode;
    iconFont?: string;
    value: IOption;
    onChange(value: IOption): void;
    options: IOption[]
}

interface IOption {
    value: string;
    name: string;
    iconFont?: string;
}

export const SelectDefault = ({ label, search, icon, iconFont, value, options, onChange }: IProps) => {

    const [optionsInternal, setOptionsInternal] = useState<ISubmenuSelect[]>([]);
    const [fullOptions, setFullOptions] = useState<ISubmenuSelect[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const onChangeInternal = (value: string) => {
        onChange(options.filter((obj) => obj.name === value)[0])
    }

    useEffect(() => {
        const newOptions: ISubmenuSelect[] = options.map((item) => ({
            name: item.name,
            icon: value.value === item.value ? <IconCheck /> : null,
            iconFont: item.iconFont,
            onClick: () => onChangeInternal(item.name)
        }));

        setFullOptions(newOptions);
        setOptionsInternal(newOptions);
    }, [value, options]);

    useEffect(() => {
        const newOptions: ISubmenuSelect[] = [];

        options.map((item) => {
            newOptions.push({
                name: item.name,
                icon: value.value === item.value ? <IconCheck /> : null,
                iconFont: item.iconFont,
                onClick: () => onChangeInternal(item.name)
            })
        })

        setOptionsInternal([...newOptions])
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
        <SubmenuSelect label={label} onSelected={() => setSearchTerm("")} position='left' submenu={optionsInternal}>
            <S.Container>
                <div className='input-select'>
                    {icon &&
                        <i className='icon-svg'>
                            {icon}
                        </i>
                    }
                    {iconFont &&
                        <div className='icon-font'>
                            <i className={`fa fa-${iconFont}`} />
                        </div>
                    }
                    {search ? <input value={searchTerm} placeholder={value.name} onChange={(e) => handleOnSearch(e.target.value)} /> : <span>{value?.name}</span>}
                    <i className='icon-svg'>
                        <IconChevronDown />
                    </i>
                </div>
            </S.Container>
        </SubmenuSelect>
    )
}
