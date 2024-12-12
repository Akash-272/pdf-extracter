import { Suspense } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";

async function getCandidates() {
  try {
    const candidates = await db.candidateProfile.findMany({
      orderBy: {
        extractedAt: 'desc'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailId: true,
        mobileNumber: true,
        currentCity: true,
        gender: true,
        dateOfBirth: true,
        extractedAt: true,
        availableForRelocation: true,
      }
    });
    return candidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidate Profiles</h1>
        <Link href="/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New
          </Button>
        </Link>
      </div>
      
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable columns={columns} data={candidates} />
      </Suspense>
    </div>
  );
} 