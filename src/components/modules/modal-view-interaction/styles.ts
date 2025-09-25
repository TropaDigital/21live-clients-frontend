import styled from "styled-components";

export const Container = styled.div`
  max-width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  height: 100%;
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};

  @media (max-width: 400px) {
    max-width: 100vw;
  }
  .hamburger-mobile {
    position: fixed;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    z-index: 99;
    display: none;
    align-items: center;
    justify-content: center;
    margin: 30px 10px;
    border: none;
    background: transparent;
    @media (max-width: 400px) {
      display: flex;
    }
  }

  .preview-render {
    display: flex;
    min-width: 380px;
    flex-direction: column;
    --size: 40px; /* tamanho do quadradinho */
    --c1: ${({ theme }) => theme.colors.neutral[100]}; /* cor 1 */
    --c2: ${({ theme }) => theme.colors.neutral[300]}; /* cor 2 */
    background: conic-gradient(
        var(--c1) 25%,
        var(--c2) 0 50%,
        var(--c1) 0 75%,
        var(--c2) 0
      )
      0 0 / var(--size) var(--size);
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    min-height: 400px;
    border-radius: 0px 0px 40px 40px;
    overflow: hidden;
    position: relative;
    @media (max-width: 400px) {
      max-height: 100%;
      border-radius: 0px;
      min-width: calc(100%);
      max-width: calc(100%);
    }
    .text-render {
      width: calc(100vw - 700px);
      height: 100%;
      background-color: ${({ theme }) => theme.colors.background.default};
      padding: 30px;
      display: flex;
      box-sizing: border-box;
    }
    video {
      width: 100%;
      min-height: 400px;
      max-height: 60vh;
      border: none;
    }
    iframe {
      width: 800px;
      max-width: 80vw;
      height: 70vh;
      border: none;
    }
    .tools {
      display: flex;
      justify-content: center;
      border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
      position: absolute;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      gap: 10px;
      z-index: 5;
      @media (max-width: 800px) {
        flex-direction: column;
      }
      button {
        flex: unset;
        width: auto;
      }
    }
    .react-transform-wrapper {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
      img {
        width: 100%;
        max-height: calc(100vh - 250px) !important;
        @media (max-width: 800px) {
          max-height: calc(100vh - 400px) !important;
        }
      }
    }
  }
  .right-interactions {
    display: flex;
    flex-direction: column;
    width: 400px;
    max-width: 400px;
    max-width: 100%;
    overflow: auto;
    max-height: calc(100vh - 90px);
    background-color: ${({ theme }) => theme.colors.background.default};
    border-left: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    transition: all 0.2s;
    @media (max-width: 400px) {
      border-radius: 0px;
      min-width: 100%;
      height: 100%;
      max-width: 100%;
      position: absolute;
      left: -100%;
      z-index: 10;
      border-left: none;
      &.opened {
        left: 0;
      }
    }
    .head-infos {
      display: flex;
      flex-direction: column;
      background-color: ${({ theme }) => theme.colors.background.default};
      padding: 20px 15px;
      gap: 10px;
      .label {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 0px 15px;
        min-height: 25px;
        &.column {
          flex-direction: column;
          align-items: flex-start;
          gap: 0px;
        }
        .status-change {
          cursor: pointer;
          .bullet-color-status {
            width: 22px;
            height: 22px;
            border-radius: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            svg {
              width: 15px;
              height: 15px;
            }
          }
          .content-button {
            display: flex;
            gap: 5px;
            align-items: center;
            flex-direction: row;
          }
          &:hover {
            .icon-refresh {
              opacity: 1;
              visibility: visible;
              margin-left: 0px;
            }
          }
          .icon-refresh {
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0px;
            border: none;
            background-color: ${({ theme }) => theme.colors.neutral[200]};
            border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
            border-radius: 100px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            margin-left: 10px;
            transition: all 0.2s;
            svg {
              width: 18px;
              height: 18px;
            }
          }
        }
        > span {
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[700]};
        }
        > b {
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[800]};
        }
        > div {
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[800]};
        }
      }
    }
    .vote {
      padding: 0px 30px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-bottom: 30px;
      .type-vote {
        background-color: ${({ theme }) => theme.colors.background.surface};
        border-radius: 10px;
        display: flex;
        color: ${({ theme }) => theme.colors.neutral[600]};
        button {
          width: 50%;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: transparent;
          border: none;
          outline: none;
          gap: 6px;
          &.pass {
            color: ${({ theme }) => theme.colors.success[500]};
          }
          &.fail {
            color: ${({ theme }) => theme.colors.error[500]};
          }
          svg {
            width: 25px;
            height: 25px;
            transition: all 0.2s;
          }
          span {
            font-size: 14px;
            transition: all 0.2s;
          }
        }
      }
    }
    .all-interactions {
      position: relative;
      min-height: 100%;
      .list-messages {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 30px;
        box-sizing: border-box;
      }
      &:before {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 0px 0px 16px 16px;
        background-color: ${({ color }) => color};
        background-image: url(/bg-chat.png);
        opacity: 0.08;
        content: "";
        @media (max-width: 400px) {
          border-radius: 0px;
        }
      }
    }
  }
`;

export const ContainerToggle = styled.div`
  .head-toggle {
    display: flex;
    padding: 20px 30px;
    justify-content: space-between;
    cursor: pointer;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    position: relative;
    align-items: center;
    span {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      font-weight: 600;
    }
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        transition: all 0.5s;
        cursor: pointer;
      }
      &.closed {
        svg {
          transform: rotate(180deg);
        }
      }
    }
  }
  .render-toggle {
    position: relative;
    width: 100%;
    flex: 1;
    height: calc(100% - 70px);
  }
`;
