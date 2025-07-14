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
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${({ colorBg }) => colorBg};
  background-color: ${({ theme }) => theme.colors.background.default};
  gap: 10px;
  .head-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.neutral[700]};
    i {
      display: flex;
    }
  }
  .content-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;
