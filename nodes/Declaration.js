import Expression from "../abstract/Expression.js"

export default class Declaration extends Expression {
    constructor( id, exp, tipo, location) {
        super();
        this.id = id;
        this.exp = exp;
        this.tipo = tipo;
        this.location = location;
    }
    accept(visitor) {
        visitor.visitDeclaration(this);
    }
}