import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


export const LinkSlug = ({ path, children, style, ...rest }: { path: string, style?: CSSProperties, children: any }) => {
  const { slug } = useParams<{ slug?: string }>();

  const finalPath =
    slug && !path.includes("/:slug")
      ? `/${slug}${path.startsWith("/") ? path : `/${path}`}`
      : path;

  return (
    <Link style={style} {...rest} to={finalPath}>{children}</Link>
  )
};
