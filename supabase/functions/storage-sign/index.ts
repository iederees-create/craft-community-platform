import { serve } from "../_shared/http.ts";
serve({name:"storage-sign",roles:[
  "member"
],required:[
  "bucket",
  "path"
],rateLimit:30,action:"storage.sign"},async ({body})=>({accepted:true,request:body}));
