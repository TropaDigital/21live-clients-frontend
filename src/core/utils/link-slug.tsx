import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


export const LinkSlug = ({ path, children, ...rest }: { path: string, children: any }) => {
  const { slug } = useParams<{ slug?: string }>();

  const finalPath =
    slug && !path.includes("/:slug")
      ? `/${slug}${path.startsWith("/") ? path : `/${path}`}`
      : path;

  return (
    <Link {...rest} to={finalPath}>{children}</Link>
  )
};
