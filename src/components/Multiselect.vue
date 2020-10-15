<template>
<div id="list1" class="dropdown-check-list" tabindex="100">
    <span class="anchor">Extensions</span>
    <ul class="items">
        <li v-for="name of list">
            <input type="checkbox" v-model="checks[name]"
                @input="on_switch"/>
            {{name}}
        </li>
    </ul>
</div>
</template>
<script>
export default {
    name: 'Multiselect',
    props: ['list'],
    mounted() {
        var checkList = document.getElementById('list1')
        checkList.getElementsByClassName('anchor')[0].onclick = evt => {
            if (checkList.classList.contains('visible'))
                checkList.classList.remove('visible')
            else
                checkList.classList.add('visible')
        }
        for (var n of this.$props.list) {
            this.$set(this.checks, n, true)
        }
    },
    methods: {
        on_switch() {
            setTimeout(() => {
                this.$emit('onstate', this.checks)
            })
        }
    },
    data() {
        return {
            checks: {}
        }
    }
}
</script>
<style>
.dropdown-check-list {
    display: inline-block;
    position: absolute;
    top: 12px;
    right: 100px;
    z-index: 1000;
    background: inherit;
    outline: none;
    user-select: none;
}

.dropdown-check-list .anchor {
    position: relative;
    cursor: pointer;
    display: inline-block;
    padding: 5px 50px 5px 10px;
    border: 1px dotted #a5a5a554;
    width: 150px;
    border-radius: 3px;
}

.dropdown-check-list .anchor:after {
    position: absolute;
    content: "";
    border-left: 1px solid #fff;
    border-top: 1px solid #fff;
    padding: 3px;
    right: 10px;
    top: 25%;
    -moz-transform: rotate(-135deg);
    -ms-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
}

.dropdown-check-list .anchor:active:after {
    right: 9px;
}

.dropdown-check-list ul.items {
    padding: 2px;
    display: none;
    margin: 0;
    border: 1px dotted #a5a5a554;
    border-top: none;
}

.dropdown-check-list ul.items li {
    list-style: none;
}

.dropdown-check-list ul.items li input {
    vertical-align: sub;
    margin-right: 5px;
}
.dropdown-check-list.visible .anchor {
    color: #0094ff;
}

.dropdown-check-list.visible .items {
    display: block;
    padding: 5px;
}
</style>
