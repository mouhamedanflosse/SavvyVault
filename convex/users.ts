import { internalMutation, QueryCtx , MutationCtx } from "./_generated/server";
import {ConvexError, v} from 'convex/values'

export const insertUser = internalMutation({
    args : {
        name: v.string(),
        tokenIdentifier: v.string(),
        image : v.string(),
        orgIds : v.array(v.string())
      },
      handler : async (ctx , args) => {
        ctx.db.insert('users' , {
            name : args.name,
            image : args.image,
            tokenIdentifier : args.tokenIdentifier,
            orgIds : args.orgIds
        })
      }
})


export const getUserById = async (ctx : QueryCtx | MutationCtx , tokenIdentifier : string) => {
    const user = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
    .first();

    if (!user) {
    throw new ConvexError("the user must be defined")
    }

    return user
}


export const addOrgId = internalMutation({
    args : {
        tokenIdentifier: v.string(),
        orgIds : v.array(v.string())
      },
      handler : async (ctx , args) => {

        const user = await getUserById(ctx, args.tokenIdentifier)

        if (user) {

            const data = ctx.db.patch(user._id , {
                orgIds : [...user.orgIds, ...args.orgIds]
            })
        }
      }
})