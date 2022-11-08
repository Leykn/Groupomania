<template>
    <nav>
        <span @click="burger" class="navBarToggle">
            <span v-bind:class="[ isActif ? 'close' : '', 'iconBar' ]"></span>
        </span>
        <el-aside v-bind:class="[ isActif ? 'visible' : '', 'theMenu' ]">

            <el-menu
            :router="true"
            default-active="1"
            class="el-menu-vertical-demo"
            >

            <el-menu-item @click="isActif = false" index="/">
                <span>Accueil</span>
            </el-menu-item>

            <el-menu-item @click="isActif = false" index="/user-list">
                <span>Utilisateurs</span>
            </el-menu-item>

            <el-menu-item @click="isActif = false" index="/user">
                <span>Profil</span>
            </el-menu-item>

            </el-menu>

        </el-aside>
    </nav>
</template>

<script>
    import { reactive, toRefs } from '@vue/reactivity'
    export default {
        setup () {
            const state = reactive({
                isActif: false
            })

            // Active ou désactive le menu burger
            const burger = () => {
                if (state.isActif) {
                    state.isActif = false
                } else {
                    state.isActif = true
                }
            }

            return {
                ...toRefs(state),
                burger
            }
        }
    }
</script>

<style lang="scss" scoped>
.theMenu {
    width: 160px;
    height: 100vh;
    overflow-x: hidden;
}
.el-menu {
    border-right: none !important;
    background-color: #f2f2f2 !important;
}
.navBarToggle {
    display: none;
    width: 30px;
    height: 30px;
    position: relative;
    top: -48px;
    left: 10px;
    z-index: 99;
    cursor: pointer;
}
.iconBar {
    width: 24px;
    height: 2px;
    background-color: #2c3e50;
    display: none;
    position: relative;
    &::before, &::after {
        content: '';
        width: 24px;
        height: 2px;
        background: #2c3e50;
        display: inline-block;
        position: absolute;
        left: 0;
        transform-origin: center;
        transition: all 0.3s ease;
    }
    &::before {
        top: -7px;
    }
    &::after {
        top: 7px;
    }
}
.visible {
    display: block;
    position: fixed;
    top: 60px;
    z-index: 50;
}
.close {
    background-color: transparent;
    &::before, &::after {
        content: '';
        width: 30px;
        height: 2px;
        background: #2c3e50;
        display: inline-block;
        position: absolute;
        transform-origin: center;
        transition: all 0.3s ease;
    }
    &::before {
        top: 0;
        transform: rotate(45deg);
    }
    &::after {
        top: 0;
        transform: rotate(-45deg);
    }
}

@media screen and (max-width: 767px) {
    .navBarToggle {
        display: block;
    }
    .iconBar {
        display: inline-block;
    }
    .el-menu-item {
        border: 1px solid rgb(0 0 0/ 20%);
        border-top: none;
        border-left: none;
        box-shadow: 1px 1px 5px rgb(0 0 0 / 20%);
    }
    div {
        width: 0;
    }
}
</style>