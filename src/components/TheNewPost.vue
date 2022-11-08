<template>
    <el-scrollbar class="scroll">
        <h2>Créer un post</h2>

        <el-row>
            <el-col :span="12" :offset="6">
                <form action="/" method="get" @submit.prevent="sendPost">
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
                        </div>
                    </div>

                    <el-button
                        type="primary"
                        native-type="submit"
                        :loading="loading"
                        @click.prevent="sendPost">
                        Confirmer
                    </el-button>
                </form>
            </el-col>
        </el-row>
    </el-scrollbar>
</template>

<script>
    import { reactive, toRefs } from 'vue'
    import { useVuelidate } from '@vuelidate/core'
    import { required } from '../utils/validators.js'
    import BaseInput from './BaseInput.vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    export default {
        components: {
            BaseInput
        },
        setup() {
            const router = useRouter()
            const store = useStore()

            const state = reactive({
                title: '',
                content: '',
                file: '',
                fileExtension: '',
                loading: false,
            })

            // Mise en place des règles pour chaque input du formulaire
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

            // Vérifie l'extention du fichier à envoyer
            function validFileType(file) {
                for(let i = 0; i < fileTypes.length; i++) {
                    if(file.type === fileTypes[i]) {
                    return true;
                    }
                }
                return false;
            }
            
            // Affiche l'image ajouter par l'utilisateur
            const previous = () => {
                const input = document.getElementById('file')
                const preview = document.getElementById('previous')
                while(preview.firstChild) {
                    preview.removeChild(preview.firstChild)
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
                            image.src = window.URL.createObjectURL(currentFile[i]);

                            preview.appendChild(image);

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

            // Envoi du formulaire si aucune erreur n'est présente
            const sendPost = async () => {
                v$.value.$touch()
                if (state.file === '') {
                    if (!v$.value.$error) {
                        state.loading = true
                        const res = await store.dispatch('posts/createPost', { title: state.title, content: state.content })
                        if (res.status === 201) {
                            store.dispatch('notifications/sendSuccess', {
                            title: 'Succès',
                            message: 'Message envoyé.'
                            })
                            router.push('/')
                        } else {
                            store.dispatch('notifications/sendError', {
                            title: 'Erreur',
                            message: error.response.data.message
                            })
                        }
                        state.loading = false
                    }
                } else {
                    let postData = new FormData()
                    const post = JSON.stringify({ title: state.title, content: state.content })
                    const image = document.getElementById('file').files[0]
                    postData.append('post', post)
                    postData.append('image', image)
                    if (state.fileExtension === 'jpeg' || state.fileExtension === 'jpg' || state.fileExtension === 'png') {
                        if (!v$.value.$error) {
                        state.loading = true
                        const res = await store.dispatch('posts/createPost', postData)
                        if (res.status === 201) {
                            store.dispatch('notifications/sendSuccess', {
                            title: 'Succès',
                            message: 'Message envoyé.'
                            })
                            router.push('/')
                        } else {
                            store.dispatch('notifications/sendError', {
                            title: 'Erreur',
                            message: res.response.data.message
                            })
                        }
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
                sendPost
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