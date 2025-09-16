import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as S from './styles';
import { type Command } from './configs';

import { executeCommand } from './functions';
import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconBgColor, IconBold, IconChevronBack, IconFontColor, IconItalic, IconLinkExternal, IconStrike, IconUnderline } from '../../../../assets/icons';
import { InputDefault } from '../input-default';
import { ButtonDefault } from '../button-default';
import { IconCode, IconH1, IconH2, IconH3, IconListBullet, IconListCheck, IconListNumber, IconParagraph, IconQuoteBlock } from './icons';

interface MenuVerticalProps {
  editor: any;
  commands: Command[];
  onCommandClick: (command: string) => void;
  onChange(value: string): void;
  onPosition(): void;
  position: { top: number; left: number };
  projectId?: string;
  menuRef: React.RefObject<HTMLDivElement>; // Nova prop para a referência do menu
}

export const MenuVertical: React.FC<MenuVerticalProps> = ({
  editor,
  commands,
  onCommandClick,
  onPosition,
  onChange,
  position,
  menuRef // Recebe a referência do menu
}) => {


  //refs slash
  const itemRefs = useRef<any[]>([]); // Refs para os itens da lista
  const [focusedIndex, setFocusedIndex] = useState(0); // Índice do item focado

  const inputSearchRef = useRef<any>(null);
  const [search, setSearch] = useState('');

  const filteredCommands = commands.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  //table
  const [showTableConfig, setShowTableConfig] = useState(false);
  const [tableConfig, setTableConfig] = useState({ rows: 3, cols: 3 });

  //youtube
  const [showYoutube, setShowYoutube] = useState(false)
  const [youtubeConfig, setYoutubeConfig] = useState({
    width: 640,
    height: 480,
    url: ''
  })

  const [showSub, setShowSub] = useState<Command | null>(null)

  const onCommandInternal = (command: string) => {
    switch (command) {
      case 'youtube':
        setYoutubeConfig({
          width: 640,
          height: 480,
          url: ''
        })
        setShowYoutube(true);
        break;
      case 'table':
        setShowTableConfig(true);
        break;
      default:
        break;
    }
  };

  const onTableConfigSubmit = (rows: any, cols: any) => {
    setTableConfig({ rows, cols });
    executeCommand(editor, 'table', { rows, cols }); // Executa o comando de inserção da tabela
    setShowTableConfig(false); // Fecha o modal
  };

  const onChangeTableConfig = (rows: any, cols: any) => {
    setTableConfig({ rows, cols });
  };

  const onChangeYoutubeConfig = (name: any, value: string) => {
    const newDTO: any = youtubeConfig;
    newDTO[name] = value;
    setYoutubeConfig({ ...newDTO })
  };

  const onYoutubeConfigSubmit = () => {
    executeCommand(editor, 'youtube', youtubeConfig); // Executa o comando de inserção da tabela
    setShowYoutube(false); // Fecha o modal

    setTimeout(() => {
      onChange(editor.getHTML());
    }, 100)
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'ArrowDown') {
        // Move o foco para o próximo item
        setFocusedIndex((prevIndex) => {
          const newIndex = Math.min(prevIndex + 1, commands.length - 1);
          return newIndex;
        });
      } else if (event.key === 'ArrowUp') {
        // Move o foco para o item anterior
        setFocusedIndex((prevIndex) => {
          const newIndex = Math.max(prevIndex - 1, 0);
          return newIndex;
        });
      } else if (event.key === 'Enter') {
        // Executa o onClick do item focado
        const focusedItem = itemRefs.current[focusedIndex];
        if (focusedItem) {
          focusedItem.click();
        }
      } else if ((event.key === 'Backspace' || event.key === 'Escape') && search.length === 0) {
        const { state } = editor;
        const { selection } = state;
        editor
          .chain()
          .focus()
          .deleteRange({ from: selection.from - 1, to: selection.from })
          .run();
      }
    };

    // Adiciona o listener de teclado
    document.addEventListener('keydown', handleKeyDown);

    // Remove o listener ao desmontar o componente
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedIndex, commands.length, search]);

  useEffect(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.focus();
    }
  }, []);

  const handleOnChangeSearch = (value: string) => {
    setSearch(value);
    onPosition();
  };

  const onClickItemMenu = (item: Command) => {
    if (item.sub) {
      setShowSub({ ...item })
    } else if (item.commandInternal) {
      onCommandInternal(item.commandInternal)
    } else if (item.command) {
      onCommandClick(item.command ?? '')
    }
  }

  return (
    <>
      <S.ContainerMenuVertical
        onMouseLeave={() => inputSearchRef.current.focus()}
        ref={menuRef}
        style={{ top: position.top, left: position.left }}
      >
        {!showSub ?
          <ul className="list-slash">
            <input
              className="search"
              ref={inputSearchRef}
              value={search}
              onChange={(e) => handleOnChangeSearch(e.target.value)}
            />
            {filteredCommands.map((item, index) => (
              <li key={item.command}>
                <div
                  ref={(el: any) => (itemRefs.current[index] = el)} // Atribui a ref ao botão
                  onClick={() => onClickItemMenu(item)}
                  onFocus={() => setFocusedIndex(index)} // Atualiza o índice focado
                  onMouseEnter={() => {
                    setFocusedIndex(index); // Atualiza o índice focado ao passar o mouse
                  }}
                  className={`button ${focusedIndex === index ? 'focus' : 'normal'} ${item.command ? item.command : item.commandInternal}`}
                  tabIndex={focusedIndex === index ? 0 : -1} // Gerencia o tabIndex
                >
                  <i>{item.icon}</i>
                  <div className={`info-text`}>
                    <p>{item.label}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          :
          <ul className="list-slash">
            <li>
              <div className='button' onClick={() => setShowSub(null)}>
                <i><IconChevronBack /></i>
                <div className="info-text">
                  <b>{showSub.label}</b>
                </div>
              </div>
            </li>
            {showSub.sub?.map((item, index) => (
              <li key={item.label}>
                <div
                  ref={(el: any) => (itemRefs.current[index] = el)}
                  onClick={() => onCommandInternal(item.commandInternal)}
                  onFocus={() => setFocusedIndex(index)}
                  onMouseEnter={() => {
                    setFocusedIndex(index);
                  }}
                  className={`button ${focusedIndex === index ? 'focus' : 'normal'}`}
                  tabIndex={focusedIndex === index ? 0 : -1}
                >
                  <div className="info-text">
                    <p>{item.label}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        }
      </S.ContainerMenuVertical>

      {/* Modal youtube */}
      <S.ContainerModalInternal isOpen={showYoutube} >
        <div className="form-simple">
          <InputDefault
            label="Largura"
            type="number"
            min="300"
            value={youtubeConfig.width}
            onChange={(e) => onChangeYoutubeConfig('width', e.target.value)}
          />
          <InputDefault
            label="Altura"
            type="number"
            min="300"
            value={youtubeConfig.height}
            onChange={(e) => onChangeYoutubeConfig('height', e.target.value)}
          />
          <InputDefault
            label="URL do vídeo"
            value={youtubeConfig.url}
            onChange={(e) => onChangeYoutubeConfig('url', e.target.value)}
          />
        </div>
        <div className="buttons-modal-internal">
          <ButtonDefault
            type='button'
            variant="lightWhite"
            onClick={() => setShowYoutube(false)}
          >
            Cancelar
          </ButtonDefault>
          <ButtonDefault
            type='button'
            variant="primary"
            onClick={() => {
              onYoutubeConfigSubmit(); // Fecha o modal
            }}
          >
            Confirmar
          </ButtonDefault>
        </div>
      </S.ContainerModalInternal>

      {/* Modal table */}
      <S.ContainerModalInternal isOpen={showTableConfig} >
        <div className="form-simple">
          <InputDefault
            label="Linhas"
            type="number"
            value={tableConfig.rows}
            min="1"
            onChange={(e) => onChangeTableConfig(parseInt(e.target.value, 10), tableConfig.cols)}
          />

          <InputDefault
            label="Colunas"
            type="number"
            value={tableConfig.cols}
            min="1"
            onChange={(e) => onChangeTableConfig(tableConfig.rows, parseInt(e.target.value, 10))}
          />
        </div>
        <div className="buttons-modal-internal">
          <ButtonDefault
            type='button'
            variant="lightWhite"
            onClick={() => setShowTableConfig(false)}
          >
            Cancelar
          </ButtonDefault>
          <ButtonDefault
            type='button'
            variant="primary"
            onClick={() => {
              onTableConfigSubmit(tableConfig.rows, tableConfig.cols); // Fecha o modal
            }}
          >
            Confirmar
          </ButtonDefault>
        </div>
      </S.ContainerModalInternal>
    </>
  );
};

const MenuIconColor = ({
  refContainer,
  position,
  editor,
  type,
  colors,
  color,
  onChange,
  icon
}: {
  refContainer: React.RefObject<HTMLDivElement>;
  position: { top: number; left: number };
  editor: any
  type: 'text' | 'bg'
  colors: any[];
  color: string;
  onChange(value: string): void;
  icon: any;
}) => {

  const [opened, setOpened] = useState(false)
  const refModal = useRef<any>(null)
  const refMenuColors = useRef<any>(null)
  const [positionTop, setPositionTop] = useState(30);

  useLayoutEffect(() => {
    if (refContainer.current && refMenuColors.current) {

      const heightEditor = refContainer.current.offsetHeight;
      const heightMenu = refMenuColors.current.offsetHeight;
      const heightMenuEditor = position.top;

      if (heightEditor - heightMenu - 100 <= heightMenuEditor) {
        setPositionTop(heightMenu * -1)
      } else {
        setPositionTop(30)
      }

      console.log('altura do editor', refContainer.current.offsetHeight);
      console.log('position', position)
      console.log('altura do menu', refMenuColors.current.offsetHeight);
    }
  }, [opened, editor?.getHTML()])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (refModal.current && !refModal.current.contains(event.target as Node)) {
        setOpened(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refModal, opened]);

  function extractUsedColorsFromHTML(html: string, type: 'text' | 'bg') {
    const colors = new Set<string>();

    // pega todos os atributos style=""
    const regex = /style="([^"]*)"/g;

    for (const match of html.matchAll(regex)) {
      const styleContent = match[1];

      // TEXT COLORS (somente se não for bg)
      if (type === 'text') {
        const colorMatch = styleContent.match(/color:\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/i);
        const bgMatch = styleContent.match(/background-color:/i);

        if (colorMatch && !bgMatch) {
          colors.add(colorMatch[1]); // aqui estava errado, antes usava [2]
        }
      }

      // BACKGROUND COLORS
      if (type === 'bg') {
        const bgMatch = styleContent.match(/background-color:\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/i);
        if (bgMatch) {
          colors.add(bgMatch[1]);
        }
      }
    }

    return Array.from(colors);
  }

  const recentColors = extractUsedColorsFromHTML(editor.getHTML(), type)

  return (
    <div ref={refModal} className="button-color">

      <button type='button' onClick={() => setOpened(true)} style={{ borderColor: color }}>{icon}</button>

      {opened &&
        <div ref={refMenuColors} style={{
          marginTop: positionTop
        }} className='menu-colors'>

          {recentColors.length > 1 &&
            <>
              <p className='title-color'>Usado recentemente</p>
              <div className='list-colors'>
                {recentColors.map((item, key) =>
                  <button type='button' key={`c-${key}-${item}`} onClick={() => onChange(item)} style={
                    type === 'text' ?
                      { borderColor: color === item ? item : 'rgba(0,0,0,.1)', color: item }
                      :
                      { borderColor: color === item ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.1)', backgroundColor: item }
                  }>
                    {type === 'text' ? icon : ''}
                  </button>
                )}
              </div>
            </>
          }

          <p className='title-color'>{type === 'text' ? 'Cor de texto' : 'Cor de fundo'}</p>
          <div className='list-colors'>
            {colors.map((item, key) =>
              <button type='button' key={`c-${key}`} onClick={() => onChange(item.color)} style={
                type === 'text' ?
                  { borderColor: color === item.color ? item.color : 'rgba(0,0,0,.1)', color: item.color }
                  :
                  { borderColor: color === item.color ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.1)', backgroundColor: item.color }
              }>
                {type === 'text' ? icon : ''}
              </button>
            )}
          </div>
        </div>
      }
    </div>
  );
};

interface MenuHorizontalProps {
  editor: any;
  textColor: string;
  backgroundColor: string;
  onTextColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  position: { top: number; left: number };
  menuRef: React.RefObject<HTMLDivElement>;
  layout: 'fixed' | 'static';
  refContainer: React.RefObject<HTMLDivElement>
}

export const MenuHorizontal: React.FC<MenuHorizontalProps> = ({
  refContainer,
  editor,
  textColor,
  backgroundColor,
  onTextColorChange,
  onBackgroundColorChange,
  position,
  layout,
  menuRef
}) => {
  // Função para adicionar ou editar um link
  const handleLink = () => {
    const url = window.prompt('Digite a URL do link:'); // Solicita a URL ao usuário
    if (url) {
      editor.chain().focus().setLink({ href: url }).run(); // Aplica o link ao texto selecionado
    } else {
      editor.chain().focus().unsetLink().run(); // Remove o link se o usuário cancelar
    }
  };

  const colors = {
    textColors: [
      { name: 'Default', color: null },
      { name: 'Gray', color: '#9B9A97' },
      { name: 'Brown', color: '#64473A' },
      { name: 'Orange', color: '#D9730D' },
      { name: 'Yellow', color: '#DFAB01' },
      { name: 'Green', color: '#448361' },
      { name: 'Blue', color: '#0B6E99' },
      { name: 'Purple', color: '#6940A5' },
      { name: 'Pink', color: '#AD1A72' },
      { name: 'Red', color: '#E03E3E' },
    ],
    backgroundColors: [
      { name: 'Default', color: 'transparent' },
      { name: 'Gray Background', color: '#EBECED' },
      { name: 'Brown Background', color: '#E9E5E3' },
      { name: 'Orange Background', color: '#FAEBDD' },
      { name: 'Yellow Background', color: '#FBF3DB' },
      { name: 'Green Background', color: '#DDEDEA' },
      { name: 'Blue Background', color: '#DDEBF1' },
      { name: 'Purple Background', color: '#EAE4F2' },
      { name: 'Pink Background', color: '#F4DFEB' },
      { name: 'Red Background', color: '#FBE4E4' },
    ]
  };

  const isImageSelected = editor?.isActive('image');
  const isYoutubeSelected = editor?.isActive('youtube');

  return !isImageSelected && !isYoutubeSelected ? (
    <S.ContainerMenuHorizontal layout={layout} ref={menuRef} style={{ top: position.top, left: position.left }}>
      {/* Negrito */}
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor?.isActive('bold') ? 'is-active' : ''}
      >
        <IconBold />
      </button>

      {/* Itálico */}
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor?.isActive('italic') ? 'is-active' : ''}
      >
        <IconItalic />
      </button>

      {/* Sublinhado */}
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor?.isActive('underline') ? 'is-active' : ''}
      >
        <IconUnderline />
      </button>

      {/* Tachado */}
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor?.isActive('strike') ? 'is-active' : ''}
      >
        <IconStrike />
      </button>

      <div className="line" />
      <button
        type='button'
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor?.isActive('paragraph') ? 'is-active' : ''}
      >
        <IconParagraph />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <IconH1 />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <IconH2 />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <IconH3 />
      </button>
      <div className="line" />

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor?.isActive('blockquote') ? 'is-active' : ''}
      >
        <IconQuoteBlock />
      </button>

      <div className="line" />

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor?.isActive('blockquote') ? 'is-active' : ''}
      >
        <IconCode />
      </button>

      <div className="line" />

      <button type='button' onClick={handleLink} className={editor?.isActive('link') ? 'is-active' : ''}>
        <IconLinkExternal />
      </button>

      <div className="line" />

      {/* Cor do texto */}
      <MenuIconColor refContainer={refContainer} position={position} editor={editor} type='text' colors={colors.textColors} icon={<IconFontColor />} color={textColor} onChange={onTextColorChange} />

      {/* Cor de fundo */}
      <MenuIconColor
        refContainer={refContainer}
        position={position}
        editor={editor}
        type='bg'
        colors={colors.backgroundColors}
        icon={<IconBgColor />}
        color={backgroundColor}
        onChange={onBackgroundColorChange}
      />

      <div className="line" />

      {/* Alinhamento */}
      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor?.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
      >
        <IconAlignLeft />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor?.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
      >
        <IconAlignCenter />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor?.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
      >
        <IconAlignRight />
      </button>

      <div className="line" />

      {/* Lista numerada */}
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor?.isActive('orderedList') ? 'is-active' : ''}
      >
        <IconListNumber />
      </button>

      {/* Lista com marcadores */}
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor?.isActive('bulletList') ? 'is-active' : ''}
      >
        <IconListBullet />
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor?.isActive('taskList') ? 'is-active' : ''}
      >
        <IconListCheck />
      </button>
    </S.ContainerMenuHorizontal>
  ) : (
    <></>
  );
};
