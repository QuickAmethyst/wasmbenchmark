require('./wasm_exec.js');

const { readFileSync } = require('fs');
const Benchmark = require("benchmark");
const cmodule = require('./c_main');

const num = 10;

const suite = new Benchmark.Suite;

function jsFactorial(num) {
    if (num === 1) return 1;
    return num * jsFactorial(num - 1);
}

async function initGoWasm() {
    const go = new Go();
    const mod = await WebAssembly.compile(readFileSync('./main.wasm'));
    const inst = await WebAssembly.instantiate(mod, go.importObject);
    go.run(inst);
}

async function initSuite() {
    await initGoWasm();

    return suite.add('go wasm factorial recursive', async function() {
        factorialRecursive(num);
    }).add('go wasm factorial iterative', async function() {
        factorialIterative(num);
    }).add('c wasm factorial', async function() {
        cmodule._factorial(num);
    }).add('js factorial', function() {
        jsFactorial(num);
    }).on('cycle', function(event) {
        console.log(String(event.target));
    }).on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    });
}

cmodule.onRuntimeInitialized = () => {
    initSuite().then((suite) => suite.run({ async: true }));
}
