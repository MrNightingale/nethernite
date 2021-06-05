import algoliasearch from 'algoliasearch/lite'

const _client = algoliasearch('OFCNCOG2CU', 'f54e21fa3a2a0160595bb058179bfb1e')

export default {
  getNpmIndex () {
    return _client.initIndex('npm-search')
  }
}
