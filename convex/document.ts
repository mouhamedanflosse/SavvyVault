import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insertDocument = mutation({
    args : {text : v.string()},
    handler : async (ctx ,args) => {
       const newDoc = ctx.db.insert("docs", {text : args.text})
        return newDoc
    }
})
