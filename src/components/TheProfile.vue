<template>
    <el-scrollbar class="scroll">
        <div class="row" v-if="$store.state.users.currentUser">
            <div class="nameAndPicture">
                <h2>{{ username }}</h2>
                <img :src="imageUrl" alt="Photo de profil" class="avatarProfile">
            </div>
            <div class="bio">
                <div class="description">
                    <h3>Déscription</h3>
                    {{ bio }}
                </div>
            </div>
        </div>
        <p>
            <el-button @click="modifyUser" type="primary">Modifier ou Supprimer</el-button>
        </p>
    </el-scrollbar>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    setup () {
        const store = useStore()
        const router = useRouter()

        const state = reactive({
            userId: store.state.users.currentUser.userId,
            imageUrl: '',
            username: '',
            bio: '',
            dialogVisible: false,
            loading: false
        })

        // Demande les informations de l'utilisateur actuel
        const getCurrentUser = async () => {
            const res = await store.dispatch('users/getCurrentUser')
            if (res.status === 200) {
                store.commit('users/SET_USER_PROFILE', res.data)
                state.imageUrl = store.state.users.userProfile.imageUrl
                state.username = store.state.users.userProfile.username
                if (store.state.users.userProfile.bio === ' ') {
                    state.bio = "Aucune description enregistré." 
                } else {
                    state.bio = store.state.users.userProfile.bio
                }
                return
            } else {
                store.dispatch('notifications/sendError', {
                    title: 'Erreur',
                    message: res.data.message
                })
            }
        }

        // Redirige l'utilisateur vers la modification du profile
        const modifyUser = () => {
            router.push('/user/modify')
        }
        
        return {
            ...toRefs(state),
            getCurrentUser,
            modifyUser
        }
    },
    mounted() {
        this.getCurrentUser()
    },
}
</script>

<style lang="scss" scoped>
    .row {
        display: flex;
    }
    .nameAndPicture {
        width: 33%;
    }
    .bio {
        width: 67%
    }
    .description {
        margin-top: 40px;
    }
    .el-scrollbar {
        height: calc(100vh - 100px);
        padding: 0px;
    }
    .avatarProfile {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 50px;
        overflow: hidden;
    }
    @media screen and (max-width: 767px) {
        .row {
            flex-direction: column;
        }
        .nameAndPicture {
            width: 100%;
        }
        .bio {
            width: 100%;
        }
        .avatarProfile {
            width: 50px;
            height: 50px;
            border-radius: 25px;
        }
    }
</style>