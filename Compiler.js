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
        this.codeBuilder.pushContent({ type: node.type, value: node.value });
        this.codeBuilder.comment(`Fin Primitivo: ${node.value}`);
    }

    visitBinaryOperation(node){
        this.codeBuilder.comment(`Operacion: ${node.op}`);

        if (node.op === '&&') {
            node.left.accept(this); // left
            this.codeBuilder.popObject(r.T0); // left

            const labelFalse = this.codeBuilder.getLabel();
            const labelEnd = this.codeBuilder.getLabel();

            this.codeBuilder.beq(r.T0, r.ZERO, labelFalse); // if (!left) goto labelFalse
            node.right.accept(this); // right
            this.codeBuilder.popObject(r.T0); // right
            this.codeBuilder.beq(r.T0, r.ZERO, labelFalse); // if (!right) goto labelFalse

            this.codeBuilder.li(r.T0, 1);
            this.codeBuilder.push(r.T0);
            this.codeBuilder.j(labelEnd);
            this.codeBuilder.addLabel(labelFalse);
            this.codeBuilder.li(r.T0, 0);
            this.codeBuilder.push(r.T0);

            this.codeBuilder.addLabel(labelEnd);
            this.codeBuilder.pushObject({ type: 'boolean', length: 4 });
            return
        }

        if (node.op === '||') {
            node.left.accept(this); // left
            this.codeBuilder.popObject(r.T0); // left

            const labelTrue = this.codeBuilder.getLabel();
            const labelEnd = this.codeBuilder.getLabel();

            this.codeBuilder.bne(r.T0, r.ZERO, labelTrue); // if (left) goto labelTrue
            node.right.accept(this); // right
            this.codeBuilder.popObject(r.T0); // right
            this.codeBuilder.bne(r.T0, r.ZERO, labelTrue); // if (right) goto labelTrue

            this.codeBuilder.li(r.T0, 0);
            this.codeBuilder.push(r.T0);

            this.codeBuilder.j(labelEnd);
            this.codeBuilder.addLabel(labelTrue);
            this.codeBuilder.li(r.T0, 1);
            this.codeBuilder.push(r.T0);

            this.codeBuilder.addLabel(labelEnd);
            this.codeBuilder.pushObject({ type: 'boolean', length: 4 });
            return
        }

        node.left.accept(this); // left |
        node.right.accept(this); // left | right

        const right = this.codeBuilder.popObject(r.T0); // right
        const left = this.codeBuilder.popObject(r.T1); // left

        if (left.type === 'STRING' && right.type === 'STRING') {
            this.codeBuilder.add(r.A0, r.ZERO, r.T1);
            this.codeBuilder.add(r.A1, r.ZERO, r.T0);
            this.codeBuilder.callBuiltin('concatString');
            this.codeBuilder.pushObject({ type: 'STRING', length: 4 });
            return;
        }

        switch (node.op) {
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

    visitDeclaration(node) {
        console.log('Declaracion', node);
        node.expr.accept(this);
        this.codeBuilder.tagObject(node.id);
    }

    visitAssignment(node) {
        node.expr.accept(this);
        const valueObject = this.codeBuilder.popObject(r.T0);
        console.log(node)
        const [offset, variableObject] = this.codeBuilder.getObject(node.id);

        this.codeBuilder.addi(r.T1, r.SP, offset);
        this.codeBuilder.sw(r.T0, r.T1);

        variableObject.type = valueObject.type;

        this.codeBuilder.push(r.T0);
        this.codeBuilder.pushObject(valueObject);
    }

    visitReferenceVariable(node) {
        this.codeBuilder.comment(`Referencia a variable ${node.id}: ${JSON.stringify(this.codeBuilder.objectStack)}`);


        const [offset, variableObject] = this.codeBuilder.getObject(node.id);
        this.codeBuilder.addi(r.T0, r.SP, offset);
        this.codeBuilder.lw(r.T1, r.T0);
        this.codeBuilder.push(r.T1);
        this.codeBuilder.pushObject({ ...variableObject, id: undefined });

        // this.code.comment(`Fin Referencia Variable: ${node.id}`);
        this.codeBuilder.comment(`Fin referencia de variable ${node.id}: ${JSON.stringify(this.codeBuilder.objectStack)}`);
    }

    visitBlock(node) {
        this.codeBuilder.comment('Inicio de bloque');

        this.codeBuilder.newScope();

        node.statements.forEach(d => d.accept(this));

        this.codeBuilder.comment('Reduciendo la pila');
        const bytesToRemove = this.codeBuilder.endScope();

        if (bytesToRemove > 0) {
            this.codeBuilder.addi(r.SP, r.SP, bytesToRemove);
        }

        this.codeBuilder.comment('Fin de bloque');
    }


};