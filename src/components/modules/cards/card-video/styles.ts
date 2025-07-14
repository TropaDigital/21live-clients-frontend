import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
  loading?: boolean;
  host?: string;
  type: "card" | "list";
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "loading", "host", "type"].includes(
      prop
    ),
})<IProps>`
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: 15px;
  display: flex;
  flex-direction: ${({ type }) => (type === "card" ? "column" : "row")};
  gap: 0px;
  position: relative;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
  .thumbnail {
    width: ${({ type }) => (type === "card" ? "100%" : "150px")};
    height: ${({ type }) => (type === "card" ? "200px" : "80px")};
    background-color: ${({ host, colorBg }) =>
      host === "" ? "rgb(98 93 245 / 80%)" : colorBg};
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
      background-position: center;
      background-size: cover;
      overflow: hidden;
      border-radius: ${({ type }) =>
        type === "card" ? " 10px 10px 0px 0px;" : "10px 0px 0px 10px"};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        width: 50px;
        height: 40px;
      }
    }
  }
  .head-item {
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: ${({ type }) => (type === "card" ? "100%" : "auto")};
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
