"use client";

import { useState } from "react";
import { players, type Player } from "./data/players";

export default function Home() {
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<Player[]>([]);
  const [message, setMessage] = useState("");
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [teamBonusUsed, setTeamBonusUsed] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
const [showSuggestions, setShowSuggestions] = useState(false);
const suggestions = players.filter((player) =>
  player.name.toLowerCase().includes(guess.trim().toLowerCase())
);
  const [answer, setAnswer] = useState<Player>(() => {
  return players[Math.floor(Math.random() * players.length)];
});
const [showAnswer, setShowAnswer] = useState(false);
  function handleGuess() {
  if (attemptsLeft <= 0) {
    setMessage("已经用完所有机会啦！");
    return;
  }

  const input = guess.trim();

  if (!input) {
    setMessage("请输入一个选手名字！");
    return;
  }

  const player = players.find((item) => item.name === input);

  if (!player) {
    setMessage("暂时没有找到这个选手，请试试：一诺、花海、Fly");
    return;
  }

  if (guesses.some((item) => item.name === player.name)) {
    setMessage("这个选手你已经猜过啦！");
    return;
  }

  setGuesses((prev) => [...prev, player]);
  setGuess("");

  // 猜中答案
  if (player.name === answer.name) {
    setAttemptsLeft((prev) => prev - 1);
    setMessage("🎉 猜对了！恭喜你！");
    setIsWon(true);
    return;
  }

  // 猜中同队：净增加 1 次机会
  if (player.team === answer.team && !teamBonusUsed) {
    setTeamBonusUsed(true);
    setAttemptsLeft((prev) => prev + 1);
    setMessage("🎁 猜中同队选手！额外获得 1 次机会！");
    return;
  }

  // 普通猜错：消耗 1 次机会
  setAttemptsLeft((prev) => prev - 1);

  if (attemptsLeft - 1 <= 0) {
    setMessage("😢 机会已经用完！");
    setIsLost(true);
  } else {
    setMessage("❌ 还不对，根据下面的属性继续猜！");
  }
}

function getResult(value: string, target: string) {
  if (value === target) {
    return "🟩";
  }
  return "🟥";
}
function getRankValue(value: string) {
  const rankMap: Record<string, number> = {
    总决赛: 2,
    季后赛: 3,
    S组: 4,
    A组: 5,
    B组: 6,

    //总决赛:1,
    四强:4,
    八强:8,
    十六强: 16,
    三十二强:32
  };

  return rankMap[value] ?? 99;
}

function getRankResult(value: string, target: string) {
  const current = getRankValue(value);
  const targetValue = getRankValue(target);

  if (current === targetValue) {
    return "green";
  }

  if (Math.abs(current - targetValue) <= 2) {
    return current > targetValue ? "yellow-up" : "yellow-down";
  }

  return current > targetValue ? "gray-up" : "gray-down";
}
function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}
 function getAgeResult(age: number, targetAge: number) {
  if (age === targetAge) {
    return "🟩";
  }

  if (Math.abs(age - targetAge) <= 2) {
    return age < targetAge ? "🟨 ↑" : "🟨 ↓";
  }

  return age < targetAge ? "⬜ ↑" : "⬜ ↓";
}

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      {/* 顶部导航 */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <a href=" " className="text-xl font-black tracking-tight">
          NONGYIBA
        </a >

        <div className="flex items-center gap-6 text-sm">
          <a href="/" className="font-medium">
            今日挑战
          </a >

          <a
            href="/explore"
            className="text-gray-500 transition hover:text-black"
          >
            选手
          </a >

          <button className="rounded-full border border-black/10 bg-white px-4 py-2 transition hover:bg-black hover:text-white">
            统计
          </button>
          <button
  onClick={() => setShowRules(true)}
  className="rounded-full border border-black/10 bg-white px-4 py-2 transition hover:bg-black hover:text-white"
>
  规则
</button>
        </div>
      </header>

      {/* 游戏主体 */}
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16">
        <div className="text-center">
          <p className="mb-4 text-xs font-bold tracking-[0.35em] text-gray-400">
            KPL PLAYER GUESS
          </p >

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            猜猜这位选手是谁？
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-gray-500">
            根据选手属性猜出今天的 KPL 选手。
            <br />
            猜得越少，成绩越好。
          </p >
        </div>

        {/* 游戏卡片 */}
        <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="rounded-[1.5rem] bg-[#eeeae0] px-6 py-12 text-center">
            <p className="text-xs font-bold tracking-[0.25em] text-gray-400">
              TODAY&apos;S CHALLENGE
            </p >

            <div className="mt-6 text-7xl">❓</div>

            <h2 className="mt-6 text-2xl font-bold">
              神秘 KPL 选手
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              猜猜他是谁
            </p >
          </div>

          {/* 输入 */}
       {!isWon && !isLost && !showAnswer && (
  <div className="mt-5 flex gap-3">
    <div className="relative min-w-0 flex-1">
      <input
        type="text"
        value={guess}
        onChange={(e) => {
          setGuess(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleGuess();
            setShowSuggestions(false);
          }
        }}
        placeholder="输入 KPL 选手姓名..."
        className="w-full rounded-full border border-black/10 bg-[#f8f7f3] px-5 py-4 text-sm outline-none transition focus:border-black"
      />

      {showSuggestions && guess.trim() && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-lg">
          {suggestions.length > 0 ? (
            suggestions.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => {
                  setGuess(player.name);
                  setShowSuggestions(false);
                }}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[#f3f0e8]"
              >
                <div>
                  <div className="font-bold">
                    {player.name}
                  </div>

                  <div className="mt-1 text-xs text-gray-400">
                    {player.team} · {player.position}
                  </div>
                </div>

                <span className="text-xs text-gray-400">
                  选择 →
                </span>
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-sm text-gray-400">
              没有找到这个选手
            </div>
          )}
        </div>
      )}
    </div>
   <button
  onClick={handleGuess}
  className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:opacity-90"
>
  猜测
</button>
<button
  type="button"
  onClick={() => setShowAnswer(true)}
  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
>
  查看答案
</button>
  </div>
)}
          {/* 提示 */}
          {message && (
            <div className="mt-5 rounded-2xl bg-[#f3f0e8] px-4 py-4 text-center text-sm font-bold">
              {message}
            </div>
          )}
{isWon && (
  <div className="mt-6 rounded-3xl bg-black px-6 py-8 text-center text-white">
    <div className="text-4xl">🎉</div>

    <h2 className="mt-3 text-2xl font-black">
      挑战成功！
    </h2>

    <p className="mt-2 text-sm text-white/60">
      你用了 {guesses.length} 次猜出今天的选手
    </p >

    <div className="mt-6 rounded-2xl bg-white/10 px-4 py-4">
      <p className="text-xs text-white/50">
        今日答案
      </p >

      <p className="mt-1 text-xl font-bold">
        {answer.name}
      </p >

      <p className="mt-1 text-sm text-white/60">
        {answer.team}
      </p >
      <button
  onClick={() => {
    window.location.reload();
  }}
  className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-105"
>
  🔄 再来一局
</button>
    </div>
  </div>
)}
{isLost && (
  <div className="mt-6 rounded-3xl border border-black/10 bg-white px-6 py-8 text-center">
    <div className="text-4xl">😢</div>

    <h2 className="mt-3 text-2xl font-black">
      挑战失败
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      10 次机会已经全部用完
    </p >

    <div className="mt-6 rounded-2xl bg-[#f3f0e8] px-4 py-4">
      <p className="text-xs text-gray-400">
        今日答案
      </p >

      <p className="mt-1 text-xl font-bold">
        {answer.name}
      </p >

      <p className="mt-1 text-sm text-gray-500">
        {answer.team}
      </p >
    </div>

    <button
      onClick={() => {
        setAnswer(players[Math.floor(Math.random() * players.length)]);
        setGuesses([]);
        setMessage("");
        setIsWon(false);
        setIsLost(false);
        setShowAnswer(false);
        setTeamBonusUsed(false);
        setAttemptsLeft(10);
      }}
      className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:scale-105"
    >
      🔄 再挑战一次
    </button>
  </div>
)}

