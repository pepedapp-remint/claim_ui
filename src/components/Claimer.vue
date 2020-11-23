<template>
  <div class="hello">
    <h1>Wrapped Pepes</h1>

    <div id="claimer">
      <grid-layout
        :layout="claimGridLayout"
        :rowHeight="10"
        :isResizable=false
        :isDraggable=false
        >
        <grid-item
          :i="claimGridLayout[0]['i']"
          :x=0
          :y=0
          :w=8
          :h=1>
          <v-select v-model="selected" label="selector" :options="claimables"></v-select>
        </grid-item>

        <grid-item
          :i=1
          :x=8
          :y=0
          :w=4
          :h=1>
          <button :disabled="selected == null" v-on:click="claim">Claim</button>
        </grid-item>
      </grid-layout>
    </div>

    <div id="desc">
    <p>
    Wrapped Pepes are a new ERC1155 collectible that is redeemable by holders of original <a href="https://www.pepedapp.io/">PepeDapp</a> collectibles.
    </p>

    <p>
      A snapshot of the entire PepeDapp state was taken at Ethereum block 1107500 (Oct 17, 2020 6 PM UTC) and used
      for this airdrop.
    </p>

    <p>
      If you owned a PepeDapp card type at block 1107500, you'll be able to select it above. Click 'claim' to
      claim all of your cards of that type. You can then sell those collectibles on your favorite NFT marketplace
      (i.e. <a href="https://opensea.io/">OpenSea</a>).
    </p>

    <p>
      All of the code (contracts, airdrop code, this UI) is <a href="https://github.com/wrapped-pepes">open source</a>.
      The Redemption contract is <a href="https://etherscan.io/tx/0x962d8592ac9e7af8f00b91e89a3cdf8df4d8ca7e0de2fb44488b6852e639b07d">here</a> and
      the new ERC1155 contract is <a href="https://etherscan.io/address/0xdaae81c0077e8917a2eb63bb66ef701ff4781bb0">here</a>.
    </p>
    </div>
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
      claimGridLayout: [
        {
          'i': 0,
          'x': 0,
          'y': 0,
          'w': 8,
          'h': 1
        },
        {
          'i': 1,
          'x': 1,
          'y': 0,
          'w': 4,
          'h': 1
        }
      ],

      minterContract: {},
      provider: {},

      claimables: [], // catch-all objects that contain all info necessary to claim/view option

      selected: null
    }
  },
  methods: {
    claim: async function() {
      const signer = this.provider.getSigner(this.selected['account']);
      const connectedMinter = this.minterContract.connect(signer);

      console.log(`Submitting claim tx for ${this.selected}`)
      await connectedMinter.claim(
        this.selected['index'],
        this.selected['sig'],
        this.selected['account'],
        this.selected['count'],
        this.selected['proof']
      )
    }
  },
  async mounted() {
    await window.ethereum.enable();
    const ethers = this.$ethers;
    this.provider = new ethers.providers.Web3Provider(window.web3.currentProvider);

    // Initialize Minter contract object
    this.minterContract = new ethers.Contract(minterAddress, minterABI['abi'], this.provider)

    // Create sig to name
    const sigToName = {}
    for (let card of cardMetadata) {
      sigToName[card['sig']] = card['name']
    }

    // Initialize claimables based on accounts retrieved from ethers
    this.claimables = []
    const accounts = await this.provider.listAccounts()
    for (let account of accounts) {

      for (let proof of allAccountProofs[account]) {
        let index = proof['index']
        let claimed = await this.minterContract.claimed(index);

        if (!claimed) {
          this.claimables.push(
            Object.assign(
              proof,
              {'account': account, 'name': sigToName[proof['sig']], 'selector': `${sigToName[proof['sig']]} (${proof['count']})`}
            )
          )
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#claimer {
  margin: auto;
  width: 500px
}
#desc {
  margin: auto;
  width: 700px
}
</style>
