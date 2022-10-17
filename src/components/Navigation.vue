<template>
  <nav class="navigation">
    <div class="navTitle" @click="resetView" title="Home">Strboard.io</div>
    <button @click="newMessage">
      <img src="../assets/images/4ptstar.png" alt="">
      <span>New Star</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
/* Data */
const emit = defineEmits<{
  (event: 'resetView'): void
  (event: 'newMessage'): void
}>()
/* Methods */
function resetView() {
  emit("resetView");
}

function newMessage() {
  emit("newMessage");
}

/* Mounted, Watcher ...*/
onMounted(() => {
});

</script>

<style scoped lang="scss">
.navigation {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .navTitle {
    color: $gray100;
    font-family: $Newake;
    font-size: $fontSize7;
    margin: spacing(1);
    text-decoration: none;
    cursor: pointer;
  }

  a:visited {
    color: $gray100;
    text-decoration: none;
  }

  button {
    //sbackground: linear-gradient(to right, #de73e2, #302b63, #24243e);
    align-items: center;
    background: white;
    border-radius: 16px;
    border: none;
    color: black;
    cursor: pointer;
    display: flex;
    font-family: $techna;
    font-size: $fontSize2;
    letter-spacing: 0.05em;
    margin: spacing(1);
    padding: spacing(.5);
    position: relative;
    transition: all 0.2s ease-in-out;

  }

  button img {
    height: 16px;
    width: 16px;
    margin-right: spacing(.5);
    filter: brightness(0);
    transition: all 0.2s ease-in-out;
  }

  button:hover img {
    transform: rotate(90deg);
  }


}
</style>
