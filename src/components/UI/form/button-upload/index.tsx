import { useRef } from "react";
import { ButtonDefault } from "../button-default"

interface IProps {
    onChange(file: File, url: string): void;
    label: string;
    icon: React.ReactNode;
    variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'lightWhite'
    | 'dark'
    | 'blocked'
}

export const ButtonUpload = ({ onChange, label, icon, variant }: IProps) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const tempURL = URL.createObjectURL(file);
            onChange(file, tempURL)
        }
    };

    return (
        <>
            <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <ButtonDefault
                variant={variant}
                type='button'
                icon={icon}
                onClick={handleOpenFilePicker}
            >
                {label}
            </ButtonDefault>
        </>
    )
}