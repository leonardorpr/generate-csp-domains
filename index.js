import { generateContentSecurityFile } from './src/csp.js'
import { showBanner } from './src/bash.js'

showBanner()
generateContentSecurityFile()
