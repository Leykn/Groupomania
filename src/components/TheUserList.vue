<template>
    <el-scrollbar class="scroll">
        <!-- Implémentation de la liste des utilisateurs -->
        <ul>
            <li v-for="user, index in userList" :key="index">
                <BaseUserList
                    :userId="user._id"
                    :username="user.username"
                    :imageUrl="user.imageUrl"
                >
                </BaseUserList>
            </li>
        </ul>
    </el-scrollbar >
</template>

<script>
    import { reactive, toRefs } from 'vue'
    import BaseUserList from './BaseUserList.vue'
    import { useStore } from 'vuex'
    export default {
        components: {
            BaseUserList
        },
        setup() {
            const store = useStore()

            const state = reactive({
                userList: []
            })

            // Récupération de la liste d'utilisateur
            const getAllUsers = async () => {
                const res = await store.dispatch('users/getAllUsers')
                for (let user of res.data) {
                    state.userList.push(user)
                }
            }

            return {
                ...toRefs(state),
                getAllUsers
            }
        },
        mounted() {
            this.getAllUsers()
        }
    }
</script>

<style lang="scss" scoped>
    li {
        max-width: 600px;
        margin: 0 auto;
        list-style-type: none;
    }
    article {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    @media screen and (max-width: 767px) {
        ul {
            padding: 5px;
        }
    }
</style>