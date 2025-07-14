import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  cursor: pointer;
  &:hover {
    .input-select {
      border: 1px solid ${({ theme }) => theme.colors.neutral[500]};
    }
  }
  .input-select {
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.background.default};
    height: 40px;
    display: flex;
    align-items: center;
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
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      background-color: ${({ theme }) => theme.colors.background.default};
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

export const ContainerRightOptions = styled.div`
  display: flex;
  gap: 10px;
  padding: 0px;
  background-color: ${({ theme }) => theme.colors.background.default};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 8px;
  padding: 0px 15px;
  box-sizing: border-box;
  height: 40px;
  button {
    background-color: transparent;
    height: 40px;
    text-align: left;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.neutral[700]};
    font-size: 13px;
    white-space: nowrap;
    svg {
      width: 18px;
      height: 18px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  &:hover {
    .options-all {
      display: flex;
    }
  }
`;
