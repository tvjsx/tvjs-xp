<template>
    <div>
        <div id="tvjs-header">
            <h1><img src="/assets/logo.png"/>
                <label>Std Extension Pack</label>
            </h1>
            <multiselect :list="ext_names" @onstate="reset"/>
            <span class="night-mode">
                <input type="checkbox" v-model="night">
                <label>NM</label>
            </span>
        </div>
        <div id="app-conainer" :style="{top: top+'px'}">
            <component v-bind:is="current_app"
                :night="night" :resetkey="resetkey"
                :ext="extensions">
            </component>
        </div>
        <div class="app-tags">
            <app-tag v-for="app of apps" :id="app.id"
                :sel="current === app.id" :key="app.id"
                @select="onselect"/>
        </div>
    </div>
</template>

<script>
import TradingVue from 'trading-vue-js'
import { DataCube } from 'trading-vue-js'
import StdInput from './components/StdInput.vue'
import Multiselect from './components/Multiselect.vue'
import AppTag from './components/AppTag.vue'
import Data from '../data/data.json'
import Extensions from './index_dev'

import App1 from './apps/App1.vue'
import App2 from './apps/App2.vue'

export default {
    name: 'app',
    components: {
        TradingVue, StdInput, Multiselect, AppTag
    },
    methods: {
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight - this.top
        },
        win_query() {
            let qs = (function(a) {
                if (a == "") return {};
                var b = {};
                for (var i = 0; i < a.length; ++i) {
                    var p=a[i].split('=', 2);
                    if (p.length == 1)
                        b[p[0]] = "";
                    else
                        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                }
                return b;
            })(window.location.search.substr(1).split('&'));
            return qs
        },
        reset(state) {
            let sub = Object.keys(state).filter(x => state[x])
            this.extensions = sub.map(x => Extensions[x])
            this.resetkey++
        },
        onselect(id) {
            this.current = id
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        let q = this.win_query()
        if (q.nm === 'false') this.night = false
        if (q.ov) this.current = q.ov
        if (q.header === 'false') this.top = 0
        this.onResize()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            chart: new DataCube(Data), // Data will be here,
            width: window.innerWidth,
            height: window.innerHeight,
            extensions: Object.values(Extensions),
            ext_names: Object.keys(Extensions),
            night: true,
            current: 'app-1',
            top: 50,
            resetkey: 0,
            apps: [
                { id: 'app-1', comp: App1 },
                { id: 'app-2', comp: App2 },
            ]
        }
    },
    computed: {
        current_app() {
            return this.apps.find(
                x => x.id === this.current).comp
        }
    }
}
</script>

<style>
html,
body {
    background-color: #000;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font: 11px -apple-system,BlinkMacSystemFont,
        Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
        Fira Sans,Droid Sans,Helvetica Neue,
        sans-serif
}
#tvjs-header {
    position: absolute;
    height: 49px;
    color: #ddd;
    width: 100%;
    background-color: #121826;
    border-bottom: 1px solid black;
}
#tvjs-header img{
    width: 40px;
    height: 40px;
    margin: 5px;
}

#tvjs-header label{
    vertical-align: top;
    line-height: 2.3em;
    margin-left: 2px;
    font-weight: 500;
}

#app-conainer {
    position: absolute;
    width: 100%;
}
#tvjs-header h1 {
    color: #9b9ca0;
    margin: 0px 0 0 3px;
}
#tvjs-header p {
    position: absolute;
    width: 100%;
    top: 1px;
    text-align: center;
    font-family: -apple-system,BlinkMacSystemFont,
    Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
    Fira Sans,Droid Sans,Helvetica Neue,
    sans-serif;
    font-weight: 200;
}
#extensions-lbl {
    position: absolute;
    top: 17px;
    color: #5e6061;
    right: 290px;
    font-weight: 600;
}
.night-mode {
    position: absolute;
    top: 15px;
    right: 20px;
}
.app-tags {
    position: absolute;
    top: 65px;
    right: 75px;
}
</style>
