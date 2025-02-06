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

const ITEMS_PER_PAGE = 8;

export default function AllSheet() {
  const [scores, setScores] = useState<Score[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    async function fetchScores(): Promise<void> {
      if (!user_id) {
        console.error("User ID is not available.");
        return;
      }

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("Access Token is not available.");
        return;
      }

      try {
        const response = await fetch(
          `http://52.78.134.101:5000/users/${user_id}/musicsheets`,
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
        setScores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load scores:", error);
        setScores([]);
      }
    }

    fetchScores();
  }, []);

  const fuse = new Fuse(scores, {
    keys: ["title"],
    includeScore: true,
  });

  const filteredScores = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : scores;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScores = filteredScores.slice(startIndex, endIndex);

  const handleImageClick = (sheet_id: string) => {
    router.push(`/allsheets/${sheet_id}`);
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
        `http://52.78.134.101:5000/musicsheets/${sheet_id}`,
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

      setScores((prevScores) =>
        prevScores.filter((score) => score.sheet_id !== sheet_id)
      );
    } catch (error) {
      console.error("Failed to delete score:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredScores.length / ITEMS_PER_PAGE)) {
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
          <input
            type="text"
            className={style.Searchbar}
            placeholder="Hinted search text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={style.TrailingElements}>
            <div className={style.searchicon}>
              <Image
                src="/search.svg"
                width={18}
                height={18}
                alt="Search Icon"
              />
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
                onClick={() => handleImageClick(score.sheet_id)}
              >
                <Image
                  src="/delete.svg"
                  alt="Delete Icon"
                  width={21}
                  height={19}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(score.sheet_id);
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

          <div className={style.pagination}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={style.pageButton}
            >
              Previous
            </button>
            <span className={style.pageInfo}>
              Page {currentPage} of{" "}
              {Math.ceil(filteredScores.length / ITEMS_PER_PAGE)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage ===
                Math.ceil(filteredScores.length / ITEMS_PER_PAGE)
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
