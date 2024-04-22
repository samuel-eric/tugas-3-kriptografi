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
		let repeat = true;
		while (repeat) {
			if (e > 1 && isCoprime(e, this.#n_symbol)) {
				repeat = false;
			} else {
				e = Math.floor(Math.random() * 100);
			}
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
		if (!this.e) this.#generateE();
		return { e: this.e, n: this.n };
	}

	getPrivateKey() {
		if (!this.d) this.#generateD();
		return { d: this.d, n: this.n };
	}

	#bytesToBase64(bytes) {
		const binString = Array.from(bytes, (byte) =>
			String.fromCodePoint(byte)
		).join('');
		return btoa(binString);
	}

	#base64ToBytes(base64) {
		const binString = atob(base64);
		return Uint8Array.from(binString, (m) => m.codePointAt(0));
	}

	doEncryption(plaintext) {
		let input = plaintext.split('').map((char) => BigInt(char.charCodeAt(0)));
		const cipherArr = input.map((char) => char ** this.e % this.n);
		const ciphertext = String.fromCharCode(
			...cipherArr.map((cipher) => Number(cipher))
		);
		return this.#bytesToBase64(new TextEncoder().encode(ciphertext));
	}

	doDecryption(ciphertext) {
		let input = new TextDecoder().decode(this.#base64ToBytes(ciphertext));
		input = input.split('').map((char) => BigInt(char.charCodeAt(0)));
		const plainArr = input.map((char) => char ** this.d % this.n);
		const plaintext = String.fromCharCode(
			...plainArr.map((plain) => Number(plain))
		);
		return plaintext;
	}
}

export default RSA;
