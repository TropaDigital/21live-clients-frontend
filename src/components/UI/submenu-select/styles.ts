import styled from "styled-components";

interface IProps {
  position: "left" | "right";
  whiteSpace: "nowrap" | "normal";
  widthChildrenRight?: number;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "position",

      "menuWidth",
      "menuHeight",
      "menuTop",
      "menuBottom",

      "widthChildrenRight",

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
  .description {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin: 0px;
    padding: 0px;
    font-weight: 400;
  }
  .row {
    display: flex;
    gap: 10px;
    max-width: 100%;
  }
  .content-button {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    max-width: ${({ widthChildrenRight }) =>
      widthChildrenRight
        ? `calc(100% - ${widthChildrenRight + 10}px)`
        : `100%`};
  }
`;

export const ContainerSubPortal = styled.ul`
  z-index: 9999;
  list-style: none;
  padding: 10px 0;
  margin: 0;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.background.default};
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 5px 10px 5px;
  position: absolute;
  max-height: 250px;
  overflow: auto;

  animation: fadeIn 0.5s;

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
      &.required {
        background-color: ${({ theme }) => theme.colors.neutral[500]};
        color: ${({ theme }) => theme.colors.background.default};
        cursor: not-allowed;
      }
      .icon-svg {
        min-width: 20px;
        max-width: 20px;
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
      }
    }
  }
`;
