pragma circom 2.0.0;

template SumProduct() {
    // Declaration of signals

    // Input signals
    signal input a;
    signal input b;

    // Output signals
    signal output sum;
    signal output product;

    // Constraints
    sum <== a + b;
    product <== a * b;
}

component main = SumProduct();