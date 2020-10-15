export default {

    copy(obj, mod) {
        let copy = JSON.parse(JSON.stringify(obj))
        return Object.assign(copy, mod)
    },

    removed(ids, prev) {
        let list = []
        for (var id of prev) {
            if (!ids.includes(id)) {
                list.push(id)
            }
        }
        return list
    }
}
