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
    // Fonction de modification d'élément du state ( commit )
    mutations: {
        // Récupération des données du post à éditer
        SET_EDIT_POST (state, post) {
            state.editPost = post
        }
    },
    // Fonction utilisant le state pour les appels API
    actions: {

        // Création d'un nouveau message
        async createPost ({ commit }, post) {
            const res = await PostService.createPost(post)
            if (res === undefined) {
                const retry = await PostService.createPost(post)
                return retry
            } else {
                return res
            }
        },

        // Récupération de la liste des messages
        async getAllPosts ({ commit }) {
            const res = await PostService.getAllPosts()
            if (res === undefined) {
                const retry = await PostService.getAllPosts()
                return retry
            } else {
                return res
            }
        },

        // Suppression du message spécifié
        async deletePost ({ commit }, id) {
            const res = await PostService.deletePost(id)
            if (res === undefined) {
                const retry = await PostService.deletePost(id)
                return retry
            } else {
                return res
            }
        },

        // Ajout ou retrait de like
        async like ({ commit }, {id, request}) {
            const res = await PostService.like({id, request})
            if (res === undefined) {
                const retry = await PostService.like({id, request})
                return retry
            } else {
                return res
            }
        }
    }
}