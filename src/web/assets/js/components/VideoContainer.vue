<template>
    <div>
        <h1>{{ videoPath }}</h1>
        <video ref="video" :src="videoPathWithQuery" @timeupdate="onTimeUpdate()" autoplay></video>
        <vue-slider v-model="currentTime" :lazy="true" :min="0" :max="duration" :interval="1" :tooltip-formatter="formatter" @change="onSliderChange" ></vue-slider>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default Vue.extend({
    components: {
        VueSlider
    },

    props: {
        videoPath: String,
        duration: Number,
        startFrom: Number,
    },

    data() {
        const vm = this;
        return {
            currentTime: 0,
            formatter: (v: number) => {
                const hoursAndColon = v >= 3600 ? `${Math.floor(v / 3600)}:` : '';
                const minutes = `${Math.floor(v / 60) % 60}`;
                const seconds = `${v % 60}`;

                const minutesPadded = minutes.length === 1 ? `0${minutes}` : minutes;
                const secondsPadded = seconds.length === 1 ? `0${seconds}` : seconds;
                return `${hoursAndColon}${minutesPadded}:${secondsPadded}`;
            },
            elapsed: 0,
        };
    },

    computed: {
        videoPathWithQuery: function() {
            const searchParams = new URLSearchParams();
            searchParams.append('time', this.$props.startFrom);
            return `/video/${this.$props.videoPath}?${searchParams.toString()}`
        }
    },

    methods: {
        onTimeUpdate() {
            const elapsed = this.$data.elapsed = Math.floor((this.$refs.video as HTMLMediaElement).currentTime);
            this.$data.currentTime = this.$props.startFrom + elapsed;
        },

        onSliderChange(time: number) {
            this.$emit('requestSeek', time);
        }
    }
});
</script>

<style lang="scss">
</style>
