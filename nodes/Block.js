import Expression from '../abstract/Expression.js';

export default class Block extends Expression {

    constructor( dcls, location ) {
        super();
        this.dcls = dcls;
        this.location = location;
    }

    accept(visitor) {

        return visitor.visitBlock(this);
    }

}