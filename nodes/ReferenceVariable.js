import Expression from '../abstract/Expression.js';

export default class ReferenceVariable extends Expression {
    
    constructor( id, location) {
        super();
        this.id = id;
        this.location = location;
    }
    
        accept(visitor) {
            return visitor.visitReferenceVariable(this);
        }
    
    }