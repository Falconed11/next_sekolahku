"use client";
import { useClientFetch, getApiPath } from "../utils/apiConfig";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import Link from "next/link";
import { EyeIcon, EditIcon, DeleteIcon } from "../components/icon";
import { IoAdd } from "react-icons/io5";

const apiPath = getApiPath();

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

export default function Page() {
  const { data, error, isLoading } = useClientFetch("user");
  const [filter, setFilter] = useState(new Set([]));
  const [name, setName] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [srcModal, setSrcModal] = useState();
  const [form, setForm] = useState({ custom_id: "", name: "", role: "" });
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const saveButtonPress = async () => {
    if (form.custom_id == "" || form.name == "" || form.role == "")
      return alert("Id, Peran, dan Nama harus diisi!");
    const method = srcModal ? "PUT" : "POST";
    const res = await fetch(`${apiPath}user`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    return alert(json.message);
  };

  const deleteButtonPress = async (id) => {
    if (confirm("Hapus user?")) {
      const res = await fetch(`${apiPath}user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ id }),
      });
      if (res.status == 200) return alert("User Berhasil di Hapus.");
      const json = await res.json();
      const err = await json.message;
      return alert(err);
    }
  };

  let procData = data;
  procData = name
    ? procData.filter((row) => row.name.includes(name))
    : procData;
  procData =
    filter.size != 0
      ? procData.filter((row) => row.role == filter.values().next().value)
      : procData;

  const renderCell = (data, columnKey) => {
    const cellValue = data[columnKey];
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
                onClick={() => {
                  setSrcModal(data.id);
                  setForm(procData.filter((row) => row.id == data.id)[0]);
                  return onOpen();
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => {
                  deleteButtonPress(data.id);
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const modalForm = srcModal ? (
    <EditForm id={srcModal} procData={procData} form={form} setForm={setForm} />
  ) : (
    <AddForm form={form} setForm={setForm} />
  );
  const modalTitle = srcModal ? "Edit User" : "Tambah User";
  const btnLabel = srcModal ? "Simpan" : "Tambah";

  return (
    <div>
      <div className="flex flex-row">
        <Input
          label="Cari nama:"
          placeholder="Masukkan nama"
          value={name}
          onValueChange={setName}
        />
        <Select
          label="Filter berdasarkan:"
          placeholder="Pilih filter"
          selectedKeys={filter}
          onSelectionChange={setFilter}
        >
          {role.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Button
          onPress={() => {
            setForm({ custom_id: "", name: "", role: "" });
            setSrcModal();
            return onOpen();
          }}
          color="primary"
          variant="ghost"
        >
          <div className="text-3xl">
            <IoAdd />
          </div>
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalTitle}
              </ModalHeader>
              <ModalBody>{modalForm}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" onPress={saveButtonPress}>
                  {btnLabel}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table aria-label="Example table with custom cells">
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

const AddForm = ({ form, setForm }) => {
  const [select, setSelect] = useState(new Set([]));
  return (
    <>
      <Input
        type="text"
        label="Id:"
        placeholder="Masukkan id"
        value={form.custom_id}
        onValueChange={(val) => setForm({ ...form, custom_id: val })}
      />
      <Input
        type="text"
        label="Nama:"
        placeholder="Masukkan nama"
        value={form.name}
        onValueChange={(val) => setForm({ ...form, name: val })}
      />
      <Select
        label="Filter berdasarkan:"
        placeholder="Pilih filter"
        selectedKeys={select}
        onSelectionChange={setSelect}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        {role.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
    </>
  );
};

const EditForm = ({ form, setForm }) => {
  // if (src == "add") return <>asd</>;
  const [select, setSelect] = useState(new Set([form.role]));
  return (
    <>
      <Input
        type="text"
        label="Id:"
        placeholder="Masukkan id"
        value={form.custom_id}
        onValueChange={(val) => setForm({ ...form, custom_id: val })}
      />
      <Input
        type="text"
        label="Nama:"
        placeholder="Masukkan nama"
        value={form.name}
        onValueChange={(val) => setForm({ ...form, name: val })}
      />
      <Select
        label="Filter berdasarkan:"
        placeholder="Pilih filter"
        selectedKeys={select}
        onSelectionChange={setSelect}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        {role.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
    </>
  );
};
