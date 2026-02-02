#!/usr/bin/env node
const fs = require('fs');

function modPow(b, e, m) {
    let r = 1;
    b = b % m;
    while (e > 0) {
        if (e % 2 === 1) r = (r * b) % m;
        e = Math.floor(e / 2);
        b = (b * b) % m;
    }
    return r;
}

// Leer datos
const { x, r, t, y } = JSON.parse(fs.readFileSync('inputs/prover_state.json', 'utf8'));
const { c } = JSON.parse(fs.readFileSync('inputs/challenge.json', 'utf8'));
const { g, p } = JSON.parse(fs.readFileSync('inputs/public_params.json', 'utf8'));

// PASO 3: Prover response
const s = r + c * x;
const gs = modPow(g, s, p);
const yc = modPow(y, c, p);
const tyc = (t * yc) % p;

// Guardar respuesta y entrada del circuito
fs.writeFileSync('inputs/response.json', JSON.stringify({ s }, null, 2));
fs.writeFileSync('inputs/circuit_input.json', JSON.stringify({ g, p, y, t, c, s, gs, tyc }, null, 2));

console.log('PASO 3: Prover Response');
console.log(`  s = r + c*x = ${s}`);

