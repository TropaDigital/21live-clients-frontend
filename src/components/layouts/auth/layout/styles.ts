import styled from "styled-components";
import { theme } from "../../../../assets/theme/theme";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background.surface};
  min-height: 100vh;
  display: flex;
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    > header {
      height: 70px;
      padding: 10px 30px;
      box-sizing: border-box;
      background-color: ${({ theme }) => theme.colors.background.default};
      border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      display: flex;
      align-items: center;
      gap: 15px;
      @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        justify-content: space-between;
        width: 100%;
        max-width: 100vw;
      }
      .sidebar-toggle {
        display: flex;
        border: none;
        background-color: transparent;
        padding: 0px;
        cursor: pointer;
        svg {
          width: 20px;
          height: 20px;
        }
      }
      .search {
        display: flex;
        align-items: center;
        background-color: ${({ theme }) => theme.colors.neutral[200]};
        height: 40px;
        padding: 0px 15px;
        border-radius: 14px;
        gap: 5px;
        flex: 1;
        @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
          flex: 1;
          width: 100%;
        }
        i {
          display: flex;
          color: ${({ theme }) => theme.colors.neutral[700]};
        }
        input {
          background-color: transparent;
          border: none;
          flex: 1;
          height: 100%;
          outline: none;
          @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
            flex: 1;
          }
        }
      }
    }
    > section {
      flex: 1;
      max-height: calc(100vh - 70px);
      max-width: 100vw;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3); /* opacidade aqui */
        border-radius: 0px;
        transition: background-color 0.2s;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
      /* Firefox */
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    }
  }
`;

interface IPropsContainerSidebar {
  colorBg?: string;
  colorText?: string;
  color?: string;
  width: string;
  opened: boolean;
  openedMobile: boolean;
}
export const ContainerSidebar = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "color",
      "colorBg",
      "colorText",
      "width",
      "opened",
      "openedMobile",
    ].includes(prop),
})<IPropsContainerSidebar>`
  background: ${({ theme }) => theme.colors.background.default};
  min-width: ${({ opened }) => (opened ? `280px` : `90px`)};
  width: ${({ width, opened }) => (opened ? width : `90px`)};
  height: calc(100vh);
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition: 0.2s;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: fixed;
    z-index: 10;
    left: ${({ openedMobile }) => (openedMobile ? "0%" : "-100%")};
  }
  .tenant-info {
    height: 70px;
    box-sizing: border-box;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    padding: 10px 20px;
    align-items: center;
    display: flex;
    gap: 15px;
    justify-content: ${({ opened }) => (opened ? "flex-start" : "center")};
    .tenant-text {
      display: ${({ opened }) => (opened ? "flex" : "none")};
      flex-direction: column;
      gap: 0px;
      h1 {
        margin: 0px;
        padding: 0px;
        font-size: 17px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.neutral[800]};
      }
      p {
        margin: 0px;
        padding: 0px;
        font-size: 12px;
        color: ${({ theme }) => theme.colors.neutral[600]};
      }
    }
  }
  .menu {
    margin: 0px;
    padding: 20px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .title-session {
      margin: 0px;
      padding: 0px;
      text-transform: uppercase;
      font-size: 12px;
      color: ${({ theme }) => theme.colors.neutral[600]};
      padding-left: 15px;
      font-weight: 700;
      display: ${({ opened }) => (opened ? "flex" : "none")};
    }
    &.folders {
      border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
      overflow: auto;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3); /* opacidade aqui */
        border-radius: 4px;
        transition: background-color 0.2s;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
      /* Firefox */
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    }
  }
  .resize {
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 100%;
    cursor: col-resize;
    transition: background 0.2s;
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &:active {
      background: rgba(0, 0, 0, 0.2);
    }
  }
