import { serve } from "../_shared/http.ts";
serve({name:"etsy-webhook",roles:[
  "admin"
],required:[
  "event"
],rateLimit:30,action:"etsy.webhook"},async ({body})=>({accepted:true,request:body}));
