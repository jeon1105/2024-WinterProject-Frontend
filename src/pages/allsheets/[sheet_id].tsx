import { useState } from "react";
import NavigationBar from "@/widgets/header";
import Image from "next/image";
import style from "./individualsheet.module.css";
import { GetServerSidePropsContext } from "next";

type MusicSheet = {
  instrument: string;
  stage: string;
  pdf_url: string;
};

type Props = {
  musicsheet: MusicSheet;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { sheet_id } = context.params!;

  try {
    // src/api/generatePdf 경로로 요청을 보냅니다.
    const res = await fetch(`localhost:3000/allsheets/${sheet_id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch music sheet");
    }
    const data = await res.json();

    // 데이터가 없거나 오류가 발생한 경우 처리
    if (!data.sheet_id) {
      return { notFound: true };
    }

    return { props: { musicsheet: data } }; // 반환된 데이터를 props로 전달
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export default function MusicSheetPage({ musicsheet }: Props) {
  const [showPreview, setShowPreview] = useState(false); // 미리보기 상태

  const handlePreview = () => {
    setShowPreview(!showPreview); // 버튼을 누를 때마다 미리보기 토글
  };

  return (
    <>
      <NavigationBar />
      <div className={style.window}>
        <h1 className={style.title}>Music Scores</h1>
        <div className={style.content}>
          <div className={style.icon}>
            <Image
              src="/sheet.svg"
              alt="Music Sheet Icon"
              width={90}
              height={90}
            />
          </div>
          <h2 className={style.subtitle}>{musicsheet.instrument}</h2>
          <p className={style.description}>
            Difficulty Level: {musicsheet.stage}
          </p>
          <div className={style.buttons}>
            <button onClick={handlePreview} className={style.button}>
              {showPreview ? "Close Preview" : "Preview PDF"}
            </button>
            <a
              href={musicsheet.pdf_url}
              target="_blank"
              download={musicsheet.pdf_url}
              className={style.button}
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* PDF 미리보기 영역 */}
        {showPreview && (
          <div className={style.preview}>
            <iframe
              src={musicsheet.pdf_url}
              width="100%"
              height="600px"
              className={style.iframe}
            ></iframe>
          </div>
        )}

        <div className={style.additionalInfo}>
          <p className={style.text}>Instrument: {musicsheet.instrument}</p>
          <p className={style.text}>Stage: {musicsheet.stage}</p>
        </div>
      </div>
    </>
  );
}
