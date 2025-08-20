export const getPathSegments = () => window.location.pathname.split('/');
export const getSlug = () => getPathSegments()[1] || '';
export const getPage = () => getPathSegments()[2] || '';
export const getPageParams = () => getPathSegments()[3] || '';

export const getBaseUrl = () => {
    return `${window.location.protocol}//${window.location.host}`;
};