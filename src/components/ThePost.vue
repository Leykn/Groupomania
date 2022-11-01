<template>
    <el-scrollbar class="scroll">
        <div>
            <!-- Implémentation de la liste des posts -->
            <ul>
                <li v-for="post, index in postList" :key="index">
                    <BasePost
                    @updatePostList="updatePostList"
                    :id="post._id"
                    :title="post.title"
                    :content="post.content"
                    :imageUrl="post.imageUrl"
                    :date="post.date"
                    :like="post.likes"
                    :userId="post.userId"
                    :usersLiked="post.usersLiked"
                    >
                    </BasePost>
                </li>
            </ul>
        </div>
        <button class="btn" @click.prevent="routeNewPost">Poster un message</button>
    </el-scrollbar >
</template>

<script>
import { reactive, toRefs } from 'vue'
import BasePost from './BasePost.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
    export default {
        components: {
            BasePost
        },
        setup() {
            const store = useStore()
            const router = useRouter()

            const state = reactive({
                postList: [],
                deletePost: store.state.posts.deletePost
            })

            const getAllPosts = async () => {
                const res = await store.dispatch('posts/getAllPosts')
                for (let post of res.data) {
                    state.postList.push(post)
                }
                sortPost()
            }

            const sortPost = () => {
                state.postList.sort((a,b) => b.date - a.date)
            }

            const routeNewPost = () => {
                router.push('/create')
            }

            const updatePostList = () => {
                state.postList = []
                getAllPosts()
            }

            return {
                ...toRefs(state),
                routeNewPost,
                getAllPosts,
                updatePostList
            }
        },
        mounted() {
            this.getAllPosts()
        },
        updated() {
            this.updatePostList()
        }
    }
</script>

<style lang="scss" scoped>
    li {
        max-width: 600px;
        margin: 0 auto;
        list-style-type: none;
    }

    @media screen and (max-width: 767px) {
        ul {
            padding: 5px;
        }
    }
</style>