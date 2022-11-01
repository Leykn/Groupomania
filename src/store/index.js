import { createLogger, createStore } from "vuex";
import NotificationsModule from './modules/notifications.js'
import UsersModule from './modules/users.js'
import PostsModule from './modules/posts.js'

const store = createStore({
    modules: {
        notifications: NotificationsModule,
        users: UsersModule,
        posts: PostsModule
    },
    plugins: import.meta.env.MODE !== 'production' ? [createLogger()] : []
})

export default store