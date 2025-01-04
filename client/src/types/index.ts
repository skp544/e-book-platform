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

export interface BookToSubmit {
  title: string;
  description: string;
  uploadMethod: "aws" | "local";
  language: string;
  publishedAt?: string;
  slug?: string;
  publicationName: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
  };
  fileInfo?: {
    type: string;
    name: string;
    size: number;
  };
}

export interface InitialBookToUpdate {
  id: string;
  slug: string;
  title: string;
  description: string;
  genre: string;
  language: string;
  cover?: string;
  price: { mrp: string; sale: string };
  publicationName: string;
  publishedAt: string;
}

export interface AuthorInfo {
  name: string;
  about: string;
  socialLinks?: string[];
}

export interface AuthorInitialState extends AuthorInfo {
  id: string;
}

export interface FeaturedBook {
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  slogan: string;
}

export interface IBookByGenre {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: number;
  price: {
    mrp: number;
    sale: number;
  };
}
