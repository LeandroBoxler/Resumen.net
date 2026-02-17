import { createContext, useContext,  useEffect,  useState } from "react";
import { LoginRequest, RegisterRequest, SecureUser, UpdateProfileRequest } from "../types";
import {authService} from "../services/api";

export interface AuthContext {
    login: (credentials: LoginRequest) => Promise<string | null>;
    logout: () => void;
    register: (credentials: RegisterRequest) => Promise<boolean>
    updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
    profile?: SecureUser | null;
}

const authContext = createContext({
    login: async () => null,
    logout: () => void 0,
    register: async () => false,
    updateProfile: async () => false,
} as AuthContext)

export const useAuth = () => useContext(authContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<SecureUser | null>(null)

    useEffect(()=> {
        const token = authService.getToken()
        
        if (token) {
            loadProfile()
        }
    },[])

    async function loadProfile() {
        const profile = await authService.getProfile()
        setProfile(profile)
    }

    async function login (credentials: LoginRequest): Promise<string | null> {
        const result = await authService.login(credentials)

        if (result) {
            await loadProfile()
        }

        return result
    }

    async function register (credentials: RegisterRequest): Promise<boolean> {
        return await authService.register(credentials)
    }

    async function updateProfile (data: UpdateProfileRequest): Promise<boolean> {
        const updatedProfile = await authService.updateProfile(data)
        if (updatedProfile) {
            setProfile(updatedProfile)
            return true
        }
        return false
    }

    function logout () {
        authService.logout()
        setProfile(null)
    }

    const value: AuthContext = {logout, profile, login, register, updateProfile}

    return <authContext.Provider value={value}>
        {children}
    </authContext.Provider>
}