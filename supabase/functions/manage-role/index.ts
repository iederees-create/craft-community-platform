import { serve } from "../_shared/http.ts";
serve({name:"manage-role",roles:[
  "admin"
],required:[
  "id",
  "role",
  "decision"
],rateLimit:30,action:"role.manage"},async ({body})=>({accepted:true,request:body}));
