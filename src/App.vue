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
            <v-card
              class="card"
              @click="openModal(item.name)"
            >
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>
              <v-card-subtitle>{{ item.description }}</v-card-subtitle>
            </v-card>
            <modal
              v-if="currentCard === item.name"
              :show-modal="isModal"
              @close="closeModal"
            >
              <template #header>
                <img
                  v-if="item.icon"
                  :src="item.icon"
                  alt="package icon"
                  class="package__icon"
                >
                <h3 class="text-h4">
                  {{ item.name }}
                </h3>
              </template>
              <template #body>
                <p>{{ item.description }}</p>
                <div class="package__info">
                  <v-btn
                    v-if="item.link"
                    :href="item.link"
                    target="_blank"
                    class="mr-12 black--text"
                    icon
                  >
                    <v-icon size="32px">
                      mdi-github
                    </v-icon>
                  </v-btn>
                  <div
                    v-if="item.version"
                    class="package__info-item mr-12"
                    title="version"
                  >
                    <v-icon
                      size="24px"
                      color="grey darken-3"
                    >
                      mdi-tag
                    </v-icon>
                    {{ item.version }}
                  </div>
                  <div
                    v-if="item.license"
                    class="package__info-item mr-12"
                    title="license"
                  >
                    <v-icon
                      size="24px"
                      color="grey darken-3"
                    >
                      mdi-scale-balance
                    </v-icon>
                    {{ item.license }}
                  </div>
                </div>
              </template>
            </modal>
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
import Modal from '@/components/Modal'
import AlgoliaService from '@/services/algolia'

const HITS_PER_PAGE = 10
const DEFAULT_PAGE = 0

export default {
  name: 'App',
  components: {
    AppFooter,
    Modal
  },
  data () {
    return {
      search: '',
      page: DEFAULT_PAGE,
      numberOfPages: null,
      hitsPerPage: HITS_PER_PAGE,
      packages: [],
      isModal: false,
      currentCard: null
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
    },
    openModal (name) {
      this.currentCard = name
      this.isModal = true
    },
    closeModal () {
      this.isModal = false
      this.currentCard = null
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

  .package {
    &__icon {
      max-width: 50px;
      max-height: 50px;
      margin-right: 10px;
      border-radius: 10px;
    }

    &__info {
      display: flex;
      align-items: center;

      &-item {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }
  }
</style>
