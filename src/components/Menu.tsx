import { prayers } from "../data/prayers";

type Props = {
  selectedPrayer: string;
  setSelectedPrayer: (v: string) => void;
  difficulty: number;
  setDifficulty: (v: number) => void;
  startTreino: () => void;
  startAprendizado: () => void;
};

export default function Menu({
  selectedPrayer,
  setSelectedPrayer,
  difficulty,
  setDifficulty,
  startTreino,
  startAprendizado,
}: Props) {
  return (
    <div className="card">
      <h1 className="title">🏛️ Treino de Latim</h1>

      <select
        className="select"
        value={selectedPrayer}
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
        value={difficulty}
        onChange={(e) => setDifficulty(parseFloat(e.target.value))}
      >
        <option value={0.2}>Leigo 🕯️</option>
        <option value={0.3}>Acólito 📖</option>
        <option value={0.4}>Clérigo ⛪</option>
        <option value={0.5}>Santo 🙏</option>
        <option value={0.65}>Doutor ✨</option>
      </select>

      <div className="row">
        <button
          className="button btn-primary"
          disabled={!selectedPrayer}
          onClick={startTreino}
        >
          🎯 Treino
        </button>

        <button
          className="button btn-success"
          disabled={!selectedPrayer}
          onClick={startAprendizado}
        >
          📖 Aprendizado
        </button>
      </div>
    </div>
  );
}
