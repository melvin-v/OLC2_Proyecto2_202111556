import Expression from "../abstract/Expression.js"

export default class Param extends Expression {
    constructor( id, tipo, location ) {
        super();
        this.id = id;
        this.tipo = tipo;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitParam(this);
    }
}