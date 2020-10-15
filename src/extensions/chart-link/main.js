
/* Example:

rules: {
    '* -> *': {},     // From each to each
    '*': {            // The same as ^
        cursor: true, // bool, 'X', 'Y', 'XY'
        position: 'X', // bool, 'X', 'Y', 'XY'
        tools: true
    },
    'trading-vue-1 -> trading-vue-2': {
        data: [
            'onchart.SMA',
            'RSI4H',
            {
                from: 'chart.data',
                to: 'datasets',
                obj: {
                    id: 'small-tf-data',
                    type: 'SourceData'
                }
            }
        ]
    },
    'none': {
        range: 'X', // bool, 'X', 'Y', 'XY'
    }
}
*/

import Shared from './shared.js'
import Utils from './utils.js'

export default class Main {

    constructor(tv, dc, sett) {

        if (sett.use_window) {
            if (!window.xchartlink$) {
                window.xchartlink$ = {}
            }
            this.shared = window.xchartlink$
        } else {
            this.shared = Shared
        }

        this.tv = tv
        this.dc = dc
        this.sett = sett
        this.targets = {}

        this.onsettings({'chart-link': sett})
    }

    onsettings(all) {
        clearTimeout(this.reset_id)
        this.sett = all['chart-link']
        if (!this.shared.rules) {
            this.shared.rules = {}
            this.shared.refs = {}
            this.shared.meta = {}
        }

        let el = document.getElementById(this.tv.id)

        if (this.sett.rules && el) {
            this.shared.rules[this.tv.id] = this.sett.rules
        }

        this.shared.refs[this.tv.id] = this.tv

        this.combine()
        this.reset_id = setTimeout(() => this.reset())
    }

    //  Combine rules from different instances
    combine() {
        this.shared.combined = {}
        for (var id in this.shared.rules) {
            for (var r in this.shared.rules[id]) {
                this.shared.combined[r] =
                    this.shared.rules[id][r]
            }
        }
    }

    // Compile rules for this instance
    compile() {

        let gebcn = 'getElementsByClassName'
        let els = [...document[gebcn]('trading-vue')]
        this.targets = {}

        for (let el of els) {
            if (el.id === this.tv.id) continue
            this.targets[el.id] = {}
        }

        let rules = this.rank(this.shared.combined)

        for (var r of rules) {
            let dst = r.pair[1]
            if (dst === '*') {
                dst = Object.keys(this.targets)
            }
            if (Array.isArray(dst)) {
                for (var d of dst) {
                    if (!(d in this.targets)) continue
                    Object.assign(this.targets[d], r.r)
                }
            } else {
                if (!(dst in this.targets)) continue
                Object.assign(this.targets[dst], r.r)
            }
        }
    }

    // Select, rank & sort the rules
    rank(rules) {
        let out = []
        for (var r in rules) {
            let pair = this.splitr(r)
            if (!this.matches(pair[0])) continue
            if (pair[0] === '*') {
                var rank = 20
            } else if (Array.isArray(pair[0]) ) {
                rank = 10
            } else {
                rank = 0
            }
            if (pair[1] === '*') {
                rank += 2
            } else if (Array.isArray(pair[1]) ) {
                rank += 1
            } else {
                rank += 0
            }
            out.push({pair, rank, r: rules[r]})
        }
        return out.sort((a, b) => b.rank - a.rank)
    }

    // Check if the source of a rule matches tv.id
    matches(src) {
        return src === '*' || src === this.tv.id ||
            (Array.isArray(src) && src.includes(this.tv.id))
    }

    splitr(rule) {
        if (rule.trim() === '*') return ['*', '*']
        return rule.split('->').map(x => {
            let tup = x.split(',')
            if (tup.length > 1) {
                return tup.map(y => y.trim())
            }
            return x.trim()
        })

    }

