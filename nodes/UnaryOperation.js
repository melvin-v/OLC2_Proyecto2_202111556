import Expression from "../abstract/Expression.js"

export default class UnaryOperation extends Expression {
    constructor( exp, op, location ) {
        super();
        this.exp = exp;
        this.op = op;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitUnaryOperation(this);
    }
}