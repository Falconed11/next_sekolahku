"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function Card({ items }) {
  return (
    <div className="mt-3 flex flex-row border rounded border-white text-white">
      {items.map((item, i) => {
        <>
          <FontAwesomeIcon className="pr-1" icon={item.icon} />
          <div className="flex flex-col">
            <div>{item.title}:</div>
            <div>{item.value}</div>
          </div>
        </>;
      })}
    </div>
  );
}
