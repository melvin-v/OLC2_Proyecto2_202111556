import { registers as r } from "./registers.js";
import Instruction from "./Instruction.js";
import { stringTo32BitsArray } from "./utils.js";

export default class Generator {

    constructor() {
        this.instrucciones = [];
        this.objectStack = [];
    }

    add(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('add', rd, rs1, rs2))
    }

    sub(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('sub', rd, rs1, rs2))
    }

    mul(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('mul', rd, rs1, rs2))
    }

    div(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('div', rd, rs1, rs2))
    }

    addi(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('addi', rd, rs1, inmediato))
    }

    sw(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruction('sw', rs1, `${inmediato}(${rs2})`))
    }

    lw(rd, rs1, inmediato = 0) {
        this.instrucciones.push(new Instruction('lw', rd, `${inmediato}(${rs1})`))
    }

    li(rd, inmediato) {
        this.instrucciones.push(new Instruction('li', rd, inmediato))
    }

    rem(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('rem', rd, rs1, rs2))
    }

    push(rd = r.T0) {
        this.addi(r.SP, r.SP, -4) // 4 bytes = 32 bits
        this.sw(rd, r.SP)
    }

    pop(rd = r.T0) {
        this.lw(rd, r.SP)
        this.addi(r.SP, r.SP, 4)
    }

    ecall() {
        this.instrucciones.push(new Instruction('ecall'))
    }

    printInt(rd = r.A0) {

        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO)
        }

        this.li(r.A7, 1)
        this.ecall()

        if (rd !== r.A0) {
            this.pop(r.A0)
        }

    }

    printString(rd = r.A0) {

        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO)
        }

        this.li(r.A7, 4)
        this.ecall()

        if (rd !== r.A0) {
            this.pop(r.A0)
        }
    }

    endProgram() {
        this.li(r.A7, 10)
        this.ecall()
    }

    endProgram() {
        this.li(r.A7, 10)
        this.ecall()
    }

    comment(text) {
        this.instrucciones.push(new Instruction(`# ${text}`))
    }

    pushConstant(object) {
        let length = 0;

        switch (object.type) {
            case 'INT':
                this.li(r.T0, object.value);
                this.push()
                length = 4;
                break;

            case 'STRING':
                const stringArray = stringTo32BitsArray(object.value).reverse();

                stringArray.forEach((block32bits) => {
                    this.li(r.T0, block32bits);
                    this.push(r.T0);
                });

                length = stringArray.length * 4;
                break;

            default:
                break;
        }

        this.pushObject({ type: object.type, length });
    }

    pushObject(object) {
        this.objectStack.push(object);
    }

    popObject(rd = r.T0) {
        const object = this.objectStack.pop();


        switch (object.type) {
            case 'INT':
                this.pop(rd);
                break;

            case 'STRING':
                this.addi(rd, r.SP, 0);
                this.addi(r.SP, r.SP, object.length);
            default:
                break;
        }

        return object;
    }

    toString() {
        this.endProgram();
        return `.text
main:
    ${this.instrucciones.map(instruccion => `${instruccion}`).join('\n')}
`
    }

}