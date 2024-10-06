import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter()

http.route({
    path : "/clerk",
    method : "POST",
    handler : httpAction(async (ctx , req ) => {
        const payloadString = await req.text();
        const headerPayload = req.headers;
        try {
            console.log(payloadString,headerPayload)
        } catch (err) {
            console.log(err)
        }

        return new Response(null, {
            status: 200,
          })
    })
})

export default http;