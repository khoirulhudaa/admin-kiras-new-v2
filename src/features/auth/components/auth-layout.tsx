import { VokadashHead } from "@/core/libs";
import { PropsWithChildren } from "react";

const bg =
  "https://images.unsplash.com/photo-1490642914619-7955a3fd483c?q=80&w=2093&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export interface AuthLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  siteTitle?: string;
}

export const AuthLayout = ({
  description,
  title,
  children,
  image,
  logo,
  siteTitle,
}: AuthLayoutProps) => {
  return (
    <>
      {siteTitle && (
        <VokadashHead>
          <title>{siteTitle}</title>
        </VokadashHead>
      )}
      <div className="relative w-full lg:grid lg:grid-cols-2 min-h-[100svh]">
        <div className="relative bg-[#070a11] z-10 flex min-h-[100svh] items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-4 px-4">
            {/* {logo && ( */}
            {/*   <div className="w-full flex-1"> */}
            {/*     <img className="w-full" src={logo} /> */}
            {/*   </div> */}
            {/* )} */}

            {(title || description) && (
              <div className="grid gap-2 text-center">
                {title && <h1 className="text-3xl font-bold">{title}</h1>}
                {description && (
                  <p className="text-balance text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block h-screen">
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-[33]">

          </div>
          <img
            src={image || bg}
            alt="Image"
            width="1920"
            height="1080"
            className="h-auto w-full object-cover relative top-[-20%]"
          />
        </div>
      </div>
    </>
  );
};
