import styled from "styled-components";

interface IProps {
  position: "left" | "right";

  menuWidth: number;
  menuHeight: number;
  menuTop: number;
  menuBottom: number;

  subWidth: number;
  subHeight: number;
  subTop: number;
  subBottom: number;
  heightWindow: number;
  whiteSpace: "nowrap" | "normal";
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "position",

      "menuWidth",
      "menuHeight",
      "menuTop",
      "menuBottom",

      "subWidth",
      "subHeight",
      "subTop",
      "subBottom",
      "whiteSpace",
      "heightWindow",
    ].includes(prop),
})<IProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 5px;
  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral[700]};
    margin: 0px;
    padding: 0px;
    font-weight: 500;
  }
  .row {
    display: flex;
  }
  .content-button {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  ul {
    position: absolute;
    z-index: 99;
    list-style: none;
    padding: 0px;
    margin: 0px;
    min-width: 120px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.05) 0px 5px 10px 5px;
    position: absolute;
    padding: 10px 0px;
    transition: 0.2s all;
    left: ${({ position }) => (position === "left" ? "0%" : "unset")};
    right: ${({ position }) => (position === "right" ? "0%" : "unset")};
    top: ${({ menuBottom, subHeight }) =>
      subHeight >= menuBottom ? "unset" : "100%"};
    bottom: ${({ menuBottom, subHeight }) =>
      subHeight >= menuBottom ? "100%" : "unset"};
    margin-top: ${({ menuBottom, subHeight }) =>
      subHeight >= menuBottom ? "unset" : "4px"};
    margin-bottom: ${({ menuBottom, subHeight }) =>
      subHeight >= menuBottom ? "4px" : "unset"};
    animation: slideDownFade 0.3s ease-out;
    max-width: ${({ menuWidth, whiteSpace }) =>
      whiteSpace === "normal" && menuWidth > 0 ? `${menuWidth}px` : "auto"};
    max-height: ${({ menuBottom, subHeight, menuTop }) =>
      subHeight >= menuBottom ? menuTop - 50 + "px" : "250px"};

    overflow: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3); /* opacidade aqui */
      border-radius: 0px;
      transition: background-color 0.2s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    @keyframes slideDownFade {
      0% {
        transform: translateY(-10px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    li {
      width: 100%;
      display: flex;
      border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
      &:last-child {
        border-bottom: unset;
      }
      button {
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 10px 20px;
        width: 100%;
        &:hover {
          background-color: ${({ theme }) => theme.colors.neutral[200]};
        }
        .icon-svg {
          width: 20px;
          height: 20px;
          color: ${({ theme }) => theme.colors.neutral[800]};
          svg {
            width: 20px;
            height: 20px;
          }
        }
        .icon-font {
          font-size: 14px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: ${({ theme }) => theme.colors.neutral[800]};
        }
        span {
          color: ${({ theme }) => theme.colors.neutral[700]};
          text-align: left;
          white-space: ${({ whiteSpace }) => whiteSpace};
        }
      }
    }
  }
`;
