# Atomic NFTs (Dynamic)

Dynamic Atomic NFTs are powerful mechanisms that connect together three Arweave technologies, SmartWeave contracts, Atomic NFTs and the Permaweb.

``` 
SmartWeaveContract(
  PermawebApp(
    Digital Asset
  )
)
```

Dynamic NFTs are SmartWeave Contracts wrapped around a Permaweb App that wraps a digital asset, this capability allows for many interesting use cases. One use case is the ability for the NFT itself to actually capture attention and work with L2 blockchains like `KOII` to provide rewards for that attention. In this workshop, we will continue our journey with DataFi and explore dynamic Atomic NFTs.

## About Workshop

### What do I need to know to get the most out of this workshop?

* Understanding the concept of Blockchains - https://youtu.be/yubzJw0uiE4
* Understanding the concept of NFTs - https://youtu.be/NNQLJcJEzv0
* Fullstack Developer skills (HTML, CSS, and Javascript)
* Arweave Concepts (Data Storage and Smartweave Contracts) - https://arweave.org

### What developer tools will be using?

* Code Editor https://code.visualstudio.com
* NodeJS (v16.15.1) https://nodejs.org
* ArLocal (v1.1.41) https://github.com/textury/arlocal

> IF you want to use mainnet: You will also need a couple of Arweave Wallets and a little AR to make some transactions, you can get a wallet at https://arweave.app or https://arconnect.io and you can find the best exchanges to acquire AR via this article - https://arweave.news/how-to-buy-arweave-token/

## DataFi

To better understand the capabilities of DataFi, I think it will be best to unpack each of the underlining concepts with references to explore them deeper. Then walk through a proof of concept via code that can demonstrate the combination of these concepts in a simple project. Finally, share some use cases that demonstrate DataFi in the wild. Buckle up this should be a fun ride. 🚀

* Trustless
* Permissionless
* Composable

DataFi Workshop is a multipart series of concepts grouped under the idea of dataFi, where permanent **data** meets decentralized **fi**nalization. Arweave contains many core concepts that can bundle together to create exciting features and functionality unique to the Arweave ecosystem. 

Permanent **Data** + Decentralized **Fi**nalization = **DataFi**

