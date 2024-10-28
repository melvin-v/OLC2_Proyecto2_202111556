{{
  import Agrupation from '../nodes/Agrupation.js';
  import BinaryOperation from '../nodes/BinaryOperation.js';
  import Print from '../nodes/Print.js';
  import UnaryOperation from '../nodes/UnaryOperation.js';
  import ExpressionStmt from '../nodes/ExpressionStmt.js';
  import Primitive from '../nodes/Primitive.js';
  import Declaration from '../nodes/Declaration.js';
  import Assignment from '../nodes/Assignment.js';
  import ReferenceVariable from '../nodes/ReferenceVariable.js';
  import Block from '../nodes/Block.js';
  import If from '../nodes/If.js';
  import While from '../nodes/While.js';
  import For from '../nodes/For.js';
  import Break from '../nodes/Break.js';
  import Continue from '../nodes/Continue.js';
  import Return from '../nodes/Return.js';
  import FuncDcl from '../nodes/FuncDcl.js';
  import Param from '../nodes/Param.js';
  import Call from '../nodes/Call.js';
  import { types as t } from '../tools/types.js';
}}

programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = 
            dcl:ClassDcl _ { return dcl }
            / dcl:VarDcl _ { return dcl }
            / dcl:FuncDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, location()) }

FuncDcl = "function" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ tipo:(":" _ tipo:Identificador { return tipo })? _ bloque:Bloque { return new FuncDcl(id, params || [], bloque, tipo, location()) }

ClassDcl = "class" _ id:Identificador _ "{" _ dcls:ClassBody* _ "}" 

ClassBody = dcl:VarDcl _ { return dcl }
          / dcl:FuncDcl _ { return dcl }

Parametros = id:Param _ params:("," _ ids:Param { return ids })* { return [id, ...params] }

Param = id:Identificador _ ":" _ tipo:Identificador { return new Param(id, tipo, location()) }

Stmt = "System.out.println" _ "(" _ exp:VariasExpresiones _ ")" _ ";" { return new Print(exp, location()) }
    / Bloque:Bloque { return Bloque }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return new If(cond, stmtTrue, stmtFalse, location()) }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return new While(cond, stmt, location()) }
    / "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Stmt {
      return new For(init, cond, inc, stmt, location())
    }
    / "break" _ ";" { return new Break(location()) }
    / "continue" _ ";" { return new Continue(location()) }
    / "return" _ exp:Expresion? _ ";" { return new Return(exp, location()) }
    / exp:Expresion _ ";" { return new ExpressionStmt(exp, location()) }

VariasExpresiones
  = head:Expresion tail:(_ "," _ Expresion)* {
      return [head, ...tail.map(([_, __,___, exp]) => exp)];
  }

Bloque = "{" _ dcls:Declaracion* _ "}" { return new Block(dcls, location()) }

ForInit = dcl:VarDcl { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Asignacion

Asignacion = asignado:Llamada _ "=" _ asgn:Asignacion { return new Assignment(asignado, asgn, location())}
/ Logica


Logica = izq:Comparacion expansion:(
  _ op:("&&" / "||") _ der:Comparacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
       return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  )
}


Comparacion = izq:Suma expansion:(
  _ op:("<=" / "==") _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
       return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  )
}


Suma = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
       return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  )
}

Multiplicacion = izq:Unaria expansion:(
  _ op:("*" / "/" / "%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return new BinaryOperation(operacionAnterior, der, tipo, location());
      },
      izq
    )
}

Unaria = "-" _ num:Unaria { return new UnaryOperation(num, '-', location()) }
        / "!" _ num:Unaria { return new UnaryOperation(num, '!', location()) }
/ Llamada

Llamada = objetivoInicial:Dato operaciones:(
    ("(" _ args:Argumentos? _ ")" { return {args, tipo: 'funcCall' } })
    / ("." _ id:Identificador _ { return { id, tipo: 'get' } })
  )* 
  {
  const op =  operaciones.reduce(
    (objetivo, args) => {
      const { tipo, id, args:argumentos } = args

      if (tipo === 'funcCall') {
        return new Call(objetivo, argumentos || [], location()) 
      }
    },
    objetivoInicial
  )

return op
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }


Dato = 
  [0-9]+ "." [0-9]+ {return new Primitive(parseFloat(text(), 10), 'float', location()) }
  / [0-9]+ {return new Primitive(parseInt(text(), 10), 'int', location()) }
  / "\"" texto:([^\"])* "\"" { return new Primitive(texto.join(''), 'string', location()) }
  / "true" { return new Primitive(true, 'boolean', location()) }
  / "false" { return new Primitive(false, 'boolean', location()) }
  / "(" _ exp:Expresion _ ")" { return new Agrupation(exp, location()) }
  / id:Identificador { return new ReferenceVariable(id, location()) }


_ = ([ \t\n\r] / Comentarios)* 


Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"