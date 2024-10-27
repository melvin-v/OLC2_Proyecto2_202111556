import Expression from '../abstract/Expression.js';

export default class Assignment extends Expression {

    constructor( id, expr, location ) {
        super();
        this.id = id;
        this.expr = expr;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitAssignment(this);
    }

}