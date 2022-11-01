import * as PostService from '../../services/PostService.js'

let userInStorage
try {
    userInStorage = JSON.parse(localStorage.getItem('currentUser'))
} catch (e) {
    userInStorage = null
}
export default {
    namespaced: true,
    state () {
        return {
            currentUser: userInStorage,
            userProfile: null
        }
    },
    mutations: {
        SET_CURRENT_USER (state, user) {
            state.currentUser = user
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user))
            }else {
                localStorage.removeItem('currentUser')
            }
        },
        SET_USER_PROFILE (state, user) {
            state.userProfile = user
        }
    },
    actions: {

        async register ({ commit }, user) {
            const res = await PostService.signup(user)
            return res
        },

        async login ({ commit }, user) {
            const res = await PostService.login(user)
            if (res.status === 200) {
                commit('SET_CURRENT_USER', res.data)
                return res
            } else {
                return res
            }
        },

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
                commit('SET_CURRENT_USER', null)
            }
        },

        async logout ({ commit }) {
            commit('SET_CURRENT_USER', null)
        },

        async deleteUser ({ commit }, id) {
            const res = await PostService.deleteUser(id)
            if (res === undefined) {
                const retry = await PostService.deleteUser(id)
                return retry
            } else {
                return res
            }
        },

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