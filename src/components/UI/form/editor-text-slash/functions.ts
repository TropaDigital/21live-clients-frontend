import { Editor } from '@tiptap/react';

// Função para atualizar a posição do menu flutuante
export const getHorizontalMenuPosition = (
  editor: Editor,
  containerRef: React.RefObject<HTMLDivElement>,
  menuRef: React.RefObject<HTMLDivElement>
) => {
  if (!editor || !containerRef.current || !menuRef.current) return { top: 0, left: 0 };

  const { state } = editor;
  const { from, to } = state.selection;
  const startCoords = editor.view.coordsAtPos(from); // Coordenadas do início da seleção
  const endCoords = editor.view.coordsAtPos(to); // Coordenadas do fim da seleção
  const containerRect = containerRef.current.getBoundingClientRect();
  const menuRect = menuRef.current.getBoundingClientRect();

  // Calcular o centro horizontal do texto selecionado
  const centerLeft = (startCoords.left + endCoords.left) / 2 - containerRect.left + window.scrollX;

  // Calcular a posição vertical (priorizar acima do texto selecionado)
  const offsetTop = startCoords.top - containerRect.top + window.scrollY;

  // Verificar se o menu ultrapassa a parte superior da tela
  const spaceAbove = offsetTop - menuRect.height - 20; // 20px de margem

  // Se não houver espaço acima, posicionar abaixo do texto
  const top =
    spaceAbove < 0
      ? offsetTop + 40 // Posicionar abaixo
      : offsetTop - menuRect.height - 20; // Posicionar acima

  // Verificar se o menu ultrapassa a parte direita da tela
  const viewportWidth = window.innerWidth;
  const spaceRight = viewportWidth - (centerLeft + menuRect.width / 2);

  // Ajustar a posição horizontal se ultrapassar os limites
  const left =
    spaceRight < 0
      ? centerLeft + spaceRight // Ajustar para a esquerda
      : centerLeft - menuRect.width / 2 < 0
      ? 0 // Ajustar para a direita
      : centerLeft - menuRect.width / 2; // Centralizar

  return { top, left };
};

export const getVerticalMenuPosition = (
  editor: Editor,
  containerRef: React.RefObject<HTMLDivElement>,
  menuRef: React.RefObject<HTMLDivElement>
) => {
  if (!editor || !containerRef.current || !menuRef.current) return { top: 0, left: 0 };

  const { from } = editor.state.selection;
  const { top: cursorTop, left: cursorLeft } = editor.view.coordsAtPos(from);
  const containerRect = containerRef.current.getBoundingClientRect();
  const menuRect = menuRef.current.getBoundingClientRect();

  // Coordenadas relativas ao contêiner
  const relativeTop = cursorTop - containerRect.top;
  const relativeLeft = cursorLeft - containerRect.left;

  // Verificar se o menu ultrapassa a parte inferior do contêiner
  const spaceBelow = containerRect.height - (relativeTop + menuRect.height);
  const top = spaceBelow < 0 ? relativeTop - menuRect.height - 10 : relativeTop - 15; // 10px de margem

  // Verificar se o menu ultrapassa a parte direita do contêiner
  const spaceRight = containerRect.width - (relativeLeft + menuRect.width);
  const left = spaceRight < 0 ? relativeLeft + spaceRight - 10 : relativeLeft; // 10px de margem

  return { top, left };
};

// Função para executar um comando
export const executeCommand = (editor: Editor, command: string, options?: any) => {
  if (!editor) return;

  // Apagar o "/" que foi digitado
  const { state } = editor;
  const { selection } = state;
  const text = state.doc.textBetween(selection.from - 1, selection.from, '\n');

  if (text === '/') {
    editor
      .chain()
      .focus()
      .deleteRange({ from: selection.from - 1, to: selection.from })
      .run();
  }

  // Executar o comando selecionado
  switch (command) {
    case 'p':
      editor.chain().focus().setParagraph().run();
      break;
    case 'h1':
      editor.chain().focus().setHeading({ level: 1 }).run();
      break;
    case 'h2':
      editor.chain().focus().setHeading({ level: 2 }).run();
      break;
    case 'h3':
      editor.chain().focus().setHeading({ level: 3 }).run();
      break;
    case 'bold':
      editor.chain().focus().toggleBold().run();
      break;
    case 'italic':
      editor.chain().focus().toggleItalic().run();
      break;
    case 'bulletList':
      editor.chain().focus().toggleBulletList().run();
      break;
    case 'orderedList':
      editor.chain().focus().toggleOrderedList().run();
      break;
    case 'table':
      editor
        .chain()
        .focus()
        .insertTable({
          rows: options?.rows || 3,
          cols: options?.cols || 3,
          withHeaderRow: true
        })
        .run();
      break;
    case 'image':
      editor.chain().focus().setImage({ src: options.url }).run();
      break;
    case 'youtube':
      setTimeout(() => {
        editor
          .chain()
          .focus()
          .setYoutubeVideo({
            src: options.url,
            width: Math.max(320, parseInt(options.width, 10)) || 640,
            height: Math.max(180, parseInt(options.height, 10)) || 480
          })
          .run();
      }, 100);
      break;
    case 'taskList':
      editor.chain().focus().toggleTaskList().run();
      break;
    case 'blockquote':
      editor.chain().focus().toggleBlockquote().run();
      break;
    case 'code':
      editor.chain().focus().toggleCodeBlock().run();
      break;
    default:
      break;
  }
};
