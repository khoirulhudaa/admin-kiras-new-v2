// import { VokadashHead } from "@/core/libs";
// import { PropsWithChildren } from "react";

// const bg =
//   "https://images.unsplash.com/photo-1490642914619-7955a3fd483c?q=80&w=2093&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// export interface AuthLayoutProps extends PropsWithChildren {
//   title?: string;
//   description?: string;
//   image?: string;
//   logo?: string;
//   siteTitle?: string;
// }

// export const AuthLayout = ({
//   description,
//   title,
//   children,
//   image,
//   siteTitle,
// }: AuthLayoutProps) => {
//   return (
//     <>
//       {siteTitle && (
//         <VokadashHead>
//           <title>{siteTitle}</title>
//         </VokadashHead>
//       )}
//       <div className="relative w-full lg:grid lg:grid-cols-2 min-h-[100svh]">
//         <div className="relative bg-[#070a11] z-10 flex min-h-[100svh] items-center justify-center py-12">
//           <div className="mx-auto grid w-[350px] gap-4 px-4">
//             {(title || description) && (
//               <div className="grid gap-2 text-center">
//                 {title && <h1 className="text-3xl font-bold">{title}</h1>}
//                 {description && (
//                   <p className="text-balance text-muted-foreground">
//                     {description}
//                   </p>
//                 )}
//               </div>
//             )}

//             {children}
//           </div>
//         </div>
//         <div className="relative hidden bg-muted lg:block h-screen">
//           <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-[33]">

//           </div>
//           <img
//             src={image || bg}
//             alt="Image"
//             width="1920"
//             height="1080"
//             className="h-auto w-full object-cover relative top-[-20%]"
//           />
//         </div>
//       </div>
//     </>
//   );
// };



import { VokadashHead } from "@/core/libs";
import { PropsWithChildren } from "react";

const defaultBg = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop";

export interface AuthLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  image?: string;
  siteTitle?: string;
}

export const AuthLayout = ({ description, title, children, image, siteTitle }: AuthLayoutProps) => {
  return (
    <>
      {siteTitle && (
        <VokadashHead>
          <title>{siteTitle}</title>
        </VokadashHead>
      )}
      <div className="relative w-full lg:grid lg:grid-cols-2 h-screen bg-[#020617] overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8">
          {/* Subtle Blue Glow behind form */}
          <div className="absolute w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="mx-auto w-full md:px-16 space-y-8">
            {(title || description) && (
              <div className="space-y-2 text-left">
                {title && (
                  <h1 className="text-4xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    {"Dashboard Admin"}
                  </h1>
                )}
                {description && (
                  <p className="text-blue-200/60 font-medium">
                    {description}
                  </p>
                )}
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              {children}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Content */}
        <div className="relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-[#020617] z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-20" />
          
          <img
            src={image || defaultBg}
            alt="Premium Branding"
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          
          {/* Floating Quote/Branding */}
          {/* <div className="absolute bottom-12 left-12 z-30 max-w-md">
            <div className="h-1 w-12 bg-blue-500 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Elevate Your Workflow.</h2>
            <p className="text-blue-100/70">Experience the next generation of management system.</p>
          </div> */}
        </div>
      </div>
    </>
  );
};  