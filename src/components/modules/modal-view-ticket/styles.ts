import styled from "styled-components";

interface IProps {
  color: string;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["opened", "isMobile"].includes(prop),
})<IProps>`
  width: calc(90vw - 60px);
  height: calc(100vh - 120px);
  display: flex;
  gap: 0px;
  padding: 0px 40px;
  box-sizing: border-box;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 0px 0px 30px 30px;
  * {
    &::-webkit-scrollbar {
      height: 8px;
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
  }
  .center-row {
    display: flex;
    flex: 1;
    gap: 20px;
  }
  > .infos {
    width: 530px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 0px;
    max-height: 100%;
    overflow: auto;
    padding-bottom: 30px;
    padding-top: 30px;
    @media (max-width: 1500px) {
      width: 380px;
    }
    &.pd-right {
      padding-right: 20px;
    }
    &.pd-left {
      padding-left: 20px;
    }
    h2 {
      font-size: 15px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      font-weight: 600;
    }
    .tabs-infos {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      button {
        border-radius: 100px;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        background-color: ${({ theme }) => theme.colors.background.default};
        gap: 5px;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.neutral[600]};
        &:hover {
          border: 1px solid ${({ theme }) => theme.colors.neutral[500]};
          color: ${({ theme }) => theme.colors.neutral[800]};
        }
        &.selected {
          border: 1px solid ${({ color }) => color};
          color: ${({ color }) => color};
        }
        i {
          display: flex;
          align-items: center;
          svg {
            width: 20px;
            height: 20px;
          }
        }
        span {
          font-size: 12px;
        }
      }
    }
    .item-text {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 5px;
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      background-color: ${({ theme }) => theme.colors.background.default};
      border-radius: 16px;
      padding: 15px 0px;
      box-sizing: border-box;
      .line {
        width: 100%;
        height: 1px;
        background-color: ${({ theme }) => theme.colors.neutral[300]};
        margin: 10px 0px;
      }
      .row-labels {
        display: flex;
        gap: 10px;
        justify-content: space-between;
      }
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

    .list-organizations {
      display: flex;
      flex-direction: column;
      width: 100%;
      > div {
        width: 100%;
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      }
    }

    .list-references {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      > button {
        cursor: pointer;
        width: 80px;
        height: 80px;
        border-radius: 10px;
        background-size: cover;
        background-position: center;
        border: none;
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        position: relative;
        display: flex;
        > span {
          width: 100%;
          height: 100%;
          position: absolute;
          display: flex;
          align-items: center;
          border-radius: 10px;
          justify-content: center;
          left: 0;
          top: 0;
          backdrop-filter: blur(3px);
          background-color: rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
        }
        &:hover {
          border: 1px solid ${({ color }) => color};
          > span {
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }

    .info-user {
      display: flex;
      flex-direction: row;
      width: 100%;
      box-sizing: border-box;
      gap: 10px;
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      background-color: ${({ theme }) => theme.colors.background.default};
      border-radius: 16px;
      padding: 15px;
      box-sizing: border-box;
      align-items: center;
      .text {
        display: flex;
        flex-direction: column;
        > span {
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[700]};
        }
        > b {
          font-size: 13px;
          color: ${({ theme }) => theme.colors.neutral[800]};
        }
      }
    }
  }
  .interactions {
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    background-color: ${({ theme }) => theme.colors.background.default};
    max-width: 100%;
    border-radius: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    margin-bottom: 40px;
    margin-top: 30px;
    .tabs {
      display: flex;
      justify-content: flex-start;
      padding: 10px 30px 0px 30px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    }
    .conversation {
      height: calc(100% - 50px);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      position: relative;
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
      }
      .list-overflow {
        flex: 1;
        overflow: auto;
        padding: 40px 40px 0px 40px;
        box-sizing: border-box;
        position: relative;
        z-index: 2;
        > div {
          margin-bottom: 15px;
        }
      }
      .tab-approve {
        overflow: auto;
        padding: 30px 30px 0px 30px;
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: unset;
        align-items: flex-start;
        .list-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          flex-direction: unset;
          width: 100%;
        }
      }
      .input-send {
        padding: 20px;
        position: relative;
        z-index: 2;
      }
    }
  }
`;

export const ContainerTextMinius = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  &.minius {
    .render-text {
      width: 100%;
      p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        margin: 0px;
        padding: 0px;
      }
    }
  }
  button {
    background-color: transparent;
    padding: 2px 0px 0px 0px;
    border: none;
    cursor: pointer;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.neutral[600]};
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BulletStatus = styled.div`
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
`;
