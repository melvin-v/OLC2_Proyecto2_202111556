import Expression from "../abstract/Expression.js"

export default class Return extends Expression {
    constructor( exp, location ) {
        super();
        this.exp = exp;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitReturn(this);
    }
}