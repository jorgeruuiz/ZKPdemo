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

// Leer datos del protocolo
const { g, p, y } = JSON.parse(fs.readFileSync('inputs/public_params.json', 'utf8'));
const { t } = JSON.parse(fs.readFileSync('inputs/commitment.json', 'utf8'));
const { c } = JSON.parse(fs.readFileSync('inputs/challenge.json', 'utf8'));
const { s } = JSON.parse(fs.readFileSync('inputs/response.json', 'utf8'));

// PASO 4: Verifier verification
const gs = modPow(g, s, p);
const yc = modPow(y, c, p);
const tyc = (t * yc) % p;

const valid = gs === tyc;

console.log('PASO 4: Verifier Verification');
console.log(`  g^s mod p = ${gs}`);
console.log(`  t * y^c mod p = ${tyc}`);
console.log(`  ${valid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
