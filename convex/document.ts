import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";


export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const insertDocument = mutation({
  args: { name: v.string() , fileId : v.string()},
  handler: async (ctx, args) => {
    const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!user) {
      throw new ConvexError("Not authenticated");
    }
    const newDoc = await ctx.db.insert("docs", {
      name: args.name,
      tokenIdentifier: user || "test",
      fileId : args.fileId
    });
    return newDoc;
  },
});

export const getDocuments = query({
  args: {},
  handler: async (ctx, args) => {
    const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!user) {
        return []
    }
    const newDoc = await ctx.db
      .query("docs")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier",user )).collect();
    return newDoc;
  },
});

export const getDocument = query({
  args: {
    docId : v.id("docs")
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
        return null
    }

    const doc = await ctx.db.get(args.docId)

    if (!doc || doc?.tokenIdentifier !== userId ) {
      return null
    }
    return doc;
  },
});
