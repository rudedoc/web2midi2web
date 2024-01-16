<template lang="pug">
.container
  .row
    .col
      h1 Web2Midi2Web
      p(v-if="midiOut")
        span.badge.bg-secondary Device {{ midiOut.name }}
        span &nbsp;
        span.badge.bg-secondary BPM {{  bpm }}
        span &nbsp;
        span.badge.bg-secondary Note {{  note }}
        span &nbsp;
        span.badge.bg-secondary Player Index {{  playerIndex }}
  .row.mb-4
    .col.d-grid.gap-2
      button.btn(@click="running = !running" :class="running ? 'btn-success' : 'btn-secondary'") {{ running ? 'Stop' : 'Start' }}
  .row
    .col(v-for="note in eightNotes" :note="note" :key="note")
      .d-grid.gap-2
        button.btn(@click="toggleEightNote(note)" :class="selectedNotes.includes(note) ? 'btn-primary' : 'btn-outline-primary'")
          span(v-if="note === playerIndex") ✅
          span {{ note }}
  .row
    .col
      .form-group
        label(for='customRange1') BPM {{ bpm }}
        input#customRange1.form-range(type='range' min="60" max="240" v-model="bpm")
</template>

<script>
export default {
  data() {
    return {
      midiOut: null,
      eightNotes: [0, 1, 2, 3, 4, 5, 6, 7],
      selectedNotes: [],
      playerIndex: 0,
      running: false,
      bpm: 120,
      notes: [48, 52, 55, 57, 60],
      note: null
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
        this.selectedNotes.push(note);
      }
    },
    async bindMidi() {
      const midi = await navigator.requestMIDIAccess({ software: true });
      this.setMidiOut(midi);
    },
    setMidiOut(midi) {
      // MIDI devices that you send data to.
      const initialOutputs = []
      const outputs = midi.outputs.values();
      for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        initialOutputs.push(output.value);
      }

      this.midiOut = initialOutputs.find(io => io.name === 'IAC Driver Bus 1');
    },
    playNotes() {
      if (!this.selectedNotes.includes(this.playerIndex)) return;
      this.note = this.notes[Math.floor(Math.random() * this.notes.length)];
      this.sendMidiMessage(this.midiOut.id, 0x90, this.note, 127, 100);
    },
    sendMessage() {
      this.note = this.notes[Math.floor(Math.random() * this.notes.length)];
      this.sendMidiMessage(this.midiOut.id, 0x90, this.note, 127, 100);
    },
    // Send a MIDI message out the specified "port" - the connection to a MIDI device.
    sendMidiMessage(portId, cmd, pitch, velocity, duration) {
      const NOTE_ON = 0x90;   // 144
      const NOTE_OFF = 0x80;  // 128
      const msg = [NOTE_ON, pitch, velocity];
      console.log("Output device -> " + this.midiOut.name + " " + msg);
      this.midiOut.send(msg);
      setTimeout(() => {
        const msg = [NOTE_OFF, pitch, 0];
        console.log("Output device -> " + this.midiOut.name + " " + msg);
        this.midiOut.send(msg);
      }, this.bpmMilliseconds() * 4);
    }
  },
  mounted() {
    this.bindMidi();
    setInterval(() => {
      if (!this.running) return;
      this.playerIndex = (this.playerIndex + 1) % this.eightNotes.length;
      this.playNotes();
    }, this.bpmMilliseconds());
  }
};
</script>
