import Expression from '../abstract/Expression.js';

export default class Block extends Expression {

    constructor( statements, location ) {
        super();
        this.statements = statements;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitBlock(this);
    }

}