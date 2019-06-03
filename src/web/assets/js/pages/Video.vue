<template>
    <div id="app" class="container">
        <VideoContainer :videoPath="videoPath" :duration="duration" :startFrom="startFrom" @requestSeek="onRequestSeek"></VideoContainer>
    </div>
</template>

<style lang="scss" scoped>
@import '../../css/base';

.container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #1a1a1a;
    color: #cccccc;
}
</style>


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
            startFrom: 0,
        };
    },
    watch: {
        '$route': {
            handler: async function (to): Promise<void> {
                const videoPath = this.$data.videoPath = to.params.path;
                const res = await fetch(`/api/duration/${videoPath}`);
                const json = (await res.json()) as StreamecabAPI.Duration;
                const duration = Math.round(json.duration);
                this.$data.duration = duration;
                console.log('duration:', duration);
            },
            immediate: true
        }
    },
    methods: {
        onRequestSeek(value: number) {
            this.$data.startFrom = value;
        }
    }
});
</script>
