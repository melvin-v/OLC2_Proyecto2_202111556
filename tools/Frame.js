export class FrameVisitor {

    constructor(baseOffset) {
        this.frame = [];
        this.localSize = 0;
        this.baseOffset = baseOffset;
    }

    visitExpression(node) { }
    visitBinaryOperation(node) { }
    visitUnaryOperation(node) { }
    visitAgrupation(node) { }
    visitPrimitive(node) { }

    visitDeclaration(node) {
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize,
        });
        this.localSize += 1;
    }

    visitReferenceVariable(node) { }
    visitPrint(node) { }
    visitExpressionStmt(node) { }
    visitAssignment(node) { }

    visitBlock(node) {
        node.dcls.forEach(dcl => dcl.accept(this));
    }

    visitIf(node) {
        node.stmtTrue.accept(this);
        if (node.stmtFalse) node.stmtFalse.accept(this);
    }
    visitWhile(node) {
        node.stmt.accept(this);
    }

    visitFor(node) {
        node.stmt.accept(this);
    }

    visitBreak(node) { }
    visitContinue(node) { }
    visitReturn(node) { }
    visitLlamada(node) { }
    visitFuncDcl(node) { }
    visitParam(node) { }
    visitClassDcl(node) { }
    visitInstancia(node) { }
    visitGet(node) { }
    visitSet(node) { }

}