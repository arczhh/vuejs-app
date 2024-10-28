<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { keyboardLayout, numpadLayout, charMatrix } from '../data/characters'
import { useTimer } from '../composables/useTimer'
import { useScreenSaver } from '../composables/useScreenSaver'
import badwords from '../data/badwords'
import HardwareDiag from './HardwareDiag.vue'

const defaultTimeCounter = 10 // seconds
const isFullscreen = ref(false)
const btnStartState = ref<number>(0)

const { timeCountdown, startTimer, stopTimer, resetTimer } = useTimer(defaultTimeCounter, () => {
  clearText()
})
const { screenArray, startAnimation, stopAnimation } = useScreenSaver()
const isScreenSaverActive = ref(false)
const SCREEN_SAVER_DELAY = 30000 // 3 seconds
let screenSaverTimeout: number | null = null

// Start screen saver after inactivity
const initializeScreenSaver = () => {
  if (screenSaverTimeout) {
    clearTimeout(screenSaverTimeout)
  }

  screenSaverTimeout = setTimeout(() => {
    isScreenSaverActive.value = true
    charGrids.value = screenArray.value // Use screen saver array
    startAnimation(200) // Start animation with 200ms speed
  }, SCREEN_SAVER_DELAY)
}

// Reset screen saver timer on activity
const resetScreenSaver = () => {
  if (isScreenSaverActive.value) {
    isScreenSaverActive.value = false
    stopAnimation()
    charGrids.value = [getCharGrid('default'), getCharGrid('default'), getCharGrid('default')]
  }
  initializeScreenSaver()
}

// Initialize screen saver on mount
onMounted(() => {
  initializeScreenSaver()
})

// Clean up on unmount
onUnmounted(() => {
  if (screenSaverTimeout) {
    clearTimeout(screenSaverTimeout)
  }
  stopAnimation()
})


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
  resetScreenSaver()
  if (displayText.value.length < 3) {
    displayText.value += char  // Append the clicked character to displayText
    if (badwords.includes((displayText.value).toUpperCase())) {
      clearText()
      return
    }
    Array.from(char).forEach(element => {
      charGrids.value[displayText.value.length - 1] = getCharGrid(element)
    })
    if (displayText.value.length === 3) {
      btnStartState.value = 2
    } else {
      btnStartState.value = 1
    }
    startTimer()
  }
}

const clearText = () => {
  resetScreenSaver()
  btnStartState.value = 0
  charGrids.value = [getCharGrid('default'), getCharGrid('default'), getCharGrid('default')]
  displayText.value = ''  // Add a function to clear the text
  resetTimer()
}

const backspace = () => {
  resetScreenSaver()
  displayText.value = displayText.value.slice(0, -1)
  if (displayText.value.length === 0) {
    btnStartState.value = 0
  } else {
    btnStartState.value = 1
  }
  charGrids.value[displayText.value.length] = getCharGrid('default')
  startTimer()
}

function getCharGrid(char: string) {
  return charMatrix[char.toUpperCase()] || charMatrix['default']; // ignore
}

</script>

<template>
  <div class="characters-wrapper">
    <!-- Display the three character blocks -->
    <div v-for="(charGrid, index) in charGrids" :key="index" class="char-block">
      <div v-for="(row, rowIndex) in charGrid" :key="rowIndex" class="row">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex"
          :class="['cell', { 'filled': cell === 1, 'filled-2': cell === 2, 'filled-3': cell === 3, 'filled-4': cell === 4 }]">
        </div>
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
        <button class="btn btn-neutral h-10 w-40 mb-2" @click="backspace">BACKSPACE</button>
        <button class="btn btn-error h-10 w-40 mb-2" @click="clearText">CLEAR</button>
        <button class="btn w-40"
          :class="{ 'btn-success': btnStartState === 2, 'btn-warning': btnStartState === 1 }">START</button>
      </div>
    </div>
  </div>
  <button class="btn btn-outline btnSetting" onclick="my_modal_3.showModal()">
    Settings
  </button>
  <button class="btn btn-outline btnFsc" @click="toggleFullscreen">
    {{ isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
  </button>
  <HardwareDiag />
</template>

<style scoped>
.keyboard-wrapper {
  /* background-color: burlywood; */
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
  /* background: red; */
}

.numpad-section {
  flex-shrink: 0;
  /* background: green; */
}

.kbd {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  width: 3.5rem;
  height: 3.5rem;
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
}

.filled-2 {
  background-color: red;
}

.filled-3 {
  background-color: green;
}

.filled-4 {
  background-color: blue;
}

.special-keys {
  display: flex;
  flex-direction: column;
}

.btnFsc {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}

.btnSetting {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>