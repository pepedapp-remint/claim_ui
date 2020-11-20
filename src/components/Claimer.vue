<template>
  <div class="hello">
    <h1>Wrapped Pepes</h1>

    <v-select v-model="selected" label="name" :options="claimables"></v-select>

    <h3>{{ selected }}</h3>
  </div>
</template>

<script>
import allAccountProofs from '../assets/account_proofs.json'
import minterABI from '../assets/Minter.json'
import cardMetadata from '../assets/card_metadata.json'

// NOTE: may want to move this somewhere else, but this is fine for now
const minterAddress = '0xd947d16ca291c4d444293da56332820bd8e32a81'

// NOTE: 'accountProofs' is a map of the structure account -> [{name, sig, index, count, proof}...]
export default {
  name: 'Claimer',
  data() {
    return {
      minterContract: {},

      claimables: [], // catch-all objects that contain all info necessary to claim/view option

      selected: null
    }
  },
  async mounted() {
    await window.ethereum.enable();
    const ethers = this.$ethers;
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);

    // Initialize Minter contract object
    this.minterContract = new ethers.Contract(minterAddress, minterABI['abi'], provider)

    // Create sig to name
    const sigToName = {}
    for (let card of cardMetadata) {
      sigToName[card['sig']] = card['name']
    }

    // Initialize claimables based on accounts retrieved from ethers
    this.claimables = []
    const accounts = await provider.listAccounts()
    for (let account of accounts) {

      for (let proof of allAccountProofs[account]) {
        this.claimables.push(
          Object.assign(proof, {'account': account, 'name': sigToName[proof['sig']]})
        )
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
