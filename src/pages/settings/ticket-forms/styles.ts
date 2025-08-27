import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  .list {
    padding: 30px;
    box-sizing: border-box;
  }
  .list-tenants {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
    max-height: 55vh;
    width: 80vw;
    overflow: auto;
    > div {
      animation: zoomIn 0.5s;
    }
  }
  .search-tenant {
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    padding-top: 15px;
  }
  .buttons-modal-internal {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    > div {
      display: flex;
      gap: 10px;
    }
  }
`;
