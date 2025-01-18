import { NextApiRequest, NextApiResponse } from "next";
import { users } from "./users"; // users 배열을 가져옵니다.

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { user_id, password } = req.body;

    // ID로 사용자 찾기
    const user = users.find((user) => user.user_id === user_id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "존재하지 않는 ID입니다. 회원가입을 진행해주세요." });
    }

    // 비밀번호 검증
    if (user.password !== password) {
      return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
    }

    // 로그인 성공
    return res.status(200).json({
      message: "로그인 성공!",
      user: { user_id: user.user_id, nickname: user.nickname },
    });
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
