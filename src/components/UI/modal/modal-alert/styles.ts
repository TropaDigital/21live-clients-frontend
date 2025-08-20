import styled from "styled-components";
import type { IPropsTypeModalAlert } from ".";

interface IProps {
  type: IPropsTypeModalAlert;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["type"].includes(prop),
})<IProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .item-padding {
    margin-top: -70px;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
  }
  .icon {
    width: 80px;
    height: 80px;
    border-radius: 100px;
    background-color: ${({ theme, type }) =>
      type === "error"
        ? theme.colors.error[500]
        : type === "info"
        ? theme.colors.primary[700]
        : theme.colors.success[700]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 6px solid ${({ theme }) => theme.colors.background.default};
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    svg {
      width: 40px;
      height: 40px;
      animation: zoomIn 1s;
    }
  }
  .texts {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin: 0px;
      padding: 0px;
      &.title-confirm {
        font-size: 17px;
        font-weight: 800;
        color: ${({ theme }) => theme.colors.neutral[700]};
      }
      &.description-confirm {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.neutral[700]};
      }
    }
  }
  .foot-buttons {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 15px;
  }
`;

export const ContainerProgressBar = styled.div`
  width: 60%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  margin-bottom: -20px;
  overflow: hidden;
`;

interface IPropsSuccess {
  opened: boolean;
}
export const ContainerAlertSuccess = styled.div.withConfig({
  shouldForwardProp: (prop) => !["opened"].includes(prop),
})<IPropsSuccess>`
  position: fixed;
  bottom: 30px;
  left: 0;
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  opacity: ${({ opened }) => (opened ? "1" : "0")};
  visibility: ${({ opened }) => (opened ? "visible" : "hidden")};
  animation: ${({ opened }) => (opened ? "fadeInUp .5s" : "fadeOutDown .5s")};
  transition: all 0.5s;
  .box-alert {
    display: flex;
    background-color: ${({ theme }) => theme.colors.success[600]};
    border-radius: 100px;
    padding: 15px 15px;
    align-items: center;
    gap: 10px;
    i {
      color: ${({ theme }) => theme.colors.success[600]};
      display: flex;
      width: 40px;
      height: 40px;
      align-items: center;
      justify-content: center;
      background-color: ${({ theme }) => theme.colors.background.default};
      border-radius: 100px;
      svg {
        width: 25px;
        height: 25px;
      }
    }
    .title {
      font-size: 15px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.background.surface};
      padding-right: 25px;
    }
    .description {
      font-size: 12px;
      font-weight: 200;
      color: ${({ theme }) => theme.colors.background.default};
      padding-right: 25px;
    }
  }
`;
