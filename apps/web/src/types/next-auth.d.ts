import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    avatar?: string;
    isPremium?: boolean;
    stardustCoins?: number;
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      username: string;
      email: string;
      name?: string;
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id?: string;
    username?: string;
  }
}
