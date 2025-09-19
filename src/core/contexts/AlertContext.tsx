import React, { createContext, useContext, useState, type ReactNode } from 'react';

import { ModalAlert, type IPropsTypeModalAlert } from '../../components/UI/modal/modal-alert';


// Definição da interface para o contexto do Alert
interface AlertContextType {
    addAlert(type: IPropsTypeModalAlert, title: string, description: string, duration?: number): void;
}

// Criação do contexto com um valor inicial de null
const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
    children: ReactNode;
}

interface IPropsModalAlert {
    title: string;
    description: string;
    opened: boolean;
    type: IPropsTypeModalAlert;
    duration: number
}

// Provider que gerencia o alert e os eventos
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {


    const [modalAlert, setModalAlert] = useState<IPropsModalAlert>({
        opened: false,
        title: '',
        description: '',
        type: 'error',
        duration: 0,
    })

    const addAlert = (type: IPropsTypeModalAlert, title: string, description: string, time?: number) => {
        setModalAlert({
            type,
            title,
            description,
            opened: true,
            duration: time ? time : 5000
        })
    }

    return (
        <AlertContext.Provider value={{
            addAlert
        }}>
            <ModalAlert
                title={modalAlert.title}
                description={modalAlert.description}
                type={modalAlert.type}
                opened={modalAlert.opened}
                onConfirm={() => setModalAlert({ ...modalAlert, opened: false })}
                duration={modalAlert.duration}
            />
            {children}
        </AlertContext.Provider>
    );
};

// Hook personalizado para acessar o alert de qualquer componente
export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert deve ser usado dentro de um AlertProvider');
    }
    return context;
};