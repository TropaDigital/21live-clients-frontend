import { IconVideo } from '../../../../assets/icons';
import { IconCode, IconH1, IconH2, IconH3, IconListBullet, IconListCheck, IconListNumber, IconParagraph, IconQuoteBlock, IconTable } from './icons';

export interface Command {
  command?: string;
  commandInternal?: string;
  label: string;
  description: string;
  icon?: any;
  sub?: CommandSub[]
}

export interface CommandSub {
  label: string
  commandInternal: string;
}

// Lista de comandos disponíveis
export const commands: Command[] = [
  {
    command: 'p',
    label: 'Parágrafo',
    description: 'Insere um parágrafo de texto.',
    icon: <IconParagraph />
  },
  {
    command: 'h1',
    label: 'Título 1',
    description: 'Insere um título de nível 1 (maior destaque).',
    icon: <IconH1 />
  },
  {
    command: 'h2',
    label: 'Título 2',
    description: 'Insere um título de nível 2 (destaque intermediário).',
    icon: <IconH2 />
  },
  {
    command: 'h3',
    label: 'Título 3',
    description: 'Insere um título de nível 3 (menor destaque).',
    icon: <IconH3 />
  },
  {
    commandInternal: 'youtube',
    label: 'Youtube',
    description: 'Insere um vídeo do youtube.',
    icon: <IconVideo />
  },
  {
    command: 'bulletList',
    label: 'Lista com Marcadores',
    description: 'Cria uma lista com marcadores (pontos).',
    icon: <IconListBullet />
  },
  {
    command: 'orderedList',
    label: 'Lista Numerada',
    description: 'Cria uma lista numerada (1, 2, 3...).',
    icon: <IconListNumber />
  },
  {
    command: 'taskList', // Novo comando para checklist
    label: 'Checklist',
    description: 'Cria uma lista de tarefas com caixas de seleção.',
    icon: <IconListCheck />
  },
  {
    command: 'blockquote', // Novo comando para citação
    label: 'Citação',
    description: 'Insere um bloco de citação destacado.',
    icon: <IconQuoteBlock />
  },
  {
    commandInternal: 'table',
    label: 'Tabela',
    description: 'Insere uma tabela com linhas e colunas.',
    icon: <IconTable />
  },
  {
    command: 'code',
    label: 'Código',
    description: 'Insere um bloco de código com syntax highlighting.',
    icon: <IconCode />
  }
];
