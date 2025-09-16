import styled from "styled-components";

export const Container = styled.div`
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
  .input {
    background-color: white;
    position: relative;
    cursor: pointer;
    display: flex;
    height: 40px;
    box-sizing: border-box;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 8px;
    align-items: center;
    padding: 10px;
    gap: 7px;
    i {
      display: flex;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .date-text {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      border: none;
      flex: 1;
      outline: none;
    }
  }
  .absolute-calendar {
    position: absolute;
    z-index: 99;
    top: 64px;
    left: 0px;
    animation: fadeIn 0.5s;
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 16px;
    .rdp-nav {
      button {
        svg {
          fill: ${({ theme }) => theme.colors.neutral[600]};
        }
      }
    }
    .rdp-range_start .rdp-day_button,
    .rdp-range_end .rdp-day_button {
      background-color: ${({ theme }) => theme.colors.neutral[600]};
      border-color: ${({ theme }) => theme.colors.neutral[600]};
      color: ${({ theme }) => theme.colors.background.default};
    }

    .rdp-range_start {
      background: linear-gradient(
        90deg,
        transparent 50%,
        ${({ theme }) => theme.colors.neutral[200]} 50%
      );
    }
    .rdp-range_end {
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.neutral[200]} 50%,
        transparent 50%
      );
    }
    .rdp-range_middle {
      background-color: ${({ theme }) => theme.colors.neutral[200]};
    }
    .rdp-day_button {
      color: ${({ theme }) => theme.colors.neutral[500]};
      font-size: 13px;
    }
  }
`;

export const ContainerByTypes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 3px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 0px;
  background: ${({ theme }) => theme.colors.neutral[200]};

  padding: 20px 0px 20px 20px;
`;

export const ContainerSolid = styled.div`
  display: flex;
  padding: 0px;
  .rdp-root {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px 15px;
    margin: 0px;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  }
`;
