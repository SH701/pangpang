import Link from "next/link"

export default function Header(){
    return(
        <header className="flex justify-between items-center px-5 max-w-[1000px] mx-auto w-full mb-5 *:text-2xl">
            <Link href={"/main"} className="font-semibold">로고</Link>
            <Link href={"/history"} className="font-semibold">히스토리</Link>
            <Link href={"/profile"} className="font-semibold">프로필</Link>
        </header>
    )
}