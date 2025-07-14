import styled from "styled-components";

interface IProps {
  color?: string;
  colorText?: string;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["color", "colorText"].includes(prop),
})<IProps>`
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
  .container {
    width: 1300px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    .head {
      display: flex;
      width: 100%;
      .logo {
        max-height: 100px;
        @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
          max-height: 30px;
        }
      }
    }
    .card {
      width: 100%;
      background-color: ${({ theme }) => theme.colors.background.surface};
      height: 600px;
      display: flex;
      border-radius: 40px;
      overflow: hidden;
      box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.1);
      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        height: auto;
      }
      form {
        flex: 1;
        padding: 60px;
        gap: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
          padding: 30px;
        }
        .head-form {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0px;
          h1 {
            font-size: 28px;
            color: ${({ theme }) => theme.colors.neutral[900]};
            margin: 0px;
            padding: 0px;
            font-weight: 800;
          }
          p {
            color: ${({ theme }) => theme.colors.neutral[700]};
            margin: 0px;
            padding: 0px;
            font-size: 14px;
          }
        }
        .card-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .error {
            padding: 15px;
            background-color: ${({ theme }) => theme.colors.error[100]};
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            animation: fadeInUp 0.5s;
            gap: 10px;
            font-size: 13px;
            color: ${({ theme }) => theme.colors.error[800]};
            svg {
              width: 20px;
              height: 20px;
            }
            p {
              margin: 0px;
            }
          }
          .inputs {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .after-input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            a {
              font-size: 13px;
              color: ${({ color }) => color};
            }
          }
          .or-line {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin: 15px 0px;
            span {
              text-transform: uppercase;
              color: ${({ theme }) => theme.colors.neutral[600]};
              font-size: 13px;
            }
            &:after,
            &:before {
              display: flex;
              flex: 1;
              content: "";
              height: 1px;
              background-color: ${({ theme }) => theme.colors.neutral[300]};
            }
          }
        }
      }
      .bg {
        width: 60%;
        height: 100%;
        background-size: cover;
        background-position: right;
        background-repeat: no-repeat;
        display: flex;
        justify-content: flex-start;
        @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
          display: none;
        }
      }
    }
  }
`;
