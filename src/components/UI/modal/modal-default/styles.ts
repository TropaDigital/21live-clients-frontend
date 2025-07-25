import styled from "styled-components";

interface IProps {
  opened: boolean;
  layout: "left" | "center" | "bottom" | "top" | "right";
  padding: string;
  paddingHeader: string;
  zIndex: number;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["opened", "layout", "padding", "paddingHeader"].includes(prop),
})<IProps>`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  backdrop-filter: ${({ opened }) => (opened ? "blur(10px)" : "blur(0px)")};
  background-color: ${({ opened }) =>
    opened ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0)"};
  visibility: ${({ opened }) => (opened ? "visible" : "hidden")};
  opacity: ${({ opened }) => (opened ? "1" : "0")};
  transition: all 0.5s;
  display: flex;
  align-items: ${({ layout }) =>
    layout === "top"
      ? "flex-start"
      : layout === "bottom"
      ? "flex-end"
      : "center"};
  justify-content: ${({ layout }) =>
    layout === "right"
      ? "flex-end"
      : layout === "left"
      ? "flex-start"
      : "center"};
  z-index: ${({ zIndex }) => zIndex};
  display: flex;
  .outside {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    z-index: 1;
    background-color: transparent;
    outline: none;
    border: none;
  }
  .box {
    animation: ${({ layout }) =>
        layout === "right"
          ? "fadeInRight"
          : layout === "left"
          ? "fadeInLeft"
          : layout === "top"
          ? "fadeInDown"
          : "fadeInUp"}
      0.5s;
    padding: 0px;
    border-radius: ${({ layout }) =>
      layout === "center"
        ? "30px"
        : layout === "bottom"
        ? "30px 30px 0px 0px"
        : layout === "top"
        ? "0px 0px 30px 30px"
        : "0px"};
    height: ${({ layout }) =>
      layout === "bottom" || layout === "center" || layout === "top"
        ? "auto"
        : "100%"};
    background-color: ${({ theme }) => theme.colors.background.default};
    box-sizing: border-box;
    min-width: ${({ layout }) =>
      layout === "left" || layout === "right" ? "380px" : "300px"};
    max-width: 90%;
    display: flex;
    flex-direction: column;
    z-index: 3;
    .head-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 25px;
      position: relative;
      z-index: 3;
      padding: ${({ paddingHeader }) => paddingHeader};
      .head-title {
        flex: 1;
        .title {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.neutral[700]};
          margin: 0px;
          padding: 0px;
        }
        .sub {
          flex: 1;
          font-size: 12px;
          font-weight: 400;
          color: ${({ theme }) => theme.colors.neutral[500]};
          margin: 0px;
          padding: 0px;
        }
      }
      .close {
        background-color: transparent;
        border: none;
        padding: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.colors.neutral[700]};
        cursor: pointer;
        svg {
          width: 30px;
          height: 30px;
        }
      }
    }
    .children-box {
      font-size: 14px;
      flex: 1;
      color: ${({ theme }) => theme.colors.neutral[700]};
      padding: ${({ padding }) => padding};
    }
  }
`;
