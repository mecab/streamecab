<template>
    <div>
        <h1>{{ videoPath }}</h1>
        <video ref="video" :src="`/video/${videoPath}`" autoplay></video>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        videoPath: String,
        duration: Number,
    },

    data() {
        return {};
    },

    methods: {
        
    }
});
</script>

<style lang="scss">
</style>
