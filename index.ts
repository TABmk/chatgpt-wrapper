import fetch from 'node-fetch';

/** Message in {@link https://platform.openai.com/docs/guides/chat/introduction chat format} */
export type Message = {
  /**
   * The system message helps set the behavior of the assistant. In the example above,
   * the assistant was instructed with “You are a helpful assistant.”
   *
   * The user messages help instruct the assistant. They can be generated
   * by the end users of an application, or set by a developer as an instruction.
   *
   * The assistant messages help store prior responses.
   * They can also be written by a developer to help give examples of desired behavior.
   */
  role: 'system' | 'user' | 'assistant',
  /** The content of the message */
  content: string,
};

/** Request body */
export type ReqBody = {
  /**
   * _Required_
   *
   * ID of the model to use. See the {@link https://platform.openai.com/docs/models/model-endpoint-compatibility model endpoint compatibility} table for details on which models work with the Chat API.
   */
  model: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301' | 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314',
  /**
   * _Required_
   *
   * The messages to generate chat completions for, in the {@link https://platform.openai.com/docs/guides/chat/introduction chat format}.
   */
  messages: Array<Message>,
  /**
   * _Optional. Defaults to 1_
   *
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the
   * output more random, while lower values like 0.2 will make it more focused and deterministic.
   *
   * We generally recommend altering this or `top_p` but not both.
   */
  temperature?: number,
  /**
   * _Optional. Defaults to 1_
   *
   * An alternative to sampling with temperature, called nucleus sampling, where the model
   * considers the results of the tokens with top_p probability mass. So 0.1 means only the
   * tokens comprising the top 10% probability mass are considered.
   *
   * We generally recommend altering this or temperature but not both.
   */
  top_p?: number,
  /**
   * _Optional. Defaults to 1_
   *
   * How many chat completion choices to generate for each input message.
   */
  n?: number,
  /**
   * _Optional. Defaults to false_
   *
   * If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format server-sent events} as they become available, with the stream terminated by a `data: [DONE]` message.
   */
  stream?: boolean,
  /**
   * _Optional. Defaults to null_
   *
   * Up to 4 sequences where the API will stop generating further tokens.
   */
  stop?: string | Array<string>,
  /**
   * _Optional. Defaults to inf_
   *
   * The maximum number of tokens allowed for the generated answer.
   * By default, the number of tokens the model can return will be (4096 - prompt tokens).
   */
  max_tokens?: number,
  /**
   * _Optional. Defaults to 0_
   *
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether
   * they appear in the text so far, increasing the model's likelihood to talk about new topics.
   *
   * {@link https://platform.openai.com/docs/api-reference/parameter-details See more information about frequency and presence penalties.}
   */
  presence_penalty?: number,
  /**
   * _Optional. Defaults to 0_
   *
   * Number between -2.0 and 2.0. Positive values penalize new tokens based
   * on their existing frequency in the text so far,
   * decreasing the model's likelihood to repeat the same line verbatim.
   *
   * {@link https://platform.openai.com/docs/api-reference/parameter-details See more information about frequency and presence penalties.}
   */
  frequency_penalty?: number,
  /**
   * _Optional. Defaults to null_
   *
   * Modify the likelihood of specified tokens appearing in the completion.
   *
   * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an
   * associated bias value from -100 to 100. Mathematically, the bias is added to the logits
   * generated by the model prior to sampling. The exact effect will vary per model, but values
   * between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100
   * should result in a ban or exclusive selection of the relevant token.
   */
  logit_bias?: {
    [key: string]: number
  },
  /**
   * _Optional_
   *
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. {@link https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids Learn more}.
   */
  user?: string,
};

/** Response body */
export type ResBody = {
  id: string,
  object: string,
  /** Unix timestamp */
  created: number,
  /**
   * ID of the used model. See the {@link https://platform.openai.com/docs/models/model-endpoint-compatibility model endpoint compatibility} table for details on which models work with the Chat API.
   */
  model: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301' | 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314',
  /** tokens usage, see also {@link https://platform.openai.com/docs/guides/chat/managing-tokens "Managing tokens"} */
  usage: {
    /**
     * Each message passed to the API consumes the number of tokens in the content, role, and other
     * fields, plus a few extra for behind-the-scenes formatting.
     * This may change slightly in the future.
     */
    prompt_tokens: number,
    /**
     * If a conversation has too many tokens to fit within a model’s maximum limit
     * (e.g., more than 4096 tokens for gpt-3.5-turbo), you will have to truncate, omit,
     * or otherwise shrink your text until it fits. Beware that if a message is removed
     * from the messages input, the model will lose all knowledge of it.
     *
     * Note too that very long conversations are more likely to receive incomplete replies.
     * For example, a gpt-3.5-turbo conversation that is 4090 tokens
     * long will have its reply cut off after just 6 tokens.
     */
    completion_tokens: number,
    /**
     * The total number of tokens in an API call affects: How much your API call costs, as you pay
     * per token How long your API call takes, as writing more tokens takes more time Whether your
     * API call works at all, as total tokens must be below the model’s maximum limit
     * (4096 tokens for gpt-3.5-turbo-0301)
     */
    total_tokens: number,
  },
  choices: Array<{
    /** Message index */
    index: number,
    /**
     * Every response will include a finish_reason. The possible values for finish_reason are:
     *
     * `stop`: API returned complete model output
     *
     * `length`: Incomplete model output due to {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-max_tokens max_tokens parameter} or token limit
     *
     * `content_filter`: Omitted content due to a flag from our content filters
     *
     * `null`: API response still in progress or incomplete
     */
    finish_reason: null | 'stop' | 'length' | 'content_filter',
    /**
     * Responce message, in the {@link https://platform.openai.com/docs/guides/chat/introduction chat format}.
     */
    message: Message
  }>
};

