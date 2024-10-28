import Expression from '../abstract/Expression.js';

export default class If extends Expression {
    constructor( cond, stmtTrue, stmtFalse, location ) {
        super();
        this.cond = cond;
        this.stmtTrue = stmtTrue;
        this.stmtFalse = stmtFalse;
        this.location = location;

    }

    accept(visitor) {
        return visitor.visitIf(this);
    }
}