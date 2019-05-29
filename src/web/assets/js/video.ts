import Vue from 'vue'
import Video from '../pages/Video.vue';

Vue.config.productionTip = false

new Vue({
    el: '#app',
    template: '<Video/>',
    components: { Video }
});
