pragma circom 2.0.0;

// Protocolo Schnorr ZKP: Prueba de conocimiento de logaritmo discreto
// Verifica la relación algebraica: s = r + c*x
// El verifier verificará externamente: g^s == t * y^c (mod p)

template Schnorr() {
    // Input privado (conocido solo por prover)
    signal input x;      // Clave privada (secreto)
    signal input r;      // Nonce aleatorio
    
    // Inputs públicos
    signal input c;      // Challenge del verifier
    
    // Salida pública
    signal output s;     // Respuesta: s = r + c*x
    
    // Calcular s = r + c*x
    // Esta es la única operación que el circuito necesita verificar
    s <== r + c * x;
}

component main {public [c]} = Schnorr();
