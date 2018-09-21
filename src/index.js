import {RippleAPI} from 'ripple-lib';
import * as ripple from 'ripplelib';

import * as rippleKeypairs from 'ripple-keypairs';

import * as bip39 from 'bip39';
import * as bip32 from 'ripple-bip32';



export default class RippleProvider {
    constructor(network) {
        this.url = 'https://data.ripple.com/v2/accounts/';

        if (network === 'mainnet') {
            this.api = new RippleAPI({
                server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
            });
        } else {
            this.api = new RippleAPI({
                server: 'wss://s.altnet.rippletest.net:51233' // Public rippled server hosted by Ripple, Inc.
            });
        }
        this.decimals = 10 ** 6;
    }

    generateSecret() {
        return this.api.generateAddress().secret
    }

    createPrivateKey() {
        let secret = this.api.generateAddress().secret
        let keyPair = rippleKeypairs.deriveKeypair(secret);
        return keyPair.privateKey.substring(2);

    }

    createPrivateKeyFromSecret(secret) {
        let keyPair = rippleKeypairs.deriveKeypair(secret);
        return keyPair.privateKey.substring(2);

    }

    createPublicKey(privateKey) {
        return ripple.KeyPair.from_json(privateKey).to_hex_pub();

    }

    generateMnemonic() {

        return bip39.generateMnemonic()

    }

    createPrivateKeyFromMnemonic(mnemonic) {
        const seed = bip39.mnemonicToSeed(mnemonic);
        const m = bip32.fromSeedBuffer(seed);
        const keyPair = m.derivePath("m/44'/144'/0'/0/0").keyPair.getKeyPairs();
        return keyPair.privateKey.substring(2)

    }

    getAddressFromSecret(secret) {
        let keyPair = rippleKeypairs.deriveKeypair(secret);
        return rippleKeypairs.deriveAddress(keyPair.publicKey);

    }

    getAddress(publicKey) {
        return rippleKeypairs.deriveAddress(publicKey);

    }


    getBalance(address) {
        return new Promise((resolve, reject) => {
            this.api.connect().then(() => {
                return this.api.getBalances(address).then(balances => {
                    resolve(balances)
                }).catch(err => {
                    resolve([{'value': 0}])
                })
            }).catch(err => {
                reject(err)
            });
        })


    }

    prepareCheckCreate(addressFrom, addressTo, amount) {
        return new Promise((resolve, reject) => {
            let checkCreate = {
                "destination": addressTo,
                "sendMax": {
                    "currency": "XRP",
                    "value": amount + ""
                }
            };
            this.api.connect().then(() => {
                return this.api.prepareCheckCreate(addressFrom, checkCreate).then(prepared => {
                    resolve(prepared);
                })
            }).catch(err => {
                reject(err);
            });
        });
    }

    signTX(publicKey, to, instructions, amount, privateKey) {
        const keyPair = {
            privateKey,
            publicKey
        };

        let transaction = {
            "TransactionType": "Payment",
            "Account": rippleKeypairs.deriveAddress(publicKey),
            "Fee": (instructions.fee * this.decimals) + "",
            "Destination": to,
            "Amount": (+amount * this.decimals) + "",
            "LastLedgerSequence": instructions.maxLedgerVersion,
            "Sequence": instructions.sequence
        };
        let txJSON = JSON.stringify(transaction)
        return new Promise((resolve, reject) => {
            this.api.connect().then(() => {
                resolve(this.api.sign(txJSON, keyPair))
            }).catch(err => {
                reject(err);
            });
        });
    }

    getTransaction(idTxHash) {
        return new Promise((resolve, reject) => {
            this.api.connect().then(() => {
                this.api.getTransaction(idTxHash).then(res => {
                    resolve(res);
                })
            }).catch(err => {
                reject(err);

            });
        });
    }

    sendTX(signTxHash) {
        return new Promise((resolve, reject) => {
            this.api.connect().then(() => {
                this.api.submit(signTxHash).then(res => {
                    resolve(res);
                })
            }).catch(err => {
                reject(err);

            });
        });
    }


    sendXrp(publicKey, addressTo, amount, privateKey) {
        let addressFrom = rippleKeypairs.deriveAddress(publicKey);
        let obj = {
            txId: '',
            info: ''
        };
        return new Promise((resolve, reject) => {

            this.prepareCheckCreate(addressFrom, addressTo, amount).then(prepare => {
                this.signTX(publicKey, addressTo, prepare.instructions, amount, privateKey).then(sign => {
                    obj['txId'] = sign.id;
                    this.sendTX(sign.signedTransaction).then(sendInfo => {
                        obj['info'] = sendInfo;
                        resolve(obj);

                    })
                }).catch((err) => {
                    console.log('An error has occured:');
                    reject(err);
                });
            })
        })
    }

    sendXrpUsingSecret(addressTo, amount, secret) {
        let privateKey = this.createPrivateKeyFromSecret(secret);
        let publicKey = this.createPublicKey(privateKey);
        let addressFrom = rippleKeypairs.deriveAddress(publicKey);

        let obj = {
            txId: '',
            info: ''
        };
        return new Promise((resolve, reject) => {

            this.prepareCheckCreate(addressFrom, addressTo, amount).then(prepare => {
                this.signTX(publicKey, addressTo, prepare.instructions, amount, privateKey).then(sign => {
                    obj['txId'] = sign.id;
                    this.sendTX(sign.signedTransaction).then(sendInfo => {
                        obj['info'] = sendInfo;
                        resolve(obj);

                    })
                }).catch((err) => {
                    console.log('An error has occured:');
                    reject(err);
                });
            })
        })
    }
}

