#Ripple provider

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
#### Create public key ####
```javascript
const publicKey = rippleProvider.getAddress(privateKey);
```

#### Get balance ####
```javascript
const balnce = rippleProvider.getBalance(publicKey);
```
#### Create transaction ####
```javascript
rippleProvider.sendXRP(from, to, amount, privateKey).then(transaction=>{
    console.log(transaction);
});
```

```
from - your public key 
to - address of the recipient
amount - amount in xrp
privateKey - your private key
```

