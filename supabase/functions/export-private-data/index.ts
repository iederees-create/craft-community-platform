import { serve } from "../_shared/http.ts";
serve({name:"export-private-data",roles:[
  "member"
],required:[
  "format"
],rateLimit:30,action:"privacy.export"},async ({body})=>({accepted:true,request:body}));
