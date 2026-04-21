import type { TokenItem } from "../types";
import { normalize } from "../utils/text";

type Props = {
  title: string;
  gameData: TokenItem[];
  answers: Record<number, string>;
  setAnswers: (v: Record<number, string>) => void;
  checkAnswers: () => void;
  checked: boolean;
  score: number | null;
  voltar: () => void;
};

export default function Treino({
  title,
  gameData,
  answers,
  setAnswers,
  checkAnswers,
  checked,
  score,
  voltar,
}: Props) {
  return (
    <div className="card">
      <h2>🎯 {title}</h2>

      <div className="text-box">
        {gameData.map((item, i) => (
          <span key={i}>
            {item.hidden ? (
              <input
                className={`input-word ${
                  checked
                    ? answers[i]
                      ? normalize(answers[i]) === normalize(item.token)
                        ? "correct"
                        : "wrong"
                      : "empty"
                    : ""
                }`}
                value={answers[i] || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, [i]: e.target.value })
                }
              />
            ) : (
              <span>{item.token} </span>
            )}
          </span>
        ))}
      </div>

      <div className="row">
        <button className="button btn-success" onClick={checkAnswers}>
          ✔ Verificar
        </button>

        <button className="button btn-neutral" onClick={voltar}>
          Voltar
        </button>
      </div>

      {checked && score !== null && (
        <div className="result">
          <p className="score">Nota: {score}%</p>
        </div>
      )}
    </div>
  );
}
