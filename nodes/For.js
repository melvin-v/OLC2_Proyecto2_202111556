import Expression from "../abstract/Expression.js"

export default class For extends Expression {
    constructor( init, cond, inc, stmt, location ) {
        super();
        this.init = init;
        this.cond = cond;
        this.inc = inc;
        this.stmt = stmt;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitFor(this);
    }
}