import { musicSheetData } from "@/type";

export default async function fetchSheet(): Promise<musicSheetData | null> {
  const url = `https://musopen.org/ko/music/9242-flute-concerto-in-g-major-h-445/`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching the sheet:", err);
    return null; // 에러 발생 시 null을 반환
  }
}
