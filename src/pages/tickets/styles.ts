import styled from "styled-components";

export const Container = styled.div`
  .content-page {
    padding: 30px 30px 30px 30px;
    box-sizing: border-box;
  }
  .header {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 10px;
    box-sizing: border-box;
    padding: 30px 30px 0px 30px;
    @media (max-width: 900px) {
      flex-direction: column;
    }
    .right {
      display: flex;
      gap: 10px;
    }
  }
  .status-change {
    display: flex;
    gap: 5px;
    align-items: center;
    .content-button {
      display: flex;
      align-items: center;
      flex-direction: row;
      width: unset !important;
      height: unset !important;
      max-width: unset !important;
      max-height: unset !important;
      background-color: transparent !important;
      padding: 0px;
      justify-content: flex-start;
    }
    &:hover {
      .icon-refresh {
        opacity: 1;
        visibility: visible;
        margin-left: 0px;
      }
    }
    .icon-refresh {
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0px;
      border: none;
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      border-radius: 100px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      margin-left: 10px;
      transition: all 0.2s;
      svg {
        width: 18px;
        height: 18px;
        max-width: 18px;
        max-height: 18px;
      }
    }
  }
`;
