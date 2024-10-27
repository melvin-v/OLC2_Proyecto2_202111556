import Expression from "../abstract/Expression.js"

export default class Declaration extends Expression {
    constructor(type, id, expr, location) {
        super();
        this.type = type;
        this.id = id;
        this.expr = expr;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitDeclaration(this);
    }
}