import {
    IconArchive,
    IconFolder,
    IconTrash,
    IconUpload,
} from '../../../../assets/icons';
import { ButtonDefault } from '../button-default';
import * as S from './styles';
import React, { useEffect, useRef, useState } from 'react';

const FILE_ACCEPTED_EXTENSIONS = [
    '.jpg', '.png', '.bmp', '.gif', '.pdf', '.avi', '.mp3', '.mp4', '.mov',
    '.doc', '.docx', '.ppt', '.pptx', '.ppsm', '.ppsx', '.xls', '.xlsx',
    '.psd', '.ai', '.cdr', '.zip', '.rar', '.indd', '.txt', '.ttf', '.otf',
    '.stl', '.obj', '.dwg',
];

type ErrorMap = Record<string, string>;

export interface UploadResult {
    files: IFileInputUpload[];
    folders: string[];
};

export interface IFileInputUpload {
    file: File;
    folder: string;
}

type InputUploadAdvancedProps = {
    value?: UploadResult | null;
    label?: string;
    accept?: string[];
    typeFile: 'file' | 'folder';
    multiple?: boolean;
    maxSizeMB?: number;
    disabled?: boolean;
    onChange: (data: UploadResult | null) => void;
};

type FolderMap = Record<string, File[]>;

export const InputUpload: React.FC<InputUploadAdvancedProps> = ({
    value,
    disabled,
    label = 'Selecionar arquivo(s)',
    accept,
    typeFile = 'file',
    multiple,
    maxSizeMB = 20,
    onChange,
}) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [errors, setErrors] = useState<ErrorMap>({});

    const ACCEPTED_EXTENSIONS = accept ? accept : FILE_ACCEPTED_EXTENSIONS;

    const [folderMap, setFolderMap] = useState<FolderMap>({});

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const triggerInput = () => inputRef.current?.click();

    useEffect(() => {
        if (!value || !value.files?.length) {
            setFolderMap({});
            setErrors({});
            return;
        }

        const newMap: FolderMap = {};
        const newErrors: ErrorMap = {};

        value.files.forEach(({ file, folder }) => {
            const ext = '.' + file.name.split('.').pop()?.toLowerCase();

            if (typeFile === 'file' && !ACCEPTED_EXTENSIONS.includes(ext)) {
                newErrors[file.name] = `Tipo de arquivo não suportado: ${file.name}`;
            } else if (file.size > maxSizeBytes) {
                newErrors[file.name] = `O arquivo "${file.name}" excede o limite de ${maxSizeMB}MB.`;
            }

            if (!newMap[folder]) newMap[folder] = [];
            newMap[folder].push(file);
        });

        setFolderMap(newMap);
        setErrors(newErrors);
    }, [value]);

    const formatSize = (bytes: number) => {
        const sizeInKB = bytes / 1024;
        return sizeInKB > 1024
            ? `${(sizeInKB / 1024).toFixed(2)} MB`
            : `${sizeInKB.toFixed(0)} KB`;
    };

    const groupFilesByFolder = (files: File[]): FolderMap => {
        const map: FolderMap = {};
        for (const file of files) {
            const path = file.webkitRelativePath || file.name;
            const folder = path.includes('/')
                ? path.split('/').slice(0, -1).join('/')
                : '/';
            if (!map[folder]) map[folder] = [];
            map[folder].push(file);
        }
        return map;
    };

    const getAllFoldersFromPaths = (files: File[]) => {
        const folderSet = new Set<string>();

        for (const file of files) {
            const path = file.webkitRelativePath;
            if (!path) continue;

            const parts = path.split('/');
            // remove o nome do arquivo
            parts.pop();

            let currentPath = '';
            for (const part of parts) {
                currentPath = currentPath ? `${currentPath}/${part}` : part;
                folderSet.add(currentPath);
            }
        }

        return Array.from(folderSet);
    };

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;

        const files = Array.from(fileList);

        const newErrors: ErrorMap = {};
        const allFilesWithFolder: { file: File; folder: string }[] = [];
        const validFilesWithFolder: { file: File; folder: string }[] = [];

        for (const file of files) {
            const ext = '.' + file.name.split('.').pop()?.toLowerCase();
            const path = file.webkitRelativePath || file.name;
            const folder = path.includes('/')
                ? path.split('/').slice(0, -1).join('/')
                : '/';

            allFilesWithFolder.push({ file, folder }); // adiciona todos à lista

            if (!ACCEPTED_EXTENSIONS.includes(ext)) {
                newErrors[file.name] = `Tipo de arquivo não suportado: ${file.name}`;
                continue;
            }

            if (file.size > maxSizeBytes) {
                newErrors[file.name] = `O arquivo "${file.name}" excede o limite de ${maxSizeMB}MB.`;
                continue;
            }

            validFilesWithFolder.push({ file, folder });
        }

        // Atualiza folderMap com todos os arquivos (válidos e inválidos)
        const groupedAll = groupFilesByFolder(allFilesWithFolder.map(f => f.file));
        setFolderMap(groupedAll);
        setErrors(newErrors);

        if (validFilesWithFolder.length > 0) {
            const folders = getAllFoldersFromPaths(files);
            onChange({
                files: validFilesWithFolder,
                folders,
            });
        } else {
            onChange(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const emitChangeFromMap = (map: FolderMap) => {
        const allFilesWithFolders: { file: File; folder: string }[] = [];

        Object.entries(map).forEach(([folder, files]) => {
            files.forEach(file => {
                const ext = '.' + file.name.split('.').pop()?.toLowerCase();

                if (
                    typeFile === 'file' &&
                    (!ACCEPTED_EXTENSIONS.includes(ext) || file.size > maxSizeBytes)
                ) {
                    return;
                }

                allFilesWithFolders.push({ file, folder });
            });
        });

        if (allFilesWithFolders.length > 0) {
            const folders = [...new Set(allFilesWithFolders.map(f => f.folder))];
            onChange({ files: allFilesWithFolders, folders });
        } else {
            onChange(null);
        }
    };

    const handleRemoveFolder = (folderName: string) => {
        const newMap = { ...folderMap };
        delete newMap[folderName];
        setFolderMap(newMap);
        emitChangeFromMap(newMap);
    };

    const handleRemoveFile = (folderName: string, fileName: string) => {
        const newMap = { ...folderMap };
        if (!newMap[folderName]) return;

        newMap[folderName] = newMap[folderName].filter(file => file.name !== fileName);
        if (newMap[folderName].length === 0) {
            delete newMap[folderName];
        }

        setFolderMap(newMap);

        const newErrors = { ...errors };
        delete newErrors[fileName];
        setErrors(newErrors);

        emitChangeFromMap(newMap);
    };

    return (
        <S.Container
            className={`upload-zone ${typeFile !== 'folder' ? 'drop-zone' : ''}`}
            onDrop={typeFile !== 'folder' ? handleDrop : undefined}
            onDragOver={typeFile !== 'folder' ? handleDragOver : undefined}
        >
            <i>
                <IconUpload />
            </i>
            <p className="title">{label}</p>

            <div className="infos-upload">
                {typeFile === 'file' && (
                    <p className="accept">
                        {ACCEPTED_EXTENSIONS.join(', ')}
                    </p>
                )}
                <p className="maxsize">{maxSizeMB} MB</p>
            </div>

            <ButtonDefault disabled={disabled} type="button" onClick={triggerInput}>
                Escolher {typeFile === 'file' ? `Arquivo${multiple ? 's' : ''}` : `Pasta`}
            </ButtonDefault>

            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                multiple={typeFile === 'folder' ? true : multiple}
                onChange={(e) => handleFiles(e.target.files)}
                accept={typeFile === 'file' ? ACCEPTED_EXTENSIONS.join(',') : undefined}
                {...(typeFile === 'folder'
                    ? ({ webkitdirectory: 'true', directory: 'true' } as any)
                    : {})}
            />

            {Object.keys(folderMap).length > 0 && (
                <ul className="list-files">
                    {Object.entries(folderMap).map(([folder, files], index) => (
                        <li key={index} className="folder-group">
                            {typeFile === 'folder' && (
                                <div className="folder-header">
                                    <i>
                                        <IconFolder />
                                    </i>
                                    <strong data-tooltip-place="left" data-tooltip-id="tooltip" data-tooltip-content={folder}>{folder === '/' ? 'Arquivos soltos' : folder}</strong>
                                    <button onClick={() => handleRemoveFolder(folder)}>
                                        <IconTrash />
                                    </button>
                                </div>
                            )}
                            <ul className="files-inside">
                                {files.map((file, i) => (
                                    <li key={i}>
                                        <div className={`file ${errors[file.name] ? 'has-error' : 'no-error'}`}>
                                            <i>
                                                <IconArchive />
                                            </i>
                                            <div className="infos-file">
                                                <span className="name" data-tooltip-place="left" data-tooltip-id="tooltip" data-tooltip-content={file.name}>{file.name}</span>
                                                <span className="size">{formatSize(file.size)}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFile(folder, file.name)}
                                                title="Remover arquivo"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                        {errors[file.name] && (
                                            <p className="error">{errors[file.name]}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </S.Container>
    );
};
