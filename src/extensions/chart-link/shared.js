
//  Object shared beetween tvjs instances

class Shared {
    constructor() {
        this.__id__ = Math.random()
    }
}

export default new Shared()
