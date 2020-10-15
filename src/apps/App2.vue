<template>
    <span>
        <div class="multi-chart">
            <chartbox v-for="(timeframe, id) in charts" :key="id"
                :id="id" :tf="id" v-bind:data="timeframe"
                :width="cbox_width" :height="cbox_height"
                :night="night" :ext="ext" :xsett="xsett"
                :resetkey="resetkey">
            </chartbox>
        </div>
        <div class="link-icon" :style="lst" @click="onlink">
        </div>
        <codepane v-if="code" :colors="colors" :width="500"
        :height="500" :src="rules"
        @src-changed="src_changed"
        @close-code="oncodeclose"/>
    </span>
</template>
<script>

import TradingVue from 'trading-vue-js'
import { DataCube } from 'trading-vue-js'
import Data from '../../data/data-multi.json'
import Chartbox from '../components/Chartbox.vue'
import Codepane from '../components/Codepane.vue'

const DEFAULT = `// Chart link rules
{
    '*': {
        cursor: true,
        position: true,
        tools: true
    },
    'D -> 1H': {
        data: ['BB'], // WIP
    },
    'D -> 4H,12H': {
        range: 'X' // WIP
    },
    '1H -> *': {
        // ...
    }
}
`

export default {
    name: 'App1',
    props: ['night', 'ext', 'resetkey'],
    components: {
        TradingVue, Chartbox, Codepane
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()
        this.src_changed(DEFAULT)
    },
    methods: {
        onResize(event) {
            this.width = window.innerWidth
            this.height = window.innerHeight - 50
        },
        src_changed(txt) {
            this.rules = txt
            try {
                let code = txt.replace('{', 'return {')
                var obj = new Function('', `${code}`)()
            } catch(e) {
                console.log('SYNTAX ERR', {e})
                return
            }
            this.xsett['chart-link'].rules = obj
        },
        onlink() {
            this.code = true
        },
        oncodeclose() {
            this.code = false
        }
    },
    computed: {
        cbox_width() { return Math.floor(this.width / 2 - 1) },
        cbox_height() { return Math.floor(this.height / 2 - 1) },
        colors() {
            return this.$props.night ? {} : {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
                cmBack: '#fffffff0',
                cmCode: '#333',
                selection: '#eeeeef99',
                cmLineNumber: '#6d8a8882',
                border: '#88888888',
                shadow: '#0b0e1422'
            }
        },
        lst() {
            return this.night ? { 'opacity': '0.6' } : {}
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            charts: Data,
            width: window.innerWidth,
            height: window.innerHeight,
            xsett: {
                'grid-resize': { min_height: 30 },
                'chart-link': { rules: {} }
            },
            rules: DEFAULT,
            code: false
        }
    }
}
</script>
<style>
.multi-chart {
    display: grid;
    grid-template-columns: 50% 50%;
    height: 100%;
}
.link-icon {
    position: absolute;
    width: 25px;
    height: 25px;
    background: url(/assets/link.png);
    background-size: cover;
    top: calc(50% - 14px);
    left: calc(50% - 12px);
    cursor: pointer;
    z-index: 100;
    opacity: 0.9;
}
</style>
