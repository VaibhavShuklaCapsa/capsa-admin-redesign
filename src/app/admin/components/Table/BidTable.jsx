import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getStatusColor } from "../../constants";
import StatusBadge from "../ui/StatusBadge";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { endOfWeek, format } from "date-fns";

const BidTable = ({
  tableHeader,
  tableData,
  actions = [],
  handleAccept,
  handleReject,
  dropDownAction = false,
  dropActionContent = [],
  bg = "",
  rounded = true
}) => {
  function isValidDate(dateString) {
    if (typeof (dateString) !== 'string') {
      return false;
    }
    const dateObj = new Date(dateString);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }
  return (
    <div className={`${rounded ? 'rounded-lg border' : 'border-y'} overflow-hidden bg-[#fff]`}>
      <Table >
        <TableHeader className={`${bg ? 'bg-[#fff]' : ''}`}>
          <TableRow className="bg-[#fff]">
            {tableHeader?.map((col) => (
              <TableHead
                key={col?.key}
                className={"px-6 py-6 text-left  font-bold text-grey"}
              >
                {col?.key}
              </TableHead>
            ))}
            {actions.length > 0 || dropDownAction && (
              // <th className="px-3"></th>
              <TableHead
                className={`px-4 py-6 ${dropDownAction ? "text-right" : "text-left"} font-extrabold text-grey`}
              >
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody className={`${bg ? 'bg-[#fff]' : ''}`}>
          {tableData?.length &&
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                {tableHeader.map((col) => (
                  <TableCell
                    key={col?.key}
                    className={`px-6 py-6 cursor-pointer ${col?.color ? `${col?.color}` : "text-tableGrey"} max-w-[15vw] truncate`}
                  >
                    {col?.title === "status" ? (
                      <StatusBadge status={row[col.title]} />
                    ) : col?.title.toLowerCase().includes('date') && isValidDate(row[col.title]) ? format(row[col.title], 'LLL dd, y') : typeof (row[col.title]) === "string" ? row[col.title] : (row[col.title])?.toLocaleString()}
                  </TableCell>
                ))}
                {actions.map((action) => (
                  <TableCell
                    className={"px-4 py-6 cursor-pointer"}
                    key={action}
                    onClick={() =>
                      action === "Reject"
                        ? handleReject(idx)
                        : action === "Accept"
                          ? handleAccept(idx)
                          : null
                    }
                  >
                    <p
                      className={`${action === "Reject"
                          ? "text-[#B91C1C] font-bold inline-flex gap-2"
                          : action === "Accept"
                            ? "text-blue font-bold inline-flex gap-2"
                            : action === "Accepted" || action === "Rejected"
                              ? `${getStatusColor(action)} font-medium w-fit px-4 rounded-dm`
                              : "text-tableGrey"
                        }`}
                    >
                      {(action === "Reject" ||
                        action === "Accept") && (
                          <Image
                            src={
                              action === "Reject"
                                ? "/icons/cancel.svg"
                                : "/icons/pass.svg"
                            }
                            width={action === "Reject" ? 10 : 20}
                            height={action === "Reject" ? 10 : 20}
                            alt="icon"
                          />
                        )}
                      {action}
                    </p>
                  </TableCell>
                ))}

                {
                  dropDownAction && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className={"cursor-pointer"}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        {dropActionContent?.length > 0 && <DropdownMenuContent align="end" className={"min-w-56"}>
                          <DropdownMenuItem className={"text-customBlack font-semibold p-4 cursor-pointer"}>Actions</DropdownMenuItem>
                          <hr />
                          {
                            dropActionContent?.map((action, idx) => (
                              <DropdownMenuItem key={idx} className={`p-4 text-sm cursor-pointer ${action?.title === "Delete" ? "text-[#EF4444]" : ""}`} onClick={() => action?.handleClick && action?.handleClick(row)}>{action?.title}</DropdownMenuItem>
                            ))
                          }
                        </DropdownMenuContent>}
                      </DropdownMenu>
                    </TableCell>
                  )
                }
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BidTable;
