<template>
    <dialog id="my_modal_3" class="modal">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
            </form>
            <h3 class="text-lg font-bold">Hardware Diagnostics</h3>
            <p>{{ pwdInput != pwd && pwdInput.length == 4 ? 'Wrong Password' : (showNumpad ? getMaskedPwdInput() : null)
                }}</p>
            <div v-if="showNumpad" class="numpad-section">
                <div v-for="(row, rowIndex) in numpadLayout2" :key="rowIndex"
                    class="my-1 flex w-full justify-center gap-1">
                    <kbd v-for="char in row" :key="char" class="kbd"
                        :class="{ 'np-clear': char === 'C', 'np-del': char === 'D' }" @click="kbdClick(char)">
                        {{ char }}
                    </kbd>
                </div>
            </div>
            <div v-else-if="!showNumpad">
                <p class="mt-2">Running around 10+ seconds</p>
                <div class="flex w-full flex-col">
                    <div v-for="(mode, index) in mode" :key="index">
                        <!-- <div class="divider"></div> -->
                        <div class="join mt-4">
                            <button class="btn join-item btn-active w-40">{{ mode.name }}</button>
                            <button class="btn join-item btn-success w-20" @click="startClick('START')">
                                <p v-if="!showToast">START</p>
                                <span v-else class="loading loading-ring loading-lg"></span>
                            </button>
                            <button class="btn join-item btn-error w-20" @click="startClick('STOP')">
                                <p v-if="!showToast">STOP</p>
                                <span v-else class="loading loading-ring loading-lg"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
    <div v-if="showToast" class="toast toast-end">
        <div class="alert alert-info">
            <span>{{ toastMessage }}</span>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            showNumpad: true, // Set to false to hide numpad initially
            pwd: '1111',
            pwdInput: '',
            displayText: [],
            numpadLayout2: [
                // Define the layout of the numpad here
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                ['C', '0', 'D']
            ],
            mode: [
                {
                    name: 'MODE-1',
                    content: 'content'
                },
                {
                    name: 'MODE-2',
                    content: 'content'
                },
                {
                    name: 'MODE-3',
                    content: 'content'
                }
            ],
            showToast: false,
            toastMessage: '',
        };
    },
    methods: {
        kbdClick(char: string) {
            if (char.toUpperCase() === 'D') {
                this.displayText.pop()
            } else if (char.toUpperCase() === 'C') {
                this.displayText = []
            } else if (this.displayText.length < 4) {
                this.displayText.push(char)  // Append the clicked character to displayText
            }
            this.pwdInput = this.displayText.join('')

            if (this.pwdInput == this.pwd) {
                this.showNumpad = false
            }
        },
        startClick(action: string) {
            if (action === 'START') {
                this.toastMessage = 'Starting...'
            } else if (action === 'STOP') {
                this.toastMessage = 'Stopping...'
            }
            this.showToast = true
            setTimeout(() => {
                this.showToast = false
            }, 1000)
        },
        closeModal() {
            this.displayText = []
            this.pwdInput = ''
            this.showNumpad = true
            this.$emit('close')
        },
        getMaskedPwdInput() {
            return this.pwdInput.replace(/./g, 'X').split('').join(' ')
        }
    }
}
</script>

<style scoped>
.np-clear {
    background-color: red;
}

.np-del {
    background-color: blue;
}
</style>