#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

// Parámetros del protocolo Schnorr
const p = 23; // Módulo primo pequeño (para demo)
const g = 5;  // Generador

// Secret del Prover (logaritmo discreto)
const x = 6;  // Secreto: x

// Calcular clave pública: y = g^x mod p
const y = modPow(g, x, p);

console.log('=== PROVER: Inicialización ===');
console.log(`Parámetros públicos: g=${g}, p=${p}`);
console.log(`Clave privada (secreto): x=${x}`);
console.log(`Clave pública: y=g^x mod p = ${g}^${x} mod ${p} = ${y}`);

// Paso 1: Prover genera compromiso
const r = Math.floor(Math.random() * (p - 2)) + 1; // Aleatorio r
const t = modPow(g, r, p); // t = g^r mod p

console.log('\n=== PROVER: Paso 1 - Compromiso ===');
console.log(`Nonce aleatorio: r=${r}`);
console.log(`Compromiso: t=g^r mod p = ${g}^${r} mod ${p} = ${t}`);

// Simulamos que el verifier envía un challenge
const c = Math.floor(Math.random() * (p - 1)) + 1;
console.log('\n=== VERIFIER: Challenge ===');
console.log(`Challenge aleatorio: c=${c}`);

// Paso 2: Prover calcula respuesta
const s = r + c * x; // s = r + c*x (sin módulo aquí)

console.log('\n=== PROVER: Paso 2 - Respuesta ===');
console.log(`Respuesta: s = r + c*x = ${r} + ${c}*${x} = ${s}`);

// Guardar input para el circuito
const input = {
    x: x,
    r: r,
    c: c
};

// Guardar también los parámetros públicos para el verifier
const publicParams = {
    g: g,
    p: p,
    y: y,
    t: t,
    c: c,
    s: s
};

fs.writeFileSync('inputs/schnorr_input.json', JSON.stringify(input, null, 2));
fs.writeFileSync('inputs/public_params.json', JSON.stringify(publicParams, null, 2));
console.log('\n✅ Input guardado en inputs/schnorr_input.json');
console.log('✅ Parámetros públicos guardados en inputs/public_params.json');

// El verifier verificará: g^s == t * y^c mod p
const gs = modPow(g, s, p);
const tyc = (t * modPow(y, c, p)) % p;

console.log('\n=== Verificación (preview) ===');
console.log(`g^s mod p = ${g}^${s} mod ${p} = ${gs}`);
console.log(`t * y^c mod p = ${t} * ${y}^${c} mod ${p} = ${tyc}`);
console.log(`¿Válido? ${gs === tyc ? '✅ SÍ' : '❌ NO'}`);

// Función auxiliar para exponenciación modular
function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}
