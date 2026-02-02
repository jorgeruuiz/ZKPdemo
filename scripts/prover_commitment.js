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

// Leer parámetros
const { p, g, x } = JSON.parse(fs.readFileSync('inputs/params.json', 'utf8'));
const y = modPow(g, x, p);

// Guardar parámetros públicos
fs.writeFileSync('inputs/public_params.json', JSON.stringify({ g, p, y }, null, 2));

// PASO 1: Prover commitment
const r = Math.floor(Math.random() * (p - 2)) + 1;
const t = modPow(g, r, p);

fs.writeFileSync('inputs/prover_state.json', JSON.stringify({ x, r, t, y }, null, 2));
fs.writeFileSync('inputs/commitment.json', JSON.stringify({ t }, null, 2));

console.log('PASO 1: Prover Commitment');
console.log(`  t = g^r mod p = ${t}`);
