import { getFileContent, createOutputFile } from './utils.js'

function getUrlsOfHttpArchive(httpArchiveContent) {
  const urls = httpArchiveContent.log.entries.map(
    (content) => content.request.url,
  )

  return urls
}

function getOnlyDomainsOfUrl(httpArchiveContent) {
  const urls = getUrlsOfHttpArchive(httpArchiveContent)
  const allDomains = urls.map((url) => {
    const currentUrl = new URL(url)
    const domain = currentUrl.hostname

    return `https://${domain}`
  })
  const domains = [...new Set(allDomains)].join(' ')

  return domains
}

async function setContentSecurity(contentSecurityProp, sourceValue) {
  const httpArchiveContent = await getFileContent(contentSecurityProp)
  const domainsOfContentSecurity = getOnlyDomainsOfUrl(httpArchiveContent)
  const contentSecurity = `${contentSecurityProp} ${domainsOfContentSecurity} ${sourceValue}; `

  return contentSecurity
}

async function createContentSecurityRules() {
  const contentSecurityPolicies = [
    {
      contentSecurity: 'default-src',
      sourceValue: `data: 'self' 'unsafe-inline'`,
    },
    { contentSecurity: 'font-src', sourceValue: `'self''` },
    { contentSecurity: 'img-src', sourceValue: `'self'` },
    {
      contentSecurity: 'script-src',
      sourceValue: `'self' 'unsafe-eval' 'unsafe-inline'`,
    },
    {
      contentSecurity: 'script-src-elem',
      sourceValue: `'self' 'unsafe-eval' 'unsafe-inline'`,
    },
    { contentSecurity: 'style-src', sourceValue: `'self'` },
  ]

  const csp = Promise.all(
    contentSecurityPolicies.map((currentCsp) =>
      setContentSecurity(currentCsp.contentSecurity, currentCsp.sourceValue),
    ),
  )

  return csp
}

export async function generateContentSecurityFile() {
  const contentSecurityRulesList = await createContentSecurityRules()
  const contentSecurityRules = contentSecurityRulesList.join('')
  const fileContent = `content-security-policy: ${contentSecurityRules}`

  createOutputFile(fileContent)
}
