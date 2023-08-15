import { GoogleSearch, SearchParams } from 'google-search-results-nodejs'
import _ from 'lodash'

export function env(key: string): string {
  const value = process.env[key]

  if (!value) {
    const message = `${key} not defined`
    console.error(message)
    throw new Error(message)
  }

  return value
}

export function getAPIToken(): string {
  const key = 'DISCORD_API_TOKEN'
  return env(key)
}

export function getClientID(): string {
  const key = 'DISCORD_CLIENT_ID'
  return env(key)
}

export async function getSearchKnowledgeGraph(query: string) {
  const search = new GoogleSearch(process.env.SERPAPI_API_KEY)
  const searchParams: SearchParams = {
    q: query,
    location: 'Stockton, California, United States',
    hl: 'en',
    gl: 'us',
    google_domain: 'google.com',
  }

  const queryRes = (await new Promise((resolve) =>
    search.json(searchParams, resolve),
  )) as any

  const knowledgeGraph = queryRes.knowledge_graph
  const stack = Object.keys(knowledgeGraph).map((key) => [key, knowledgeGraph])
  while (stack.length > 0) {
    const [key, node] = stack.pop() ?? []

    if (key) {
      if (key.endsWith('link') || key.endsWith('links')) {
        delete node[key]
        continue
      }

      if (_.isObject(node[key]) && !_.isFunction(node[key])) {
        stack.push(
          ...Object.keys(node[key]).map((nextKey) => [nextKey, node[key]]),
        )
      }
    }
  }

  return knowledgeGraph
}
