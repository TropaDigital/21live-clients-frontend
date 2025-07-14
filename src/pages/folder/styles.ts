import styled from "styled-components";

export const Container = styled.div`
  padding-bottom: 30px;
  .toolbar-filters {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1180px) {
      flex-direction: column-reverse;
      gap: 10px;
      align-items: flex-start;
    }
    .left {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      gap: 15px;
      .total {
        display: flex;
        align-items: center;
        gap: 10px;
        i {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${({ theme }) => theme.colors.neutral[800]};
          padding: 5px;
          background-color: ${({ theme }) => theme.colors.neutral[200]};
          border-radius: 8px;
          svg {
            width: 20px;
            height: 20px;
          }
        }
        span {
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[600]};
          display: flex;
          gap: 5px;
        }
      }
    }
    .right {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        flex-direction: column;
        align-items: unset;
        gap: 10px;
        flex: 1;
        > div {
          width: 100%;
          .resize-content,
          .content-button {
            width: 100%;
            > div {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .empty {
    flex: 1;
    padding: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    height: calc(100% - 110px);
    box-sizing: border-box;
    padding-bottom: 20px;
    i {
      width: 100px;
      height: 100px;
      border-radius: 100px;
      background: ${({ theme }) => theme.colors.warning[200]};
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .description {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.neutral[800]};
    }
  }
`;

interface IPropsTypeCard {
  type: "card" | "list";
}

export const ToolBarTypeView = styled.div.withConfig({
  shouldForwardProp: (prop) => !["type"].includes(prop),
})<IPropsTypeCard>`
  display: flex;
  height: 40px;
  gap: 5px;
  padding: 4px;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  box-sizing: border-box;
  border-radius: 8px;
  button {
    border-radius: 8px;
    outline: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 35px;
    transition: all 0.2s;
    &.card {
      background-color: ${({ type, theme }) =>
        type === "card" ? theme.colors.neutral[300] : "transparent"};
    }
    &.list {
      background-color: ${({ type, theme }) =>
        type === "list" ? theme.colors.neutral[300] : "transparent"};
    }
  }
`;

export const ContainerListItems = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: 100%;
  padding: 30px 30px 0px 30px;
  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    i {
      display: flex;
      color: ${({ theme }) => theme.colors.neutral[800]};
      svg {
        width: 25px;
        height: 25px;
      }
    }
    .title {
      display: flex;
      margin: 0px;
      font-size: 17px;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.neutral[800]};
    }
    .toggle {
      display: flex;
      button {
        border: none;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: transparent;
        svg {
          transition: all 0.2s;
        }
        &.hide {
          svg {
            transform: rotate(180deg);
          }
        }
      }
    }
    .selected-function {
      flex: 1;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      .loading-action {
        height: 40px;
        background: ${({ theme }) => theme.colors.background.default};
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        padding: 0px 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        svg {
          width: 15;
          height: 15px;
        }
        span {
          font-size: 13px;
        }
      }
    }
  }

  .content-toggle {
    margin-top: 15px;
  }

  .list-folders {
    &.card {
      display: grid;
      grid-template-columns: repeat(4, 1fr); // 4 por linha
      gap: 15px;
      @media (max-width: 1919px) {
        grid-template-columns: repeat(3, 1fr); // 3 por linha
      }

      @media (max-width: 1550px) {
        grid-template-columns: repeat(2, 1fr); // 2 por linha
      }

      @media (max-width: 1110px) {
        grid-template-columns: 1fr; // 1 por linha
      }
    }
    &.list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  .list-archives {
    &.card {
      display: grid;
      grid-template-columns: repeat(6, 1fr); // 6 por linha
      gap: 15px;
      @media (max-width: 1920px) {
        grid-template-columns: repeat(5, 1fr); // 5 por linha
      }
      @media (max-width: 1919px) {
        grid-template-columns: repeat(5, 1fr); // 5 por linha
      }
      @media (max-width: 1680px) {
        grid-template-columns: repeat(4, 1fr); // 4 por linha
      }
      @media (max-width: 1410px) {
        grid-template-columns: repeat(3, 1fr); // 3 por linha
      }
      @media (max-width: 1150px) {
        grid-template-columns: repeat(2, 1fr); // 2 por linha
      }
      @media (max-width: 900px) {
        grid-template-columns: repeat(1, 1fr); // 2 por linha
      }
    }
    &.list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  .list-videos {
    &.card {
      display: grid;
      grid-template-columns: repeat(6, 1fr); // 6 por linha
      gap: 15px;
      @media (max-width: 1920px) {
        grid-template-columns: repeat(5, 1fr); // 5 por linha
      }
      @media (max-width: 1919px) {
        grid-template-columns: repeat(5, 1fr); // 5 por linha
      }
      @media (max-width: 1680px) {
        grid-template-columns: repeat(4, 1fr); // 4 por linha
      }
      @media (max-width: 1410px) {
        grid-template-columns: repeat(3, 1fr); // 3 por linha
      }
      @media (max-width: 1150px) {
        grid-template-columns: repeat(2, 1fr); // 2 por linha
      }
      @media (max-width: 900px) {
        grid-template-columns: repeat(1, 1fr); // 2 por linha
      }
    }
    &.list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  .list-links {
    &.card {
      display: grid;
      grid-template-columns: repeat(4, 1fr); // 4 por linha
      gap: 15px;
      @media (max-width: 1919px) {
        grid-template-columns: repeat(3, 1fr); // 3 por linha
      }

      @media (max-width: 1550px) {
        grid-template-columns: repeat(2, 1fr); // 2 por linha
      }

      @media (max-width: 1110px) {
        grid-template-columns: 1fr; // 1 por linha
      }
    }
    &.list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    &.list {
      gap: 5px;
      flex-wrap: unset;
      flex-direction: column;
    }
  }
`;
