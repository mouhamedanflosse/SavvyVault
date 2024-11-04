import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    docs: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    fileId : v.id("_storage"),
    orgId : v.optional(v.string()),
    type : v.string(),
    docUrl : v.string(),
    status : v.string(),
    schedulerId : v.union(v.id("_scheduled_functions") , v.null())
  }).index("by_token", ["tokenIdentifier", "orgId" , "status"]).index("by_orgId" , ["orgId" , "status"]),

  
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    image : v.string(),
    orgIds : v.array(v.object({orgId : v.string() , role : v.string()})),
    saved : v.array(v.string()),
  }).index("by_token", ["tokenIdentifier"]),
});