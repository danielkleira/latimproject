import { useState } from "react";
import { prayers } from "./data/prayers";
import { tokenize, hideWords, normalize } from "./utils/text";
import type { TokenItem } from "./types";

import Menu from "./components/Menu";
import Treino from "./components/Treino";
import Aprendizado from "./components/Aprendizado";

// ===== UTILS =====

export default function App() {
  const [mode, setMode] = useState<"menu" | "treino" | "aprendizado">("menu");
  const [selectedPrayer, setSelectedPrayer] = useState("");
  const [difficulty, setDifficulty] = useState(0.2);

  const [gameData, setGameData] = useState<TokenItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const startTreino = () => {
    const tokens = tokenize(prayers[selectedPrayer].la);
    setGameData(hideWords(tokens, difficulty));
    setAnswers({});
    setChecked(false);
    setScore(null);
    setMode("treino");
  };

  const startAprendizado = () => {
    const tokens = tokenize(prayers[selectedPrayer].la);
    setGameData(tokens.map((t) => ({ token: t, hidden: false })));
    setAnswers({});
    setMode("aprendizado");
  };

  const hideLearningWords = () => {
    const tokens = tokenize(prayers[selectedPrayer].la);
    setGameData(hideWords(tokens, difficulty));
    setChecked(false); // 🔥 ESSENCIAL
  };

  const checkAnswers = () => {
    setChecked(true);

    let correct = 0;
    let total = 0;

    gameData.forEach((item, index) => {
      if (item.hidden) {
        total++;
        if (normalize(answers[index] || "") === normalize(item.token)) {
          correct++;
        }
      }
    });

    if (total === 0) {
      setScore(100);
      return;
    }

    setScore(Math.round((correct / total) * 100));
  };

  return (
    <div className="app-container">
      {mode === "menu" && (
        <Menu
          selectedPrayer={selectedPrayer}
          setSelectedPrayer={setSelectedPrayer}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          startTreino={startTreino}
          startAprendizado={startAprendizado}
        />
      )}

      {mode === "treino" && (
        <Treino
          title={selectedPrayer}
          gameData={gameData}
          answers={answers}
          setAnswers={setAnswers}
          checkAnswers={checkAnswers}
          checked={checked}
          score={score}
          voltar={() => setMode("menu")}
        />
      )}

      {mode === "aprendizado" && (
        <Aprendizado
          title={selectedPrayer}
          prayer={prayers[selectedPrayer]}
          gameData={gameData}
          answers={answers}
          setAnswers={setAnswers}
          hideWords={hideLearningWords}
          checked={checked}
          setChecked={setChecked}
          voltar={() => setMode("menu")}
        />
      )}
    </div>
  );
}
