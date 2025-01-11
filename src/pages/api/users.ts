import { NextApiRequest, NextApiResponse } from "next";

interface User {
  nickname: string;
  password: string;
}

export const users: User[] = []; // 간단한 메모리 기반 사용자 저장소

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request received:", req.method, req.url);
  if (req.method === "POST") {
    const { nickname, password } = req.body;

    // 닉네임이나 비밀번호가 없을 경우
    if (!nickname || !password) {
      return res
        .status(400)
        .json({ message: "닉네임과 비밀번호를 입력해주세요." });
    }

    // 닉네임 중복 체크
    const existingUser = users.find((user) => user.nickname === nickname);
    if (existingUser) {
      return res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
    }

    // 사용자 저장
    users.push({ nickname, password });
    return res
      .status(201)
      .json({ message: "회원가입 성공!", user: { nickname } });
  }

  // 허용되지 않은 메서드
  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
