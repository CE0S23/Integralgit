import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Graph from "../components/Graph";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";


function Dashboard() {
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        field1: "",
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    const fetchClients = async () => {
        const querySnapshot = await getDocs(collection(db, "clients"));
        setClients(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.name && form.email && form.phone && form.address) {
            if (editingId) {
                const clientDoc = doc(db, "clients", editingId);
                await updateDoc(clientDoc, form);
                setEditingId(null);
            } else {
                await addDoc(collection(db, "clients"), form);
            }
            setForm({ name: '', email: '', phone: '', address: '', field1: '' });
        } else {
            alert("Todos los campos son obligatorios");
        }
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "clients", id));
        fetchClients();
    };

    const handleEdit = (client) => {
        setEditingId(client.id);
        setForm(client);
    };

    return (
        <div className="dashboard-container">
            <h2>Dashboard de Clientes</h2>
            <button className="home-button" onClick={() => navigate("/")}> <FaSignOutAlt className="home-icon" /> Regresar a Home</button>
            <form onSubmit={handleSubmit} className="dashboard-form">
                <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input type="text" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} />
                <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} />
                <input type="text" name="field1" placeholder="Campo 1" value={form.field1} onChange={handleChange} />
                <button type="submit">{editingId ? 'Actualizar' : 'Guardar'}</button>
            </form>

            <div className="client-list">
                <h3>Lista de Clientes</h3>
                <ul>
                    {clients.map(client => (
                        <li key={client.id}>
                            <div>
                                {client.name} - {client.email} - {client.phone} - {client.address}
                            </div>
                            <div>
                                <button onClick={() => handleEdit(client)}>Editar 🖋️ ️</button>
                                <button onClick={() => handleDelete(client.id)}>Eliminar 🗑️</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="graph-container">
                <Graph />
            </div>
        </div>
    );
}

export default Dashboard;