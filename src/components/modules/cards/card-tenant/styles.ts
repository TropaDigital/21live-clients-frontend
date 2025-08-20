import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.background.default};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 12px;
  padding: 15px;
  width: calc(25% - 8px);
  box-sizing: border-box;
  @media (max-width: 1919px) {
    width: calc(33.3% - 7px);
  }
  @media (max-width: 1600px) {
    width: calc(50% - 6px);
  }
  @media (max-width: 1279px) {
    width: calc(100%);
  }
  .more {
    width: 40px;
    height: 40px;
    max-width: 40px;
    display: flex;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    align-items: center;
    justify-content: center;
    border: none;
    svg {
      width: 20px;
      height: 20px;
    }
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral[200]};
    }
  }

  .infos {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    .name {
      font-size: 15px;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.neutral[700]};
    }
    .date {
      font-size: 12px;
      color: ${({ theme }) => theme.colors.neutral[600]};
    }
  }
`;
