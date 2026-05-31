// npm install lucide-react recharts firebase
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Check, X, Home, ChevronRight, RefreshCw, BarChart2, BookOpen, User, ArrowRight, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// ==========================================
// CONFIGURATION & INITIALIZATION
// ==========================================
const APP_ID = "QuizApp_Capital_And_Cost_001";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// QUESTION DATA (COMPLETE & UNABRIDGED)
// ==========================================
const quizQuestions = [
  {
    id: 1,
    title: "問題 1 資本市場と資金調達",
    year: "スマート問題集 2-8",
    question: "資本市場と資金調達に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n企業にとっての資金調達は、投資家にとっての（　Ａ　）となる。よって、企業の資金調達のコストである資本コストは、投資家にとっては（　Ａ　）に対する（　Ｂ　）となる。ここで、投資家が（　Ａ　）をするにあたり、資本市場において、（　Ｃ　）を購入するか（　Ｄ　）を購入するかの選択肢がある。リスクの少ない（　Ｃ　）と、リスクの大きい（　Ｄ　）の期待するリターンが同じであれば、投資家はリスクの少ない（　Ｃ　）を選ぶ。投資家はリスクが大きい投資に対しては、大きなリターンを望むからである。",
    options: [
      { key: "ア", text: "Ａ：投資　Ｂ：リスク　Ｃ：社債　Ｄ：株式" },
      { key: "イ", text: "Ａ：消費　Ｂ：リスク　Ｃ：株式　Ｄ：社債" },
      { key: "ウ", text: "Ａ：消費　Ｂ：リターン　Ｃ：社債　Ｄ：株式" },
      { key: "エ", text: "Ａ：投資　Ｂ：リターン　Ｃ：株式　Ｄ：社債" },
      { key: "オ", text: "Ａ：投資　Ｂ：リターン　Ｃ：社債　Ｄ：株式" }
    ],
    answer: "オ",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：本問では、資本市場と資金調達について問われています。[cite: 12]\n・企業にとっての資金調達 → 投資家にとっての投資 [cite: 12]\n・企業の資金調達のコストである資本コスト → 投資家にとっては投資に対するリターン [cite: 12]\n・資本市場において、投資家が企業に投資を行う方法には、「社債の購入」「株式の購入」があります。[cite: 12]\n⇒ 社債の方が、株式よりもリスクが少ない [cite: 12]\n投資家はリスクが大きい投資に対しては、大きなリターンを望むという点について、しっかり把握しておきましょう。[cite: 12]",
      details: [
        { label: "Ａ：投資", content: "企業にとっての資金調達は、投資家にとっての投資となります。[cite: 14]" },
        { label: "Ｂ：リターン", content: "企業にとっての資金調達は、投資家にとっての投資になるので、企業の資金調達のコストである資本コストは、投資家にとっては投資に対するリターンとなります。[cite: 16]" },
        { label: "Ｃ：社債、Ｄ：株式", content: "社債は、株式に比べて、リスクが小さいものとなります。[cite: 18] 社債は利回りが投資する時点で確定されています（社債に明記されています）。[cite: 18] これに対し、株式は株式市場で株価が決まるため、利回りは確定していません。[cite: 18] よって、社債の方が、株式よりもリスクが少なくなります。[cite: 18] 社債や借入金などの負債は、基本的に会社が倒産しない限りは、確実に金利分を上乗せした額がリターンとして期待できます。[cite: 18] これに対して、株式の配当は、負債の金利の支払いと税金の支払いが終わった後の税引後利益に基づいて行われます。[cite: 18] そのため、企業の業績が悪くなれば配当も少なくなる可能性があります。[cite: 18] また、株式の売却益についても、株価の変動は大きいためリスクが高いといえます。[cite: 18]" }
      ]
    }
  },
  {
    id: 2,
    title: "問題 2 投資のリスクとリターン",
    year: "スマート問題集 2-8",
    question: "次の資料は、ある株式の投資収益率について予想される分布を示したものである。株式の投資のリスクの尺度として標準偏差が用いられるが、この資料に基づいた場合、この株式の標準偏差として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．この株式の投資収益率について予想される分布は、次のとおりである。[cite: 22]\n２．標準偏差の計算にああたっては、次に示されたいずれかの計算式によって計算された値を用いる。[cite: 23]",
    hasTable: true,
    tableData: {
      headers: ["投資収益率", "確率"],
      rows: [
        ["4%", "0.2"],
        ["6%", "0.5"],
        ["8%", "0.3"]
      ]
    },
    hasFormulas: true,
    formulas: [
      "(4 － 6.0) × 0.2 ＋ (6 － 6.0) × 0.5 ＋ (8 － 6.0) × 0.3 ＝ 1",
      "(4 － 6.2) × 0.2 ＋ (6 － 6.2) × 0.5 ＋ (8 － 6.2) × 0.3 ＝ 0",
      "(4 － 6.0)² × 0.2 ＋ (6 － 6.0)² × 0.5 ＋ (8 － 6.0)² × 0.3 ＝ 2",
      "(4 － 6.2)² × 0.2 ＋ (6 － 6.2)² × 0.5 ＋ (8 － 6.2)² × 0.3 ＝ 1.96",
      "√1 ＝ 1",
      "√0 ＝ 0",
      "√2 ＝ 1.41",
      "√1.96 ＝ 1.4"
    ],
    options: [
      { key: "ア", text: "－1" },
      { key: "イ", text: "0" },
      { key: "ウ", text: "1" },
      { key: "エ", text: "1.41" },
      { key: "オ", text: "1.4" }
    ],
    answer: "オ",
    explanationType: "math",
    explanation: {
      summary: "ここが重要：本問では、投資のリスクとリターンについて問われています。[cite: 32]\n●投資のリスク：投資により得られるリターンの不確実性のこと。投資がもたらすリターンのばらつきの度合いによって評価される。[cite: 32] 〈統計値〉分散 ＝ Σ(偏差² × 確率) ※偏差 ＝ 値 － 期待値、標準偏差 ＝ √分散 [cite: 32]\n●投資のリターン：投資により得られる期待収益率のこと。投資がもたらす期待値によって評価される。[cite: 32] 〈統計値〉期待値 ＝ Σ(値 × 確率) [cite: 32]\n期待値、分散、標準偏差の計算ができるよう、しっかりと練習しておきましょう。[cite: 32]",
      steps: [
        { title: "(1) 期待値", formula: "期待値 ＝ Σ(投資収益率 × 確率)", calc: "＝ 4％ × 0.2 ＋ 6％ × 0.5 ＋ 8％ × 0.3 ＝ 0.8％ ＋ 3.0％ ＋ 2.4％ ＝ 6.2％ [cite: 36, 37]" },
        { title: "(2) 分慢 (分散)", formula: "分散 ＝ Σ(偏差² × 確率)", calc: "＝ (4％ － 6.2％)² × 0.2 ＋ (6％ － 6.2％)² × 0.5 ＋ (8％ － 6.2％)² × 0.3\n＝ (－2.2％)² × 0.2 ＋ (－0.2％)² × 0.5 ＋ (1.8％)² × 0.3\n＝ 4.84 × 0.2 ＋ 0.04 × 0.5 ＋ 3.24 × 0.3\n＝ 0.968 ＋ 0.02 ＋ 0.972\n＝ 1.96 [cite: 39]" },
        { title: "(3) 標準偏差", formula: "標準偏差 ＝ √分散", calc: "＝ √1.96 ＝ 1.4 [cite: 41]\nしたがって、この株式の標準偏差は1.4となります。よって、オが適切です。[cite: 42]" }
      ]
    }
  },
  {
    id: 3,
    title: "問題 3 リスクの種類",
    year: "スマート問題集 2-8",
    question: "ポートフォリオ理論におけるリスクに関する記述として、最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "流動性リスクとは、取引相手の財務状況の悪化や倒産により貸付金の受取利息や元本の回収が滞ってしまうリスクのことである。" },
      { key: "イ", text: "カントリー・リスクとは、外貨建て金融商品における国と国との為替変動により資産価値が変動するリスクのことである。" },
      { key: "ウ", text: "価格変動リスクとは、市場で取引量が少ないために資産を換金しようとしたときにすぐに売ることができない、あるいは希望する価格で売ることができなくなるリスクのことである。" },
      { key: "エ", text: "信用リスクとは、その国の政治や経済などによって資産価値が変動するリスクのことである。" },
      { key: "オ", text: "システマティック・リスクとは、市場全体との相関によるリスクであり、分散化によって消去することができないリスクのことである。" }
    ],
    answer: "オ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、ポートフォリオ理論におけるリスクについて問われています。[cite: 52] リスクとは、不確実性のことです。[cite: 52] リスクは、リターンのばらつきであると表現することができます。[cite: 52]\nリスクの種類には、次のものがあります。●システマティック・リスク（市場に連動するリスク）●信用リスク（利子や元本を返済できなくなるリスク）●流動性リスク（金融資産を市場で換金できないリスク）●金利リスク（金利変動によるリスク）●価格変動リスク（金融商品の価格変動によるリスク）●為替リスク（為替相場の変動によるリスク）●カントリー・リスク（その国の政治や経済などに連動するリスク） [cite: 52]\n特に、市場全体との相関によるリスクであり、分散化によって消去することができないリスクのことを、システマティック・リスクということに注意してください。[cite: 52]",
    explanation: [
      { choice: "ア", content: "× ： 取引相手の財務状況の悪化や倒産により貸付金の受取利息や元本の回収が滞ってしまうリスクは、信用リスクです。流動性リスクではありません。[cite: 53]" },
      { choice: "イ", content: "× ： 外貨建て金融商品における国と国との為替変動により資産価値が変動するリスクは、為替リスクです。カントリー・リスクではありません。[cite: 54]" },
      { choice: "ウ", content: "× ： 市場で取引量が少ないために資産を換金しようとしたときにすぐに売ることができない、あるいは希望する価格で売ることができなくなるリスクは、流動性リスクです。価格変動リスクではありません。[cite: 55]" },
      { choice: "エ", content: "× ： その国の政治や経済などによって資産価値が変動するリスクは、カントリー・リスクです。信用リスクではありません。[cite: 56]" },
      { choice: "オ", content: "○ ： 記述のように、システマティック・リスクとは、市場に連動するリスクのことであり、分散投資によって消去することができないリスクのことです。これは、市場リスク、あるいはマーケット・リスクとも呼ばれます。よって、記述は適切です。[cite: 57]" }
    ]
  },
  {
    id: 4,
    title: "問題 4 リスクに対する投資家の選好",
    year: "スマート問題集 2-8",
    question: "次の図は、投資家の無差別曲線を描いたものである。この投資家の選好を表す組み合わせとして、最も適切なものはどれか。ただし、図において、満足度のレベルは、U1＜U2＜U3である。[cite: 59]",
    hasCustomSvg: "indifference-curves",
    options: [
      { key: "ア", text: "Ａ：リスク回避者　　　 Ｂ：リスク中立者　　　　Ｃ：リスク愛好者" },
      { key: "イ", text: "Ａ：リスク回避者　　　 Ｂ：リスク愛好者　　　　Ｃ：リスク中立者" },
      { key: "ウ", text: "Ａ：リスク愛好者　　　 Ｂ：リスク中立者　　　　Ｃ：リスク回避者" },
      { key: "エ", text: "Ａ：リスク愛好者　　　 Ｂ：リスク回避者　　　　Ｃ：リスク中立者" }
    ],
    answer: "ア",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：本問では、リスクに対する投資家の選好について問われています。[cite: 66] リスクに対する投資家の評価は、投資家の選好によって異なります。[cite: 66] 一般に、ファイナンスでは、リスク回避者の行動を想定しています。[cite: 66]\n●リスク回避者：同一のリターンならば、リスクのより小さいものを選好する投資家 [cite: 66]\n●リスク中立者：リスクと無関係に、より高いリターンを選好する投資家 [cite: 66]\n●リスク愛好者：同一のリターンならば、リスクのより大きいものを選好する投資家 [cite: 66]\n図において、満足度のレベルは、U1＜U2＜U3です。[cite: 66]",
      details: [
        { label: "Ａ：リスク回避者", content: "無差別曲線は、同一のリターンならば、リスクのより小さいものを選好する投資家（U3が最も左上側）を表しているので、この投資家は、リスク回避者です。[cite: 68]" },
        { label: "Ｂ：リスク中立者", content: "無差別曲線は、リスクと無関係に、より高いリターンを選好する投資家（水平線で、上が満足度高）を表しているので、この投資家は、リスク中立者です。[cite: 69]" },
        { label: "Ｃ：リスク愛好者", content: "無差別曲線は、同一のリターンならば、リスクのより大きいものを選好する投資家（右下がりで、右側ほど満足度高）を表しているので、この投資家は、リスク愛好者です。[cite: 70] 以上から、選択肢アが適切であり、これが正解です。[cite: 71]" }
      ]
    }
  },
  {
    id: 5,
    title: "問題 5 ポートフォリオのリスク低減効果",
    year: "スマート問題集 2-8",
    question: "ポートフォリオのリスク低減効果に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n（　Ａ　）とは、複数の資産を組み合わせてつくられた資産全体のことをいう。マコービッツは個々の証券の（　Ｂ　）とその組み合わせである（　Ａ　）の（　Ｂ　）を区別して調べることにより、（　Ａ　）を組むことによって（　Ｂ　）の（　Ｃ　）が可能になることを提唱した。個別の証券に集中して投資する（　Ｂ　）よりも、資産が（　Ｃ　）化された（　Ａ　）のほうが（　Ｂ　）は小さくなることを、（　Ａ　）の（　Ｄ　）という。[cite: 74]",
    options: [
      { key: "ア", text: "Ａ：ポートフォリオ　Ｂ：リスク　Ｃ：分散　Ｄ：リスク低減効果" },
      { key: "イ", text: "Ａ：ポートフォリオ　Ｂ：リターン　Ｃ：集中　Ｄ：ポートフォリオ効果" },
      { key: "ウ", text: "Ａ：投資家の選好　Ｂ：リターン　Ｃ：分散　Ｄ：リスク低減効果" },
      { key: "エ", text: "Ａ：投資家の選好　Ｂ：リスク　Ｃ：集中　Ｄ：ポートフォリオ効果" }
    ],
    answer: "ア",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：本問では、ポートフォリオのリスク低減効果について問われています。[cite: 81] ポートフォリオとは、様々な投資を組み合わせたもののことをいいます。[cite: 81]\n2つの株式XとYについてポートフォリオを組む際の、ポートフォリオの期待収益率は、次のように計算されます。[cite: 81]\nポートフォリオの期待収益率 ＝ [株式Xの期待収益率] × [株式Xの組み入れ比率] ＋ [株式Yの期待収益率] × [株式Yの組み入れ比率] [cite: 81]\n個別の証券に集中して投資するリスクよりも、資産が分散化されたポートフォリオのほうがリスクは小さくなることを、ポートフォリオのリスク低減効果（分散投資によるリスク低減効果）といいます。[cite: 81]",
      details: [
        { label: "Ａ：ポートフォリオ", content: "ポートフォリオとは、複数の資産を組み合わせてつくられた資産全体のことをいいます。[cite: 83] 資本市場においては、様々な投資を組み合わせたもののことです。[cite: 83]" },
        { label: "Ｂ：リスク、Ｃ：分散", content: "H.マコービッツは、個々の証券のリスクとその組み合わせであるポートフォリオのリスクを区別し、ポートフォリオを組むことによってリスクの分散が可能になることを提唱しました。[cite: 85]" },
        { label: "Ｄ：リスク低減効果", content: "個別の証券に集中して投資するリスクよりも、資産が分散化されたポートフォリオのほうがリスクは小さくなることを、ポートフォリオのリスク低減効果（分散投資によるリスク低減効果）といいます。[cite: 87] さらに、H.マコービッツは、リターンとリスクを分布の平均と分散の統計量として具体的に示し、最適なポートフォリオの選択方法を提示しました。[cite: 87] この最適な選択方法を提示した理論のことを、ポートフォリオ選択理論といいます。[cite: 87]" }
      ]
    }
  },
  {
    id: 6,
    title: "問題 6 ポートフォリオのリターンとリスク",
    year: "スマート問題集 2-8",
    question: "次の図は、2つの株式XとYについて、ポートフォリオの組み入れ比率を変化させて、縦軸に期待収益率を横軸に標準偏差をとったポートフォリオのリターンとリスクを示したものである。この図に関する記述として、最も適切なものを下記の解答群から選べ。[cite: 89]",
    hasCustomSvg: "return-risk-curve",
    options: [
      { key: "ア", text: "株式Xにだけ単独に投資するというのは、ローリスク・ローリターンの投資家行動といえる。" },
      { key: "イ", text: "株式Yにだけ単独に投資するというのは、ハイリスク・ハイリターンの投資家行動といえる。" },
      { key: "ウ", text: "リスクが最も小さくなるのは、組み入れ比率が株式X37%・株式Y63％であるときである。" },
      { key: "エ", text: "組み入れ比率が株式X37%・株式Y63％であるとき以外の組み入れ比率の場合、個別の証券に集中して投資する場合に比べて、リスクは高い。" }
    ],
    answer: "ウ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、ポートフォリオのリターンとリスクについて問われています。[cite: 97] 図をみると、株式Xが100%のときと、株式Yが100%のときを結んだ線よりも、ポートフォリオの標準偏差は小さくなることがわかります。[cite: 97] 標準偏差が最も小さくなるのは、株式Xが37%のときですが、それ以外の組み入れ比率のときもリスクである標準偏差は低減しています。[cite: 97] このことから、個別の証券に集中して投資するリスクよりも、資産が分散化されたポートフォリオのほうがリスクは小さくなるというポートフォリオのリスク低減効果が働いていることが示されます。[cite: 97]",
    explanation: [
      { choice: "ア", content: "× ： 株式Xにだけ単独に投資すると、リターンを表す期待収益率は10で最も高くなりますが、リスクを表す標準偏差も8.12で最も大きくなり、リスクが最も高くなります。[cite: 99] これは、ハイリスク・ハイリターンの投資家行動と言えます。ローリスク・ローリターンではありません。[cite: 99]" },
      { choice: "イ", content: "× ： 株式Yにだけ単独に投資すると、リスクを表す標準偏差は4.65でリスクが最も低いわけではありませんが、リターンを表す期待収益率は8で最も低くなります。[cite: 101] これは、ローリターンの投資家行動と言えます。ハイリスク・ハイリターンではありません。[cite: 101]" },
      { choice: "ウ", content: "○ ： リスクを表す標準偏差が最も小さくなるのは、組み入れ比率が株式X37%・株式Y63％であるときです。[cite: 103] これにより、個別の証券に集中して投資するリスクよりも、資産が分散化されたポートフォリオのほうがリスクは小さくなるというポートフォリオのリスク低減効果が働いていることが示されます。よって、記述は適切です。[cite: 103]" },
      { choice: "エ", content: "× ： 組み入れ比率が株式X37%・株式Y63％であるとき以外の組み入れ比率の場合も、個別の証券に集中して投資する場合に比べて、リスクである標準偏差は低減しています。[cite: 105] 組み入れ比率が株式X37%・株式Y63％であるとき以外の組み入れ比率の場合、リスクが高いというわけではありません。[cite: 105]" }
    ]
  },
  {
    id: 7,
    title: "問題 7 相関係数とリスク",
    year: "スマート問題集 2-8",
    question: "次の図は、相関係数が－1、0、1の場合における、2つの株式XとYについて、ポートフォリオの組み入れ比率を変化させて、縦軸に期待収益率を横軸に標準偏差をとったポートフォリオのリターンとリスクを示したものである。この図に関する記述として、最も適切なものを下記の解答群から選べ。[cite: 107]",
    hasCustomSvg: "correlation-risk-graph",
    options: [
      { key: "ア", text: "相関係数が－1のとき、ポートフォリオのリスク低減効果は最も小さくなる。" },
      { key: "イ", text: "相関係数が1のとき、ポートフォリオのリスク低減効果は最も大きくなる。" },
      { key: "ウ", text: "相関係数が0のとき、ポートフォリオのリスクを低減することができない。" },
      { key: "エ", text: "相関係数が1以外のとき、ポートフォリオのリスク低減効果がある。" }
    ],
    answer: "エ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、相関係数とリスクについて問われています。[cite: 115]\n●共分散：資本市場では、2つの株式がどれぐらい一緒に動くかを表す。[cite: 115] プラス → 同じ方向、マイナス → 逆の方向に動く。数式：共分散 ＝ Σ(Xの偏差 × Yの偏差 × 確率) [cite: 115]\n●相関係数：資本市場では、2つの株式の関係の強さを表す。[cite: 115] 相関係数 ＝ －1のとき：まったく反対の方向に動きリスクを最大限に低減（0に）できる。[cite: 115] 相関係数 ＝ 0のとき：何の関係もないがリスクの低減はできる。[cite: 115] 相関係数 ＝ 1のとき：まったく同じ方向に動きリスクの低減をすることができない。[cite: 115] 数式：相関係数 ＝ 共分散 ／ (Xの標準偏差 × Yの標準偏差) [cite: 115]",
    explanation: [
      { choice: "ア", content: "× ： 相関係数が－1のとき、ポートフォリオのリスク低減効果は最も大きくなります。[cite: 117] 図のように、株式Xの比率が減るにしたがって標準偏差が減少していき、ある点で標準偏差が0になります。[cite: 117] リスク低減効果は最も小さくなるのではありません。[cite: 117]" },
      { choice: "イ", content: "× ： 相関係数が1のときは、ポートフォリオのリスク低減効果はゼロになります。[cite: 119] 図のように、株式Xと株式Yの点を結んだ直線になります。最も大きくなるのではありません。[cite: 119]" },
      { choice: "ウ", content: "× ： 相関係数が0のとき、図のような曲線となります。[cite: 121] ポートフォリオのリスクを低減することができます。リスクの低減をすることができないというわけではありません。[cite: 121]" },
      { choice: "エ", content: "○ ： 図から、相関係数が1以外の場合は、ポートフォリオのリスク低減効果があることがわかります。[cite: 123] 相関係数が1というのは、景気の動向に対して全く同じ方向に動くということです。[cite: 123] よって、似たような動きをする株でポートフォリオを組むよりも、逆の動きをするような株で組んだ方が、リスク低減効果が高いということになります。よって、記述は適切です。[cite: 123]" }
    ]
  },
  {
    id: 8,
    title: "問題 8 システマティックリスクと非システマティックリスク",
    year: "スマート問題集 2-8",
    question: "次の文章は、ポートフォリオのリスクとリターン、分散効果について述べたものである。空欄Ａ～Ｃに入る語句の組み合わせとして、最も適切なものはどれか。[cite: 125]\n\nポートフォリオの総リスクは、（　Ａ　）と（　Ｂ　）から構成される。[cite: 126]\n（　Ａ　）は、ポートフォリオを構成する銘柄数が多くなると減少するが（　Ｂ　）は、減少することはない。[cite: 127] これは（　Ｂ　）が株式市場のリスクを表すためである。[cite: 127] （　Ｃ　）は、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線です。[cite: 127] （　Ｃ　）は、ベータの一次関数で表され、切片は安全利子率であり、傾きは市場ポートフォリオのリスクプレミアムである。[cite: 127]",
    hasCustomSvg: "systematic-risk-graphs",
    options: [
      { key: "ア", text: "Ａ：システマティック・リスク　　 Ｂ：アンシステマティック・リスク　　Ｃ：資本市場線" },
      { key: "イ", text: "Ａ：システマティック・リスク　　 Ｂ：アンシステマティック・リスク　　Ｃ：証券市場線" },
      { key: "ウ", text: "Ａ：アンシステマティック・リスク　　 Ｂ：システマティック・リスク　　Ｃ：証券市場線" },
      { key: "エ", text: "Ａ：アンシステマティック・リスク　　 Ｂ：システマティック・リスク　　Ｃ：資本市場線" }
    ],
    answer: "ウ",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：株式のリスクには、ポートフォリオを組むことで分散化できるリスクと分散化できないリスクがあります。[cite: 134] 分散化できるリスクをアンシステマティック・リスク、分散化できないリスクをシステマティック・リスクといい、システマティック・リスクは市場全体のリスクを意味しています。[cite: 134] 分散化によってリスクが低減される効果をポートフォリオ効果といいます。[cite: 134] 一般に、組込銘柄数が20程度になると、ほぼ、市場ポートフォリオと同様のリスク水準となるといわれています。[cite: 134]\n証券市場線（Security Market Line、SML） とは、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線です。[cite: 134] 切片は安全利子率であり、傾きは市場ポートフォリオのリスクプレミアムです。[cite: 134]",
      details: [
        { label: "Ａ：アンシステマティック・リスク", content: "Ａは、銘柄数が増加すると減少します。[cite: 135] これをポートフォリオの分散効果といい、個別銘柄のリスクが分散投資によって次第に低減していきます。[cite: 135] 銘柄固有のリスクをアンシステマティック・リスクといいます。従って、Ａはアンシステマティック・リスクが入ります。[cite: 135]" },
        { label: "Ｂ：システマティック・リスク", content: "Ｂは、株式市場のリスクになりますので、分散投資によっても変化しません。[cite: 136] Ｂにはシステマティック・リスクが入ります。[cite: 136]" },
        { label: "Ｃ：証券市場線", content: "横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線は、証券市場線（SML）です。[cite: 137] 従って、Ｃは証券市場線が入ります。よって、選択肢ウが正解となります。[cite: 137, 138]" }
      ]
    }
  },
  {
    id: 9,
    title: "問題 9 効率的フロンティア",
    year: "スマート問題集 2-8",
    question: "次の図は、資本市場にたくさん存在する株式を自由に組み合わせたポートフォリオを作成し、リターンとリスクの分布を示したものである。この図に関する記述として、最も不適切なものを下記の解答群から選べ。[cite: 140]",
    hasCustomSvg: "efficient-frontier-graph",
    options: [
      { key: "ア", text: "効率的フロンティアとは、特定のリスクの大きさに対して、最低のリターンをあげることが期待されるポートフォリオのことをいう。" },
      { key: "イ", text: "ポートフォリオAとポートフォリオBを比較してみると、合理的な投資家は必ず効率的フロンティアの上にあるAを選ぶ。" },
      { key: "ウ", text: "ローリスク・ローリターンを好む投資家は、効率的フロンティアの左側の線上のポートフォリオを選ぶ。" },
      { key: "エ", text: "ハイリスク・ハイリターンを好む投資家は、効率的フロンティアのright側の線上のポートフォリオを選ぶ。" }
    ],
    answer: "ア",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、効率的フロンティアについて問われています。[cite: 149] 株式の組み合わせは無数にありますので、ポートフォリオも無数に存在します。[cite: 149] 投資家は、リスクをできるだけ抑えて、高いリターンを得ようとすると、図の赤色実線の曲線上のポートフォリオを選択することになります。[cite: 149] この曲線のことを、効率的フロンティアと呼びます。[cite: 149] ●効率的フロンティア：特定のリスクの大きさに対して、最高のリターンをあげることが期待されるポートフォリオ、または、期待される利益の一定の大きさに対して最もリスクの低いポートフォリオ。[cite: 149]",
    explanation: [
      { choice: "ア", content: "× ： 効率的フロンティアとは、特定のリスクの大きさに対して、最高のリターンをあげることが期待されるポートフォリオ、または、期待される利益の一定の大きさに対して最もリスクの低いポートフォリオのことをいいます。[cite: 151] 特定のリスクの大きさに対して、最低のリターンをあげることが期待されるポートフォリオではありません。[cite: 151] よって、記述は不適切です。[cite: 151]" },
      { choice: "イ", content: "○ ： 適切な記述です。[cite: 153] 効率的フロンティアの上にあるポートフォリオAと、標準偏差はAと同じですが、期待収益率がAよりも低いポートフォリオBを比較してみると、Bに比べ、Aは同じリスクでより高いリターンを得ることができます。[cite: 153] よって、合理的な投資家はAを選択します。[cite: 153]" },
      { choice: "ウ", content: "○ ： 適切な記述です。[cite: 155] ローリスク・ローリターンを好む投資家は、標準偏差の低く期待収益率が低い、効率的フロンティアの左側の線上のポートフォリオを選びます。[cite: 155]" },
      { choice: "エ", content: "○ ： 適切な記述です。[cite: 157] ハイリスク・ハイリターンを好む投資家は、標準偏差が高く期待収益率の高い、効率的フロンティアの右側の線上のポートフォリオを選びます。[cite: 157]" }
    ]
  },
  {
    id: 10,
    title: "問題 10 リスクフリー資産",
    year: "スマート問題集 2-8",
    question: "次の図は、株式Xと国債をポートフォリオに組み込んだ場合におけるリターンとリスクの分布を示したものである。この図に関する記述として、最も適切なものを下記の解答群から選べ。[cite: 159]",
    hasCustomSvg: "riskfree-portfolio-graph",
    options: [
      { key: "ア", text: "国債の期待収益率は、10％である。" },
      { key: "イ", text: "国債は、リスクフリー資産である。" },
      { key: "ウ", text: "国債を購入する比率が低くなるほど、リスクは小さくなる。" },
      { key: "エ", text: "国債をポートフォリオに入れると、株式だけのポートフォリオよりも、リスクを嫌う投資家は、よりリスクの低いポートフォリオを選択できなくなる。" }
    ],
    answer: "イ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、リスクフリー資産について問われています。[cite: 167] 国債は、景気の変動によってリターンが変わりませんので、リスクがない資産、つまりリスクフリー資産であると考えられます。[cite: 167] 株式Xと国債を組み合わせたポートフォリオを作成すると、リターンとリスクの関係は、図のように直線で表されます。[cite: 167]",
    explanation: [
      { choice: "ア", content: "× ： 国債の期待収益率は2％です。[cite: 169] 国債だけを単独に購入した場合は、図の縦軸切片（直線が縦軸を切り取る値）で表されます。[cite: 169] このとき、期待収益率は2％となっています。10％ではありません。[cite: 169]" },
      { choice: "イ", content: "○ ： 国債は、リスクフリー資産です。[cite: 171] 国債だけを単独に購入した場合は、図の縦軸切片で表されます。[cite: 171] このとき、標準偏差は0となっています。[cite: 171] 標準偏差はリスクを表すものですので、国債はリスクがゼロであることがわかります。よって、記述は適切です。[cite: 171]" },
      { choice: "ウ", content: "× ： 国債を購入する比率が低くなるほど、標準偏差で示されるリスクは大きくなります。[cite: 173] リスクは小さくなるのではありません。[cite: 173] 株式Xを購入する比率を増やしていくと、期待収益率と標準偏差の関係は、株式Xが100%の点まで引かれた右上がりの直線となります。[cite: 173]" },
      { choice: "エ", content: "× ： リスクフリー資産をポートフォリオに入れると、投資家の選択の幅が広がります。[cite: 175] リスクを嫌う投資家は、株式だけのポートフォリオよりも、よりリスクの低いポートフォリオを選択できるようになります。選択することができなくなるのではありません。[cite: 175]" }
    ]
  },
  {
    id: 11,
    title: "問題 11 市場ポートフォリオ",
    year: "スマート問題集 2-8",
    question: "次の図は、リスクフリー資産である国債と、全ての株式を自由に組み合わせた場合におけるリターンとリスクの分布を示したものである。この図に関する記述として、最も適切なものを下記の解答群から選べ。[cite: 177]",
    hasCustomSvg: "market-portfolio-graph",
    options: [
      { key: "ア", text: "資本市場線とは、資本市場において、リスクフリー資産だけを購入した場合を示すものである。" },
      { key: "イ", text: "A点とB点を比較すると、B点の方が同じリスクで高いリターンを実現できる。" },
      { key: "ウ", text: "合理的な投資家は、必ず資本市場線の上のポートフォリオを選択する。" },
      { key: "エ", text: "市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小である。" }
    ],
    answer: "ウ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、市場ポートフォリオについて問われています。[cite: 185] 投資家は、資本市場線と効率的フロンティアの接点において、最適なリターンとリスクを実現することができます。[cite: 185]\n・資本市場線：リスクフリー資産と、任意の株式を自由に組み合わせた直線のうち、最大限に上に位置するもの。[cite: 185]\n・効率的フロンティア：特定のリスクの大きさに対して、最高のリターンをあげるポートフォリオ。[cite: 185]\n・市場ポートフォリオ：資本市場線と効率的フロンティアの接点（M）のこと。[cite: 185]",
    explanation: [
      { choice: "ア", content: "× ： 国債を組み合わせることで任意の株式によるポートフォリオと、リスクフリーレートの点を結んだ直線上のポートフォリオが選択可能になります。[cite: 186] この直線を最大限に上に引いたのが資本市場線です。[cite: 186] リスクフリー資産だけを購入した場合を示すものではありません。[cite: 186]" },
      { choice: "イ", content: "× ： B点は効率的フロンティアの上にあるため、株式だけによるポートフォリオとしては最適化されています。[cite: 187] しかし国債を組み合わせたポートフォリオであるA点と比較すると、A点の方が同じリスクで、より高いリターンを実現できます。[cite: 187] B点の方が同じリスクで高いリターンを実現できるのではありません。[cite: 187]" },
      { choice: "ウ", content: "○ ： 合理的な投資家は、必ず資本市場線の上のポートフォリオを選択することがわかります。よって、記述は適切です。[cite: 188]" },
      { choice: "エ", content: "× ： 市場ポートフォリオとは、資本市場線と効率的フロンティアの接点のことです。[cite: 189] 市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小ではありません（最小はリスクフリー資産点）。よって、不適切です。正解はウになります。[cite: 189, 190]" }
    ]
  },
  {
    id: 12,
    title: "問題 12 CAPM",
    year: "スマート問題集 2-8",
    question: "次の資料は、G証券に関するものである。この資料に基づいた場合、CAPMによりG証券の期待収益率を計算する数式として、最も適切なものを下記の解答群から選べ。[cite: 192]\n\n【資　料】\n・リスクフリーレート：2％\n・β値：1.2\n・市場ポートフォリオの期待収益率：8％ [cite: 193]",
    options: [
      { key: "ア", text: "8％ ＋ 1.2 × (8％ － 2％)" },
      { key: "イ", text: "8％ － 1.2 × (8％ ＋ 2％)" },
      { key: "ウ", text: "2％ ＋ 1.2 × (8％ ＋ 2％)" },
      { key: "エ", text: "2％ － 1.2 × (8％ － 2％)" },
      { key: "オ", text: "2％ ＋ 1.2 × (8％ － 2％)" }
    ],
    answer: "オ",
    explanationType: "math",
    explanation: {
      summary: "ここが重要：本問では、CAPMについて問われています。[cite: 202] 資本資産評価モデル（CAPM：Capital Asset Pricing Model）とは、投資資本（証券）の期待収益率は、リスクフリーレートとリスクプレミアムを加えたものになるというモデルのことをいいます。[cite: 202]\n〈数式〉個別株式の期待収益率 ＝ リスクフリーレート ＋ β × 市場リスクプレミアム [cite: 202]\n※市場リスクプレミアム ＝ 市場ポートフォリオの期待収益率 － リスクフリーレート [cite: 202]\n※β：市場ポートフォリオと比べたときの、個別株式のリスクの大きさ [cite: 202]\nCAPMの計算は、頻出問題です。しっかりと計算することができるように練習しておきましょう。[cite: 202]",
      steps: [
        { title: "G証券の期待収益率の算定（CAPM公式代入）", formula: "G証券の期待収益率 ＝ リスクフリーレート ＋ β値 × (市場ポートフォリオの期待収益率 － リスクフリーレート)", calc: "＝ 2％ ＋ 1.2 × (8％ － 2％) [cite: 206]\n＝ 2％ ＋ 7.2％ ＝ 9.2％ [cite: 207, 208]\nしたがって、CAPMによりG証券の期待収益率を計算する数式は、「2％ ＋ 1.2 × (8％ － 2％)」となります。よって、オが適切です。[cite: 209, 210]" }
      ]
    }
  },
  {
    id: 13,
    title: "問題 13 加重平均資本コスト",
    year: "スマート問題集 2-8",
    question: "次の資料は、H社の資金調達に関するものである。この資料に基づいた場合、H社の加重平均資本コストを計算する数式として、最も適切なものを下記の解答群から選べ。[cite: 212]\n\n【資　料】\n１．H社は現在、普通株式と社債によって資金調達を行っている。[cite: 214]\n２．資金調達の状況：社債 帳簿価額400万円・時価400万円 ／ 普通株式 帳簿価額400万円・時価600万円 [cite: 215]\n３．投資家が要求している収益率：社債 3% ／ 普通株式 13% [cite: 216]\n４．実効税率は40％とする。[cite: 217]\n５．普通株式の収益率はCAPMにより算出されたものである。[cite: 218]",
    options: [
      { key: "ア", text: "0.5 × (1 － 0.4) × 3％ ＋ 0.5 × 13％" },
      { key: "イ", text: "0.5 × 0.4 × 3％ ＋ 0.5 × 13％" },
      { key: "ウ", text: "0.4 × 3％ ＋ 0.6 × 13％" },
      { key: "エ", text: "0.4 × (1 － 0.4) × 3％ ＋ 0.6 × 13％" },
      { key: "オ", text: "0.4 × 0.4 × 3％ ＋ 0.6 × 13％" }
    ],
    answer: "エ",
    explanationType: "math",
    explanation: {
      summary: "ここが重要：本問では、加重平均資本コストについて問われています。[cite: 227] 加重平均資本コスト（WACC：Weighted Average Cost of Capital）とは、負債から生じるコストと資本から生じるコストを加重平均したもののことをいいます。[cite: 227]\n〈数式〉WACC ＝ 負債／(負債＋資本) ×（1－実効税率）× 負債利子率 ＋ 資本／(負債＋資本) × 資本コスト [cite: 227]\n加重平均資本コストの計算において、負債と資本の額については、貸借対照表の簿価（帳簿価額）ではなく、時価を使用する点に注意しましょう。[cite: 227]",
      steps: [
        { title: "1. 負債・資本の構成比率計算（時価ベース）", formula: "負債の構成比率 ＝ 400 ／ (400 ＋ 600) ＝ 0.4 \n 資本の構成比率 ＝ 600 ／ (400 ＋ 600) ＝ 0.6", calc: "構成比率は、帳簿価額ではなく、時価を用います。[cite: 228] 負債時価は400万円、株式時価は600万円、合計1000万円です。[cite: 229, 230]" },
        { title: "2. 加重平均資本コストWACCの数式組み立て", formula: "WACC ＝ 負債の構成比率 × (1 － 実効税率) × 負債利子率 ＋ 資本の構成比率 × 資本コスト", calc: "＝ 0.4 × (1 － 0.4) × 3％ ＋ 0.6 × 13％ [cite: 233]\n＝ 0.72％ ＋ 7.8％ ＝ 8.52％ [cite: 234, 235]\nしたがって、H社の加重平均資本コストを計算する数式は、「0.4 × (1 － 0.4) × 3％ ＋ 0.6 × 13％」となります。よって、エが適切です。[cite: 236, 237]" }
      ]
    }
  },
  {
    id: 14,
    title: "問題 14 資金調達方法",
    year: "スマート問題集 2-8",
    question: "資金調達方法に関する説明として、最も適切なものはどれか。[cite: 239]",
    hasCustomMap: true,
    options: [
      { key: "ア", text: "内部留保と減価償却費は、内部金融に該当する。" },
      { key: "イ", text: "内部金融とは、企業外部から資金調達を行うことである。" },
      { key: "ウ", text: "直接金融とは、金融仲介機関から直接的に資金を融通することである。" },
      { key: "エ", text: "間接金融とは、金融仲介機関を経由せずに、間接的に資金を融通することである。" }
    ],
    answer: "ア",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、資金調達方法について問われています。[cite: 246] 資金調達の分類（外部金融［企業間信用・間接金融・直接金融］、内部金融［自己金融：内部留保・減価償却］）の関係性を混同しないよう、しっかりと整理しておきましょう。[cite: 246]",
    explanation: [
      { choice: "ア", content: "○ ： 内部金融とは、自己金融ともいわれ、企業の内部で資金の調達を行うことです。[cite: 248] 留保利益（内部留保）と減価償却費が内部金融に該当します。よって、記述は適切です。[cite: 248]" },
      { choice: "イ", content: "× ： 企業外部から資金調達を行うものは、外部金融です。内部金融ではありません。[cite: 250] 企業間信用、借入金融、証券金融が外部金融に該当します。[cite: 250]" },
      { choice: "ウ", content: "× ： 直接金融とは、金融仲介機関を経由せず、借り手が金融市場から直接資金を調達（社債発行、株式発行など）することです。[cite: 252] 金融仲介機関から直接的に資金を融通することではありません。[cite: 252]" },
      { choice: "エ", content: "× ： 間接金融とは、金融市場を経由せずに、貸し手と借り手の間を金融仲介機関（銀行、信用金庫など）が仲介し、間接的に資金を融通することをいいます。[cite: 254] 金融仲介機関を経由せずに融通することではありません。混同しないようにしましょう。[cite: 254]" }
    ]
  },
  {
    id: 15,
    title: "問題 15 ファイナンス・リース取引",
    year: "スマート問題集 2-8",
    question: "ファイナンス・リース取引に関する説明として、最も適切なものはどれか。[cite: 256]",
    options: [
      { key: "ア", text: "ファイナンス・リース取引とは、リース契約に基づくリース期間の中途において当該契約を解除することができないリース取引またはこれに準ずるリース取引で、借手が、当該契約に基づき使用する物件からもたらされる経済的利益を実質的に享受することができ、かつ、当該リース物件の使用に伴って生じるコストを実質的に負担することとなるリース取引をいう。" },
      { key: "イ", text: "ファイナンス・リース取引とは、リース契約に基づくリース期間の中途において当該契約を解除することができるリース取引またはこれに準ずるリース取引で、借手が、当該契約に基づき使用する物件からもたらされる経済的利益を実質的に享受することができ、かつ、当該リース物件の使用に伴って生じるコストを実質的に負担しなくてもよいリース取引をいう。" },
      { key: "ウ", text: "ファイナンス・リース取引については、通常の賃貸借取引に係る方法に準じて会計処理を行う。" },
      { key: "エ", text: "ファイナンス・リース取引については、通常の資本取引に係る方法に準じて会計処理を行う。" }
    ],
    answer: "ア",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、ファイナンス・リース取引について問われています。[cite: 263] ファイナンス・リース取引とは、リース会社が、借り手が選択した設備などのリース物件を購入し、借り手に貸与するリース取引の一種です。[cite: 263] ●ノンキャンセラブル（途中解約不能） [cite: 263] ●フルペイアウト（維持管理費などの使用コストを実質負担） [cite: 263]\n会計上は通常の『売買取引に係る方法に準じて会計処理』をします。[cite: 263] したがって、リース物件は借り手の貸借対照表に開示され、減価償却費は借り手の損益計算書に計上されます。[cite: 263] 長期借入して設備を購入した場合と同様の効果があるため、資金調達の性格が強いものであることも理解しておきましょう。[cite: 263]",
    explanation: [
      { choice: "ア", content: "○ ： ファイナンス・リース取引の正しい定義記述です。[cite: 265] 中途解約不能（ノンキャンセラブル）、かつ経済的利益の実質享受・コスト実質負担（フルペイアウト）となる取引をいいます。よって、記述は適切です。[cite: 265]" },
      { choice: "イ", content: "× ： ファイナンス・リース取引では、リース契約の中途解約が契約上または事実上において不可能です。[cite: 267] また、当該リース物件の使用に伴って生じるコストを実質的に負担することとなります。[cite: 267]" },
      { choice: "ウ", content: "× ： ファイナンス・リース取引については、通常の売買取引に係る方法に準じて会計処理を行います。[cite: 269] 通常の賃貸借取引に係る方法ではありません。[cite: 269]" },
      { choice: "エ", content: "× ： 通常の売買取引に係る方法に準じて会計処理を行います。[cite: 271] 通常の資本取引に係る方法ではありません。[cite: 271]" }
    ]
  },
  {
    id: 16,
    title: "問題 16 効率的市場仮説",
    year: "スマート問題集 2-8",
    question: "効率的市場仮説について述べた次の文章中の空欄Ａ～Dに入る語句の組み合わせとして、最も適切なものはどれか。[cite: 273]\n\n（　Ａ　）では、チャート分析などテクニカル分析の有効性が否定されている。（　Ｂ　）では、株価が上昇するか下落するかは五分五分の可能性なので、株価の将来の値動きを予測することは不可能とされる。インサイダー情報を利用しても将来の株価を予測することはできないとする説は（　Ｃ　）である。一方、（　Ｄ　）ではファンダメンタル分析の有効性が否定されている。[cite: 274]",
    options: [
      { key: "ア", text: "Ａ：ストロング・フォームの効率的市場仮説　　Ｂ：ウィーク・フォームの効率的市場仮説　　Ｃ：ランダムウォーク理論　　Ｄ：セミストロング・フォームの効率的市場仮説" },
      { key: "イ", text: "Ａ：ウィーク・フォームの効率的市場仮説　　Ｂ：ランダムウォーク理論　　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：セミストロング・フォームの効率的市場仮説" },
      { key: "ウ", text: "Ａ：ランダムウォーク理論　　Ｂ：セミストロング・フォームの効率的市場仮説　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：ウィーク・フォームの効率的市場仮説" },
      { key: "エ", text: "Ａ：ランダムウォーク理論　　Ｂ：ウィーク・フォームの効率的市場仮説　　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：セミストロング・フォームの効率的市場仮説" }
    ],
    answer: "イ",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：「効率的市場仮説」は、株価に反映される情報のレベルにより以下の３種類に分類されます。[cite: 281]\n・ウィーク・フォームの効率的市場仮説：現在の株価には過去の株価データの全てが迅速かつ正確に反映されているため、チャート分析などテクニカル分析の有効性が否定されています。[cite: 281]\n・セミストロング・フォームの効率的市場仮説：企業が公開している情報の全てが迅速かつ正確に反映されているため、財務諸表などの情報を分析するファンダメンタル分析の有効性が否定されています。[cite: 281]\n・ストロング・フォームの効率的市場仮説：一部の投資家だけ利用できる未公開情報（インサイダー情報）も迅速かつ正確に反映されているため、将来の株価を予測することはできないとするものです。[cite: 281]\n・ランダムウォーク理論：株価が上昇するか下落するかは五分五分の可能性なので、株価の将来の値動きを予測することは不可能であるとするものです。[cite: 281]",
      details: [
        { label: "空欄のあてはめ解説", content: "過去の価格データ情報が反映されチャート分析が無効な（ Ａ ）にはウィーク・フォームが入ります。[cite: 281, 284] 五分五分で予測不能な（ Ｂ ）にはランダムウォーク理論が入ります。[cite: 281, 284] インサイダー情報すら織り込み済みの（ Ｃ ）にはストロング・フォームが入ります。[cite: 281, 284] 公開財務情報が織り込まれファンダメンタル分析が無効な（ Ｄ ）にはセミストロング・フォームが入ります。よって、選択肢イが正解となります。[cite: 281, 285]" }
      ]
    }
  }
];

