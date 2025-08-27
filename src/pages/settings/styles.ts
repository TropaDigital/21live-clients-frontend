import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
  menuOpened: boolean;
  isMobile: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText", "menuOpened"].includes(prop),
})<IProps>`
  min-height: 100%;
  width: 100%;
  .breadcrumb {
    li {
      i {
        color: ${({ colorBg }) => colorBg};
      }
    }
  }
  .content-settings {
    min-height: calc(100% - 59px);
    display: flex;
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    box-sizing: border-box;
    nav {
      min-height: 100%;
      background-color: ${({ theme }) => theme.colors.background.default};
      border-right: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      position: ${({ isMobile }) => (isMobile ? "absolute" : "relative")};
      z-index: 10;
      ul {
        padding: ${({ menuOpened }) =>
          menuOpened ? "20px 30px" : "20px 10px"};
        display: flex;
        flex-direction: column;
        gap: 5px;
        li {
          &.menu-toggle {
            display: flex;
            position: relative;
            justify-content: ${({ menuOpened }) =>
              menuOpened ? "flex-start" : "center"};
            button {
              border-radius: 8px;
              width: 30px;
              background-color: transparent;
              height: 30px;
              border: none;
              cursor: pointer;
            }
          }
          h4 {
            font-size: 11px;
            color: ${({ theme }) => theme.colors.neutral[600]};
            text-transform: uppercase;
            padding: 5px 3px;
            display: ${({ menuOpened }) => (menuOpened ? "flex" : "none")};
          }
          a {
            display: flex;
            gap: 10px;
            text-decoration: none;
            color: ${({ theme }) => theme.colors.neutral[700]};
            padding: 10px;
            border-radius: 8px;
            &:hover {
              background-color: ${({ theme }) => theme.colors.neutral[200]};
              color: ${({ theme }) => theme.colors.neutral[900]};
            }
            i {
              display: flex;
              color: ${({ colorBg }) => colorBg};
              svg {
                width: 20px;
                height: 20px;
              }
            }
            span {
              font-size: 14px;
              display: ${({ menuOpened }) => (menuOpened ? "flex" : "none")};
            }
          }
          &.active {
            a {
              background-color: ${({ theme }) => theme.colors.neutral[200]};
              color: ${({ theme }) => theme.colors.neutral[900]};
            }
          }
        }
      }
    }
    section {
      flex: 1;
      min-height: calc(100% - 59px);
      padding-left: ${({ isMobile }) => (isMobile ? "60px" : "0px")};
      max-width: ${({ menuOpened }) =>
        menuOpened ? "calc(100% - 260px)" : "calc(100% - 60px)"};
      .label-checkbox {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        > p {
          font-size: 11px;
          color: ${({ theme }) => theme.colors.neutral[600]};
          margin: 0px;
          padding: 0px;
        }
      }
      .head-setting {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        @media (max-width: 600px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
          .buttons {
            flex-direction: column;
            width: 100%;
          }
        }
        h1 {
          flex: 1;
          color: ${({ theme }) => theme.colors.neutral[700]};
          font-size: 28px;
        }
        .buttons {
          display: flex;
          gap: 15px;
        }
      }
    }
  }
  @media (max-width: 600px) {
    .row-input {
      flex-direction: column;
      align-items: flex-start !important;
      justify-content: flex-start !important;
      > label {
        width: 100%;
      }
    }
    .photo-profile {
      flex-direction: column;
      align-items: flex-start !important;
    }
    .tabs {
      overflow: auto;
      button {
        white-space: nowrap;
      }
    }
  }
`;
