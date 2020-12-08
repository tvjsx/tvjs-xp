
// Extension's controller

import { Utils } from 'trading-vue-js'
import Vue from 'vue'
import AddWin from './AddWin.vue'

export default class Main {

    constructor(tv, dc, sett) {

        this.widgets = {}
        this.tv = tv
        this.dc = dc
        this.sett = sett

    }

    // Listens to all tvjs events, creates new widgets
    update(e) {
        switch(e.event) {
            case 'legend-button-click':
                this.onbutton(e.args[0])
            break
        }
    }

    onbutton(e) {
        let ov = this.dc.get(e.type)[e.dataIndex]
        let onchart = this.dc.data.onchart
        let offchart = this.dc.data.offchart
        if (!ov) return
        switch(e.button) {
            case 'display':
                if (ov.settings.display === undefined) {
                    var flag = false
                } else {
                    flag = !ov.settings.display
                }
                this.tv.$set(ov.settings, 'display', flag)
                break
            case 'up':
                if (e.type === 'offchart') {
                    if (e.dataIndex === 0) {
                        offchart.splice(e.dataIndex, 1)
                        onchart.push(ov)
                    } else {
                        let data = offchart
                        let i0 = e.dataIndex
                        let i1 = e.dataIndex-1
                        data[i0] = data.splice(i1, 1, data[i0])[0]
                    }
                }
                this.dc.update_ids()
                break
            case 'down':
                if (e.type === 'onchart') {
                    let h = this.avg_grid_h(offchart)
                    onchart.splice(e.dataIndex, 1)
                    offchart.unshift(ov)
                    this.tv.$set(ov, 'grid', {height: h})
                } else {
                    let n = offchart.length
                    let data = offchart
                    if (e.dataIndex < n - 1) {
                        let i0 = e.dataIndex
                        let i1 = e.dataIndex+1
                        data[i0] = data.splice(i1, 1, data[i0])[0]
                    }
                }
                this.dc.update_ids()
                break
            case 'add':
                try {
                    let id = `AddWin-${Utils.uuid2()}`
                    let ov = this.dc.data[e.type][e.dataIndex]
                    let f = Object.values(this.widgets)
                        .find(x => x.data.ov === ov)
                    if(f) {
                        this.tv.$delete(this.widgets, f.id)
                        break
                    }
                    this.tv.$set(this.widgets, id, {
                        id, cls: AddWin, data: {
                            ov: ov,
                            type: e.type,
                            index: e.dataIndex
                        }
                    })
                } catch(e) {
                    console.log(e)
                }
                break
            case 'remove':
                this.dc.data[e.type].splice(e.dataIndex, 1)
                this.dc.update_ids()
                break
        }
    }

    // Called from AddWin.vue
    add_overlay(e) {
        let preset = this.get_preset(e.type) || {}
        if (preset.side) e.side = preset.side
        let onchart = this.dc.data.onchart
        let offchart = this.dc.data.offchart
        if (e.side === 'onchart') {
            onchart.splice(e.index+1, 0, {
                name: preset.name,
                type: e.type,
                data: [],
                settings: preset.settings || {}
            })
        } else {
            let h = this.avg_grid_h(offchart)
            offchart.splice(e.index+1, 0, {
                name: preset.name,
                type: e.type,
                data: [],
                settings: preset.settings || {},
                grid: {height: h}
            })
        }
        this.dc.update_ids()
    }

    // Get preset (default settings, colors) if defined
    get_preset(type) {
        let proto = this.tv.overlays.find(x => x.name === type)
        if (proto && proto.methods.meta_info) {
            let meta = proto.methods.meta_info()
            return meta.preset
        }
    }

    // Extension settings has changed
    onsettings(sett) {}

    avg_grid_h(ovs) {
        if (!ovs.length) return 0.25
        let gh = 0
        for (var ov of ovs) {
            if (ov.grid && typeof ov.grid.height === 'number') {
                gh += ov.grid.height
            }
        }
        return gh / ovs.length
    }

    remove_widget(id) {
        this.tv.$delete(this.widgets, id)
    }

    destroy() {

    }

}
