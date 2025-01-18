import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavigationBar from "@/widgets/header";
import style from "@/styles/Home.module.css";
import Image from "next/image";

import { usePdfStore } from "./stores/pdfStore";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [instrument, setInstrument] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    // localStorage에서 로그인 정보를 가져옴
    const user = localStorage.getItem("user");

    if (!user) {
      // 로그인하지 않은 경우, 로그인 페이지로 리디렉션
      router.push("/");
    }
  }, [router]);

  const addPdfUrl = usePdfStore((state) => state.addPdfUrl);

  // Confirm 버튼 클릭 시 데이터 API로 보내고, pdf_url로 /allsheets로 이동
  const handleConfirm = async () => {
    const data = new FormData();
    data.append("title", title);
    data.append("composer", composer);
    data.append("instrument", instrument);
    data.append("level", level);

    // 파일 추가
    if (file) {
      data.append("file", file);
    }

    try {
      const response = await fetch("/api/generatePdf", {
        method: "POST",
        body: data, // FormData를 body로 전송
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        const pdfUrl = result.pdf_url;
        console.log(pdfUrl);
        if (pdfUrl) {
          // PDF URL을 zustand에 저장
          addPdfUrl(pdfUrl);
        }
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setUploadedFileName(file.name);
      setFile(file);
      console.log("Dropped file:", file);
      // 여기에 파일 업로드 처리 로직 추가
    }
  };

  const [activeButtons, setActiveButtons] = useState<{
    [key: string]: string | null;
  }>({
    row2: null,
    row4: null,
  });

  const toggleButton = (row: string, buttonName: string) => {
    setActiveButtons((prev) => ({
      ...prev,
      [row]: prev[row] === buttonName ? null : buttonName,
    }));
  };

  const resetActiveButtons = () => {
    setActiveButtons({
      row2: null,
      row4: null,
    });
  };

  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [instrument, setInstrument] = useState("");
  const [level, setLevel] = useState("");

  // section2에 반영할 값 상태 관리
  const [uploadedData, setUploadedData] = useState<{
    title: string;
    composer: string;
    instrument: string;
    level: string;
  }>({
    title: "",
    composer: "",
    instrument: "",
    level: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const handleSelectInstrument = (instrument: string) => {
    setInstrument(instrument);
  };

  const handleSelectLevel = (level: string) => {
    setLevel(level);
  };

  // Upload 버튼 클릭 시 입력값을 section2로 전달
  const handleUpload = () => {
    setUploadedData({
      title,
      composer,
      instrument,
      level,
    });
  };

  return (
    <div className={style.window}>
      <NavigationBar />
      <div className={style.section}>
        <div
          className={style.left}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? "2px dashed #000" : "none",
          }}
        >
          <div className={style.title}>Upload Song Detail</div>
          <hr />
          <div className={style.text}>
            {uploadedFileName ? `Uploaded: ${uploadedFileName}` : "여따 드래그"}
          </div>
        </div>

        <div className={style.right}>
          <div className={style.row1}>
            <h1 className={style.title}>Song Title</h1>
            <input
              className={style.input}
              placeholder="Enter Song Title"
              value={title}
              onChange={(e) => handleInputChange(e, setTitle)}
            ></input>
          </div>

          <div className={style.row2}>
            <h1 className={style.title}>Composer Name</h1>
            <input
              className={style.input}
              placeholder="Enter Conposer Name"
              value={composer}
              onChange={(e) => handleInputChange(e, setComposer)}
            ></input>
          </div>

          <div className={style.row3}>
            <h1 className={style.title}>Instrument Type</h1>
            <div className={style.button_group}>
              <button
                className={
                  activeButtons.row2 === "Piano"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => {
                  toggleButton("row2", "Piano");
                  handleSelectInstrument("Piano");
                }}
              >
                Piano
              </button>
              <button
                className={
                  activeButtons.row2 === "Guitar"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => {
                  toggleButton("row2", "Guitar");
                  handleSelectInstrument("Guitar");
                }}
              >
                Guitar
              </button>
              <button
                className={
                  activeButtons.row2 === "Violin"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => toggleButton("row2", "Violin")}
              >
                Violin
              </button>
            </div>
          </div>

          <div className={style.row4}>
            <h1 className={style.title}>Difficulty Level</h1>
            <div className={style.button_group}>
              <button
                className={
                  activeButtons.row4 === "Beginner"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => toggleButton("row4", "Beginner")}
              >
                Beginner
              </button>
              <button
                className={
                  activeButtons.row4 === "Intermediate"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => toggleButton("row4", "Intermediate")}
              >
                Intermediate
              </button>
              <button
                className={
                  activeButtons.row4 === "Advanced"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => toggleButton("row4", "Advanced")}
              >
                Advanced
              </button>
            </div>
          </div>

          <div className={style.row5}>
            <button className={style.cancel} onClick={resetActiveButtons}>
              Cancel
            </button>
            <button className={style.upload} onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className={style.section2}>
        <div className={style.left}>
          <h1 className={style.row1}>Upload Song Detail</h1>
          <h1 className={style.row2}>마지막으로 체크해보세요.</h1>
          <div className={style.row3}>
            <button className={style.Edit}>Edit</button>
            <button className={style.Confirm}>Confirm</button>
          </div>
        </div>

        <div className={style.right}>
          <div className={style.Item}>
            <div className={style.frame}>
              <Image src="/frameIcon.svg" alt="Icon" width={60} height={60} />
            </div>
            <div className={style.component1}>
              <h1 className={style.title}>Song Title : {uploadedData.title}</h1>
              <h1 className={style.subtitle}>
                Composer : {uploadedData.composer}
              </h1>
            </div>
            <div className={style.component2}>
              <h1>Instrument: {uploadedData.instrument}</h1>
              <h1>Difficulty: {uploadedData.level}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
