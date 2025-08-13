"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation"

export default function HonoriciePage(){
    const router = useRouter();
    return(
        <div className="flex">
            <button onClick={()=>router.push("/main")}>
                <ChevronLeftIcon className="size-6"/>
            </button>
            <p>Honofiric Helper</p>
        </div>
    )
}