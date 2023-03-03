import fs from 'fs'
import path from 'path'

export async function getFileContent(file) {
  try {
    const filesFolder = path.resolve('files', `${file}.har`)
    const data = await fs.promises.readFile(filesFolder, { encoding: 'utf8' })

    return JSON.parse(data)
  } catch (err) {
    console.log(err)
  }
}

export function createOutputFile(data) {
  try {
    const file = fs.createWriteStream('csp.txt', { encoding: 'utf8' })
    file.write(data)
    file.end()
  } catch (err) {
    console.log(err)
  }
}
