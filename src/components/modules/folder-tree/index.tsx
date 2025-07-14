import { useState } from 'react';
import * as S from './styles'
import { IconChevronDown } from '../../../assets/icons';
import { useTenant } from '../../../core/contexts/TenantContext';
import { LoadingTree } from './loading';

export interface IFolderTree {
    folder_id: number | null;
    parent_id: number | null;
    name: string;
    icon: string;
    access: string;
    children?: IFolderTree[];
    [key: string]: any;
};

export const FolderTree = ({ folder_id, onChange, data, loading }: { onChange(id: number): void; data: Record<string, IFolderTree[]>; folder_id: number; loading: boolean }) => {

    function buildFolderTree(items: Record<string, IFolderTree[]>): IFolderTree[] {
        const buildNode = (parentId: string): IFolderTree[] => {
            const folders = items[parentId] || [];

            return folders.map(folder => ({
                ...folder,
                parent_id: parentId === "0" ? null : Number(parentId), // ou deixe como string se for string
                children: buildNode(String(folder.folder_id))
            }));
        };

        const rootChildren = buildNode("0");

        const root: IFolderTree = {
            folder_id: null,
            parent_id: null,
            name: "Raiz",
            icon: "home",
            access: 'public',
            children: rootChildren,
        };

        return [root];
    }

    const tree = data ? buildFolderTree(data) : [];

    return (
        <S.Container>
            {loading &&
                <LoadingTree quantity={"random"} />
            }
            {!loading && tree.map(folder => (
                <FolderItem onChange={onChange} folder_id={folder_id} key={folder.folder_id} folder={folder} level={0} />
            ))}
        </S.Container>
    )
}

const FolderItem = ({ onChange, folder_id, folder, level }: {
    folder_id: number;
    folder: IFolderTree,
    level: number
    onChange(id: number | null): void;
}) => {

    const { tenant } = useTenant();

    function hasChildWithId(node: IFolderTree, targetId: number | null): boolean {
        if (!node.children || node.children.length === 0) return false;

        for (const child of node.children) {
            if (child.folder_id === targetId || hasChildWithId(child, targetId)) {
                return true;
            }
        }

        return false;
    }

    const [opened, setOpened] = useState(folder_id === folder.folder_id
        || level === 0
        || hasChildWithId(folder, folder_id))

    return (
        <S.ItemWrapper color={tenant?.colorhigh}>
            <div className={`folder ${opened ? 'opened' : 'closed'} ${folder.children && folder.children.length > 0 ? 'children-folder' : 'empty-folder'} ${folder_id === folder.folder_id ? 'active' : 'normal'}`} color={tenant?.colorhigh}>
                <button className='children-open' onClick={() => setOpened(!opened)}>
                    {folder.children && folder.children.length > 0 &&
                        <IconChevronDown />
                    }
                </button>
                <div onClick={() => onChange(folder.folder_id)} className='icon'>
                    <i className={`fa fa-${folder.icon}`} />
                </div>
                <span onClick={() => onChange(folder.folder_id)}>{folder.name}</span>
            </div>

            {opened && folder.children && folder.children.length > 0 && (
                <div className='children'>
                    {folder.children.map(child => (
                        <FolderItem onChange={onChange} folder_id={folder_id} key={child.folder_id} folder={child} level={level + 1} />
                    ))}
                </div>
            )}
        </S.ItemWrapper>
    );
};