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
  import { types as t } from '../tools/types.js';
}}

programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = 
            dcl:ClassDcl _ { return dcl }
            / dcl:VarDcl _ { return dcl }
            / dcl:FuncDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return new Declaration(null, id, exp, location()) }

FuncDcl = "function" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('dclFunc', { id, params: params || [], bloque }) }

ClassDcl = "class" _ id:Identificador _ "{" _ dcls:ClassBody* _ "}" { return crearNodo('dclClase', { id, dcls }) }

ClassBody = dcl:VarDcl _ { return dcl }
          / dcl:FuncDcl _ { return dcl }

Parametros = id:Identificador _ params:("," _ ids:Identificador { return ids })* { return [id, ...params] }

Stmt = "System.out.println" _ "(" _ exp:VariasExpresiones _ ")" _ ";" { return new Print(exp, location()) }
    / Bloque:Bloque { return Bloque }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }
    / "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Stmt {
      return crearNodo('for', { init, cond, inc, stmt })
    }
    / "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }
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

Asignacion = asignado:Identificador _ "=" _ asgn:Asignacion 
  { 
    return new Assignment(asignado, asgn, location());
  }
/ AndOr


AndOr = izq:Comparacion expansion:(
  _ op:("&&" / "||") _ der:Comparacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, tipo, der, location());
    },
    izq
  );
}

Comparacion = izq:MayorMenor expansion:(
  _ op:("<=" / ">=") _ der:MayorMenor { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, tipo, der, location());
    },
    izq
  );
}

MayorMenor = izq:IgualQue expansion:(
  _ op:("<" / ">") _ der:IgualQue { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, tipo, der, location());
    },
    izq
  );
}

IgualQue = izq:Suma expansion:(
  _ op:("==" / "!=") _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, tipo, der, location());
    },
    izq
  );
}

Suma = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, tipo, der, location());
    },
    izq
  );
}

Multiplicacion = izq:Modulo expansion:(
  _ op:("*" / "/") _ der:Modulo { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual;
        return new BinaryOperation(operacionAnterior, tipo, der, location());
      },
      izq
    );
}

Modulo = izq:Unaria expansion:(
  _ op:("%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual;
        return new BinaryOperation(operacionAnterior, tipo, der, location());
      },
      izq
    );
}


Unaria = "-" _ num:Numero { return new UnaryOperation(num, "-", location()) }
  / "!" _ num:Numero { return new UnaryOperation(num, "!", location()) }
  / Numero
  / Llamada

Llamada = objetivoInicial:Numero operaciones:(
    ("(" _ args:Argumentos? _ ")" { return {args, tipo: 'funcCall' } })
    / ("." _ id:Identificador _ { return { id, tipo: 'get' } })
  )* 
  {
  const op =  operaciones.reduce(
    (objetivo, args) => {
      const { tipo, id, args:argumentos } = args

      if (tipo === 'funcCall') {
        return crearNodo('llamada', { callee: objetivo, args: argumentos || [] })
      }else if (tipo === 'get') {
        return crearNodo('get', { objetivo, propiedad: id })
      }
    },
    objetivoInicial
  )

  //console.log('llamada', {op}, {text: text()});

return op
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }


Numero = [0-9]+ {return new Primitive(parseInt(text(), 10), t.INT, location())}
  / "\"" texto:([^\"])* "\"" { return new Primitive(texto.join(''), t.STRING, location()) }
  / "(" _ exp:Expresion _ ")" { return new Agrupation(exp, location()) }
  / "new" _ id:Identificador _ "(" _ args:Argumentos? _ ")" { return crearNodo('instancia', { id, args: args || [] }) }
  / id:Identificador { return new ReferenceVariable(id, location()) }


_ = ([ \t\n\r] / Comentarios)* 


Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"