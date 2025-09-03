import fs from 'node:fs'
import chalk from 'chalk'
import { parse } from 'csv-parse/sync'
import { MovieCsvRow } from './types'

export function readCsvFile(path: string): MovieCsvRow[] {
  try {
    const raw = fs.readFileSync(path, 'utf8')

    const expectedColumns = ['year', 'title', 'studios', 'producers', 'winner']

    let rows: MovieCsvRow[]
    try {
      const parsedRows = parse(raw, {
        columns: (header: string[]) => {
          const lowercaseHeader = header.map((column) => column.toLowerCase())

          const missingColumns = expectedColumns.filter(
            (col) => !lowercaseHeader.includes(col),
          )

          if (missingColumns.length > 0) {
            console.log(
              chalk.bgRedBright('ERROR'),
              chalk.redBright('Missing required columns in CSV file:'),
              chalk.yellow(missingColumns.join(', ')),
              '\n',
              chalk.redBright(
                'The CSV file must contain the following columns:',
              ),
              chalk.yellow(expectedColumns.join(', ')),
            )
            throw new Error('Invalid CSV structure: missing required columns')
          }

          return lowercaseHeader
        },
        skip_empty_lines: true,
        trim: true,
        delimiter: ';',
      }) as MovieCsvRow[]

      rows = parsedRows
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          chalk.bgRedBright('ERROR'),
          chalk.redBright('Failed to parse CSV file:'),
          chalk.yellow(error.message),
        )
      }
      throw error
    }
    return rows
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log(
      chalk.bgRedBright('ERROR'),
      chalk.redBright(`Error reading CSV file: ${errorMessage}`),
    )
    throw error
  }
}
