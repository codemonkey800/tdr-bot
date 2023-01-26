import axios from 'axios'
import * as cheerio from 'cheerio'
import { EmbedBuilder, MessageCreateOptions } from 'discord.js'

interface CrumblCookieProduct {
  name: string
  image: string
  description: string
  calorieInformation: {
    perServing: string | null
  }
  allergyInformation: {
    description: string
  }
}

interface CrumblSSRData {
  props: {
    pageProps: {
      products: {
        cookies: CrumblCookieProduct[]
      }
    }
  }
}

async function getWeeklyCookies(): Promise<CrumblCookieProduct[]> {
  const response = await axios.get<string>('https://crumblcookies.com')
  const $ = cheerio.load(response.data)

  const data = JSON.parse(
    $('#__NEXT_DATA__').html() || 'null',
  ) as CrumblSSRData | null

  return data?.props.pageProps.products.cookies ?? []
}

type WeeklyCookiesMessage = Pick<MessageCreateOptions, 'content' | 'embeds'>

export async function getWeeklyCookiesMessage({
  showEmbeds,
}: {
  showEmbeds?: boolean
} = {}): Promise<WeeklyCookiesMessage> {
  const cookies = await getWeeklyCookies()

  const embeds = showEmbeds
    ? cookies.map((cookie) => {
        let embed = new EmbedBuilder()
          .setTitle(cookie.name)
          .setImage(cookie.image)
          .setDescription(cookie.description)

        if (cookie.calorieInformation.perServing !== null) {
          embed = embed.addFields({
            name: 'Calories',
            value: cookie.calorieInformation.perServing,
          })
        }

        if (cookie.allergyInformation.description) {
          embed = embed.addFields({
            name: 'Allergies',
            value: cookie.allergyInformation.description,
          })
        }

        return embed
      })
    : undefined

  const content = ['Weekly Crumbl Cookies']

  if (!showEmbeds) {
    for (const cookie of cookies) {
      content.push(`  - ${cookie.name}`)
    }
  }

  return {
    content: content.join('\n'),
    embeds,
  }
}
