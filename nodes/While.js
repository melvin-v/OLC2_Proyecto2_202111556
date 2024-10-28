import Expression from "../abstract/Expression.js"

export default class While extends Expression {
    constructor( cond, stmt, location ) {
        super();
        this.cond = cond;
        this.stmt = stmt;
        this.location = location;
    }
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}