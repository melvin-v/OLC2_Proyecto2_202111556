import Expression from "../abstract/Expression.js"

export default class Primitive extends Expression {
    constructor( valor, tipo, location) {
        super();
        this.valor = valor;
        this.tipo = tipo;
        this.location = location;

    }
    accept(visitor) {
        return visitor.visitPrimitive(this)
    }
}