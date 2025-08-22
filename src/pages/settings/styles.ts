import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg?: string;
  colorText?: string;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
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
      ul {
        padding: 20px 30px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        li {
          h4 {
            font-size: 11px;
            color: ${({ theme }) => theme.colors.neutral[600]};
            text-transform: uppercase;
            padding: 5px 3px;
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
      max-width: calc(100% - 260px);
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
`;
