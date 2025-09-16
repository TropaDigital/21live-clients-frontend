import styled, { keyframes, css } from "styled-components";

interface IProps {
  color?: string;
  colorText?: string;
  colorBg?: string;
  flex?: boolean;
  variant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "lightWhite"
    | "dark"
    | "blocked";
}

export const Container = styled.button.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "variant", "flex"].includes(prop),
})<IProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ flex }) => (flex ? "100%" : "auto")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  outline: none;
  height: 40px;
  border-radius: 8px;
  transition: all 0.2s;
  padding: 0px 20px;
  position: relative;
  overflow: hidden;
  background-color: ${({ variant, color, colorBg, theme }) => {
    switch (variant) {
      case "primary":
        return colorBg;
      case "secondary":
        return color;
      case "success":
        return theme.colors.success[500];
      case "danger":
        return theme.colors.error[500];
      case "warning":
        return theme.colors.warning[500];
      case "info":
        return theme.colors.primary[300];
      case "light":
        return theme.colors.neutral[300];
      case "lightWhite":
        return theme.colors.background.default;
      case "dark":
        return "#212529";
      case "blocked":
        return theme.colors.neutral[400];
      default:
        return theme.colors.primary[500];
    }
  }};

  color: ${({ variant, colorText, theme }) => {
    switch (variant) {
      case "primary":
        return colorText;
      case "secondary":
        return colorText;
      case "success":
        return "white";
      case "danger":
        return "white";
      case "warning":
        return "white";
      case "info":
        return "white";
      case "light":
        return theme.colors.neutral[700];
      case "lightWhite":
        return theme.colors.neutral[900];
      case "dark":
        return "white";
      case "blocked":
        return theme.colors.neutral[600];
      default:
        return theme.colors.primary[500];
    }
  }};

  &:disabled {
    cursor: not-allowed;
  }
  &:after {
    width: 100%;
    height: 100%;
    content: "";
    position: absolute;
    background-color: rgba(0, 0, 0, 0);
  }

  .relative {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    z-index: 2;
    height: 100%;
    white-space: nowrap;
    padding: 0px 10px;
    svg {
      width: 25px;
      height: 25px;
      max-width: 20px;
      max-height: 20px;
    }
  }

  i {
    display: flex;
  }

  &:hover {
    &:after {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .total {
    background-color: ${({ theme }) => theme.colors.error[500]};
    border-radius: 100px;
    color: white;
    font-size: 11px;
    padding: 5px 10px
  }
`;

export const SpinnerContainer = styled.i`
  width: 25px;
  height: 25px;
  display: block;
  position: relative;
  margin: 0 auto;
`;

const skbounce = keyframes`
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
`;

export const Bouce1 = styled.i`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  ${css`
    animation: ${skbounce} 2s infinite ease-in-out;
  `}
`;

export const Bouce2 = styled.i`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  ${css`
    animation: ${skbounce} 2s infinite ease-in-out;
    animation-delay: -1s;
  `}
`;
