import Expression from "../abstract/Expression.js"

export default class UnaryOperation extends Expression {
    constructor(operator, expr, location) {
        super();
        this.operator = operator;
        this.expr = expr;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitUnaryOperation(this);
    }
}