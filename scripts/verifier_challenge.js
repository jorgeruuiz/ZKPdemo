#!/usr/bin/env node
const fs = require('fs');

// Leer parámetros públicos
const { g, p, y } = JSON.parse(fs.readFileSync('inputs/public_params.json', 'utf8'));
const { t } = JSON.parse(fs.readFileSync('inputs/commitment.json', 'utf8'));

// PASO 2: Verifier challenge
const c = Math.floor(Math.random() * (p - 1)) + 1;

fs.writeFileSync('inputs/challenge.json', JSON.stringify({ c }, null, 2));

console.log('PASO 2: Verifier Challenge');
console.log(`  c = ${c}`);
