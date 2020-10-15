const fs = require('fs')
const parser = require('./extension-parser.js')
const minimist = require('minimist')
const pathmod = require('path')


const argv = minimist(process.argv.slice(2))

const PROD_BANNER = `
// -------- Production extension index ---------
//      ! THIS FILE WAS AUTO-GENERATED !
//
// Do not commit this file, the final index is
// compiled by the repo owner, use index_dev.js to
// experiment: 'npm run compile'
`

const DEV_BANNER = `
// -------- Development extension index ---------
//      ! THIS FILE WAS AUTO-GENERATED !
//
// You can overwrite it and have fun, to restore
// the default state: 'npm run compile'
`

const TEMPLATE = (name, banner, imports, defs, exports) => `
${banner}
${imports}

${defs}

const Pack = {
    ${exports}
}

export default Pack

export {
    ${exports}
}`

function compile() {

    let extensions = parser.parse()

    process.stdout.write(
        'Compiling '.gray + `${extensions.length} extensions...`)

    let banner = argv.prod ? PROD_BANNER : DEV_BANNER
    let postfix = argv.prod ? '.js' : '-dev.js'

    for (var x of extensions) {

        let imports = []
        let defs = []
        let exports = []

        // Vue.js comps
        for (var ctg of ['widgets', 'components', 'overlays']) {

            let ws = x[ctg].map(info => info.name)
            exports.push(`${ctg}`)
            defs.push(`const ${ctg} = { ${ws} }`)

            for (var info of x[ctg]) {
                let imp = `../../extensions/${x.name}` +
                    '/' + info.name + '.vue'
                imports.push(`import ${info.name} from '${imp}'`)
                exports.push(info.name)
            }
        }

        // Colorpax
        let cpx = x['colorpacks'].map(info => info.split('.')[0])
        exports.push(`colorpacks`)
        defs.push(`const colorpacks = { ${cpx} }`)

        for (var name of cpx) {
            let imp = `../../extensions/${x.name}` +
                '/' + name + '.json'
            imports.push(`import ${name} from '${imp}'`)
        }

        // Skins
        /*let sks = x['skins'].map(info => info.split('.')[0])
        exports.push(`skins`)
        defs.push(`const skins = { ${sks} }`)
        */

        imports.push(
            `import Main from '../../extensions/${x.name}/main.js'`
        )

        exports.push('Main')

        let source = TEMPLATE(
            x.name,
            banner,
            imports.join('\n'),
            defs.join('\n'),
            exports.join(',\n    ')
        )

        let dir = `./build/${x.name}/`
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
        fs.writeFileSync(dir + x.name + postfix, source)

        if (argv.prod) build_config(x)

        console.log(' [OK]'.green)
    }

    let type = argv.prod ? '👑 Production index' : 'Development index'

    if (argv.prod) lock_versions(extensions)
    if (argv.prod) build_list(extensions)

    build_cdn(extensions)

    console.log(type, '[Ready]'.green)

}

function build_config(x) {

    let temp = fs.readFileSync('./webpack/build.template.js', 'utf-8')
    let caps = name2Name(x.name)

    temp = temp.replace(/\[\[NAME\]\]/g, x.name)
    temp = temp.replace(/\[\[NAMECAPS\]\]/g, caps)
    temp = temp.replace(/\[\[VERS\]\]/g, x.version)
    temp = temp.replace(/\[\[AUTHOR\]\]/g, x.author)

    fs.writeFileSync(
        `./build/${x.name}/build.config.js`, temp
    )

    let pack_json = JSON.stringify({
        "name": x.name,
        "version": x.version,
        "description": "",
        "main": "",
        "author": x.author,
        "license": "",
        "dependencies": {}
    }, null, 4)

    fs.writeFileSync(
        `./build/${x.name}/package.json`, pack_json
    )

}

function lock_versions(extensions) {

    /*process.stdout.write('Locking current versions...')

    let obj = { extensions: {} }

    extensions = extensions.forEach(x => {
        let meta = x.methods.meta_info()
        obj.extensions[x.name] = {
            version: meta.version,
            author: meta.author,
            is_tool: !!x.methods.tool
        }
    })

    let json = JSON.stringify(obj, null, 4)

    fs.writeFileSync('extension-lock.json', json)

    console.log(' [OK]'.green)*/
}

function build_list(extensions) {

    let src = `const { exec } = require("child_process")\n\n`

    for (var x of extensions) {

        let cmd =
            `webpack --config build/${x.name}/build.config.js` +
            ` --mode production --progress`

        src += `exec("${cmd}", (error, stdout, stderr) => {
            if (error) {
                console.log(error.message)
                return;
            }
            if (stderr) {
                console.log(stderr)
                return;
            }
            console.log(stdout)
        })\n`
    }

    fs.writeFileSync(`./webpack/build.list.js`, src)
}

function build_cdn(extensions) {
//    '[[NAME]]': './build/[[NAME]]/[[NAME]].js',
/*
<a href="http://localhost:${port}/trading-vue.js">
    http://localhost:${port}/trading-vue.js
</a>
*/
    let temp = fs.readFileSync('./webpack/cdn.template.js', 'utf-8')

    temp = temp.replace(/\[\[ENTRIES\]\]/g, extensions.map(x =>
        `'${x.name}': './build/${x.name}/${x.name}.js'`,
    ).join(',\n'))

    temp = temp.replace(/\[\[CDNLIST\]\]/g, extensions.map(x =>
        `<a href="http://localhost:\${port}/${x.name}.js">
            http://localhost:\${port}/${x.name}.js
        </a>`
    ).join(',\n'))

    fs.writeFileSync(`./webpack/cdn.config.js`, temp)
}

function name2Name(sett) {
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str
        return str.substring(0,index) + chr + str.substring(index+1)
    }

    sett = sett.replace(/([^A-Z])([A-Z])/g, '$1 $2')
    sett = sett.replace(/-|_/g, ' ')
    let tuple = sett.split(' ')
    tuple = tuple
        .filter(x => x.length)
        .map(x => setCharAt(x, 0, x[0].toUpperCase()))
    return tuple.join('')
}

if (require.main === module) {
    compile()
}

module.exports.compile = compile
