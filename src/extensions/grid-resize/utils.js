export default {

    add_style(id, style) {

        var stbr = document.getElementById(id)
        if (stbr) {
            var sheetParent = stbr.parentNode
            sheetParent.removeChild(stbr)
        }

        var sheet = document.createElement('style')
        sheet.setAttribute("id", id)
        sheet.innerHTML = style
        document.body.appendChild(sheet)
    },

    rem_style(id, style) {
        var stbr = document.getElementById(id)
        if (stbr) {
            var sheetParent = stbr.parentNode
            sheetParent.removeChild(stbr)
        }
    }

}
