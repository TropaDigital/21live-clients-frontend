import styled from "styled-components";

interface IProps {
  colorBg: string;
  color: string;
  colorText: string;
  size: "small" | "medium" | "large";
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "size"].includes(prop),
})<IProps>`
  width: ${({ size }) =>
    size === "small" ? "45px" : size === "medium" ? "90px" : "135px"};
  height: ${({ size }) =>
    size === "small" ? "45px" : size === "medium" ? "90px" : "135px"};
  min-width: ${({ size }) =>
    size === "small" ? "45px" : size === "medium" ? "90px" : "135px"};
  min-height: ${({ size }) =>
    size === "small" ? "45px" : size === "medium" ? "90px" : "135px"};
  border-radius: 0.75rem;
  position: relative;
  .name {
    width: 100%;
    height: 100%;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(
      135deg,
      ${({ color }) => color} 0%,
      ${({ colorBg }) => colorBg} 100%
    );
    span {
      color: ${({ colorText }) => colorText};
      text-transform: uppercase;
      white-space: nowrap;
      text-align: center;
    }
  }
  .icon {
    width: 100%;
    height: 100%;
    border-radius: 14px;
    display: flex;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.05);
  }
`;
