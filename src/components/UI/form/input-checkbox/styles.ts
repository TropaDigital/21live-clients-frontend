import styled from "styled-components";

interface IProps {
  checked: boolean;
  color?: string;
  colorText?: string;
  disabled?: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorText", "checked", "disabled"].includes(prop),
})<IProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  .checkbox {
    min-width: 20px;
    min-height: 20px;
    max-width: 20px;
    max-height: 20px;
    border-radius: 4px;
    border: 1px solid ${({ color }) => color};
    background-color: ${({ checked, color, theme }) =>
      checked ? color : theme.colors.background.default};
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    opacity: ${({ disabled }) => (disabled ? "0.2" : "1")};
    i {
      color: ${({ colorText }) => colorText};
      display: ${({ checked }) => (checked ? "flex" : "none")};
      animation: zoomIn 0.2s;
      svg {
        width: 13px;
        height: 15px;
      }
    }
  }
  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral[800]};
    cursor: pointer;
    padding: 10px 0px;
  }
`;

export const LabelCheckbox = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > p {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin: 0px;
    padding: 0px;
  }
`;
