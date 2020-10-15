<template>
<div class="app-tag" :id="id" :style="style"
    @click="on_click">
    {{n2N(id)}}
</div>
</template>
<script>

import Utils from '../stuff/utils.js'

export default {
    name: 'AppTag',
    props: ['id', 'sel'],
    mounted() {

    },
    methods: {
        n2N(txt) {
            return Utils.name2Name(txt)
        },
        on_click() {
            this.$emit('select', this.id)
        }
    },
    computed: {
        style() {
            return {
                opacity: this.sel ? 1 : 0.7,
                fontWeight: this.sel ? '600' : '400'
            }
        }
    },
    data() {
        return {

        }
    }
}
</script>
<style>
.app-tag {
    display: inline-block;
    background: #dda14c;/*#8b8b8bff;*/
    padding: 2px 10px;
    border-radius: 100px;
    cursor: pointer;
    margin-left: 10px;
    user-select: none;
    letter-spacing: 0.025em;
}
.app-tag:hover {
    filter: brightness(1.1);
}
</style>
