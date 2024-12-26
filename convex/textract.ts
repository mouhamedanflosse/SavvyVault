"use node";

import { internalAction } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";
import textract from "textract";
import { promisify } from "util";
import { Buffer } from "buffer";
import { arrayBuffer } from "stream/consumers";

// Promisify textract's fromUrl function
// const extractFromUrl = promisify(textract.fromUrl);

export const extract_text = internalAction({
  args: {
    fileId: v.string(),
    docUrl: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("starting", args.fileId);
    let awesometext;

    try {
      //   const file =  await ctx.storage.get(args.fileId) as Blob;

      //   const dummydata = file.type

      //   const buffer = await file.arrayBuffer()

      //   console.log(typeof buffer , typeof file , buffer , file.type)

      console.log(args.docUrl);

      const extractedText_ = await new Promise<string>((resolve, reject) => {
        textract.fromUrl(
          //  'myfile.pdf',
          //   Buffer.from(buffer),
          args.docUrl,
          (error, text) => {
            console.log('callback invoked')
            if (error) {
              console.log("there is an error👾 ", error);
              reject(error);
            } else {
              console.log("all set ✅", text);
              resolve(text);
            }
          },
        );
      });

      return extractedText_;
    } catch (error) {
      console.log("Errorduring text extracting", error);
    }

    // Extract text using promisified function
    //   const extractedText = await textract.fromBufferWithName('attached file', buffer, function( error, text ) {})

    //   console.log(extractedText)

    // const data = await new Promise( () => textract.fromBufferWithName('attached file', buffer, function( error, text ) {
    //     console.log('extracted text',text)
    //     console.log('extracted error lol' , error)
    //     return text
    // })).then((data) => {
    //     console.log('response' , data)
    //     return data
    // })

    //   console.log('awesometext' , awesometext)

    // const extract_text = await textract.fromUrl(args.docUrl, (error, text) => {
    //   awesometext = text;
    //   console.log("extracted text", text);
    //   console.log("extracted error lol", error);
    //   return text;
    // });
    // return awesometext;
  },
});
