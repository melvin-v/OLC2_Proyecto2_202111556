import Expression from "../abstract/Expression.js"

export default class Print extends Expression {
    constructor(exprs, location) {
        super();
        this.exprs = exprs;
        this.location = location
    }
    accept(visitor) {
        visitor.visitPrint(this);
    }
}