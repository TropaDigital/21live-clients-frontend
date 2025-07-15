import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.background.surface};
  .central {
    display: flex;
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 30px;
    padding: 50px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    .text {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;
