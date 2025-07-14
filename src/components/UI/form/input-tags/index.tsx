import { useState, type ReactNode } from 'react'
import { InputDefault } from '../input-default'
import * as S from './styles'
import { IconTag, IconTrash } from '../../../../assets/icons'

export const InputTags = ({ label, placeholder, icon, tags, onChange }: { label: string; placeholder: string; icon: ReactNode; tags?: string, onChange(tags: string): void }) => {

    const [tag, setTag] = useState('')

    const onChangeTags = (value: string) => {
        // Se digitar vírgula, adiciona a tag
        if (value.includes(',')) {
            const newTag = value.replace(',', '').trim();

            if (!newTag) return; // ignora se for vazio

            const existingTags = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];

            // Evita duplicatas
            if (!existingTags.includes(newTag)) {
                existingTags.push(newTag);
                onChange(existingTags.join(','));
            }
            setTag('');
        } else {
            setTag(value);
        }
    };

    const removeTag = (indice: number) => {

        if (tags) {
            let tagArray = tags.split(',');
            let tagArrayNew: string[] = [];

            tagArray.forEach((item: string, index: number) => {
                if (index !== indice) {
                    tagArrayNew.push(item)
                }
            })

            const tagJoin = tagArrayNew.join(',')
            onChange(tagJoin)
        }
    }

    return (
        <S.Container>

            <InputDefault
                label={label}
                value={tag}
                placeholder={placeholder}
                onChange={(e) => onChangeTags(e.target.value)}
                icon={icon}
            />

            <div className='list-tags'>
                {tags && tags.split(',').map((tag: string, indice: number) => (
                    <div className='tag'>
                        <i>
                            <IconTag />
                        </i>
                        <span>{tag}</span>
                        <button onClick={() => removeTag(indice)}>
                            <IconTrash />
                        </button>
                    </div>
                ))}
            </div>
        </S.Container>
    )
}