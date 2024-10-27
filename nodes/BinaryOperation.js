import Expression from "../abstract/Expression.js"

export default class BinaryOperation extends Expression {
    constructor(left, op, right, location) {
        super();
        this.left = left;
        this.op = op;
        this.right = right;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitBinaryOperation(this);
    }
}