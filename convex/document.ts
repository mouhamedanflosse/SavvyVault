import { Doc, Id, TableNames } from "./_generated/dataModel";
import {
  mutation,
  query,
  QueryCtx,
  MutationCtx,
  internalMutation,
  action,
} from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getUserById } from "./users";
import { api, internal } from "./_generated/api";
// import OpenAI from "openai";
import Groq from "groq-sdk";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// init Ai module client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  console.log("user exist check ✅");

  const hasAccess = user.orgIds.some((item) => item.orgId === orgId);
  console.log("has access to the org....", hasAccess, user.orgIds, orgId);
  if (!hasAccess) {
    return null;
  }
  console.log("has access to the org check ✅");
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
      status: "active",
      schedulerId: null,
      completedTime: null,
      scheduledTime: null,
      author: user.name,
      author_img: user.image,
    });
    return newDoc;
  },
});

// ask questions
export const askQuestion = action({
  args: {
    question: v.string(),
    docId: v.id("docs"),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = (await ctx.auth.getUserIdentity())?.subject;

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    console.log("docID", args.docId);
    const doc = await ctx.runQuery(api.document.getDocument, {
      docId: args.docId,
      orgId: args.orgId,
    });

    console.log("doc", doc);

    if (!doc) {
      throw new ConvexError("Document not found");
    }

    const file = (await ctx.storage.get(doc.fileId)) as any;

    const text = await file.text();

    const CHUNK_SIZE = 4000;
    const CHUNK_OVERLAP = 200;

    // Split text into overlapping chunks
    const chunks = [];
    let currentIndex = 0;

    while (currentIndex < 5) {
      const chunk = text.slice(
        Math.max(0, currentIndex),
        Math.min(currentIndex + CHUNK_SIZE, text.length),
      );
      chunks.push(chunk);
      currentIndex += 1;
    }

    // Construct prompt with context
    const systemPrompt = `You are a helpful AI assistant. Use the following context to answer the question. 
If you cannot find the answer in the context, say "I cannot find the answer in the provided document."`;

    const responses = await Promise.all(
      chunks.map(async (chunk, index) => {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `${systemPrompt}\n\nContext (part ${index + 1}/${chunks.length}):\n${chunk}`,
            },
            {
              role: "user",
              content: args.question,
            },
          ],
          model: "gemma2-9b-it",
          temperature: 1,
          max_tokens: 2000,
          top_p: 0.95,
          stream: false,
          stop: null,
        });

        return chatCompletion.choices[0]?.message?.content || "";
      }),
    );

    // Combine responses intelligently
    const combinedResponse = responses.join("\n\n");

    const formatedResponse = await  groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `can you summarize this paragraph `,
            },
            {
              role: "user",
              content: `here is the paragraph :${combinedResponse}`,
            },
          ],
          model: "gemma2-9b-it",
          temperature: 1,
          max_tokens: 2000,
          top_p: 0.95,
          stream: false,
          stop: null,
        }).then((chatCompletion) => chatCompletion.choices[0]?.message?.content || "");

    console.log(formatedResponse)

    return {
      answer: formatedResponse,
      status: "success",
    };

    // // Handle large file content
    // const MAX_TEXT_LENGTH = 8000;
    // const truncatedText =
    //   text.length > MAX_TEXT_LENGTH
    //     ? text.substring(0, MAX_TEXT_LENGTH) + "..."
    //     : text;

    // console.log("File content length:", text.length);

    // const chatCompletion = await groq.chat.completions.create({
    //   messages: [
    //     { role: "user", content: `answer that question: ${args.question}` },
    //     {
    //       role: "system",
    //       content: `here is the file : ${text}`,
    //     },
    //   ],
    //   model: "gemma-7b-it",
    //   temperature: 1,
    //   max_tokens: 8000,
    //   top_p: 1,
    //   stream: false,
    //   stop: null,
    // });

    // const chatCompletion: OpenAI.Chat.ChatCompletion =
    //   await client.chat.completions.create({
    //     messages: [{ role: "user", content: "Say this is a test" }],
    //     model: "gpt-3.5-turbo",
    //   });

    // console.log(chatCompletion);

    // return chatCompletion;
  },
});

