import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IProps>`
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  .head-table {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    gap: 15px;
    .search {
      width: 300px;
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      border-radius: 8px;
      display: flex;
      input {
        flex: 1;
        border: none;
        outline: none;
        background-color: transparent;
        padding: 0px 15px;
        font-size: 13px;
        color: ${({ theme }) => theme.colors.neutral[700]};
      }
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.neutral[700]};
        padding: 0px 10px;
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    .buttons {
      display: flex;
      gap: 15px;
    }
  }
  @media (max-width: 600px) {
    flex-direction: column;
    .buttons {
      display: none !important;
    }
    .search {
      width: 100%;
      height: 40px;
    }
  }
  .show-hide-total {
    display: flex;
    gap: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0px 10px 10px 0px;
    padding: 10px;
    margin-right: -30px;
    align-items: center;
    margin-left: 20px;
    i {
    }
  }
  .overflow-table {
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
  table {
    width: 100%;
    border-collapse: none;
    border-spacing: 0px;
    thead {
      th {
        text-align: left;
        background-color: ${({ theme }) => theme.colors.neutral[200]};
        .th-flex {
          box-sizing: border-box;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: ${({ theme }) => theme.colors.neutral[700]};
          span {
            font-size: 13px;
            color: ${({ theme }) => theme.colors.neutral[700]};
            white-space: nowrap;
          }
          button {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            border: none;
            svg {
              width: 20px;
              height: 20px;
              cursor: pointer;
            }
          }
        }
      }
    }
    tbody {
      td {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        padding: 8px 20px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
        .row {
          display: flex;
          gap: 5px;
        }
        .user {
          display: flex;
          gap: 10px;
          align-items: center;
          span {
            font-size: 12px;
            font-weight: 600;
          }
        }
        .row-gap {
          display: flex;
          gap: 5px;
        }
        .td-id {
          background-color: ${({ colorBg }) => colorBg};
          color: white;
          border-radius: 100px;
          padding: 6px 12px;
          font-size: 10px;
          margin: 5px 0px;
          display: inline-block;
        }
        .bullet {
          width: 20px;
          height: 20px;
          border-radius: 100px;
          display: flex;
          background-color: ${({ theme }) => theme.colors.neutral[300]};
          border: 2px solid rgba(0, 0, 0, 0.1);
        }
        a {
          color: ${({ theme }) => theme.colors.neutral[700]};
          font-weight: 600;
        }
        .btn-action > div {
          max-width: 40px;
        }
        .content-button {
          width: 40px;
          height: 40px;
          max-width: 40px;
          display: flex;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background-color: ${({ theme }) => theme.colors.neutral[100]};
          align-items: center;
          justify-content: center;
          border: none;
          &:hover {
            background-color: ${({ theme }) => theme.colors.neutral[200]};
          }
        }
      }
    }
  }
  .foot {
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1279px) {
      flex-direction: column;
      gap: 15px;
    }
    .left {
      .total {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.neutral[600]};
      }
    }
    .right {
      display: flex;
      gap: 10px;
      @media (max-width: 1040px) {
        flex-direction: column;
        gap: 15px;
      }
      .paginte {
        display: flex;
        gap: 5px;
        button {
          height: 40px;
          cursor: pointer;
          border: none;
          padding: 0px 15px;
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[700]};
          border-radius: 5px;
          background-color: ${({ theme }) => theme.colors.neutral[100]};
          &.active,
          &:hover {
            background-color: ${({ theme }) => theme.colors.neutral[400]};
          }
        }
      }
    }
  }
`;
