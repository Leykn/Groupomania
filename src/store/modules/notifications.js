import { v4 as uuid } from '@lukeed/uuid'

export default {
    namespaced: true,
    state () {
        return {
            history: [],
            notifier: null
        }
    },
    mutations: {
        // Pour l'utilisation de $notify
        SET_NOTIFIER (state, value) {
            state.notifier = value
        },
        // Ajout de la notification
        ADD_NOTIFICATION (state, newNotification) {
            state.history.push(newNotification)
        }
    },
    actions: {

        // Enregistrement de la notification
        saveNotification ({ commit }, element) {
            const ID = uuid()
            commit('ADD_NOTIFICATION', {
                id: ID,
                startTime: Date.now(),
                element
            })
            return ID
        },

        /**
         * @param {*} { state , dispatch }
         * @param {*} { type, title, message, ...}
         */
        // Message de notification custom
        sendCustom ({ state, dispatch }, options ) {
            const element = state.notifier({
                offset: 50,
                duration: 3000,
                ...options
            })
            return dispatch('saveNotification', element)
        },

        // Message de notification d'erreur
        sendError ({ dispatch }, options ) {
            return dispatch('sendCustom', {
                type: 'error',
                ...options
            })
        },

        // Message de notification de succès
        sendSuccess ({ dispatch }, options ) {
            return dispatch('sendCustom', {
                type: 'success',
                ...options
            })
        },

        // Message de notification d'avertissement
        sendWarning ({ dispatch }, options ) {
            return dispatch('sendCustom', {
                type: 'warning',
                ...options
            })
        }
    },
    getters: {
        // Récupération de la notification spécifié
        getNotificationByID: (state) => (id) => {
            return state.history.find(notification => notification.id === id)
        }
    }
}