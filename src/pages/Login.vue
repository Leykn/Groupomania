<template>
  <el-scrollbar>
    <h1>
      <img src="../assets/groupomania.svg" alt="Logo Groupomania">
      Groupomania
    </h1>
    <div>
      <h2>Connexion</h2>
      <el-row>
        <el-col :span="12" :offset="6"> 
          <form action="/" method="get" @submit.prevent="sendForm">

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

            <div>
              <el-button type="primary" native-type="submit" :loading="loading" @click.prevent="sendForm">Confirmer</el-button>
            </div>

          </form>
          <p>
            Si vous ne disposez pas de compte, veuillez cliquer sur ce lien<br>
            <el-link @click="redirection" type="primary" :underline="false">Créer un compte</el-link>
          </p>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script>
    import { reactive, toRefs } from 'vue'
    import { useVuelidate } from '@vuelidate/core'
    import { required, email, minLength, maxLength } from '../utils/validators.js'
    import BaseInput from '../components/BaseInput.vue'
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
          email: '',
          password: '',
          loading: false,
        })
        const rules = {
          email: {
            required,
            email
          },
          password: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(16)
          }
        }
        const redirection = () => { router.push('/register')}
        const v$ = useVuelidate(rules, state, { $autoDirty: true })
        const sendForm = async () => {
          v$.value.$touch()
          if (!v$.value.$error) {
            state.loading = true
            const res = await store.dispatch('users/login', {
            email: state.email,
            password: state.password
            })
            if (res.status === 200) {
              store.dispatch('notifications/sendSuccess', {
                title: 'Succès',
                message: 'Connexion réussi.'
              })
              router.push('/')
            } else {
              store.dispatch('notifications/sendError', {
                title: 'Erreur',
                message: 'Identifiant ou mot de passe invalide.'
              })
            }
            state.loading = false
          }
        }
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