{showAnswer && (
  <div className="mt-6 rounded-3xl border border-black/10 bg-white px-6 py-8 text-center">
    <div className="text-sm text-gray-500">
      本局答案
    </div>

    <div className="mt-2 text-3xl font-bold">
      {answer.name}
    </div>

    <div className="mt-2 text-sm text-gray-600">
      {answer.team} · {answer.position}
    </div>

    <div className="mt-1 text-sm text-gray-500">
      {calculateAge(answer.birthDate)}岁 · {answer.hometown}
    </div>

    <button
      onClick={() => {
        setAnswer(players[Math.floor(Math.random() * players.length)]);
        setGuesses([]);
        setGuess("");
        setMessage("");
        setIsWon(false);
        setIsLost(false);
        setShowAnswer(false);
        setTeamBonusUsed(false);
        setAttemptsLeft(10);
      }}
      className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90"
    >
      🔄 再来一把
    </button>
  </div>
)}
          {/* 猜测记录 */}
          {guesses.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-bold">
                猜测记录
              </h3>

              <div className="overflow-hidden rounded-2xl border border-black/5">
                {/* 表头 */}
               <div className="grid grid-cols-6 bg-[#eeeae0] px-4 py-3 text-center text-xs font-bold">
  <div>选手</div>
  <div>战队</div>
  <div>位置</div>
  <div>年龄</div>
   <div>联赛最佳</div>
  <div>杯赛最佳</div>
</div>
                {/* 每一次猜测 */}
                {guesses.map((player, index) => (
                  <div
  key={index}
  className="grid grid-cols-6 items-center border-t border-black/5 px-4 py-4 text-center text-sm"
>
                    <div className="font-bold">
                      {player.name}
                    </div>

                   <div className="flex items-center justify-center gap-2">
  <span
    className={`h-3 w-3 rounded-full ${
      player.team === answer.team ? "bg-green-500" : "bg-gray-300"
    }`}
  />
  <span className="text-xs">
    {player.team}
  </span>
</div>

                    <div className="flex items-center justify-center gap-2">
  <span
    className={`h-3 w-3 rounded-full ${
      player.position === answer.position
        ? "bg-green-500"
        : "bg-gray-300"
    }`}
  />
  <span className="text-xs">
    {player.position}
  </span>
</div>
                  <div className="flex items-center justify-center gap-2">
  <span
    className={`h-3 w-3 rounded-full ${
      calculateAge(player.birthDate) === calculateAge(answer.birthDate)
        ? "bg-green-500"
        : Math.abs(
              calculateAge(player.birthDate) -
                calculateAge(answer.birthDate)
            ) <= 2
        ? "bg-yellow-400"
        : "bg-gray-300"
    }`}
  />

  <span className="text-xs">
    {calculateAge(player.birthDate)}岁
  </span>

  {calculateAge(player.birthDate) !== calculateAge(answer.birthDate) && (
    <span className="text-xs">
      {calculateAge(player.birthDate) < calculateAge(answer.birthDate)
        ? "↑"
        : "↓"}
    </span>
  )}
</div>

                 <div className="flex items-center justify-center gap-2">
  <span
    className={`h-3 w-3 rounded-full ${
      getRankResult(player.leagueBest, answer.leagueBest) === "green"
        ? "bg-green-500"
        : getRankResult(player.leagueBest, answer.leagueBest).startsWith("yellow")
        ? "bg-yellow-400"
        : "bg-gray-300"
    }`}
  />

  <span className="text-xs">
    {player.leagueBest}
  </span>

  {getRankResult(player.leagueBest, answer.leagueBest) !== "green" && (
    <span className="text-xs">
      {getRankResult(player.leagueBest, answer.leagueBest).endsWith("up")
        ? "↑"
        : "↓"}
    </span>
  )}
</div>

<div className="flex items-center justify-center gap-2">
  <span
    className={`h-3 w-3 rounded-full ${
      getRankResult(player.cupBest, answer.cupBest) === "green"
        ? "bg-green-500"
        : getRankResult(player.cupBest, answer.cupBest).startsWith("yellow")
        ? "bg-yellow-400"
        : "bg-gray-300"
    }`}
  />

  <span className="text-xs">
    {player.cupBest}
  </span>

  {getRankResult(player.cupBest, answer.cupBest) !== "green" && (
    <span className="text-xs">
      {getRankResult(player.cupBest, answer.cupBest).endsWith("up")
        ? "↑"
        : "↓"}
    </span>
  )}
</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 次数 */}
          <div className="mt-6 text-center text-xs text-gray-400">
            猜测次数{" "}
            <span className="font-bold text-black">
              {guesses.length} / 10
            </span>
          </div>
        </div>

        {/* 游戏规则 */}
        <div className="mx-auto mt-10 max-w-2xl">
          <h3 className="mb-4 text-sm font-bold">
            猜测规则
          </h3>

        </div>
      </section>

      <footer className="border-t border-black/5 py-8 text-center text-xs text-gray-400">
        NONGYIBA · KPL PLAYER GUESS
      </footer>
      {showRules && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">
          游戏规则
        </h2>

        <button
          onClick={() => setShowRules(false)}
          className="text-2xl text-gray-400 hover:text-black"
        >
          ×
        </button>
      </div>

      <div className="mt-6 space-y-4 text-sm text-gray-700">
        <p>
          🎯 挑战猜测KPL选手
        </p >

        <p>
          🔢 每局最多可以猜 <strong>10 次</strong>。
        </p >

        <p>
          💡 输入选手姓名后，系统会根据选手资料给出提示。
        </p >

        <p>
          🟩 属性正确会显示绿色提示。
        </p >

        <p>
          ⬆️⬇️ 数值类属性会告诉你目标答案是在猜测值的上面还是下面。
        </p >

        <p>
          👀 不想继续猜，也可以点击「查看答案」直接结束本局。
        </p >
      </div>

      <button
        onClick={() => setShowRules(false)}
        className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:opacity-90"
      >
        知道了
      </button>
    </div>
  </div>
)}
    </main>
  );
}
