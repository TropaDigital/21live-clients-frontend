import styled from "styled-components";

export const Container = styled.div`
  max-height: calc(100vh - 100px);
  min-width: 30vw;
  overflow: auto;
  max-width: 80vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
  > div {
    > .principal {
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      padding: 10px;
      border-radius: 12px;
    }
    > .children {
      margin-left: 30px !important;
      margin-top: -20px !important;
      padding-top: 30px !important;
    }
  }
`;

export const ContainerCardTree = styled.div`
  display: flex;
  flex-direction: column;
  animation: fadeInLeft 0.5s;
  .principal {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    .id {
      background-color: ${({ theme }) => theme.colors.neutral[300]};
      font-size: 9px;
      border-radius: 100px;
      padding: 5px 10px;
      font-size: 11px;
      width: 25px;
      text-align: center;
    }
    .infos {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 0px;
    }
    .title {
      display: flex;
      gap: 5px;
      align-items: center;
      color: ${({ theme }) => theme.colors.neutral[800]};
    }
    .slug {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.neutral[600]};
    }
  }
  .children {
    margin-left: 22px;
    margin-top: -10px;

    box-sizing: border-box;
    padding-top: 20px;
    padding-left: 15px;
    border-left: 2px solid ${({ theme }) => theme.colors.neutral[300]};

    display: flex;
    flex-direction: column;
    gap: 10px;
    .principal {
      &:before {
        width: 20px;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.neutral[300]};
        content: "";
        display: flex;
        margin: 0px -15px;
      }
    }
  }
`;
