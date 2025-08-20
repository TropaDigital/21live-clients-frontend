import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
}

export const Container = styled.form.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IProps>`
  box-sizing: border-box;
  .tabs {
    display: flex;
    flex: 1;
    background-color: red;
    background-color: ${({ theme }) => theme.colors.background.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    padding: 0px 30px;
    button {
      padding: 15px;
      border: none;
      outline: none;
      border: none;
      cursor: pointer;
      background-color: transparent;
      border-bottom: 2px solid transparent;
      font-size: 13px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      align-items: center;
      display: flex;
      gap: 5px;
      &.active {
        border-bottom: 2px solid ${({ color }) => color};
      }
      svg {
        width: 15px;
        height: 15px;
        transform: rotate(90deg);
      }
    }
  }
  .tab {
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 30px;
    padding: 30px 0px;
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
    .photo-profile {
      display: flex;
      justify-content: flex-start;
      gap: 25px;
      align-items: center;
      padding: 0px 30px 0px 30px;
      .options {
        display: flex;
        flex-direction: column;
        gap: 5px;
        .buttons {
          display: flex;
          gap: 15px;
        }
        > p {
          font-size: 11px;
          color: ${({ theme }) => theme.colors.neutral[600]};
        }
      }
    }
    .inputs {
      display: flex;
      flex-direction: column;
      gap: 15px;
      .row-input {
        padding: 0px 30px;
        display: flex;
        gap: 30px;
        align-items: flex-end;
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
      .username-input {
        display: flex;
        align-items: flex-end;
        .validate {
          height: 40px;
          display: flex;
          align-items: center;
          padding-left: 10px;
          font-size: 13px;
          color: ${({ theme }) => theme.colors.error[600]};
          svg {
            color: ${({ colorBg }) => colorBg};
          }
        }
        > label {
          flex: 1;
        }
      }
      .foot {
        display: flex;
        justify-content: flex-end;
        padding: 0px 30px 0px 30px;
      }
    }
  }
  .list-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
`;