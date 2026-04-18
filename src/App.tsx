import { useState } from "react";

// ===== CONFIG =====
const STOPWORDS = new Set<string>(["et", "in", "de", "ad", "non", "ut", "cum"]);

const prayers: Record<string, string> = {
  "Pai Nosso": `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo.`,
  "Ave Maria": `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
};

// ===== TYPES =====
type TokenItem = {
  token: string;
  hidden: boolean;
};

// ===== UTILS =====
const normalize = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const tokenize = (text: string): string[] => text.match(/\w+|[^\s\w]+/g) || [];

function shuffleHiddenWords(tokens: string[], percentage: number): TokenItem[] {
  const candidates = tokens
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => /\w+/.test(t) && !STOPWORDS.has(normalize(t)));

  const toHide = Math.floor(candidates.length * percentage);
  const indexes = new Set<number>();

  while (indexes.size < toHide && indexes.size < candidates.length) {
    const rand = candidates[Math.floor(Math.random() * candidates.length)].i;
    indexes.add(rand);
  }

  return tokens.map((token, i) => ({
    token,
    hidden: indexes.has(i),
  }));
}

export default function App() {
  const [selectedPrayer, setSelectedPrayer] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0.15);
  const [gameData, setGameData] = useState<TokenItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(() => {
    const saved = localStorage.getItem("latin_score");
    return saved ? Number(saved) : null;
  });

  const startGame = () => {
    const tokens = tokenize(prayers[selectedPrayer]);
    setGameData(shuffleHiddenWords(tokens, difficulty));
    setAnswers({});
    setChecked(false);
    setScore(null);
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

    const finalScore = Math.round((correct / total) * 100);
    setScore(finalScore);
    localStorage.setItem("latin_score", String(finalScore));
  };

  return (
    <div className="app-container">
      <div className="card">
        {/* HEADER */}
        <h1 className="title">🏛️ Treino de Latim</h1>
        <p className="subtitle">Complete as orações e aprimore seu latim</p>

        {/* MENU */}
        {!gameData.length && (
          <div>
            <select
              className="select"
              onChange={(e) => setSelectedPrayer(e.target.value)}
            >
              <option value="">Selecione uma oração</option>
              {Object.keys(prayers).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <div style={{ height: 12 }} />

            <select
              className="select"
              onChange={(e) => setDifficulty(parseFloat(e.target.value))}
            >
              <option value={0.15}>Leigo 🕯️</option>
              <option value={0.25}>Catecúmeno 📖</option>
              <option value={0.35}>Fiel ⛪</option>
              <option value={0.45}>Devoto 🙏</option>
              <option value={0.5}>Santo ✨</option>
            </select>

            <div className="row">
              <button
                className="button btn-primary"
                onClick={startGame}
                disabled={!selectedPrayer}
              >
                Começar treino
              </button>
            </div>

            {score !== null && (
              <p
                style={{ textAlign: "center", marginTop: 10, color: "#9ca3af" }}
              >
                Última pontuação: <strong>{score}%</strong>
              </p>
            )}
          </div>
        )}

        {/* GAME */}
        {gameData.length > 0 && (
          <div>
            <div className="text-box">
              <div className="wrap">
                {gameData.map((item, index) => (
                  <span key={index}>
                    {item.hidden ? (
                      <input
                        className={`input-word ${
                          checked
                            ? answers[index]
                              ? normalize(answers[index]) ===
                                normalize(item.token)
                                ? "correct"
                                : "wrong"
                              : "empty"
                            : ""
                        }`}
                        value={answers[index] || ""}
                        onChange={(e) =>
                          setAnswers({ ...answers, [index]: e.target.value })
                        }
                      />
                    ) : (
                      <span>{item.token} </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="row">
              <button className="button btn-success" onClick={checkAnswers}>
                ✔ Verificar
              </button>

              <button
                className="button btn-neutral"
                onClick={() => setGameData([])}
              >
                ↩ Voltar
              </button>
            </div>
            <p>
              {" "}
              OBS: Após clicar em verificar a primeira vez, as palavras são checadas
              em tempo real
            </p>

            {checked && score !== null && (
              <div className="result">
                <p className="score">Nota: {score}%</p>
                <p style={{ marginTop: 6 }}>
                  <span style={{ color: "#4ade80", fontWeight: 600 }}>
                    Verde = correto
                  </span>{" "}
                  •{" "}
                  <span style={{ color: "#f87171", fontWeight: 600 }}>
                    Vermelho = errado
                  </span>{" "}
                  •{" "}
                  <span style={{ color: "#facc15", fontWeight: 600 }}>
                    Amarelo = vazio
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
