import styled from "styled-components";
import type { IPropsTypeModalConfirm } from ".";

interface IProps {
  type: IPropsTypeModalConfirm;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["type"].includes(prop),
})<IProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -40px;
  gap: 20px;
  .icon {
    width: 80px;
    height: 80px;
    border-radius: 100px;
    background-color: ${({ theme, type }) =>
      type === "danger"
        ? theme.colors.error[500]
        : type === "info"
        ? theme.colors.primary[700]
        : theme.colors.neutral[700]};
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
