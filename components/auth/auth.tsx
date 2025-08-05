"use client"

import Main from "@/app/(main)/main/page"
import AuthPageOverlay from "./overlay"
import TabBar from "../tab-bar"

export default function AuthPage(){
    return (
<>
      
                <Main/>
                <TabBar/>
            <div className="z-10 flex flex-col">
              <AuthPageOverlay />
            </div>
</>
    )
}