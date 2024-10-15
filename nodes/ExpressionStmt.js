import Expression from "../abstract/Expression.js"

export default class ExpressionStmt extends Expression{
    constructor(expression, location){
        super();
        this.expr = expression;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitExpressionStmt(this);
    }
}