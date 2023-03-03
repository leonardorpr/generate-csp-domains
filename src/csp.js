import {
  getFileContent,
  createOutputFile,
  getDomain,
  formatDomains,
} from './utils.js'

function getResourceTypes(sourceType) {
  const sourceTypes = {
    default: 'default-src',
    script: 'script-src',
    font: 'font-src',
    image: 'img-src',
    stylesheet: 'style-src',
  }

  return sourceTypes[sourceType]
}

function isSelectedResourceTypes(sourceType) {
  const sourceTypes = ['stylesheet', 'script', 'font', 'image']

  return sourceTypes.includes(sourceType)
}

function createResourceType(previous, currentLog) {
  if (!isSelectedResourceTypes(currentLog._resourceType)) return

  const currentSourceType = getResourceTypes(currentLog._resourceType)
  const currentContent = getDomain(currentLog.request.url)

  const previousContent = previous[currentSourceType] ?? []

  return {
    [currentSourceType]: [...previousContent, currentContent],
  }
}

function createDefaultResourceType(previous, currentLog) {
  const defaultSourceType = getResourceTypes('default')
  const previousDefaultSourceType = previous[defaultSourceType] ?? []
  const currentContent = getDomain(currentLog.request.url)

  return {
    [defaultSourceType]: [...previousDefaultSourceType, currentContent],
  }
}

function mountResourceTypesObject(httpArchiveContent) {
  const sourceType = httpArchiveContent.log.entries.reduce(
    (previous, currentLog) => {
      const resourceType = createResourceType(previous, currentLog)
      const defaultResouceType = createDefaultResourceType(previous, currentLog)

      return {
        ...previous,
        ...resourceType,
        ...defaultResouceType,
      }
    },
    {},
  )

  return sourceType
}

function getContentSecurityPolicies(resourceTypesObject) {
  const contentSecurityPolicies = [
    {
      contentSecurity: 'default-src',
      sourceValue: `data: 'self' 'unsafe-inline'`,
      domains: formatDomains(resourceTypesObject['default-src']),
    },
    {
      contentSecurity: 'font-src',
      sourceValue: `'self'`,
      domains: formatDomains(resourceTypesObject['font-src']),
    },
    {
      contentSecurity: 'img-src',
      sourceValue: `'self'`,
      domains: formatDomains(resourceTypesObject['img-src']),
    },
    {
      contentSecurity: 'script-src',
      sourceValue: `'self' 'unsafe-eval' 'unsafe-inline'`,
      domains: formatDomains(resourceTypesObject['script-src']),
    },
    {
      contentSecurity: 'script-src-elem',
      sourceValue: `'self' 'unsafe-eval' 'unsafe-inline'`,
      domains: formatDomains(resourceTypesObject['script-src']),
    },
    {
      contentSecurity: 'style-src',
      sourceValue: `'self' 'unsafe-inline'`,
      domains: formatDomains(resourceTypesObject['style-src']),
    },
  ]

  return contentSecurityPolicies
}

async function createContentSecurityRules() {
  const httpArchiveContent = await getFileContent('source')
  const resourceTypes = mountResourceTypesObject(httpArchiveContent)
  const contentSecurityPolicies = getContentSecurityPolicies(resourceTypes)

  const csp = contentSecurityPolicies.map((currentCsp) => {
    return `${currentCsp.contentSecurity} ${currentCsp.domains} ${currentCsp.sourceValue}; `
  })

  return csp
}

export async function generateContentSecurityFile() {
  const contentSecurityRulesList = await createContentSecurityRules()
  const contentSecurityRules = contentSecurityRulesList.join('')
  const fileContent = `content-security-policy: ${contentSecurityRules}`

  createOutputFile(fileContent)
}
