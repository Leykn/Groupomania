<template>
  <el-header>
    <h1>
      <img src="../assets/groupomania.svg" alt="Logo Groupomania">
      Groupomania
    </h1>
    <div>
        <p>
            <el-button @click="dialogVisible = true" type="primary">
              <el-tooltip
                class="box-item"
                effect="light"
                content="Déconnexion"
                placement="bottom"
              >
                <el-icon :size="20" :color="color">
                  <SwitchButton />
                </el-icon>
              </el-tooltip>
              <span class="spanBtn">Déconnexion</span>
            </el-button>
        </p>

        <el-dialog
            title="Confirmation de déconnexion"
            v-model="dialogVisible"
            >
            <span>Êtes-vous sûr de vouloir vous déconnecter</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Annuler</el-button>
                    <el-button type="primary" @click="confirmLogout" :loading="loading">Confirmer</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
  </el-header>
</template>

<script>
  import { reactive, toRefs } from '@vue/reactivity'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  export default {
    setup() {
      const store = useStore()
      const router = useRouter()

      const state = reactive({
        dialogVisible: false,
        loading: false,
        color: '#fff'
      })

      // Confirme la déconnexion de l'utilisateur
      const confirmLogout = () => {
        state.loading = true
        store.dispatch('users/logout')
        store.dispatch('notifications/sendSuccess', {
            title: 'Succès',
            message: 'Vous êtes déconnecté.'
          })
        state.loading = false
        state.dialogVisible = false
        router.push('/login')
      }
            
      return {
        ...toRefs(state),
        confirmLogout
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-header {
    position: fixed;
    height: 60px;
    width: 100%;
    max-width: 1440px;
    margin-top: -60px;
    z-index: 10;
  }
  div {
    position: absolute;
    top: -5px;
    right: 15px;
  }
  h1 {
    margin: 10px 0;
    color: #409eff;
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
    div {
      right: 10px;
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
    .el-header {
      max-height: 60px;
    }
  }
</style>