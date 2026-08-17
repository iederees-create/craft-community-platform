import { serve } from "../_shared/http.ts";
serve({name:"moderate-content",roles:[
  "moderator",
  "admin"
],required:[
  "id",
  "decision"
],rateLimit:30,action:"moderation.apply"},async ({body})=>({accepted:true,request:body}));
