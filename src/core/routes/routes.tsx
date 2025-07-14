import { lazy } from 'react'

import AuthLayout from '../../components/layouts/auth/layout'

import { AuthRoute } from './auth-route'
import { ModalExpireToken } from '../../components/modules/modal-expire-token'
import IndexPermission from '../../pages/index-permission'

const Home = lazy(() => import('../../pages/home'))
const Favorites = lazy(() => import('../../pages/favorites'))
const Login = lazy(() => import('../../pages/login'))
const Folder = lazy(() => import('../../pages/folder'))
const Dashboard = lazy(() => import('../../pages/dashboard'))
const NotFound = lazy(() => import('../../pages/errors/404'))

export const routes = [
    {
        path: '/',
        element: <Home />,
        name: 'Home',
        index: true
    },
    {
        path: '/:slug/login',
        element: <Login />
    },
    {
        path: '/:slug',
        element: (
            <AuthRoute>
                <>
                    <ModalExpireToken />
                    <AuthLayout />
                </>
            </AuthRoute>
        ),
        children: [
            {
                path: '',
                element: <IndexPermission />,
                index: true,
            },
            {
                path: 'folders',
                element: <Folder />
            },
            {
                path: 'folders/:id',
                element: <Folder />
            },
            {
                path: 'folders/bookmarks',
                element: <Favorites />
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />,
        name: '404'
    }
]