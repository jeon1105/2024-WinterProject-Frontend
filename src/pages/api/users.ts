import { NextApiRequest, NextApiResponse } from "next";

interface User {
  user_id: string;
  nickname: string;
  password: string;
}

export const users: User[] = []; // 간단한 메모리 기반 사용자 저장소

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request received:", req.method, req.url);

  if (req.method === "POST") {
    const { nickname, user_id, password } = req.body;

    // 모든 필드 유효성 검사
    if (!user_id || !nickname || !password) {
      return res
        .status(400)
        .json({ message: "ID, 닉네임, 비밀번호를 모두 입력해주세요." });
    }

    // ID 중복 체크
    const existingId = users.find((user) => user.user_id === user_id);
    if (existingId) {
      return res.status(409).json({ message: "이미 사용 중인 ID입니다." });
    }

    // 닉네임 중복 체크
    const existingUser = users.find((user) => user.nickname === nickname);
    if (existingUser) {
      return res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
    }

    // 사용자 저장
    users.push({ user_id, nickname, password });

    return res.status(201).json({
      message: "회원가입 성공!",
      user: { user_id, nickname },
    });
  }

  // 허용되지 않은 메서드 처리
  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
