import { ref } from 'vue'

export function useTimer(defaultTime: number = 10, onComplete?: () => void) {
  const timeCountdown = ref(defaultTime)
  const timerInterval = ref<number | null>(null)

  const startTimer = () => {
    // Clear any existing interval first
    stopTimer()
    
    timeCountdown.value = defaultTime
    timerInterval.value = setInterval(() => {
      if (timeCountdown.value > 0) {
        timeCountdown.value--
        if (timeCountdown.value === 0) {
          stopTimer()
          if (onComplete) {
            onComplete()
          }
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
    timeCountdown.value = defaultTime
  }

  return {
    timeCountdown,
    startTimer,
    stopTimer,
    resetTimer
  }
}