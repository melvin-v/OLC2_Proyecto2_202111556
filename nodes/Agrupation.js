import Expression from "../abstract/Expression.js"

export default class Agrupation extends Expression {
    constructor(expr, location) {
        super();
        this.expr = expr;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitAgrupation(this);
    }
}