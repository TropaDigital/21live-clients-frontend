import styled from "styled-components";

export const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.background.surface};
  height: 100%;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  .tab-modal {
    background-color: ${({ theme }) => theme.colors.background.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    button {
      height: 45px;
    }
  }
  .inputs-flex {
    gap: 10px;
    
    flex: 1;
    max-height: calc(100vh - 240px);
    display: flex;
    padding: 20px 30px;
    flex-direction: column;
    width: 380px;
    max-width: 100%;
    .row {
      display: flex;
      gap: 10px;
    }
  }
  .foot-buttons {
    display: flex;
    gap: 10px;
    padding: 0px 30px 20px 30px;
  }
`;
