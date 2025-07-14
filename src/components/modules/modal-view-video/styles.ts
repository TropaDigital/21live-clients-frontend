import styled from "styled-components";

export const Container = styled.div`
  max-width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  iframe {
    width: 1200px;
    height: 675px;
    border: none;
    margin-bottom: 20px;
    overflow: hidden;
    @media(max-width: 1400px){
      width: 1000px;
      height: 565px;
    }
    @media(max-width: 1279px){
      width: 700px;
      height: 400px;
    }
    @media(max-width: 800px){
      width: 330px;
      height: 186px;
    }
  }
`;
