# Domains to CSP

Get the domains used for your site and generate the CSP (Content Security Policy) header

## Install

1. Install the deps

```bash
yarn
# or
npm install
```

2. Run the code

```bash
yarn start
# or
npm run start
```

## Usage

1. First you'll need the `HAR (Http Archive Content)` file of your website.
2. Learn how to download file by following this tutorial. [Click here](https://support.google.com/admanager/answer/10358597?hl=en).
3. Put the `HAR file` into the root directory of project.
4. Rename `HAR file` to `source.har`
5. Run `yarn start`
6. Get your CSP config in `csp.txt`

## Refs

- [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP - Source Values](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources)
