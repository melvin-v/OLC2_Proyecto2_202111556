import Expression from '../abstract/Expression.js';

export default class Assignment extends Expression {

    constructor( id, asgn, location ) {
        super();
        this.id = id;
        this.asgn = asgn;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitAssignment(this);
    }

}