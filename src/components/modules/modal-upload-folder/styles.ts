import styled from "styled-components";

export const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.background.surface};
  height: 100%;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  position: relative;
  .tab-modal {
    background-color: ${({ theme }) => theme.colors.background.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    button {
      height: 45px;
    }
  }
  .inputs-flex {
    gap: 10px;
    overflow: auto;
    flex: 1;
    max-height: calc(100vh - 240px);
    display: flex;
    padding: 20px 30px;
    flex-direction: column;
    width: 380px;
    max-width: 100%;
  }

  .loading-percent {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .center-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 50px;
      border-radius: 20px;
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.neutral[300]};
      padding: 50px;
      background-color: ${({ theme }) => theme.colors.background.default};
      box-sizing: border-box;
      gap: 15px;
    }
    .progress-bar {
      width: 100%;
      height: 10px;
      border-radius: 100px;
      overflow: hidden;
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      background-color: ${({ theme }) => theme.colors.background.default};
      .progress {
        transition: all 0.5s;
        height: 100%;
        background-color: ${({ theme }) => theme.colors.neutral[900]};
      }
    }
  }

  .foot-buttons {
    display: flex;
    gap: 10px;
    padding: 0px 30px 20px 30px;
  }
`;
