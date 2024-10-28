import Expression from "../abstract/Expression.js"

export default class Print extends Expression {
    constructor( exps, location ) {
        super();
        this.exps = exps;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitPrint(this);
    }
}