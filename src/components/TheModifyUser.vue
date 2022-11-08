<template>
    <el-scrollbar class="scroll">
        <h2>Modification de {{ $store.state.users.userProfile.username }}</h2>

        <el-row>
            <el-col :span="12" :offset="6">
                <form action="/" method="get">
                    <ul>
                        <li @click="btnProfile" v-bind:class="[ btnProfileActif ? 'ongletActif' : '', 'onglet radiusLeft' ]">Modifier le profile</li>
                        <li @click="btnPassword" v-bind:class="[ btnPasswordActif ? 'ongletActif' : '', 'onglet' ]">Modifier le mot de passe</li>
                        <li @click="btnDelete" v-bind:class="[ btnDeleteActif ? 'ongletActif' : '', 'onglet radiusRight' ]">Supprimer l'utilisateur</li>
                    </ul>
                    <div class="formUser">
                        <div v-if="btnProfileActif">
                            <BaseInput
                                label="Nom d'utilisateur"
                                v-model="username"
                                type="text"
                                id="username"
                                aria-describedby="usernameError"
                                :aria-invalid="v$.username.$invalid"
                            />
                            <el-alert 
                                v-if="v$.username.$error" 
                                :title="v$.username.$error ? v$.username.$errors[0].$message : ''" 
                                type="error"
                                :closable="false"
                                id="usernameError"
                            ></el-alert>

                            <BaseInput
                                label="Déscription"
                                v-model="bio"
                                type="textarea"
                                :rows="6"
                                id="bio"
                                aria-describedby="bioError"
                                :aria-invalid="v$.bio.$invalid"
                            />
                            <el-alert 
                                v-if="v$.bio.$error" 
                                :title="v$.bio.$error ? v$.bio.$errors[0].$message : ''" 
                                type="error"
                                :closable="false"
                                id="bioError"
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
                                    <img class="updateUserImg" :src="image" alt="Avatar">
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
                                @click.prevent="sendModifyUser">
                                Confirmer
                            </el-button>
                        </div>
                        <div v-if="btnPasswordActif">
                            <BaseInput
                                label="Mot de passe actuel"
                                v-model="password"
                                type="password"
                                id="password"
                                aria-describedby="passwordError"
                                :aria-invalid="v$.password.$invalid"
                            />
                            <el-alert 
                                v-if="v$.password.$error" 
                                :title="v$.password.$error ? v$.password.$errors[0].$message : ''" 
                                type="error"
                                :closable="false"
                                id="passwordError"
                            ></el-alert>

                            <BaseInput
                                label="Nouveau mot de passe"
                                v-model="newPassword"
                                type="text"
                                id="newPassword"
                                aria-describedby="newPasswordError"
                                :aria-invalid="v$.newPassword.$invalid"
                            />
                            <el-alert 
                                v-if="v$.newPassword.$error" 
                                :title="v$.newPassword.$error ? v$.newPassword.$errors[0].$message : ''" 
                                type="error"
                                :closable="false"
                                id="newPasswordError"
                            ></el-alert>
                            <el-alert 
                                v-if="errorPassword" 
                                :title="errorPassword" 
                                type="error"
                                :closable="false"
                                id="newPasswordError"
                            ></el-alert>

                            <BaseInput
                                label="Confirmer le mot de passe"
                                v-model="newPasswordConfirm"
                                type="text"
                                id="newPasswordConfirm"
                                aria-describedby="newPasswordConfirmError"
                                :aria-invalid="v$.newPasswordConfirm.$invalid"
                            />
                            <el-alert 
                                v-if="v$.newPasswordConfirm.$error" 
                                :title="v$.newPasswordConfirm.$error ? v$.newPasswordConfirm.$errors[0].$message : ''" 
                                type="error"
                                :closable="false"
                                id="newPasswordConfirmError"
                            ></el-alert>

                            <el-button
                                type="primary"
                                :loading="loading"
                                @click.prevent="sendModifyUserPassword">
                                Confirmer
                            </el-button>
                        </div>
                        <div v-if="btnDeleteActif">
                            <p>
                                Vous vous apprêtez à pénétrer dans la "zone de non retour"<br>
                                Après validation toute information sera perdu à jamais !
                            </p>
                            <el-button
                                type="danger"
                                :loading="loading"
                                @click.prevent="dialogVisible = true">
                                Suppression
                            </el-button>
                            <el-dialog
                                title="Confirmation de suppression"
                                v-model="dialogVisible"
                                width="30%">
                                <span>Êtes-vous sûr de vouloir supprimer votre compte ?</span>
                                <template #footer>
                                    <span class="dialog-footer">
                                        <el-button @click="dialogVisible = false">Annuler</el-button>
                                        <el-button type="danger" @click="deleteUser" :loading="loading">Confirmer</el-button>
                                    </span>
                                </template>
                            </el-dialog>
                        </div>

                    </div>
                </form>
            </el-col>
        </el-row>
    </el-scrollbar>
</template>

