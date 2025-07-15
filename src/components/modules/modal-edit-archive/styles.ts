import styled from "styled-components";

export const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.background.surface};
  height: 100%;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  .tab-modal {
    background-color: ${({ theme }) => theme.colors.background.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    button {
      height: 45px;
    }
  }
  .inputs-flex {
    gap: 10px;
    overflow: auto;
    flex: 1;
    max-height: calc(100vh - 180px);
    display: flex;
    padding: 20px 30px;
    flex-direction: column;
    width: 450px;
    max-width: 100%;
    box-sizing: border-box;
    .preview-file {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      background-color: ${({ theme }) => theme.colors.background.default};
      border-radius: 8px;
      flex-direction: row;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      .image {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        background-size: cover;
      }
      .infos-preview {
        display: flex;
        flex-direction: column;
        gap: 1px;
        p {
          font-weight: bold;
          font-size: 14px;
          margin: 0px;
          pad: 0px;
        }
        a {
          font-size: 13px;
        }
      }
    }
  }
  .foot-buttons {
    display: flex;
    gap: 10px;
    padding: 0px 30px 20px 30px;
  }
`;
