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

    visitNumber(number){
        this.codeBuilder.li(r.T0, number.value);
        this.codeBuilder.push(r.T0);
    }

    visitBinaryOperation(binaryOperation){
        binaryOperation.left.accept(this);
        binaryOperation.right.accept(this);

        this.codeBuilder.pop(r.T1);
        this.codeBuilder.pop(r.T0);

        switch(binaryOperation.operator){
            case '+':
                this.codeBuilder.add(r.T0, r.T0, r.T1);
                this.codeBuilder.push(r.T0);
                break;
            case '-':
                this.codeBuilder.sub(r.T0, r.T0, r.T1);
                this.codeBuilder.push(r.T0);
                break;
            case '*':
                this.codeBuilder.mul(r.T0, r.T0, r.T1);
                this.codeBuilder.push(r.T0);
                break;
            case '/':
                this.codeBuilder.div(r.T0, r.T1, r.T2);
                this.codeBuilder.push(r.T0);
                break;
        }
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
                break;
        }
    }

    visitAgrupation(agrupation){
        agrupation.expr.accept(this);
    }

    visitPrint(print){
        for (const expr of print.exprs) {
            expr.accept(this);
            this.codeBuilder.pop(r.A0);
            this.codeBuilder.printInt(r.A0);
        }
    }
};