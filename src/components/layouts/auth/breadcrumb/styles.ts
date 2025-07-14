import styled from "styled-components";

export const Container = styled.ul`
  width: 100%;
  list-style: none;
  margin: 0px;
  padding: 0px;
  background-color: ${({ theme }) => theme.colors.background.default};
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  .overflow {
    max-width: calc(100vw - 280px);
    padding: 10px 17px;
    overflow-y: auto;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      height: 8px;
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
  }

  li {
    display: flex;
    align-items: center;
    .division {
      color: ${({ theme }) => theme.colors.neutral[700]};
      font-size: 13px;
    }
  }
  a {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.neutral[700]};
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral[100]};
      text-decoration: none;
    }
    i {
      display: flex;
      font-size: 50px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      svg {
        width: 20px;
        height: 20px;
      }
    }
    > span {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }
  }
`;