<script>
    import axios from 'axios'
    import { reactive, toRefs, toRef, watch } from 'vue'
    import { useVuelidate } from '@vuelidate/core'
    import { required, minLength, sameAsPassword, maxLength } from '../utils/validators.js'
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
                userId: store.state.users.currentUser.userId,
                username: store.state.users.userProfile.username,
                bio: store.state.users.userProfile.bio,
                image: store.state.users.userProfile.imageUrl,
                bool: store.state.users.userProfile.imageUrl === 'http://localhost:3000/images/default_avatar.png' ? true : false,
                removeBool: false,
                file: '',
                fileExtension: '',
                password: '',
                newPassword: '',
                newPasswordConfirm: '',
                errorPassword: null,
                dialogVisible: false,
                loading: false,
                btnProfileActif: true,
                btnPasswordActif: false,
                btnDeleteActif: false
            })

            const rules = {
                username: {
                    required
                },
                bio: {
                    required
                },
                password: {
                    required
                },
                newPassword: {
                    required,
                    minLength: minLength(8),
                    maxLength: maxLength(16)
                },
                newPasswordConfirm: {
                    required,
                    sameAsPassword: sameAsPassword(toRef(state, 'newPassword'))
                },
            }

            let btnProfile = () => {
                if (!state.btnProfileActif) {
                    state.btnDeleteActif = false
                    state.btnPasswordActif = false
                    state.btnProfileActif = true
                }
            }
            let btnPassword = () => {
                if (!state.btnPasswordActif) {
                    state.btnProfileActif = false
                    state.btnDeleteActif = false
                    state.btnPasswordActif = true
                }
            }
            let btnDelete = () => {
                if (!state.btnDeleteActif) {
                    state.btnProfileActif = false
                    state.btnPasswordActif = false
                    state.btnDeleteActif = true
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
                    if (state.bool && state.image !== 'http://localhost:3000/images/default_avatar.png') {
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
                            image.classList.add('updateUserImg')
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

            const sendModifyUserPassword = () => {
                v$.value.$touch()
                const userId = state.userId
                const config = {
                    headers: { Authorization: `Bearer ${storage.accessToken}` }
                }
                if (!v$.value.password.$error && !v$.value.newPassword.$error && !v$.value.newPasswordConfirm.$error) {
                    const user = { password: state.password, newPassword: state.newPassword }
                    state.loading = true
                    axios.put(`http://localhost:3000/api/user/password/${userId}`, user, config)
                    .then(res => {
                        if (res.status === 200) {
                            store.dispatch('notifications/sendSuccess', {
                                title: 'Succès',
                                message: 'Mot de passe modifier.'
                            })
                            router.push('/user')
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
            }
                        
            const sendModifyUser = async () => {
                v$.value.$touch()
                const userId = state.userId
                const config = {
                    headers: { Authorization: `Bearer ${storage.accessToken}` }
                }
                if (state.file === '') {
                    if (!v$.value.username.$error && !v$.value.bio.$error) {
                        const user = { username: state.username, bio: state.bio, bool: state.removeBool }
                        state.loading = true
                        axios.put(`http://localhost:3000/api/user/${userId}`, user, config)
                        .then(res => {
                            if (res.status === 200) {
                                store.dispatch('notifications/sendSuccess', {
                                    title: 'Succès',
                                    message: 'Utilisateur modifier.'
                                })
                                router.push('/user')
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
                    let userData = new FormData()
                    const user = JSON.stringify({ username: state.username, bio: state.bio })
                    const image = document.getElementById('file').files[0]
                    userData.append('user', user)
                    userData.append('image', image)
                    if (state.fileExtension === 'jpeg' || state.fileExtension === 'jpg' || state.fileExtension === 'png') {
                        if (!v$.value.username.$error && !v$.value.bio.$error) {
                        state.loading = true
                        axios.put(`http://localhost:3000/api/user/${userId}`, userData, config)
                        .then(res => {
                            if (res.status === 200) {
                                store.dispatch('notifications/sendSuccess', {
                                    title: 'Succès',
                                    message: 'Utilisateur modifier.'
                                })
                                router.push('/user')
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
                        store.dispatch('notifications/sendError', {
                            title: 'Erreur',
                            message: "Le format de l'image n'est pas correct."
                        })
                    }
                }
            }

            const deleteUser = async () => {
                const id = state.userId
                const res = await store.dispatch('users/deleteUser', id)
                if (res.status === 200) {
                    store.dispatch('notifications/sendSuccess', {
                    title: 'Succès',
                    message: 'Utilisateur supprimé.'
                    })
                    store.dispatch('users/logout')
                    state.dialogVisible = false
                    router.push('/login')
                }
            }

            watch(toRef(state, 'newPassword'), () => {
                if (v$.value.newPasswordConfirm.$dirty) {
                v$.value.newPasswordConfirm.$reset()
                v$.value.newPasswordConfirm.$touch()
                }
                const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-._])^[a-zA-Z\d-._]{3,}$/g
                if (regex.test(state.newPassword)) {
                state.errorPassword = null
                } else {
                state.errorPassword = "Vous devez utiliser majuscule, minuscule, chiffre sans espace et un symbole(-._)."
                }
            })
            
            return {
                ...toRefs(state),
                v$,
                previous,
                sendModifyUserPassword,
                sendModifyUser,
                deleteUser,
                btnProfile,
                btnPassword,
                btnDelete
            }
        }
        
    }
</script>

<style lang="scss" scoped>
    form { 
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border-radius: 4px;
      text-align: center;
    }
    fieldset { border: none; }
    legend { display: none; }
    ul {
        display: flex;
        list-style-type: none;
        padding: 0;
        margin-top: 0;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
    }
    li {
        width: calc(100% / 3);
        border: 1px solid rgba($color: #000000, $alpha: .1);
        padding: 5px 0;
        cursor: pointer;
    }
    .el-input, .el-alert { 
      display: block;
      margin: 10px 0;
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
    .formUser {
        padding: 30px;
    }
    .onglet:hover {
        background-color: #79bbff;
        color: #fff;
        border: 1px solid #409eff;
    }
    .ongletActif {
        color: #79bbff;
        border: 1px solid #409eff;
    }
    .radiusLeft {
        border-radius: 4px 0 0 0;
    }
    .radiusRight {
        border-radius: 0 4px 0 0;
    }
</style>