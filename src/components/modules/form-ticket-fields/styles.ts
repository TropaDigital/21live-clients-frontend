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
    > div {
      display: flex;
    }
  }
  .sortable-inputs {
    padding: 25px;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    gap: 10px;
    .item-sortable {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 10px;
      i {
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background-color: ${({ theme }) => theme.colors.neutral[300]};
        cursor: move;
        svg {
          width: 18px;
          height: 18px;
        }
      }
      > label {
        flex: 1;
      }
    }
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
`;
