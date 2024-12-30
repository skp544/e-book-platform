import store from "../store";

export type NewUserInfo = {
  name: string;
  avatar?: File;
};

export interface Profile {
  id: string;
  name?: string;
  email: string;
  role: "user" | "author";
  avatar?: string;
  signedUp: boolean;
  authorId?: string;
  books?: string[];
}

export type AuthState = {
  profile: Profile | null;
  status: "busy" | "authenticated" | "unauthenticated";
};

export interface IAuthContext {
  profile: AuthState["profile"];
  status: AuthState["status"];
  signOut: () => void;
}

export type RootState = ReturnType<typeof store.getState>;

export interface BookDefaultForm {
  file?: File | null;
  cover?: File;
  title: string;
  description: string;
  publicationName: string;
  publishedAt?: string;
  genre: string;
  language: string;
  mrp: string;
  sale: string;
}

export  interface BookToSubmit {
  title: string;
  description: string;
  uploadMethod: "aws" | "local";
  language: string;
  publishedAt?: string;
  publicationName: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
  };
  fileInfo: {
    type: string;
    name: string;
    size: number;
  };
}