import Compiler from "./Compiler.js";
import {parse} from "./parser/parser.js";

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' } });
var errorReport = [];
var tabla = new Map();
require(['vs/editor/editor.main'], () => {
    const editor = monaco.editor.create(document.getElementById('container'), {
        language: 'java',
        theme: 'vs-dark'
    });

    document.getElementById('run-button').addEventListener('click', () => {
        const code = editor.getValue();
        const sentencias = parse(code);
        console.log(sentencias);
        const compiler = new Compiler();
        sentencias.forEach(sentencia => sentencia.accept(compiler));
        document.getElementById('output').innerText = compiler.codeBuilder.toString();
    });

    document.getElementById('open-file-button').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.oak';
        input.onchange = e => { 
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                editor.setValue(event.target.result);
            };
            reader.readAsText(file);
        };
        input.click();
    });

    document.getElementById('save-file-button').addEventListener('click', () => {
        const code = editor.getValue();
        const blob = new Blob([code], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'codigo.oak';
        a.click();
        window.URL.revokeObjectURL(url);
    });

    document.getElementById('error-report-button').addEventListener('click', () => {
        //Vamos a generar los errores en html, creara el html segun el array de objetos {error, line, column} y lo abrira en una nueva ventana
        let html = "<html><head><title>Reporte de errores</title></head><body><h1>Reporte de errores</h1><table border='1'><tr><th>No.</th><th>Descripcion</th><th>Linea</th><th>Columna</th><th>Tipo</th></tr>";
        var num = 1;
        errorReport.forEach(error => {
            html += "<tr><td>" + num + "</td><td>" + error.error + "</td><td>" + error.line + "</td><td>" + error.column + "</td><td>" + "semantico" + "</td></tr>";
        });
        html += "</table></body></html>";
        const report = window.open();
        report.document.write(html);
    
    });

    document.getElementById('symbol-table-button').addEventListener('click', () => {
        // Vamos a generar la tabla de simbolos en html, creara el html segun el array de objetos {id, tipo de simbolo, valor, fila, columna} y lo abrira en una nueva ventana, viene un map la key sera el id y el value es un objeto que contiene el tipo y el valor
        let html = "<html><head><title>Tabla de simbolos</title></head><body><h1>Tabla de simbolos</h1><table border='1'><tr><th>Id</th><th>Tipo</th><th>Valor</th><th>Fila</th><th>Columna</th></tr>";
        tabla.forEach((value, key) => {
            html += "<tr><td>" + key + "</td><td>" + value.type + "</td><td>" + value.value + "</td><td>" + value.linea + "</td><td>" + value.columna + "</td></tr>";
        });
        html += "</table></body></html>";
        const report = window.open();
        report.document.write(html);
    });

    document.getElementById('copy-button').addEventListener('click', () => {
        const outputText = document.getElementById('output').innerText;
        const textarea = document.createElement('textarea');
        textarea.value = outputText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    
        // Cambiar el texto del botón y agregar una clase de animación
        const copyButton = document.getElementById('copy-button');
        copyButton.innerText = '¡Copiado!';
        copyButton.classList.add('copied');
    
        // Volver al estado original después de 2 segundos
        setTimeout(() => {
            copyButton.innerText = 'Copiar al portapapeles';
            copyButton.classList.remove('copied');
        }, 2000);
    });
    
    
});