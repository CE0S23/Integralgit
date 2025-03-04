import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionBlocked, setSessionBlocked] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const isActive = userDoc.data().isActive;

                    if (isActive && !user) {
                        setSessionBlocked(true);
                        alert("Otra sesión está activa. Solo puedes iniciar sesión en un dispositivo.");
                        return;
                    } else {
                        await updateDoc(userDocRef, { isActive: true });
                        setSessionBlocked(false);
                    }
                } else {
                    // Si el usuario no tiene un documento en Firestore, lo creamos
                    await setDoc(userDocRef, { email: currentUser.email, isActive: true });
                }

                setUser(currentUser);
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Función para cerrar sesión y actualizar Firestore
    const logout = async () => {
        if (user) {    
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { isActive: false });
        }
        await signOut(auth);
        setUser(null);
        setSessionBlocked(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, sessionBlocked }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
