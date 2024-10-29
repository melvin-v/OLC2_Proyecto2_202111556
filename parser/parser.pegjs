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
  import Case from '../nodes/Case.js';
  import Switch from '../nodes/Switch.js';
  import { types as t } from '../tools/types.js';
}}

programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = 
            dcl:ClassDcl _ { return dcl }
            / dcl:VarDcl _ { return dcl }
            / dcl:FuncDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, null, location()) }
        /  "int" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, "int", location()) }
        /  "float" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, "float", location()) }
        /  "char" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, "char", location()) }
        /  "boolean" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, "boolean", location()) }
        /  "string" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, "string", location()) }
        /  "int" _ id:Identificador _ ";" { return new Declaration(id, null, "int", location()) }
        /  "float" _ id:Identificador _ ";" { return new Declaration(id, null, "float", location()) }
        /  "char" _ id:Identificador _ ";" { return new Declaration(id, null, "char", location()) }
        /  "boolean" _ id:Identificador _ ";" { return new Declaration(id, null, "boolean", location()) }
        /  "string" _ id:Identificador _";" { return new Declaration(id, null, "string", location()) }

      FuncDcl = "void" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return new FuncDcl(id, params || [], bloque, 'void', location()) }
        / "int" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return new FuncDcl(id, params || [], bloque, 'int', location()) }
        / "float" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return new FuncDcl(id, params || [], bloque, 'float', location()) }
        / "char" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return new FuncDcl(id, params || [], bloque, 'char', location()) }
        / "boolean" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return new FuncDcl(id, params || [], bloque, 'boolean', location()) }
        / "string" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return new FuncDcl(id, params || [], bloque, 'string', location()) }

ClassDcl = "class" _ id:Identificador _ "{" _ dcls:ClassBody* _ "}" 

ClassBody = dcl:VarDcl _ { return dcl }
          / dcl:FuncDcl _ { return dcl }

Parametros = id:Param _ params:("," _ ids:Param { return ids })* { return [id, ...params] }

Param = "int" _ id:Identificador { return new Param(id, "int", location()) }
  / "float" _ id:Identificador { return new Param(id, "float", location()) }
  / "char" _ id:Identificador { return new Param(id, "char", location()) }
  / "boolean" _ id:Identificador { return new Param(id, "boolean", location()) }
  / "string" _ id:Identificador { return new Param(id, "string", location()) }

Stmt = "System.out.println" _ "(" _ exp:VariasExpresiones _ ")" _ ";" { return new Print(exp, location()) }
      / "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ cases:(_ "case" _ exp1:Expresion _ ":" _ stmt:(Stmt)* _ breakForSwitch:("break" _ ";" {return new Break(location())})* { return new Case(exp1, stmt, breakForSwitch, location()) })+
      stmt:( _ "default" _ ":" _ stmt:Stmt{return stmt})? _ "}" { return new Switch(exp, cases, stmt, location()) }
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

Asignacion = asignado:Identificador _ "=" _ asgn:Asignacion { return new Assignment(asignado, asgn, location())}
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
  _ op:("<=" / ">=" /  "<" / ">" / "==" / "!=") _ der:Suma { return { tipo: op, der } }
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
  / "'"  txt:normalChar "'" { return new Primitive(txt, 'char', location()) }
  / "true" { return new Primitive(true, 'boolean', location()) }
  / "false" { return new Primitive(false, 'boolean', location()) }
  / "(" _ exp:Expresion _ ")" { return new Agrupation(exp, location()) }
  / id:Identificador { return new ReferenceVariable(id, location()) }

normalChar = [^'] { return text() }

_ = ([ \t\n\r] / Comentarios)* 


Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"