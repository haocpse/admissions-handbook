// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import Navbar from "../../Components/Navbar/Navbar";
// import Footer from "../../Components/Footer/Footer";
// import "./AdminCRUDSubjectCombination.css";
// import { useState, useEffect } from "react";
// const initialCombinations = [{ id: 1, name: "Toán - Lý - Hóa", subjects: ["Toán", "Lý", "Hóa"] }];

// function AdminCRUDSubjectCombination() {
//     const [combinations, setCombinations] = useState(initialCombinations);
//     const [form, setForm] = useState({ code: "", name: "" });
//     const [editId, setEditId] = useState(null);

//     const handleChange = e => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = e => {
//         e.preventDefault();
//         if (!form.code.trim() || !form.name.trim()) return;
//         if (editId) {
//             setCombinations(combinations.map(c => c.id === editId ? { ...c, ...form } : c));
//             setEditId(null);
//         } else {
//             setCombinations([...combinations, { ...form, id: Date.now() }]);
//         }
//         setForm({ code: "", name: "" });
//     };

//     const handleEdit = combination => {
//         setForm({ code: combination.code, name: combination.name });
//         setEditId(combination.id);
//     };

//     const handleDelete = id => {
//         setCombinations(combinations.filter(c => c.id !== id));
//         if (editId === id) setEditId(null);
//     };

//     return (
//         <div className="admin-sc-container">
//             <h2 className="admin-sc-title">Quản lý tổ hợp môn</h2>
//             <form className="admin-sc-form" onSubmit={handleSubmit}>
//                 <input
//                     name="code"
//                     placeholder="Mã tổ hợp (VD: A00)"
//                     value={form.code}
//                     onChange={handleChange}
//                     className="admin-sc-input"
//                 />
//                 <input
//                     name="name"
//                     placeholder="Tên tổ hợp (VD: Toán, Lý, Hóa)"
//                     value={form.name}
//                     onChange={handleChange}
//                     className="admin-sc-input"
//                 />
//                 <button type="submit" className="admin-sc-btn">
//                     {editId ? "Cập nhật" : "Thêm mới"}
//                 </button>
//             </form>
//             <div className="admin-sc-table-wrapper">
//                 <table className="admin-sc-table">
//                     <thead>
//                         <tr>
//                             <th>Mã tổ hợp</th>
//                             <th>Tên tổ hợp</th>
//                             <th>Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {combinations.map(comb => (
//                             <tr key={comb.id}>
//                                 <td>{comb.code}</td>
//                                 <td>{comb.name}</td>
//                                 <td className="admin-sc-actions">
//                                     <button className="admin-sc-edit-btn" onClick={() => handleEdit(comb)}>Sửa</button>
//                                     <button className="admin-sc-delete-btn" onClick={() => handleDelete(comb.id)}>Xóa</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default AdminCRUDSubjectCombination;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./AdminCRUDSubjectCombination.css";

function AdminCRUDSubjectCombination() {
    const [combinations, setCombinations] = useState([]);
    const [form, setForm] = useState({ code: "", name: "" });
    const [editId, setEditId] = useState(null);

    // Fetch data từ API khi load trang
    useEffect(() => {
        axios.get("/api/subject-combinations")
            .then(res => setCombinations(res.data))
            .catch(() => setCombinations([]));
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.code.trim() || !form.name.trim()) return;
        if (editId) {
            // Update
            await axios.put(`/api/subject-combinations/${editId}`, form);
        } else {
            // Create
            await axios.post("/api/subject-combinations", form);
        }
        // Reload data
        const res = await axios.get("/api/subject-combinations");
        setCombinations(res.data);
        setForm({ code: "", name: "" });
        setEditId(null);
    };

    const handleEdit = combination => {
        setForm({ code: combination.code, name: combination.name });
        setEditId(combination.id);
    };

    const handleDelete = async id => {
        await axios.delete(`/api/subject-combinations/${id}`);
        setCombinations(combinations.filter(c => c.id !== id));
        if (editId === id) setEditId(null);
    };

    return (
        <div className="admin-sc-container">
            <h2 className="admin-sc-title">Quản lý tổ hợp môn</h2>
            <form className="admin-sc-form" onSubmit={handleSubmit}>
                <input
                    name="code"
                    placeholder="Mã tổ hợp (VD: A00)"
                    value={form.code}
                    onChange={handleChange}
                    className="admin-sc-input"
                />
                <input
                    name="name"
                    placeholder="Tên tổ hợp (VD: Toán, Lý, Hóa)"
                    value={form.name}
                    onChange={handleChange}
                    className="admin-sc-input"
                />
                <button type="submit" className="admin-sc-btn">
                    {editId ? "Cập nhật" : "Thêm mới"}
                </button>
            </form>
            <div className="admin-sc-table-wrapper">
                <table className="admin-sc-table">
                    <thead>
                        <tr>
                            <th>Mã tổ hợp</th>
                            <th>Tên tổ hợp</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinations.map(comb => (
                            <tr key={comb.id}>
                                <td>{comb.code}</td>
                                <td>{comb.name}</td>
                                <td className="admin-sc-actions">
                                    <button className="admin-sc-edit-btn" onClick={() => handleEdit(comb)}>Sửa</button>
                                    <button className="admin-sc-delete-btn" onClick={() => handleDelete(comb.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminCRUDSubjectCombination;