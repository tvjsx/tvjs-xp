
<div align="center">
  <img width="318" heigth="256" src="https://raw.githubusercontent.com/tvjsx/tvjs-xp/main/assets/logo.png" alt="tvjs-xp logo">
</div>


# TVJS Std Extension Pack ![npm](https://img.shields.io/npm/v/tvjs-xp.svg?color=brightgreen&label=version) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![size](https://img.shields.io/github/size/tvjsx/tvjs-xp/dist/tvjs-xp.min.js.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![build](https://img.shields.io/badge/build-passing-brightgreen.svg)

<div align="center">
  <img width="640" heigth="372" src="https://raw.githubusercontent.com/tvjsx/tvjs-xp/main/assets/showcase.gif" alt="tvjs-xp logo">
</div>

<br>

## Install

```
npm i tvjs-xp
```

## List of extensions

| Name | Author | Type | Description | Version |
|---|---|---|---|---|
| chart-link | StdSquad | Ext | Sync multiple charts (cursors, drawing tools) | 1.0.0 |
| grid-resize | StdSquad | Ext | Resize vertical sections | 1.0.0 |
| legend-buttons | StdSquad | Ext | Moving overlays aroud, adding, removing | 1.0.0 |
| settings-win | StdSquad | Ext | Changing script props (settings) | 1.0.0 |

## Usage

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

In browser:

```js
//...
ext: Object.values(TvjsXP.default),
//...
```
