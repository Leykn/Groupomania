<template>
    <div class="notFound">
        <div>
            <h1>{{ title }}</h1>
            <p class="subTitle">{{ subTitle }}</p>
        </div>
        <div class="quote">
            <p>
                {{ currentCitation.citation }}
            </p>
            <span>{{ currentCitation.auteur }}</span>
        </div>
        <el-button @click="goToPreviousPage" type="primary" round>
            Revenir en arrière
        </el-button>
    </div>
</template>

<script>
    import { reactive, toRefs } from 'vue';
    import { useRouter} from 'vue-router'
    export default {
        setup () {
            const router = useRouter()

            const state = reactive({
                title: '404',
                subTitle: 'Page introuvable',
                currentCitation: {
                    citation: '',
                    auteur: ''
                },
                citations: [
                    {
                        citation: "Si vous voulez trouver les secrets de l'univers, pensez en termes d'énergie, de fréquence, d'information et de vibration.",
                        auteur: "Nikola TESLA"
                    },
                    {
                        citation: "Qui vit en paix avec lui-même vit en paix avec l’univers",
                        auteur: "Marc Aurèle"
                    },
                    {
                        citation: "Deux choses sont infinies : l'univers et la bêtise humaine. Mais en ce qui concerne l'univers, je n'en ai pas encore acquis la certitude absolue.",
                        auteur: "Albert Einstein"
                    },
                    {
                        citation: "Tout ce qui existe dans l'univers est le fruit du hasard et de la nécessité.",
                        auteur: "Démocrite"
                    },
                    {
                        citation: "Cet univers ne serait pas grand-chose s'il n'abritait pas les gens qu'on aime.",
                        auteur: "Stephen Hawking"
                    },
                    {
                        citation: "Le monde est composé de flèches et de molécules, et d'électricité,comme le Big-Bang tu vois, et tout ça ensemble, ça forme l'univers.",
                        auteur: "Jean-claude VAN DAMME"
                    },
                    {
                        citation: "Un être humain est une partie du tout que nous appelons univers... Une partie limitée dans le Temps et dans l'Espace.",
                        auteur: "Albert Einstein"
                    },
                    {
                        citation: "Depuis le big bang, tout commence à mourir à l'instant même de naître. L'univers n'est qu'un élan vers l'usure et la mort.",
                        auteur: "Jean D'Ormesson"
                    },
                    {
                        citation: "Notre univers s'étend comme gonfle dans le four un pudding aux raisins, dans un espace qu'il crée lui-même.",
                        auteur: "Hubert REEVES"
                    },
                    {
                        citation: "L'univers ne permet pas la perfection.",
                        auteur: "Stephen Hawking"
                    },
                    {
                        citation: "Le silence éternel de ces espaces infinis m’effraie.",
                        auteur: "Blaise Pascal"
                    }
                ]
            })

            // Retourne un nombre entre 0 et 10
            function getRandomInt() {
                return Math.floor(Math.random() * 11)
            }

            // Choisi une citation au hasard
            const selectOneQuote = () => {
                const number = getRandomInt()
                state.currentCitation.citation = '\u00ab ' + state.citations[number].citation + ' \u00bb'
                state.currentCitation.auteur = '- ' + state.citations[number].auteur
            }

            // Redirige vers la page précédente
            const goToPreviousPage = function() {
                router.back()
            }

            return {
                ...toRefs(state),
                goToPreviousPage,
                selectOneQuote
            }
        },
        mounted() {
            this.selectOneQuote()
        }
    }
</script>

<style lang="scss" scoped>
    .notFound {
        background-image: url('../assets/wp2567217-universe-wallpaper.jpg');
        background-origin: border-box;
        background-size: cover;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100vh;
    }
    h1 {
        font-size: 160px;
        margin: 10% 0 0 0;
        color: #000;
        text-shadow: 2px 2px 0 #fff,
        2px -2px 0 #fff,
        -2px 2px 0 #fff,
        -2px -2px 0 #fff,
        2px 0px 0 #fff,
        0px 2px 0 #fff,
        -2px 0px 0 #fff,
        0px -2px 0 #fff;
        mix-blend-mode: screen;
    }
    p {
        margin: 0 0 5% 0;
        color: #fff;
    }
    span {
        font-weight: bold;
        color: #fff;
    }
    .quote {
        width: fit-content;
        max-width: 50%;
        padding: 10px;
        margin: 10px auto;
        backdrop-filter: blur(0px) saturate(100%) brightness(85%);
    }
    .subTitle {
        font-size: 24px;
    }
    .el-button {
        margin-top: 30px;
        background-color: transparent;
        border-color:#fff;
        &:hover {
            color: #2c3e50;
            background-color: #f2f2f2;
            border-color:#2c3e50;
        }
    }
</style>