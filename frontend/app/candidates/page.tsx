import { Suspense } from "react";
import { DataTable } from "@/components/data-table";
import { CandidateProfile, columns } from "@/components/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getCandidates } from "@/actions";

const CandidatesPage = async () => {

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
        <DataTable columns={columns} data={candidates as CandidateProfile[]} />
      </Suspense>
    </div>
  );
};

export default CandidatesPage;