// ==========================================
// CUSTOM SVG ILLUSTRATIONS (ABSOLUTE REPRODUCTION)
// ==========================================
const SvgIllustrations = {
  // Problem 4: Indifference Curves for 3 types of preferences
  IndifferenceCurves: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 bg-white text-xs font-semibold text-slate-600 shadow-sm">
      {/* Risk Averse */}
      <div className="text-center space-y-2">
        <div className="text-slate-800 font-bold">A : リスク回避者</div>
        <svg viewBox="0 0 160 140" className="w-full max-w-[160px] mx-auto overflow-visible">
          <line x1="20" y1="120" x2="150" y2="120" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="20" y1="120" x2="20" y2="15" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="10" y="10" textAnchor="middle" fontSize="9">リターン</text>
          <text x="145" y="132" textAnchor="middle" fontSize="9">リスク</text>
          {/* Curves */}
          <path d="M25,85 Q75,80 115,20" fill="none" stroke="#EF4444" strokeWidth="2" />
          <path d="M45,100 Q95,95 135,35" fill="none" stroke="#EF4444" strokeWidth="2" />
          <path d="M65,112 Q115,107 150,50" fill="none" stroke="#EF4444" strokeWidth="2" />
          <text x="115" y="15" textAnchor="middle" fontSize="9" fill="#1E293B">U3</text>
          <text x="135" y="30" textAnchor="middle" fontSize="9" fill="#1E293B">U2</text>
          <text x="152" y="45" textAnchor="middle" fontSize="9" fill="#1E293B">U1</text>
          <text x="15" y="130" fontSize="9">0</text>
        </svg>
      </div>
      {/* Risk Neutral */}
      <div className="text-center space-y-2">
        <div className="text-slate-800 font-bold">B : リスク中立者</div>
        <svg viewBox="0 0 160 140" className="w-full max-w-[160px] mx-auto overflow-visible">
          <line x1="20" y1="120" x2="150" y2="120" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="20" y1="120" x2="20" y2="15" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="10" y="10" textAnchor="middle" fontSize="9">リターン</text>
          <text x="145" y="132" textAnchor="middle" fontSize="9">リスク</text>
          {/* Lines */}
          <line x1="20" y1="40" x2="140" y2="40" stroke="#EF4444" strokeWidth="2" />
          <line x1="20" y1="65" x2="140" y2="65" stroke="#EF4444" strokeWidth="2" />
          <line x1="20" y1="90" x2="140" y2="90" stroke="#EF4444" strokeWidth="2" />
          <text x="148" y="43" fontSize="9" fill="#1E293B">U3</text>
          <text x="148" y="68" fontSize="9" fill="#1E293B">U2</text>
          <text x="148" y="93" fontSize="9" fill="#1E293B">U1</text>
          <text x="15" y="130" fontSize="9">0</text>
        </svg>
      </div>
      {/* Risk Lover */}
      <div className="text-center space-y-2">
        <div className="text-slate-800 font-bold">C : リスク愛好者</div>
        <svg viewBox="0 0 160 140" className="w-full max-w-[160px] mx-auto overflow-visible">
          <line x1="20" y1="120" x2="150" y2="120" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="20" y1="120" x2="20" y2="15" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="10" y="10" textAnchor="middle" fontSize="9">リターン</text>
          <text x="145" y="132" textAnchor="middle" fontSize="9">リスク</text>
          {/* Convex Curves */}
          <path d="M25,45 Q75,50 115,115" fill="none" stroke="#EF4444" strokeWidth="2" />
          <path d="M25,25 Q95,30 135,115" fill="none" stroke="#EF4444" strokeWidth="2" />
          <path d="M35,15 Q115,18 150,115" fill="none" stroke="#EF4444" strokeWidth="2" />
          <text x="115" y="127" textAnchor="middle" fontSize="9" fill="#1E293B">U1</text>
          <text x="135" y="127" textAnchor="middle" fontSize="9" fill="#1E293B">U2</text>
          <text x="152" y="127" textAnchor="middle" fontSize="9" fill="#1E293B">U3</text>
          <text x="15" y="130" fontSize="9">0</text>
        </svg>
      </div>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155" />
        </marker>
      </defs>
    </div>
  ),

  // Problem 6: Two stock return/risk curve portfolio effect
  ReturnRiskCurve: () => (
    <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-600 shadow-sm max-w-md mx-auto">
      <div className="text-center font-bold text-slate-800 mb-2">◆ポートフォリオのリターンとリスク</div>
      <svg viewBox="0 0 320 220" className="w-full overflow-visible">
        {/* Axes */}
        <line x1="40" y1="180" x2="300" y2="180" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <line x1="40" y1="180" x2="40" y2="30" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <text x="35" y="20" textAnchor="middle" fontWeight="bold">期待収益率</text>
        <text x="290" y="196" textAnchor="middle" fontWeight="bold">標準偏差</text>
        {/* Break marks */}
        <line x1="35" y1="165" x2="45" y2="160" stroke="#000" strokeWidth="1.5" />
        <line x1="35" y1="160" x2="45" y2="155" stroke="#000" strokeWidth="1.5" />
        {/* Horizontal Guide lines */}
        <line x1="40" y1="50" x2="230" y2="50" stroke="#000" strokeDasharray="2,2" />
        <line x1="40" y1="100" x2="80" y2="100" stroke="#000" strokeDasharray="2,2" />
        <line x1="40" y1="130" x2="160" y2="130" stroke="#000" strokeDasharray="2,2" />
        {/* Vertical Guide lines */}
        <line x1="80" y1="100" x2="80" y2="180" stroke="#000" strokeDasharray="2,2" />
        <line x1="160" y1="130" x2="160" y2="180" stroke="#000" strokeDasharray="2,2" />
        <line x1="230" y1="50" x2="230" y2="180" stroke="#000" strokeDasharray="2,2" />
        {/* Labels on axis */}
        <text x="30" y="54" textAnchor="end">10</text>
        <text x="30" y="104" textAnchor="end">8.74</text>
        <text x="30" y="134" textAnchor="end">8</text>
        <text x="80" y="194" textAnchor="middle">1.02</text>
        <text x="160" y="194" textAnchor="middle">4.65</text>
        <text x="230" y="194" textAnchor="middle">8.12</text>
        {/* Straight line reference */}
        <line x1="160" y1="130" x2="230" y2="50" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="3,3" />
        {/* Actual hyperbola portfolio curve */}
        <path d="M160,130 C110,120 60,110 80,100 C110,90 170,70 230,50" fill="none" stroke="#991B1B" strokeWidth="2.5" />
        {/* Node Plots */}
        <circle cx="230" cy="50" r="4" fill="#1D4ED8" />
        <text x="240" y="52" fill="#1E3A8A" fontWeight="bold">X :100%</text>
        <circle cx="160" cy="130" r="4" fill="#1D4ED8" />
        <text x="168" y="134" fill="#1E3A8A" fontWeight="bold">Y:100 %</text>
        <circle cx="80" cy="100" r="4" fill="#1D4ED8" />
        <text x="90" y="96" fill="#1E3A8A" fontWeight="bold">X:37%, Y:63%</text>
      </svg>
    </div>
  ),

  // Problem 7: Correlation coefficient variants graph (-1, 0, 1)
  CorrelationRiskGraph: () => (
    <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-600 shadow-sm max-w-md mx-auto">
      <div className="text-center font-bold text-slate-800 mb-2">◆相関係数とリスク</div>
      <svg viewBox="0 0 320 220" className="w-full overflow-visible">
        <line x1="40" y1="180" x2="300" y2="180" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <line x1="40" y1="180" x2="40" y2="30" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <text x="35" y="20" textAnchor="middle" fontWeight="bold">期待収益率</text>
        <text x="290" y="196" textAnchor="middle" fontWeight="bold">標準偏差</text>
        {/* Guide dotted */}
        <line x1="230" y1="50" x2="230" y2="180" stroke="#000" strokeDasharray="2,2" />
        <line x1="160" y1="130" x2="160" y2="180" stroke="#000" strokeDasharray="2,2" />
        <text x="230" y="194" textAnchor="middle">標準偏差</text>
        {/* Node Plots */}
        <circle cx="230" cy="50" r="4" fill="#1D4ED8" />
        <text x="240" y="52" fill="#1E3A8A" fontWeight="bold">X :100%</text>
        <circle cx="160" cy="130" r="4" fill="#1D4ED8" />
        <text x="166" y="134" fill="#1E3A8A" fontWeight="bold">Y:100 %</text>
        {/* Core Correlation Lines */}
        {/* rho = 1 */}
        <line x1="160" y1="130" x2="230" y2="50" stroke="#16A34A" strokeWidth="2" strokeDasharray="3,3" />
        <text x="220" y="100" fill="#16A34A" transform="rotate(-40 210,100)" fontWeight="bold">相関係数 ＝ 1</text>
        {/* rho = 0 */}
        <path d="M160,130 Q120,105 230,50" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        <text x="145" y="90" fill="#1E3A8A" transform="rotate(-55 145,90)" fontWeight="bold">相関係数 ＝ 0</text>
        {/* rho = -1 */}
        <polyline points="160,130 40,100 230,50" fill="none" stroke="#991B1B" strokeWidth="2.5" />
        <text x="100" y="65" fill="#991B1B" transform="rotate(-15 100,65)" fontWeight="bold">相関係数 ＝ －1</text>
      </svg>
    </div>
  ),

  // Problem 8: Systematic vs Unsystematic Risk (2 sub graphs)
  SystematicRiskGraphs: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 bg-white text-xs font-semibold text-slate-600 shadow-sm">
      <div className="text-center space-y-1">
        <div className="text-slate-800 font-bold">ポートフォリオの分散効果</div>
        <svg viewBox="0 0 180 140" className="w-full max-w-[180px] mx-auto overflow-visible">
          <line x1="25" y1="120" x2="170" y2="120" stroke="#000" strokeWidth="1.5" markerEnd="url(#black-arrow)" />
          <line x1="25" y1="120" x2="25" y2="15" stroke="#000" strokeWidth="1.5" markerEnd="url(#black-arrow)" />
          <text x="15" y="12" fontSize="8">リスク</text>
          <text x="155" y="132" fontSize="8">組込銘柄数</text>
          {/* Asymptote horizontal guide */}
          <line x1="25" y1="85" x2="165" y2="85" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
          {/* Exponential decay curve */}
          <path d="M35,20 C45,65 75,83 165,85" fill="none" stroke="#1E3A8A" strokeWidth="2" />
          <text x="50" y="45" fontSize="8" fontWeight="bold">総リスク</text>
          {/* Label elements double arrows inside logic visually represented */}
          <line x1="55" y1="52" x2="55" y2="82" stroke="#000" strokeWidth="1" markerStart="url(#mini-arr)" markerEnd="url(#mini-arr)" />
          <text x="60" y="70" fontSize="8" fill="#1E293B">A</text>
          <line x1="55" y1="88" x2="55" y2="118" stroke="#000" strokeWidth="1" markerStart="url(#mini-arr)" markerEnd="url(#mini-arr)" />
          <text x="60" y="105" fontSize="8" fill="#1E293B">B</text>
          <text x="20" y="125" fontSize="8">0</text>
        </svg>
      </div>
      <div className="text-center space-y-1">
        <div className="text-slate-800 font-bold">証券市場線（SML）</div>
        <svg viewBox="0 0 180 140" className="w-full max-w-[180px] mx-auto overflow-visible">
          <line x1="25" y1="120" x2="170" y2="120" stroke="#000" strokeWidth="1.5" markerEnd="url(#black-arrow)" />
          <line x1="25" y1="120" x2="25" y2="15" stroke="#000" strokeWidth="1.5" markerEnd="url(#black-arrow)" />
          <text x="15" y="12" fontSize="8">リターン</text>
          <text x="145" y="132" fontSize="8">β：市場全体との感応度</text>
          {/* Linear SML Line */}
          <line x1="25" y1="90" x2="160" y2="35" stroke="#000" strokeWidth="1.8" />
          <text x="164" y="38" fontSize="9" fontWeight="bold" fill="#000">C</text>
          {/* Core notations */}
          <text x="15" y="93" fontSize="8" fontWeight="bold">Rf</text>
          <line x1="25" y1="60" x2="100" y2="60" stroke="#94A3B8" strokeDasharray="1,1" />
          <line x1="100" y1="60" x2="100" y2="120" stroke="#94A3B8" strokeDasharray="1,1" />
          <text x="15" y="63" fontSize="8">Rm</text>
          <text x="100" y="130" textAnchor="middle" fontSize="8">1.0</text>
          
          <line x1="60" y1="73" x2="60" y2="120" stroke="#94A3B8" strokeDasharray="1,1" />
          <text x="60" y="130" textAnchor="middle" fontSize="8">0.5</text>
          <line x1="120" y1="51" x2="120" y2="120" stroke="#94A3B8" strokeDasharray="1,1" />
          <text x="120" y="130" textAnchor="middle" fontSize="8">1.2</text>
          <text x="20" y="125" fontSize="8">0</text>
        </svg>
      </div>
    </div>
  ),

  // Problem 9: Efficient Frontier graph map plot distribution
  EfficientFrontierGraph: () => (
    <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-600 shadow-sm max-w-md mx-auto">
      <div className="text-center font-bold text-slate-800 mb-2">◆効率的フロンティア</div>
      <svg viewBox="0 0 320 220" className="w-full overflow-visible">
        <line x1="40" y1="180" x2="300" y2="180" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <line x1="40" y1="180" x2="40" y2="30" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <text x="35" y="20" textAnchor="middle" fontWeight="bold">期待収益率</text>
        <text x="290" y="196" textAnchor="middle" fontWeight="bold">標準偏差</text>
        {/* Scatter dots inside asset area visually compiled */}
        <circle cx="120" cy="110" r="3" fill="#1E3A8A" /><circle cx="140" cy="95" r="3" fill="#1E3A8A" />
        <circle cx="160" cy="115" r="3" fill="#1E3A8A" /><circle cx="150" cy="140" r="3" fill="#1E3A8A" />
        <circle cx="180" cy="100" r="3" fill="#1E3A8A" /><circle cx="190" cy="125" r="3" fill="#1E3A8A" />
        <circle cx="210" cy="85" r="3" fill="#1E3A8A" /><circle cx="220" cy="110" r="3" fill="#1E3A8A" />
        <circle cx="175" cy="75" r="3" fill="#1E3A8A" /><circle cx="240" cy="70" r="3" fill="#1E3A8A" />
        <circle cx="130" cy="135" r="3" fill="#1E3A8A" /><circle cx="200" cy="150" r="3" fill="#1E3A8A" />
        {/* Target specific focus item A and B nodes */}
        <circle cx="165" cy="65" r="4.5" fill="#B91C1C" />
        <text x="165" y="55" fill="#B91C1C" fontWeight="bold" textAnchor="middle">A</text>
        <circle cx="165" cy="100" r="4.5" fill="#B91C1C" />
        <text x="175" y="104" fill="#B91C1C" fontWeight="bold">B</text>
        {/* Frontier boundary lines */}
        {/* Top critical asset boundary (Efficient Frontier) */}
        <path d="M85,125 C82,85 120,55 245,45" fill="none" stroke="#7F1D1D" strokeWidth="3" />
        <text x="140" y="38" fill="#7F1D1D" fontWeight="bold" transform="rotate(8 140,38)">効率的フロンティア</text>
        {/* Lower inefficient boundary side line */}
        <path d="M85,125 C95,165 140,185 200,185" fill="none" stroke="#000" strokeWidth="1.5" />
        <line x1="40" y1="125" x2="85" y2="125" stroke="#000" strokeDasharray="2,2" />
        <line x1="85" y1="125" x2="85" y2="180" stroke="#000" strokeDasharray="2,2" />
      </svg>
    </div>
  ),

  // Problem 10: Riskfree asset integration portfolio line
  RiskfreePortfolioGraph: () => (
    <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-600 shadow-sm max-w-md mx-auto">
      <div className="text-center font-bold text-slate-800 mb-2">◆リスクフリー資産を組み込んだポートフォリオ</div>
      <svg viewBox="0 0 320 220" className="w-full overflow-visible">
        <line x1="40" y1="180" x2="300" y2="180" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <line x1="40" y1="180" x2="40" y2="30" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <text x="35" y="20" textAnchor="middle" fontWeight="bold">期待収益率</text>
        <text x="290" y="196" textAnchor="middle" fontWeight="bold">標準偏差</text>
        {/* Guides */}
        <line x1="40" y1="50" x2="230" y2="50" stroke="#000" strokeDasharray="2,2" />
        <line x1="40" y1="110" x2="135" y2="110" stroke="#000" strokeDasharray="2,2" />
        <line x1="135" y1="110" x2="135" y2="180" stroke="#000" strokeDasharray="2,2" />
        <line x1="230" y1="50" x2="230" y2="180" stroke="#000" strokeDasharray="2,2" />
        {/* Coordinates indices values */}
        <text x="30" y="54" textAnchor="end">10</text>
        <text x="30" y="114" textAnchor="end">6</text>
        <text x="30" y="164" textAnchor="end">2</text>
        <text x="135" y="194" textAnchor="middle">4.06</text>
        <text x="230" y="194" textAnchor="middle">8.12</text>
        {/* Safe Capital Asset Line */}
        <line x1="40" y1="160" x2="230" y2="50" stroke="#16A34A" strokeWidth="2.5" />
        {/* Points markings nodes */}
        <circle cx="40" cy="160" r="4.5" fill="#1D4ED8" />
        <text x="50" y="164" fill="#1E3A8A" fontWeight="bold">X:0%, 国債:100%</text>
        <circle cx="135" cy="110" r="4.5" fill="#1D4ED8" />
        <text x="145" y="114" fill="#1E3A8A" fontWeight="bold">X:50%,国債:50 %</text>
        <circle cx="230" cy="50" r="4.5" fill="#1D4ED8" />
        <text x="240" y="52" fill="#1E3A8A" fontWeight="bold">X :100%,国債0%</text>
      </svg>
    </div>
  ),

  // Problem 11: Capital Market Line (CML) and Efficient Frontier tangent relationship node M
  MarketPortfolioGraph: () => (
    <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-600 shadow-sm max-w-md mx-auto">
      <div className="text-center font-bold text-slate-800 mb-2">◆リスクフリー資産と効率的フロンティア</div>
      <svg viewBox="0 0 320 220" className="w-full overflow-visible">
        <line x1="40" y1="180" x2="300" y2="180" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <line x1="40" y1="180" x2="40" y2="30" stroke="#000" strokeWidth="2" markerEnd="url(#black-arrow)" />
        <text x="35" y="20" textAnchor="middle" fontWeight="bold">期待収益率</text>
        <text x="290" y="196" textAnchor="middle" fontWeight="bold">標準偏差</text>
        {/* Frontier shape hyperbola */}
        <path d="M120,155 C110,110 140,80 260,70" fill="none" stroke="#7F1D1D" strokeWidth="3" />
        <path d="M120,155 C125,185 160,200 210,200" fill="none" stroke="#000" strokeWidth="1.5" />
        <text x="190" y="85" fill="#7F1D1D" fontWeight="bold" fontSize="9">効率的フロンティア</text>
        {/* Tangent Line CML line */}
        <line x1="40" y1="145" x2="260" y2="43" stroke="#16A34A" strokeWidth="2" />
        <text x="240" y="35" fill="#16A34A" fontWeight="bold">資本市場線</text>
        {/* Node Points values M tangent intersection point */}
        <circle cx="168" cy="85" r="5" fill="#B91C1C" />
        <text x="168" y="73" fill="#B91C1C" fontWeight="bold" textAnchor="middle">M</text>
        <text x="168" y="62" fill="#B91C1C" fontWeight="bold" textAnchor="middle">市場ポートフォリオ</text>
        {/* Point A and B positions matching identical standard deviation comparison setup vertically aligned */}
        <circle cx="115" cy="110" r="4" fill="#1E3A8A" />
        <text x="105" y="110" fill="#1E3A8A" fontWeight="bold">A</text>
        <circle cx="115" cy="128" r="4" fill="#1E3A8A" />
        <text x="124" y="132" fill="#1E3A8A" fontWeight="bold">B</text>
      </svg>
    </div>
  ),

  // Problem 14: Unabridged Structural Tree Chart Map Layout
  CapitalFinancingMap: () => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium space-y-4 shadow-sm text-slate-800">
      <div className="text-center font-bold text-slate-700 mb-1">【資金調達方法の体系図分類】</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        {/* Level 1 Base Node */}
        <div className="bg-white p-3 border-2 border-slate-300 rounded-lg font-bold text-center shadow-sm md:col-span-1">
          資金調達
        </div>
        
        {/* Right branch groupings wrapper display */}
        <div className="md:col-span-3 space-y-4 border-l-2 border-slate-300 pl-4">
          {/* Group 1: External Financing */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
            <div className="font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded inline-block">外部金融</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-2">
              <div className="bg-white p-2 border rounded">
                <span className="font-semibold text-slate-500 block">企業間信用（短期・他人資本）</span>
                支払手形 / 買掛金
              </div>
              <div className="bg-white p-2 border rounded">
                <span className="font-semibold text-orange-700 block">間接金融（他人資本）</span>
                短期借入 / 長期借入
              </div>
              <div className="bg-white p-2 border rounded">
                <span className="font-semibold text-orange-700 block">直接金融（他人/自己）</span>
                社債（他人資本） / 株式（自己資本）
              </div>
            </div>
          </div>

          {/* Group 2: Internal Financing */}
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <div className="font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded inline-block">内部金融</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
              <div className="bg-white p-2 border rounded">
                <span className="font-semibold text-indigo-700 block">自己金融（自己資本）</span>
                内部留保 （留保利益）
              </div>
              <div className="bg-white p-2 border rounded">
                <span className="font-semibold text-indigo-700 block">自己金融（自己資本）</span>
                減価償却 （自己金融効果）
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// ==========================================
// MAIN REUSABLE COMPONENT ROOT
// ==========================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('start'); 
  
  const [selectedMode, setSelectedMode] = useState('all'); 
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [resumePrompt, setResumePrompt] = useState(null);
  const [userData, setUserData] = useState({
    history: {},      
    reviews: {},      
    progressIndex: 0,
    progressMode: 'all'
  });

  useEffect(() => {
    async function initAuth() {
      try {
        console.log("Executing anonymous sign-in...");
        await signInAnonymously(auth);
        console.log("Anonymous sign-in success.");
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);
    console.log(`Connecting credentials block index: [${passcode}]`);
    
    try {
      const docRef = doc(db, APP_ID, passcode.trim());
      const docSnap = await getDoc(docRef);

      let fetchedData = {
        history: {},
        reviews: {},
        progressIndex: 0,
        progressMode: 'all'
      };

      if (docSnap.exists()) {
        const data = docSnap.data();
        fetchedData = {
          history: data.history || {},
          reviews: data.reviews || {},
          progressIndex: typeof data.progressIndex === 'number' ? data.progressIndex : 0,
          progressMode: data.progressMode || 'all'
        };
        console.log("Restored snapshot matrix successfully.", fetchedData);
      } else {
        await setDoc(docRef, fetchedData);
        console.log("Created empty baseline block registry on cloud storage node.");
      }

      setUserData(fetchedData);
      setIsAuthenticated(true);

      if (fetchedData.progressIndex > 0) {
        setResumePrompt({
          index: fetchedData.progressIndex,
          mode: fetchedData.progressMode
        });
      }

    } catch (err) {
      console.error("Baseline connection verification failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveCloudState = async (updatedData) => {
    if (!passcode.trim()) return;
    try {
      const docRef = doc(db, APP_ID, passcode.trim());
      await updateDoc(docRef, {
        history: updatedData.history,
        reviews: updatedData.reviews,
        progressIndex: updatedData.progressIndex,
        progressMode: updatedData.progressMode
      });
      console.log("Committed state transaction securely to server node.", updatedData);
    } catch (err) {
      console.error("State synchronization update failed:", err);
    }
  };

  const startQuiz = (mode, forceStartIndex = null) => {
    console.log(`Preparing track runtime buffer allocation: ${mode}`);
    
    let list = [];
    if (mode === 'all') {
      list = [...quizQuestions];
    } else if (mode === 'wrong') {
      list = quizQuestions.filter(q => userData.history[q.id]?.correct === false);
    } else if (mode === 'review') {
      list = quizQuestions.filter(q => userData.reviews[q.id] === true);
    }

    if (list.length === 0) {
      alert("選択された抽出条件を満たす問題が存在しません。");
      return;
    }

    setFilteredQuestions(list);
    setSelectedMode(mode);
    
    let targetIdx = 0;
    if (forceStartIndex !== null && forceStartIndex < list.length) {
      targetIdx = forceStartIndex;
    }

    setCurrentIdx(targetIdx);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setResumePrompt(null);
    setCurrentScreen('quiz');

    const nextState = {
      ...userData,
      progressIndex: targetIdx,
      progressMode: mode
    };
    setUserData(nextState);
    saveCloudState(nextState);
  };

  const handleAnswerSubmit = (optionKey) => {
    if (isAnswered) return;
    
    const activeQuestion = filteredQuestions[currentIdx];
    const isCorrect = optionKey === activeQuestion.answer;
    
    setSelectedAnswer(optionKey);
    setIsAnswered(true);

    console.log(`Answer committed: ${optionKey} | Verdict: ${isCorrect}`);

    const updatedHistory = {
      ...userData.history,
      [activeQuestion.id]: {
        correct: isCorrect,
        timestamp: new Date().toLocaleString()
      }
    };

    const nextState = {
      ...userData,
      history: updatedHistory,
      progressIndex: currentIdx 
    };

    setUserData(nextState);
    saveCloudState(nextState);
  };

  const handleReviewToggle = (questionId, currentValue) => {
    const updatedReviews = {
      ...userData.reviews,
      [questionId]: !currentValue
    };

    const nextState = {
      ...userData,
      reviews: updatedReviews
    };

    setUserData(nextState);
    saveCloudState(nextState);
  };

  const handleNextQuestion = () => {
    const nextIdx = currentIdx + 1;
    
    if (nextIdx < filteredQuestions.length) {
      setCurrentIdx(nextIdx);
      setSelectedAnswer(null);
      setIsAnswered(false);

      const nextState = {
        ...userData,
        progressIndex: nextIdx
      };
      setUserData(nextState);
      saveCloudState(nextState);
    } else {
      console.log("Entire active stream array completed.");
      alert("選択されたモードのすべての問題を解き終えました！");
      
      const nextState = {
        ...userData,
        progressIndex: 0 
      };
      setUserData(nextState);
      saveCloudState(nextState);
      setCurrentScreen('start');
    }
  };

  const handleAbortToHome = () => {
    console.log("Navigating cleanly back to selection index view framework.");
    setCurrentScreen('start');
  };

  const handleResetProgress = () => {
    if (window.confirm("進行インデックス記憶をクリアして最初から再構築を開始しますか？")) {
      const nextState = {
        ...userData,
        progressIndex: 0
      };
      setUserData(nextState);
      saveCloudState(nextState);
      setResumePrompt(null);
    }
  };

  const totalQuestionsCount = quizQuestions.length;
  const answeredKeysCount = Object.keys(userData.history).length;
  const correctAnswersCount = Object.values(userData.history).filter(item => item.correct).length;
  const reviewCount = Object.values(userData.reviews).filter(v => v).length;
  
  const wrongQuestionsCount = quizQuestions.filter(q => userData.history[q.id]?.correct === false).length;
  const reviewQuestionsCount = quizQuestions.filter(q => userData.reviews[q.id] === true).length;

  const summaryChartData = [
    { name: '正解', 数量: correctAnswersCount, fill: '#10B981' },
    { name: '不正解', 数量: answeredKeysCount - correctAnswersCount, fill: '#EF4444' },
    { name: '未着手', 数量: totalQuestionsCount - answeredKeysCount, fill: '#9CA3AF' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-slate-600 font-medium">暗号化トンネル同期中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">スマート問題集：2-8 資本市場と資本コスト</span>
          </div>
          {isAuthenticated && (
            <div className="flex items-center space-x-3 text-sm">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium flex items-center space-x-1">
                <User className="w-3.5 h-3.5 mr-1" />
                <span>合言葉: {passcode}</span>
              </span>
              {currentScreen !== 'start' && (
                <button onClick={handleAbortToHome} className="flex items-center text-slate-500 hover:text-slate-800 font-medium transition">
                  <Home className="w-4 h-4 mr-1" /> ホーム
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
                <RefreshCw className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">マルチデバイス同期接続</h2>
              <p className="text-slate-500 text-sm mt-2">
                任意の「合言葉」を入力してください。スマホとPC間で同一の学習進捗データが完全にリアルタイム同期されます。
              </p>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  同期用の共通合言葉キー
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: osaka-study-2026"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm font-mono"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2">
                <span>セッションを開始する</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <>
            {currentScreen === 'start' && (
              <div className="space-y-6">
                {resumePrompt && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-amber-100 text-amber-800 rounded-lg mt-0.5">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900">中断セッションチェック</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          前回は【問題 {resumePrompt.index + 1}】の途中で終了しています。続きから再開しますか？
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3 shrink-0">
                      <button onClick={() => startQuiz(resumePrompt.mode, resumePrompt.index)} className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition">
                        続きから再開する
                      </button>
                      <button onClick={handleResetProgress} className="bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 text-sm font-semibold px-4 py-2 rounded-xl transition">
                        最初から始める
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">リアルタイム進捗インジケータ</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-600">総問題数:</span><span className="font-bold text-slate-900">{totalQuestionsCount} 問</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">解答完了:</span><span className="font-bold text-slate-900">{answeredKeysCount} 問</span></div>
                        <div className="flex justify-between text-sm"><span className="text-indigo-600">現在正解率:</span><span className="font-bold text-indigo-600">{answeredKeysCount > 0 ? Math.round((correctAnswersCount / answeredKeysCount) * 100) : 0} %</span></div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                      <div className="flex-1 bg-rose-50 text-center py-2 rounded-xl">
                        <div className="text-xs text-rose-600 font-medium">要復習</div>
                        <div className="text-lg font-bold text-rose-700">{reviewCount}</div>
                      </div>
                      <div className="flex-1 bg-emerald-50 text-center py-2 rounded-xl">
                        <div className="text-xs text-emerald-600 font-medium">正解</div>
                        <div className="text-lg font-bold text-emerald-700">{correctAnswersCount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm md:col-span-2 flex flex-col justify-between">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">総計解答分布比率</h3>
                    <div className="h-36 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summaryChartData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" style={{ fontSize: '12px', fontWeight: '500' }} />
                          <Tooltip />
                          <Bar dataKey="数量" radius={6} barSize={16} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-indigo-600" />
                    <span>出題抽出アルゴリズムの選択</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => startQuiz('all')} className="group text-left border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-5 hover:bg-indigo-50/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition"><BookOpen className="w-5 h-5" /></div>
                        <h4 className="font-bold text-slate-900 text-base">すべての問題</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">全16問のフルセットを完全網羅して順次学習します。</p>
                      </div>
                      <div className="mt-4 text-xs font-semibold text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">開始する <ChevronRight className="w-3.5 h-3.5 ml-0.5" /></div>
                    </button>

                    <button onClick={() => startQuiz('wrong')} className="group text-left border-2 border-slate-200 hover:border-rose-500 rounded-2xl p-5 hover:bg-rose-50/30 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition"><X className="w-5 h-5" /></div>
                        <h4 className="font-bold text-slate-900 text-base">前回不正解のみ</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">現在履歴に記録されている誤答問題（残り: {wrongQuestionsCount}問）を出題。</p>
                      </div>
                      <div className="mt-4 text-xs font-semibold text-rose-600 flex items-center group-hover:translate-x-1 transition-transform">開始する <ChevronRight className="w-3.5 h-3.5 ml-0.5" /></div>
                    </button>

                    <button onClick={() => startQuiz('review')} className="group text-left border-2 border-slate-200 hover:border-amber-500 rounded-2xl p-5 hover:bg-amber-50/30 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition"><HelpCircle className="w-5 h-5" /></div>
                        <h4 className="font-bold text-slate-900 text-base">要復習の問題のみ</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">解説画面で「要復習」フラグを付与した特定設問（合計: {reviewQuestionsCount}問）の集中レビュー。</p>
                      </div>
                      <div className="mt-4 text-xs font-semibold text-amber-600 flex items-center group-hover:translate-x-1 transition-transform">開始する <ChevronRight className="w-3.5 h-3.5 ml-0.5" /></div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900 text-base">クラウドデータ同期状況一覧マトリクス</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase">
                          <th className="px-6 py-3">設問タイトル情報</th>
                          <th className="px-6 py-3 text-center">前回復元結果</th>
                          <th className="px-6 py-3 text-center">要復習マーク</th>
                          <th className="px-6 py-3">タイムスタンプ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quizQuestions.map((q) => {
                          const historyItem = userData.history[q.id];
                          const isReviewed = userData.reviews[q.id];
                          return (
                            <tr key={q.id} className="hover:bg-slate-50/80 transition">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900">{q.title}</div>
                                <div className="text-xs text-slate-400">{q.year}</div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {historyItem ? (
                                  historyItem.correct ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><Check className="w-3 h-3 mr-1" /> 正解</span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><X className="w-3 h-3 mr-1" /> 不正解</span>
                                  )
                                ) : (
                                  <span className="text-xs text-slate-400">未解答</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input type="checkbox" checked={!!isReviewed} onChange={() => handleReviewToggle(q.id, !!isReviewed)} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500">{historyItem?.timestamp || '---'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {currentScreen === 'quiz' && filteredQuestions.length > 0 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-600">
                    セッション進捗: <span className="text-indigo-600 font-bold">{currentIdx + 1}</span> / {filteredQuestions.length} 問
                  </div>
                  <div className="w-1/2 bg-slate-200 rounded-full h-2.5 mx-4 overflow-hidden">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / filteredQuestions.length) * 100}%` }}></div>
                  </div>
                  <button onClick={handleAbortToHome} className="text-xs text-slate-500 hover:text-slate-800 font-medium transition">中断して戻る</button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-bold">{filteredQuestions[currentIdx].year}</span>
                    <h2 className="text-lg font-bold text-slate-900">{filteredQuestions[currentIdx].title}</h2>
                  </div>

                  <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-medium">{filteredQuestions[currentIdx].question}</p>

                  {/* DYNAMIC INLINE SVG CHART COMPILING ACCORDING TO CONDITIONAL GRAPH DATA PLATFORM */}
                  {filteredQuestions[currentIdx].hasCustomSvg === "indifference-curves" && <SvgIllustrations.IndifferenceCurves />}
                  {filteredQuestions[currentIdx].hasCustomSvg === "return-risk-curve" && <SvgIllustrations.ReturnRiskCurve />}
                  {filteredQuestions[currentIdx].hasCustomSvg === "correlation-risk-graph" && <SvgIllustrations.CorrelationRiskGraph />}
                  {filteredQuestions[currentIdx].hasCustomSvg === "systematic-risk-graphs" && <SvgIllustrations.SystematicRiskGraphs />}
                  {filteredQuestions[currentIdx].hasCustomSvg === "efficient-frontier-graph" && <SvgIllustrations.EfficientFrontierGraph />}
                  {filteredQuestions[currentIdx].hasCustomSvg === "riskfree-portfolio-graph" && <SvgIllustrations.RiskfreePortfolioGraph />}
                  {filteredQuestions[currentIdx].hasCustomSvg === "market-portfolio-graph" && <SvgIllustrations.MarketPortfolioGraph />}
                  {filteredQuestions[currentIdx].hasCustomMap && <SvgIllustrations.CapitalFinancingMap />}

                  {filteredQuestions[currentIdx].hasFormulas && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 font-mono text-sm text-slate-700">
                      <div className="text-xs font-bold text-indigo-600 tracking-wider">【計算用与条件数式データ】</div>
                      <div className="grid grid-cols-1 gap-1 border-b border-slate-200 pb-3">
                        {filteredQuestions[currentIdx].formulas.slice(0, 4).map((f, i) => (
                          <div key={i} className="py-1 whitespace-pre-wrap leading-relaxed">{f}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-bold">
                        {filteredQuestions[currentIdx].formulas.slice(4).map((f, i) => (
                          <div key={i} className="bg-white px-3 py-2 border border-slate-200 rounded text-center shadow-sm">{f}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredQuestions[currentIdx].hasTable && filteredQuestions[currentIdx].tableData && (
                    <div className="max-w-xs border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-amber-100 text-amber-950 font-bold border-b border-slate-200">
                            {filteredQuestions[currentIdx].tableData.headers.map((h, i) => (
                              <th key={i} className="px-4 py-2">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                          {filteredQuestions[currentIdx].tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-2 font-mono font-semibold">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    {filteredQuestions[currentIdx].options.map((opt) => {
                      const isThisSelected = selectedAnswer === opt.key;
                      const isCorrectAnswer = opt.key === filteredQuestions[currentIdx].answer;
                      let btnStyle = "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50";
                      
                      if (isAnswered) {
                        if (isCorrectAnswer) btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
                        else if (isThisSelected) btnStyle = "border-rose-500 bg-rose-50 text-rose-900";
                        else btnStyle = "border-slate-100 bg-white opacity-60";
                      }

                      return (
                        <button key={opt.key} disabled={isAnswered} onClick={() => handleAnswerSubmit(opt.key)} className={`w-full text-left p-4 border-2 rounded-xl font-medium transition duration-150 flex items-start space-x-3 ${btnStyle}`}>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                            isAnswered && isCorrectAnswer ? 'bg-emerald-500 text-white' : 
                            isAnswered && isThisSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>{opt.key}</span>
                          <span className="text-sm sm:text-base leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswered && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                    <div className={`p-4 rounded-xl flex items-center space-x-3 ${selectedAnswer === filteredQuestions[currentIdx].answer ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                      {selectedAnswer === filteredQuestions[currentIdx].answer ? (
                        <><Check className="w-6 h-6 text-emerald-600" /><span className="font-bold text-lg">正解です！</span></>
                      ) : (
                        <><X className="w-6 h-6 text-rose-600" /><span className="font-bold text-lg">不正解。正解は 「{filteredQuestions[currentIdx].answer}」 です。</span></>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 py-2 border-b border-slate-100">
                      <input type="checkbox" id="rev-check" checked={!!userData.reviews[filteredQuestions[currentIdx].id]} onChange={() => handleReviewToggle(filteredQuestions[currentIdx].id, !!userData.reviews[filteredQuestions[currentIdx].id])} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                      <label htmlFor="rev-check" className="text-sm font-semibold text-slate-700 cursor-pointer">この問題を「要復習リスト」に留める・追加する</label>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">解説レジュメ</h4>
                      
                      <p className="text-slate-800 bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {filteredQuestions[currentIdx].explanation.summary || filteredQuestions[currentIdx].summary}
                      </p>

                      {filteredQuestions[currentIdx].explanationType === "text-1" && (
                        <div className="space-y-4 text-sm leading-relaxed pl-1">
                          {filteredQuestions[currentIdx].explanation.details.map((det, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="font-bold text-slate-900 flex items-center">
                                <span className="inline-block w-2 h-2 bg-indigo-500 mr-2 rounded-full"></span>
                                {det.label}
                              </div>
                              <p className="text-slate-600 pl-4">{det.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {filteredQuestions[currentIdx].explanationType === "math" && (
                        <div className="space-y-4 text-sm leading-relaxed">
                          {filteredQuestions[currentIdx].explanation.steps.map((step, idx) => (
                            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div className="font-bold text-slate-900 mb-1">{step.title}</div>
                              <div className="font-mono text-indigo-700 bg-indigo-50 p-2 rounded text-xs whitespace-pre-wrap overflow-x-auto">{step.formula}</div>
                              <div className="text-slate-600 mt-2 font-mono pl-1 whitespace-pre-wrap">{step.calc}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {filteredQuestions[currentIdx].explanationType === "text-choices" && (
                        <div className="space-y-3 text-sm leading-relaxed">
                          {filteredQuestions[currentIdx].explanation.map((item, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                              <div className="font-bold text-slate-900 mb-1">選択肢記述 {item.choice}</div>
                              <p className="text-slate-600 whitespace-pre-wrap">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button onClick={handleNextQuestion} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow transition flex items-center justify-center space-x-2">
                      <span>{currentIdx + 1 < filteredQuestions.length ? "次の問題へ進む" : "リザルトを同期してセッションを閉じる"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
      
      {/* GLOBAL REUSABLE DEFS FOR INDEPENDENT INLINE SVG ELEMENTS OVERFLOW */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <marker id="black-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#000" />
          </marker>
          <marker id="mini-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 2 L 5 5 L 0 8 z" fill="#000" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}