<template lang="pug">
.container
  .row
    .col
      h1 Hello Drum Machine!
  .row.mb-4
    .col.d-grid.gap-2
      button.btn(@click="running = !running" :class="running ? 'btn-success' : 'btn-secondary'") {{ running ? 'Stop' : 'Start' }}
  .row
    .col(v-for="note in eightNotes" :note="note" :key="note")
      .d-grid.gap-2
        button.btn(@click="toggleEightNote(note)" :class="selectedNotes.includes(note) ? 'btn-primary' : 'btn-outline-primary'")
          span(v-if="note === playerIndex") ✅
          span {{ note }}
</template>

<script>
export default {
  data() {
    return {
      eightNotes: [0, 1, 2, 3, 4, 5, 6, 7],
      selectedNotes: [],
      playerIndex: 0,
      running: false,
      bpm: 99
    };
  },
  methods: {
    bpmMilliseconds() {
      return 60000 / this.bpm;
    },
    toggleEightNote(note) {
      if (this.selectedNotes.includes(note)) {
        this.selectedNotes = this.selectedNotes.filter(
          (selectedNote) => selectedNote !== note
        );
        return;
      } else {
        console.log('toggleEightNote', note);
        this.selectedNotes.push(note);
      }
    }
  },
  mounted() {
    setInterval(() => {
      if (!this.running) return;
      this.playerIndex = (this.playerIndex + 1) % 8;
    }, this.bpmMilliseconds());
  }
};
</script>
