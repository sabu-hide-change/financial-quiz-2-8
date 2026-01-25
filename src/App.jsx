/**
 * 依存関係インストール:
 * npm install lucide-react recharts clsx tailwind-merge
 * * ビルド失敗時の対策:
 * CI=false npm run build
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, XCircle, AlertCircle, List, Play, 
  RotateCcw, Check, BookOpen, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- 図表再現コンポーネント ---

// Q2: 投資収益率の分布表
const Q2Table = () => (
  <div className="my-4 overflow-x-auto">
    <table className="min-w-full text-sm border-collapse border border-slate-300">
      <thead className="bg-blue-50">
        <tr>
          <th className="border border-slate-300 px-4 py-2">投資収益率</th>
          <th className="border border-slate-300 px-4 py-2">確率</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white"><td className="border border-slate-300 px-4 py-2 text-center">4%</td><td className="border border-slate-300 px-4 py-2 text-center">0.2</td></tr>
        <tr className="bg-white"><td className="border border-slate-300 px-4 py-2 text-center">6%</td><td className="border border-slate-300 px-4 py-2 text-center">0.5</td></tr>
        <tr className="bg-white"><td className="border border-slate-300 px-4 py-2 text-center">8%</td><td className="border border-slate-300 px-4 py-2 text-center">0.3</td></tr>
      </tbody>
    </table>
  </div>
);

// Q2: 計算式の再現
const Q2Math = () => (
  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs md:text-sm my-2 space-y-2 border border-slate-200">
    <p>期待値 = 4×0.2 + 6×0.5 + 8×0.3 = 6.2%</p>
    <p>分散 = (4-6.2)²×0.2 + (6-6.2)²×0.5 + (8-6.2)²×0.3</p>
    <p className="pl-8">= 4.84×0.2 + 0.04×0.5 + 3.24×0.3 = 1.96</p>
    <p>標準偏差 = √1.96 = 1.4</p>
  </div>
);

// Q4: 無差別曲線 (SVG)
const IndifferenceCurves = () => (
  <div className="flex flex-wrap justify-around gap-4 my-4">
    {[
      { label: 'A: リスク回避者', type: 'a' },
      { label: 'B: リスク中立者', type: 'b' },
      { label: 'C: リスク愛好者', type: 'c' }
    ].map((g, idx) => (
      <div key={idx} className="flex flex-col items-center">
        <div className="w-40 h-40 border-l-2 border-b-2 border-slate-600 relative bg-white">
          <span className="absolute -left-6 top-1/2 -rotate-90 text-xs">リターン</span>
          <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-xs">リスク</span>
          {g.type === 'a' && (
            <>
              <path d="M10,90 Q40,80 90,10" stroke="red" strokeWidth="2" fill="none" className="absolute" style={{top:0, left:0, width:'100%', height:'100%'}} />
              <path d="M10,70 Q40,60 70,10" stroke="red" strokeWidth="2" fill="none" className="absolute" style={{top:0, left:0, width:'100%', height:'100%'}} />
            </>
          )}
          {g.type === 'b' && (
            <>
              <line x1="0" y1="30" x2="100" y2="30" stroke="red" strokeWidth="2" />
              <line x1="0" y1="60" x2="100" y2="60" stroke="red" strokeWidth="2" />
              <line x1="0" y1="90" x2="100" y2="90" stroke="red" strokeWidth="2" />
            </>
          )}
          {g.type === 'c' && (
            <>
               <path d="M10,10 Q60,20 90,90" stroke="red" strokeWidth="2" fill="none" />
               <path d="M30,10 Q70,20 95,70" stroke="red" strokeWidth="2" fill="none" />
            </>
          )}
          {/* SVG Rendering using absolute div for simplicity in path mapping */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             {g.type === 'a' && (
               <>
                 <path d="M10,130 Q50,120 130,20" stroke="red" strokeWidth="2" fill="none" />
                 <path d="M10,100 Q50,90 100,20" stroke="red" strokeWidth="2" fill="none" />
                 <path d="M10,70 Q40,60 70,20" stroke="red" strokeWidth="2" fill="none" />
                 <text x="130" y="20" fontSize="10">U1</text>
                 <text x="100" y="20" fontSize="10">U2</text>
                 <text x="70" y="20" fontSize="10">U3</text>
               </>
             )}
             {g.type === 'b' && (
               <>
                 <line x1="5" y1="40" x2="150" y2="40" stroke="red" strokeWidth="2" />
                 <line x1="5" y1="80" x2="150" y2="80" stroke="red" strokeWidth="2" />
                 <line x1="5" y1="120" x2="150" y2="120" stroke="red" strokeWidth="2" />
                 <text x="152" y="45" fontSize="10">U3</text>
                 <text x="152" y="85" fontSize="10">U2</text>
                 <text x="152" y="125" fontSize="10">U1</text>
               </>
             )}
             {g.type === 'c' && (
               <>
                 <path d="M10,20 Q100,30 140,140" stroke="red" strokeWidth="2" fill="none" />
                 <path d="M10,50 Q80,60 110,140" stroke="red" strokeWidth="2" fill="none" />
                 <text x="140" y="150" fontSize="10">U3</text>
                 <text x="110" y="150" fontSize="10">U2</text>
               </>
             )}
          </svg>
        </div>
        <span className="mt-2 text-sm font-bold">{g.label}</span>
      </div>
    ))}
  </div>
);

