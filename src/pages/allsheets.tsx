import NavigationBar from "@/widgets/header";
import { useEffect, useState } from "react";
import style from "./allsheets.module.css";
import Image from "next/image";

type Score = {
  title: string;
  composer: string;
  instrument: string;
};

export default function AllSheet() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    async function fetchScores(): Promise<void> {
      try {
        const response = await fetch("/api/scores");
        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data: Score[] = await response.json(); // 데이터의 타입 명시
        setScores(data); // 상태 업데이트
      } catch (error) {
        console.error("Failed to load scores:", error);
      }
    }

    fetchScores();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className={style.window}>
        <div className={style.container}>
          {/* 제목 컨테이너 */}
          <div className={style.container}>
            <h1 className={style.titleContainer}>Uploaded Scores</h1>
            <p className={style.subtitle}>
              View and manage your converted PDF scores.
            </p>
          </div>

          <div className={style.list}>
            {/* Top row of 4 items */}
            <div className={style.row}>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image src="/sheet.svg" alt="Icon" width={90} height={90} />
                </div>
                <div className={style.Box}>
                  {/* Add more details here if needed */}
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image src="/sheet.svg" alt="Icon" width={90} height={90} />
                </div>
                <div className={style.Box}>
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image src="/sheet.svg" alt="Icon" width={90} height={90} />
                </div>
                <div className={style.Box}>
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image src="/sheet.svg" alt="Icon" width={90} height={90} />
                </div>
                <div className={style.Box}>
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
            </div>

            {/* Bottom row of 4 items */}
            <div className={style.row}>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image src="/sheet.svg" alt="Icon" width={90} height={90} />
                </div>
                <div className={style.Box}>
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image src="/sheet.svg" alt="Icon" width={90} height={90} />
                </div>
                <div className={style.Box}>
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image src="/sheet.svg" alt="Icon" width={90} height={90} />
                </div>
                <div className={style.Box}>
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
              <div className={style.Item}>
                <div className={style.frame}>
                  <Image
                    src="/sheet.svg"
                    alt="Icon"
                    width={90}
                    height={90}
                    style={{ left: -30 }}
                  />
                </div>
                <div className={style.Box}>
                  <div className={style.title}></div>
                  <div className={style.subtitle}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
