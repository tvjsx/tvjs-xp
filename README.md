

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
