import Link from "next/link"

export default function Nav() {
   return (
      <>
         <nav className="w-full flex justify-center fixed top-5 left-0 z-50 " >
            <div className="rounded-full bg-black text-white flex gap-4 w-fit p-3 items-center">
               <h1 className="font-clash font-medium md:me-16">Sum-AI-Rise</h1>
               <Link className="text-sm btn md:inline hidden" href="#tool">Tool</Link>
               <Link className="text-sm btn md:inline hidden" href="#about">About</Link>
               <Link className="text-sm btn md:inline hidden" href="#about">Another</Link>
               <Link className="text-sm bg-amber-400 rounded-full btn" href="#about">Source Code</Link>
            </div>
         </nav>
      </>
   )
}