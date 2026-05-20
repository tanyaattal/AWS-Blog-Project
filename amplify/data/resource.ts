import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  BlogResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  generateBlog: a.generation({
      aiModel: a.ai.model("Claude Sonnet 4.5"),
      systemPrompt: "You are a helpful assistant that generates a blog post based on the user's notes. The user will provide you with a list of notes, and you will use those notes to create a well-structured and engaging blog post. Make sure to cover all the key points mentioned in the notes and organize the content in a logical manner. The blog post should be informative, easy to read, and should provide value to the readers. And follow the specific user instructions for tone and style.",
    })
    .arguments({
      notes: a.string().array(),
      instruction: a.string(),
    })
    .returns(a.ref("BlogResponse"))
    .authorization((allow) => [allow.publicApiKey()])
    ,

  Post: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});