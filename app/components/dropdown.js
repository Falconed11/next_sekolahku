"use client";
import { useState } from "react";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
// import Card from "./card";

function Card({ icon, value, title, bg }) {
  const style = `${bg} flex mt-5 flex-row rounded text-white`;
  return (
    <div className={style}>
      <FontAwesomeIcon className="pr-1 m-3 text-5xl" icon={icon} />
      <div className="flex flex-col m-3">
        <div>{title}:</div>
        <div>{value}</div>
      </div>
    </div>
  );
}

export default function DropDown({ title, message, option, list }) {
  const [selectedValue, setSelectedValue] = useState("");
  let hadir = list.length;
  if (selectedValue != "")
    hadir = list.filter((user) => user.role == selectedValue).length;

  const tepatwaktu = 3;
  const terlambat = hadir - tepatwaktu;
  const tidakhadir = 1;
  return (
    <>
      <div>
        <label /* for={title} */>{message}: </label>
        <select
          onChange={(e) => setSelectedValue(e.target.value)}
          className="text-black"
          name={title}
          id={title}
        >
          {option.map((item, i) => (
            <option key={i} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <Card bg="bg-cyan-600" icon={faUser} title="Hadir" value={hadir} />
      <Card
        bg="bg-lime-500"
        icon={faUser}
        title="Tepat Waktu"
        value={tepatwaktu}
      />
      <Card
        bg="bg-yellow-500"
        icon={faUser}
        title="Terlambat"
        value={terlambat}
      />
      <Card
        bg="bg-red-700"
        icon={faUser}
        title="Tidak Hadir"
        value={tidakhadir}
      />
    </>
  );
}
