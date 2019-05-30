<template>
    <div id="app">
        <VideoContainer :videoPath="videoPath" :duration="duration"></VideoContainer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueRouter from 'vue-router';
import VideoContainer from '../components/VideoContainer.vue';

export default Vue.extend({
    components: { VideoContainer, },
    /*beforeRouteEnter (to, from, next) {
        console.log('enter', to, from);
        this.videoPath = to.params.path as string;
        next();
    },*/
    data() {
        return {
            videoPath: '',
            duration: 0,
        };
    },
    watch: {
        '$route': {
            handler: async function (to): Promise<void> {
                const videoPath = this.$data.videoPath = to.params.path;
                const res = await fetch(`/duration/${videoPath}`);
                const json = (await res.json()) as StreamecabAPI.Duration;
                const duration = Math.round(json.duration);
                this.$data.duration = duration;
                console.log('duration:', duration);
            },
            immediate: true
        }
    }
});
</script>
