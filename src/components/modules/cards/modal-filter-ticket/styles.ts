import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  height: 100%;
  .form {
    height: calc(100vh - 160px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
    padding: 30px;
    padding-bottom: 0px;
  }
  .foot-buttons {
    display: flex;
    gap: 10px;
    padding: 30px;
    box-sizing: border-box;
  }
`;
