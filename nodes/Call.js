import Expression from "../abstract/Expression.js"

export default class Call extends Expression {
    constructor( callee, args, location ) {
        super();
        this.callee = callee;
        this.args = args;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitCall(this);
    }
}