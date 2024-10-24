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
      console.log(payloadString, headerPayload);
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id"),
          "svix-timestamp": headerPayload.get("svix-timestamp"),
          "svix-signature": headerPayload.get("svix-signature"),
        },
      });
      console.log(result);
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
          await ctx.runMutation(internal.users.addOrgId, {
            orgIds : [result.data.organization.id],
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
