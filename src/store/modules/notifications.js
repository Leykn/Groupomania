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
        SET_NOTIFIER (state, value) {
            state.notifier = value
        },
        ADD_NOTIFICATION (state, newNotification) {
            state.history.push(newNotification)
        }
    },
    actions: {

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
        sendCustom ({ state, dispatch }, options ) {
            const element = state.notifier({
                offset: 50,
                duration: 3000,
                ...options
            })
            return dispatch('saveNotification', element)
        },

        sendError ({ dispatch }, options ) {
            return dispatch('sendCustom', {
                type: 'error',
                ...options
            })
        },

        sendSuccess ({ dispatch }, options ) {
            return dispatch('sendCustom', {
                type: 'success',
                ...options
            })
        },

        sendWarning ({ dispatch }, options ) {
            return dispatch('sendCustom', {
                type: 'warning',
                ...options
            })
        }
    },
    getters: {
        getNotificationByID: (state) => (id) => {
            return state.history.find(notification => notification.id === id)
        }
    }
}