`;

interface IPropsMenuSidebarButton {
  active?: boolean;
  color?: string;
  colorText?: string;
  colorBg?: string;
  sortable?: boolean;
  opened: boolean;
  drop?: boolean;
}

export const ContainerMenuSidebarButton = styled.li.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "active",
      "color",
      "colorBg",
      "sortable",
      "opened",
      "drop",
      "colorText",
    ].includes(prop),
})<IPropsMenuSidebarButton>`
  display: flex;
  background-color: transparent;
  border-radius: 12px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    transition: all 0.4s;
    width: ${({ active }) => (active ? "100%" : "0%")};
    height: 100%;
    border-radius: 12px;
    background-color: ${({ active, colorBg }) =>
      active ? colorBg : "transparent"};
  }
  a {
    position: relative;
    z-index: 2;
    display: flex;
    color: ${({ active, colorText }) =>
      active ? colorText : theme.colors.neutral[700]};
    text-decoration: none;
    padding: ${({ opened }) => (opened ? " 13px 15px" : " 13px 0px")};
    align-items: center;
    gap: 10px;
    flex: 1;
    transition: all 0.4s;
    .icon {
      display: flex;
      width: ${({ opened }) => (opened ? " auto" : " 100%")};
      justify-content: center;
      color: ${({ active, colorBg, colorText }) =>
        active ? colorText : colorBg};
      svg {
        width: 23px;
        height: 23px;
      }
    }
    .name {
      font-size: 14px;
      font-weight: 500;
      flex: 1;
      display: ${({ opened }) => (opened ? "flex" : "none")};
    }
    .total {
      background-color: ${({ theme }) => theme.colors.error[500]};
      min-width: ${({ opened }) => (opened ? "25px" : "20px")};
      min-height: ${({ opened }) => (opened ? "25px" : "20px")};
      border-radius: 100px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      position: ${({ opened }) => (opened ? "relative" : " absolute")};
      right: ${({ opened }) => (opened ? "0px" : " -10px")};
    }
  }
  &:hover {
    background-color: ${({ theme, active }) =>
      active ? "transparent" : theme.colors.neutral[100]};
  }
`;

export const ContainerMenuSidebarFolder = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "color",
      "colorBg",
      "colorText",
      "loading",
      "drop",
      "active",
      "sortable",
      "opened",
    ].includes(prop),
})<IPropsMenuSidebarButton>`
  display: flex;
  background-color: transparent;
  border-radius: 12px;
  position: relative;
  border: 1px solid ${({ drop, color }) => (drop ? color : "transparent")};
  a {
    position: relative;
    z-index: 2;
    display: flex;
    color: ${({ active, color }) =>
      active ? color : theme.colors.neutral[700]};
    text-decoration: none;
    padding: ${({ opened }) => (opened ? "10px 15px" : "5px 0px")};
    align-items: center;
    gap: 10px;
    flex: 1;
    transition: all 0.4s;
    .icon {
      display: flex;
      background: ${({ active, color }) => (active ? color : color)};
      width: ${({ opened }) => (opened ? "35px" : "50px")};
      height: ${({ opened }) => (opened ? "35px" : "50px")};
      min-width: ${({ opened }) => (opened ? "35px" : "50px")};
      min-height: ${({ opened }) => (opened ? "35px" : "50px")};
      border-radius: 10px;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: ${({ opened }) => (opened ? "15px" : "20px")};
      transition: all 0.2s;
    }
    .name {
      font-size: 14px;
      font-weight: 500;
      display: ${({ opened }) => (opened ? "flex" : "none")};
    }
    .sortable {
      display: flex;
      width: 0px;
      max-width: 0px;
      height: 30px;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      transition: all 0.2s;
      border-radius: 10px;
      margin-left: -25px;
      position: absolute;
      background-color: ${({ theme }) => theme.colors.neutral[300]};
      svg {
        width: 15px;
        height: 15px;
      }
    }
  }
  &:hover {
    &.hover {
      background-color: ${({ theme, active }) =>
        active ? "transparent" : theme.colors.neutral[100]};
      .icon {
        margin-left: ${({ sortable }) => (sortable ? "15px" : "0px")};
      }
      .sortable {
        display: ${({ sortable }) => (sortable ? "flex" : "none")};
        width: 30px;
        max-width: 30px;
      }
    }
  }
`;

export const ContainerMenuProfile = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  .btn-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 10px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral[200]};
    }
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: 0px;
      border-radius: 100px;
    }
    .photo {
      width: 34px;
      height: 34px;
      border-radius: 100px;
      background-size: cover;
      background-color: ${({ theme }) => theme.colors.neutral[500]};
    }
    .text {
      display: flex;
      flex-direction: column;
      color: ${({ theme }) => theme.colors.neutral[700]};
      @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        display: none;
      }
      b {
        font-size: 12px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .submenu {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 10px;
    right: 0px;
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.05) 0px 5px 10px 5px;
    position: absolute;
    top: 25px;
    padding: 20px;
    opacity: 1;
    visibility: visible;
    transition: 0.2s all;
    list-style: none;
    z-index: 999;
    visibility: hidden;
    opacity: 0;
    &.opened {
      top: 35px;
      visibility: visible;
      opacity: 1;
    }
    li {
      a {
        display: flex;
        align-items: center;
        padding-bottom: 14px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
        gap: 10px;
        text-decoration: none;
        color: ${({ theme }) => theme.colors.neutral[600]};
        font-size: 14px;
        &:hover {
          color: ${({ theme }) => theme.colors.neutral[800]};
        }
        i {
          display: flex;
        }
      }
      &:last-child {
        a {
          padding-bottom: 0px;
          border-bottom: 0px;
        }
      }
    }
  }
`;
