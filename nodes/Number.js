import Expression from "../abstract/Expression.js"

export default class Number extends Expression {
    constructor(value, location) {
        super();
        this.value = value;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitNumber(this);
    }
}