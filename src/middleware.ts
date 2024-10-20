import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/login',  // Redirect users here if they are not authenticated
  },
});

export const config = {
  matcher: ['/create-form', '/form-analysis/:path*'],  // Ensure all paths start with `/`
};
