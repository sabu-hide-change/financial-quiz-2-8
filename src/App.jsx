/**
 * 依存関係インストール:
 * npm install lucide-react recharts clsx tailwind-merge
 * * ビルド失敗時の対策:
 * CI=false npm run build
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  List, CheckCircle, XCircle, ArrowLeft, Play, 
  RefreshCw, AlertCircle, BookOpen, ChevronRight,
  BarChart3, Settings, Info, Check
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ScatterChart, Scatter, 
  ZAxis, ReferenceLine, Cell
} from 'recharts';

// --- Types & Data ---

const QUESTIONS = [
  {
    id: 1,
    title: "資本市場と資金調達",
    text: "資本市場と資金調達に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを選べ。\n\n企業にとっての資金調達は、投資家にとっての（ Ａ ）となる。よって、企業の資金調達のコストである資本コストは、投資家にとっては（ Ａ ）に対する（ Ｂ ）となる。ここで、投資家が（ Ａ ）をするにあたり、資本市場において、（ Ｃ ）を購入するか（ Ｄ ）を購入するかの選択肢がある。リスクの少ない（ Ｃ ）と、リスクの大きい（ Ｄ ）の期待するリターンが同じであれば、投資家はリスクの少ない（ Ｃ ）を選ぶ。投資家はリスクが大きい投資に対しては、大きなリターンを望むからである。",
    choices: [
      "Ａ：投資　Ｂ：リスク　Ｃ：社債　Ｄ：株式",
      "Ａ：消費　Ｂ：リスク　Ｃ：株式　Ｄ：社債",
      "Ａ：消費　Ｂ：リターン　Ｃ：社債　Ｄ：株式",
      "Ａ：投資　Ｂ：リターン　Ｃ：株式　Ｄ：社債",
      "Ａ：投資　Ｂ：リターン　Ｃ：社債　Ｄ：株式"
    ],
    answer: 4, // インデックス（オ）
    explanation: "企業にとっての資金調達は投資家にとっての投資であり、そのコスト（資本コスト）は投資家側のリターンに対応します。また、社債は元本・利息が比較的確実（低リスク）ですが、株式は業績により配当や価格が変動する（高リスク）という特徴があります。",
    points: ["資金調達 ＝ 投資", "資本コスト ＝ リターン", "社債（低リスク） vs 株式（高リスク）"]
  },
  {
    id: 2,
    title: "投資のリスクとリターン（標準偏差）",
    text: "次の資料は、ある株式の投資収益率について予想される分布を示したものである。この資料に基づいた場合、この株式の標準偏差として、最も適切なものを選べ。",
    hasTable: true,
    tableData: [
      { rate: "4%", prob: "0.2" },
      { rate: "6%", prob: "0.5" },
      { rate: "8%", prob: "0.3" }
    ],
    mathInfo: "※計算式：\n期待値 = 4*0.2 + 6*0.5 + 8*0.3 = 6.2%\n分散 = (4-6.2)^2 * 0.2 + (6-6.2)^2 * 0.5 + (8-6.2)^2 * 0.3 = 1.96\n標準偏差 = √1.96 = 1.4",
    choices: ["-1", "0", "1", "1.41", "1.4"],
    answer: 4,
    explanation: "期待値は $4\\% \\times 0.2 + 6\\% \\times 0.5 + 8\\% \\times 0.3 = 6.2\\%$ です。次に各値の偏差の2乗に確率を掛けて分散を求めると $(4-6.2)^2 \\times 0.2 + (6-6.2)^2 \\times 0.5 + (8-6.2)^2 \\times 0.3 = 1.96$ となります。標準偏差はその平方根なので $\\sqrt{1.96} = 1.4$ となります。"
  },
  {
    id: 3,
    title: "リスクの種類",
    text: "ポートフォリオ理論におけるリスクに関する記述として、最も適切なものを選べ。",
    choices: [
      "流動性リスクとは、取引相手の財務状況の悪化や倒産により元本の回収が滞るリスクのことである。",
      "カントリー・リスクとは、外貨建て金融商品における為替変動により資産価値が変動するリスクのことである。",
      "価格変動リスクとは、取引量が少ないためすぐに希望価格で売ることができなくなるリスクのことである。",
      "信用リスクとは、その国の政治や経済などによって資産価値が変動するリスクのことである。",
      "システマティック・リスクとは、市場全体との相関によるリスクであり、分散化によって消去することができない。"
    ],
    answer: 4,
    explanation: "消去可能なリスクは「アンシステマティック・リスク（個別リスク）」であり、市場全体に起因する「システマティック・リスク」は分散投資でも消去できません。他の選択肢は定義が入れ替わっています（流動性⇔価格変動、信用⇔カントリー等）。"
  },
  {
    id: 4,
    title: "リスクに対する投資家の選好",
    text: "図は投資家の無差別曲線を描いたものである。A, B, Cの投資家の選好を表す組み合わせとして適切なものを選べ。※U1 < U2 < U3",
    customVisual: "indifference_curves",
    choices: [
      "Ａ：リスク回避者　Ｂ：リスク中立者　Ｃ：リスク愛好者",
      "Ａ：リスク回避者　Ｂ：リスク愛好者　Ｃ：リスク中立者",
      "Ａ：リスク愛好者　Ｂ：リスク中立者　Ｃ：リスク回避者",
      "Ａ：リスク愛好者　Ｂ：リスク回避者　Ｃ：リスク中立者"
    ],
    answer: 0,
    explanation: "ファイナンスでは一般に「リスク回避者」を想定します。同じリターンなら低リスクを好むのが回避者(A)、リスクを気にせずリターンのみ見るのが中立者(B)、同じリターンなら高リスクのスリルを好むのが愛好者(C)です。"
  },
  {
    id: 5,
    title: "ポートフォリオのリスク低減効果",
    text: "次の文中の空欄に入る語句を選べ。\n\n（ Ａ ）とは、複数の資産を組み合わせてつくられた資産全体のことをいう。マコービッツは個々の証券の（ Ｂ ）とその組み合わせである（ Ａ ）の（ Ｂ ）を区別して調べることにより、（ Ａ ）を組むことによって（ Ｂ ）の（ Ｃ ）が可能になることを提唱した。資産が（ Ｃ ）化された（ Ａ ）のほうが（ Ｂ ）は小さくなることを、（ Ａ ）の（ Ｄ ）という。",
    choices: [
      "Ａ：ポートフォリオ　Ｂ：リスク　Ｃ：分散　Ｄ：リスク低減効果",
      "Ａ：ポートフォリオ　Ｂ：リターン　Ｃ：集中　Ｄ：ポートフォリオ効果",
      "Ａ：投資家の選好　Ｂ：リターン　Ｃ：分散　Ｄ：リスク低減効果",
      "Ａ：投資家の選好　Ｂ：リスク　Ｃ：集中　Ｄ：ポートフォリオ効果"
    ],
    answer: 0,
    explanation: "ハリー・マコービッツが提唱した理論です。個別銘柄に集中するより、分散投資（ポートフォリオ）を行うことで、期待収益率を維持しながらリスクだけを下げられる効果を指します。"
  },
  {
    id: 6,
    title: "ポートフォリオのリターンとリスク（グラフ読解）",
    text: "2つの株式XとYの組み入れ比率を変化させたときのリターンとリスクの図に関する記述として、最も適切なものを選べ。",
    customVisual: "portfolio_curve",
    choices: [
      "株式Xにだけ単独に投資するのは、ローリスク・ローリターンの投資家行動といえる。",
      "株式Yにだけ単独に投資するのは、ハイリスク・ハイリターンの投資家行動といえる。",
      "リスクが最も小さくなるのは、組み入れ比率が株式X37%・株式Y63％であるときである。",
      "X37%・Y63％以外の比率の場合、個別証券に集中投資する場合に比べてリスクは高い。"
    ],
    answer: 2,
    explanation: "図の曲線の一番左端（標準偏差が最小の点）が X:37%, Y:63% の地点です。この点は個別株（Xのみ、Yのみ）よりもリスクが小さくなっており、分散投資の効果が表れています。"
  },
  {
    id: 7,
    title: "相関係数とリスク",
    text: "相関係数が－1、0、1の場合における、リターンとリスクの図に関する記述として、最も適切なものを選べ。",
    customVisual: "correlation_graph",
    choices: [
      "相関係数が－1のとき、ポートフォリオのリスク低減効果は最も小さくなる。",
      "相関係数が 1 のとき、ポートフォリオのリスク低減効果は最も大きくなる。",
      "相関係数が 0 のとき、ポートフォリオのリスクを低減することができない。",
      "相関係数が 1 以外のとき、ポートフォリオのリスク低減効果がある。"
    ],
    answer: 3,
    explanation: "相関係数が1（完全に同じ動き）でない限り、多角化によるリスク低減効果は発生します。-1（完全に逆の動き）のとき、リスク低減効果は最大（リスクを0にできる）となります。"
  },
  {
    id: 8,
    title: "システマティックリスクと非システマティックリスク",
    text: "ポートフォリオのリスクとリターンについて、空欄Ａ～Ｃに入る語句の組み合わせを選べ。\n\nポートフォリオの総リスクは、（ Ａ ）と（ Ｂ ）から構成される。（ Ａ ）は、銘柄数が多くなると減少するが（ Ｂ ）は、減少することはない。（ Ｃ ）は、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線である。",
    customVisual: "risk_distribution",
    choices: [
      "Ａ：システマティック　Ｂ：アンシステマティック　Ｃ：資本市場線",
      "Ａ：システマティック　Ｂ：アンシステマティック　Ｃ：証券市場線",
      "Ａ：アンシステマティック　Ｂ：システマティック　Ｃ：証券市場線",
      "Ａ：アンシステマティック　Ｂ：システマティック　Ｃ：資本市場線"
    ],
    answer: 2,
    explanation: "個別銘柄固有のリスク（アンシステマティック）は分散投資で消せますが、市場全体のリスク（システマティック）は消せません。また、βと期待リターンの関係を示すのは「証券市場線(SML)」です。"
  },
  {
    id: 9,
    title: "効率的フロンティア",
    text: "リターンとリスクの分布を示した図に関する記述として、最も不適切なものを選べ。",
    customVisual: "efficient_frontier",
    choices: [
      "効率的フロンティアとは、特定のリスクに対して最低のリターンをあげることが期待されるポートフォリオをいう。",
      "合理的な投資家は、ポートフォリオB（曲線内部）よりA（曲線上）を選ぶ。",
      "ローリスク・ローリターンを好む投資家は、効率的フロンティアの左側の線上を選ぶ。",
      "ハイリスク・ハイリターンを好む投資家は、効率的フロンティアの右側の線上を選ぶ。"
    ],
    answer: 0,
    explanation: "「最低のリターン」ではなく「最高のリターン」です。同じリスクならリターンが高い方が良いため、境界線（フロンティア）上の組み合わせが選ばれます。"
  },
  {
    id: 10,
    title: "リスクフリー資産",
    text: "株式Xと国債（リスクフリー資産）を組み合わせた図に関する記述として、最も適切なものを選べ。",
    customVisual: "risk_free_graph",
    choices: [
      "国債の期待収益率は、10％である。",
      "国債は、リスクフリー資産である（標準偏差が0）。",
      "国債を購入する比率が低くなるほど、リスクは小さくなる。",
      "リスクフリー資産を入れると、リスクを嫌う投資家は選択肢が狭まる。"
    ],
    answer: 1,
    explanation: "図の縦軸（標準偏差0）にある点が国債です。収益率は確定しており、リスク（ばらつき）がないため、標準偏差は0となります。"
  },
  {
    id: 11,
    title: "市場ポートフォリオ",
    text: "リスクフリー資産と全株式を組み合わせた場合の図に関する記述として、最も適切なものを選べ。",
    customVisual: "market_portfolio_graph",
    choices: [
      "資本市場線とは、リスクフリー資産だけを購入した場合を示すものである。",
      "A点とB点を比較すると、B点の方が同じリスクで高いリターンを実現できる。",
      "合理的な投資家は、必ず資本市場線の上のポートフォリオを選択する。",
      "市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小である。"
    ],
    answer: 2,
    explanation: "リスクフリー資産を含める場合、効率的フロンティアとの接点を通る直線「資本市場線」が最も効率的になります。投資家は自身の許容リスクに応じ、この直線上のどこかの点を選択します。"
  },
  {
    id: 12,
    title: "CAPMによる期待収益率の計算",
    text: "次の資料に基づいた場合、CAPMによりG証券の期待収益率を計算する数式として最も適切なものを選べ。\n\n資料：リスクフリーレート 2%, β値 1.2, 市場ポートフォリオの期待収益率 8%",
    choices: [
      "8% + 1.2 × (8% - 2%)",
      "8% - 1.2 × (8% + 2%)",
      "2% + 1.2 × (8% + 2%)",
      "2% - 1.2 × (8% - 2%)",
      "2% + 1.2 × (8% - 2%)"
    ],
    answer: 4,
    explanation: "CAPM式：個別期待収益率 = 無リスク利子率 + β × (市場収益率 - 無リスク利子率)。当てはめると $2 + 1.2 \\times (8 - 2)$ となり、結果は $9.2\\%$ です。"
  },
  {
    id: 13,
    title: "加重平均資本コスト(WACC)",
    text: "H社の資料に基づき、WACCを計算する数式を選べ。\n\n【資料】社債(時価400万/コスト3%)、普通株式(時価600万/コスト13%)、実効税率40%",
    choices: [
      "0.5 × (1 - 0.4) × 3% + 0.5 × 13%",
      "0.5 × 0.4 × 3% + 0.5 × 13%",
      "0.4 × 3% + 0.6 × 13%",
      "0.4 × (1 - 0.4) × 3% + 0.6 × 13%",
      "0.4 × 0.4 × 3% + 0.6 × 13%"
    ],
    answer: 3,
    explanation: "時価ベースで重みを算出します。総額1000万のうち負債40%(0.4)、資本60%(0.6)。負債コストには節税効果(1-税率)を掛けるため、$0.4 \\times (1-0.4) \\times 3\\% + 0.6 \\times 13\\%$ となります。"
  },
  {
    id: 14,
    title: "資金調達方法",
    text: "資金調達方法に関する説明として、最も適切なものはどれか。",
    customVisual: "funding_hierarchy",
    choices: [
      "内部留保と減価償却費は、内部金融に該当する。",
      "内部金融とは、企業外部から資金調達を行うことである。",
      "直接金融とは、金融仲介機関から直接的に資金を融通することである。",
      "間接金融とは、金融仲介機関を経由せずに資金を融通することである。"
    ],
    answer: 0,
    explanation: "内部金融（自己金融）には、利益を貯めた「内部留保」や、キャッシュアウトを伴わない費用である「減価償却費」が含まれます。銀行借入は「間接金融」、株・債券発行は「直接金融」です。"
  },
  {
    id: 15,
    title: "ファイナンス・リース取引",
    text: "ファイナンス・リース取引に関する説明として、最も適切なものはどれか。",
    choices: [
      "途中解約不能（ノンキャンセラブル）かつ、借手がコストを実質負担（フルペイアウト）する取引をいう。",
      "途中解約が可能で、借手が使用に伴うコストを負担しなくてよい取引をいう。",
      "通常の賃貸借取引（レンタル等）に係る方法に準じて会計処理を行う。",
      "通常の資本取引に係る方法に準じて会計処理を行う。"
    ],
    answer: 0,
    explanation: "ファイナンス・リースは「実質的な割賦購入」とみなされるため、解約不能・フルペイアウトが特徴です。会計処理は「売買取引」に準じて行われ、資産・負債に計上されます。"
  },
  {
    id: 16,
    title: "効率的市場仮説",
    text: "効率的市場仮説の空欄Ａ～Dに入る語句を選べ。\n\n（ Ａ ）では、テクニカル分析の有効性が否定されている。（ Ｂ ）では、株価予測は不可能とされる。インサイダー情報も織り込み済みとする説は（ Ｃ ）である。一方、（ Ｄ ）ではファンダメンタル分析の有効性が否定されている。",
    choices: [
      "Ａ：ストロング　Ｂ：ウィーク　Ｃ：ランダムウォーク　Ｄ：セミストロング",
      "Ａ：ウィーク　Ｂ：ランダムウォーク　Ｃ：ストロング　Ｄ：セミストロング",
      "Ａ：ランダムウォーク　Ｂ：セミストロング　Ｃ：ストロング　Ｄ：ウィーク",
      "Ａ：ランダムウォーク　Ｂ：ウィーク　Ｃ：ストロング　Ｄ：セミストロング"
    ],
    answer: 1,
    explanation: "過去の価格情報(ウィーク) < 公開情報(セミストロング) < 全情報(ストロング) の順に強くなります。ランダムウォークは「将来の予測は五分五分で不可能」という考え方です。"
  }
];

// --- Sub Components (Visual Recreations) ---

const IndifferenceCurves = () => (
  <div className="w-full h-48 bg-white border rounded-lg p-2 flex flex-col">
    <span className="text-xs font-bold self-center mb-1">リスクに対する投資家の選好</span>
    <div className="flex-1 flex justify-around items-end pb-6 relative">
      <div className="text-[10px] absolute bottom-0 left-0">リスク</div>
      <div className="text-[10px] absolute top-0 left-0 rotate-[-90deg] translate-x-[-15px] translate-y-[20px]">リターン</div>
      {/* A: Risk Averse */}
      <div className="flex flex-col items-center">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <path d="M10,90 Q15,40 90,10" fill="none" stroke="#ef4444" strokeWidth="2" />
          <path d="M10,95 Q30,60 95,30" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6"/>
          <path d="M10,100 Q45,80 100,50" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.3"/>
          <text x="75" y="15" fontSize="12" fill="#ef4444">A</text>
        </svg>
        <span className="text-[10px]">リスク回避</span>
      </div>
      {/* B: Neutral */}
      <div className="flex flex-col items-center">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <line x1="10" y1="20" x2="90" y2="20" stroke="#3b82f6" strokeWidth="2" />
          <line x1="10" y1="45" x2="90" y2="45" stroke="#3b82f6" strokeWidth="2" opacity="0.6"/>
          <line x1="10" y1="70" x2="90" y2="70" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
          <text x="80" y="15" fontSize="12" fill="#3b82f6">B</text>
        </svg>
        <span className="text-[10px]">リスク中立</span>
      </div>
      {/* C: Lover */}
      <div className="flex flex-col items-center">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <path d="M10,10 Q60,15 90,90" fill="none" stroke="#22c55e" strokeWidth="2" />
          <path d="M10,30 Q40,35 70,95" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6"/>
          <path d="M10,50 Q20,55 50,100" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.3"/>
          <text x="15" y="25" fontSize="12" fill="#22c55e">C</text>
        </svg>
        <span className="text-[10px]">リスク愛好</span>
      </div>
    </div>
  </div>
);

