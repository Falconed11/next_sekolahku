"use client";
import { getApiPath } from "../utils/apiConfig";
import { getCurrentDate, formatDate, formatTime } from "../utils/date";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import React, { useState } from "react";
import { clientFetch } from "../utils/apiConfig";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

export default function Laporan() {
  const currentDate = getCurrentDate();
  const [startDate, setStartDate] = useState(new Date(currentDate));
  const selectedDate = formatDate(startDate);

  const { data, error, isLoading } = clientFetch(
    `attendance/?date=${selectedDate}`
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const columns = [
    {
      key: "custom_id",
      label: "Id",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "time",
      label: "Absen",
    },
    {
      key: "status",
      label: "Status",
    },
  ];
  const formatedData = data.map((item) => {
    if (item.time > "07:00:00") item.status = "Terlambat";
    else item.status = "Tepat Waktu";
    return item;
  });
  const rows = formatedData;
  /* data.filter((row) => {
    console.log(row.datetime);
    row.datetime = formatTime(row.datetime);
    return row;
  }); */

  return (
    <div>
      <DatePicker
        locale="id"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.custom_id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
