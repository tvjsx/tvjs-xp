<template>
    <span class="h-splitter"
        @mousedown="hs_mousedown" :style="hs_style">
    </span>
</template>
<script>

import Utils from './utils.js'

export default {
    name: 'Splitter',
    props: ['id', 'main', 'dc', 'tv', 'data'],
    mounted() {
        this.MIN_HEIGHT = this.data.sett.min_height || 20
    },
    methods: {
        hs_mousedown(e) {
            this.drag = {
                type: 'hs',
                y: e.clientY,
                h1: this.data.grid1.height,
                h2: this.data.grid2.height
            }
            Utils.add_style('disable-user-select', `body * {
                user-select: none;
            }
            .trading-vue-chart {
                pointer-events: none;
            }`)
        },
        hs_mouseup(e) {
            this.drag = null
            Utils.rem_style('disable-user-select')
        },
        hs_mousemove(e) {
            if (this.drag) {
                let off = e.clientY - this.drag.y
                let new_h1 = this.drag.h1 + off
                let new_h2 = this.drag.h2 - off
                if (new_h1 > this.MIN_HEIGHT &&
                    new_h2 > this.MIN_HEIGHT) {
                    this.data.grid1.height = new_h1
                    this.data.grid2.height = new_h2
                }
                this.main.calc_heights()
            }
        },
        hs_mouseleave(e) {
            this.drag = null
            Utils.rem_style('disable-user-select')
        }
    },
    computed: {
        hs_style() {
            return {
                drag: null,
                top: this.data.grid2.offset + 'px',
                //backgroundColor: this.colors.splitter
            }
        },
    }
}
</script>
<style scoped>
.h-splitter {
    position: absolute;
    left: 0;
    height: 5px;
    margin-top: -2px;
    width: 100%;
    z-index: 1;
    background-color: #3ee4afb5;
    opacity: 0;
    pointer-events: all;
}
.h-splitter:hover {
    cursor: row-resize;
    opacity: 1;
}
</style>
