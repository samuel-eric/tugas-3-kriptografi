import { isCoprime, isPrime } from '@sigma-js/primes';

class RSA {
	#n_symbol;

	constructor(p, q) {
		this.p = p;
		this.q = q;
		this.n = BigInt(p * q);
		this.#n_symbol = (p - 1) * (q - 1);
	}

	static generatePAndQ() {
		let p = Math.floor(Math.random() * 100);
		while (p < 10 || !isPrime(p)) {
			p = Math.floor(Math.random() * 100);
		}
		let q = Math.floor(Math.random() * 100);
		while (q < 10 || !isPrime(q) || q === p) {
			q = Math.floor(Math.random() * 100);
		}
		return { p, q };
	}

	#generateE() {
		let e = Math.floor(Math.random() * 100);
		while (!isCoprime(e, this.#n_symbol) || e === 1) {
			e = Math.floor(Math.random() * 100);
		}
		this.e = BigInt(e);
	}

	#generateD() {
		let k = 1;
		let d = (1 + k * this.#n_symbol) / Number(this.e);
		while (!Number.isInteger(d)) {
			k++;
			d = (1 + k * this.#n_symbol) / Number(this.e);
		}
		this.d = BigInt(d);
	}

	getPublicKey() {
		this.#generateE();
		return { e: this.e, n: this.n };
	}

	getPrivateKey() {
		this.#generateD();
		return { d: this.d, n: this.n };
	}

	doEncryption(plaintext) {
		let input = plaintext.split('').map((char) => BigInt(char.charCodeAt(0)));
		console.log('plaintext: ', input);
		const cipherArr = input.map((char) => char ** this.e % this.n);
		console.log('cipherArr: ', cipherArr);
		return String.fromCharCode(...cipherArr.map((cipher) => Number(cipher)));
	}

	doDecryption(ciphertext) {
		let input = ciphertext.split('').map((char) => BigInt(char.charCodeAt(0)));
		console.log('input ciphertext: ', input);
		const plainArr = input.map((char) => char ** this.d % this.n);
		console.log('plain array hasil decryption: ', plainArr);
		console.log(String.fromCharCode(...plainArr.map((plain) => Number(plain))));
		return String.fromCharCode(...plainArr.map((plain) => Number(plain)));
	}
}

export default RSA;
