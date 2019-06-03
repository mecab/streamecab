<template>
    <div class="search">
        <header class="search__header">
            Streamecab
        </header>
        <div class="search__search-form">
            <form class="search-form" @submit.prevent="search">
                <input class="search-form__input" v-model="query" type="text" placeholder="番組名を入れてください" />
                <button class="search-form__button">検索</button>
            </form>
        </div>
        <search-result class="search__result" :items="result"></search-result>
        <div v-show="loading" class="loader">
            <div class="loader__left loader-inner line-scale-pulse-out">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="loader__text">Searching...</div>
            <div class="loader__right loader-inner line-scale-pulse-out">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Oxygen&display=swap');
@import '../../css/base';

.search {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    padding: $base-spacing;

    &__header {
        margin: 0 auto;
        margin-bottom: $small-spacing / 2;

        font-family: Oxygen, Helvetica, Arial, sans-serif;
        font-size: 1.5rem;
        letter-spacing: 0.125rem;
        color: #393C40;
    }

    &__search-form {
        margin: 0 auto;
    }

    &__result {
        padding-left: 8px;
        padding-right: 8px;
    }
}

.search-form {
    display: flex;
    justify-content: left;

    &__input {
        width: 100%;
        margin: 0;
    }

    &__button {
        width: auto;
        margin-left: $small-spacing;
    }
}

@import '../../css/loaders.scss';
.line-scale-pulse-out > div {
    background-color: #1B83FA;
}

.loader {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    justify-content: center;
    align-items: center;

    &__left, &__right {
        transform: scale(0.7) translateY(0.3rem);
    }

    &__text {
        color: #1B83FA;
        margin-left: 1rem;
        margin-right: 1rem;
    }
}
</style>

<script lang="ts">
import Vue from 'vue';
import VueRouter from 'vue-router';

import SearchResult from '../components/SearchResult.vue';
import SearchResultItem from '../SearchResultItem';

export default Vue.extend({
    components: {
        SearchResult,
    },

    data () {
        return {
            query: "",
            result: [],
            loading: false,
        }
    },

    computed: {
        searchUrl: function(): string {
            return `/api/search/?q=${this.$data.query}`;
        }
    },

    methods: {
        async search() {
            this.result = [];
            this.loading = true;
            const res = await fetch(this.searchUrl);
            const stream = res.body;
            if (stream == null) {
                return;
            }
            const reader = stream.getReader();

            // String, but not '\n' at the last line, which means the line has
            // not been completed in the last chunk and should be concatinated
            // with the first line of the next chunk.
            let partial = '';

            const rec = async () => {
                const result = await reader.read();
                const chunk = (new TextDecoder).decode(result.value);
                const lines = chunk.split('\n');

                lines[0] = partial + lines[0];

                // When the chunk completes the last line, the last element of
                // `lines` is an empty string so it can be simply pop and set
                // to `partial` whether the last line is completed or not.
                //
                // Note 'a\nb\n'.split('\n') => [ 'a', 'b', '' ]

                partial = lines.pop()!;

                lines.forEach((line) => {
                    this.$data.result.push(new SearchResultItem(line));
                })

                if (!result.done) {
                    rec();
                    return;
                }
                this.$data.loading = false;
            }
            rec();
        }
    }
})
</script>
