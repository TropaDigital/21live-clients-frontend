import styled from "styled-components";

export const Container = styled.div`
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 25px;
  .row {
    display: flex;
    gap: 25px;
    @media (max-width: 1130px) {
      flex-direction: column;
    }
  }
  .box-dash {
    display: flex;
    justify-content: center;
    position: relative;
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: 20px;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    .head {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      i {
        min-width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        background-color: ${({ theme }) => theme.colors.neutral[200]};
        color: ${({ theme }) => theme.colors.neutral[600]};
        svg {
          width: 25px;
          height: 25px;
        }
      }
      .title-head {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.neutral[700]};
      }
    }
  }
`;

interface IPropsTenant {
  color?: string;
  colorBg?: string;
  colorText?: string;
}

export const ContainerBanners = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IPropsTenant>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    .image {
      box-shadow: 0px 5px 10px ${({ theme }) => theme.colors.neutral[300]};
    }
  }
  .controls {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 30px;
    animation: fadeIn 5s;
    z-index: 2;
    button {
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 100px;
      color: white;
      transition: all 0.5s;
      &:hover {
        transform: scale(1.1);
      }
    }
    .prev {
      svg {
        transform: rotate(90deg);
      }
    }
    .next {
      svg {
        transform: rotate(-90deg);
      }
    }
  }
  .image {
    width: 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.5s;
    a {
      display: flex;
      flex-direction: column;
      img {
        width: 100%;
        animation: fadeIn 0.5s;
      }
    }
  }
`;

export const StyledImage = styled.img<{ loaded: boolean }>`
  width: 100%;
  height: auto;
  transition: filter 0.3s ease-in-out;
  filter: ${({ loaded }) => (loaded ? "blur(0)" : "blur(10px)")};
`;

export const ContainerInfo = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IPropsTenant>`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0px 0px;
  position: relative;
  @media (max-width: 1480px) {
    flex-wrap: wrap;
  }
  .card {
    display: flex;
    padding: 20px;
    animation: fadeInUp 0.5s;
    background-color: ${({ theme }) => theme.colors.background.default};
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    gap: 10px;
    flex: 1;
    i {
      min-width: 50px;
      min-height: 50px;
      max-height: 50px;
      border-radius: 100px;
      background-color: ${({ colorBg }) => colorBg};
      color: ${({ colorText }) => colorText};
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 30px;
        height: 30px;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      font-size: 13px;
      p {
        color: ${({ theme }) => theme.colors.neutral[600]};
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      b {
        color: ${({ theme }) => theme.colors.neutral[700]};
        font-size: 20px;
      }
    }
  }
`;

export const ContainerRecents = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IPropsTenant>`
  display: flex;
  flex-direction: column;
  gap: 25px;
  .overflow {
    width: 50vw;
    display: flex;
    overflow: hidden;
    animation: fadeInUp 0.5s;
    gap: 20px;
    height: 100%;
    padding: 0px 25px 25px 25px;
    @media (max-width: 1480px) {
      width: 40vw;
    }
    @media (max-width: 1130px) {
      width: calc(100vw - 120px);
    }
  }
  .bullets {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
    gap: 8px;
    button {
      min-width: 25px;
      max-width: 10px;
      min-height: 10px;
      max-height: 10px;
      border-radius: 100px;
      background-color: ${({ theme }) => theme.colors.neutral[300]};
      border: none;
      cursor: pointer;
      transition: all 0.5s;
      &.active {
        min-width: 45px;
        background-color: ${({ colorBg }) => colorBg};
        opacity: 1;
      }
    }
  }
`;

export const ContainerPosts = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IPropsTenant>`
  display: flex;
  flex-direction: column;
  gap: 25px;
  flex: 1;
  .preview-post {
    display: flex;
    flex-direction: column;
    max-width: 50vw;
    .head-preview-post {
      display: flex;
      border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      margin-top: 20px;
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      justify-content: center;
      align-items: center;
      img {
        max-width: 100%;
        max-height: 20vh;
      }
    }
    .msg {
      padding: 20px;
      display: flex;
      flex-direction: column;
      max-height: 50vh;
      overflow: auto;
    }
  }
  .overflow {
    flex: 1;
    height: 100%;
    max-height: 360px;
    overflow: auto;
    animation: fadeInUp 0.5s;
    padding: 0px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .post {
      width: 100%;
      display: flex;
      gap: 15px;
      border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
      border-radius: 0px;
      box-sizing: border-box;
      padding: 15px 25px;
      align-items: center;
      .info {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 4px;
        .head-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name {
            font-size: 13px;
            color: ${({ theme }) => theme.colors.neutral[700]};
          }
          span {
            font-size: 11px;
            color: ${({ theme }) => theme.colors.neutral[500]};
          }
        }
        p {
          font-size: 12px;
          color: ${({ theme }) => theme.colors.neutral[600]};
        }
      }
      .preview {
        width: 0px;
        height: 50px;
        border-radius: 8px;
        background-size: cover;
        transition: all 0.2s;
        background-size: cover;
      }
      &:hover {
        background-color: ${({ theme }) => theme.colors.neutral[200]};
        cursor: pointer;
        .preview {
          width: 50px;
        }
      }
    }
  }
`;

export const ContainerGraphs = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IPropsTenant>`
  display: flex;
  flex-direction: column;
  .row {
    flex-wrap: wrap;
    .box-dash {
      height: auto;
      flex: 1;
      min-width: 400px;
    }
  }
  .chart-dash {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    animation: fadeInUp 0.5s;
    .tag {
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      padding: 10px 15px;
      font-size: 13px;
      color: ${({ theme }) => theme.colors.neutral[700]};
      border-radius: 100px;
    }
    .chart-padding {
      padding: 0px 20px 20px 20px;
      box-sizing: border-box;
    }
  }
`;

export const ContainerEmpty = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 15px;
  > i {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.warning[200]};
  }
  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral[600]};
  }
`;
