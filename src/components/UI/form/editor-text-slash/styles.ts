import styled from "styled-components";
import { theme } from "../../../../assets/theme/theme";

interface IProps {
  layout: "fixed" | "static";
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["layout"].includes(prop),
})<IProps>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid
    ${({ layout, theme }) =>
      layout === "static" ? theme.colors.neutral[300] : "none"};
  border-radius: ${({ layout }) => (layout === "static" ? "8px" : "0px")};
  .editor-text-slash {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;

    .tiptap {
      flex: 1;
      outline: none;
      box-shadow: none;
      border: none;
      border-radius: 0px;
      padding: ${({ layout }) => (layout === "static" ? "20px" : "0px")};
      height: 100%;

      iframe {
        border: none;
        border-radius: 8px;
      }

      color: ${({ theme }) => theme.colors.neutral[600]};
      font-size: 13px;
      span {
        mark {
          padding: 0px !important;
        }
      }
      hr {
        background: ${({ theme }) => theme.colors.neutral[200]};
        width: 100%;
        height: 1px;
      }
      /* Estilo para o placeholder */
      .is-empty::before {
        content: attr(data-placeholder);
        color: #aaa;
        pointer-events: none;
        position: absolute;
      }

      /* Garantir que o placeholder não interfira na edição */
      h1.is-empty,
      h2.is-empty,
      h3.is-empty {
        position: relative;
      }
      &.has-placeholder::before {
        content: attr(data-placeholder);
        color: #aaa;
        position: absolute;
        pointer-events: none;
        height: 0;
        font-style: italic;
      }
      h1 {
      }

      a {
        cursor: pointer;
        color: var(--primary-800);
        &:hover {
          font-weight: bold;
        }
      }

      img {
        margin: 1.5rem 0;
        width: auto !important;
        height: auto !important;
        max-width: 100%;
        &.ProseMirror-selectednode {
          outline: 3px solid var(--primary-800);
        }
      }

      /* Estilo para code */
      pre {
        background: var(--primary-dark);
        border-radius: 0.5rem;
        color: white;
        font-family: "JetBrainsMono", monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;

        code {
          background: none;
          color: inherit;
          font-size: 0.8rem;
          padding: 0;
        }

        /* Code styling */
        .hljs-comment,
        .hljs-quote {
          color: #616161;
        }

        .hljs-variable,
        .hljs-template-variable,
        .hljs-attribute,
        .hljs-tag,
        .hljs-regexp,
        .hljs-link,
        .hljs-name,
        .hljs-selector-id,
        .hljs-selector-class {
          color: #f98181;
        }

        .hljs-number,
        .hljs-meta,
        .hljs-built_in,
        .hljs-builtin-name,
        .hljs-literal,
        .hljs-type,
        .hljs-params {
          color: #fbbc88;
        }

        .hljs-string,
        .hljs-symbol,
        .hljs-bullet {
          color: #b9f18d;
        }

        .hljs-title,
        .hljs-section {
          color: #faf594;
        }

        .hljs-keyword,
        .hljs-selector-tag {
          color: #70cff8;
        }

        .hljs-emphasis {
          font-style: italic;
        }

        .hljs-strong {
          font-weight: 700;
        }
      }

      /* Estilo para o bloco de citação */
      blockquote {
        border-left: 4px solid var(--primary-800); /* Cor da borda lateral */
        padding-left: 1rem; /* Espaçamento interno */
        margin: 1rem 0; /* Espaçamento externo */
        color: #555; /* Cor do texto */
        font-style: italic; /* Texto em itálico */
      }

      /* checklist */
      ul[data-type="taskList"] {
        list-style: none;
        padding: 0;
        position: relative;
        &:before {
          margin-left: 30px;
          margin-top: 0px;
        }
        li {
          display: flex;
          align-items: center;
          margin: 0.5rem 0; /* Espaçamento entre os itens */
        }

        li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        li > div {
          flex: 1 1 auto;
          text-align: left;
        }

        /* Esconde o checkbox padrão */
        input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid ${({ theme }) => theme.colors.neutral[500]}; /* Cor da borda */
          border-radius: 4px; /* Bordas arredondadas */
          outline: none;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;

          &:checked {
            background-color: ${({ theme }) =>
              theme.colors.neutral[800]}; /* Cor de fundo quando marcado */
            border-color: ${({ theme }) => theme.colors.neutral[800]};
          }

          /* Ícone de check (marcado) */
          &:checked::after {
            content: "";
            position: absolute;
            left: 5px;
            top: 1px;
            width: 4px;
            height: 9px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }

          /* Efeito de hover */
          &:hover {
            border-color: ${({ theme }) => theme.colors.neutral[600]};
          }

          /* Efeito de foco (acessibilidade) */
          &:focus {
            box-shadow: 0 0 0 2px var(--primary-500); /* Sombra ao focar */
          }
        }
      }
    }
  }

  table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background-color: #ffffff;
    box-shadow: 0 0 0 1px #ddd;
    table-layout: fixed;
    th,
    td {
      border: 1px solid #ccc;
      box-sizing: border-box;
      min-width: 1em;
      padding: 3px 5px;
      position: relative;
      vertical-align: top;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    tr:hover {
      background-color: #f9f9f9;
    }
    .column-resize-handle {
      background-color: #adf;
      bottom: -2px;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
      z-index: 20;
    }
    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
`;

export const ContainerMenuHorizontal = styled.div.withConfig({
  shouldForwardProp: (prop) => !["layout"].includes(prop),
})<IProps>`
  transition: all 0.5s;
  position: ${({ layout }) => (layout === "fixed" ? "absolute" : "unset")};
  background: ${({ layout }) =>
    layout === "fixed"
      ? theme.colors.background.default
      : theme.colors.neutral[100]};
  border: 1px solid
    ${({ layout }) =>
      layout === "fixed" ? "rgba(0, 0, 0, 0.05)" : "transparent"};
  border-bottom: 1px solid
    ${({ layout }) =>
      layout === "static" ? theme.colors.neutral[300] : "transparent"};
  border-radius: ${({ layout }) =>
    layout === "fixed" ? "8px" : "8px 8px 0px 0px"};
  box-shadow: ${({ layout }) =>
    layout === "fixed" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "unset"};
  padding: ${({ layout }) => (layout === "fixed" ? " 5px 8px" : "10px")};
  display: flex;
  flex-wrap: ${({ layout }) => (layout === "fixed" ? "nowrap" : "wrap")};
  gap: 5px;
  align-items: center;
  box-sizing: border-box;
  .line {
    width: 1px;
    height: 25px;
    background: rgba(0, 0, 0, 0.1);
    margin: 0px !important;
    border: none !important;
  }
  > button {
    background: none;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px;
    margin: 0px;
    outline: none;
    svg {
      width: 15px;
      height: 15px;
    }
    &:hover {
      background: ${({ theme, layout }) =>
        layout === "fixed"
          ? theme.colors.neutral[100]
          : theme.colors.neutral[300]};
    }
    &.is-active {
      background: ${({ theme, layout }) =>
        layout === "fixed"
          ? theme.colors.neutral[200]
          : theme.colors.neutral[300]};
    }
  }

  .button-color {
    position: relative;
    width: 35px;
    height: 25px;
    cursor: pointer;
    border-radius: 6px;
    &:hover {
      background: var(--primary-100);
    }
    .menu-colors {
      position: absolute;
      width: 182px;
      margin-top: 30px;
      padding: 15px;
      background-color: white;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.5s;
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: auto;
      .title-color {
        font-size: 12px;
        color: ${({ theme }) => theme.colors.neutral[700]};
      }
      .list-colors {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 8px;
        > button {
          width: 30px;
          height: 30px;
          border-radius: 5px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          font-size: 20px;
          justify-content: center;
          background-color: white;
          transition: all 0.5s;
          &:hover {
            transform: scale(1.3);
            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    > button {
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      border: 2px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border-radius: 5px;
      svg {
        width: 20px;
        height: 20px;
      }
      cursor: pointer;
    }
  }
`;

export const ContainerMenuVertical = styled.div`
  animation: fadeIn 0.5s;
  position: absolute; // Garante que o menu seja posicionado em relação à viewport
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0px;
  z-index: 99999;
  max-height: 40vh;
  overflow-y: auto;

  ul.list-slash {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 4px;
    .search {
      border: none;
      background: ${({ theme }) => theme.colors.background.surface};
      height: 40px;
      box-sizing: border-box;
      margin-bottom: 10px;
      border-radius: 5px;
      outline: none;
      padding: 10px 15px;
      font-size: 13px;
      color: ${({ theme }) => theme.colors.neutral[600]};
    }
    li {
      display: flex;
      flex-direction: column;
      .button {
        display: flex;
        gap: 10px;
        border-radius: 8px;
        padding: 6px;
        cursor: pointer;
        align-items: center;
        background: transparent;
        &.focus {
          background: ${({ theme }) => theme.colors.neutral[200]};
        }
      }
      i {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${({ theme }) => theme.colors.neutral[100]};
        border-radius: 5px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        svg {
          width: 16px;
          height: 16px;
        }
      }
      .info-text {
        display: flex;
        flex-direction: column;
        gap: 0px;
        b {
          font-size: 14px;
          color: ${({ theme }) => theme.colors.neutral[700]};
          white-space: nowrap;
        }
        p {
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[500]};
          white-space: nowrap;
        }
      }
    }
  }
`;

interface IPropsModalInternal {
  isOpen: boolean;
}

export const ContainerModalInternal = styled.div<IPropsModalInternal>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999991;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  transition: all 0.5s;
  .form-simple {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 400px;
  }
  .buttons-modal-internal {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    width: 400px;
    padding-top: 20px;
    > button {
      flex: 1;
    }
  }
`;

export const ViewEditor = styled.div`
  overflow: auto;
  .tiptap {
    padding: 0px !important;
  }
`;

export const ContainerIA = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
  overflow-x: hidden;
  overflow-y: auto;
  .container-ia-message {
    display: flex;
    gap: 35px;
    align-items: flex-start;
    flex: 1;
    .bot {
      min-width: 140px;
      max-width: 140px;
      max-height: 140px;
      min-height: 140px;
      border-radius: 100px;
      overflow: hidden;
      padding: 0px 20px;
      position: relative;
      background-color: white;
      box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
      border: 2px solid var(--primary-100);
      img {
        transform: scaleX(-1);
        border-radius: 10px;
        bottom: 0px;
        animation: zoomIn 0.5s;
      }
    }
    .content {
      background-color: var(--primary-050);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      position: relative;
      margin-top: 40px;
      flex: 1;
      animation: fadeInUp 0.5s;
      .loading {
        padding: 24px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        > span {
          height: 18px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          animation: fadeInRight 0.5s;
        }
      }
      .render-textarea {
        textarea {
          width: 100%;
          height: 100%;
          border: none;
          padding: 20px;
          background-color: transparent;
          outline: none;
        }
      }
      .render-html {
        animation: fadeIn 0.5s;
        .tiptap {
          border-radius: 14px 14px 0px 0px;
          padding: 24px;
          background-color: var(--primary-050);
        }
      }
      .buttons {
        display: flex;
        justify-content: flex-end;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 10px;
        border-radius: 0px 0px 10px 10px;
        border-top: 1px solid white;
      }
      &:after {
        content: "";
        position: absolute;
        top: 25px;
        left: -10px; /* ajusta a distância para fora do container */
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 10px solid var(--primary-050); /* cor da seta */
      }
    }
  }
`;

interface IPropsStatic {
  disabled?: boolean;
}

export const ContainerEditorStaticLabel = styled.div<IPropsStatic>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral[700]};
    margin: 0px;
    padding: 0px;
    font-weight: 500;
  }
  .description {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin: 0px;
    padding: 0px;
    font-weight: 400;
  }
`;

export const ContainerEditorStatic = styled.div<IPropsStatic>`
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.neutral[200] : theme.colors.background.default};
`;
