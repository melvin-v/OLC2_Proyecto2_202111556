export class FrameVisitor {

    constructor(baseOffset) {
        this.frame = [];
        this.localSize = 0;
        this.baseOffset = baseOffset;
    }

    visitExpresion(node) { }
    visitOperacionBinaria(node) { }
    visitOperacionUnaria(node) { }
    visitAgrupacion(node) { }
    visitPrimitivo(node) { }

    visitDeclaracionVariable(node) {
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize,
        });
        this.localSize += 1;
    }

    visitReferenciaVariable(node) { }
    visitPrint(node) { }
    visitExpresionStmt(node) { }
    visitAsignacion(node) { }

    visitBloque(node) {
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