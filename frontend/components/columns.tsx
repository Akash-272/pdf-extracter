"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type CandidateProfile = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  emailId: string | null;
  mobileNumber: string;
  currentCity: string;
  dateOfBirth: string;
  extractedAt: Date;
  gender: string;
  availableForRelocation: boolean;
  passport: string | null;
  panNumber: string | null;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
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
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      return <div className="font-medium">{firstName || "N/A"}</div>;
    }
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
    cell: ({ row }) => {
      const lastName = row.getValue("lastName") as string;
      return <div>{lastName || "N/A"}</div>;
    }
  },
  {
    accessorKey: "emailId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile",
  },
  {
    accessorKey: "currentCity",
    header: "City",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
  },
  {
    accessorKey: "passport",
    header: "Passport",
    cell: ({ row }) => {
      const passport = row.getValue("passport") as string;
      return <div>{passport || "N/A"}</div>;
    }
  },
  {
    accessorKey: "panNumber",
    header: "PAN Number",
    cell: ({ row }) => {
      const panNumber = row.getValue("panNumber") as string;
      return <div>{panNumber || "N/A"}</div>;
    }
  },
  {
    accessorKey: "emergencyContactName",
    header: "Emergency Contact",
    cell: ({ row }) => {
      const name = row.getValue("emergencyContactName") as string;
      const number = row.original.emergencyContactNumber;
      return (
        <div>
          <div>{name || "N/A"}</div>
          <div className="text-sm text-gray-500">{number || "N/A"}</div>
        </div>
      );
    }
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
];