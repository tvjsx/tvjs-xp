
const fetch = require('node-fetch')
const fs = require('fs')

var tickers = {}

module.exports = class ImportPlugin {

    constructor(url, path) {

        clearInterval(tickers[url])

        let parts = url.split('/')
        let name = parts.pop()
        let checker = parts.join('/') + '/status.js'

        tickers[url] = setInterval(() => {
            fetch(checker)
                .then(res => res.text())
                .then(res => {
                    if (res !== this.hash) {
                        this.update(url, name, path)
                    }
                    this.hash = res
                })
                .catch(e => {})

        }, 1000)

        this.update(url, name, path)
    }

    update(url, name, path) {
        console.log('UPDATED', url)
        path = path || './imports'
        fetch(url)
            .then(res => res.text())
            .then(res => {
                if (res.includes('<!DOCTYPE html>')) {
                    return
                }
                setTimeout(() => {
                    fs.writeFileSync(`${path}/${name}`, res)
                })
            })
            .catch(e => {})
    }

    apply() {}

}
