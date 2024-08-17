import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const insertDocument = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!user) {
      throw new ConvexError("Not authenticated");
    }
    const newDoc = await ctx.db.insert("docs", {
      name: args.text,
      tokenIdentifier: user || "test",
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
