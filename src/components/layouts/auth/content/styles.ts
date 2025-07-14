import styled from "styled-components";

interface IProps {
  padding: boolean;
}

export const Container = styled.div<IProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: 100%;
  padding: ${({ padding }) => (padding ? "30px" : "0px")};
  .head-page {
    display: flex;
    align-items: center;
    gap: 10px;
    i {
      display: flex;
      color: ${({ theme }) => theme.colors.neutral[800]};
      svg {
        width: 30px;
        height: 30px;
      }
    }
    h2 {
      display: flex;
      margin: 0px;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.neutral[800]};
    }
  }
  .content-page {
    width: 100%;
    margin-top: 15px;
  }
`;
