import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { 
    BarChart, Bar, 
    LineChart, Line, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
  } from "recharts";
  


function Graph() {
    const [data, setData] = useState({});

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
            const addressCount = {};

            snapshot.docs.forEach(doc => {
                const { address } = doc.data();
                addressCount[address] = (addressCount[address] || 0) + 1;
            });

            // Convertir datos en un array de objetos para Recharts
            const chartData = Object.keys(addressCount).map(address => ({
                address,
                count: addressCount[address]
            }));

            setData(chartData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h3>Clientes por Dirección</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="address" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#064ae8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Graph;
