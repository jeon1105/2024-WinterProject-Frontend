// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { users } from "./users"; // users 배열을 가져옵니다.

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { nickname, password } = req.body;

    const user = users.find(
      (user) => user.nickname === nickname && user.password === password
    );

    if (user) {
      return res
        .status(200)
        .json({ message: "로그인 성공!", user: { nickname } });
    } else {
      return res
        .status(401)
        .json({ message: "닉네임 또는 비밀번호가 일치하지 않습니다." });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
