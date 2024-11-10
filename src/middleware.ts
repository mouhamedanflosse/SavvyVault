import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isPublicRoute = createRouteMatcher(['/auth(.*)' , '/'])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
}, {signInUrl : "/auth"})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routesn
    '/(api|trpc)(.*)',
  ],
}


// import { authMiddleware,clerkMiddleware } from '@clerk/nextjs/server'
// before the migration
// // export default authMiddleware({
// //     publicRoutes: ["/"],
// // })

// export default clerkMiddleware((auth, req) => {
  
// })