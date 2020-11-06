
<div align="center">
  <img width="318" heigth="256" src="https://raw.githubusercontent.com/tvjsx/tvjs-xp/main/assets/logo.png" alt="tvjs-xp logo">
</div>


# TVJS Std Extension Pack ![npm](https://img.shields.io/npm/v/tvjs-xp.svg?color=brightgreen&label=version) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![size](https://img.shields.io/github/size/tvjsx/tvjs-xp/dist/tvjs-xp.min.js.svg)
```
nmp i tvjs-xp
```

```html
<template>
<trading-vue :data="dc" :extensions="ext"/>
</template>
<script>

import TradingVue from 'trading-vue-js'
import XP from 'tvjs-xp'

export default {
    name: 'app',
    components: { TradingVue },
    data() {
        return {
            ext: Object.values(XP),
            dc: new DataCube(...)
        }
    }
}

</script>

```
