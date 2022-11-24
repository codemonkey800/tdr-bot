import axios from 'axios'
import * as cheerio from 'cheerio'
import zlib from 'zlib'

import { Quote } from './types'

export enum EnabledZenKeywords {
  Anxiety = 'anxiety',
  Fear = 'fear',
  Life = 'life',
  Love = 'love',
  Pain = 'pain',
  Past = 'past',
}

function decompressResponse(data: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) =>
    // eslint-disable-next-line no-promise-executor-return
    zlib.gunzip(data, (err, output) => {
      if (err) {
        reject(err)
      } else {
        resolve(output.toString())
      }
    }),
  )
}

export async function getQuotesByKeyword(keyword: string): Promise<Quote[]> {
  let html = ''

  try {
    const quotesResponse = await axios.get(
      `https://zenquotes.io/keywords/${keyword}`,
      {
        responseType: 'arraybuffer',
      },
    )

    html = await decompressResponse(quotesResponse.data as ArrayBuffer)
  } catch (_) {
    const quotesResponse = await axios.get(
      `https://zenquotes.io/keywords/${keyword}`,
    )

    html = quotesResponse.data as string
  }

  const $ = cheerio.load(html)

  return $('.blockquote')
    .toArray()
    .map((node) => {
      const [quote, author] = $(node).text().split(' — ')
      return {
        quote: quote.slice(1, quote.length - 1).trim(),
        author,
      }
    })
}
