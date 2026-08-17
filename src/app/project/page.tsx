"use client";
import { Suspense } from "react"; import { useSearchParams } from "next/navigation";
function Shell(){const id=useSearchParams().get("id");return <p>{id?`Loading project ${id} from Supabase…`:"Select a project. IDs use ?id= so this page is statically exportable."}</p>};export default function Page(){return <main className="mx-auto max-w-xl p-8"><h1 className="mb-4 text-3xl font-semibold">Project</h1><Suspense fallback="Loading…"><Shell/></Suspense></main>}
