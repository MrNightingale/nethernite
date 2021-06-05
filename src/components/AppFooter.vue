<template>
  <v-footer
    dark
    padless
  >
    <v-card
      flat
      tile
      class="dark lighten-1 white--text text-center"
      style="width: 100%"
    >
      <v-card-text>
        <v-btn
          href="https://github.com/mrnightingale"
          target="_blank"
          class="mx-12 white--text"
          icon
        >
          <v-icon size="24px">
            mdi-github
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-divider />

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Vladyslav Soloviov</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
