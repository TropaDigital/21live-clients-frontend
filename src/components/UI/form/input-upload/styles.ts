import styled from "styled-components";

export const Container = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.neutral[300]};
  padding: 20px;
  margin-top: 10px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.neutral[700]};
    font-weight: 700;
  }
  .infos-upload {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: center;
    .accept {
      max-width: 100%;
      font-size: 11px;
      color: ${({ theme }) => theme.colors.neutral[600]};
    }
    .maxsize {
      font-weight: 700;
    }
  }
  &.drop-zone {
    border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.neutral[400]};
  }
  > i {
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.neutral[600]};
    border-radius: 100px;
    color: ${({ theme }) => theme.colors.background.default};
  }
  .list-files {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 5px;
    li > {
      display: flex;
      flex-direction: column;
      .folder-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 5px;
        gap: 5px;
        i {
          width: 30px;
          height: 30px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${({ theme }) => theme.colors.neutral[600]};
          color: ${({ theme }) => theme.colors.background.default};
          svg {
            width: 20px;
            height: 20px;
          }
        }
        strong {
          flex: 1;
          text-align: left;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background-color: transparent;
          cursor: pointer;
          color: ${({ theme }) => theme.colors.error[600]};
        }
      }
      .files-inside {
        display: flex;
        flex-direction: column;
        gap: 5px;
        > li {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          .file {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 5px;
            i {
              min-width: 35px;
              height: 35px;
              box-sizing: border-box;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;

              border: 1px solid ${({ theme }) => theme.colors.neutral[600]};
              color: ${({ theme }) => theme.colors.neutral[600]};
              svg {
                width: 20px;
                height: 20px;
              }
            }
            .infos-file {
              display: flex;
              flex-direction: column;
              flex: 1;
              width: calc(100% - 100px);
              .name {
                font-size: 13px;
                text-align: left;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                flex: 1;
              }
              .size {
                font-size: 11px;
                text-align: left;
              }
            }
            button {
              display: flex;
              align-items: center;
              justify-content: center;
              border: none;
              background-color: transparent;
              cursor: pointer;
              color: ${({ theme }) => theme.colors.error[600]};
            }
            &.has-error {
              color: ${({ theme }) => theme.colors.error[600]};
              i {
                color: ${({ theme }) => theme.colors.error[600]};
                border-color: ${({ theme }) => theme.colors.error[600]};
              }
            }
          }
          .error {
            font-size: 11px;
            color: ${({ theme }) => theme.colors.error[600]};
            width: 100%;
            box-sizing: border-box;
          }
        }
      }
    }
  }
`;
