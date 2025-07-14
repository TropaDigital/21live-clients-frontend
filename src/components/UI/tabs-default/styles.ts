import styled from "styled-components";

interface IProps {
  color?: string;
  colorBg: string | undefined;
  colorText?: string;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    height: 40px;
    font-size: 14px;
    padding: 0px 20px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.neutral[600]};
    &.active {
      border-bottom: 2px solid ${({ color }) => color};
    }
  }
`;
