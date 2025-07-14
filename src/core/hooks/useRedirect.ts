import { useNavigate, useParams } from "react-router-dom";

interface RedirectOptions {
  state?: Record<string, unknown>;
  replace?: boolean;
}

export const useRedirect = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const redirectSlug = (path: string, options?: RedirectOptions) => {
    // Adiciona o slug ao path se existir e não estiver presente
    const finalPath =
      slug && !path.includes("/:slug")
        ? `/${slug}${path.startsWith("/") ? path : `/${path}`}`
        : path;

    navigate(finalPath, {
      state: options?.state,
      replace: options?.replace ?? false,
    });
  };

  return { redirectSlug };
};
