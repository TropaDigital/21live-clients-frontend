import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
  admin: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "admin"].includes(prop),
})<IProps>`
  box-sizing: border-box;

  .head-area {
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    padding: 25px 30px 0px 30px;
    &:first-child {
      border: none;
      padding: 0px 30px 0px 30px;
    }
    h2 {
      font-size: 20px;
      margin: 0px;
      color: ${({ theme }) => theme.colors.neutral[800]};
      font-weight: 700;
      padding: 0px;
    }
    p {
      font-size: 13px;
      margin: 0px;
      color: ${({ theme }) => theme.colors.neutral[600]};
      font-weight: 500;
      padding: 0px;
    }
  }
  .line {
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    margin: 15px 0px;
  }

  .fake-input {
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: flex-start;
    padding: 0px 30px;
    > div {
      display: flex;
    }
  }
  .row-head {
    display: flex;
    gap: 10px;
    .icon-head {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: ${({ colorBg }) => colorBg};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
  .editable-fields {
    background-image: radial-gradient(#ccc 1px, transparent 1px);
    background-size: 20px 20px;
    width: 100%;
    padding: 30px 0px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .inputs {
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 30px;
    padding: 30px 0px;
    .row-input {
      padding: 0px 30px;
      display: flex;
      gap: 30px;
      align-items: flex-end;
      @media (max-width: 700px) {
        flex-direction: column;
        width: 100%;
        align-items: flex-start;
        box-sizing: border-box;
        gap: 5px;
        > * {
          width: 100%;
        }
      }
      > * {
        flex: 1;
      }
    }
    .column-input {
      padding: 0px 30px;
      display: flex;
      gap: 5px;
      flex-direction: column;
    }
    .foot {
      display: flex;
      justify-content: flex-end;
      padding: 0px 30px 0px 30px;
    }
  }
  .list-inputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0px 30px;
  }
`;

interface IPropsField {
  admin: boolean;
}

export const ContainerField = styled.div.withConfig({
  shouldForwardProp: (prop) => !["admin"].includes(prop),
})<IPropsField>`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0px 0px;
  background-color: ${({ theme }) => theme.colors.background.default};
  border: 1px solid
    ${({ theme, admin }) => (admin ? theme.colors.neutral[300] : "transparent")};
  border-radius: 16px;
  .sortable {
    display: flex;
    justify-content: center;
    padding: 5px 0px;
    cursor: move;
    color: ${({ theme }) => theme.colors.neutral[300]};
    &:hover {
      color: ${({ theme }) => theme.colors.neutral[700]};
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .input-render {
    flex: 1;
    transition: all 0.2s;
    padding: ${({ admin }) => (admin ? "0px 30px" : "0px")};
    box-sizing: border-box;
  }
  .actions {
    display: flex;
    padding: 15px 30px;
    justify-content: space-between;
    margin-top: 20px;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    .buttons {
      display: flex;
      gap: 10px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      margin-right: -5px;
    }
  }
  &:hover {
    .buttons {
      opacity: 1;
      visibility: visible;
      margin-right: 0px;
    }
  }
`;

export const ContainerEditable = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "admin"].includes(prop),
})<IProps>`
  background-color: ${({ theme }) => theme.colors.background.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  flex: 1;
  height: 100%;
  .form {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 170px);
    overflow-y: auto;
    box-sizing: border-box;
    width: 100%;
    .types-input {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 30px 30px 0px 30px;
      .type {
        width: calc(50% - 5px);
        box-sizing: border-box;
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        background-color: ${({ theme }) => theme.colors.background.default};
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 0px;
        gap: 5px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        cursor: pointer;
        &.active {
          border-color: ${({ colorBg }) => colorBg};
          color: ${({ colorBg }) => colorBg};
        }
        span {
          font-size: 13px;
        }
      }
    }
    .inputs-edit {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 30px;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 30px 30px 30px 30px;
      background-color: ${({ theme }) => theme.colors.background.default};
      border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      .list-inputs {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .label {
        font-size: 13px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.neutral[800]};
      }
      .option {
        display: flex;
        gap: 10px;
        .sortable {
          height: 40px;
          width: 40px;
          border-radius: 8px;
          background-color: ${({ theme }) => theme.colors.neutral[200]};
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: move;
          svg {
            width: 15px;
            height: 15px;
          }
        }
        > label {
          flex: 1;
        }
        button {
          flex: 0;
        }
      }
    }
  }
  .foot-buttons {
    display: flex;
    gap: 10px;
    padding: 30px;
    width: 100%;
    box-sizing: border-box;
    justify-content: flex-end;
  }
`;
