import type { musicSheetData } from "@/type";
import Link from "next/link";

export default function SheetItem({
  title,
  instrument,
  composer,
  stage,
  sheet_id,
}: musicSheetData) {
  return (
    <Link href={`sheet/${sheet_id}`}>
      <div>
        <div>{title}</div>
        <div>{composer}</div>
        <div>{instrument}</div>
        <div>{stage}</div>
      </div>
    </Link>
  );
}
