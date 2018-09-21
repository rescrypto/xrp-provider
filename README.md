
## Ripple provider ##

Makes it easy to work with a ripple wallet.

## Install ##
``` bash
npm i --save xrp-provider
```
## Include ##
```
var RippleProvider = require("xrp-provider").default;
```
or for ES-2015
```
import RippleProvider from 'xrp-provider'
```

## Initialize ##
```javascript
const rippleProvider = new RippleProvider('testnet'); // or mainnet
```
## Usage ##

#### Create private key ####
```javascript
const privateKey = rippleProvider.createPrivateKey();
```

#### Create private key from mnemonic ####
```javascript
const privateKey = rippleProvider.createPrivateKeyFromMnemonic(mnemonic);

let mnemonic = 'absurd green cannon quarter call spray upper diet defense convince live assist'
or 
let mnemonic = rippleProvider.generateMnemonic()
```
#### Create private key secret ####
```javascript
const privateKey = rippleProvider.createPrivateKeyFromSecret(secret);

let secret = rippleProvider.generateSecret()

```
#### Create public key ####
```javascript
const publicKey = rippleProvider.createPublicKey(privateKey);
```
#### Create address ####
```javascript
const address = rippleProvider.getAddress(publicKey);
```
#### Create address from secret ####
```javascript
const address = rippleProvider.getAddressFromSecret(secret);
```
#### Get balance ####
```javascript
const balance = rippleProvider.getBalance(address);
```
#### Create transaction using key pair ####
```javascript
rippleProvider.sendXrp(publicKey, addressTo, amount, privateKey).then(transaction=>{
    console.log(transaction);
});
```

```
publicKey - your public key 
addressTo - address of the recipient
amount - amount in xrp
privateKey - your private key
```

#### Create transaction using secret ####
```javascript
rippleProvider.sendXrpUsingSecret(addressTo, amount, secret).then(transaction=>{
    console.log(transaction);
});
```

```
addressTo - address of the recipient
amount - amount in xrp
secret - your secret
```
