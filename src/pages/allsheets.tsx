import NavigationBar from "@/widgets/header";
import { useEffect, useState } from "react";
import style from "./allsheets.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import fecthUpload from "@/lib/fetch-upload";
import Fuse from "fuse.js";

type Score = {
  title: string;
  sheet_id: string;
};

export const getStaticProps = async () => {
  const allSheets = await fecthUpload();
  return {
    props: {
      allSheets,
    },
  };
};

const ITEMS_PER_PAGE = 8; // 한 페이지에 보여줄 악보 개수

export default function AllSheet() {
  const [scores, setScores] = useState<Score[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const router = useRouter();

  useEffect(() => {
    const dummyData: Score = {
      title: "Dummy Score",
      sheet_id: "dummy_id",
    };

    setScores([dummyData]); // 기본적으로 더미 데이터로 초기화

    const fetchScores = async () => {
      const user_id = localStorage.getItem("user_id");
      const accessToken = localStorage.getItem("access_token");

      if (!user_id || !accessToken) {
        console.error("User ID or Access Token is missing");
        return;
      }

      try {
        const response = await fetch(
          `https://smini.site/users/${user_id}/musicsheets`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // 서버 데이터가 있다면 교체
        if (Array.isArray(data)) {
          setScores([dummyData, ...data]);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  console.log(scores);

  // 현재 페이지에 표시할 악보 계산
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScores = scores.slice(startIndex, endIndex);

  const handleImageClick = async (sheet_id: string) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.error("Access Token is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://smini.site/musicsheets/${sheet_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post to server");
      }

      // 요청이 성공하면 페이지 이동
      router.push(`/allsheets/${sheet_id}`);
      console.log(response);
    } catch (error) {
      console.error("Failed to post to server:", error);
    }
  };

  const handleDeleteClick = async (sheet_id: string) => {
    const user_id = localStorage.getItem("user_id");
    const accessToken = localStorage.getItem("access_token");

    if (!user_id || !accessToken) {
      console.error("User ID or Access Token is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://smini.site/musicsheets/${sheet_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete score");
      }

      // 삭제 후, 로컬 상태에서 해당 악보를 제거
      setScores((prevScores) =>
        prevScores.filter((score) => score.sheet_id !== sheet_id)
      );
    } catch (error) {
      console.error("Failed to delete score:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(scores.length / ITEMS_PER_PAGE)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className={style.window}>
        <div className={style.container}>
          <div className={style.Searchbar}>
            <div className={style.state}>
              <div className={style.supportcontent}>
                <h1 className={style.supportingtext}>Hinted search text</h1>
              </div>
              <div className={style.TrailingElements}>
                <Image src="/search.svg" width={18} height={18} alt={""} />
              </div>
            </div>
          </div>
          <h1 className={style.titleContainer}>Uploaded Scores</h1>
          <p className={style.subtitle}>
            View and manage your converted PDF scores.
          </p>
          <div className={style.list}>
            {currentScores.map((score) => (
              <div
                key={score.sheet_id}
                className={style.Item}
                onClick={() => router.push(`/allsheets/${score.sheet_id}`)} // 수정된 부분
              >
                <Image
                  src="/delete.svg"
                  alt="Delete Icon"
                  width={21}
                  height={19}
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트 버블링 방지
                    handleDeleteClick(score.sheet_id); // 삭제 요청
                  }}
                />
                <div className={style.frame}>
                  <Image
                    src="/sheet.svg"
                    alt={score.title}
                    width={90}
                    height={90}
                  />
                </div>
                <div className={style.Box}>
                  <div className={style.title}>{score.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 버튼 */}
          <div className={style.pagination}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={style.pageButton}
            >
              Previous
            </button>
            <span className={style.pageInfo}>
              Page {currentPage} of {Math.ceil(scores.length / ITEMS_PER_PAGE)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage === Math.ceil(scores.length / ITEMS_PER_PAGE)
              }
              className={style.pageButton}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
