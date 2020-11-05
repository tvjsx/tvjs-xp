<template>
    <trading-vue :data="dc" :width="this.width" :height="this.height"
        title-txt="TVJS XP" :key="resetkey"
        ref="tvjs"
        :legend-buttons="['settings', 'display']"
        :chart-config="{DEFAULT_LEN:70}"
        :color-back="colors.colorBack"
        :color-grid="colors.colorGrid"
        :color-text="colors.colorText"
        :extensions="ext"
        :x-settings="xsett"
    />
</template>
<script>

import TradingVue from 'trading-vue-js'
import { DataCube } from 'trading-vue-js'
import Data from '../../data/data.json'

export default {
    name: 'App1',
    props: ['night', 'ext', 'resetkey'],
    components: {
        TradingVue
    },
    methods: {
        onResize(event) {
            this.width = window.innerWidth
            this.height = window.innerHeight - 50
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()
        window.dc = this.dc
        window.tv = this.$refs.tvjs
    },
    computed: {
        colors() {
            return this.$props.night ? {} : {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333'
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            dc: new DataCube(Data),
            width: window.innerWidth,
            height: window.innerHeight,
            xsett: {
                'grid-resize': { min_height: 30 }
            }
        }
    }
}
</script>
<style>

</style>
