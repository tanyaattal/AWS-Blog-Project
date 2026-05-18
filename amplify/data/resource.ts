import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  BlogResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  generateBlog: a
    .query()
    .arguments({
      notes: a.string().array(),
    })
    .returns(a.ref("BlogResponse"))
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        entry: "./bedrock.js",
        dataSource: "bedrockDS",
      })
    ),

  Post: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create", "read", "update", "delete"]),
    ]),
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