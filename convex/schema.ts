import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    docs: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    fileId : v.id("_storage"),
    orgId : v.string()
  }).index("by_token", ["tokenIdentifier"]).index("by_orgId" , ["orgId"]),

  
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    image : v.string(),
    orgIds : v.array(v.string())
  }).index("by_token", ["tokenIdentifier"]),
});