![DataFi](https://fedzrgwlefkoztvkbdve3hkqeimokiowci6gyf63ojd3tfxcpi.arweave.net/KQeYmsshVOzOqgjqTZ1QIhjlIdYSPGwX23J_HuZbiek)


## Atomic NFTs (Dynamic) Workshop

The NFT concept is about showing and transfering ownership of an item, to show ownership you have a token that shows the owner of a specific key pair (public/private) keys owns a specific (Digital) asset. 

> It is possible for an NFT to point to a physical asset as well, but for the purposes of this workshop we will be dealing with NFTs that show ownership of a digital asset.

That digital asset needs to be available for reference at all times. Arweave is a great storage choice for digital assets, because you pay once to store and it is available through a decentrailized network forever. Many NFT developers may store the NFT or Token on blockchain then store the data on a storage layer, which separates the token from the digital asset into two platforms. With Arweave Smart Contracts you can store both the NFT (Token) and the Digital Asset on the same blockchain(blockweave). This allows you to keep both the token and the digital asset combined together.

### What is an Atomic NFT?

> NOTE: As of June 10, 2022 we are using the Atomic NFT standard defined at https://atomicnft.com - This standard may change in the future! 

Atomic NFT is a standard where the media assets and the contract metadata are stored together immutably under a single unique identifier. -- https://atomicnft.com/en/General-definition-of-an-atomic-NFT/

In order to provide a single identifier as the point of entry for both the NFT and asset, we will use the process we demoed in the last workshop. The ability to add a NFT SmartWeave Contract and Digital Asset as the data in a single transaction provides us the ability to have a single transaction id point to both the NFT and the digital asset.

![Atomic NFT](https://arweave.net/_3iet3wjKfJPsM4QTRZnLYGrfe77jRJKraLzfJVCLSs)

Find out more in a previous workshop: https://youtu.be/qu6SEjYrMA0

## Workshop Project Dynamic Atomic NFT

Lets build a simple attention tracking Atomic NFT, if a user visits the NFT we can generate JWK, if it is there first time, then store that JWK in their localStorage, and use it create a visit interaction for the Atomic NFT contract, then we will increment the counter to track the number of unique visits. When we deploy to the permaweb, we will be able to capture attention using our Warp Contract and display the results.

## Getting Started

### Install and start arlocal

> arlocal is a single executable that simulates the Arweave gateway and node on your local workstation. It will allow us to mint our dynamic NFT without have to use AR

In a separate terminal window start arlocal (devnet)

``` sh
npm install -g arlocal@1.1.41
arlocal
```

### Create new project

``` sh
mkdir dynamic-demo
cd dynamic-demo
npm init -y
```


Lets use a cool image of `Winston` that `DMac` has made public domain for Arweave Demo purposes - 🙏🏻 Thanks DMac!

> NOTE: Check out DMac's workshop on uploading NFTs https://www.youtube.com/watch?v=TMzKoxpf_GU

![Winston](https://arweave.net/je2PgRDv0XRbqQiUrCovofwlZHeYOS7WJrFJGigqNoY)


### Get our NFT Digital Asset

``` sh
curl -L -O https://arweave.net/je2PgRDv0XRbqQiUrCovofwlZHeYOS7WJrFJGigqNoY
mv je2PgRDv0XRbqQiUrCovofwlZHeYOS7WJrFJGigqNoY winston.svg
```

### Create our devnet wallet

``` 
npm install arweave@1.11.4
```

create-wallet.js

``` js
import Arweave from 'arweave'
import fs from 'fs'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const jwk = await arweave.wallets.generate()
const addr = await arweave.wallets.jwkToAddress(jwk)
fs.writeFileSync('wallet.json', JSON.stringify(jwk))

await arweave.api.get(`mint/${addr}/${arweave.ar.arToWinston('100')}`)
```

Lets create our devnet wallet

``` sh
node create-wallet.js
```

## Attention Tracking

Lets build a simple attention tracking Atomic NFT, if a user visits the NFT we can generate JWK, if it is there first time, then store that JWK in their localStorage, and use it create a visit interaction for the Atomic NFT contract, then we will increment the counter to track the number of unique visits. When we deploy to the permaweb, we will be able to capture attention using our Warp Contract and display the results.

### Create our NFT Contract

Let's create our contract source code. 

``` sh
touch contract.js
```

contract.js

This is our basic NFT contract, it contains two functions, balance and transfer.

``` js
const functions = { balance, transfer }

export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  return ContractError('function not defined!')
}

function balance(state, action) {
  const { input, caller } = action
  let target = input.target ? input.target : caller;
  const { ticker, balances } = state;
  ContractAssert(
    typeof target === 'string', 'Must specify target to retrieve balance for'
  )
  return {
    result: {
      target,
      ticker,
      balance: target in balances ? balances[target] : 0
    }
  }
}

function transfer(state, action) {
  const { input, caller } = action
  const { target, qty } = input
  ContractAssert(target, 'No target specified')
  ContractAssert(caller !== target, 'Invalid Token Transfer. ')
  ContractAssert(qty, 'No quantity specified')
  const { balances } = state
  ContractAssert(
    caller in balances && balances[caller] >= qty,
    'Caller has insufficient funds'
  )
  balances[caller] -= qty
  if (!(target in balances)) {
    balances[target] = 0
  }
  balances[target] += qty
  state.balances = balances
  return { state }
}


```

### Mint a NFT

`npm install arweave`

mint.js

In this script we are minting the NFT, we do this manually to go through all of the steps of the NFT process.

``` js
import Arweave from 'arweave'
import fs from 'fs'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const jwk = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
const addr = await arweave.wallets.jwkToAddress(jwk)
const src = fs.readFileSync('contract.js', 'utf-8')
const winston = fs.readFileSync('winston.svg', 'utf-8')
// create contract Src
const cSrc = await arweave.createTransaction({ data: src })
cSrc.addTag('Content-Type', 'application/javascript')
cSrc.addTag('App-Name', 'SmartWeaveContractSource')
cSrc.addTag('App-Version', '0.3.0')
await arweave.transactions.sign(cSrc, jwk)
await arweave.transactions.post(cSrc)

// create contract
const contract = await arweave.createTransaction({ data: winston })
contract.addTag('Content-Type', 'image/svg+xml')
contract.addTag('Network', 'Koii') // Exchange to list NFT on Koii
contract.addTag('Action', 'marketplace/Create')
contract.addTag('App-Name', 'SmartWeaveContract')
contract.addTag('App-Version', '0.3.1')
contract.addTag('Contract-Src', cSrc.id)
contract.addTag('NSFW', 'false')
contract.addTag('Init-State', JSON.stringify({
  owner: addr,
  title: 'Winston',
  description: 'Winston the mascot of Arweave who never forgets!',
  name: 'Koii', // PST Name
  ticker: 'KOINFT', // PST you want to associate with NFT
  balances: {
    [addr]: 1
  },
  locked: [],
  contentType: 'text/svg+xml',
  createdAt: Date.now(),
  tags: [],
	isPrivate: false
}))

await arweave.transactions.sign(contract, jwk)
await arweave.transactions.post(contract)
console.log('ContractId: ', contract.id)

```

## Setup Svelte to build single html page

``` sh
npm create vite app -- --template svelte
cd app
npm install --save-dev vite-plugin-singlefile
```

Modify vite.config.js

``` js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'


// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [svelte(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  }
})
```

## Out Dynamic AtomicNFT

App.svelte

``` svelte

<script>
  import { onMount } from "svelte";
  import Arweave from "arweave";

  const { WarpWebFactory } = warp;
  const CONTRACT = window.location.pathname.replace(/\//g, "");
  let wallet;

  const arweave = Arweave.init({
    host: "1984-twilson63-start-lz6crl35npf.ws-us47.gitpod.io",
    port: "443",
    protocol: "https",
  });
  // const arweave = Arweave.init({
  //   host: "arweave.net",
  //   port: "443",
  //   protocol: "https",
  // });

  // check and see if jwk in localstorage
  // otherwise generate one

  const contract = WarpWebFactory.memCachedBased(arweave)
    // remember to comment this out when deploying to production
    .useArweaveGateway()
    .build()
    // end
    .contract(CONTRACT);

  function visits() {
    return contract
      .viewState({
        function: "visits",
      })
      .then((res) => res.result);
  }

  async function doVisit() {
    if (!sessionStorage.getItem("addr")) {
      wallet = await arweave.wallets.generate();
      const addr = await arweave.wallets.jwkToAddress(wallet);
      sessionStorage.setItem("addr", addr);
      await arweave.api.get(`mint/${addr}/${arweave.ar.arToWinston("100")}`);
      await contract.connect(wallet).writeInteraction({
        function: "visit",
      });
      await arweave.api.get("mine"); // testing only

      // arweave.net
      // await contract.connect(wallet).bundleInteraction({
      //   function: "visit",
      // });

      total = visits();
    }
  }
  onMount(doVisit);

  let total = visits();
</script>

<div style="text-align: center; margin-top: 8px; margin-bottom: 8px;">
  {#await total}
    Loading...
  {:then visits}
    Number of unique visits: {visits}
  {/await}
</div>
<img src="winston.svg" alt="winston" />

```

### Adjust the Contract

``` js
const functions = { balance, transfer, visit, visits }

export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  return ContractError('function not defined!')
}

function visit(state, action) {
  const { caller } = action

  if (!state.visits.includes(caller)) {
    state.visits = [...state.visits, action.caller]

  }
  return { state }
}

function visits(state, action) {
  return { result: state.visits.length || 0 }
}

...
```

### Mint Dynamic NFT

``` js

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
```

## Summary


