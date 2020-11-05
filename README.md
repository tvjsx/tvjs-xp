
<div align="center">
  <img width="318" heigth="256" src="https://raw.githubusercontent.com/tvjsx/tvjs-xp/main/assets/logo.png" alt="tvjs-xp logo">
</div>


# TVJS Std Extension Pack

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
