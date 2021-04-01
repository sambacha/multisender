// 0x000000000000000000000000c6cde7c39eb2f0f0095f41570af89efc2c1ea828

let contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
let index = 0
console.log(web3.eth.getStorageAt(contractAddress, index))
console.log('DEC:' + web3.toDecimal(web3.eth.getStorageAt(contractAddress, index)))
