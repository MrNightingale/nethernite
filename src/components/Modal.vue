<template>
  <transition name="modal">
    <div
      v-if="showModal"
      class="modal modal__mask"
    >
      <div class="modal__container">
        <div class="modal__container-inner">
          <div class="modal__header">
            <slot name="header" />
          </div>
          <div class="modal__body">
            <slot name="body" />
          </div>
          <div class="modal__footer">
            <slot name="footer" />
          </div>
          <button
            class="modal__close button"
            type="button"
            @click="$emit('close')"
          >
            x
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    showModal: {
      type: Boolean
    }
  }
}
</script>
