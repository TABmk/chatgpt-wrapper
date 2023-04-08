[<img src="https://img.shields.io/npm/v/chatgpt-wrapper">](https://www.npmjs.com/package/chatgpt-wrapper) [<img src="https://img.shields.io/npm/l/chatgpt-wrapper">](https://github.com/TABmk/chatgpt-wrapper/blob/master/LICENSE) <img src="https://badgen.net/npm/types/chatgpt-wrapper">

<img src="https://badgen.net/npm/dt/chatgpt-wrapper">
<img src="https://badgen.net/npm/dm/chatgpt-wrapper">

__Help__ [<img src="https://img.shields.io/github/issues/tabmk/chatgpt-wrapper">](https://github.com/TABmk/chatgpt-wrapper/issues?q=is%3Aopen+is%3Aissue) [<img src="https://img.shields.io/github/issues-pr/tabmk/chatgpt-wrapper">](https://github.com/TABmk/chatgpt-wrapper/pulls?q=is%3Aopen+is%3Apr)

#### __Rate me__ [<img src="https://img.shields.io/github/stars/tabmk/chatgpt-wrapper?style=social">](https://github.com/TABmk/chatgpt-wrapper)

# __ChatGPT-wrapper__

### __[ChatGPT](https://openai.com/blog/chatgpt/) [API](https://platform.openai.com/docs/api-reference/chat) wrapper__

Official docs - https://platform.openai.com/docs/api-reference/chat
<p align="center">
<img width="50%" src="./imgs/1.jpeg">
<img width="50%" src="./imgs/2.jpeg">
<img width="50%" src="./imgs/3.jpeg">
</p>

## Features
- types included
- docs are included
- [Stream](https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream) included

## Install
`npm i chatgpt-wrapper` 

  or

`yarn add chatgpt-wrapper`

## Usage
### Import
#### CommonJS

`const { ChatGPT } = require('chatgpt-wrapper');`

#### Modules
`import { ChatGPT } from 'chatgpt-wrapper';`

with Types

`import { ChatGPT, Message, ReqBody, ResBody } from 'chatgpt-wrapper';`

### New instance


- **API_KEY** *(Required)*: Visit your [API Keys](https://platform.openai.com/account/api-keys) page to retrieve the API key

- **ORG** *(Optional)*: For users who belong to multiple organizations, you can specify which organization is used for an API request. Usage from these API requests will count against the specified organization's subscription quota. [Get Org ID here](https://platform.openai.com/account/org-settings).

- **URL** *(Optional)*: API endpoint. Default set to ['Create chat completion' method](https://platform.openai.com/docs/api-reference/chat/create).

- **MODEL** *(Optional)*: Model for requests, where not specified. Default is 'gpt-3.5-turbo'. [Models list](https://platform.openai.com/docs/models/model-endpoint-compatibility).

``` javascript
const chat = new ChatGPT({
  API_KEY: '...', // Your API KEY (Required)
  ORG: '...',     // Your organization (Optional)
  URL: '...',     // API endpoint (Optional)
  MODEL: '...',   // Custom default model (Optional)
});
```

### Error Handling

Don't forget to catch errors from your requests since OpenAI API sometimes returns an error message instead of response.

"[API error](https://github.com/TABmk/chatgpt-wrapper/blob/master/index.ts#L266)" errors returns [APIError](https://github.com/TABmk/chatgpt-wrapper/blob/master/index.ts#L195) type.

#### async/await
``` javascript
try {
  const answer = await chat.send('question');
  // ...
} catch (err) {
  // handle error
}
```

#### Promise
``` javascript
chat.send('question')
  .then((answer) => { /* ... */ })
  .catch((err) => { /* handle error */ });
```

## Methods

## .send(content, [fetchOptions])

`send(content: ReqBody | string, fetchOptions: RequestInit = {}): Promise<ResBody>`

- content - string or [ReqBody](#ReqBody)
- fetchOptions - [optional] [node-fetch options](https://www.npmjs.com/package/node-fetch#options)

Use this method to send a request to ChatGPT API

Raw string equals to
``` javascript
{
  model: 'gpt-3.5-turbo',
  messages: [{
    role: 'user',
    content: 'YOUR STRING',
  }],
}
```

⚠️ To use stream option, use .stream() method! ⚠️

Examples:
``` javascript
const answer = await chat.send('what is JavaScript');

console.log(answer.choices[0].message);
```
``` javascript
chat.send('what is JavaScript').then((answer) => {
  console.log(answer.choices[0].message);
});
```
``` javascript
const answer = await chat.send({
  model: 'gpt-3.5-turbo-0301',
  messages: [{
    role: 'user',
    content: 'what is JavaScript',
  }],
  max_tokens: 200,
});

console.log(answer.choices[0].message);
```

## .stream(content, [fetchOptions])

`stream(content: ReqBody | string, fetchOptions: RequestInit = {}): Promise<ResBody>`

- content - string or [ReqBody](#ReqBody)
- fetchOptions - [optional] [node-fetch options](https://www.npmjs.com/package/node-fetch#options)

Use this method to send a request to ChatGPT API and get steam response back

Raw string equals to
``` javascript
{
  model: 'gpt-3.5-turbo',
  stream: true,
  messages: [{
    role: 'user',
    content: 'YOUR STRING',
  }],
}
```

Examples:
``` javascript
(async () => {
  const answer = await chat.stream('what is JavaScript in 200 words');

  answer.pipe(process.stdout);
})();
```

## How to implement "stop" command
Since you can pass options to fetch, you can abort request with AbortController. [See fetch docs](https://www.npmjs.com/package/node-fetch#request-cancellation-with-abortsignal).

Example:
``` javascript
const controller = new AbortController();
const doStop = () => controller.abort();

// ...

const answer = await chat.stream('generate some long story', {
    signal: controller.signal,
});

answer.pipe(process.stdout);
```

Now, if you call doStop(), the controller will abort the request along with the stream.

## Types

### Message

Message in [chat format](https://platform.openai.com/docs/guides/chat/introduction)

Source: [index.ts#L4](https://github.com/TABmk/chatgpt-wrapper/blob/master/index.ts#L4)

### ReqBody

Request body

Source: [index.ts#L21](https://github.com/TABmk/chatgpt-wrapper/blob/master/index.ts#L21)

### ResBody

Response body

Source: [index.ts#L120](https://github.com/TABmk/chatgpt-wrapper/blob/master/index.ts#L120)

### APIError

OpenAI API error

Source: [index.ts#L195](https://github.com/TABmk/chatgpt-wrapper/blob/master/index.ts#L195)
