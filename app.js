require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req
  })
}

const handleLinkResolver = (doc) => {
  // Define the url depending on the document type
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid;
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid;
  // }

  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  res.render('pages/home')
})

app.get('/about', async (req, res) => {
  initApi(req).then((api) => {
    console.log('API => ', api)
    api.query(Prismic.Predicates.any('document.type', ['about', 'metadata'])).then((response) => {
      const { results } = response
      const [about, meta] = results

      res.render('pages/about', {
        about,
        meta
      })
    })
  })
})

app.get('/collection', (req, res) => {
  res.render('pages/collection')
})

app.get('/detail/:uid', async (req, res) => {
  res.render('pages/detail')
})

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`)
})

