<template>
    <div>
        <button class="play-or-stop-button" @click="onPlayOrStopButtonClick">{{playOrStopButtonText}}</button>
        <vue-slider v-model="currentTimeComputed" :lazy="true" :min="0" :max="duration" :interval="1"
                    :tooltip-formatter="timeFormatter" @change="onSliderChange" ></vue-slider>
        <div class="timer">{{ currentTimeFormatted }} / {{ durationFormatted }}</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueSlider from 'vue-slider-component';
import VueUtilsPlugin from '../VueUtilsPlugin';

Vue.use(VueUtilsPlugin);

export default Vue.extend({
    components: {
        VueSlider
    },

    props: {
        duration: Number,
        currentTime: Number,
        isPlaying: Boolean,
    },

    computed: {
        playOrStopButtonText: function(): string {
            return this.$props.isPlaying ? "⏸" : "▶️";
        },

        currentTimeFormatted: function(): string {
            return Vue.$utils.timeFormatter(this.$props.currentTime);
        },

        durationFormatted: function(): string {
            return Vue.$utils.timeFormatter(this.$props.duration);
        },

        currentTimeComputed: {
            get: function(): number {
                return this.$props.currentTime;
            },
            set: function(): void {}
        }
    },

    methods: {
        onSliderChange(time: number) {
            this.$emit('sliderChange', time);
        },

        onPlayOrStopButtonClick() {
            this.$props.isPlaying ? this.$emit('requestStop') : this.$emit('requestPlay');
        },

        timeFormatter: Vue.$utils.timeFormatter
    }
})
</script>
