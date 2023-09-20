"use client";
import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

export default function AddUser({ role }) {
  const [value, setValue] = useState(new Set([]));
  const [selected, setSelected] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSelectionChange = (e) => {
    const selectedRole = e.target.value;
    setSelected(selectedRole);
    if (selectedRole != "admin") {
      setUsername("");
      setPassword("");
      setRePassword("");
    }
  };
  const handlePress = async () => {
    if (name == "" || role == "") return alert("Peran atau Nama harus diisi!");
    const res = await fetch("http://localhost:3001/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        role: selected,
        name,
        id,
        username,
        password,
        rePassword,
      }),
    });
    const json = await res.json();
    return alert(json.message);
  };
  const router = useRouter();

  return (
    <div>
      <h1>Tambah User</h1>
      <form>
        <Select
          label="Peran"
          placeholder="Pilih peran"
          className=""
          selectedKeys={value}
          onSelectionChange={setValue}
          onChange={handleSelectionChange}
        >
          {role.map((item) => (
            <SelectItem key={item.role} value={item.role}>
              {item.role}
            </SelectItem>
          ))}
        </Select>

        <h1>{value}</h1>
        <Input
          type="text"
          label="Nama"
          placeholder="Masukkan nama"
          value={name}
          onValueChange={setName}
        />
        <Input
          type="text"
          label="Id"
          placeholder="Masukkan id"
          value={id}
          onValueChange={setId}
        />
        <AdminSection
          selected={selected}
          username={username}
          password={password}
          rePassword={rePassword}
          setUsername={setUsername}
          setPassword={setPassword}
          setRePassword={setRePassword}
        />
        <Button
          color="danger"
          variant="ghost"
          onPress={() => router.push("/user")}
        >
          Batal
        </Button>
        <Button color="primary" variant="ghost" onPress={handlePress}>
          Tambah
        </Button>
      </form>
      <p>
        Data : {selected}, {name}, {id}, {username}, {password}, {rePassword}
      </p>
    </div>
  );
}

const AdminSection = ({
  selected,
  username,
  password,
  rePassword,
  setUsername,
  setPassword,
  setRePassword,
}) => {
  if (selected == "admin") {
    return (
      <>
        <Input
          type="text"
          label="Username"
          placeholder="Masukkan username"
          value={username}
          onValueChange={setUsername}
        />
        <Input
          type="password"
          label="Password"
          placeholder="Masukkan password"
          value={password}
          onValueChange={setPassword}
        />
        <Input
          type="password"
          label="Ulangi Password"
          placeholder="Ulangi password"
          value={rePassword}
          onValueChange={setRePassword}
        />
      </>
    );
  }
  return;
};
