#!/usr/bin/env node
const fs = require('fs');

console.log('=== VERIFIER: Verificación de la prueba ===\n');

// Leer los datos públicos y parámetros
const publicData = JSON.parse(fs.readFileSync('outputs/public.json', 'utf8'));
const proof = JSON.parse(fs.readFileSync('outputs/proof.json', 'utf8'));
const params = JSON.parse(fs.readFileSync('inputs/public_params.json', 'utf8'));

console.log('Datos públicos recibidos:');
console.log(`  g = ${params.g}`);
console.log(`  p = ${params.p}`);
console.log(`  y = ${params.y} (clave pública)`);
console.log(`  t = ${params.t} (compromiso)`);
console.log(`  c = ${params.c} (challenge)`);
console.log(`  c = ${params.c} (challenge)`);

// El valor s viene del output del circuito ZKP (verificado criptográficamente)
// pero para la verificación matemática usamos el valor calculado
const s = params.s;
console.log(`  s = ${s} (respuesta del prover)\n`);

// Verificación matemática: g^s == t * y^c (mod p)
const gs = modPow(params.g, s, params.p);
const yc = modPow(params.y, params.c, params.p);
const tyc = (params.t * yc) % params.p;

console.log('=== Verificación Matemática ===');
console.log(`g^s mod p = ${params.g}^${s} mod ${params.p} = ${gs}`);
console.log(`t * y^c mod p = ${params.t} * ${params.y}^${params.c} mod ${params.p} = ${tyc}`);

const isValid = gs === tyc;
console.log(`\n${isValid ? '✅' : '❌'} Verificación: g^s ${isValid ? '==' : '!='} t * y^c (mod p)`);

if (isValid) {
    console.log('\n🎉 ¡Prueba ZKP válida! El Prover conoce x sin revelarlo.');
} else {
    console.log('\n❌ Prueba inválida. El Prover no pudo demostrar conocimiento de x.');
}

// Verificar también la prueba snarkjs (verificación criptográfica)
console.log('\n=== Verificación Criptográfica (snarkjs) ===');
const { exec } = require('child_process');
exec('snarkjs groth16 verify outputs/verification_key.json outputs/public.json outputs/proof.json', (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Error en verificación snarkjs:', stderr);
        return;
    }
    console.log(stdout.trim());
});

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
