import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false, // formidable을 사용하기 위해 bodyParser를 비활성화
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the files:", err);
      return res.status(500).json({ error: "Error parsing the files" });
    }

    const file = files.file;

    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: "Invalid file upload" });
    }

    try {
      console.log("Filepath:", (file as formidable.File).filepath);
      const data = await fs.readFile((file as formidable.File).filepath);
      console.log(data);

      // 파일 처리 후 응답
      return res.status(200).json({ pdf_url: "/path/to/generated/pdf" });
    } catch (error) {
      console.error("Error handling the file:", error);
      return res.status(500).json({ error: "Error handling the file" });
    }
  });
};

export default handler;
