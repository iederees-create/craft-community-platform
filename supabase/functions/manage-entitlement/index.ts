import { serve } from "../_shared/http.ts";
serve({name:"manage-entitlement",roles:[
  "admin"
],required:[
  "id",
  "decision"
],rateLimit:30,action:"entitlement.manage"},async ({body})=>({accepted:true,request:body}));
