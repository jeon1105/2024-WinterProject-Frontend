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
  const [stage, setStage] = useState("");

  const user_id = localStorage.getItem("user_id");
  console.log(user_id);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/");
    }
  }, [router]);

  const addPdfUrl = usePdfStore((state) => state.addPdfUrl);

  const handleConfirm = async () => {
    if (!user_id) {
      console.error("userId is null or undefined");
      return;
    }

    const data = new FormData();
    console.log(data);
    data.append("user_id", user_id);
    console.log("user_id:", data.get("user_id"));
    data.append("title", title);
    console.log("title:", data.get("title"));
    data.append("composer", composer);
    console.log("composer:", data.get("composer"));
    data.append("instrument", instrument);
    console.log("instrument:", data.get("instrument"));
    data.append("stage", stage);
    console.log("stage:", data.get("stage"));

    if (file) {
      data.append("file", file);
      console.log("file:", data.get("file"));
    }
    const accessToken = localStorage.getItem("access_token");
    console.log(accessToken);

    try {
      const response = await fetch(
        "http://52.78.134.101:5000/api/musicsheets/convert",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더 추가
          },
          body: data,
          credentials: "include", // 쿠키와 자격 증명을 함께 보내기
        }
      );

      if (response.ok) {
        const result = await response.json();
        const pdfUrl = result.pdf_url;
        console.log(result);
        if (pdfUrl) {
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
      console.log(file);
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

  const [uploadedData, setUploadedData] = useState<{
    title: string;
    composer: string;
    instrument: string;
    stage: string;
  }>({
    title: "",
    composer: "",
    instrument: "",
    stage: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const handleUpload = () => {
    setUploadedData({
      title,
      composer,
      instrument,
      stage,
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
              placeholder="Enter Composer Name"
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
                  setInstrument("Piano");
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
                  setInstrument("Guitar");
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
                onClick={() => {
                  toggleButton("row2", "Violin");
                  setInstrument("Violin");
                }}
              >
                Violin
              </button>
            </div>
          </div>

          <div className={style.row4}>
            <h1 className={style.title}>Difficulty Stage</h1>
            <div className={style.button_group}>
              <button
                className={
                  activeButtons.row4 === "Beginner"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => {
                  toggleButton("row4", "Beginner");
                  setStage("Beginner");
                }}
              >
                Beginner
              </button>
              <button
                className={
                  activeButtons.row4 === "Intermediate"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => {
                  toggleButton("row4", "Intermediate");
                  setStage("Intermediate");
                }}
              >
                Intermediate
              </button>
              <button
                className={
                  activeButtons.row4 === "Advanced"
                    ? style.button_Action
                    : style.button
                }
                onClick={() => {
                  toggleButton("row4", "Advanced");
                  setStage("Advanced");
                }}
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
            <button className={style.Confirm} onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>

        <div className={style.right}>
          <div className={style.Item}>
            <div className={style.frame}>
              <Image src="/frameIcon.svg" alt="Icon" width={60} height={60} />
            </div>
            <div className={style.component1}>
              <h1 className={style.title}>Song Title: {uploadedData.title}</h1>
              <h1 className={style.subtitle}>
                Composer: {uploadedData.composer}
              </h1>
            </div>
            <div className={style.component2}>
              <h1>Instrument: {uploadedData.instrument}</h1>
              <h1>Difficulty: {uploadedData.stage}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
