import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
  loading?: boolean;
  type: "card" | "list";
  checked: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "loading", "type"].includes(prop),
})<IProps>`
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: 15px;
  display: flex;
  flex-direction: ${({ type }) => (type === "card" ? "column" : "row")};
  gap: 0px;
  min-width: 250px;
  position: relative;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
  .item-checkbox {
    width: 100px;
    height: 200px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.9),
      transparent
    );
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    visibility: ${({ checked }) => (checked ? "visible" : "hidden")};
    opacity: ${({ checked }) => (checked ? "1" : "0")};
    align-items: flex-start;
    justify-content: flex-start;
    border-radius: 10px 0px 0px 0px;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    transition: all 0.5s;
    > div {
      position: relative;
      z-index: 2;
    }
  }
  &:hover {
    .item-checkbox {
      visibility: visible;
      opacity: 1;
    }
  }
  .thumbnail {
    width: ${({ type }) => (type === "card" ? "100%" : "150px")};
    height: ${({ type }) => (type === "card" ? "200px" : "80px")};
    background-color: ${({ color }) => color};
    border-radius: ${({ type }) =>
      type === "card" ? " 10px 10px 0px 0px;" : "10px 0px 0px 10px"};
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ colorText }) => colorText};
    position: relative;
    overflow: hidden;
    .preview {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-position: center;
      background-size: 100% auto;
      background-repeat: no-repeat;
      border-radius: ${({ type }) =>
        type === "card" ? " 10px 10px 0px 0px;" : "10px 0px 0px 10px"};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    svg {
      width: 50px;
      height: 40px;
    }
  }

  .tools {
    display: flex;
    align-items: center;
    gap: 10px;
    position: absolute;
    right: 0;
    top: 0;
    margin: 10px;
    height: ${({ type }) => (type === "card" ? "auto" : "calc(100% - 20px)")};
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
  .infos {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 20px;
    box-sizing: border-box;
    cursor: pointer;
    form {
      display: flex;
      input {
        background-color: transparent;
        border: none;
        outline: none;
        height: 19px;
      }
    }
    .title {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      font-weight: 700;
      margin: 0px;
      padding: 0px;
      width: 100%;
    }
    .date {
      font-size: 12px;
      color: ${({ theme }) => theme.colors.neutral[500]};
      font-weight: 500;
      margin: 0px;
      padding: 0px;
    }
  }
`;
