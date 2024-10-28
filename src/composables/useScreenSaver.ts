// composables/useScreenSaver.ts
import { ref, onUnmounted } from 'vue'

interface Position {
  box: number    // 0, 1, or 2 for the three boxes
  row: number    // 0-6
  col: number    // 0-4
}

export function useScreenSaver() {
  const screenArray = ref([
    [
      [1, 2, 3, 4, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
  ])

  // Track positions of numbers 1-4
  const positions = ref<Position[]>([
    { box: 0, row: 0, col: 0 }, // number 1
    { box: 0, row: 0, col: 1 }, // number 2
    { box: 0, row: 0, col: 2 }, // number 3
    { box: 0, row: 0, col: 3 }  // number 4
  ])

  let animationInterval: number | null = null

  const moveNumbers = () => {
    const newPositions: Position[] = []
    
    // Move the leader (position[0])
    const leader = positions.value[0]
    const nextPos = getNextPosition(leader)
    newPositions[0] = nextPos

    // Follow the leader for positions 1-4
    for (let i = 1; i < positions.value.length; i++) {
      newPositions[i] = { ...positions.value[i - 1] }
    }

    // Clear old positions
    screenArray.value.forEach((box, boxIndex) => {
      box.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
          screenArray.value[boxIndex][rowIndex][colIndex] = 0
        })
      })
    })

    // Set new positions
    newPositions.forEach((pos, index) => {
      screenArray.value[pos.box][pos.row][pos.col] = index + 1
    })

    positions.value = newPositions
  }

  const getNextPosition = (currentPos: Position): Position => {
    const nextPos = { ...currentPos }

    // Define movement pattern
    if (currentPos.row === 0) {
      // Moving right at top
      if (currentPos.col < 4) {
        nextPos.col++
      } else {
        nextPos.row++
      }
    } else if (currentPos.col === 4) {
      // Moving down on right side
      if (currentPos.row < 6) {
        nextPos.row++
      } else {
        // Move to next box
        nextPos.box = (currentPos.box + 1) % 3
        nextPos.row = 0
        nextPos.col = 0
      }
    } else if (currentPos.row === 6) {
      // Moving left at bottom
      if (currentPos.col > 0) {
        nextPos.col--
      } else {
        nextPos.row--
      }
    } else if (currentPos.col === 0) {
      // Moving up on left side
      if (currentPos.row > 0) {
        nextPos.row--
      } else {
        nextPos.col++
      }
    }

    return nextPos
  }

  const startAnimation = (speed: number = 200) => {
    if (animationInterval) {
      clearInterval(animationInterval)
    }
    animationInterval = setInterval(moveNumbers, speed)
  }

  const stopAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval)
      animationInterval = null
    }
  }

  onUnmounted(() => {
    stopAnimation()
  })

  return {
    screenArray,
    startAnimation,
    stopAnimation
  }
}