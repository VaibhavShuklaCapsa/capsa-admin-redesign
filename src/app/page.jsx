// "use client"

// import React from 'react'
// // import Testimonial from './main/Testimonial'
// // import Login from './main/Login'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'


// const page = () => {
//   const router = useRouter();

//   return (
//     <div className="bg-white text-white h-screen flex gap-[10px] overflow-hidden px-2 md:p-10">
//       {/* Mobile view with logo, padding and spacing */}
//       <div className="md:hidden flex flex-col items-center w-full pt-[61px]">
//         <div className="mb-[64px]">
//           <Image src={"/icons/capsa-colored.svg"} width={158} height={36} alt="Capsa logo" />
//         </div>
//         <div className="flex flex-col gap-[10px] w-full">
//           <Login 
//             handleClick={(path) => path ? router.push(path) : router.push("/admin/dashboard")}
//           />
//         </div>
//       </div>

//       {/* Desktop view - unchanged */}
//       <div className="hidden md:flex w-full">
//         <div className="flex flex-col justify-between w-1/4 h-full bg-customBlue bg-[url('/icons/homescreen.svg')] bg-no-repeat bg-left bg-cover rounded-2xl">
//           <div className="p-5">
//             <Image src={"/icons/capsa.svg"} width={150} height={32} alt='Capsa logo'/>
//           </div>

//           <div className='p-5'>
//             <Testimonial
//               onPrev={() => console.log("nothinh to see here ")}
//               onNext={() => console.log("nothinh to see here ")}
//             />
//           </div>
//         </div>

//         <div className='w-3/4'>
//           <Login handleClick={(path) => path ? router.push(path) : router.push("/admin/dashboard")}/>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default page
"use client"

import React from 'react'
import Testimonial from './main/Testimonial'
import Login from './main/Login'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  const handleLoginRedirect = (path) => {
    router.push(path || '/admin/dashboard')
  }

  return (
    <div className="bg-white text-white h-screen flex gap-[10px] overflow-hidden px-2 md:p-10">

      <div className="md:hidden flex flex-col items-center w-full pt-[61px]">
        <div className="mb-[64px]">
          <Image
            src="/icons/capsa-colored.svg"
            width={158}
            height={36}
            alt="Capsa logo"
          />
        </div>

        <div className="flex flex-col gap-[10px] w-full">
          <Login handleClick={handleLoginRedirect} />
        </div>
      </div>

      <div className="hidden md:flex w-full">

        <div className="flex flex-col justify-between w-1/4 h-full bg-customBlue bg-[url('/icons/homescreen.svg')] bg-no-repeat bg-left bg-cover rounded-2xl">

          <div className="p-5">
            <Image
              src="/icons/capsa.svg"
              width={150}
              height={32}
              alt="Capsa logo"
            />
          </div>

          <div className="p-5">
            <Testimonial
              onPrev={() => console.log("prev")}
              onNext={() => console.log("next")}
            />
          </div>
        </div>

        <div className="w-3/4">
          <Login handleClick={handleLoginRedirect} />
        </div>
      </div>
    </div>
  )
}

export default Page