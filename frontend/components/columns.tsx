"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

export type CandidateProfile = {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string | null;
  mobileNumber: string;
  currentCity: string;
  dateOfBirth: string;
  extractedAt: Date;
  gender: string;
  availableForRelocation: boolean;
};

export const columns: ColumnDef<CandidateProfile>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "emailId",
    header: "Email",
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "currentCity",
    header: "City",
  },
  {
    accessorKey: "availableForRelocation",
    header: "Relocation",
    cell: ({ row }) => {
      return row.getValue("availableForRelocation") ? "Yes" : "No";
    },
  },
  {
    accessorKey: "extractedAt",
    header: "Processed At",
    cell: ({ row }) => {
      return new Date(row.getValue("extractedAt")).toLocaleString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link href={`/candidates/${row.original.id}`}>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
];