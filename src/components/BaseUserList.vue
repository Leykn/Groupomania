<template>
    <article>
        <div class="userInfo">
            <img :src="userImg" alt="Avatar de profil" class="avatar">
            <span class="username">{{ username }}</span>
        </div>
        <div>
            <el-button v-if="$store.state.users.currentUser.status === 'admin'" type="primary" disabled>
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
        </div>
    </article>
</template>

<script>
    import { reactive, toRefs } from 'vue'
    import { useStore } from 'vuex'
    export default {
        inheritAttrs: false,
        props: {
            userId: String,
            username: String,
            imageUrl: String,
        },
        setup(props) {
            const store = useStore()

            const state = reactive({
                userImg: '',
                username: '',
                loading: false,
                color: '#fff'
            })

            // Demande les informations de l'utilisateur en base de donnée
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
                getOneProfile
            }
        },
        mounted() {
            this.getOneProfile()
        }
    }
</script>

<style lang="scss" scoped>
    .el-button{
        padding: 10px 15px;
    }
    .el-icon {
        display: none;
    }
    .btnMargin {
        margin: 0 5px;
    }
    .spanBtn {
        display: inline;
        margin: 0 !important;
    }
    .userInfo {
        display: flex;
        align-items: center;
    }
    .username {
        font-weight: bold;
        margin: 5px;
    }
    @media screen and (max-width: 767px) {
        .el-button{
            padding: 10px 5px;
        }
        .el-icon {
            display: inline-flex;
        }
        .spanBtn {
            display: none;
        }
    }
</style>