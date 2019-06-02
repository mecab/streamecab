<template>
    <div>
        <h1>{{ videoPath }}</h1>
        <video class="video" ref="video" :src="videoPathWithQuery" @timeupdate="onTimeUpdate()" @play="onPlay" @pause="onPause" autoplay></video>
        <video-toolbar :currentTime="currentTime" :duration="duration" :isPlaying="isPlaying"
                        @sliderChange="onSliderChange" @requestPlay="onRequestPlay" @requestStop="onRequestStop" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VideoToolbar from './VideoToolbar.vue';
import 'vue-slider-component/theme/antd.css'

export default Vue.extend({
    components: {
        VideoToolbar,
    },

    props: {
        videoPath: String,
        duration: Number,
        startFrom: Number,
    },

    data() {
        const vm = this;
        return {
            elapsed: 0,
            isPlaying: false,
        };
    },

    computed: {
        videoPathWithQuery: function() {
            const searchParams = new URLSearchParams();
            searchParams.append('time', this.$props.startFrom);
            return `/video/${this.$props.videoPath}?${searchParams.toString()}`
        },

        currentTime: function() {
            return this.$props.startFrom + this.$data.elapsed;
        }
    },

    methods: {
        onTimeUpdate() {
            this.$data.elapsed = Math.floor((this.$refs.video as HTMLMediaElement).currentTime);
        },

        onSliderChange(time: number) {
            this.$emit('requestSeek', time);
        },

        onRequestPlay() {
            console.log('onRequestPlay');
            (this.$refs.video as HTMLMediaElement).play();
        },

        onRequestStop() {
            console.log('onRequestStop');
            (this.$refs.video as HTMLMediaElement).pause();
        },

        onPlay() {
            console.log('onPlay');
            this.$data.isPlaying = true;
        },

        onPause() {
            console.log('onPause');
            this.$data.isPlaying = false;
        }
    }
});
</script>

<style lang="scss">
.video {
    width: 100%;
}
</style>
