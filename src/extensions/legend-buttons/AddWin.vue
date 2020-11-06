<template>
    <window title="Add Overlay" class="add-win"
        @close="on_close" :tv='tv'>
        <div class="add-win-list">
            <div v-for="ov of ovs" class="add-win-item"
                @click="on_click(ov.name)">
                <span>{{ov.name}}</span>
                <span class="add-win-item-desc">
                    {{ov.methods.meta_info().desc}}
                </span>
            </div>
        </div>
    </window>
</template>
<script>

import Window from '../../components/Window.vue'

export default {
    name: 'AddWin',
    props: ['id', 'main', 'dc', 'tv', 'data'],
    components: { Window },
    mounted() {
    },
    methods: {
        on_close() {
            this.$props.main.remove_widget(this.$props.id)
        },
        on_click(name) {
            this.on_close()
            this.main.add_overlay({
                side: this.data.type,
                index: this.data.index,
                type: name
            })
        }
    },
    computed: {
        sett() {
            return this.$props.data.ov.settings
        }
    },
    data() {
        return {
            ovs: this.tv.overlays.filter(x => x.methods.calc)
        }
    }
}
</script>
<style scoped>
.tvjs-x-window.add-win {
    padding-bottom: 30px;
    border: 1px solid #80808011;
}
.add-win-list {
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;
}
/* Hide scrollbar for Chrome, Safari and Opera */
.add-win-list::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.add-win-list {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.add-win-item {
    color: #ffffff88;
    width: 100%;
    padding: 5px;
    cursor: pointer;
}
.add-win-item:hover {
    background: #88888822;
    color: #ffffffff;
}
.add-win-item-desc {
    color: #ffffff33;
    margin-left: 3px;
}
.add-win-item:hover .add-win-item-desc {
    color: #ffffff44;
}
.add-win-empty {
    opacity: 0.5;
}
</style>
