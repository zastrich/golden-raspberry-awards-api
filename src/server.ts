import 'dotenv/config'
import { buildApp } from './app.js'

const CSV_PATH = process.env.CSV_PATH ?? './data/movies.csv'
const PORT = Number(process.env.PORT ?? 3000)

buildApp(CSV_PATH).then((app) => {
  app
    .listen({ port: PORT, host: '0.0.0.0' })
    .then((addr) => app.log.info(`listening on ${addr}`))
    .catch((err) => {
      app.log.error(err)
      process.exit(1)
    })
})
