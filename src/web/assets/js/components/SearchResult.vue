<template>
    <div class="search-result">
        <ul class="search-result__item" v-for="item in items" :key="item.path">
            <li><router-link :to="{ name: 'watch', params: { path: item.path } }">{{ item.path }}</router-link></li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SearchResultItem from '../SearchResultItem';
export default Vue.extend({
    props: {
        items: Array as PropType<SearchResultItem[]>,
    },
})
</script>
