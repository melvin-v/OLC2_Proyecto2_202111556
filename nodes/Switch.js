import Expression from '../abstract/Expression.js';

export default class Switch extends Expression {
    constructor( expr, cases, defaultAction, location ) {
        super();
        this.expr = expr;
        this.cases = cases;
        this.defaultAction = defaultAction;
        this.location = location
    }
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}