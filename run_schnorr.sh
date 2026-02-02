#!/bin/bash

echo "🔐 Protocolo Schnorr ZKP - Demostración completa"
echo "================================================"
echo ""

# 1. Generar inputs del prover
echo "📝 Paso 1: Prover genera compromiso y respuesta..."
node scripts/prover.js
echo ""

# 2. Compilar circuito
echo "⚙️  Paso 2: Compilando circuito Schnorr..."
./circom/target/release/circom circuits/schnorr.circom --r1cs --wasm --sym -o outputs
echo "✅ Circuito compilado"
echo ""

# 3. Generar witness
echo "🔢 Paso 3: Generando witness..."
node outputs/schnorr_js/generate_witness.js outputs/schnorr_js/schnorr.wasm inputs/schnorr_input.json outputs/witness.wtns
echo "✅ Witness generado"
echo ""

# 4. Setup (si no existe la key)
if [ ! -f "outputs/schnorr_final.zkey" ]; then
    echo "🔑 Paso 4: Ejecutando setup de Groth16..."
    snarkjs groth16 setup outputs/schnorr.r1cs outputs/pot10.ptau outputs/schnorr_0000.zkey
    snarkjs zkey contribute outputs/schnorr_0000.zkey outputs/schnorr_final.zkey --name="First contribution" -v -e="random entropy"
    snarkjs zkey export verificationkey outputs/schnorr_final.zkey outputs/verification_key.json
    echo "✅ Setup completado"
    echo ""
fi

# 5. Generar prueba
echo "🔐 Paso 5: Generando prueba ZKP..."
snarkjs groth16 prove outputs/schnorr_final.zkey outputs/witness.wtns outputs/proof.json outputs/public.json
echo "✅ Prueba generada"
echo ""

# 6. Verificar
echo "✔️  Paso 6: Verificando prueba..."
node scripts/verifier.js
echo ""

echo "🎉 Demostración completa!"
