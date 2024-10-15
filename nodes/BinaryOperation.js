import Expression from "../abstract/Expression.js"

export default class BinaryOperation extends Expression {
    constructor(left, operator, right, location) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitBinaryOperation(this);
    }
}