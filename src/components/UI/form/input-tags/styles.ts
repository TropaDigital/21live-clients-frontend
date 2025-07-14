import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  .list-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    .tag {
      background-color: ${({ theme }) => theme.colors.neutral[400]};
      color: ${({ theme }) => theme.colors.neutral[800]};
      display: flex;
      align-items: center;
      border-radius: 100px;
      font-size: 13px;
      padding: 5px 15px;
      gap: 10px;
      i {
        display: flex;
        svg {
          width: 15px;
          height: 15px;
        }
      }
      button {
        display: flex;
        padding: 0px;
        margin: 0px;
        background-color: transparent;
        color: ${({ theme }) => theme.colors.error[500]};
        border: none;
        outline: none;
        cursor: pointer;
        svg {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
`;
