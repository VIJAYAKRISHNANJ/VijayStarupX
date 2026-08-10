import { spawn } from 'child_process'

const isWin = process.platform === 'win32'
const nodeBin = process.argv[0]

const viteArgs = ['./node_modules/vite/bin/vite.js']
const serverArgs = ['server/index.js']

console.log('🐆 Starting VijayX StartupWin (Frontend + Backend)...\n')

const frontend = spawn(nodeBin, viteArgs, {
  stdio: 'inherit',
  shell: isWin,
  env: { ...process.env },
})

const backend = spawn(nodeBin, serverArgs, {
  stdio: 'inherit',
  shell: isWin,
  env: { ...process.env },
})

const cleanup = (signal) => {
  console.log(`\n${signal} received — shutting down...`)
  frontend.kill(signal)
  backend.kill(signal)
  process.exit(0)
}

process.on('SIGINT', () => cleanup('SIGINT'))
process.on('SIGTERM', () => cleanup('SIGTERM'))

frontend.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`Frontend exited with code ${code}`)
    backend.kill('SIGTERM')
    process.exit(code)
  }
})

backend.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`Backend exited with code ${code}`)
    frontend.kill('SIGTERM')
    process.exit(code)
  }
})