    // Apply all rules for this instance
    reset() {
        this.compile()

        // Enable some chart hook events
        this.tv.$refs.chart.hooks('xchanged')


        this.tv.$watch(x => this.dc.get('.')
            .filter(x => x.settings.$state),
            this.ontools.bind(this))

    }

    // Listening to the Chart.vue hooks &
    // other events
    update(e) {
        switch (e.event) {
            case '?x-changed':
                let cursor = e.args[0]
                if (cursor.preventDefault) return
                let main = this.tv.$refs.chart._layout.grids[cursor.grid_id]
                let mc = this.tv.$refs.chart.cursor
                cursor.t = mc.t
                cursor.$ = mc.y$
                for (var id in this.targets) {
                    let r = this.targets[id].cursor
                    if (r) {
                        let tv = this.shared.refs[id]
                        let g = tv.$refs.chart._layout.grids[0]
                        let xx = this.isX(r)
                        let yy = g.id === main.id && this.isY(r)
                        let upd = {
                            preventDefault: true,
                            x: xx ? g.t2screen(cursor.t) : -10,
                            y: yy ? g.$2screen(cursor.$) : -10,
                            grid_id: 0
                        }
                        tv.$refs.chart.cursor_changed(upd)
                        tv.$refs.chart.cursor.t = xx ? cursor.t : -10
                        tv.$refs.chart.cursor.y$ = yy ? cursor.$ : -10
                    }
                }
                break
            case 'range-changed':
                let now = new Date().getTime()
                let meta = this.shared.meta[this.tv.id]
                if (meta && meta.position) {
                    if (meta.position.lock > now) return
                }
                let range = e.args[0]
                for (var id in this.targets) {
                    let r = this.targets[id].position
                    let tv = this.shared.refs[id]
                    let xx = this.isX(r)
                    let yy = this.isY(r)
                    if (!this.shared.meta[id]) {
                        this.shared.meta[id] = {}
                    }
                    // Prevents an infinite loop
                    this.shared.meta[id].position = {
                        lock: now + 100
                    }
                    if (xx) tv.goto(range[1])
                }
                break
        }
    }

    ontools(n, p) {
        let rem = Utils.removed(
            n.map(x => x.settings.$uuid),
            p.map(x => x.settings.$uuid)
        )
        let now = new Date().getTime()
        let meta = this.shared.meta[this.tv.id]
        if (meta && meta.tools) {
            if (meta.tools.lock > now) return
        }
        for (var id in this.targets) {
            let r = this.targets[id].tools
            let tv = this.shared.refs[id]
            if (r) {
                if (!this.shared.meta[id]) {
                    this.shared.meta[id] = {}
                }
                // Prevents an infinite loop
                this.shared.meta[id].tools = {
                    lock: now + 100
                }
                this.copy_tools(n, tv)
                rem.forEach(r => tv.data.del(`${r}`))
            }
        }
    }

    copy_tools(n, tv) {
        for (var tool of n) {
            if (tool.id.includes('offchart')) continue
            let uuid = tool.settings.$uuid
            let exi = tv.data.get_one(`${uuid}`)
            if (exi) {
                tv.$set(exi, 'settings', Utils.copy(
                    tool.settings,
                    {
                        $selected: false,
                        $state: 'finished'
                    })
                )
                // TODO: maybe add a proper method
                // of accessing overlays
                let ovs = tv.$refs.chart.$refs.sec[0]
                    .$refs.grid
                    .$children.filter(x => x.tool)

                for (var ov of ovs) {
                    ov.pins.forEach(x => x.re_init())
                }

            } else {
                let copy = Utils.copy(tool)
                copy.settings.$selected = false
                copy.settings.$state = 'finished'
                tv.data.add('onchart', copy)
            }
        }
    }

    isX(rule) {
        return rule === true ||
            (typeof rule === 'string' && rule.includes('X'))
    }

    isY(rule) {
        return rule === true ||
            (typeof rule === 'string' && rule.includes('Y'))
    }

}
