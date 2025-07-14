import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  &:hover {
    .input-select {
      border: 1px solid ${({ theme }) => theme.colors.neutral[500]};
    }
  }
  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral[700]};
    margin: 0px;
    padding: 0px;
    font-weight: 500;
  }
  .input-select {
    background-color: ${({ theme }) => theme.colors.background.default};
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    gap: 7px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    padding: 0px 15px;
    > span,
    input {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      border: none;
      flex: 1;
      outline: none;
    }
    .icon-svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .icon-font {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
  }
`;
