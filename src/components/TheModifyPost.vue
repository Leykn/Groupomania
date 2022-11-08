<template>
    <el-scrollbar class="scroll">
        <h2>Modifier le post</h2>

        <el-row>
            <el-col :span="12" :offset="6">
                <form action="/" method="get" @submit.prevent="sendModifyPost">
                    <BaseInput
                        label="Titre"
                        v-model="title"
                        type="text"
                        id="title"
                        aria-describedby="titleError"
                        :aria-invalid="v$.title.$invalid"
                    />
                    <el-alert 
                        v-if="v$.title.$error" 
                        :title="v$.title.$error ? v$.title.$errors[0].$message : ''" 
                        type="error"
                        :closable="false"
                        id="titleError"
                    ></el-alert>

                    <BaseInput
                        label="Message"
                        v-model="content"
                        type="textarea"
                        :rows="6"
                        id="content"
                        aria-describedby="contentError"
                        :aria-invalid="v$.content.$invalid"
                    />
                    <el-alert 
                        v-if="v$.content.$error" 
                        :title="v$.content.$error ? v$.content.$errors[0].$message : ''" 
                        type="error"
                        :closable="false"
                        id="contentError"
                    ></el-alert>
                    <div class="column">
                        <label for="file" class="btn">Image (jpeg, jpg ou png)</label>
                        <input 
                            v-on:change="previous"
                            type="file"
                            id="file"
                            class="inputFile"
                            accept=".png, .jpg, .jpeg"
                        >
                        <div id="previous">
                            <img v-if="$store.state.posts.editPost.imageUrl !== ' '" :src="$store.state.posts.editPost.imageUrl" alt="">
                        </div>
                    </div>

                    <BaseCheckbox
                        v-if="bool === false"
                        v-model="removeBool"
                    >
                        Retirer l'image actuelle
                    </BaseCheckbox>
                    <BaseCheckbox
                        v-else
                        v-model="removeBool"
                        disabled
                    >
                        Retirer l'image actuelle
                    </BaseCheckbox>

                    <el-button
                        type="primary"
                        native-type="submit"
                        :loading="loading"
                        @click.prevent="sendModifyPost">
                        Confirmer
                    </el-button>
                </form>
            </el-col>
        </el-row>
    </el-scrollbar>
</template>

<script>
    import axios from 'axios'
    import { reactive, toRefs } from 'vue'
    import { useVuelidate } from '@vuelidate/core'
    import { required } from '../utils/validators.js'
    import BaseInput from './BaseInput.vue'
    import BaseCheckbox from './BaseCheckbox.vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    export default {
        components: {
            BaseInput,
            BaseCheckbox
        },
        setup() {
            const router = useRouter()
            const store = useStore()

            const state = reactive({
                id: store.state.posts.editPost.id,
                title: store.state.posts.editPost.title,
                content: store.state.posts.editPost.content,
                image: store.state.posts.editPost.imageUrl,
                bool: store.state.posts.editPost.imageUrl === ' ' ? true : false,
                removeBool: false,
                file: '',
                fileExtension: '',
                loading: false,
            })

            const rules = {
                title: {
                required
                },
                content: {
                required
                }
            }

            const fileTypes = [
                'image/jpeg',
                'image/pjpeg',
                'image/png'
                ]

            function validFileType(file) {
                for(let i = 0; i < fileTypes.length; i++) {
                    if(file.type === fileTypes[i]) {
                    return true;
                    }
                }

                return false;
            }
            
            const previous = () => {
                const input = document.getElementById('file')
                const preview = document.getElementById('previous')
                while(preview.firstChild) {
                    preview.removeChild(preview.firstChild)
                    if (state.bool && state.image !== ' ') {
                        state.bool = false
                    }
                }

                let currentFile = input.files
                if (currentFile.length === 0) {
                    let para = document.createElement('p')
                    para.textContent = "Aucune image n'est selectionnée."
                    preview.appendChild(para)
                } else {
                    for(let i = 0; i < currentFile.length; i++) {
                        let para = document.createElement('p');
                        if(validFileType(currentFile[i])) {
                            let image = document.createElement('img');
                            image.id = 'newImage'
                            image.src = window.URL.createObjectURL(currentFile[i]);

                            preview.appendChild(image);
                            state.bool = true

                        } else {
                            para.textContent = 'File name ' + currentFile[i].name + ': Not a valid file type. Update your selection.';
                            preview.appendChild(para);
                        }
                        state.file = currentFile[i]
                        state.fileExtension = currentFile[i].name.split('.').pop()
                    }
                }
            }

            const v$ = useVuelidate(rules, state, { $autoDirty: true })

            const storage = JSON.parse(localStorage.getItem('accessUser'))
                        
            const sendModifyPost = () => {
                v$.value.$touch()
                const config = {
                    headers: { Authorization: `Bearer ${storage.accessToken}` }
                }
                if (state.file === '') {
                    if (!v$.value.$error) {
                        const id = state.id
                        const post = { title: state.title, content: state.content, bool: state.removeBool }
                        state.loading = true
                        axios.put(`http://localhost:3000/api/post/${id}`, post, config)
                        .then(res => {
                            if (res.status === 200) {
                                store.dispatch('notifications/sendSuccess', {
                                    title: 'Succès',
                                    message: 'Message modifier.'
                                })
                                router.push('/')
                            } else {
                                store.dispatch('notifications/sendError', {
                                    title: 'Erreur',
                                    message: res.data.message
                                })
                            }
                        })
                        .catch(error => {
                            store.dispatch('notifications/sendError', {
                                title: 'Erreur',
                                message: error.response.data.message
                            })
                        })
                        state.loading = false
                    }
                } else {
                    const id = state.id
                    let postData = new FormData()
                    const post = JSON.stringify({ title: state.title, content: state.content })
                    const image = document.getElementById('file').files[0]
                    postData.append('post', post)
                    postData.append('image', image)
                    if (state.fileExtension === 'jpeg' || state.fileExtension === 'jpg' || state.fileExtension === 'png') {
                        if (!v$.value.$error) {
                        state.loading = true
                        axios.put(`http://localhost:3000/api/post/${id}`, postData, config)
                        .then(res => {
                            if (res.status === 200) {
                                store.dispatch('notifications/sendSuccess', {
                                    title: 'Succès',
                                    message: 'Message modifier.'
                                })
                                router.push('/')
                            } else {
                                store.dispatch('notifications/sendError', {
                                    title: 'Erreur',
                                    message: res.data.message
                                })
                            }
                        })
                        .catch(error => {
                            store.dispatch('notifications/sendError', {
                                title: 'Erreur',
                                message: error.response.data.message
                            })
                        })
                        // const res = await store.dispatch('posts/modifyPost', {id, postData})
                        state.loading = false
                        }
                    } else {
                        store.dispatch('notifications/sendError', {
                            title: 'Erreur',
                            message: "Le format de l'image n'est pas correct."
                        })
                    }
                }
            }

            
            return {
                ...toRefs(state),
                v$,
                previous,
                sendModifyPost
            }
        }
        
    }
</script>

<style lang="scss" scoped>
    form { 
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border-radius: 4px;
      text-align: center;
    }
    fieldset { border: none; }
    legend { display: none; }
    .el-input, .el-alert { 
      display: block;
      margin: 10px 0;
    }
    .el-checkbox {
      margin: 20px 0 0;
    }
    .el-button {
      margin-top: 25px;
    }
    .column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .inputFile {
        opacity: 0;
    }
    .el-scrollbar {
        height: calc(100vh - 100px);
        padding: 0px;
    }
</style>