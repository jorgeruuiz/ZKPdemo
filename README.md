# Schnorr ZKP Demo

Implementación del protocolo Schnorr de Zero-Knowledge Proof para demostrar conocimiento del logaritmo discreto.

## 📋 Protocolo (4 pasos)

1. **Prover Commitment**: Prover genera `t = g^r mod p` (compromiso)
2. **Verifier Challenge**: Verifier envía desafío aleatorio `c`
3. **Prover Response**: Prover responde con `s = r + c*x`
4. **Verification**: Verifier verifica que `g^s ≡ t*y^c (mod p)`

## 🏃 Ejecución

```bash
./run.sh
```

El script automáticamente:
- Ejecuta los 4 pasos del protocolo
- Genera y verifica la prueba ZKP con Groth16
- Muestra el resultado final

## 📁 Estructura

- **inputs/**: Datos del protocolo (parámetros, commitment, challenge, respuesta)
- **outputs/**: Artefactos compilados (circuito, witness, prueba)
- **scripts/**: Implementación de los 4 pasos del protocolo
- **circuits/**: Circuito Circom que verifica `g^s = t*y^c mod p`

## 🔧 Requisitos

- Node.js v22+
- Rust (para compilar Circom)
- circom 2.0.0
- snarkjs
