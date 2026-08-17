import { serve } from "../_shared/http.ts";
serve({name:"delete-account",roles:[
  "member"
],required:[
  "confirmation"
],rateLimit:30,action:"privacy.delete"},async ({body})=>({accepted:true,request:body}));
