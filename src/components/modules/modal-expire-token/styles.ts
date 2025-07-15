import styled from "styled-components";

interface IProps {
  opened: boolean;
  colorBg?: string;
  color?: string;
  colorText?: string;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["opened", "color", "colorBg", "colorText", "loading"].includes(prop),
})<IProps>`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: ${({ opened }) => (opened ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  .box {
    width: 400px;
    border-radius: 30px;
    background-color: ${({ theme }) => theme.colors.background.default};
    padding: 30px;
    padding-bottom: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: fadeInUp 0.5s;
    box-sizing: border-box;
    .head {
      display: flex;
      flex-direction: column;
      gap: 5px;
      p {
        margin: 0px;
        padding: 0px;
      }
      .title {
        font-size: 22px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.neutral[800]};
      }
      .description {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.neutral[600]};
      }
    }
    .coutdown {
      display: flex;
      align-items: center;
      gap: 10px;
      color: ${({ colorBg }) => colorBg};
      b {
        font-size: 30px;
      }
      svg {
        width: 30px;
        height: 30px;
      }
    }
    .bar-percentage {
      display: flex;
      align-items: center;
      .bar {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        height: 10px;
        background-color: ${({ theme }) => theme.colors.neutral[300]};
        .solid {
          height: 10px;
          background-color: ${({ colorBg }) => colorBg};
        }
        .linear {
          height: 15px;
          opacity: 0.5;
          position: relative;
          background: linear-gradient(
            to left,
            ${({ colorBg }) => colorBg},
            #fff
          );
        }
      }
      .limit {
        width: 35px;
        height: 35px;
        border-radius: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${({ theme }) => theme.colors.neutral[300]};
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`;
