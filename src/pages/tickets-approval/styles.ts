import styled from "styled-components";

export const Container = styled.div`
  @media (max-width: 400px) {
    width: 100vw;
  }
  .content-page {
    padding: 0px 30px 30px 30px;
    box-sizing: border-box;
  }
  .header {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 10px;
    box-sizing: border-box;
    padding: 30px 30px 0px 30px;
    .right {
      display: flex;
      gap: 10px;
    }
  }
  .sub-header {
    padding: 20px 30px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      @media (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
      gap: 20px;
      flex: 1;
      .item {
        display: flex;
        flex: 1;
        background-color: ${({ theme }) => theme.colors.background.default};
        border-radius: 16px;
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        padding: 20px;
        .text {
          display: flex;
          flex-direction: column;
          flex: 1;
          align-items: flex-start;
          justify-content: flex-start;
          .title {
            font-size: 13px;
            color: ${({ theme }) => theme.colors.neutral[600]};
          }
          .value {
            font-size: 22px;
            font-weight: 600;
          }
        }
        > i {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${({ theme }) => theme.colors.neutral[200]};
          svg {
            width: 25px;
            height: 25px;
          }
        }
      }
    }
    .search {
      display: flex;
      border-radius: 12px;
      background-color: ${({ theme }) => theme.colors.neutral[300]};
      height: 40px;

      input {
        border: none;
        outline: none;
        background-color: transparent;
        flex: 1;
        padding: 0px 25px;
        color: ${({ theme }) => theme.colors.neutral[600]};
      }
      button {
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        height: 100%;
        color: ${({ theme }) => theme.colors.neutral[600]};
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px 10px;
      }
    }
  }
  .list-cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    @media (max-width: 1800px) {
      grid-template-columns: repeat(4, 1fr); // 3 por linha
    }

    @media (max-width: 1550px) {
      grid-template-columns: repeat(3, 1fr); // 2 por linha
    }

    @media (max-width: 1110px) {
      grid-template-columns: repeat(2, 1fr); // 2 por linha
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr; // 1 por linha
    }
  }
`;
