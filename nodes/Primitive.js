import Expression from "../abstract/Expression.js"

export default class Primitive extends Expression {
    constructor(value, type, location) {
        super()
        this.value = value
        this.type = type
        this.location = location
    }
    accept(visitor) {
        return visitor.visitPrimitive(this)
    }
}