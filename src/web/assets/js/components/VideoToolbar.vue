<template>
    <div class="container">
        <div class="play-or-stop-button" @click="onPlayOrStopButtonClick">
            <font-awesome-icon :icon="playOrStopButtonIcon" />
        </div>
        <vue-slider class="slider" v-model="currentTimeComputed" :lazy="true" :min="0" :max="duration" :interval="1"
                    :tooltip-formatter="timeFormatter" @change="onSliderChange" ></vue-slider>
        <div class="timer">{{ currentTimeFormatted }} / {{ durationFormatted }}</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../css/base';

.container {
    width: 100%;
    display: flex;

    .play-or-stop-button {
        width: 2rem;
        padding-left: $small-spacing;
        padding-right: $small-spacing;
        text-align: center;
    }

    .slider {
        width: 100% !important;
        margin-left: $small-spacing;
        box-sizing: content-box;
    }

    .timer {
        display: inline-block;
        padding-left: $small-spacing;
        padding-right: $small-spacing;
        white-space: nowrap;
    }
}
</style>


<script lang="ts">
import Vue from 'vue';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import VueUtilsPlugin from '../VueUtilsPlugin';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faPlay, faPause)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
        playOrStopButtonIcon: function(): string {
            return this.$props.isPlaying ? "pause" : "play";
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
