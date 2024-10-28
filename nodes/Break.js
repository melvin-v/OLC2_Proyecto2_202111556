import Expression from "../abstract/Expression.js"
export default class Break extends Expression {
    constructor(location) {
        super();
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitBreak(this);
    }
}