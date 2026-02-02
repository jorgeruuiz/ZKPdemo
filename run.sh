#!/bin/bash

mkdir -p inputs outputs

echo "🔐 Protokolo Schnorr ZKP"
echo ""

node scripts/prover_commitment.js
node scripts/verifier_challenge.js
node scripts/prover_response.js
node scripts/verifier_verification.js

echo ""
echo "⚙️  Compilando circuito..."
./circom/target/release/circom circuits/schnorr.circom --r1cs --wasm --sym -o outputs > /dev/null 2>&1

echo "🔢 Generando witness..."
node outputs/schnorr_js/generate_witness.js outputs/schnorr_js/schnorr.wasm inputs/circuit_input.json outputs/witness.wtns > /dev/null 2>&1

if [ ! -f "outputs/schnorr_final.zkey" ]; then
    echo "🔐 Setup Groth16..."
    snarkjs groth16 setup outputs/schnorr.r1cs pot10.ptau outputs/schnorr_0000.zkey > /dev/null 2>&1
    snarkjs zkey contribute outputs/schnorr_0000.zkey outputs/schnorr_final.zkey --name="contribution" -v -e="entropy" > /dev/null 2>&1
fi

snarkjs zkey export verificationkey outputs/schnorr_final.zkey outputs/verification_key.json > /dev/null 2>&1

echo "📦 Generando prueba ZKP..."
snarkjs groth16 prove outputs/schnorr_final.zkey outputs/witness.wtns outputs/proof.json outputs/public.json > /dev/null 2>&1

echo "✔️  Verificando prueba ZKP..."
snarkjs groth16 verify outputs/verification_key.json outputs/public.json outputs/proof.json

echo ""
echo "🎉 ¡Completo!"
