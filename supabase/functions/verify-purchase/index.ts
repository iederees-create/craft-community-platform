import { serve } from "../_shared/http.ts";
serve({name:"verify-purchase",roles:[
  "member"
],required:[
  "claim_id"
],rateLimit:30,action:"purchase.verify"},async ({body})=>({accepted:true,request:body}));
