import styled from "styled-components";

const shortSide = "5px"; // espessura da linha
const longSide = "20%"; // comprimento da linha

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
  loading: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "loading"].includes(prop),
})<IProps>`
  width: ${({ loading }) => (loading ? "100%" : "0%")};
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;

  z-index: 999999;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ loading, colorBg, theme }) =>
    loading ? theme.colors.background.default : colorBg};
  transition: all 1s;
  transition-delay: 1s;
  .loading-square {
    width: ${({ loading }) => (loading ? "100px" : "100%")};
    height: ${({ loading }) => (loading ? "100px" : "100%")};
    background-color: ${({ loading, colorBg, theme }) =>
      loading ? theme.colors.background.default : colorBg};
    position: relative;
    border-radius: ${({ loading }) => (loading ? "10px" : "0px")};
    overflow: hidden;
    transition: 1s;
    &:after {
      width: ${({ loading }) => (loading ? "90px" : "calc(100% - 10px)")};
      height: ${({ loading }) => (loading ? "90px" : "calc(100% - 10px)")};
      content: "";
      position: absolute;
      transition: all 1s;
      left: 5px;
      top: 5px;
      background-color: ${({ loading, colorBg, theme }) =>
        loading ? theme.colors.background.default : colorBg};
      border-radius: 10px;
    }
    .line-move {
      position: absolute;
      transform-origin: top left;
      transition: all 0.5s;
      animation: moveLine 1s linear infinite;
      background-color: ${({ loading, colorBg }) =>
        loading ? "black" : colorBg};
      @keyframes moveLine {
        0% {
          top: 0;
          left: 0;
          width: ${longSide};
          height: ${shortSide};
        }

        20% {
          top: 0;
          left: calc(100% - ${longSide});
          width: ${longSide};
          height: ${shortSide};
        }

        25% {
          top: 0;
          left: calc(100% - ${shortSide});
          width: ${shortSide};
          height: ${longSide};
        }

        45% {
          top: calc(100% - ${longSide});
          left: calc(100% - ${shortSide});
          width: ${shortSide};
          height: ${longSide};
        }

        50% {
          top: calc(100% - ${shortSide});
          left: calc(100% - ${longSide});
          width: ${longSide};
          height: ${shortSide};
        }

        70% {
          top: calc(100% - ${shortSide});
          left: 0%;
          width: ${longSide};
          height: ${shortSide};
        }

        75% {
          top: calc(100% - ${longSide});
          left: 0%;
          width: ${shortSide};
          height: ${longSide};
        }

        95% {
          top: 0%;
          left: 0%;
          width: ${shortSide};
          height: ${longSide};
        }

        100% {
          top: 0%;
          left: 0%;
          width: ${longSide};
          height: ${shortSide};
        }
      }
    }
  }
`;
