<script setup lang="ts">
import { ref } from 'vue'
import { keyboardLayout, numpadLayout, charMatrix } from '../data/characters'

const isFullscreen = ref(false)

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

const kbdClick = (char: string) => {
  displayText.value += char  // Append the clicked character to displayText
  console.log(char)
}

const clearText = () => {
  displayText.value = ''  // Add a function to clear the text
}

function getCharGrid(char: string) {
  return charMatrix[char.toUpperCase()] || null;
}

const charGrids = [
  getCharGrid('R'),
  getCharGrid('S'),
  getCharGrid('T'),
]
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

  <div class="keyboard-wrapper">
    <!-- Text Display Area -->
    <div class="display-section">
      <div class="text-display">
        {{ displayText || 'Type something...' }}
      </div>
      <button v-if="displayText" @click="clearText" class="clear-button">
        Clear
      </button>
    </div>

    <div class="keyboard-container">
      <!-- Main Keyboard -->
      <div class="keyboard-section">
        <div v-for="(row, rowIndex) in keyboardLayout" :key="rowIndex" class="my-1 flex w-full justify-center gap-1">
          <kbd v-for="char in row" :key="char" class="kbd" @click="kbdClick(char)">
            {{ char }}
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

.display-section {
  width: 100%;
  max-width: 600px;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.text-display {
  flex-grow: 1;
  min-height: 2.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
}

.clear-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
}

.clear-button:hover {
  background-color: #c0392b;
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
}

.char-block {
  display: grid;
  grid-template-columns: repeat(5, 20px);
  /* 5 columns for the grid */
  gap: 2px;
  /* Gap between grid cells */
}

.row {
  display: contents;
  /* Ensure the row contents are displayed as grid items */
}

.cell {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
}

.filled {
  background-color: black;
  /* Black for filled cells */
}
</style>