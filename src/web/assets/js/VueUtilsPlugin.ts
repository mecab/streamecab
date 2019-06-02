import * as utils from './utils';
import { VueConstructor } from 'vue';

declare module 'vue/types/vue' {
    interface VueConstructor {
        $utils: {
            timeFormatter: (time: number) => string;
        };
    }
}

const VueUtilsPlugin = {
    install(Vue: VueConstructor, _options: object | undefined): void {
        Vue.$utils = utils;
    }
};

export default VueUtilsPlugin;
