import styled from "styled-components";

export const Container = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral[700]};
    margin: 0px;
    padding: 0px;
    font-weight: 500;
  }
  .input {
    background-color: ${({ theme }) => theme.colors.background.default};
    display: flex;
    align-items: center;
    height: 38px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    input {
      flex: 1;
      height: 100%;
      display: flex;
      border: none;
      background-color: transparent;
      padding: 10px;
      box-sizing: border-box;
      outline: none;
      color: ${({ theme }) => theme.colors.neutral[700]};
    }
    i {
      display: flex;
      padding: 0px 10px;
      &:first-child {
        padding-right: 0px;
      }
      &:last-child {
        cursor: pointer;
      }
      svg {
        height: 20px;
        width: 20px;
      }
    }
  }
`;