// Q6, Q7, Q9, Q10, Q11: ポートフォリオと効率的フロンティア系グラフ
const PortfolioGraph = ({ type }) => (
  <div className="w-full max-w-md mx-auto h-64 border bg-white relative my-4 rounded shadow-sm">
    <div className="absolute top-2 left-2 text-xs font-bold bg-white p-1 z-10">
      {type === 'q6' && '◆ポートフォリオのリターンとリスク'}
      {type === 'q7' && '◆相関係数とリスク'}
      {type === 'q8' && '◆ポートフォリオの分散効果'}
      {type === 'q9' && '◆効率的フロンティア'}
      {type === 'q10' && '◆リスクフリー資産組込'}
      {type === 'q11' && '◆リスクフリー資産と効率的フロンティア'}
    </div>
    
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
        <XAxis type="number" dataKey="x" domain={[0, 100]} tick={false} label={{ value: '標準偏差(リスク)', position: 'insideBottom', offset: -10 }} />
        <YAxis type="number" domain={[0, 100]} tick={false} label={{ value: '期待収益率', angle: -90, position: 'insideLeft' }} />
        
        {/* Custom SVG Drawings based on type */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#ccc">
          (SVG再現描画エリア)
        </text>
      </LineChart>
    </ResponsiveContainer>

    {/* Absolute SVG Overlay for complex curves not easily done with simple LineChart data */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
       {/* Axes */}
       <line x1="40" y1="230" x2="380" y2="230" stroke="black" strokeWidth="2" />
       <line x1="40" y1="230" x2="40" y2="20" stroke="black" strokeWidth="2" />

       {type === 'q6' && (
         <>
            {/* Backward bending curve */}
            <path d="M280,200 Q100,150 280,50" stroke="#b91c1c" strokeWidth="3" fill="none" />
            <circle cx="280" cy="50" r="4" fill="#1e3a8a" /> <text x="290" y="50" fontSize="12" fill="#1e3a8a">X:100%</text>
            <circle cx="280" cy="200" r="4" fill="#1e3a8a" /> <text x="290" y="200" fontSize="12" fill="#1e3a8a">Y:100%</text>
            <circle cx="155" cy="135" r="4" fill="#1e3a8a" /> <text x="60" y="135" fontSize="12" fill="#1e3a8a">X:37%, Y:63%</text>
            {/* Dotted lines */}
            <line x1="40" y1="50" x2="280" y2="50" stroke="black" strokeDasharray="4" /> <text x="20" y="50" fontSize="12">10</text>
            <line x1="40" y1="135" x2="155" y2="135" stroke="black" strokeDasharray="4" /> <text x="10" y="135" fontSize="12">8.74</text>
            <line x1="40" y1="200" x2="280" y2="200" stroke="black" strokeDasharray="4" /> <text x="25" y="200" fontSize="12">8</text>
         </>
       )}

       {type === 'q7' && (
         <>
            <line x1="280" y1="50" x2="280" y2="200" stroke="#16a34a" strokeWidth="2" strokeDasharray="4" /> 
            <text x="290" y="120" fontSize="12" fill="#16a34a" transform="rotate(-90, 290, 120)">相関係数=1</text>
            
            <path d="M280,200 Q150,150 280,50" stroke="#1e40af" strokeWidth="2" fill="none" />
            <text x="180" y="100" fontSize="12" fill="#1e40af" transform="rotate(-60, 180, 100)">相関係数=0</text>

            <polyline points="280,200 40,125 280,50" stroke="#b91c1c" strokeWidth="2" fill="none" />
            <text x="100" y="80" fontSize="12" fill="#b91c1c" transform="rotate(-20, 100, 80)">相関係数=-1</text>
         </>
       )}

      {type === 'q8' && (
         <>
           {/* Risk vs N graph */}
           <path d="M40,20 Q60,150 380,180" stroke="#1e3a8a" strokeWidth="2" fill="none" />
           <line x1="40" y1="180" x2="380" y2="180" stroke="gray" strokeDasharray="2" />
           <text x="200" y="130" fontSize="12">A (分散可能)</text>
           <text x="200" y="200" fontSize="12">B (市場リスク)</text>
           <line x1="180" y1="100" x2="180" y2="180" markerEnd="url(#arrow)" stroke="black" />
           <line x1="180" y1="180" x2="180" y2="230" stroke="black" />
         </>
       )}

      {type === 'q9' && (
         <>
           <path d="M100,230 Q80,100 350,50" stroke="#b91c1c" strokeWidth="3" fill="none" />
           <circle cx="200" cy="80" r="5" fill="red" /> <text x="210" y="80" fontSize="12" fill="red" fontWeight="bold">A</text>
           <circle cx="200" cy="150" r="5" fill="red" /> <text x="210" y="150" fontSize="12" fill="red" fontWeight="bold">B</text>
           <text x="180" y="40" fontSize="12" fill="#b91c1c" fontWeight="bold">効率的フロンティア</text>
           {/* Dots for other portfolios */}
           <circle cx="150" cy="180" r="3" fill="#1e3a8a" />
           <circle cx="250" cy="100" r="3" fill="#1e3a8a" />
           <circle cx="300" cy="120" r="3" fill="#1e3a8a" />
         </>
       )}

      {type === 'q10' && (
         <>
           <line x1="40" y1="200" x2="350" y2="50" stroke="#4d7c0f" strokeWidth="2" />
           <circle cx="40" cy="200" r="5" fill="#1e3a8a" /> <text x="50" y="200" fontSize="12">国債(100%)</text>
           <circle cx="350" cy="50" r="5" fill="#1e3a8a" /> <text x="360" y="50" fontSize="12">X(100%)</text>
           <circle cx="195" cy="125" r="5" fill="#1e3a8a" /> <text x="205" y="125" fontSize="12">X:50%</text>
         </>
       )}

      {type === 'q11' && (
         <>
           <path d="M150,230 Q120,120 350,80" stroke="#b91c1c" strokeWidth="3" fill="none" />
           <line x1="40" y1="180" x2="380" y2="50" stroke="#4d7c0f" strokeWidth="2" />
           <circle cx="205" cy="118" r="5" fill="red" /> <text x="190" y="110" fontSize="12" fontWeight="bold">M</text>
           <circle cx="160" cy="135" r="4" fill="#1e3a8a" /> <text x="150" y="130" fontSize="12" fontWeight="bold" fill="#1e3a8a">A</text>
           <circle cx="165" cy="155" r="4" fill="#1e3a8a" /> <text x="175" y="160" fontSize="12" fontWeight="bold" fill="#1e3a8a">B</text>
           <text x="300" y="60" fontSize="12" fill="#4d7c0f">資本市場線</text>
           <text x="250" y="90" fontSize="12" fill="#b91c1c">効率的フロンティア</text>
         </>
       )}

    </svg>
  </div>
);

// Q14: 資金調達体系図 (Tree)
const FundingTree = () => (
  <div className="w-full overflow-x-auto my-4 p-4 border rounded bg-white">
    <div className="flex flex-col gap-4 min-w-[500px] text-xs md:text-sm">
      <div className="flex items-center">
        <div className="border border-black p-2 w-24 text-center font-bold">資金調達</div>
        <div className="w-8 border-t border-black"></div>
        <div className="flex flex-col gap-8 border-l border-black pl-4 py-4">
          
          {/* 外部金融 */}
          <div className="flex items-center">
             <div className="border border-black bg-orange-100 p-2 w-24 text-center font-bold">外部金融</div>
             <div className="w-4 border-t border-black"></div>
             <div className="flex flex-col gap-4 border-l border-black pl-4">
                <div className="flex items-center">
                   <div className="border border-black p-1 w-20 text-center">企業間信用</div>
                   <div className="w-4 border-t border-black"></div>
                   <div className="flex flex-col gap-1 pl-2">
                      <div className="border border-black p-1">支払手形</div>
                      <div className="border border-black p-1">買掛金</div>
                   </div>
                </div>
                <div className="flex items-center">
                   <div className="border border-black bg-orange-200 p-1 w-20 text-center">間接金融</div>
                   <div className="w-4 border-t border-black"></div>
                   <div className="flex flex-col gap-1 pl-2">
                      <div className="border border-black p-1">短期借入</div>
                      <div className="border border-black p-1">長期借入</div>
                   </div>
                </div>
                <div className="flex items-center">
                   <div className="border border-black bg-orange-200 p-1 w-20 text-center">直接金融</div>
                   <div className="w-4 border-t border-black"></div>
                   <div className="flex flex-col gap-1 pl-2">
                      <div className="border border-black p-1">社債</div>
                      <div className="border border-black p-1">株式</div>
                   </div>
                </div>
             </div>
          </div>

          {/* 内部金融 */}
          <div className="flex items-center">
             <div className="border border-black bg-orange-100 p-2 w-24 text-center font-bold">内部金融</div>
             <div className="w-4 border-t border-black"></div>
             <div className="flex flex-col gap-2 border-l border-black pl-4 py-2">
                <div className="flex items-center">
                   <div className="border border-black p-1 w-20 text-center">自己金融</div>
                   <div className="w-4 border-t border-black"></div>
                   <div className="flex flex-col gap-1 pl-2">
                      <div className="border border-black p-1">内部留保</div>
                      <div className="border border-black p-1">減価償却</div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);


// --- データ定義 ---

const QUESTIONS = [
  {
    id: 1,
    title: "資本市場と資金調達",
    question: "資本市場と資金調達に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n企業にとっての資金調達は、投資家にとっての（　Ａ　）となる。よって、企業の資金調達のコストである資本コストは、投資家にとっては（　Ａ　）に対する（　Ｂ　）となる。ここで、投資家が（　Ａ　）をするにあたり、資本市場において、（　Ｃ　）を購入するか（　Ｄ　）を購入するかの選択肢がある。リスクの少ない（　Ｃ　）と、リスクの大きい（　Ｄ　）の期待するリターンが同じであれば、投資家はリスクの少ない（　Ｃ　）を選ぶ。投資家はリスクが大きい投資に対しては、大きなリターンを望むからである。",
    choices: [
      "Ａ：投資　Ｂ：リスク　Ｃ：社債　Ｄ：株式",
      "Ａ：消費　Ｂ：リスク　Ｃ：株式　Ｄ：社債",
      "Ａ：消費　Ｂ：リターン　Ｃ：社債　Ｄ：株式",
      "Ａ：投資　Ｂ：リターン　Ｃ：株式　Ｄ：社債",
      "Ａ：投資　Ｂ：リターン　Ｃ：社債　Ｄ：株式"
    ],
    answer: 4,
    explanation: "企業にとっての資金調達は投資家にとっての「投資(A)」であり、資本コストは投資家にとっての「リターン(B)」となります。\nまた、一般的に「社債(C)」は元本保証性が高くリスクが低いのに対し、「株式(D)」は価格変動リスクが大きいためリスクが高いとされます。リスク回避的な投資家は、同じリターンならリスクの少ない社債を選びます。"
  },
  {
    id: 2,
    title: "投資のリスクとリターン",
    question: "次の資料は、ある株式の投資収益率について予想される分布を示したものである。この株式の標準偏差として、最も適切なものを下記の解答群から選べ。",
    choices: ["-1", "0", "1", "1.41", "1.4"],
    answer: 4,
    explanation: "まず期待値を計算します。\n4%×0.2 + 6%×0.5 + 8%×0.3 = 6.2%\n次に分散を求めます。\n(4-6.2)²×0.2 + (6-6.2)²×0.5 + (8-6.2)²×0.3 = 1.96\n標準偏差は分散の平方根なので、√1.96 = 1.4 となります。",
    extraComponent: <><Q2Table /><Q2Math /></>
  },
  {
    id: 3,
    title: "リスクの種類",
    question: "ポートフォリオ理論におけるリスクに関する記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "流動性リスクとは、取引相手の財務状況の悪化や倒産により貸付金の受取利息や元本の回収が滞ってしまうリスクのことである。",
      "カントリー・リスクとは、外貨建て金融商品における国と国との為替変動により資産価値が変動するリスクのことである。",
      "価格変動リスクとは、市場で取引量が少ないために資産を換金しようとしたときにすぐに売ることができない、あるいは希望する価格で売ることができなくなるリスクのことである。",
      "信用リスクとは、その国の政治や経済などによって資産価値が変動するリスクのことである。",
      "システマティック・リスクとは、市場全体との相関によるリスクであり、分散化によって消去することができないリスクのことである。"
    ],
    answer: 4,
    explanation: "システマティック・リスク（市場リスク）は、市場全体に起因するリスク（景気変動、金利変動など）であり、分散投資を行っても消去できません。対して、個別銘柄固有のリスクをアンシステマティック・リスクと呼び、こちらは分散投資で低減可能です。\n他の選択肢の誤り：\n・ア：信用リスクの説明です。\n・イ：為替リスクの説明です。\n・ウ：流動性リスクの説明です。\n・エ：カントリーリスクの説明です。"
  },
  {
    id: 4,
    title: "リスクに対する投資家の選好",
    question: "次の図は、投資家の無差別曲線を描いたものである。この投資家の選好を表す組み合わせとして、最も適切なものはどれか。ただし、図において、満足度のレベルは、U1＜U2＜U3である。",
    choices: [
      "Ａ：リスク回避者　Ｂ：リスク中立者　Ｃ：リスク愛好者",
      "Ａ：リスク回避者　Ｂ：リスク愛好者　Ｃ：リスク中立者",
      "Ａ：リスク愛好者　Ｂ：リスク中立者　Ｃ：リスク回避者",
      "Ａ：リスク愛好者　Ｂ：リスク回避者　Ｃ：リスク中立者"
    ],
    answer: 0,
    explanation: "Aは、同じリターンならリスクが小さい方を好む「リスク回避者」の無差別曲線（下に凸の右上がり）。\nBは、リスクの大きさに関わらずリターンのみで判断する「リスク中立者」（水平線）。\nCは、同じリターンならリスクが大きい方を好む「リスク愛好者」（右下がり、または上に凸）。\nよって、アが正解です。",
    extraComponent: <IndifferenceCurves />
  },
  {
    id: 5,
    title: "ポートフォリオのリスク低減効果",
    question: "ポートフォリオのリスク低減効果に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n（　Ａ　）とは、複数の資産を組み合わせてつくられた資産全体のことをいう。マコービッツは個々の証券の（　Ｂ　）とその組み合わせである（　Ａ　）の（　Ｂ　）を区別して調べることにより、（　Ａ　）を組むことによって（　Ｂ　）の（　Ｃ　）が可能になることを提唱した。個別の証券に集中して投資する（　Ｂ　）よりも、資産が（　Ｃ　）化された（　Ａ　）のほうが（　Ｂ　）は小さくなることを、（　Ａ　）の（　Ｄ　）という。",
    choices: [
      "Ａ：ポートフォリオ　Ｂ：リスク　Ｃ：分散　Ｄ：リスク低減効果",
      "Ａ：ポートフォリオ　Ｂ：リターン　Ｃ：集中　Ｄ：ポートフォリオ効果",
      "Ａ：投資家の選好　Ｂ：リターン　Ｃ：分散　Ｄ：リスク低減効果",
      "Ａ：投資家の選好　Ｂ：リスク　Ｃ：集中　Ｄ：ポートフォリオ効果"
    ],
    answer: 0,
    explanation: "ポートフォリオ理論の基礎知識です。複数の資産（ポートフォリオ）に分散投資することで、期待リターンを維持したままリスクを低減できる効果を「ポートフォリオのリスク低減効果（分散効果）」といいます。"
  },
  {
    id: 6,
    title: "ポートフォリオのリターンとリスク",
    question: "次の図は、2つの株式XとYについて、ポートフォリオの組み入れ比率を変化させて、縦軸に期待収益率を横軸に標準偏差をとったポートフォリオのリターンとリスクを示したものである。この図に関する記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "株式Xにだけ単独に投資するというのは、ローリスク・ローリターンの投資家行動といえる。",
      "株式Yにだけ単独に投資するというのは、ハイリスク・ハイリターンの投資家行動といえる。",
      "リスクが最も小さくなるのは、組み入れ比率が株式X37%・株式Y63％であるときである。",
      "組み入れ比率が株式X37%・株式Y63％であるとき以外の組み入れ比率の場合、個別の証券に集中して投資する場合に比べて、リスクは高い。"
    ],
    answer: 2,
    explanation: "図より、グラフの最も左側（標準偏差が最小）になる点が、X:37%, Y:63%のポイントです。この点は単独投資（Xのみ、Yのみ）よりもリスクが小さくなっており、分散投資の効果が表れています。",
    extraComponent: <PortfolioGraph type="q6" />
  },
  {
    id: 7,
    title: "相関係数とリスク",
    question: "次の図は、相関係数が－1、0、1の場合における、2つの株式XとYについて、ポートフォリオの組み入れ比率を変化させた図である。この図に関する記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "相関係数が－1のとき、ポートフォリオのリスク低減効果は最も小さくなる。",
      "相関係数が1のとき、ポートフォリオのリスク低減効果は最も大きくなる。",
      "相関係数が0のとき、ポートフォリオのリスクを低減することができない。",
      "相関係数が1以外のとき、ポートフォリオのリスク低減効果がある。"
    ],
    answer: 3,
    explanation: "相関係数が1（完全正相関）の場合、分散効果はゼロとなり直線になります。それ以外（1未満）であればリスク低減効果が生じ、グラフは左側に膨らみます。特に-1（完全逆相関）のときはリスクをゼロにできる点が存在します。",
    extraComponent: <PortfolioGraph type="q7" />
  },
  {
    id: 8,
    title: "システマティックリスクと非システマティックリスク",
    question: "次の文章は、ポートフォリオのリスクとリターン、分散効果について述べたものである。空欄Ａ～Ｃに入る語句の組み合わせとして、最も適切なものはどれか。\n\nポートフォリオの総リスクは、（　Ａ　）と（　Ｂ　）から構成される。\n（　Ａ　）は、ポートフォリオを構成する銘柄数が多くなると減少するが（　Ｂ　）は、減少することはない。…（　Ｃ　）は、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線です。",
    choices: [
      "Ａ：システマティック・リスク　Ｂ：アンシステマティック・リスク　Ｃ：資本市場線",
      "Ａ：システマティック・リスク　Ｂ：アンシステマティック・リスク　Ｃ：証券市場線",
      "Ａ：アンシステマティック・リスク　Ｂ：システマティック・リスク　Ｃ：証券市場線",
      "Ａ：アンシステマティック・リスク　Ｂ：システマティック・リスク　Ｃ：資本市場線"
    ],
    answer: 2,
    explanation: "分散投資で減らせるリスク(A)は「アンシステマティック・リスク（個別リスク）」です。減らせない市場全体のリスク(B)は「システマティック・リスク」です。また、βと期待リターンの関係を表す直線(C)は「証券市場線(SML)」です。（資本市場線は標準偏差とリターンの関係）",
    extraComponent: <PortfolioGraph type="q8" />
  },
  {
    id: 9,
    title: "効率的フロンティア",
    question: "次の図に関する記述として、最も不適切なものを下記の解答群から選べ。",
    choices: [
      "効率的フロンティアとは、特定のリスクの大きさに対して、最低のリターンをあげることが期待されるポートフォリオのことをいう。",
      "ポートフォリオAとポートフォリオBを比較してみると、合理的な投資家は必ず効率的フロンティアの上にあるAを選ぶ。",
      "ローリスク・ローリターンを好む投資家は、効率的フロンティアの左側の線上のポートフォリオを選ぶ。",
      "ハイリスク・ハイリターンを好む投資家は、効率的フロンティアの右側の線上のポートフォリオを選ぶ。"
    ],
    answer: 0,
    explanation: "効率的フロンティアとは、特定のリスクに対して「最高」のリターン（または特定のリターンに対して「最低」のリスク）を実現するポートフォリオの集合です。「最低のリターン」という記述が誤り（不適切）です。",
    extraComponent: <PortfolioGraph type="q9" />
  },
  {
    id: 10,
    title: "リスクフリー資産",
    question: "次の図は、株式Xと国債をポートフォリオに組み込んだ場合におけるリターンとリスクの分布を示したものである。この図に関する記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "国債の期待収益率は、10％である。",
      "国債は、リスクフリー資産である。",
      "国債を購入する比率が低くなるほど、リスクは小さくなる。",
      "国債をポートフォリオに入れると、株式だけのポートフォリオよりも、リスクを嫌う投資家は、よりリスクの低いポートフォリオを選択できなくなる。"
    ],
    answer: 1,
    explanation: "グラフの縦軸切片（標準偏差0）が国債単独の点です。標準偏差が0なのでリスクフリー資産です。\n他の選択肢：\nア：国債の収益率はグラフより2%です。\nウ：国債比率が低い＝株式比率が高いので、リスクは大きくなります。\nエ：国債を組み入れることで、より低リスクな選択が可能になります。",
    extraComponent: <PortfolioGraph type="q10" />
  },
  {
    id: 11,
    title: "市場ポートフォリオ",
    question: "次の図は、リスクフリー資産である国債と、全ての株式を自由に組み合わせた場合におけるリターンとリスクの分布を示したものである。この図に関する記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "資本市場線とは、資本市場において、リスクフリー資産だけを購入した場合を示すものである。",
      "A点とB点を比較すると、B点の方が同じリスクで高いリターンを実現できる。",
      "合理的な投資家は、必ず資本市場線の上のポートフォリオを選択する。",
      "市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小である。"
    ],
    answer: 2,
    explanation: "資本市場線（CML）は、リスクフリー資産と市場ポートフォリオを結んだ直線で、最も効率的な投資機会の集合です。合理的な投資家はこの線上の点を選択します。\nA点（CML上）はB点（効率的フロンティア内部）より上にあるため、同じリスクでより高いリターンを得られます。",
    extraComponent: <PortfolioGraph type="q11" />
  },
  {
    id: 12,
    title: "CAPM",
    question: "次の資料に基づいた場合、CAPMによりG証券の期待収益率を計算する数式として、最も適切なものを下記の解答群から選べ。\n【資料】リスクフリーレート:2%、β値:1.2、市場ポートフォリオの期待収益率:8%",
    choices: [
      "8％ ＋ 1.2 × (8％ － 2％)",
      "8％ － 1.2 × (8％ ＋ 2％)",
      "2％ ＋ 1.2 × (8％ ＋ 2％)",
      "2％ － 1.2 × (8％ － 2％)",
      "2％ ＋ 1.2 × (8％ － 2％)"
    ],
    answer: 4,
    explanation: "CAPMの公式：期待収益率 = リスクフリーレート + β × (市場期待収益率 - リスクフリーレート)\nこれに数値を当てはめると、2% + 1.2 × (8% - 2%) となります。",
  },
  {
    id: 13,
    title: "加重平均資本コスト",
    question: "次の資料に基づいた場合、H社の加重平均資本コスト(WACC)を計算する数式として、最も適切なものを下記の解答群から選べ。\n【資料】\n社債: 帳簿400万/時価400万, コスト3%\n普通株式: 帳簿400万/時価600万, コスト13%\n実効税率: 40%",
    choices: [
      "0.5 × (1 － 0.4) × 3％ ＋ 0.5 × 13％",
      "0.5 × 0.4 × 3％ ＋ 0.5 × 13％",
      "0.4 × 3％ ＋ 0.6 × 13％",
      "0.4 × (1 － 0.4) × 3％ ＋ 0.6 × 13％",
      "0.4 × 0.4 × 3％ ＋ 0.6 × 13％"
    ],
    answer: 3,
    explanation: "WACC計算では「時価」を用います。\n負債時価=400万, 株式時価=600万, 合計1000万。\n負債比率 = 400/1000 = 0.4\n株式比率 = 600/1000 = 0.6\n負債コストには節税効果(1-税率)を考慮します。\n式：0.4 × (1 - 0.4) × 3% + 0.6 × 13%",
  },
  {
    id: 14,
    title: "資金調達方法",
    question: "資金調達方法に関する説明として、最も適切なものはどれか。",
    choices: [
      "内部留保と減価償却費は、内部金融に該当する。",
      "内部金融とは、企業外部から資金調達を行うことである。",
      "直接金融とは、金融仲介機関から直接的に資金を融通することである。",
      "間接金融とは、金融仲介機関を経由せずに、間接的に資金を融通することである。"
    ],
    answer: 0,
    explanation: "資金調達の分類です。\n・内部金融＝内部留保、減価償却費（自己金融）\n・外部金融＝借入（間接金融）、社債・株式発行（直接金融）\n銀行等を通すのが間接金融、市場から直接調達するのが直接金融です。",
    extraComponent: <FundingTree />
  },
  {
    id: 15,
    title: "ファイナンス・リース取引",
    question: "ファイナンス・リース取引に関する説明として、最も適切なものはどれか。",
    choices: [
      "中途解約不能（ノンキャンセラブル）かつ、コストを実質負担（フルペイアウト）する取引をいう。",
      "中途解約可能で、コストを実質負担しなくてもよい取引をいう。",
      "通常の賃貸借取引に係る方法に準じて会計処理を行う。",
      "通常の資本取引に係る方法に準じて会計処理を行う。"
    ],
    answer: 0,
    explanation: "ファイナンス・リースの定義は「ノンキャンセラブル（解約不能）」かつ「フルペイアウト（コスト負担）」です。会計処理は「売買取引」に準じて行います（資産計上）。",
  },
  {
    id: 16,
    title: "効率的市場仮説",
    question: "次の文章の空欄Ａ～Dに入る語句の組み合わせとして、最も適切なものはどれか。\n（　Ａ　）では、チャート分析などテクニカル分析の有効性が否定されている。（　Ｂ　）では、株価が上昇するか下落するかは五分五分の可能性…。（　Ｃ　）はインサイダー情報を利用しても予測できないとする説。（　Ｄ　）ではファンダメンタル分析の有効性が否定されている。",
    choices: [
      "Ａ：ストロング　Ｂ：ウィーク　Ｃ：ランダムウォーク　Ｄ：セミストロング",
      "Ａ：ウィーク　Ｂ：ランダムウォーク　Ｃ：ストロング　Ｄ：セミストロング",
      "Ａ：ランダムウォーク　Ｂ：セミストロング　Ｃ：ストロング　Ｄ：ウィーク",
      "Ａ：ランダムウォーク　Ｂ：ウィーク　Ｃ：ストロング　Ｄ：セミストロング"
    ],
    answer: 1,
    explanation: "・ウィーク型：過去のデータ（テクニカル）は無効。\n・セミストロング型：公開情報（ファンダメンタルズ）は無効。\n・ストロング型：全情報（インサイダー含む）が無効。\n・ランダムウォーク：予測不可能。",
  }
];

