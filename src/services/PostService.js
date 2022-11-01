import { promiseTimeout } from '@vueuse/shared'
import axios from 'axios'

let instance = null
updateAxiosInstance()

// Récupération du profile utilisateur
export async function getProfile(id) {
    const res = await instance.get('/user/' + id)
    return res
}

// Création d'un nouvel utilisateur
export async function signup(user) {
    try {
        const res = await instance.post('/user/signup', user)
        return res
    } catch (error) {
        return error
    }
}

// Connexion de l'utilisateur
export async function login(user) {
    try {
        const res = await instance.post('/user/login', user)
        instance.defaults.headers.common['authorization'] = `Bearer ${res.data.accessToken}`
        return res
    } catch (error) {
        return error
    }   
}

// Suppression d'un utilisateur
export async function deleteUser(id) {
    try {
        const res = await instance.delete('/user/' + id)
        return res
    } catch (error) {
        return error
    }
}

// Récupération de la liste des utilisateurs
export async function getAllUsers() {
    try {
        const res = await instance.get('/user/')
        return res
    } catch (error) {
        return error
    }
}

/**
 * @param {*} { post, }
 */
// Création d'un post
export async function createPost(post) {
    try {
        const res = await instance.post('/post/create', post)
        return res
    } catch (error) {
        return error
    }
}

// Récupération de la liste des posts
export async function getAllPosts() {
    try {
        const res = await instance.get('/post/')
        return res
    } catch (error) {
        return error
    }
}

// Modification d'un post
export async function modifyPost({id, post}) {
    try {
        const res = await instance.put('/post/' + id, post)
        return res
    } catch (error) {
        return error
    }
}

// Suppression d'un post
export async function deletePost(id) {
    try {
        const res = await instance.delete('/post/' + id)
        return res
    } catch (error) {
        return error
    }
}

// Like et dislike un post
export async function like({id, request}) {
    try {
        const res = await instance.post(`/post/${id}/like`, request)
        return res
    } catch (error) {
        return error
    }
}

// Mise à jour de l'instance d'Axios
export async function updateAxiosInstance () {
    instance = axios.create({
        baseURL: 'http://localhost:3000/api'
    })
}


instance.interceptors.response.use((response) => {
    return response
}, async (error) => {
    const originalRequest = error.config
    if (error.config !== undefined && error.config.url !== '/user/refreshToken' && error.response.status === 401 && originalRequest._retry !== true) {
        originalRequest._retry = true
        const user = JSON.parse(localStorage.getItem('currentUser'))
        if (user.refreshToken && user.refreshToken != '') {
            instance.defaults.headers.common['authorization'] = `Bearer ${user.refreshToken}`
            await instance.post('/user/refreshToken', user)
                .then((res) => {
                    if (res == undefined) {
                        return res.status(401).json({message: 'Utilisateur introuvable.'})
                    }
                    localStorage.setItem('currentUser', JSON.stringify({
                        userId: user.userId,
                        accessToken: res.data.accessToken,
                        refreshToken: user.refreshToken,
                        status: res.data.status
                    }))
                    instance.defaults.headers.common['authorization'] = `Bearer ${res.data.accessToken}`
                    originalRequest.headers['authorization'] = `Bearer ${res.data.accessToken}`
                    return instance.request(originalRequest)
                })
                .catch((error) => {
                    localStorage.removeItem('currentUser')
                    // return Promise.reject(originalRequest)
                    return {message: 'Veuillez vous identifier.'}
                })
        }
    }
})
