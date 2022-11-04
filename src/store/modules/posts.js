import * as PostService from '../../services/PostService.js'

export default {
    namespaced: true,
    state() {
        return {
            editPost: {
                id: '',
                title: '',
                content: '',
                imageUrl: ''
            }
        }
    },
    mutations: {
        SET_EDIT_POST (state, post) {
            state.editPost = post
        }
    },
    actions: {
        async createPost ({ commit }, post) {
            const res = await PostService.createPost(post)
            if (res === undefined) {
                const retry = await PostService.createPost(post)
                return retry
            } else {
                return res
            }
        },

        async getAllPosts ({ commit }) {
            const res = await PostService.getAllPosts()
            if (res === undefined) {
                const retry = await PostService.getAllPosts()
                return retry
            } else {
                return res
            }
        },

        async deletePost ({ commit }, id) {
            const res = await PostService.deletePost(id)
            if (res === undefined) {
                const retry = await PostService.deletePost(id)
                return retry
            } else {
                return res
            }
        },

        async like ({ commit }, {id, request}) {
            const res = await PostService.like({id, request})
            if (res === undefined) {
                const retry = await PostService.like({id, request})
                return retry
            } else {
                return res
            }
        },
    }
}