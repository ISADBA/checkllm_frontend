import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResultDetail } from "@/components/result/result-detail";
import { SiteHeader } from "@/components/home/site-header";
import { buildResultMetadata } from "@/lib/metadata";
import { getPublicResultById } from "@/lib/results";

type Props = {
  params: Promise<{ resultId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;
  const result = await getPublicResultById(resultId);

  if (!result) {
    return {
      title: "Result Not Found"
    };
  }

  return buildResultMetadata(result.summary);
}

export default async function ResultPage({ params }: Props) {
  const { resultId } = await params;
  const result = await getPublicResultById(resultId);

  if (!result) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pb-10 pt-6 sm:px-8">
      <SiteHeader compact />
      <ResultDetail result={result} />
    </main>
  );
}
