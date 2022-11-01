<template>
    <article>
        <div class="postFormatDate">
            <div class="postUserInfo">
                <img :src="userImg" alt="Avatar de profil" class="avatar">
                <span class="postUsername">{{ username }}</span>
            </div>
            <span class="postDate">{{ fullDateFormatter.format(date)}}</span>
        </div>
        <div>
            <h3>{{ title }}</h3>
            <div class="contentPost">
                <img v-if="imageUrl != ' '" :src="imageUrl" alt="">
                <p>{{ content }}</p>
            </div>
        </div>
        <div class="row">
            <span class="like">
                <img @click="liked" :src="postLikedSvg" alt="Boutton like">
                {{ likeCount }}
            </span>
            <div>
                <el-button v-if="$store.state.users.currentUser.userId === userId || $store.state.users.currentUser.status === 'admin'" @click="modifyPost" type="primary">
                    <el-tooltip
                        class="box-item"
                        effect="light"
                        content="Éditer"
                        placement="bottom"
                    >
                        <el-icon :size="20" :color="color">
                            <Edit />
                        </el-icon>
                    </el-tooltip>
                    <span class="spanBtn">Éditer</span>
                </el-button>
                <el-button v-if="$store.state.users.currentUser.userId === userId || $store.state.users.currentUser.status === 'admin'" @click="dialogVisible = true" type="primary">
                    <el-tooltip
                        class="box-item"
                        effect="light"
                        content="Supprimer"
                        placement="bottom"
                    >
                        <el-icon :size="20" :color="color">
                            <Delete />
                        </el-icon>
                    </el-tooltip>
                    <span class="spanBtn">Supprimer</span>
                </el-button>
            </div>
        </div>
        <el-dialog
            title="Confirmation de suppression"
            v-model="dialogVisible"
            width="30%">
            <span>Êtes-vous sûr de vouloir supprimer ce message ?</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Annuler</el-button>
                    <el-button type="danger" @click="deletePost" :loading="loading">Confirmer</el-button>
                </span>
            </template>
        </el-dialog>
    </article>
</template>

<script>
    import { reactive, toRefs } from 'vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    export default {
        inheritAttrs: false,
        props: {
            id: String,
            title: String,
            content: String,
            imageUrl: String,
            date: Number,
            like: Number,
            userId: String,
            usersLiked: Array
        },
        setup(props, { emit }) {
            const router = useRouter()
            const store = useStore()

            const state = reactive({
                fullDateFormatter: Intl.DateTimeFormat('fr', { dateStyle: 'medium' }),
                userImg: '',
                username: '',
                postLikedSvg: '',
                likeCount: props.like,
                dialogVisible: false,
                loading: false,
                color: '#fff'
            })

            const usersLiked = props.usersLiked
            

            const post = {
                id: props.id,
                title: props.title,
                content: props.content,
                imageUrl: props.imageUrl
            }

            const modifyPost = () => {
                store.commit('posts/SET_EDIT_POST', post)
                router.push(`/modify/${props.id}`)
            }

            const id = props.id

            const deletePost = async () => {
                const res = await store.dispatch('posts/deletePost', id)
                if (res.status === 200) {
                    store.dispatch('notifications/sendSuccess', {
                    title: 'Succès',
                    message: 'Message supprimé.'
                    })
                    emit('updatePostList')
                    state.dialogVisible = false
                    router.push('/')
                }
            }

            const liked = async () => {
                let like = ''
                const userId = store.state.users.currentUser.userId
                if (usersLiked.length === 0) {
                    like = 1
                    let request = { userId: userId, like: like }
                    const res = await store.dispatch('posts/like', {id, request})
                    if (res.status === 200) {
                        state.likeCount++
                        usersLiked.push(userId)
                        postLiked()
                    } else {
                        store.dispatch('notifications/sendError', {
                            title: 'Erreur',
                            message: res.response.data.message
                        })
                    }
                } else {
                    const isliked = () => {
                        const find = usersLiked.find(element => element === userId)
                        if (find == undefined) {
                            return like = 1
                        } else {
                            return like = 0
                        }
                    }
                    isliked()
                    let request = { userId: userId, like: like }
                    const res = await store.dispatch('posts/like', {id, request})
                    if (res.status === 200) {
                        if (like === 0) {
                            const userUnlike = usersLiked.findIndex(element => element = userId)
                            state.likeCount--
                            usersLiked.splice(userUnlike)
                            postLiked()
                        } else {
                            state.likeCount++
                            usersLiked.push(userId)
                            postLiked()
                        }
                    } else {
                        store.dispatch('notifications/sendError', {
                            title: 'Erreur',
                            message: res.response.data.message
                        })
                    }
                }
            }

            const postLiked = () => {
                const userId = store.state.users.currentUser.userId
                if (usersLiked.length === 0) {
                    return state.postLikedSvg = '../src/assets/like1.svg'
                } else {
                    const find = usersLiked.find(element => element === userId)
                    if (find == undefined) {
                        return state.postLikedSvg = '../src/assets/like1.svg'
                    } else {
                        return state.postLikedSvg = '../src/assets/like2.svg'
                    }
                }
            }

            const getOneProfile = async () => {
                const userId = props.userId
                const res = await store.dispatch('users/getProfile', userId)
                if (res.status === 200) {
                    state.userImg = res.data.imageUrl
                    state.username = res.data.username
                    return
                }
            }

            return {
                ...toRefs(state),
                getOneProfile,
                modifyPost,
                deletePost,
                liked,
                postLiked,
            }
        },
        mounted() {
            this.getOneProfile()
            this.postLiked()
        }
    }
</script>

<style lang="scss" scoped>
    h3 {
        margin: 0 0 20px 0;
    }
    p {
        display: flex;
        justify-content: flex-start;
        margin: 0 10px 20px 10px;
    }
    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
    }
    .contentPost {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 5px;
    }
    .postUserInfo {
        display: flex;
        align-items: center;
    }
    .postUsername {
        font-weight: bold;
        margin: 5px;
    }
    .postFormatDate {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;
    }
    .like {
        display: flex;
        align-items: center;
        & img {
            width: 30px;
            height: 30px;
            margin-right: 5px;
            &:hover {
                cursor: pointer;
            }
        }
    }
    .el-button{
        padding: 10px 15px;
    }
    .el-icon {
        display: none;
    }
    .spanBtn {
        display: inline;
        margin: 0 !important;
    }

    @media screen and (max-width: 767px) {
        .contentPost {
            flex-direction: column;
        }
        .el-button{
            padding: 10px 5px;
        }
        .el-icon {
            display: inline-flex;
        }
        .spanBtn {
            display: none;
        }
        .postUserInfo {
            flex-direction: column;
            align-items: flex-start;
            & img {
                order: 2;
            }
            & span {
                order: 1;
            }
        }
        .postUsername {
            white-space: nowrap;
            overflow-x: hidden;
            text-overflow: ellipsis;
        }
        .postDate {
            white-space: nowrap;
            overflow-x: hidden;
            text-overflow: ellipsis;
        }
    }
</style>