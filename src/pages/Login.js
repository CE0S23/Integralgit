import React, { useState } from "react";
import { auth, db, googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Importa el archivo CSS
import { FaGoogle } from "react-icons/fa"; // Ejemplo con Font Awesome

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().isActive) {
                setError("Ya hay una sesión activa en otro dispositivo.");
                setLoading(false);
                return;
            }

            await updateDoc(userDocRef, { isActive: true });

            setEmail("");
            setPassword("");
            navigate("/");
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message, error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    setError("Correo electrónico inválido.");
                    break;
                case "auth/user-not-found":
                case "auth/wrong-password":
                    setError("Correo electrónico o contraseña incorrectos.");
                    break;
                default:
                    setError("Error al iniciar sesión. Inténtalo de nuevo más tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().isActive) {
                setError("Ya hay una sesión activa en otro dispositivo.");
                setLoading(false);
                return;
            }

            if (!userDoc.exists()) {
                await setDoc(userDocRef, { email: user.email, isActive: true });
            } else {
                await updateDoc(userDocRef, { isActive: true });
            }

            navigate("/");
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error.message, error.code);
            setError("Error al iniciar sesión con Google.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <button className="google-button" onClick={handleGoogleLogin} disabled={loading}>
            <FaGoogle className="google-icon" />
            {loading ? "Ingresando con Google..." : "Iniciar sesión con Google"}
            </button>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Login;