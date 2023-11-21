declare const bridge: {
  play(): void
  stop(): void
  quit(): void
}

const playButton = document.getElementById('play')
const stopButton = document.getElementById('stop')
const quitButton = document.getElementById('quit')

playButton.addEventListener('click', () => bridge.play())
stopButton.addEventListener('click', () => bridge.stop())
quitButton.addEventListener('click', () => bridge.quit())
