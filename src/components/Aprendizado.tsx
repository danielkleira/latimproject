import type { Prayer, TokenItem } from "../types";
import { normalize } from "../utils/text";

type Props = {
  title: string;
  prayer: Prayer;
  gameData: TokenItem[];
  answers: Record<number, string>;
  setAnswers: (v: Record<number, string>) => void;
  hideWords: () => void;
  checked: boolean;
  setChecked: (v: boolean) => void;
  voltar: () => void;
};

export default function Aprendizado({
  title,
  prayer,
  gameData,
  answers,
  setAnswers,
  hideWords,
  checked,
  setChecked,
  voltar,
}: Props) {
  return (
    <div className="card">
      <h2>📖 {title}</h2>

      <div className="text-box">{prayer.pt}</div>

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
        <button className="button btn-primary" onClick={hideWords}>
          Ocultar palavras
        </button>

        <button className="button btn-success" onClick={() => setChecked(true)}>
          ✔ Verificar
        </button>

        <button className="button btn-neutral" onClick={voltar}>
          Voltar
        </button>
      </div>
    </div>
  );
}
