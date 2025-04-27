import store from "../redux/store.ts";

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

export interface BackendErrorResponse {
  success: false;
  message: string;
}

export interface CatchErrorResponse {
  success: false;
  message: string;
  data?: any;
}

export interface APIError {
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}

export type NewUserInfo = {
  name: string;
  avatar?: File;
};

export type RootState = ReturnType<typeof store.getState>;

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

export interface IBookPublicDetails {
  id: string;
  title: string;
  genre: string;
  language: string;
  slug: string;
  publicationName: string;
  publishedAt: string;
  description: string;
  cover: string | undefined;
  rating: string | undefined;
  fileInfo: {
    size: string;
    key: string;
  };
  price: {
    mrp: string | number;
    sale: string | number;
  };
  author: {
    id: string;
    name: string;
    slug: string;
  };
}
export interface CartItemAPI {
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    cover?: string;
    price: {
      mrp: string | number;
      sale: string | number;
    };
  };
}

export type CartItem =
  | {
      product: IBookPublicDetails;
      quantity: number;
    }
  | CartItemAPI;

export interface ICartState {
  id?: string;
  items: CartItem[];
}

export interface IAuthContext {
  profile: AuthState["profile"];
  status: AuthState["status"];
  signOut: () => void;
  updateProfileInfo: () => Promise<void>;
}

export interface FeaturedBook {
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  slogan: string;
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

export interface AuthorInfo {
  name: string;
  about: string;
  socialLinks?: string[];
}

export interface IAuthorInfo extends AuthorInfo {
  books: IBookByGenre[];
}

export interface AuthorInitialState extends AuthorInfo {
  id: string;
}

export interface Review {
  content: string;
  date: string;
  id: string;
  rating: number;
  user: {
    id: string;
    name: string;
    avatar?: {
      url: string;
    };
  };
}

export interface ICartContext {
  id?: string;
  items: CartItem[];
  updateCart(item: CartItem): void;
  pending: boolean;
  totalCount: number;
  subTotal: number;
  totalPrice: number;
  fetching: boolean;
  clearCart(): void;
}

export type UpdateItem = {
  product: string;
  quantity: number;
};
export interface IUpdateCartApi {
  items: UpdateItem[];
}

export interface CartApiResponse {
  success?: boolean;
  message?: string;
  data: {
    id: string;
    items: CartItemAPI[];
  };
}

export interface OrderItem {
  id: string;
  title: string;
  slug: string;
  cover?: string;
  qty: number;
  price: string;
  totalPrice: string;
}

export interface Order {
  orders: OrderItem[];
  totalAmount: string;
}

export interface IOrders {
  id: string;
  stripeCustomerId?: string;
  paymentId?: string;
  totalAmount: string;
  paymentStatus?: string;
  date: string;
  orderItem: OrderItem[];
}

export interface ILibraryBook {
  id: string;
  title: string;
  cover?: string;
  slug: string;
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface IAddReviewFormData {
  bookId: string;
  content: string;
  rating: number;
}

export type Highlight = {
  selection: string;
  fill: string;
};

export type Settings = {
  highlights: Highlight[];
  lastLocation: string;
};

export interface IBookAccessUrlAPI {
  settings: Settings;
  url: string;
}

export interface RelocatedEvent {
  start: Start;
  end: End;
  atStart: boolean;
}

export interface LocationChangedEvent {
  end: string;
  href: string;
  index: number;
  percentage: number;
  start: string;
}

export interface Start {
  index: number;
  href: string;
  cfi: string;
  displayed: Displayed;
  location: number;
  percentage: number;
}

export interface Displayed {
  page: number;
  total: number;
}

export interface End {
  index: number;
  href: string;
  cfi: string;
  displayed: Displayed2;
  location: number;
  percentage: number;
}

export interface Displayed2 {
  page: number;
  total: number;
}
