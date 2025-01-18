import { musicSheetData } from "@/type";

export default async function fecthUpload(
  q?: string
): Promise<musicSheetData[]> {
  let url = `http://52.78.134.101:5000/musicsheets/convert`;

  if (q) {
    url += `/search?q=${q}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