/**
 * An `APIError` indicates that something went wrong on our side when processing your request.
 * This could be due to a temporary error, a bug, or a system outage.
 * We apologize for any inconvenience and we are working hard to resolve any issues as soon
 * as possible.You can check our system status page for more information.
 *
 * If you encounter an APIError, please try the following steps:
 *
 * - Wait a few seconds and retry your request. Sometimes, the issue may be resolved quickly
 * and your request may succeed on the second attempt.
 * - Check our status page for any ongoing incidents or maintenance that may affect our services.
 * If there is an active incident, please follow the updates and wait until it is resolved
 * before retrying your request.
 * - If the issue persists, check out our Persistent errors next steps section.
 *
 * See https://platform.openai.com/docs/guides/error-codes/api-errors
 */
export type APIError = {
  error: {
    /** Error body */
    message?: string,
    /** See https://platform.openai.com/docs/guides/error-codes/python-library-error-types */
    type?: string,
    param?: any,
    /** See https://platform.openai.com/docs/guides/error-codes/error-codes */
    code: any,
  }
};

export class ChatGPT {
  API_KEY: string;

  ORG: string | undefined;

  URL: string;

  MODEL: ReqBody['model'];

  constructor({
    API_KEY,
    ORG,
    MODEL,
  }: {
    /**
     * The OpenAI API uses API keys for authentication.
     * Visit your {@link https://platform.openai.com/account/api-keys API Keys} page to retrieve the API key you'll use in your requests.
     *
     * __Remember that your API key is a secret!__
     */
    API_KEY: string,
    /**
     * For users who belong to multiple organizations, you can specify which organization
     * is used for an API request. Usage from these API requests will count against
     * the specified organization's subscription quota.
     */
    ORG?: string,
    /**
     * API endpoint. Default: `https://api.openai.com/v1/chat/completions`
     */
    URL?: string,
    /**
     * ID of the model to use. See the {@link https://platform.openai.com/docs/models/model-endpoint-compatibility model endpoint compatibility} table for details on which models work with the Chat API.
     */
    MODEL?: ReqBody['model'],
  }) {
    this.API_KEY = API_KEY;
    this.ORG = ORG;
    this.URL = 'https://api.openai.com/v1/chat/completions';
    this.MODEL = MODEL || 'gpt-3.5-turbo';
  }

  private async req(content: ReqBody | string, isStream: boolean = false) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.API_KEY}`,
    };

    if (this.ORG) {
      headers['OpenAI-Organization'] = this.ORG;
    }

    const finBody = typeof content === 'string' ? {
      model: this.MODEL,
      stream: isStream,
      messages: [{ role: 'user', content }],
    } : content;

    const req = await fetch(this.URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(finBody),
    });

    if (!req.ok) {
      const text = await req.json();

      throw new Error(`${text?.error?.message ? 'API' : 'Request'} error: ${text?.error?.message || req.statusText}`);
    }

    if (typeof finBody === 'object' && finBody.stream) {
      return req.body;
    }

    const text = await req.json();

    return text;
  }

  /**
   * ## .send(ReqBody | string)
   *
   * Use this method to send request to ChatGPT API
   *
   * Raw string equals to
   * ```
   * {
   *   model: 'gpt-3.5-turbo',
   *   messages: [{ role: 'user', content: 'STRING' }],
   * }
   * ```
   *
   * ⚠️ To use {@link ReqBody.stream stream}, use .stream() method! ⚠️
   *
   * @param {ReqBody | string} content request string or {@link ReqBody} object
   * @returns {Promise<ResBody>} Promise with a {@link ResBody} object
   */
  send(content: ReqBody | string): Promise<ResBody> {
    if (typeof content === 'object' && content.stream) {
      throw new Error('Use .steam method for stream!');
    }

    return this.req(content);
  }

  /**
   * ## .stream(ReqBody | string)
   *
   * Use this method to send request to ChatGPT API and get steam response back
   *
   * Example: `data.pipe(process.stdout)`;
   *
   * Raw string equals to
   * ```
   * {
   *   model: 'gpt-3.5-turbo',
   *   stream: true,
   *   messages: [{ role: 'user', content: 'STRING' }],
   * }
   * ```
   *
   * @param {ReqBody | string} content request string or {@link ReqBody} object
   * @returns {Promise<NodeJS.ReadableStream>} Promise with a {@link NodeJS.ReadableStream}
   */
  stream(content: ReqBody | string): Promise<NodeJS.ReadableStream> {
    return this.req(content, true);
  }
}
