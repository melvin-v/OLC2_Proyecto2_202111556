import Expression from '../abstract/Expression.js';

export default class Case extends Expression {
    constructor( expr, cases, stmtBreak, location ) {
        super();
        this.expr = expr;
        this.cases = cases;
        this.location = location;
        this.stmtBreak = stmtBreak;
        }
    accept(visitor) {
        return visitor.visitCase(this);
    }
    }