// --- アプリ本体 ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // menu, quiz
  const [filterMode, setFilterMode] = useState('all'); // all, incorrect, review
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState({}); // { id: boolean (isCorrect) }
  const [reviews, setReviews] = useState({}); // { id: boolean (isReview) }
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // 初期ロード
  useEffect(() => {
    const savedHistory = localStorage.getItem('finance_app_history');
    const savedReviews = localStorage.getItem('finance_app_reviews');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    console.log("App loaded. History:", savedHistory);
  }, []);

  // 保存処理
  useEffect(() => {
    localStorage.setItem('finance_app_history', JSON.stringify(history));
    localStorage.setItem('finance_app_reviews', JSON.stringify(reviews));
  }, [history, reviews]);

  // 問題フィルタリング
  const filteredQuestions = useMemo(() => {
    if (filterMode === 'incorrect') {
      return QUESTIONS.filter(q => history[q.id] === false);
    }
    if (filterMode === 'review') {
      return QUESTIONS.filter(q => reviews[q.id]);
    }
    return QUESTIONS;
  }, [filterMode, history, reviews]);

  // クイズ開始
  const startQuiz = (mode) => {
    setFilterMode(mode);
    setCurrentQuestionIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setCurrentScreen('quiz');
    console.log(`Quiz started in ${mode} mode.`);
  };

  // 回答処理
  const handleAnswer = (choiceIndex) => {
    if (isAnswered) return;
    
    setSelectedChoice(choiceIndex);
    setIsAnswered(true);
    
    const currentQ = filteredQuestions[currentQuestionIndex];
    const isCorrect = choiceIndex === currentQ.answer;
    
    setHistory(prev => ({
      ...prev,
      [currentQ.id]: isCorrect
    }));
    
    console.log(`Question ${currentQ.id} answered. Correct: ${isCorrect}`);
  };

  // 次の問題へ
  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
    } else {
      setCurrentScreen('menu');
      console.log("Quiz finished. Returning to menu.");
    }
  };

  // 要復習トグル
  const toggleReview = (id) => {
    setReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // コンポーネント: メニュー画面
  const MenuScreen = () => {
    // 統計
    const totalAnswered = Object.keys(history).length;
    const totalCorrect = Object.values(history).filter(v => v).length;
    const correctRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const incorrectCount = QUESTIONS.filter(q => history[q.id] === false).length;
    const reviewCount = QUESTIONS.filter(q => reviews[q.id]).length;

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-600">財務・会計 問題集</h1>
          <p className="text-slate-500">資本市場と資本コスト (全16問)</p>
        </header>

        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-blue-600">{correctRate}%</div>
            <div className="text-xs text-slate-400">正答率</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-red-500">{incorrectCount}</div>
            <div className="text-xs text-slate-400">前回不正解</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-orange-500">{reviewCount}</div>
            <div className="text-xs text-slate-400">要復習</div>
          </div>
        </div>

        {/* スタートボタン */}
        <div className="space-y-3">
          <button 
            onClick={() => startQuiz('all')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-5 h-5" /> 全問スタート
          </button>
          <div className="grid grid-cols-2 gap-3">
             <button 
              onClick={() => startQuiz('incorrect')}
              disabled={incorrectCount === 0}
              className="py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 不正解のみ ({incorrectCount})
            </button>
            <button 
              onClick={() => startQuiz('review')}
              disabled={reviewCount === 0}
              className="py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <List className="w-4 h-4" /> 要復習のみ ({reviewCount})
            </button>
          </div>
        </div>

        {/* 問題一覧 */}
        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-600 flex items-center gap-2">
            <List className="w-5 h-5" /> 問題一覧・履歴
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {QUESTIONS.map((q) => {
              const isCorrect = history[q.id];
              const isReview = reviews[q.id];
              return (
                <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 mb-1">Q{q.id}</div>
                    <div className="text-sm font-medium text-slate-700">{q.title}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isReview && <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-bold">要復習</span>}
                    {isCorrect === true && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {isCorrect === false && <XCircle className="w-5 h-5 text-red-500" />}
                    {isCorrect === undefined && <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // コンポーネント: クイズ画面
  const QuizScreen = () => {
    const question = filteredQuestions[currentQuestionIndex];

    if (!question) {
      return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <div className="text-xl font-bold text-slate-600">該当する問題がありません</div>
          <button onClick={() => setCurrentScreen('menu')} className="text-blue-500 underline">メニューに戻る</button>
        </div>
      );
    }

    const isCorrect = selectedChoice === question.answer;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <button onClick={() => setCurrentScreen('menu')} className="text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-sm font-bold text-slate-600">
             Q{question.id} ({currentQuestionIndex + 1}/{filteredQuestions.length})
          </div>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 pb-24">
          
          {/* 問題文 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-2">{question.title}</h2>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {question.question}
            </div>
            {/* 図表コンポーネントがあれば表示 */}
            {question.extraComponent && (
               <div className="mt-6 border-t pt-4">
                 {question.extraComponent}
               </div>
            )}
          </div>

          {/* 選択肢 */}
          <div className="space-y-3">
            {question.choices.map((choice, idx) => {
              let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
              
              if (!isAnswered) {
                btnClass += "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700";
              } else {
                if (idx === question.answer) {
                  btnClass += "bg-green-50 border-green-500 text-green-800 font-bold";
                } else if (idx === selectedChoice) {
                  btnClass += "bg-red-50 border-red-500 text-red-800";
                } else {
                  btnClass += "bg-slate-50 border-slate-100 text-slate-400";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isAnswered && idx === question.answer ? 'bg-green-500 text-white border-green-500' : 'bg-white border-slate-300 text-slate-500'}`}>
                        {['ア','イ','ウ','エ','オ'][idx]}
                     </div>
                     <span>{choice}</span>
                     {isAnswered && idx === question.answer && <Check className="w-5 h-5 ml-auto text-green-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 解説エリア */}
          {isAnswered && (
            <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} mb-4`}>
                <div className="flex items-center gap-3 mb-2">
                  {isCorrect ? <CheckCircle className="w-8 h-8 text-green-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                  <span className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '正解！' : '不正解...'}
                  </span>
                </div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap mt-2">
                  <span className="font-bold block mb-1 text-slate-900">【解説】</span>
                  {question.explanation}
                </div>
              </div>

              {/* アクションバー */}
              <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-lg border border-slate-100 sticky bottom-4">
                 <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-lg hover:bg-slate-50 transition">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                      checked={!!reviews[question.id]} 
                      onChange={() => toggleReview(question.id)}
                    />
                    <span className="text-sm font-bold text-slate-600">要復習にする</span>
                 </label>
                 
                 <button 
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 flex items-center gap-2 transition"
                 >
                   {currentQuestionIndex < filteredQuestions.length - 1 ? '次の問題へ' : '結果を見る'}
                   <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {currentScreen === 'menu' ? <MenuScreen /> : <QuizScreen />}
    </div>
  );
}