import Image from "next/image"

export default function Page() {
  return(
    <div className="flex flex-col justify-center items-center">
      <p className="font-semibold text-3xl">Welcome!</p>
      <p className="text-gray-500">Loading your Noonchi Coach</p>
      <Image src="/logo3.png" alt="logo" width={288} height={50}/>
    </div>
  )
}
