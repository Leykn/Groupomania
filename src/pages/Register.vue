<template>
  <el-scrollbar>
    <h1>
      <img src="../assets/groupomania.svg" alt="Logo Groupomania">
      Groupomania
    </h1>
    <div>
      <h2>Inscription</h2>
      <el-row>
        <el-col :span="12" :offset="6"> 
          <form action="/" method="get" @submit.prevent="sendForm">

            <fieldset>

              <legend>Informations de connexion</legend>

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
                label="Adresse email"
                v-model="email"
                type="email"
                id="email"
                aria-describedby="emailError"
                :aria-invalid="v$.email.$invalid"
              />
              <el-alert 
                v-if="v$.email.$error" 
                :title="v$.email.$error ? v$.email.$errors[0].$message : ''" 
                type="error"
                :closable="false"
                id="emailError"
              ></el-alert>


              <BaseInput
                label="Mot de passe"
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
              <el-alert 
                v-if="errorPassword" 
                :title="errorPassword" 
                type="error"
                :closable="false"
                id="passwordError"
              ></el-alert>

              <BaseInput
                label="Confirmation du mot de passe"
                v-model="passwordConfirm"
                type="password"
                id="passwordConfirm"
                aria-describedby="passwordConfirmError"
                :aria-invalid="v$.passwordConfirm.$invalid"
              />
              <el-alert 
                v-if="v$.passwordConfirm.$error" 
                :title="v$.passwordConfirm.$error ? v$.passwordConfirm.$errors[0].$message : ''" 
                type="error"
                :closable="false"
                id="passwordConfirmError"
              ></el-alert>

            </fieldset>

            <fieldset>

              <legend>Finalisation de l'inscription</legend>

              <div>
                <el-button
                type="primary"
                native-type="submit"
                :loading="loading"
                @click.prevent="sendForm">
                  Confirmer
                </el-button>
              </div>

            </fieldset>

          </form>
          
          <p>
            Si vous disposez déjà d'un compte, veuillez cliquer sur ce lien<br>
            <el-link @click="redirection" type="primary" :underline="false">Se connecter</el-link>
          </p>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script>
  import { reactive, toRef, toRefs, watch } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, minLength, sameAsPassword, maxLength } from '../utils/validators.js'
  import BaseInput from '../components/BaseInput.vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  export default {
    components: { 
      BaseInput
    },
    setup() {

      const router = useRouter()
      const store = useStore()

      const state = reactive({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        loading: false,
        errorPassword: null,
      })

      // Mise en place des règles pour chaque input du formulaire
      const rules = {
        username: {
          required
        },
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(16)
        },
        passwordConfirm: {
          required,
          sameAsPassword: sameAsPassword(toRef(state, 'password'))
        }
      }

      const redirection = () => { router.push('/login')}
      
      const v$ = useVuelidate(rules, state, { $autoDirty: true })

      // Envoi du formulaire si aucune erreur n'est présente
      // Connecte l'utilisateur lors de la réussite de la création de son compte
      const sendForm = async () => {
        v$.value.$touch()
        if (!v$.value.$error && state.errorPassword == null) {
          state.loading = true
          const res = await store.dispatch('users/register', {
            email: state.email,
            password: state.password,
            username: state.username,
            status: 'user'
          })
          if (res.status === 201) {
            store.dispatch('notifications/sendSuccess', {
              title: 'Succès',
              message: 'Utilisateur enregistré.'
            })
            const res = await store.dispatch('users/login', {
              email: state.email,
              password: state.password
            })
            if (res.status === 200) {
              router.push('/')
            }
          } else {
            store.dispatch('notifications/sendError', {
              title: 'Erreur',
              message: res.response.data.message
            })
          }
          state.loading = false
        }
      }

      // Ré-éxecution des validators de passwordConfirm si password change après-coup
      watch(toRef(state, 'password'), () => {
        if (v$.value.passwordConfirm.$dirty) {
          v$.value.passwordConfirm.$reset()
          v$.value.passwordConfirm.$touch()
        }
        const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-._])^[a-zA-Z\d-._]{3,}$/g
        if (regex.test(state.password)) {
          state.errorPassword = null
        } else {
          state.errorPassword = "Vous devez utiliser majuscule, minuscule, chiffre sans espace et un symbole(-._)."
        }
      })
      return {
        ...toRefs(state),
        v$,
        sendForm,
        redirection
      }
    }
  }
</script>

<style lang="scss" scoped>
  h1 {
    color: #409eff;
  }
  form { 
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 4px;
    text-align: center;
  }
  fieldset { border: none; }
  legend { display: none; }
  .el-input, .el-alert  { 
    display: block;
    margin: 10px 0;
  }
  .el-checkbox {
    margin: 20px 0 0;
  }
  .el-button {
    margin-top: 25px;
  }
</style>