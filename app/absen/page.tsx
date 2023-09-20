"use client"
import { useState, FormEvent } from "react";

export default function Page() {
    const [id, setId] = useState("");
    const [history, setHistory] = useState([]);

    const updateHistory = (message: String) => {
        setHistory(...history, message)
    }

    const getCurrentTime = () => {
        const currentDate = new Date();
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");
        const seconds = currentDate.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const res = await fetch('http://localhost:3001/api/attendance', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ id, }),
        })
        setId("")
        if (res.status == 404) {
            if (history.length == 5) setHistory(history.splice(0, 1))
            return setHistory([...history, `User tidak terdaftar. ${getCurrentTime()}`])
        }
        const data = res.json().then(e => e.data[0].name)
        if (res.status == 200) {
            if (history.length == 5) setHistory(history.splice(0, 1))

            setHistory([...history, `Selamat datang ${await data}. ${getCurrentTime()}`])
        }
        if (res.status == 406) {
            if (history.length == 5) setHistory(history.splice(0, 1))
            setHistory([...history, `Hi ${await data} kamu sudah absen hari ini. ${getCurrentTime()}`])
        }

    }
    return <div className="flex flex-col p-3">
        <form className="pb-3" onSubmit={handleSubmit}>
            <input className="text-black" type="text" autoComplete="off" autoFocus name="id" id="id" placeholder="Masukkan ID ..." onChange={e => setId(e.target.value)} value={id} />
            <button className="bg-slate-400 mx-1 px-2 rounded-md" type="submit">Absen</button>
        </form>
        <ul>
            {history.map((data, i) => <li key={i} className="text-white">{data}</li>)}
        </ul>
    </div>
}