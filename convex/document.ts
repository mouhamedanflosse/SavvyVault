import { Doc, Id, TableNames } from "./_generated/dataModel";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getUserById } from "./users";
// import OpenAI from "openai";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// init openai client
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// get user
const getUser = async (ctx: QueryCtx | MutationCtx, id: string) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", id))
    .first();

  return user;
};

// access verification
const hasAccessTOrg = async (
  ctx: QueryCtx | MutationCtx,
  orgId: string | undefined,
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const user = await getUser(ctx, identity.subject);

  if (!user) {
    return null;
  }

  const hasAccess = user.orgIds.some((item) => item === orgId);
  if (!hasAccess) {
    return null;
  }
  return user;
};

export const insertDocument = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.optional(v.string()),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    console.log("SB vs TN", identity.subject, identity.tokenIdentifier);
    const user = await getUser(ctx, identity.subject);

    const docUrl = (await ctx.storage.getUrl(args.fileId)) as string;

    if (!user) {
      throw new ConvexError("user should be defind");
    }

    const newDoc = await ctx.db.insert("docs", {
      name: args.name,
      tokenIdentifier: user.tokenIdentifier,
      fileId: args.fileId,
      orgId: args.orgId,
      type: args.type,
      docUrl,
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
  args: { orgId: v.optional(v.string()), query: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("getDocuments started");
    const user = (await ctx.auth.getUserIdentity())?.subject;
    if (!user) {
      return [];
    }

    // for oraganizations docs
    if (args.orgId) {
      console.log("for oraganizations");
      const hasAccess = await hasAccessTOrg(ctx, args.orgId);
      if (hasAccess) {
        const docs = await ctx.db
          .query("docs")
          .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
          .collect();
        const query = args.query;
        if (query) {
          const documents = docs.filter((doc) =>
            doc.name.toLowerCase().includes(query.toLowerCase()),
          );
          return documents;
        }
        return docs;
      }
      return [];
    }

    // for users docs
    const docs = await ctx.db
      .query("docs")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", user).eq("orgId", undefined),
      )
      .collect();

    const query = args.query;
    if (query) {
      const documents = docs.filter((doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase()),
      );
      return documents;
    }

    return docs;
  },
});

export const getDocument = query({
  args: {
    docId: v.id("docs"),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;

    if (!userId) {
      return null;
    }

    // for oraganizations docs
    if (args.orgId) {
      console.log("for oraganizations");
      const hasAccess = await hasAccessTOrg(ctx, args.orgId);
      if (hasAccess) {
        // const doc = await ctx.db.get(args.docId);
        const doc = await ctx.db
          .query("docs")
          .withIndex("by_id", (q) => q.eq("_id", args.docId))
          .first();
        if (!doc || doc.orgId === undefined) {
          return null;
        }
        return { ...doc, docURL: await ctx.storage.getUrl(doc.fileId) };
      }
    }
    // for users docs
    // const doc = await ctx.db.get(args.docId);
    const doc = await ctx.db
      .query("docs")
      .withIndex("by_id", (q) => q.eq("_id", args.docId))
      .first();
    console.log(doc);
    if (!doc || doc?.tokenIdentifier !== userId || doc.orgId !== undefined) {
      return null;
    }

    return { ...doc, docURL: await ctx.storage.getUrl(doc.fileId) };
  },
});

