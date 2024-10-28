import Expression from "../abstract/Expression.js"

export default class BinaryOperation extends Expression {
    constructor(izq, der, op, location) {
        super();
        this.izq = izq;
        this.der = der;
        this.op = op;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitBinaryOperation(this);
    }
}