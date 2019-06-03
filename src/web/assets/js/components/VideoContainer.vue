<template>
    <div>
        <header class="header">
            <h1 class="header__title">{{ videoPath }}</h1>
        </header>
        <video class="video" ref="video" :src="videoPathWithQuery" @timeupdate="onTimeUpdate()" @play="onPlay" @pause="onPause" autoplay></video>
        <video-toolbar class="toolbar" :currentTime="currentTime" :duration="duration" :isPlaying="isPlaying"
                        @sliderChange="onSliderChange" @requestPlay="onRequestPlay" @requestStop="onRequestStop" />
    </div>
</template>

<style lang="scss">
@import '../../css/base';

.header {
    padding: $small-spacing;
    &__title {
        font-size: 1.25rem;
        margin-bottom: 0;
        font-weight: normal;
    }
}

.video {
    width: 100%;
    max-height: calc(100vh - 5.5rem);
}

.toolbar {
    margin-top: $small-spacing;
}
</style>


<script lang="ts">
import Vue from 'vue'
import VideoToolbar from './VideoToolbar.vue';

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
            return `/api/video/${this.$props.videoPath}?${searchParams.toString()}`
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
