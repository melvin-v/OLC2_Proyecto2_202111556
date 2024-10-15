export default class Expression  {

    constructor() {
        this.location = null;
    }

    accept(visitor) {
        return visitor.visitExpresion(this);
    }

}