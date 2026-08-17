import { serve } from "../_shared/http.ts";
serve({name:"manage-pattern",roles:[
  "pattern_maintainer",
  "admin"
],required:[
  "id",
  "decision"
],rateLimit:30,action:"pattern.manage"},async ({body})=>({accepted:true,request:body}));
