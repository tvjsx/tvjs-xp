export default {
    id: 'darkside', // Skin id
    /**
     * Use js object instead of json, so we can comment colors and
     * the IDE can show the hex color preview plus gui color picker
     *
     * To generate the json file run from this folder: "node ./jsoncompiler.js"
     * or
     * from the project root: "node ./src/extensions/darkside/jsoncompiler.js"
     *
     * Enjoy the dark side.
     */
    colors: { // Color pack
        title: '#cccccc', // Title text color
        back: '#18191b', // Background color
        grid: '#202124', // Grid color
        text: '#cccccc', // Text (labels) color
        textHL: '#cccccc', // Highlighted text color
        scale: '#585b62', // Scales border color
        cross: '#758696', // Crosshair color
        candleUp: '#159f49', // Green candle color
        candleDw: '#df4249', // Red candle color
        wickUp: '#159f49', // Green wick color
        wickDw: '#df4249', // Red wick color
        volUp: '#159f4980', // Green volume color
        volDw: '#df424980', // Red volume color
        panel: '#4c525e', // Value bars color
        tbBack: '#18191b', // Toolbar background color
        tbBorder: '#585b62' // Toolbar border color
    },
    shaders: [], // Background Shaders
    font: '', // Font
    styles: '' // Global css stylesheet
}
