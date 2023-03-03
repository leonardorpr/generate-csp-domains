import figlet from 'figlet'
import chalk from 'chalk'

function handleMessage(color, message) {
  const textColor = chalk.hex(color)

  return console.log(textColor(message))
}

export const message = {
  information: (message) => handleMessage('#C678DD', message),
  success: (message) => handleMessage('#98C379', message),
  error: (message) => handleMessage('#E06C75', message),
  default: (message) => console.log(message),
}

export function showBanner() {
  message.information(figlet.textSync('Domains to CSP'))
}
