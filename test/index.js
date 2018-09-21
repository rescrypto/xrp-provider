import RippleProvider from '../src'

const xrp = new RippleProvider('testnet'); // or mainnet

let mnemonic = 'hire piece name bind bulb hour impulse student pair useless rubber embark';
let fromMnemonic = xrp.createPrivateKeyFromMnemonic(mnemonic);
console.log('fromMnemonic:', fromMnemonic);

let privateKey = xrp.createPrivateKey();
console.log('privateKey:', privateKey);

let publicKey = xrp.createPublicKey(fromMnemonic);
console.log('publicKey:', publicKey);
let address = xrp.getAddress(publicKey);
console.log('address:', address);
xrp.getBalance(address).then(balance => {
    console.log(balance);
});

let testPrivate = xrp.createPrivateKeyFromSecret('snY24zcTdrahTZwQk9NuNx6xScqjU');
let testPublic = xrp.createPublicKey(testPrivate);
let testAddress = xrp.getAddress(testPublic);

console.log('testPrivate:', testPrivate);
console.log('testPublic:', testPublic);
console.log('testAddress:', testAddress);
xrp.getBalance(testAddress).then(balance => {
    console.log('testBalance:', balance);
});

// sendXRP

// C53611E632E112D97094B50145EB25DC2DEB51279AD70B29961A3B612A701B71
// xrp.getTransaction('C53611E632E112D97094B50145EB25DC2DEB51279AD70B29961A3B612A701B71').then(res => {
//     console.log(res);
// })
// xrp.sendXrp(testPublic,address,'1000',testPrivate).then(tx=>{
//     console.log('tx:', tx);
// });
// xrp.sendXrpUsingSecret(address,'1000','snY24zcTdrahTZwQk9NuNx6xScqjU').then(tx=>{
//     console.log('tx:', tx);
// });
