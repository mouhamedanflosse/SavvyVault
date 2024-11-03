import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const headerPayload = req.headers;
    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id"),
          "svix-timestamp": headerPayload.get("svix-timestamp"),
          "svix-signature": headerPayload.get("svix-signature"),
        },
      });
      switch (result.type) {
        case "user.created":
          console.log('user created')
          await ctx.runMutation(internal.users.insertUser, {
            tokenIdentifier: result.data.id,
            name: `${result.data.first_name} ${result.data.last_name}`,
            image: result.data.image_url,
            orgIds : []
          });
          break;
          
          case "organizationMembership.created":
            console.log('organizationMembership created')
          await ctx.runMutation(internal.users.addOrgMember, {
            orgId : result.data.organization.id,
            role : result.data.role,
            tokenIdentifier : result.data.public_user_data.user_id,
          } )
          break;

          case "organizationMembership.updated":
          console.log('organizationMembership updated')
          await ctx.runMutation(internal.users.updateOrgMember, {
            orgId : result.data.organization.id,
            role : result.data.role,
            tokenIdentifier : result.data.public_user_data.user_id,
          } )
          break;

          case "organizationMembership.deleted":
          console.log('organizationMembership deleted')
          await ctx.runMutation(internal.users.deleteOrgMember, {
            orgId : result.data.organization.id,
            tokenIdentifier : result.data.public_user_data.user_id,
          } )
          break;

        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }

    return new Response(null, {
      status: 200,
    });
  }),
});

export default http;
