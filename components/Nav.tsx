import Link from "next/link"

export default function Nav() {
   return (
      <>
         <nav className="w-full flex justify-center fixed top-1 left-0 z-50 " >
            <div className="rounded-full bg-black text-white flex gap-4 w-fit px-8 py-3 items-center">
               <h1 className="font-clash font-medium">Sum-AI-Rise</h1>
               <Link className="text-sm" href="#tool">Tool</Link>
               <Link className="text-sm" href="#about">About</Link>
            </div>


         </nav>
      </>
   )
}