import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  .list {
    padding: 30px;
    box-sizing: border-box;
  }
  .list-forms {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
`;

export const ContainerCard = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(25% - 8px);
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  box-sizing: border-box;
  @media (max-width: 1700px) {
    width: calc(33.3% - 7px);
  }
  @media (max-width: 1380px) {
    width: calc(50% - 6px);
  }
  @media (max-width: 1100px) {
    width: calc(100%);
  }
  .preview {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 15px;
    border-radius: 15px 15px 0px 0px;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    * {
      cursor: not-allowed !important;
    }
  }
  .infos {
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    display: flex;
    flex-direction: column;
    padding: 20px;
    a {
      color: ${({ theme }) => theme.colors.neutral[700]};
      text-decoration: none;
      font-weight: 600;
    }
  }
`;

export const ContainerPreview = styled.div`
  width: 700px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral[300]};
  position: absolute;
  left: 0;
  top: 0;
`;
