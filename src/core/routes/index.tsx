import { useLocation, useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { Suspense, useEffect } from 'react'

export default function Router() {
    const element = useRoutes(routes)

    return (
        <Suspense>
            {element}
        </Suspense>
    )
}

export function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}