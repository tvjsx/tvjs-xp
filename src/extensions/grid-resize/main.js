
// Extension's controller

import { Utils } from 'trading-vue-js'
import Vue from 'vue'
import Splitter from './Splitter.vue'

export default class Main {

    constructor(tv, dc, sett) {

        this.widgets = {}
        this.tv = tv
        this.dc = dc
        this.sett = sett

        setTimeout(() => {

            this.tv.$el.addEventListener(
                'mousemove', this.onmousemove.bind(this)
            )

            this.tv.$el.addEventListener(
                'mouseup', this.onmouseup.bind(this)
            )

            this.tv.$el.addEventListener(
                'mouseleave', this.onmouseleave.bind(this)
            )

            this.place_splitters()
            this.calc_heights()

            // Track changes of grids count
            this.tv.$watch(x =>
                this.dc.get('.').map(x => x.id),
                this.ongrids.bind(this))

        })

    }

    // Listens to all tvjs events, creates new widgets
    update(e) {
        switch(e.event) {

        }
    }

    // Extension settings has changed
    onsettings(sett) {}

    ongrids() {
        setTimeout(() => {
            this.remove_widgets()
            this.place_splitters()
        })
    }

    onmousemove(e) {
        // List of widgets created by this controller
        let list = this.tv.$refs.widgets.$children
            .filter(x => x.main === this)

        for (var s of list) {
            s.hs_mousemove(e)
        }
    }

    onmouseup(e) {
        // List of widgets created by this controller
        let list = this.tv.$refs.widgets.$children
            .filter(x => x.main === this)

        for (var s of list) {
            s.hs_mouseup(e)
        }
    }

    onmouseleave(e) {
        // List of widgets created by this controller
        let list = this.tv.$refs.widgets.$children
            .filter(x => x.main === this)

        for (var s of list) {
            s.hs_mouseleave(e)
        }
    }

    place_splitters() {
        let grids = this.tv.$refs.chart._layout.grids
        for (var i = 1; i < grids.length; i++) {
            let g1 = grids[i-1]
            let g2 = grids[i]
            let id = `Splitter-${g1.id}-${g2.id}-${Utils.uuid2()}`
            Vue.set(this.widgets, id, {
                id: id,
                cls: Splitter,
                data: {
                    grid1: g1,
                    grid2: g2,
                    sett: this.sett
                }
            })
        }
    }

    calc_heights() {
        let hs = []
        for (var g of this.tv.$refs.chart._layout.grids) {
            hs.push(g.height)
        }
        let sum = hs.reduce((a, b) => a + b, 0)
        hs = hs.map(h => h / sum)
        this.grid_ovs().forEach((ov, i) => {
            if (!ov.grid) {
                Vue.set(ov, 'grid', {})
            }
            Vue.set(ov.grid, 'height', hs[i] || 1)
        })
    }

    // Grid defining overlays
    grid_ovs() {
        let list = [this.dc.data.chart]
        for (var ov of this.dc.data.offchart) {
            if (!ov.grid || ov.grid.id === undefined) {
                list.push(ov)
            }
        }
        return list
    }

    remove_widgets() {
        for (var id in this.widgets) {
            this.tv.$delete(this.widgets, id)
        }
    }

    destroy() {
        this.tv.$el.removeEventListener(
            'mousemove', this.onmousemove
        )
        this.tv.$el.removeEventListener(
            'mouseup', this.mouseup
        )
        this.tv.$el.removeEventListener(
            'mouseleave', this.mouseleave
        )
    }

}
