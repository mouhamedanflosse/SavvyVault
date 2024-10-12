import {
  action,
  mutation,
  query,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";
import { getUserById } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// init openai client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// access verification
const hasAccessTOrg = async (ctx: QueryCtx | MutationCtx, orgId: string) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.orgIds.some((item) => item === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (hasAccess) {
    return null;
  }
  return user;
};

export const insertDocument = mutation({
  args: { name: v.string(), fileId: v.id("_storage"), orgId: v.string() },
  handler: async (ctx, args) => {
    const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!user) {
      throw new ConvexError("Not authenticated");
    }
    const newDoc = await ctx.db.insert("docs", {
      name: args.name,
      tokenIdentifier: user || "test",
      fileId: args.fileId,
      orgId: args.orgId,
    });
    return newDoc;
  },
});

// ask questions
// export const askQuestion = action({
//   args: {
//     question: v.string(),
//     docId: v.id("docs"),
//   },
//   handler: async (ctx, args) => {
//     const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
//     if (!user) {
//       throw new ConvexError("Not authenticated");
//     }

//     const doc = await ctx.runQuery(api.document.getDocument, {
//       docId: args.docId,
//     });

//     if (!doc) {
//       throw new ConvexError("Document not found");
//     }

//     console.log(doc);

//     const chatCompletion: OpenAI.Chat.ChatCompletion =
//       await client.chat.completions.create({
//         messages: [{ role: "user", content: "Say this is a test" }],
//         model: "gpt-3.5-turbo",
//       });

//     console.log(chatCompletion);

//     return chatCompletion;
//   },
// });

export const getDocuments = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    const hasAccess = await hasAccessTOrg(ctx, args.orgId);
    if (!user) {
      return [];
    }
    const newDoc = await ctx.db
      .query("docs")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", user))
      .collect();
    return newDoc;
  },
});

export const getDocument = query({
  args: {
    docId: v.id("docs"),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const doc = await ctx.db.get(args.docId);

    if (!doc || doc?.tokenIdentifier !== userId) {
      return null;
    }
    return { ...doc, docURL: await ctx.storage.getUrl(doc.fileId) };
  },
});
