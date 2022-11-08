<template>
  <!-- Vérification de la connexion de l'utilisateur par v-if -->
  <div v-if="$route.meta.layout === true" class="mainContainer">
    <!-- el-container = section -->
    <el-container>

      <!-- Intégration du component -->
      <TheHeader />

      <el-container class="main">
        
        <TheMenu />

        <!-- el-main = main -->
        <el-main>

          <!-- Utilisation de la route actuelle -->
          <router-view></router-view>

        </el-main>

      </el-container>

    </el-container>
  </div>

  <div v-else-if="$route.meta.layout === false" class="mainContainer">
    <router-view></router-view>
  </div>

  <div v-else class="mainContainer" v-loading="true"></div>
</template>

<script>
  import { mapMutations, useStore } from 'vuex'
  
  import TheHeader from './components/TheHeader.vue'
  import TheMenu from './components/TheMenu.vue'

  export default {
    components: {
      TheHeader,
      TheMenu
    },
    setup() {
      const store = useStore()

      // Récupération de l'utilisateur actuel
      const getCurrentUser = async () => {
        const res = await store.dispatch('users/getCurrentUser')
      }

      return {getCurrentUser}
    },
    methods: {
      ...mapMutations({
        SET_NOTIFIER: 'notifications/SET_NOTIFIER'
      }),
    },
    created() {
      this.SET_NOTIFIER(this.$notify)
      this.getCurrentUser()
    },
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
  body {
    margin: 0;
    background-color: #b0b1b1;
  }
  #app {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    text-align: center;
    color: #2c3e50;
    background-color: #f2f2f2;
    padding-top: 60px;
    max-width: 1440px;
    margin: 0 auto;
    overflow: hidden;
  }
  .mainContainer {
    height: 100%;
  }
  .el-menu-item {
    font-size: 18px!important;
  }
  .el-main {
    background-color: #fff;
    border-radius: 20px 0 0 0;
    box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.2) inset;
  }
  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    max-width: 300px;
    max-height: 300px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 25px;
    overflow: hidden;
  }
  article {
    box-shadow: 3px 3px 5px 0px rgba(0,0,0,0.1);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 10px;
    margin: 10px 0;
    padding: 10px;
  }
  .btn {
    background-color: #409eff;
    border: 1px solid #409eff;
    color: #fff;
    padding: 8px 15px;
    border-radius: 4px;
    vertical-align: middle;
    width: fit-content;
    font-size: 14px;
    font-family: Arial;
    &:hover {
      cursor: pointer;
      background-color: #79bbff;
    }
  }
  .el-scrollbar {
    overflow: clip;
  }
  .updateUserImg {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
  }
  .el-col-12 {
    width: 50%;
    max-width: 600px !important;
    flex: none!important;
  }
  .el-col-offset-6 {
    margin: 0 auto !important;
  }
  .scroll {
    overflow: clip !important;
    height: calc(100vh - 100px) !important;
    padding: 0px;
  }

  @media screen and (max-width: 767px) {
    aside {
      display: none;
    }
    img {
      max-width: 250px;
      max-height: 250px;
    }
    .updateUserImg {
      max-width: 250px;
      max-height: 250px;
    }
    .el-main {
      padding: 5px!important;
      border-radius: 0;
    }
    .el-dialog {
      width: 90%!important;
    }
    .el-col-12 {
      width: 96%;
    }
    .el-col-offset-6 {
      margin-left: 2%!important;
    }
    .el-notification.right {
      width: 250px;
    }
    .scroll {
      height: calc(100vh - 70px) !important;
    }
  }

  @media screen and (max-width: 1024px) and (min-width: 768px) {
    .el-col-12 {
      width: 70%;
      max-width: 70% !important;
    }
    .el-col-offset-6 {
      margin-left: 15%!important;
    }
  }
</style>
