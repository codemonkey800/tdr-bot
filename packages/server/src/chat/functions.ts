import { OpenAI } from 'openai'

const SEARCH_FUNCTION: OpenAI.FunctionDefinition = {
  name: 'search',
  description: 'Requests search results from Google Search API',

  parameters: {
    required: ['query'],
    type: 'object',

    properties: {
      query: {
        description: 'Query string to pass to Google search API',
        type: 'string',
      },
    },
  },
}

export const CHAT_FUNCTIONS = [SEARCH_FUNCTION]
