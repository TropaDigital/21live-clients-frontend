import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 5px;
  button {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
    border-radius: 8px;
    width: 35px;
    height: 35px;
    outline: none;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
    }
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral[300]};
    }
  }
`;
