import Expression from "../abstract/Expression.js"

export default class ExpressionStmt extends Expression{
    constructor( exp, location ) {
        super();
        this.exp = exp;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitExpressionStmt(this);
    }
}