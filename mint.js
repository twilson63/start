import Arweave from 'arweave'
import fs from 'fs'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})
// const arweave = Arweave.init({
//   host: 'arweave.net',
//   port: 443,
//   protocol: 'https'
// })

const jwk = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
const addr = await arweave.wallets.jwkToAddress(jwk)
const src = fs.readFileSync('contract.js', 'utf-8')
// create contract Src
const cSrc = await arweave.createTransaction({ data: src })
cSrc.addTag('Content-Type', 'application/javascript')
cSrc.addTag('App-Name', 'SmartWeaveContractSource')
cSrc.addTag('App-Version', '0.3.0')
await arweave.transactions.sign(cSrc, jwk)
await arweave.transactions.post(cSrc)

// create image transaction
const img = fs.readFileSync('app/dist/winston.svg')
const imgTx = await arweave.createTransaction({ data: img })
imgTx.addTag('Content-Type', 'image/svg+xml')
await arweave.transactions.sign(imgTx, jwk)
await arweave.transactions.post(imgTx)

// create index.html transaction
const html = fs.readFileSync('app/dist/index.html')
const htmlTx = await arweave.createTransaction({ data: html })
htmlTx.addTag('Content-Type', 'text/html')
await arweave.transactions.sign(htmlTx, jwk)
await arweave.transactions.post(htmlTx)

// create contract
const contract = await arweave.createTransaction({
  data: JSON.stringify({
    manifest: "arweave/paths",
    version: "0.1.0",
    index: {
      path: 'index.html'
    },
    paths: {
      "index.html": {
        "id": `${htmlTx.id}`
      },
      "winston.svg": {
        "id": `${imgTx.id}`
      }
    }
  })
})
contract.addTag('Content-Type', 'application/x.arweave-manifest+json')
contract.addTag('Action', 'marketplace/create')
contract.addTag('App-Name', 'SmartWeaveContract')
contract.addTag('App-Version', '0.3.0')
contract.addTag('Contract-Src', cSrc.id)

contract.addTag('Init-State', JSON.stringify({
  owner: addr,
  title: 'Winston',
  description: 'Dynamic Atomic NFT',
  name: 'WinstonNFT', // PST Name
  ticker: 'ATOMNFT', // PST you want to associate with NFT
  balances: {
    [addr]: 1
  },
  locked: [],
  contentType: 'text/html',
  createdAt: Date.now(),
  allowMinting: false,
  tags: [],
  isPrivate: false,
  visits: []
}))

await arweave.transactions.sign(contract, jwk)
await arweave.transactions.post(contract)
console.log('ContractId: ', contract.id)