export const getDocuments = query({
  args: { orgId: v.optional(v.string()), query: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("getDocuments started");
    const user = (await ctx.auth.getUserIdentity())?.subject;
    if (!user) {
      return { docs: [], user: null };
    }

    // for oraganizations docs
    if (args.orgId) {
      console.log("for oraganizations");
      const hasAccess = await hasAccessTOrg(ctx, args.orgId);
      if (hasAccess) {
        const docs = await ctx.db
          .query("docs")
          .withIndex("by_orgId", (q) =>
            q.eq("orgId", args.orgId).eq("status", "active"),
          )
          .collect();
        const query = args.query;
        if (query) {
          const documents = docs.filter((doc) =>
            doc.name.toLowerCase().includes(query.toLowerCase()),
          );
          return { docs: documents, user: hasAccess };
        }
        return { docs, user: hasAccess };
      }
      return { docs: [], user: null };
    }

    // for users docs
    const docs = await ctx.db
      .query("docs")
      .withIndex("by_token", (q) =>
        q
          .eq("tokenIdentifier", user)
          .eq("orgId", undefined)
          .eq("status", "active"),
      )
      .collect();

    const userdata = await getUser(ctx, user);

    const query = args.query;
    if (query) {
      const documents = docs.filter((doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase()),
      );
      return { docs: documents, user: userdata };
    }
    return { docs, user: userdata };
  },
});

export const getDocument = query({
  args: {
    docId: v.id("docs"),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    const user_ = await ctx.auth.getUserIdentity();
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
      const deletedDocument = await ctx.db.delete(args.docId);
      const deletedFile = await ctx.storage.delete(doc.fileId);
      if (doc.schedulerId) {
        const processDeletion = await ctx.scheduler.cancel(doc.schedulerId);
      }
      return deletedDocument;
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      const deletedDocument = await ctx.db.delete(args.docId);
      const deletedFile = await ctx.storage.delete(doc.fileId);
      if (doc.schedulerId) {
        const processDeletion = await ctx.scheduler.cancel(doc.schedulerId);
      }
      return deletedDocument;
    }

    throw new ConvexError(
      "you don't have the required permissions to perform this action",
    );
  },
});

export const moveToTrash = mutation({
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
      // const deletedDocument = await ctx.db.delete(args.docId);
      // const deletedFile = await ctx.storage.delete(doc.fileId);
      const schedulerId = (await ctx.scheduler.runAfter(
        3600000,
        internal.document.deletedDocument,
        { docId: args.docId, fileId: doc.fileId },
      )) as Id<"_scheduled_functions">;
      const schedulerdoc = await ctx.db.system.get(schedulerId);
      const markAsdeleteed = await ctx.db.patch(args.docId, {
        status: "deleted",
        schedulerId,
        completedTime: schedulerdoc?.completedTime,
        scheduledTime: schedulerdoc?.scheduledTime,
      });
      return markAsdeleteed;
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      console.log("user", args, doc);
      // const deletedDocument = await ctx.db.delete(args.docId);
      const schedulerId = (await ctx.scheduler.runAfter(
        3600000,
        internal.document.deletedDocument,
        { docId: args.docId, fileId: doc.fileId },
      )) as Id<"_scheduled_functions">;
      const schedulerdoc = await ctx.db.system.get(schedulerId);
      const markAsdeleteed = await ctx.db.patch(args.docId, {
        status: "deleted",
        schedulerId,
        completedTime: schedulerdoc?.completedTime,
        scheduledTime: schedulerdoc?.scheduledTime,
      });
      return markAsdeleteed;
    }

    throw new ConvexError(
      "you don't have the required permissions to perform this action",
    );
  },
});

