/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleSearch, SearchParams } from 'google-search-results-nodejs'

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  async getSearchResultSnippets(query: string): Promise<string> {
    const serpApiKey: string = this.config.get('SERP_API_KEY')

    const search = new GoogleSearch(serpApiKey)
    const searchParams: SearchParams = {
      q: query,
      location: 'Stockton, California, United States',
      hl: 'en',
      gl: 'us',
      google_domain: 'google.com',
    }

    const res = (await new Promise((resolve) =>
      search.json(searchParams, resolve),
    )) as any

    const answerBox = res.answer_box_list
      ? res.answer_box_list[0]
      : res.answer_box

    if (answerBox) {
      if (answerBox.result) {
        return answerBox.result
      }
      if (answerBox.answer) {
        return answerBox.answer
      }
      if (answerBox.snippet) {
        return answerBox.snippet
      }
      if (answerBox.snippet_highlighted_words) {
        return answerBox.snippet_highlighted_words.toString()
      }
      const answer: { [key: string]: string } = {}
      Object.keys(answerBox)
        .filter(
          (k) =>
            !Array.isArray(answerBox[k]) &&
            typeof answerBox[k] !== 'object' &&
            !(
              typeof answerBox[k] === 'string' &&
              answerBox[k].startsWith('http')
            ),
        )
        .forEach((k) => {
          answer[k] = answerBox[k]
        })
      return JSON.stringify(answer)
    }

    if (res.events_results) {
      return JSON.stringify(res.events_results)
    }

    if (res.sports_results) {
      return JSON.stringify(res.sports_results)
    }

    if (res.top_stories) {
      return JSON.stringify(res.top_stories)
    }

    if (res.news_results) {
      return JSON.stringify(res.news_results)
    }

    if (res.jobs_results?.jobs) {
      return JSON.stringify(res.jobs_results.jobs)
    }

    if (res.questions_and_answers) {
      return JSON.stringify(res.questions_and_answers)
    }

    if (res.popular_destinations?.destinations) {
      return JSON.stringify(res.popular_destinations.destinations)
    }

    if (res.top_sights?.sights) {
      const sights: Array<{ [key: string]: string }> = res.top_sights.sights
        .map((s: { [key: string]: string }) => ({
          title: s.title,
          description: s.description,
          price: s.price,
        }))
        .slice(0, 8)
      return JSON.stringify(sights)
    }

    if (res.shopping_results && res.shopping_results[0]?.title) {
      return JSON.stringify(res.shopping_results.slice(0, 3))
    }

    if (res.images_results && res.images_results[0]?.thumbnail) {
      return res.images_results
        .map((ir: { thumbnail: string }) => ir.thumbnail)
        .slice(0, 10)
        .toString()
    }

    const snippets: string[] = []

    if (res.knowledge_graph) {
      if (res.knowledge_graph.description) {
        snippets.push(res.knowledge_graph.description)
      }

      const title = res.knowledge_graph.title || ''
      Object.keys(res.knowledge_graph)
        .filter(
          (k) =>
            typeof res.knowledge_graph[k] === 'string' &&
            k !== 'title' &&
            k !== 'description' &&
            !k.endsWith('_stick') &&
            !k.endsWith('_link') &&
            !k.startsWith('http'),
        )
        .forEach((k) =>
          snippets.push(`${title} ${k}: ${res.knowledge_graph[k]}`),
        )
    }

    const firstOrganicResult = res.organic_results?.[0]
    if (firstOrganicResult) {
      if (firstOrganicResult.snippet) {
        snippets.push(firstOrganicResult.snippet)
      } else if (firstOrganicResult.snippet_highlighted_words) {
        snippets.push(firstOrganicResult.snippet_highlighted_words)
      } else if (firstOrganicResult.rich_snippet) {
        snippets.push(firstOrganicResult.rich_snippet)
      } else if (firstOrganicResult.rich_snippet_table) {
        snippets.push(firstOrganicResult.rich_snippet_table)
      } else if (firstOrganicResult.link) {
        snippets.push(firstOrganicResult.link)
      }
    }

    if (res.buying_guide) {
      snippets.push(res.buying_guide)
    }

    if (res.local_results?.places) {
      snippets.push(res.local_results.places)
    }

    return JSON.stringify(snippets)
  }
}
