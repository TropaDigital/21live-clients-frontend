/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TextAlign } from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Blockquote } from '@tiptap/extension-blockquote';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Youtube from '@tiptap/extension-youtube';
import ImageResize from 'tiptap-extension-resize-image';

import * as S from './styles';
import { commands } from './configs';
import { MenuVertical, MenuHorizontal } from './components';
import { getHorizontalMenuPosition, getVerticalMenuPosition, executeCommand } from './functions';
import { CustomPlaceholder } from './extensions';

import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';
import { Skeleton } from '../../loading/skeleton/styles';

const EditorTextSlash = ({
  projectId,
  value,
  loading,
  layout = 'fixed',
  enableCommands = true,
  onChange
}: {
  projectId?: string;
  value: string;
  loading?: boolean;
  layout?: 'fixed' | 'static';
  enableCommands?: boolean;
  onChange?(value: string): void;
}) => {
  const refContainer = useRef<HTMLDivElement | any>(null);
  const refMenuVertical = useRef<HTMLDivElement | any>(null);
  const refMenuHorizontal = useRef<HTMLDivElement | any>(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [showCommands, setShowCommands] = useState(false);

  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const lowlight = createLowlight(all);
  lowlight.register('html', html);
  lowlight.register('css', css);
  lowlight.register('js', js);
  lowlight.register('ts', ts);

  const editor: any = useEditor({
    extensions: [
      StarterKit,
      ImageResize,
      ImageResize.configure({
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto;' // Estilo base para todas as imagens
        }
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph', 'image', 'tableCell'] }),
      Placeholder.configure({ placeholder: enableCommands ? 'Digite "/" para ver os comandos' : 'Digite aqui' }),
      Underline,
      TextStyle,
      Color,
      Blockquote, // Extensão para citações
      Highlight.configure({ multicolor: true }),
      CustomPlaceholder.configure({
        placeholder: 'Título', // Placeholder para headings
        includeTypes: ['heading'] // Aplicar apenas em headings
      }),
      Image.configure({
        inline: true, // Permite que a imagem seja inline (dentro do texto)
        allowBase64: true, // Permite o uso de imagens em base64
        HTMLAttributes: {
          class: 'editor-image' // Classe opcional para estilização
        }
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null, // Não define valor padrão
              parseHTML: (element) => element.getAttribute('width') || null,
              renderHTML: (attributes) => {
                if (!attributes.width) return {};
                return { width: attributes.width };
              }
            },
            height: {
              default: null, // Não define valor padrão
              parseHTML: (element) => element.getAttribute('height') || null,
              renderHTML: (attributes) => {
                if (!attributes.height) return {};
                return { height: attributes.height };
              }
            }
          };
        }
      }),
      Youtube.configure({
        controls: true,
        nocookie: false,
        allowFullscreen: true
      }),
      CodeBlockLowlight.configure({
        // Extensão para blocos de código
        lowlight,
        defaultLanguage: 'plaintext' // Idioma padrão
      }),
      Link.configure({
        openOnClick: true, // Desabilita a abertura do link ao clicar
        autolink: true, // Habilita a criação automática de links
        HTMLAttributes: {
          target: '_blank', // Abre o link em uma nova aba
          rel: 'noopener noreferrer' // Boa prática de segurança
        }
      }),
      TaskList, // Extensão para lista de tarefas
      TaskItem.configure({
        nested: true, // Permite listas de tarefas aninhadas
        HTMLAttributes: {
          class: 'task-item' // Classe CSS personalizada para os itens da lista
        }
      })
    ],
    content: value?.replaceAll('width="auto"', '').replaceAll('height="auto"', ''),
    editable: onChange ? true : false,
    editorProps: {
      transformPastedHTML(html: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        doc.querySelectorAll('*').forEach((el) => {
          const style = el.getAttribute('style');
          if (style) {
            // Remove only color property, keep others
            const newStyle = style
              .split(';')
              .map((rule) => rule.trim())
              .filter((rule) => rule && !rule.startsWith('color:'))
              .join('; ');

            if (newStyle) {
              el.setAttribute('style', newStyle);
            } else {
              el.removeAttribute('style');
            }
          }
        });

        return doc.body.innerHTML;
      }
    },
    onUpdate: ({ editor }) => {
      console.log('Editor updated:', editor.getHTML());
      onChange && onChange(editor.getHTML()); // Chama onChange sempre que houver mudança
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      setTimeout(() => {

        if (value) {
          editor.commands.setContent(
            value.replaceAll('width="auto"', '').replaceAll('height="auto"', '')
          );
        }
      }, 500);
    }
  }, [value, editor]);

  // Atualizar a posição do menu horizontal
  const updateHorizontalMenuPosition = useCallback(() => {
    if (!editor || !refContainer.current || !refMenuHorizontal.current) return;
    const position = getHorizontalMenuPosition(editor, refContainer, refMenuHorizontal);
    setCursorPosition(position);
  }, [editor]);

  // Monitorar seleção de texto para o menu horizontal
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;

      // Verificar a cor do texto selecionado
      const textColor = editor.getAttributes('textStyle').color || '#000000';
      setTextColor(textColor);

      // Verificar a cor de fundo selecionada
      const backgroundColor = editor.getAttributes('highlight').color || '#ffffff';
      setBackgroundColor(backgroundColor);

      // Mostrar/ocultar o menu flutuante
      if (from !== to) {
        setIsTextSelected(true);
        //setShowCommands(false);
        updateHorizontalMenuPosition();
      } else {
        setIsTextSelected(false);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, updateHorizontalMenuPosition]);

  // Monitorar double click para o menu horizontal
  useEffect(() => {
    if (!editor || !refContainer.current) return;

    const handleDoubleClick = () => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        setIsTextSelected(true);
        setShowCommands(false);
        updateHorizontalMenuPosition();
      }
    };

    const container = refContainer.current;
    container.addEventListener('dblclick', handleDoubleClick);

    return () => {
      container.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [editor, updateHorizontalMenuPosition]);

  // Monitorar "/" para o menu vertical
  useEffect(() => {
    if (!editor) return;

    const handleTransaction = ({ transaction }: any) => {
      const { selection } = transaction;
      const from = selection.from;
      const $pos = selection.$from;
      const startOfLinePos = $pos.before($pos.depth);
      const textBefore = transaction.doc.textBetween(startOfLinePos, from, '\n', '\0');

      if (textBefore.trim() === '/') {
        setShowCommands(true);
        setTimeout(() => {
          const position = getVerticalMenuPosition(editor, refContainer, refMenuVertical);
          setCursorPosition(position);
        }, 0);
      } else {
        setShowCommands(false);
      }
    };

    editor.on('transaction', handleTransaction);

    return () => {
      editor.off('transaction', handleTransaction);
    };
  }, [editor, getVerticalMenuPosition]);

  const onPosition = () => {
    setTimeout(() => {
      const position = getVerticalMenuPosition(editor, refContainer, refMenuVertical);
      setCursorPosition(position);
    }, 100)
  }

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editor || !refContainer.current || !onChange) return;

    const handleImageResize = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof HTMLImageElement &&
          (mutation.attributeName === 'width' ||
            mutation.attributeName === 'height' ||
            mutation.attributeName === 'style')
        ) {
          // Cancela o timeout anterior se existir
          if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
          }

          // Configura um novo timeout
          debounceTimeout.current = setTimeout(() => {
            console.log('Emitting final resize values', editor.getHTML());
            onChange(editor.getHTML());
            debounceTimeout.current = null;
          }, 500); // 1 segundo de debounce
          break;
        }
      }
    };

    const observer = new MutationObserver(handleImageResize);
    observer.observe(refContainer.current, {
      attributes: true,
      attributeFilter: ['width', 'height', 'style'],
      subtree: true
    });

    return () => {
      observer.disconnect();
      // Limpa o timeout ao desmontar
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [editor, onChange]);

  return (
    <S.Container layout={layout} ref={refContainer}>

      {/* Menu de comandos (slash) */}
      {showCommands && enableCommands && onChange && (
        <MenuVertical
          editor={editor}
          projectId={projectId}
          commands={commands}
          onChange={onChange}
          onPosition={onPosition}
          onCommandClick={(command) => {
            executeCommand(editor, command);
          }}
          position={cursorPosition}
          menuRef={refMenuVertical}
        />
      )}

      {/* Menu flutuante de formatação */}
      {((isTextSelected && onChange) || layout === 'static') && (
        <MenuHorizontal
          layout={layout}
          editor={editor}
          textColor={textColor}
          backgroundColor={backgroundColor}
          onTextColorChange={(color) => {
            setTextColor(color);
            editor.chain().focus().setColor(color).run();
          }}
          onBackgroundColorChange={(color) => {
            setBackgroundColor(color);
            editor.chain().focus().setHighlight({ color }).run();
          }}
          position={cursorPosition}
          menuRef={refMenuHorizontal}
        />
      )}

      {loading ?
        <Skeleton height='58px' />
        :
        <EditorContent className="editor-text-slash" editor={editor} />
      }
    </S.Container>
  );
};

export default EditorTextSlash;
