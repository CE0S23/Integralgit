import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [loading, setLoading] = useState(false); // Estado para indicar carga
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setEmailError(null);
        setPasswordError(null);
        setLoading(true); // Indica que está cargando

        // Validación del correo electrónico (lado del cliente)
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setEmailError("Correo electrónico inválido.");
            setLoading(false);
            return;
        }

        // Validación de la contraseña (ejemplo básico)
        if (password.length < 6) {
            setPasswordError("La contraseña debe tener al menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            // Verifica si el correo ya está registrado en Firestore (opcional)
            const userQuery = doc(db, "users", email);
            const userSnapshot = await getDoc(userQuery);

            if (userSnapshot.exists()) {
                setError("El correo ya está registrado.");
                setLoading(false);
                return;
            }

            // Crea la cuenta en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            const userDocRef = doc(db, "users", userId);

            // Guarda la información del usuario en Firestore
            await setDoc(userDocRef, { email, isActive: false });

            // Limpia el formulario después del registro exitoso
            setEmail("");
            setPassword("");

            // Muestra un mensaje de éxito (opcional)
            alert("Registro exitoso. Ahora puedes iniciar sesión.");

            navigate("/login");
        } catch (error) {
            console.error("Error en el registro:", error.message);

            if (error.code === "auth/email-already-in-use") {
                setError("El correo ya está registrado en el sistema.");
            } else {
                setError("Ocurrió un error en el registro. Intenta nuevamente.");
            }
        } finally {
            setLoading(false); // Indica que ha terminado la carga
        }
    };

    return (
        <div className="register-container">
            <h2>Registro</h2>
            <form onSubmit={handleRegister} className="register-form">
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {emailError && <p className="email-error">{emailError}</p>}
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {passwordError && <p className="password-error">{passwordError}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Register;