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
