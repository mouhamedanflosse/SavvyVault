import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    docs: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    fileId : v.string()
  }).index("by_token", ["tokenIdentifier"]),

  
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});