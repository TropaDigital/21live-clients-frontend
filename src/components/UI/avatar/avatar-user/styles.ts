import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.neutral[200]};
  .name {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral[600]};
    border-radius: 100px;
  }
  .avatar {
    background-size: cover;
    width: 100%;
    height: 100%;
    border-radius: 100px;
  }
`;
