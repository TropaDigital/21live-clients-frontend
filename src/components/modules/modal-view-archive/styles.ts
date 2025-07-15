import styled from "styled-components";

export const Container = styled.div`
  max-width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  .preview-render {
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.neutral[200]};
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    min-height: 400px;
    border-radius: 0px 0px 40px 40px;
    overflow: hidden;
    @media (max-width: 400px) {
      max-height: 500px;
    }
    video {
      width: 100%;
      min-height: 400px;
      max-height: 60vh;
      border: none;
    }
    iframe {
      width: 800px;
      max-width: 80vw;
      height: 70vh;
      border: none;
    }
    .tools {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
      background-color: ${({ theme }) => theme.colors.background.default};
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      gap: 10px;
      @media (max-width: 800px) {
        flex-direction: column;
      }
      button {
        flex: unset;
        width: auto;
      }
    }
    .react-transform-wrapper {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
      img {
        width: 100%;
        max-height: calc(100vh - 250px) !important;
        @media (max-width: 800px) {
          max-height: calc(100vh - 400px) !important;
        }
      }
    }
  }
`;
