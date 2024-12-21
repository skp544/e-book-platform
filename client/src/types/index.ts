import store from "../store";

export  type  NewUserInfo = {
    name: string
    avatar?: File
}

export  interface  Profile {
    id: string;
    name?: string;
    email: string;
    role: "user" | "author";
    avatar?: string;
    signedUp: boolean;
    authorId?: string;
    books?: string[];
}

export  type AuthState = {
    profile: Profile | null
    status: "busy" | "authenticated" | "unauthenticated"
}

export  interface IAuthContext {
    profile: AuthState["profile"]
    status: AuthState["status"]
    signOut: () => void
}

export  type RootState  = ReturnType<typeof store.getState>