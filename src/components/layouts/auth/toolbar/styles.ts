import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background.default};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  padding: 20px 30px;
  display: flex;
  box-sizing: border-box;
  width: 100%;
`;
