import styled from "styled-components";

interface IProps {
  position: "left" | "right";
}

export const ContainerComment = styled.div.withConfig({
  shouldForwardProp: (prop) => !["position"].includes(prop),
})<IProps>`
  display: flex;
  flex-direction: ${({ position }) =>
    position === "right" ? "row-reverse" : "row"};
  justify-content: flex-start;
  gap: 10px;
  animation: fadeInDown 0.5s;
  .user-photo {
    margin-top: 8px;
  }
  .message-center {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: ${({ position }) =>
      position === "right" ? "row-reverse" : "row"};
    .btns {
      button {
        width: 30px;
        height: 30px;
        background-color: ${({ theme }) => theme.colors.background.default};
        border-radius: 100px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        svg {
          width: 25px;
          height: 25px;
        }
      }
    }
    &:hover {
      button {
        opacity: 1;
        visibility: visible;
        animation: ${({ position }) =>
            position === "left" ? "fadeInLeft" : "fadeInRight"}
          0.5s;
      }
    }
  }
  .message {
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: 12px;
    padding: 10px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    position: relative;
    &:before {
      --size: 8px;
      --color: ${({ theme }) => theme.colors.neutral[400]};
      content: "";
      position: absolute;
      left: ${({ position }) => (position === "left" ? "-8px" : "unset")};
      right: ${({ position }) => (position === "right" ? "-8px" : "unset")};
      top: 20px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: calc(var(--size) / 2) solid transparent;
      border-bottom: calc(var(--size) / 2) solid transparent;
      border-right: ${({ position }) =>
        position === "left" ? `var(--size) solid var(--color)` : "unset"};
      border-left: ${({ position }) =>
        position === "right" ? `var(--size) solid var(--color)` : "unset"};
    }
    &:after {
      --size: 8px;
      --color: ${({ theme }) => theme.colors.background.default};
      content: "";
      position: absolute;
      left: ${({ position }) => (position === "left" ? "-7px" : "unset")};
      right: ${({ position }) => (position === "right" ? "-7px" : "unset")};
      top: 20px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: calc(var(--size) / 2) solid transparent;
      border-bottom: calc(var(--size) / 2) solid transparent;
      border-right: ${({ position }) =>
        position === "left" ? `var(--size) solid var(--color)` : "unset"};
      border-left: ${({ position }) =>
        position === "right" ? `var(--size) solid var(--color)` : "unset"};
    }
    .user {
      display: flex;
      align-items: center;
      flex-direction: ${({ position }) =>
        position === "right" ? "row-reverse" : "row"};
      justify-content: space-between;
      gap: 30px;
      b {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.neutral[800]};
      }
      span {
        font-size: 10px;
        color: ${({ theme }) => theme.colors.neutral[700]};
      }
    }
    .repply {
      background-color: ${({ theme }) => theme.colors.neutral[300]};
      padding: 10px;
      border-radius: 6px;
      font-size: 12px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      display: flex;
      align-items: center;
      gap: 8px;
      .reply-thumb {
        border-radius: 8px;
        max-height: 30px;
      }
      i {
        display: flex;
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    .status-interaction {
      display: flex;
      justify-content: flex-end;
    }
    .preview {
      min-width: 100%;
      width: 300px;
      height: 300px;
      border-radius: 8px;
      background-size: cover;
      background-position: center;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      @media (max-width: 500px) {
        width: 300px;
        height: 220px;
      }
      .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        content: "";
        border-radius: 8px;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.1);
      }
      &:hover {
        &:after {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }
    .text {
      font-size: 12px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      text-align: ${({ position }) => position};
    }
    .text-date {
      display: flex;
      justify-content: flex-end;
      span {
        font-size: 10px;
        color: ${({ theme }) => theme.colors.neutral[700]};
      }
    }
  }
`;

export const ContainerCardApprove = styled.div`
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  display: flex;
  flex-direction: column;
  padding: 15px;
  width: calc(20% - 13px);
  cursor: pointer;
  box-sizing: border-box;
  gap: 15px;
  animation: fadeIn 0.5s;
  .header-card {
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: space-between;
    .name {
      display: flex;
      align-items: center;
      gap: 8px;
      span {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        white-space: nowrap;
      }
    }
    .date {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.neutral[600]};
    }
  }
  .thumb {
    width: 100%;
    height: 250px;
    display: flex;
    align-items: flex-start;
    border-radius: 10px;
    background-size: cover;
    box-sizing: border-box;
    background-position: center;
    background-repeat: none;
    .overlay {
      width: 100%;
      box-sizing: border-box;
      height: 100%;
      padding: 15px;
      border-radius: 10px;

      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 20px 20px 15px 20px;
        border-radius: 12px;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .foot-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .list-reply {
    display: flex;
    > div {
      margin-right: -11px;
      transition: all 0.2s;
      &:hover {
        margin-right: 0px;
      }
    }
  }
  @media (max-width: 2700px) {
    width: calc(33.3% - 10px);
  }
  @media (max-width: 1919px) {
    width: calc(50% - 8px);
  }
  @media (max-width: 1400px) {
    .thumb {
      height: 200px;
    }
  }
  @media (max-width: 1280px) {
    width: 100%;
    .thumb {
      height: 200px;
    }
  }
`;

export const ContainerInputSend = styled.div`
  background-color: ${({ theme }) => theme.colors.background.default};
  padding: 0px;
  border-radius: 15px;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-direction: column;
  .reply-content {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
    display: flex;
    padding: 15px;
    align-items: center;
    border-radius: 16px 16px 0px 0px;
    gap: 10px;
    > i {
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .render {
      flex: 1;
      font-size: 12px;
      color: ${({ theme }) => theme.colors.neutral[600]};
    }
    button {
      border-radius: 100px;
      width: 25px;
      height: 25px;
      padding: 0px;
      border: none;
      cursor: pointer;
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
  .message-principal {
    display: flex;
  }
  .editor-text-slash {
    padding: 20px;
  }
  .btn-action {
    display: flex;
    align-items: center;
    padding: 0px 10px;
    gap: 10px;
    button {
      display: flex;
      padding: 0px;
      margin: 0px;
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      border: none;
      padding: 5px;
      border-radius: 8px;
      color: ${({ theme }) => theme.colors.neutral[600]};
      position: relative;
      > i {
        width: 20px;
        height: 20px;
        border-radius: 100px;
        background-color: ${({ theme }) => theme.colors.error[500]};
        font-style: normal;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: -10px;
        top: -10px;
      }
      svg {
        width: 22px;
        height: 22px;
      }
    }
  }
`;

export const ContainerInputSendApprove = styled.div``;

export const ContainerModalUpload = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
  .foot {
    display: flex;
    gap: 20px;
  }
`;
