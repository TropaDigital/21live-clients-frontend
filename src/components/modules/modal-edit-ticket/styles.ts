import styled from "styled-components";

export const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  width: 900px;
  max-width: 80vw;
  .head-select-form {
    padding: 30px;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.background.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  }
  .form {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: auto;
    height: calc(100vh - 395px);
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    animation: fadeIn 1s;
  }
  .foot-buttons {
    display: flex;
    gap: 20px;
    padding: 30px 30px;
    box-sizing: border-box;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  }
  .gap-fake {
    gap: 15px;
    display: flex;
    flex-direction: column;
    padding: 30px;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 0px 0px 30px 30px;
  }
  .fake-input-loading {
    display: flex;
    flex-direction: column;
    gap: 5px;
    .title {
      display: flex;
      width: 100%;
    }
  }
  .empty-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 40px;
    box-sizing: border-box;
    > i {
      width: 80px;
      height: 80px;
      color: white;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
      svg {
        width: 100%;
        height: 100%;
      }
    }
    .texts {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      margin-top: 25px;
      .title {
        font-size: 22px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        font-weight: 600;
      }
      .description {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.neutral[600]};
      }
    }
  }
  .loading-submit {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 0px 0px 30px 30px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    p {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.neutral[700]};
    }
    .round-icon {
      display: flex;
      flex-direction: column;
      position: relative;
      align-items: center;
      .icon {
        display: flex;
        overflow: hidden;
        transition: all 0.5s;
        &.success {
          margin-top: -100px;
        }
        i {
          width: 100px;
          height: 100px;
          border-radius: 100px;
          box-sizing: border-box;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${({ theme }) => theme.colors.neutral[300]};
          svg {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
`;
