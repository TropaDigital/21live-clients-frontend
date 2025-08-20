import styled from "styled-components";

export const Container = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral[700]};
    margin: 0px;
    padding: 0px;
    font-weight: 500;
  }
  .color-preview {
    width: 25px;
    height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    cursor: pointer;
    margin-left: 10px;
  }
  .description {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin: 0px;
    padding: 0px;
    font-weight: 400;
  }
  .input-color {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    visibility: hidden;
  }
  .input {
    background-color: ${({ theme }) => theme.colors.background.default};
    display: flex;
    align-items: center;
    height: 38px;
    border-radius: 8px;
    position: relative;
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
    &.disabled {
      background-color: ${({ theme }) => theme.colors.neutral[200]};
    }
  }
`;
