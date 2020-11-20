<template>
  <div class="hello">
    <h1>{{ authorizedAccountProofs }}</h1>
  </div>
</template>

<script>
import allAccountProofs from '../assets/account_proofs.json'

export default {
  name: 'Claimer',
  data() {
    return {
      allAccountProofs: allAccountProofs,
      authorizedAccountProofs: []
    }
  },
  async mounted() {
    await window.ethereum.enable();
    const ethers = this.$ethers;
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);

    const accounts = await provider.listAccounts()

    this.authorizedAccountProofs = {};
    for (let account of accounts) {
      this.authorizedAccountProofs[account] = this.allAccountProofs[account]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
