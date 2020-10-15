<template>
<div class="chart-box">
    <trading-vue :id="id" :data="chart" :titleTxt = "title"
            :width="width" :height="height"
            :key="'tv'+resetkey" ref='tv'
            :legend-buttons="['settings']"
            :toolbar="true"
            :color-title="colors.colorTitle"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :extensions="ext"
            :x-settings="xsett">
    </trading-vue>
</div>
</template>

<script>
import TradingVue from 'trading-vue-js'
import { DataCube } from 'trading-vue-js'

export default {
    name: 'Chartbox',
    props: [
        'id', 'tf', 'data', 'width', 'height', 'night', 'resetkey',
        'ext', 'xsett'
    ],
    components: {
        TradingVue
    },
    mounted() {
        window[`tv${this.id}`] = this.$refs.tv
        window[`dc${this.id}`] = this.chart

        // DEBUG
        if (this.id === '12H') {
            this.chart.add('offchart', {
                name: 'Kek',
                type: 'Spline',
                data: this.chart.data.chart.data.map(x => x.slice(0,2)),
                settings: {}
            })
        }
    },
    methods: {

    },
    computed: {
        title() {
            return 'Bitcoin ' + this.$props.tf
        },
        colors() {
            return this.$props.night ? {} : {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
                colorTitle: '#333'
            }
        },
    },
    data() {
        return {
            chart: new DataCube({ ohlcv: this.$props.data })
        }
    }
};
</script>

<style>
.chart-box {
    border: 0.5px solid transparent;
    margin-top: -1px;
}
</style>
