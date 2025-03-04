import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import "../styles/Home.css";


function Home() {
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                setUserId(user.uid);
            } else {
                setUserEmail("");
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            if (userId) {
                const userDocRef = doc(db, "users", userId);
                await updateDoc(userDocRef, { isActive: false });
            }
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="home-container">
            <h1>Bienvenido! {userEmail || "Usuario"}</h1>
            <button className="home-button logout-button" onClick={handleLogout}>
                <FaSignOutAlt className="home-icon" /> Cerrar Sesión
            </button>
            <button className="home-button dashboard-button" onClick={() => navigate("/dashboard")}>
                <FaTachometerAlt className="home-icon" /> Ir a Dashboard
            </button>
        </div>
    );
}

export default Home;