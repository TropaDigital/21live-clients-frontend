import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background.default};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 15px;
  .head {
    height: 200px;
    position: relative;
    cursor: pointer;
    .image-thumb {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      border-radius: 15px 15px 0px 0px;
    }
    .controls {
      width: 100%;
      top: 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      button {
        width: 50px;
        height: 50px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        border: none;
        color: white;
        border-radius: 100px;
        position: absolute;
      }
      .prev {
        left: 20px;
        top: calc(50% - 25px);
      }
      .next {
        right: 20px;
        top: calc(50% - 25px);
        svg {
          transform: rotate(180deg);
        }
      }
    }
  }
  .body {
    display: flex;
    padding: 20px;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    gap: 10px;
    flex-direction: column;
    cursor: pointer;
    .stats {
      display: flex;
      align-items: center;
      gap: 10px;
      .icon {
        min-width: 30px;
        width: 30px;
        height: 30px;
        border-radius: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        svg {
        }
        p {
          background-color: ${({ theme }) => theme.colors.error[500]};
          border-radius: 100px;
          color: white;
          font-style: normal;
          font-size: 8px;
          padding: 5px 6px;
        }
      }
      p {
        font-size: 12px;
        font-weight: 500;
      }
    }
    .id {
      color: white;
      border-radius: 100px;
      padding: 6px 12px;
      font-size: 10px;
      margin: 5px 0px;
      display: inline-block;
    }
    .text {
      display: flex;
      gap: 5px;
      align-items: center;
      p {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        font-weight: 600;
      }
    }
  }
`;
