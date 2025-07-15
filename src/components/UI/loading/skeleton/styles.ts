import styled from "styled-components";

type SkeletonProps = {
  height: string;
  width?: string;
  widthAuto?: boolean;
  borderRadius?: string
};

export const Skeleton = styled.div.withConfig({
  shouldForwardProp: (prop) => !["height", "width", "widthAuto", "borderRadius"].includes(prop),
})<SkeletonProps>`
  border-radius: ${({borderRadius}) => borderRadius ? borderRadius : '4px'};
  animation: shimmer 1.2s ease-in-out infinite;
  height: ${({ height }) => height};
  min-height: ${({ height }) => height};
  width: ${({ width, widthAuto }) =>
    widthAuto
      ? `${Math.floor(Math.random() * (100 - 30 + 1)) + 30}%`
      : width || "100%"};

  @keyframes shimmer {
    0% {
      background-color: ${({ theme }) => theme.colors.neutral[100]};
    }
    50% {
      background-color: ${({ theme }) => theme.colors.neutral[300]};
    }
    100% {
      background-color: ${({ theme }) => theme.colors.neutral[100]};
    }
  }
`;
