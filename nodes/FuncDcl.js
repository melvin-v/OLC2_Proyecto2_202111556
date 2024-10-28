import Expression from "../abstract/Expression.js"

export default class FuncDcl extends Expression {
    constructor({ id, params, bloque, tipo, location }) {
        super();
        this.id = id;
        this.params = params;
        this.bloque = bloque;
        this.tipo = tipo;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitFuncDcl(this);
    }
}