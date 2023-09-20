"use client";
import { useState, ChangeEvent } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";
import { Select, SelectItem, Input, Selection } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import Link from "next/link";

export default function MyTable({ list, role, columns }) {
  const [value, setValue] = useState(new Set([]));
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");

  const handleSelectionChange = (e) => {
    setSelectedRole(e.target.value);
  };
  console.log(selectedRole);
  list = selectedRole ? list.filter((item) => item.role == selectedRole) : list;
  list = name ? list.filter((item) => item.name.includes(name)) : list;
  return (
    <div className="flex flex-col pt-3">
      <div className="flex">
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
          selectedKeys={value}
          onSelectionChange={setValue}
          onChange={handleSelectionChange}
        >
          {role.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Link
          className="text-white ml-2 p-1 border rounded-lg"
          href="./user/add"
        >
          Tambah User
        </Link>
      </div>
      <Table
        aria-label="Example table with client side sorting"
        className="pt-3"
        /* classNames={{
                table: "min-h-[400px]",
            }} */
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {list.map((row) => (
            <TableRow key={row.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(row, columnKey)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
