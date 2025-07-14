import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
  loading?: boolean;
  drop?: boolean;
  type: "card" | "list";
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "loading", "drop", "type"].includes(
      prop
    ),
})<IProps>`
  border: 1px solid
    ${({ theme, drop, colorBg }) =>
      drop ? colorBg : theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: 15px;
  padding: 20px;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  flex-direction: ${({ type }) => (type === "card" ? "column" : "row")};
  gap: 15px;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
  > input {
    width: 100%;
    height: 30px;
    border: none;
    outline: none;
  }
  .head-item {
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: ${({ type }) => (type === "card" ? "100%" : "auto")};
  }
  .icon {
    width: 45px;
    height: 46px;
    background-color: ${({ colorBg }) => colorBg};
    border-radius: 10px;
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ colorText }) => colorText};
    position: relative;
    i {
    }
    .load-icon {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(20px);
      border-radius: 10px;
    }
  }
  .infos {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    justify-content: flex-start;
    width: 100%;
    cursor: pointer;
    input {
      background-color: transparent;
      border: none;
      outline: none;
      height: 19px;
    }
    .title {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      font-weight: 700;
      margin: 0px;
      padding: 0px;
      flex: 1;
    }
    .date {
      font-size: 12px;
      color: ${({ theme }) => theme.colors.neutral[500]};
      font-weight: 500;
      margin: 0px;
      padding: 0px;
    }
  }
  .tools {
    display: flex;
    align-items: center;
    gap: 10px;
    position: ${({ type }) => (type === "card" ? "relative" : "absolute")};
    right: ${({ type }) => (type === "card" ? "0px" : "20px")};
    .more {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      outline: none;
      svg {
        width: 20px;
        height: 20px;
      }
      &:hover {
        background-color: ${({ theme }) => theme.colors.neutral[300]};
      }
    }
  }
`;
