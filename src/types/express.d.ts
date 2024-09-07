declare module Express {
  export interface Request {
    user: {
      sub: string;
      firstName: string;
      email: string;
    };
  }
}