const PortfolioCurve = () => {
  const data = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i += 5) {
      const xRatio = i / 100;
      const yRatio = 1 - xRatio;
      const expectedReturn = xRatio * 10 + yRatio * 8;
      // Simplified portfolio risk curve calculation for visual
      const stdDev = Math.sqrt(Math.pow(xRatio * 8.12, 2) + Math.pow(yRatio * 4.65, 2) + 2 * xRatio * yRatio * 8.12 * 4.65 * 0.1);
      points.push({ stdDev: stdDev.toFixed(2), ret: expectedReturn.toFixed(2), ratio: i });
    }
    return points;
  }, []);

  return (
    <div className="w-full h-64 bg-white border rounded-lg p-2">
       <span className="text-xs font-bold block mb-2">◆ ポートフォリオのリターンとリスク</span>
       <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="stdDev" name="標準偏差" unit="" label={{ value: 'リスク(標準偏差)', position: 'insideBottom', offset: -10, fontSize: 10 }} />
          <YAxis type="number" dataKey="ret" name="期待収益率" unit="%" label={{ value: '期待収益率', angle: -90, position: 'insideLeft', fontSize: 10 }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="ポートフォリオ" data={data} fill="#8884d8" line={{ stroke: '#ef4444', strokeWidth: 2 }} shape="none" />
          {/* Key Points */}
          <ReferenceLine x={1.02} stroke="blue" strokeDasharray="3 3" />
          <Scatter data={[{ stdDev: 8.12, ret: 10, label: 'X:100%' }, { stdDev: 4.65, ret: 8, label: 'Y:100%' }, { stdDev: 1.02, ret: 8.74, label: 'Min' }]} fill="#1e3a8a">
            {({ points }) => points.map((p, i) => (
               <g key={i}>
                 <circle cx={p.x} cy={p.y} r={4} fill="#1e3a8a" />
                 <text x={p.x + 5} y={p.y - 5} fontSize="10">{i === 2 ? '最小リスク点(X37%)' : ''}</text>
               </g>
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const FundingHierarchy = () => (
  <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-xl text-[10px] md:text-xs">
    <div className="flex flex-col items-center space-y-4">
      <div className="p-2 border-2 border-slate-800 bg-white font-bold">資金調達</div>
      <div className="flex w-full justify-around relative">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-1 bg-blue-600 text-white rounded">外部金融</div>
          <div className="flex space-x-2">
             <div className="p-1 border bg-white">間接金融 (銀行等)</div>
             <div className="p-1 border bg-white">直接金融 (株・債券)</div>
          </div>
          <div className="mt-1 p-1 bg-slate-200">他人資本</div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="p-1 bg-green-600 text-white rounded">内部金融</div>
          <div className="flex space-x-2">
             <div className="p-1 border bg-white">内部留保</div>
             <div className="p-1 border bg-white">減価償却</div>
          </div>
          <div className="mt-1 p-1 bg-slate-200">自己資本</div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Application ---

export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard, quiz, explanation
  const [filter, setFilter] = useState('all'); // all, incorrect, review
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userState, setUserState] = useState({
    results: {}, // { questionId: isCorrect }
    needsReview: {}, // { questionId: boolean }
    attempts: {} // { questionId: count }
  });
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('sm_consultant_quiz_2_8');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserState(parsed);
      console.log("App Started: Loaded user progress", parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sm_consultant_quiz_2_8', JSON.stringify(userState));
  }, [userState]);

  // Derived Quiz List
  const quizList = useMemo(() => {
    let list = QUESTIONS;
    if (filter === 'incorrect') {
      list = QUESTIONS.filter(q => userState.results[q.id] === false);
    } else if (filter === 'review') {
      list = QUESTIONS.filter(q => userState.needsReview[q.id] === true);
    }
    return list;
  }, [filter, userState]);

  const currentQuestion = quizList[currentIdx];

  // Actions
  const handleStartQuiz = (newFilter) => {
    setFilter(newFilter);
    setCurrentIdx(0);
    setSelectedChoice(null);
    setView('quiz');
    console.log(`Quiz Started: Mode=${newFilter}`);
  };

  const handleSelect = (choiceIdx) => {
    if (view !== 'quiz') return;
    setSelectedChoice(choiceIdx);
    const isCorrect = choiceIdx === currentQuestion.answer;
    
    setUserState(prev => ({
      ...prev,
      results: { ...prev.results, [currentQuestion.id]: isCorrect },
      attempts: { ...prev.attempts, [currentQuestion.id]: (prev.attempts[currentQuestion.id] || 0) + 1 }
    }));
    
    setView('explanation');
    console.log(`Answered Q${currentQuestion.id}: Correct=${isCorrect}`);
  };

  const handleNext = () => {
    if (currentIdx < quizList.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedChoice(null);
      setView('quiz');
    } else {
      setView('dashboard');
    }
  };

  const toggleReview = (id) => {
    setUserState(prev => ({
      ...prev,
      needsReview: { ...prev.needsReview, [id]: !prev.needsReview[id] }
    }));
  };

  // --- Renderers ---

  const renderVisual = (type) => {
    switch (type) {
      case 'indifference_curves': return <IndifferenceCurves />;
      case 'portfolio_curve': return <PortfolioCurve />;
      case 'funding_hierarchy': return <FundingHierarchy />;
      case 'risk_distribution': 
        return (
          <div className="w-full bg-slate-50 p-4 rounded-lg flex flex-col items-center">
             <div className="w-48 h-32 border-l-2 border-b-2 border-slate-400 relative">
                <div className="absolute left-0 bottom-0 w-full h-8 bg-blue-200 flex items-center justify-center text-[10px]">システマティック (市場リスク)</div>
                <div className="absolute left-0 bottom-8 w-full h-16 bg-red-100 flex items-center justify-center text-[10px] border-b border-white">アンシステマティック (個別リスク)</div>
                <div className="absolute bottom-[-20px] left-0 w-full text-center text-[10px]">← 銘柄数増加 →</div>
             </div>
          </div>
        );
      case 'correlation_graph':
        return (
          <div className="w-full h-40 border rounded flex items-center justify-center bg-white p-2">
            <svg width="200" height="120" viewBox="0 0 200 120">
              <path d="M20,20 L180,100" stroke="green" strokeWidth="2" strokeDasharray="4" />
              <text x="182" y="105" fontSize="8">ρ=1 (直線)</text>
              <path d="M20,20 Q60,60 180,100" fill="none" stroke="blue" strokeWidth="2" />
              <text x="100" y="80" fontSize="8">ρ=0 (曲線)</text>
              <polyline points="20,20 60,60 180,100" fill="none" stroke="red" strokeWidth="2" />
              <text x="20" y="55" fontSize="8">ρ=-1 (折れ線)</text>
            </svg>
          </div>
        );
      case 'efficient_frontier':
        return (
          <div className="w-full h-40 bg-white border rounded flex flex-col items-center justify-center">
             <div className="relative w-40 h-32 border-l border-b">
                <path d="M40,20 Q10,60 40,110" fill="none" stroke="#ddd" strokeWidth="2" />
                <path d="M40,20 Q100,30 140,50" fill="none" stroke="red" strokeWidth="3" />
                <text x="60" y="25" fontSize="10" fill="red">効率的フロンティア</text>
                <circle cx="80" cy="40" r="3" fill="red" /> <text x="85" y="42" fontSize="10">A</text>
                <circle cx="80" cy="70" r="3" fill="blue" /> <text x="85" y="72" fontSize="10">B</text>
             </div>
          </div>
        );
      case 'risk_free_graph':
        return (
          <div className="w-full h-40 bg-white border rounded flex flex-col items-center justify-center">
            <svg width="200" height="120" viewBox="0 0 200 120">
              <line x1="20" y1="100" x2="180" y2="20" stroke="green" strokeWidth="2" />
              <circle cx="20" cy="100" r="4" fill="blue" /> <text x="25" y="105" fontSize="10">国債 (RF)</text>
              <circle cx="180" cy="20" r="4" fill="red" /> <text x="140" y="15" fontSize="10">株式X</text>
              <text x="100" y="115" fontSize="10">標準偏差(リスク)</text>
            </svg>
          </div>
        );
      case 'market_portfolio_graph':
        return (
          <div className="w-full h-40 bg-white border rounded flex flex-col items-center justify-center">
             <div className="relative w-40 h-32 border-l border-b">
                <path d="M40,20 Q100,30 140,50" fill="none" stroke="red" strokeWidth="2" />
                <line x1="0" y1="90" x2="140" y2="20" stroke="green" strokeWidth="2" />
                <circle cx="85" cy="47" r="4" fill="red" />
                <text x="90" y="45" fontSize="10">M (市場PF)</text>
                <text x="10" y="10" fontSize="8" fill="green">資本市場線</text>
             </div>
          </div>
        );
      default: return null;
    }
  };

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
        <div className="max-w-2xl mx-auto space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 flex items-center justify-center gap-2">
              <BookOpen className="w-8 h-8" /> 資本市場と資本コスト
            </h1>
            <p className="text-slate-500 text-sm">中小企業診断士 スマート問題集 2-8</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">総正解率</p>
              <p className="text-2xl font-black text-blue-600">
                {Math.round((Object.values(userState.results).filter(Boolean).length / QUESTIONS.length) * 100)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">要復習</p>
              <p className="text-2xl font-black text-orange-500">
                {Object.values(userState.needsReview).filter(Boolean).length} 問
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">完了済み</p>
              <p className="text-2xl font-black text-slate-700">
                {Object.keys(userState.results).length} / {QUESTIONS.length}
              </p>
            </div>
          </div>

          <section className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-100 border-b flex justify-between items-center">
               <h2 className="font-bold flex items-center gap-2"><List className="w-4 h-4" /> 問題一覧</h2>
               <span className="text-xs text-slate-500">前回の結果を確認</span>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {QUESTIONS.map((q, idx) => {
                const isCorrect = userState.results[q.id];
                const needsReview = userState.needsReview[q.id];
                return (
                  <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">#{String(q.id).padStart(2, '0')}</span>
                      <span className="text-sm font-medium line-clamp-1">{q.title}</span>
                      {needsReview && <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">要復習</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect === true && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {isCorrect === false && <XCircle className="w-5 h-5 text-red-500" />}
                      {isCorrect === undefined && <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={() => handleStartQuiz('all')}
              className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
            >
              <Play className="w-5 h-5" /> 全て解く
            </button>
            <button 
              onClick={() => handleStartQuiz('incorrect')}
              disabled={!QUESTIONS.some(q => userState.results[q.id] === false)}
              className="flex items-center justify-center gap-2 p-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:grayscale"
            >
              <RefreshCw className="w-5 h-5" /> 不正解のみ
            </button>
            <button 
              onClick={() => handleStartQuiz('review')}
              disabled={!Object.values(userState.needsReview).some(Boolean)}
              className="flex items-center justify-center gap-2 p-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 disabled:grayscale"
            >
              <AlertCircle className="w-5 h-5" /> 要復習のみ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 p-0 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white min-h-screen md:min-h-0 md:rounded-3xl md:shadow-2xl md:border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="text-center">
             <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Progress</p>
             <p className="text-xs font-mono text-slate-500">{currentIdx + 1} / {quizList.length}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {currentQuestion ? (
            <>
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-black text-slate-800 leading-tight">
                  {currentQuestion.title}
                </h3>
                <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.text}
                </div>
              </div>

              {/* Table rendering if exists */}
              {currentQuestion.hasTable && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-slate-300">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border border-slate-300 p-2 text-center">投資収益率</th>
                        <th className="border border-slate-300 p-2 text-center">確率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentQuestion.tableData?.map((row, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 p-2 text-center font-mono">{row.rate}</td>
                          <td className="border border-slate-300 p-2 text-center font-mono">{row.prob}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Diagrams */}
              {currentQuestion.customVisual && renderVisual(currentQuestion.customVisual)}

              {/* Choices */}
              <div className="grid grid-cols-1 gap-3 pt-4">
                {currentQuestion.choices?.map((choice, i) => {
                  const isSelected = selectedChoice === i;
                  const isCorrect = i === currentQuestion.answer;
                  const showResult = view === 'explanation';

                  return (
                    <button
                      key={i}
                      disabled={showResult}
                      onClick={() => handleSelect(i)}
                      className={`
                        w-full p-4 text-left rounded-2xl border-2 transition-all flex items-start gap-3
                        ${!showResult ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98]' : ''}
                        ${showResult && isCorrect ? 'border-green-500 bg-green-50' : ''}
                        ${showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                        ${showResult && !isSelected && !isCorrect ? 'opacity-40 border-slate-100' : ''}
                      `}
                    >
                      <span className={`
                        w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold
                        ${!showResult ? 'bg-slate-100 text-slate-500' : ''}
                        ${showResult && isCorrect ? 'bg-green-500 text-white' : ''}
                        ${showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
                      `}>
                        {['ア', 'イ', 'ウ', 'エ', 'オ'][i]}
                      </span>
                      <span className="text-sm md:text-base font-medium">{choice}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Area */}
              {view === 'explanation' && (
                <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-blue-800 flex items-center gap-2">
                      <Info className="w-5 h-5" /> 解説
                    </h4>
                    <label className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border cursor-pointer hover:bg-slate-50 transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-orange-500"
                        checked={userState.needsReview[currentQuestion.id] || false}
                        onChange={() => toggleReview(currentQuestion.id)}
                      />
                      <span className="text-xs font-bold text-slate-600">要復習にチェック</span>
                    </label>
                  </div>
                  
                  <div className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap italic">
                    {currentQuestion.explanation}
                  </div>

                  {currentQuestion.mathInfo && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-blue-600 whitespace-pre-wrap">
                      {currentQuestion.mathInfo}
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-900 transition-all active:scale-95"
                  >
                    {currentIdx < quizList.length - 1 ? '次の問題へ' : '結果画面へ戻る'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
               <div className="p-6 bg-blue-100 rounded-full">
                  <Check className="w-12 h-12 text-blue-600" />
               </div>
               <h3 className="text-xl font-bold">対象の問題はありません</h3>
               <button onClick={() => setView('dashboard')} className="text-blue-600 font-bold underline">ダッシュボードへ戻る</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}