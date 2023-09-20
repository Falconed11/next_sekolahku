"use client";
import { clientFetch, getApiPath } from "../utils/apiConfig";
import {
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  getKeyValue,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import Link from "next/link";
import { EyeIcon, EditIcon, DeleteIcon } from "../components/icon";

const apiPath = getApiPath();

export default function User() {
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [abc, setAbc] = useState({});
  const [form, setForm] = useState({ abc });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const editButtonClick = (id) => {
    setSelectedId(id);
    return onOpen();
  };
  const handleSelectionChange = (e) => {
    setSelectedRole(e.target.value);
  };
  const { data, error, isLoading } = clientFetch(`user`);
  const columns = [
    {
      key: "custom_id",
      label: "Id",
    },
    {
      key: "name",
      label: "Nama",
    },
    {
      key: "role",
      label: "Peran",
    },
    {
      key: "actions",
      label: "Aksi",
    },
  ];
  const role = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "admin", label: "Admin" },
  ];
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  let procData = data;
  procData = selectedRole
    ? procData.filter((item) => item.role == selectedRole)
    : procData;
  procData = name
    ? procData.filter((item) => item.name.includes(name))
    : procData;
  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span
                onClick={() => editButtonClick(item.id)}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div>
      <div className="flex pt-2">
        <Input
          type="text"
          label="Name:"
          placeholder="Name"
          value={name}
          onValueChange={setName}
        />
        <Select
          label="Filter by:"
          placeholder="None"
          className="max-w-xs pl-2"
          selectedKeys={new Set([selectedRole])}
          onSelectionChange={(val) =>
            setSelectedRole(val.values().next().value)
          }
        >
          {role.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Link
          className="ml-2 p-1 bg-default-100 text-default-500 rounded-lg"
          href="./user/add"
        >
          Tambah User
        </Link>
      </div>
      <MyModal id={selectedId} setAbc={setAbc} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit User
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Id"
                  placeholder="Masukkan id!"
                  value={form.custom_id}
                  onValueChange={(val) => setForm((form.custom_id = val))}
                />
                <Input
                  label="Nama"
                  placeholder="Masukkan nama!"
                  value={form.name}
                  onValueChange={(val) => setForm((form.name = val))}
                />
                <Select
                  label="Peran:"
                  placeholder="Pilih peran?"
                  className="max-w-xs pl-2"
                  selectedKeys={new Set([form.role])}
                  onSelectionChange={(val) =>
                    setForm((form.role = val.values().next().value))
                  }
                >
                  {role.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    const res = await fetch(`${apiPath}user`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: JSON.stringify(form),
                    });
                    if (res.status >= 400 && res.status < 500) {
                      console.log(res.status);
                      alert(await res.json().then((e) => e.message));
                      return;
                    }
                    alert("User berhasil diubah.");
                    return onClose();
                  }}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table className="pt-2" aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={procData}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const MyModal = ({ id, setAbc }) => {
  if (id) {
    const { data, error, isLoading } = clientFetch(`user?id=${id}`);
    if (error) return <div>failed to load</div>;
    if (isLoading) return;
    data[0].id = id;
    setAbc(data[0]);
  }
  return <></>;
};
