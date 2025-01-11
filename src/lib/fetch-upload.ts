import { musicSheetData } from "@/type";

export default async function fetchSheet(): Promise<musicSheetData> {
  const url = `https://musopen.org/ko/music/9242-flute-concerto-in-g-major-h-445/`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}
