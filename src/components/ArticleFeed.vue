<template>
    <div class="feedContainer">
        <div class="articleBanner" v-for="(article) in articles" @click="selectArticle(article.title, article.body)">
            <div class="feedHeader" :style="{ background: article.colorBorder }">
                <img class="selectedStarImg" src="../../public/images/shootstar.png" alt="">
                <h2>{{ article.title }}</h2>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';

type Article = {
    title: string,
    body: string,
    colorBorder: string
}

/* Data */
const colors = ['#FDF5EF', '#83CDC5', '#47A3C6', '#17C778', '#FF91BD', '#F8B948', '#FD5621']

let state = reactive({
    // Static articles stores on the client, no need for a server side fetch at the moment.
    articles: [
        {
            id: 1,
            title: 'Strboard.io V1.0 is live!',
            body: 'Strboard is live! This is the first version of the Strboard.io platform. This website was a small  project I undertook to learn some new technologies and to get some experience with the deployment process. Given Strboard has just been launched, there may be some bugs. If you happen to run across any issues or have suggestions, feel free to send me an email or message me on twitter. Thanks for checking it out!',
        },
        /*
        {
            id: 2,
            title: 'Article 2',
            body: 'content 2',
        }
        */
    ],
});

const emit = defineEmits<{
    (event: 'selectArticle', title: string, body: string): void
}>()

const articles = computed(() => {

    let articles = state.articles;
    let newArticles = [];

    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];
        // get color from color array, wrap if over array length
        let colorIndex = (i + 1) % colors.length;
        let colorBorder = colors[colorIndex];
        let newArticle: Article = {
            title: article.title,
            body: article.body,
            colorBorder: colorBorder
        };

        newArticles.push(newArticle);
    }

    return newArticles;
});

/* Methods */
function selectArticle(articleTitle: string, articleBody: string) {
    emit('selectArticle', articleTitle, articleBody);
}

</script>

<style scoped lang="scss">
.feedContainer {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: spacing(1) 0;
    row-gap: spacing(1);
    width: 100%;
}

.articleBanner {
    width: 100%;
    max-width: 25rem;
}

.feedHeader {
    align-items: center;
    border-radius: 10px;
    box-sizing: border-box;
    color: black;
    column-gap: spacing(1);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: $techna;
    font-size: $fontSize2;
    height: 3rem;
    max-width: 25rem;
    padding-left: 8px;
    width: calc(100%);

    h2 {
        margin: 5px 0 0 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.selectedStarImg {
    display: block;
    filter: brightness(0%);
    height: auto;
    width: 32px;
    animation-name: breathe;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-delay: 0;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}
</style>
