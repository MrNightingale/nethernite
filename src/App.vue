<template>
  <v-app>
    <v-container
      fluid
      class="container pa-0"
    >
      <v-data-iterator
        :items="packages"
        :items-per-page.sync="hitsPerPage"
        :page.sync="page"
        :search="search"
        hide-default-footer
      >
        <template v-slot:header>
          <v-toolbar
            dark
            color="purple darken-3"
            class="mb-1"
          >
            <v-text-field
              v-model.trim="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search for npm packages"
            />
          </v-toolbar>
        </template>

        <template
          v-slot:default
        >
          <v-row
            v-for="item in packages"
            :key="item.name"
            class="ma-3"
          >
            <v-card class="card">
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>
              <v-card-subtitle>{{ item.description }}</v-card-subtitle>
            </v-card>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row
            v-if="numberOfPages"
            class="ma-3"
            align="center"
            justify="center"
          >
            <v-spacer />

            <span class="mr-4 grey--text">
              Page {{ page + 1 }} of {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="purple darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="purple darken-3"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import AlgoliaService from '@/services/algolia'

const HITS_PER_PAGE = 10

export default {
  name: 'App',
  components: {
    AppFooter
  },
  data () {
    return {
      search: '',
      page: 0,
      numberOfPages: null,
      hitsPerPage: HITS_PER_PAGE,
      packages: []
    }
  },
  watch: {
    search (newVal, preVal) {
      if (newVal !== preVal) {
        this.page = 0
        this.doSearch()
      } else {
        this.doSearch()
      }
    },
    page () {
      this.doSearch()
    }
  },
  created () {
    this.doSearch()
  },
  methods: {
    async doSearch () {
      const params = {
        page: this.page,
        hitsPerPage: this.hitsPerPage
      }
      const res = await AlgoliaService.getNpmIndex('popularity').search(this.search, params)
      this.numberOfPages = res.nbPages
      this.packages = this.transformEntries(res.hits)
    },
    transformEntries (entries) {
      if (entries) {
        return entries.map(el => {
          return {
            name: el.name,
            description: el.description,
            icon: el.owner?.avatar,
            link: el.repository?.url,
            version: el.version,
            license: el.license
          }
        })
      }
    },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 0) this.page -= 1
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    margin: 0 auto;
    max-width: 1024px;
    width: 100%;
    padding: 0 110px;
  }

  .card {
    width: 100%;
    cursor: pointer;
  }
</style>
