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
    @media (max-width: 400px) {
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    }
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

    &.transparent {
      background-color: transparent;
      border: none;
      .head {
        padding: 0px 0px 20px 0px;
        i {
          background-color: ${({ theme }) => theme.colors.neutral[300]};
        }
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
    min-width: 350px;
    max-width: 780px;
    .head-preview-post {
      display: flex;
      border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      margin-top: 20px;
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      justify-content: center;
      align-items: center;
      .thumb {
        width: 100%;
        height: 200px;
        background-size: auto 100%;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        background-color: ${({ color }) => color};
        position: relative;
        span {
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          color: white;
          border-radius: 20px;
          padding: 10px;
          margin: 15px;
          display: flex;
          font-size: 12px;
        }
        .no-image {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            width: 90px;
            height: 90px;
            border-radius: 100px;
            background-color: ${({ theme }) => theme.colors.background.default};
            box-shadow: 0px 0px 30px 5px
              ${({ theme }) => theme.colors.background.default};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${({ color }) => color};
          }
        }
      }
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
  .post {
    display: flex;
    flex-direction: column;
    gap: 15px;
    cursor: pointer;
    width: 330px;
    .image {
      width: 330px;
      height: 115px;
      border-radius: 20px;
      position: relative;
      .blur {
        width: 100%;
        height: 100%;
        filter: blur(40px);
        position: absolute;
        background-size: cover;
        transform: scale(0.7);
        margin-top: 20px;
        border-radius: 20px;
        background-position: center;
        background-color: ${({ color }) => color};
      }
      .thumb {
        width: 100%;
        height: 100%;
        position: absolute;
        background-size: cover;
        border-radius: 20px;
        background-position: center;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        background-color: ${({ color }) => color};
        position: relative;
        span {
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          color: white;
          border-radius: 20px;
          padding: 10px;
          margin: 15px;
          display: flex;
          font-size: 12px;
        }
        .no-image {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            width: 90px;
            height: 90px;
            border-radius: 100px;
            background-color: ${({ theme }) => theme.colors.background.default};
            box-shadow: 0px 0px 30px 5px
              ${({ theme }) => theme.colors.background.default};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${({ color }) => color};
          }
        }
      }
    }
    .infos {
      display: flex;
      flex-direction: column;
      gap: 5px;
      .title {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.neutral[700]};
        font-weight: 500;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .user {
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 5px;
        color: ${({ theme }) => theme.colors.neutral[600]};
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
      min-width: 350px;
      @media (max-width: 400px) {
        min-width: 300px;
        width: 100%;
      }
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

export const ContainerOverflowCarrousel = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["color", "colorBg", "colorText"].includes(prop),
})<IPropsTenant>`
  display: flex;
  flex-direction: column;
  .overflow {
    display: flex;
    overflow: hidden;
    gap: 20px;
    height: 100%;
    padding: 0px 0px 0px 0px;
    @media (max-width: 400px) {
      overflow: auto;
    }
  }
  .bullets {
    display: flex;
    justify-content: center;
    margin: 25px 0px;
    gap: 8px;
    @media (max-width: 400px) {
      display: none;
    }
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
