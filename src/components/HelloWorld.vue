<script setup lang="ts">
import { ref } from 'vue'
import { keyboardLayout, numpadLayout, charMatrix } from '../data/characters'

const defaultTimeCounter = 10 // seconds
const isFullscreen = ref(false)
const timeCountdown = ref(defaultTimeCounter)
const timerInterval = ref<number | null>(null)

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (err) {
    console.error('Error attempting to toggle fullscreen:', err)
  }
}

const displayText = ref('')  // Add this to store the clicked characters
const charGrids = ref([getCharGrid('default'), getCharGrid('default'), getCharGrid('default')])

const kbdClick = (char: string) => {
  if (displayText.value.length < 3) {
    displayText.value += char  // Append the clicked character to displayText
    Array.from(char).forEach(element => {
      charGrids.value[displayText.value.length - 1] = getCharGrid(element)
    })
    startTimer()
  }
}

const clearText = () => {
  charGrids.value = [getCharGrid('default'), getCharGrid('default'), getCharGrid('default')]
  displayText.value = ''  // Add a function to clear the text
  resetTimer()
}

const backspace = () => {
  displayText.value = displayText.value.slice(0, -1)
  charGrids.value[displayText.value.length] = getCharGrid('default')
  startTimer()
}

function getCharGrid(char: string) {
  return charMatrix[char.toUpperCase()] || charMatrix['default'];
}

// Timer functions
const startTimer = () => {
  // Clear any existing interval first
  stopTimer()
  
  timeCountdown.value = defaultTimeCounter
  timerInterval.value = setInterval(() => {
    if (timeCountdown.value > 0) {
      timeCountdown.value--
      if (timeCountdown.value === 0) {
        stopTimer()
        clearText() // Clear text when timer reaches 0
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const resetTimer = () => {
  stopTimer()
  timeCountdown.value = defaultTimeCounter
}
</script>

<template>
  <div class="characters-wrapper">
    <!-- Display the three character blocks -->
    <div v-for="(charGrid, index) in charGrids" :key="index" class="char-block">
      <div v-for="(row, rowIndex) in charGrid" :key="rowIndex" class="row">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex" :class="['cell', { 'filled': cell === 1 }]"></div>
      </div>
    </div>
  </div>
  <div class="mb-2">
    <progress class="progress w-100" :value="timeCountdown" :max="defaultTimeCounter"></progress>
  </div>
  <div class="keyboard-wrapper">
    <div class="keyboard-container">
      <!-- Main Keyboard -->
      <div class="keyboard-section">
        <div v-for="(row, rowIndex) in keyboardLayout" :key="rowIndex" class="my-1 flex w-full justify-center gap-1">
          <kbd v-for="char in row" :key="char" class="kbd" @click="kbdClick(char)">
            {{ char.toUpperCase() }}
          </kbd>
        </div>
      </div>

      <!-- Numpad -->
      <div class="numpad-section ml-4">
        <div v-for="(row, rowIndex) in numpadLayout" :key="rowIndex" class="my-1 flex w-full justify-center gap-1">
          <kbd v-for="char in row" :key="char" class="kbd" :class="{ 'kbd-wide': char === 'Enter' }"
            @click="kbdClick(char)">
            {{ char }}
          </kbd>
        </div>
      </div>

      <!-- Special Keys -->
      <div class="special-keys mt-2">
        <div class="special-key bg-accent text-accent-content grid h-10 w-32 place-content-center rounded mb-2" @click="backspace">BACKSPACE</div>
        <div class="special-key bg-accent text-accent-content grid h-10 w-32 place-content-center rounded mb-2" @click="clearText">CLEAR</div>
        <button class="btn btn-outline">START</button>
      </div>
    </div>
  </div>
  <button class="btn btn-outline" @click="toggleFullscreen">
    {{ isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
  </button>
</template>

<style scoped>
.keyboard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.keyboard-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
}

.keyboard-section {
  flex-shrink: 0;
}

.numpad-section {
  flex-shrink: 0;
}

.kbd {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
}

.kbd:hover {
  background-color: #ddd;
}

.kbd-wide {
  width: 4rem;
}

.characters-wrapper {
  display: flex;
  gap: 2rem;
  /* Space between character blocks */
  /* background: red; */
  justify-content: center;
  padding: 2rem 0 2rem 0;
}

.char-block {
  display: grid;
  grid-template-columns: repeat(5, 25px);
  /* 5 columns for the grid */
  gap: 5px;
  /* Gap between grid cells */
  background: #eee;
  padding: 1.2rem;
}

.row {
  display: contents;
  /* Ensure the row contents are displayed as grid items */
}

.cell {
  width: 25px;
  height: 25px;
  /* border: 1px solid #ccc; */
  background-color: #ddd;
}

.filled {
  background-color: black;
  /* Black for filled cells */
}

.special-key {
  cursor: pointer;
}
</style>