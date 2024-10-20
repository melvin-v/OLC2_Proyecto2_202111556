import Visitor from "./abstract/Visitor.js"
import Generator from "./tools/Generator.js"
import { registers as r } from "./tools/registers.js";

export default class Compiler extends Visitor{
    constructor(){
        super();
        this.codeBuilder = new Generator();
    }

    visitExpressionStmt(expressionStmt){
        expressionStmt.expr.accept(this);
    }

    visitPrimitive(node) {
        this.codeBuilder.comment(`Primitivo: ${node.value}`);
        this.codeBuilder.pushConstant({ type: node.type, value: node.value });
        this.codeBuilder.comment(`Fin Primitivo: ${node.value}`);
    }

    visitBinaryOperation(binaryOperation){
        binaryOperation.left.accept(this);
        binaryOperation.right.accept(this);

        this.codeBuilder.pop(r.T0);
        this.codeBuilder.pop(r.T1);

        switch(binaryOperation.operator){
            case '+':
                this.codeBuilder.add(r.T0, r.T0, r.T1);
                this.codeBuilder.push(r.T0);
                break;
            case '-':
                this.codeBuilder.sub(r.T0, r.T1, r.T0);
                this.codeBuilder.push(r.T0);
                break;
            case '*':
                this.codeBuilder.mul(r.T0, r.T0, r.T1);
                this.codeBuilder.push(r.T0);
                break;
            case '/':
                this.codeBuilder.div(r.T0, r.T1, r.T0);
                this.codeBuilder.push(r.T0);
                break;
            case '%':
                this.codeBuilder.rem(r.T0, r.T1, r.T0);
                this.codeBuilder.push(r.T0);
                break;
        }
        this.codeBuilder.pushObject({ type: 'INT', length: 4 });
    }

    visitUnaryOperation(unaryOperation){
        unaryOperation.expr.accept(this);

        this.codeBuilder.pop(r.T0);

        switch(unaryOperation.operator){
            case '+':
                this.codeBuilder.push(r.T0);
                break;
            case '-':
                this.codeBuilder.li(r.T1, 0);
                this.codeBuilder.sub(r.T0, r.T1, r.T0);
                this.codeBuilder.push(r.T0);
                this.codeBuilder.pushObject({ type: 'INT', length: 4 });
                break;
        }
    }

    visitAgrupation(agrupation){
        agrupation.expr.accept(this);
    }

    visitPrint(print){
        for (const expr of print.exprs) {
            this.codeBuilder.comment("Print");
            expr.accept(this);
            const object = this.codeBuilder.popObject(r.A0);
            const tipoPrint = {
                'INT': () => this.codeBuilder.printInt(),
                'STRING': () => this.codeBuilder.printString()
            }
            console.log(object);
            tipoPrint[object.type]();
        }
    }
};