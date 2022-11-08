import axios from 'axios'

// Création de l'instance d'axios
let instance = null
updateAxiosInstance()

// Récupération de l'utilisateur connecté
export async function getCurrentUser() {
    const storage = JSON.parse(localStorage.getItem('accessUser'))
        if (storage !== null){
            instance.defaults.headers.common['authorization'] = `Bearer ${storage.accessToken}`
            const res = await instance.get('/user/user/myUser')
            return res
        } else {
          return
        }
}

// Récupération du profile utilisateur
export async function getProfile(userId) {
    const res = await instance.get('/user/' + userId)
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

// Intercépte les status 401 afin de maintenir la connexion par le refreshToken
instance.interceptors.response.use((response) => {
    return response
}, async (error) => {
    const originalRequest = error.config
    if (error.config !== undefined && error.config.url !== '/user/refreshToken' && error.response.status === 401 && originalRequest._retry !== true) {
        originalRequest._retry = true
        const access = JSON.parse(localStorage.getItem('accessUser'))
        if (access.refreshToken && access.refreshToken != '') {
            instance.defaults.headers.common['authorization'] = `Bearer ${access.refreshToken}`
            await instance.post('/user/refreshToken')
                .then((res) => {
                    if (res == undefined) {
                        return res.status(401).json({message: 'Utilisateur introuvable.'})
                    }
                    localStorage.setItem('accessUser', JSON.stringify({
                        accessToken: res.data.accessToken,
                        refreshToken: access.refreshToken
                    }))
                    instance.defaults.headers.common['authorization'] = `Bearer ${res.data.accessToken}`
                    originalRequest.headers['authorization'] = `Bearer ${res.data.accessToken}`
                    return instance.request(originalRequest)
                })
                .catch((error) => {
                    localStorage.removeItem('currentUser')
                    return {message: 'Veuillez vous identifier.'}
                })
        }
    }
})
