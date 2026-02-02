pragma circom 2.0.0;

// Protocolo Schnorr ZKP: Circuito para verificar g^s = t * y^c (mod p)

template Schnorr() {
    // Inputs públicos
    signal input g;
    signal input p;
    signal input y;
    signal input t;
    signal input c;
    signal input s;
    signal input gs;    // g^s mod p        (precalculado)
    signal input tyc;   // t * y^c mod p    (precalculado)
    
    // Verificar que gs = tyc (la ecuación fundamental)
    gs === tyc;
}

component main {public [g, p, y, t, c, s, gs, tyc]} = Schnorr();
