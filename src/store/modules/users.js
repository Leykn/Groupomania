import * as PostService from '../../services/PostService.js'

let storage = localStorage.getItem('accessUser')
let accessInStorage = storage ? JSON.parse(storage) : null

export default {
    namespaced: true,
    state () {
        return {
            accessUser: accessInStorage,
            currentUser: {
                userId: '',
                status: ''
            },
            userProfile: null
        }
    },
    mutations: {
        // Met à jour les données d'accès à la base de donnée
        SET_ACCESS_USER (state, access) {
            state.accessUser = access
            if (access) {
                localStorage.setItem('accessUser', JSON.stringify(access))
            }else {
                localStorage.removeItem('accessUser')
            }
        },
        // Met à jour l'utilisateur actuel
        SET_CURRENT_USER (state, user) {
            state.currentUser = user
        },
        // Met à jour les données du profile utilisateur actuel
        SET_USER_PROFILE (state, user) {
            state.userProfile = user
        }
    },
    actions: {

        // Récupération de l'utilisateur actuel
        async getCurrentUser ({ commit }) {
            const res = await PostService.getCurrentUser()
            if (res == undefined) {
                const retry = await PostService.getCurrentUser()
                if (retry == undefined) {
                    commit('SET_ACCESS_USER')
                } else {
                    commit('SET_CURRENT_USER', {
                        userId: retry.data._id,
                        status: retry.data.status
                    })
                    return retry
                }
            } else if (res.status === 200) {
                commit('SET_CURRENT_USER', {
                    userId: res.data._id,
                    status: res.data.status
                })
                return res
            }
            
        },

        // Création d'un nouvel utilisateur 
        async register ({ commit }, user) {
            const res = await PostService.signup(user)
            return res
        },

        // Connexion de l'utilisateur
        async login ({ commit }, user) {
            const res = await PostService.login(user)
            if (res.status === 200) {
                commit('SET_ACCESS_USER', {
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken
                })
                commit('SET_CURRENT_USER', {
                    userId: res.data.userId,
                    status: res.data.status
                })
                return res
            } else {
                return res
            }
        },

        // Récupération des données d'utilisateur spécifié
        async getProfile ({ commit }, userId) {
            const res = await PostService.getProfile(userId)
            if (res == undefined) {
                const retry = await PostService.getProfile(userId)
                if (retry.status === 200) {
                    commit('SET_USER_PROFILE', retry.data)
                    return retry
                }
            } else if (res.status === 200) {
                commit('SET_USER_PROFILE', res.data)
                return res
            } else {
                commit('SET_ACCESS_USER', null)
            }
        },

        // Déconnexion de l'utilisateur
        async logout ({ commit }) {
            commit('SET_ACCESS_USER', null)
        },

        // Suppression de l'utilisateur
        async deleteUser ({ commit }, id) {
            const res = await PostService.deleteUser(id)
            if (res === undefined) {
                const retry = await PostService.deleteUser(id)
                return retry
            } else {
                return res
            }
        },

        // Récupération de la liste des utilisateurs
        async getAllUsers ({ commit }) {
            const res = await PostService.getAllUsers()
            if (res === undefined) {
                const retry = await PostService.getAllUsers()
                return retry
            } else {
                return res
            }
        },
    }
}