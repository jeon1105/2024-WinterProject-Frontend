import { musicSheetData } from "@/type";

export default async function fecthSheets(
  q?: string
): Promise<musicSheetData[]> {
  let url = `http://52.78.134.101:5000/musicsheets/convert`;

  if (q) {
    url += `/search?q=${q}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Error fetching the sheet:", err);
    return []; // 에러 발생 시 빈 배열을 반환
  }
}
