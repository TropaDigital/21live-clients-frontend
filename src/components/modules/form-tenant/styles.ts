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
        &.gap-10 {
          gap: 10px;
        }
        &.gap-20 {
          gap: 20px;
        }
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
  .list-uploads {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
`;

export const CardUploadToggle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 12px;
  overflow: hidden;
  width: calc(25% - 10px);
  @media (max-width: 1800px) {
    width: calc(50% - 7px);
  }
   @media (max-width: 1279px) {
    width: calc(100%);
  }
  .render-image {
    box-sizing: border-box;
    display: flex;
    padding: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 120px;
    --size: 14px; /* tamanho do quadradinho */
    --c1: ${({ theme }) => theme.colors.neutral[100]}; /* cor 1 */
    --c2: ${({ theme }) => theme.colors.neutral[300]}; /* cor 2 */
    background: conic-gradient(
        var(--c1) 25%,
        var(--c2) 0 50%,
        var(--c1) 0 75%,
        var(--c2) 0
      )
      0 0 / var(--size) var(--size);
    .render-preview {
      background-size: 100% auto;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 10px;
    }
    .logo {
      width: 200px;
      height: 80px;
    }
    .bg {
      width: 120px;
      height: 100px;
    }
    .favicon {
      width: 80px;
      height: 80px;
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    padding: 15px;
    box-sizing: border-box;
    width: 100%;
    gap: 10px;
    .title {
      font-size: 15px;
      color: ${({ theme }) => theme.colors.neutral[800]};
      font-weight: 700;
      text-align: center;
    }
    .description {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.neutral[600]};
      text-align: center;
    }
  }
`;
