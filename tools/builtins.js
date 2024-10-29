import { registers as r, floatRegisters as f } from "./registers.js"

export const concatString = (code) => {

    code.comment('Guardando en el stack la dirección en heap de la cadena concatenada')
    code.push(r.HP);

    code.comment('Copiando la 1er cadena en el heap')
    const end1 = code.getLabel()
    const loop1 = code.addLabel()

    code.lb(r.T1, r.A0)
    code.beq(r.T1, r.ZERO, end1)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A0, r.A0, 1)
    code.j(loop1)
    code.addLabel(end1)

    code.comment('Copiando la 2da cadena en el heap')
    const end2 = code.getLabel()
    const loop2 = code.addLabel()

    code.lb(r.T1, r.A1)
    code.beq(r.T1, r.ZERO, end2)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A1, r.A1, 1)
    code.j(loop2)
    code.addLabel(end2)

    code.comment('Agregando el caracter nulo al final')
    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)
}


export const lessOrEqual = (code) => {

    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.bge(r.T0, r.T1, trueLabel) 
    code.li(r.T0, 0)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 1)
    code.push(r.T0)
    code.addLabel(endLabel)
}

export const greaterOrEqual = (code) => {
    
        const trueLabel = code.getLabel()
        const endLabel = code.getLabel()
    
        code.ble(r.T0, r.T1, trueLabel) 
        code.li(r.T0, 0)
        code.push(r.T0)
        code.j(endLabel)
        code.addLabel(trueLabel)
        code.li(r.T0, 1)
        code.push(r.T0)
        code.addLabel(endLabel)
    }

export const greater = (code) => {
        
            const trueLabel = code.getLabel()
            const endLabel = code.getLabel()
        
            code.blt(r.T0, r.T1, trueLabel) 
            code.li(r.T0, 0)
            code.push(r.T0)
            code.j(endLabel)
            code.addLabel(trueLabel)
            code.li(r.T0, 1)
            code.push(r.T0)
            code.addLabel(endLabel)
        }
export const less = (code) => {
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.bge(r.T0, r.T1, trueLabel)
    code.li(r.T0, 0)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 1)
    code.push(r.T0)
    code.addLabel(endLabel)
}

export const notEqual = (code) => {
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.beq(r.T0, r.T1, trueLabel) 
    code.li(r.T0, 0)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 1)
    code.push(r.T0)
    code.addLabel(endLabel)
}

export const equal = (code) => {
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.beq(r.T0, r.T1, trueLabel) 
    code.li(r.T0, 0)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 1)
    code.push(r.T0)
    code.addLabel(endLabel)

}

export const parseInt = (code) => {

    code.comment('Buscando el inicio de la parte entera')
    code.add(r.T1, r.A0, r.ZERO)
    code.li(r.T2, 46)

    const end = code.getLabel()
    const loop = code.addLabel()

    code.lb(r.T0, r.T1)
    code.beq(r.T0, r.ZERO, end) 
    code.beq(r.T0, r.T2, end) 
    code.addi(r.T1, r.T1, 1)
    code.j(loop)
    code.addLabel(end)

    code.addi(r.T1, r.T1, -1) 
    code.li(r.T0, 0) 
    code.li(r.T2, 1) 

    const convert = code.getLabel()
    const endConvert = code.getLabel()
    const error = code.getLabel()

    code.li(r.T4, 9) 
    code.li(r.T5, 10) 

    code.comment('Convirtiendo la parte entera')
    code.addLabel(convert)
    code.blt(r.T1, r.A0, endConvert) 
    code.lb(r.T3, r.T1)
    code.addi(r.T3, r.T3, -48) 

    code.blt(r.T3, r.ZERO, error) 
    code.blt(r.T4, r.T3, error) 

    code.mul(r.T3, r.T3, r.T5) 
    code.add(r.T0, r.T0, r.T3) 
    code.mul(r.T2, r.T2, r.T5) 
    code.addi(r.T1, r.T1, -1)
    code.j(convert)

    const endBuiltin = code.getLabel()

    code.addLabel(endConvert)
    code.push(r.T0)
    code.j(endBuiltin)

    code.addLabel(error)
    code.li(r.T0, 0)  
    code.push(r.T0)
    code.printStringLiteral("ERROR: No se pudo convertir a entero")

    code.addLabel(endBuiltin)
}


export const parseFloat = (code) => {

    code.push(r.A0)
    parseInt(code)
    code.pop(r.T0)
    code.pop(r.A0) 

    code.comment('Buscando el inicio de la parte decimal')

    code.add(r.T1, r.A0, r.ZERO)
    code.lb(r.T2, r.T1) 
    code.li(r.T3, 46) 

    const initFindLabel = code.getLabel()
    const endFindLabel = code.getLabel()

    code.addLabel(initFindLabel)
    code.beq(r.T2, r.ZERO, endFindLabel) 
    code.beq(r.T2, r.T3, endFindLabel) 
    code.addi(r.T1, r.T1, 1)
    code.lb(r.T2, r.T1)
    code.j(initFindLabel)
    code.addLabel(endFindLabel)

    code.addi(r.T1, r.T1, 1) 
    code.add(r.A0, r.T1, r.ZERO)

    code.push(r.T0) 
    code.push(r.T1) 
    parseInt(code)
    code.pop(r.T2) 
    code.pop(r.T1) 
    code.pop(r.T0) 


    code.comment('Buscando el final de la cadena')
    code.add(r.T3, r.A0, r.ZERO)

    const findEndOfString = code.getLabel()
    const endFindEndOfString = code.getLabel()

    code.lb(r.T4, r.T3)
    code.addLabel(findEndOfString)
    code.beq(r.T4, r.ZERO, endFindEndOfString) 
    code.addi(r.T3, r.T3, 1)
    code.lb(r.T4, r.T3)
    code.j(findEndOfString)
    code.addLabel(endFindEndOfString)


    code.comment('Calculando la parte decimal')
    code.sub(r.T4, r.T3, r.T1) 
    code.li(r.A0, 1)
    code.li(r.A1, 0)
    code.li(r.A2, 10)

    const encontrarDivisorInicio = code.getLabel()
    const encontrarDivisorFin = code.getLabel()

    code.addLabel(encontrarDivisorInicio)
    code.bge(r.A1, r.T4, encontrarDivisorFin) 
    code.mul(r.A0, r.A0, r.A2)
    code.addi(r.A1, r.A1, 1)
    code.j(encontrarDivisorInicio)
    code.addLabel(encontrarDivisorFin)

    code.fcvtsw(f.FA1, r.T2) 
    code.fcvtsw(f.FA2, r.A0) 
    code.fdiv(f.FA1, f.FA1, f.FA2) 

    code.fcvtsw(f.FA0, r.T0) 

    code.fadd(f.FA0, f.FA0, f.FA1) 

    code.pushFloat(f.FA0)


}

export const builtins = {
    concatString,
    lessOrEqual,
    equal,
    parseInt,
    parseFloat,
    greaterOrEqual,
    greater,
    less,
    notEqual
}