export const deleteDocument = mutation({
  args: { docId: v.id("docs"), orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError(
        "yo must be loged in before proceeding to this action",
      );
    }

    const doc = await ctx.db.get(args.docId);

    if (!doc) {
      throw new ConvexError("the document must be defined");
    }

    const hasAccess = await hasAccessTOrg(ctx, args.orgId);

    // for an orgnization member
    if (hasAccess) {
      console.log("hasAccess", args, doc);
      const deletedDocument = await ctx.db.delete(args.docId);
      const deletedFile = await ctx.storage.delete(doc.fileId);
      return deletedDocument;
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      console.log("user", args, doc);
      const deletedDocument = await ctx.db.delete(args.docId);
      return deletedDocument;
    }

    throw new ConvexError(
      "you don't have the required permissions to perform this action",
    );
  },
});
export const editDocument = mutation({
  args: {
    docId: v.id("docs"),
    orgId: v.optional(v.string()),
    documentInfo: v.object({
      name: v.string(),
      fileId: v.optional(v.id("_storage")),
      type: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError(
        "yo must be loged in before proceeding to this action",
      );
    }

    const doc = await ctx.db.get(args.docId);

    const fileId = doc?.fileId as Id<"_storage">;

    const docUrl = (await ctx.storage.getUrl(
      args.documentInfo.fileId ? args.documentInfo.fileId : fileId,
    )) as string;

    if (!doc) {
      throw new ConvexError("the document must be defined");
    }

    const hasAccess = await hasAccessTOrg(ctx, args.orgId);

    console.log("data :", args.docId, {
      name: args.documentInfo.name,
      fileId: args.documentInfo.fileId ? fileId : args.documentInfo.fileId,
      type: args.documentInfo.type,
      docUrl,
    });

    // for an orgnization member
    if (hasAccess) {
      const deletedDocument = await ctx.db.patch(args.docId, {
        name: args.documentInfo.name,
        fileId: args.documentInfo.fileId ? args.documentInfo.fileId : fileId,
        type: args.documentInfo.type,
        docUrl,
      });
      if (args.documentInfo.fileId) {
        const deletedFile = await ctx.storage.delete(doc.fileId);
      }

      return deletedDocument;
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      console.log("user", args, doc);
      const deletedDocument = await ctx.db.patch(args.docId, {
        name: args.documentInfo.name,
        fileId: args.documentInfo.fileId,
        type: args.documentInfo.type,
        docUrl,
      });
      const deletedFile = await ctx.storage.delete(doc.fileId);
      return deletedDocument;
    }

    throw new ConvexError(
      "you don't have the required permissions to perform this action",
    );
  },
});

export const saveDocToUser = mutation({
  args: { docId: v.id("docs"), orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError(
        "yo must be loged in before proceeding to this action",
      );
    }

    const doc = await ctx.db.get(args.docId);

    if (!doc) {
      throw new ConvexError("the document must be defined");
    }

    const user = await getUserById(ctx, identity.subject);

    const hasAccess = await hasAccessTOrg(ctx, args.docId);

    // for an orgnization member
    if (hasAccess) {
      const saveDocTouser = ctx.db.patch(user?._id, {
        saved: [...user.saved, args.docId],
      });
      return saveDocTouser;
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      const saveDocTouser = ctx.db.patch(user?._id, {
        saved: [...user.saved, args.docId],
      });
      return saveDocTouser;
    }

    throw new ConvexError(
      "you don't have the required permissions to perform this action",
    );
  },
});




export const getsavedDocuments = query({
  args: { query: v.optional(v.string()) , orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("getDocuments started");
    const user = (await ctx.auth.getUserIdentity())?.subject;
    if (!user) {
      return [];
    }

    const userSavedDoc = await getUserById(ctx, user)

    // for oraganizations docs
    if (args.orgId) {
      console.log("for oraganizations");
      const hasAccess = await hasAccessTOrg(ctx, args.orgId);
      if (hasAccess) {
        const docs = await ctx.db
          .query("docs")
          .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
          .collect();
        const query = args.query;
        if (query) {
          const documents = docs.filter((doc) =>
            doc.name.toLowerCase().includes(query.toLowerCase()),
          );
          const savedDocs = documents.filter((doc) =>
          userSavedDoc.saved.some((savedId) => savedId == doc._id)
          );
          return savedDocs;
        }
        const savedDocs = docs.filter((doc) =>
          userSavedDoc.saved.some((savedId) => savedId == doc._id)
          );
        return savedDocs;
      }
      return [];
    }

    // for users docs
    const docs = await ctx.db
      .query("docs")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", user).eq("orgId", undefined),
      )
      .collect();

    const query = args.query;
    if (query) {
      const documents = docs.filter((doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase()),
      );

      const savedDocuments = documents.filter((doc) => 
      userSavedDoc.saved.some((savedId) => savedId == doc._id )
      )

      return savedDocuments;
    }
    
    const savedDocs = docs.filter((doc) =>
      userSavedDoc.saved.some((savedId) => savedId == doc._id)
      );
    return savedDocs;

  },
});
