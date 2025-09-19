import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 5px;
  button,
  a {
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
    position: relative;
    svg {
      width: 20px;
      height: 20px;
    }
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral[300]};
    }
    .total {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: ${({ theme }) => theme.colors.error[500]};
      border-radius: 100px;
      color: white;
      z-index: 2;
      font-size: 9px;
      padding: 3px 6px;
    }
  }
`;
