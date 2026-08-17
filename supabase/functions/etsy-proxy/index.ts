import { serve } from "../_shared/http.ts";
serve({name:"etsy-proxy",roles:[
  "admin"
],required:[
  "operation"
],rateLimit:30,action:"etsy.request"},async ({body})=>({accepted:true,request:body}));
