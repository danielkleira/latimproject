import { useState } from "react";

// ===== CONFIG =====
const STOPWORDS = new Set<string>(["et", "in", "de", "ad", "non", "ut", "cum"]);

const prayers: Record<string, string> = {
  "Sinal da Cruz": `In nomine Patris, et Filii, et Spiritus Sancti. Amen.`,
  "Oferecimento do Terço": `Divine Iesu, offero tibi hoc rosarium quod recitaturus sum, meditans mysteria nostrae redemptionis. Concede mihi virtutes necessarias ad hanc orationem digne recitandam, ad maiorem gloriam tuam.`,
  Credo: `Credo in Deum, Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum, Filium eius unicum, Dominum nostrum: qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus; descendit ad inferos; tertia die resurrexit a mortuis; ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis; inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.`,
  "Pai Nosso": `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo.`,
  "Ave Maria": `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
  Glória: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
  "O Meu Jesus": `O mi Iesu, dimitte nobis debita nostra, libera nos ab igne inferni, perduc in caelum omnes animas, praesertim eas quae maxime indigent misericordia tua.`,
  "Salve Rainha": `Salve Regina, mater misericordiae, vita, dulcedo, et spes nostra, salve. Ad te clamamus, exsules filii Evae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. O clemens, o pia, o dulcis Virgo Maria.`,
  "Agradecimento do Terço": `Gratias tibi ago, Domine Deus, pro omnibus beneficiis quae mihi largitus es, et pro hoc rosario quod recitavi. Concede ut fructum ex hoc devotionis actu percipiam.`,

  "São Miguel Arcanjo": `Sancte Michael Archangele, defende nos in proelio; contra nequitiam et insidias diaboli esto praesidium. Imperet illi Deus, supplices deprecamur: tuque, Princeps militiae caelestis, Satanam aliosque spiritus malignos, qui ad perditionem animarum pervagantur in mundo, divina virtute, in infernum detrude. Amen.`,
  "São Bento": `Crux sacra sit mihi lux, non draco sit mihi dux. Vade retro, Satana! Numquam suade mihi vana! Sunt mala quae libas. Ipse venena bibas!`,

  "Anjo da Guarda": `Angele Dei, qui custos es mei, me tibi commissum pietate superna illumina, custodi, rege et guberna. Amen.`,
  "Anjo do Senhor": `Angelus Domini nuntiavit Mariae, et concepit de Spiritu Sancto. Ave Maria... Ecce ancilla Domini, fiat mihi secundum verbum tuum. Ave Maria... Et Verbum caro factum est, et habitavit in nobis. Ave Maria... Ora pro nobis, sancta Dei Genetrix. Ut digni efficiamur promissionibus Christi. Oremus: Gratiam tuam, quaesumus, Domine, mentibus nostris infunde: ut qui, Angelo nuntiante, Christi Filii tui incarnationem cognovimus, per passionem eius et crucem ad resurrectionis gloriam perducamur. Per eundem Christum Dominum nostrum. Amen.`,
  "Invocação ao Espírito Santo": `Veni, Sancte Spiritus, reple tuorum corda fidelium, et tui amoris in eis ignem accende.`,
  "Ato de Fé": `Domine Deus, firmiter credo et confiteor omnia et singula quae sancta Ecclesia catholica proponit, quia tu, Deus, ea omnia revelasti, qui nec falli nec fallere potes.`,
  "Ato de Esperança": `Domine Deus, spero per tuam gratiam remissionem omnium peccatorum, et post hanc vitam aeternam felicitatem me consecuturum esse, quia tu promisisti, qui es infinitus bonus et fidelis.`,
  "Ato de Caridade": `Domine Deus, amo te super omnia ex toto corde meo, quia es summum bonum et dignus omni amore; et proximum meum amo sicut meipsum propter te.`,
  "Ato de Contrição": `Deus meus, ex toto corde me poenitet omnium meorum peccatorum, eaque detestor, quia peccando non solum poenas a te iuste statutas promeritus sum, sed praesertim quia offendi te, summum bonum, ac dignum qui super omnia diligaris. Ideo firmiter propono, adiuvante gratia tua, de cetero me non peccaturum peccandique occasiones proximas fugiturum. Amen.`,
  "Vinde Espírito Criador": `Veni Creator Spiritus, mentes tuorum visita, imple superna gratia quae tu creasti pectora. Qui diceris Paraclitus, donum Dei altissimi, fons vivus, ignis, caritas, et spiritalis unctio. Tu septiformis munere, dexterae Dei tu digitus, tu rite promissum Patris, sermone ditans guttura. Accende lumen sensibus, infunde amorem cordibus, infirma nostri corporis virtute firmans perpeti. Hostem repellas longius, pacemque dones protinus; ductore sic te praevio vitemus omne noxium. Per te sciamus da Patrem, noscamus atque Filium, teque utriusque Spiritum credamus omni tempore. Deo Patri sit gloria, et Filio qui a mortuis surrexit, ac Paraclito, in saeculorum saecula. Amen.`,
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
              value={difficulty}
              onChange={(e) => setDifficulty(parseFloat(e.target.value))}
            >
              <option value={0.15}>Leigo 🕯️</option>
              <option value={0.25}>Acólito 📖</option>
              <option value={0.4}>Clerigo ⛪</option>
              <option value={0.5}>Santo 🙏</option>
              <option value={0.65}>Doutor da igreja ✨</option>
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
              OBS: Após clicar em verificar a primeira vez, as palavras são
              checadas em tempo real
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
