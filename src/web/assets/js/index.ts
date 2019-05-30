import Vue from 'vue'
import VueRouter from 'vue-router';
import Video from './pages/Video.vue';

Vue.config.productionTip = false
Vue.use(VueRouter);

const routes = [
    { 'path': '/watch/:path', component: Video }
]

const router = new VueRouter({
    mode: 'history',
    routes
});

new Vue({
    router
}).$mount('#app');