// schadule deletion
export const deletedDocument = internalMutation({
  args: {
    docId: v.id("docs"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const deletedDocument = await ctx.db.delete(args.docId);
    const deletedFile = await ctx.storage.delete(args.fileId);
    return deletedDocument;
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
      fileId: args.documentInfo.fileId ? args.documentInfo.fileId : fileId,
      type: args.documentInfo.type,
      docUrl,
    });

    // for an orgnization member
    if (hasAccess) {
      const isAdmin = hasAccess.orgIds
        .find((org) => org.orgId == args.orgId)
        ?.role.includes("admin");
      if (isAdmin) {
        console.log(
          args.documentInfo.fileId ? args.documentInfo.fileId : fileId,
        );
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
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      console.log("user", args, doc);
      const deletedDocument = await ctx.db.patch(args.docId, {
        name: args.documentInfo.name,
        fileId: args.documentInfo.fileId ? args.documentInfo.fileId : fileId,
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

export const toggleSaveDoc = mutation({
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

    const docAlreadySaved = user.saved.some((Id) => Id == args.docId);

    const hasAccess = await hasAccessTOrg(ctx, args.orgId);

    // for an orgnization member
    console.log("no access for orgs");
    if (hasAccess) {
      console.log("doc already saved");
      if (docAlreadySaved) {
        console.log("KJ hh");
        const saveDocTouser = ctx.db.patch(user?._id, {
          saved: [...user.saved].filter((id) => id !== args.docId),
        });
        return saveDocTouser;
      }
      const saveDocTouser = ctx.db.patch(user?._id, {
        saved: [...user.saved, args.docId],
      });
      return saveDocTouser;
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      if (docAlreadySaved) {
        const saveDocTouser = ctx.db.patch(user?._id, {
          saved: [...user.saved].filter((id) => id !== args.docId),
        });
        return saveDocTouser;
      }
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

// for saved section
export const getsavedDocuments = query({
  args: { query: v.optional(v.string()), orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("getDocuments started");
    const user = (await ctx.auth.getUserIdentity())?.subject;
    if (!user) {
      return { docs: [], user: null };
    }

    const userSavedDoc = await getUserById(ctx, user);

    // for oraganizations docs
    if (args.orgId) {
      console.log("for oraganizations");
      const hasAccess = await hasAccessTOrg(ctx, args.orgId);
      if (hasAccess) {
        const docs = await ctx.db
          .query("docs")
          .withIndex("by_orgId", (q) =>
            q.eq("orgId", args.orgId).eq("status", "active"),
          )
          .collect();
        console.log("docs:", docs);
        const query = args.query;
        if (query) {
          const documents = docs.filter((doc) =>
            doc.name.toLowerCase().includes(query.toLowerCase()),
          );
          const savedDocs = documents.filter((doc) =>
            userSavedDoc.saved.some((savedId) => savedId == doc._id),
          );
          return { docs: savedDocs, user: userSavedDoc };
        }
        const savedDocs = docs.filter((doc) =>
          userSavedDoc.saved.some((savedId) => savedId == doc._id),
        );
        return { docs: savedDocs, user: userSavedDoc };
      }
      return { docs: [], user: null };
    }

    // for users docs
    const docs = await ctx.db
      .query("docs")
      .withIndex("by_token", (q) =>
        q
          .eq("tokenIdentifier", user)
          .eq("orgId", undefined)
          .eq("status", "active"),
      )
      .collect();

    const query = args.query;
    if (query) {
      const documents = docs.filter((doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase()),
      );

      const savedDocuments = documents.filter((doc) =>
        userSavedDoc.saved.some((savedId) => savedId == doc._id),
      );

      return { docs: savedDocuments, user: userSavedDoc };
    }

    const savedDocs = docs.filter((doc) =>
      userSavedDoc.saved.some((savedId) => savedId == doc._id),
    );
    return { docs: savedDocs, user: userSavedDoc };
  },
});

// for deleted document
export const getDeletedDocuments = query({
  args: { query: v.optional(v.string()), orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("getDocuments started");
    const user = (await ctx.auth.getUserIdentity())?.subject;
    if (!user) {
      return { docs: [], user: null };
    }

    const userSavedDoc = await getUserById(ctx, user);

    // for oraganizations docs
    if (args.orgId) {
      console.log("for oraganizations");
      const hasAccess = await hasAccessTOrg(ctx, args.orgId);
      if (hasAccess) {
        const docs = await ctx.db
          .query("docs")
          .withIndex("by_orgId", (q) =>
            q.eq("orgId", args.orgId).eq("status", "deleted"),
          )
          .collect();
        console.log("docs:", docs);
        const query = args.query;
        if (query) {
          const documents = docs.filter((doc) =>
            doc.name.toLowerCase().includes(query.toLowerCase()),
          );
          return { docs: documents, user: userSavedDoc };
        }
        return { docs, user: userSavedDoc };
      }
      return { docs: [], user: null };
    }

    // for users docs
    const docs = await ctx.db
      .query("docs")
      .withIndex("by_token", (q) =>
        q
          .eq("tokenIdentifier", user)
          .eq("orgId", undefined)
          .eq("status", "deleted"),
      )
      .collect();

    const query = args.query;
    if (query) {
      const documents = docs.filter((doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase()),
      );
      return { docs: documents, user: userSavedDoc };
    }

    return { docs, user: userSavedDoc };
  },
});

// for restore document
export const restoreDocument = mutation({
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
      if (doc.schedulerId) {
        const processDeletion = await ctx.scheduler.cancel(doc.schedulerId);
        const markAsdeleteed = await ctx.db.patch(args.docId, {
          status: "active",
        });
        return markAsdeleteed;
      }
    }

    // for an document creator
    if (doc.tokenIdentifier === identity.subject) {
      console.log("user", args, doc);
      if (doc.schedulerId) {
        const processDeletion = await ctx.scheduler.cancel(doc.schedulerId);

        const markAsdeleteed = await ctx.db.patch(args.docId, {
          status: "active",
        });
        return markAsdeleteed;
      }
    }

    throw new ConvexError(
      "you don't have the required permissions to perform this action",
    );
  },
});
