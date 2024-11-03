import { internalMutation, QueryCtx , MutationCtx, mutation } from "./_generated/server";
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
            orgIds : [],
            saved : []
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


export const addOrgMember = internalMutation({
    args : {
        tokenIdentifier: v.string(),
        orgId : v.string(),
        role : v.string()
      },
      handler : async (ctx , args) => {

        const user = await getUserById(ctx, args.tokenIdentifier)

        if (user) {

            const data = ctx.db.patch(user._id , {
                orgIds : [...user.orgIds, {orgId : args.orgId , role : args.role }]
            })
        }
      }
})

export const updateOrgMember = internalMutation({
    args : {
        tokenIdentifier: v.string(),
        orgId : v.string(),
        role : v.string()
      },
      handler : async (ctx , args) => {

        const user = await getUserById(ctx, args.tokenIdentifier)

        if (user) {
          const orgIds = user.orgIds.map((org) => org.orgId == args.orgId ? {orgId : args.orgId , role : args.role} : org )
           
          const data = ctx.db.patch(user._id , {
                orgIds : orgIds
            })
        }
      }
})


export const deleteOrgMember = internalMutation({
    args : {
        tokenIdentifier: v.string(),
        orgId : v.string(),
      },
      handler : async (ctx , args) => {

        const user = await getUserById(ctx, args.tokenIdentifier)

        if (user) {
          const orgIds = user.orgIds.filter((org) => org.orgId !== args.orgId )
           
          const data = ctx.db.patch(user._id , {
                orgIds : orgIds
            })
        }
      }
})