import styled from "styled-components";

interface IProps {
  color?: string;
  opened?: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
`;

export const ItemWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !["color", "active", "opened"].includes(prop),
})<IProps>`
  border-left: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  .folder {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    padding: 5px 0px;
    cursor: pointer;
    .icon {
      font-size: 17px;
      min-width: 30px;
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.colors.background.default};
      background-color: ${({ color }) => color};
      i {
        font-family: "Font Awesome 5 Free", "Font Awesome 5 Brands", sans-serif !important;
      }
    }
    span {
      color: ${({ theme }) => theme.colors.neutral[700]};
      padding-top: 4px;
    }
    .children-open {
      cursor: pointer;
      background-color: transparent;
      border-radius: 4px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      background-color: ${({ theme }) => theme.colors.background.default};
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      outline: none;
      padding: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2.5px;
      width: 25px;
      height: 25px;
      min-width: 25px;
      margin-left: 5px;
      svg {
        width: 16px;
        height: 16px;
        transition: all 0.2s;
        transform: 0deg;
        transform: rotate(-90deg);
      }
    }
    &.empty-folder {
      .icon {
        background-color: ${({ theme }) =>
          theme.colors.neutral[800]} !important;
      }
      .children-open {
        opacity: 0;
        visibility: hidden;
      }
    }
    &.active {
      span {
        color: ${({ color }) => color};
        font-weight: 500;
      }
    }
    &.opened {
      .children-open {
        svg {
          transform: rotate(0deg);
        }
      }
    }
  }
  .children {
    margin-left: 17px;
    padding-left: 0px;
  }
`;
