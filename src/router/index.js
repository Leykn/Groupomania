import { createRouter, createWebHistory } from 'vue-router'

// Import des pages et components utiliser par une route
import HomePage from '../pages/Home.vue'
const LoginPage = () => import('../pages/Login.vue')
const RegisterPage = () => import('../pages/Register.vue')
const SettingsUser = () => import('../pages/SettingsUser.vue')
const TheProfile = () => import('../components/TheProfile.vue')
const TheModifyUser = () => import('../components/TheModifyUser.vue')
const NotFoundPage = () => import('../pages/NotFound.vue')
const ThePost = () => import('../components/ThePost.vue')
const TheNewPost = () => import('../components/TheNewPost.vue')
const TheModifyPost = () => import('../components/TheModifyPost.vue')
const UserList = () => import('../pages/UserList.vue')
const TheUserList = () => import('../components/TheUserList.vue')

// Définission de chaque route
const routes = [
    {
        path: '/',
        name: 'Home',
        meta: { layout: true },
        component: HomePage,
        beforeEnter: [checkLoggedIn],
        children: [
            {
                path: '/',
                component: ThePost,
                beforeEnter: [checkLoggedIn],
            },
            {
                path: '/create',
                component: TheNewPost,
                beforeEnter: [checkLoggedIn],
            },
            {
                path: '/modify/:id',
                component: TheModifyPost,
                beforeEnter: [checkLoggedIn],
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        meta: { layout: false },
        component: LoginPage,
        beforeEnter: [checkNotLoggedIn],

    },
    {
        path: '/register',
        name: 'Register',
        meta: { layout: false },
        component: RegisterPage,
        beforeEnter: [checkNotLoggedIn],
    },
    {
        path: '/user-list',
        name: 'UserList',
        meta: { layout: true },
        component: UserList,
        beforeEnter: [checkLoggedIn],
        children: [
            {
                path: '/user-list',
                component: TheUserList,
                beforeEnter: [checkLoggedIn],
            }
        ]
    },
    {
        path: '/user',
        name: 'SettingsUser',
        meta: { layout: true },
        component: SettingsUser,
        beforeEnter: [checkLoggedIn],
        children: [
            {
                path: '/user',
                component: TheProfile,
                beforeEnter: [checkLoggedIn],
            },
            {
                path: '/user/modify',
                component: TheModifyUser,
                beforeEnter: [checkLoggedIn]
            }
        ]
    },
    {
        path: '/notfound',
        name: 'NotFound',
        meta: { layout: false },
        component: NotFoundPage
    },
    {
        path: '/:wrongPath(.*)',
        redirect: '/notfound'
    }
]

// Création du router
let router = createRouter({
    history: createWebHistory(),
    routes 
})

// Vérifie que l'utilisateur n'est pas connécté
function checkLoggedIn () {
    if (!localStorage.getItem('accessUser')) {
        return '/login'
    }
}


// Vérifie que l'utilisateur est connécté
function checkNotLoggedIn () {
    if (localStorage.getItem('accessUser')) {
        return '/'
    }
}

// Exportation du router
export default router