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
      summary: "ここが重要：本問では、資本市場と資金調達について問われています。\n・企業にとっての資金調達 → 投資家にとっての投資\n・企業の資金調達のコストである資本コスト → 投資家にとっては投資に対するリターン\n・資本市場において、投資家が企業に投資を行う方法には、社債の購入と株式の購入があります。\n⇒ 社債の方が、株式よりもリスクが少ない\n投資家はリスクが大きい投資に対しては、大きなリターンを望むという点について、しっかり把握しておきましょう。",
      details: [
        { label: "Ａ：投資", content: "企業にとっての資金調達は、投資家にとっての投資となります。" },
        { label: "Ｂ：リターン", content: "企業にとっての資金調達は、投資家にとっての投資になるので、企業の資金調達のコストである資本コストは、投資家にとっては投資に対するリターンとなります。" },
        { label: "Ｃ：社債、Ｄ：株式", content: "社債は、株式に比べて、リスクが小さいものとなります。社債は利回りが投資する時点で確定されています。実際に、社債に明記されています。これに対し、株式は株式市場で株価が決まるため、利回りは確定していません。よって、社債の方が、株式よりもリスクが少なくなります。社債や借入金などの負債は、基本的に会社が倒産しない限りは、確実に金利分を上乗せした額がリターンとして期待できます。これに対して、株式の配当は、負債の金利の支払いと税金の支払いが終わった後の税引後利益に基づいて行われます。そのため、企業の業績が悪くなれば配当も少なくなる可能性があります。また、株式の売却益についても、株価の変動は大きいためリスクが高いといえます。" }
      ]
    }
  },
  {
    id: 2,
    title: "問題 2 投資のリスクとリターン",
    year: "スマート問題集 2-8",
    question: "次の資料は、ある株式の投資収益率について予想される分布を示したものである。株式の投資のリスクの尺度として標準偏差が用いられるが、この資料に基づいた場合、この株式の標準偏差として、最も適切なものを下記の解答群から選べ。",
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
      summary: "ここが重要：本問では、投資のリスクとリターンについて問われています。\n●投資のリスク：投資により得られるリターンの不確実性のこと。投資がもたらすリターンのばらつきの度合いによって評価される。〈統計値〉・分散 ＝ Σ(偏差² × 確率) ※偏差 ＝ 値 － 期待値 ・標準偏差 ＝ √分散\n●投資のリターン：投資により得られる期待収益率のこと。投資がもたらす期待値によって評価される。〈統計値〉・期待値 ＝ Σ(値 × 確率)\n期待値、分散、標準偏差の計算ができるよう、しっかりと練習しておきましょう。",
      steps: [
        { title: "(1) 期待値", formula: "期待値 ＝ Σ(投資収益率 × 確率)", calc: "＝ 4％ × 0.2 ＋ 6％ × 0.5 ＋ 8％ × 0.3 ＝ 0.8％ ＋ 3.0％ ＋ 2.4％ ＝ 6.2％" },
        { title: "(2) 分散", formula: "分散 ＝ Σ(偏差² × 確率)", calc: "＝ (4％ － 6.2％)² × 0.2 ＋ (6％ － 6.2％)² × 0.5 ＋ (8％ － 6.2％)² × 0.3\n＝ (－2.2％)² × 0.2 ＋ (－0.2％)² × 0.5 ＋ (1.8％)² × 0.3\n＝ 4.84 × 0.2 ＋ 0.04 × 0.5 ＋ 3.24 × 0.3\n＝ 0.968 ＋ 0.02 ＋ 0.972\n＝ 1.96" },
        { title: "(3) 標準偏差", formula: "標準偏差 ＝ √分散", calc: "＝ √1.96 ＝ 1.4\nしたがって、この株式の標準偏差は1.4となります。よって、オが適切です。" }
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
    summary: "ここが重要：本問では、ポートフォリオ理論におけるリスクについて問われています。ポートフォリオ理論におけるリスクとは、不確実性のことです。リスクは、言い換えれば、リターンのばらつきであると表現することができます。つまり、あるときはリターンが上昇するが、あるときは下落する場合は、リスクが高いということです。一方、どんな状況でも、リターンがほとんど変動しない場合はリスクが低いといえます。\nリスクの種類には、次のものがあります。●システマティック・リスク（市場に連動するリスク）●信用リスク（利子や元本を返済できなくなるリスク）●流動性リスク（金融資産を市場で換金できないリスク）●金利リスク（金利変動によるリスク）●価格変動リスク（金融商品の価格変動によるリスク）●為替リスク（為替相場の変動によるリスク）●カントリー・リスク（その国の政治や経済などに連動するリスク）\nリスクの定義は、ポートフォリオ理論にとっては、きわめて重要です。ポートフォリオ理論におけるリスクとは、不確実性だということをしっかりと確認したうえで、リスクの種類について知識を補充しておきましょう。特に、市場全体との相関によるリスクであり、分散化によって消去することができないリスクのことを、システマティック・リスクということに注意してください。",
    explanation: [
      { choice: "ア", content: "× ： 取引相手の財務状況の悪化や倒産により貸付金の受取利息や元本の回収が滞ってしまうリスクは、信用リスクです。流動性リスクではありません。" },
      { choice: "イ", content: "× ： 外貨建て金融商品における国の国との為替変動により資産価値が変動するリスクは、為替リスクです。カントリー・リスクではありません。" },
      { choice: "ウ", content: "× ： 市場で取引量が少ないために資産を換金しようとしたときにすぐに売ることができない、あるいは希望する価格で売ることができなくなるリスクは、流動性リスクです。価格変動リスクではありません。" },
      { choice: "エ", content: "× ： その国の政治や経済などによって資産価値が変動するリスクは、カントリー・リスクです。信用リスクではありません。" },
      { choice: "オ", content: "○ ： 記述のように、システマティック・リスクとは、市場に連動するリスクのことであり、分散投資によって消去することができないリスクのことです。これは、市場リスク、あるいはマーケット・リスクとも呼ばれます。よって、記述は適切です。" }
    ]
  },
  {
    id: 4,
    title: "問題 4 リスクに対する投資家の選好",
    year: "スマート問題集 2-8",
    question: "次の記述は、投資家の選好を描いたものである。この投資家の選好を表す組み合わせとして、最も適切なものはどれか。ただし、満足度のレベルは、U1＜U2＜U3である。\n\nＡ：同一のリターンならば、リスクのより小さいものを選好する投資家の無差別曲線（右上がりの曲線）\nＢ：リスクと無関係に、より高いリターンを選好する投資家の無差別曲線（水平の直線）\nＣ：同一のリターンならば、リスクのより大きいものを選好する投資家の無差別曲線（右下がりの曲線）",
    options: [
      { key: "ア", text: "Ａ：リスク回避者　　　 Ｂ：リスク中立者　　　　Ｃ：リスク愛好者" },
      { key: "イ", text: "Ａ：リスク回避者　　　 Ｂ：リスク愛好者　　　　Ｃ：リスク中立者" },
      { key: "ウ", text: "Ａ：リスク愛好者　　　 Ｂ：リスク中立者　　　　Ｃ：リスク回避者" },
      { key: "エ", text: "Ａ：リスク愛好者　　　 Ｂ：リスク回避者　　　　Ｃ：リスク中立者" }
    ],
    answer: "ア",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：本問では、リスクに対する投資家の選好について問われています。リスクに対する投資家の評価は、投資家の選好によって異なります。リスクに対する投資家の選好は、次の3つに分類されます。一般に、ファイナンスでは、リスク回避者の行動を想定しています。●リスク回避者（同一のリターンならば、リスクのより小さいものを選好する投資家）●リスク中立者（リスクと無関係に、より高いリターンを選好する投資家）●リスク愛好者（同一のリターンならば、リスクのより大きいものを選好する投資家）\n無差別曲線は同じ満足度となる組み合わせを表したものです。",
      details: [
        { label: "Ａ：リスク回避者", content: "無差別曲線は、同一のリターンならば、リスクのより小さいものを選好する投資家を表しているので、この投資家は、リスク回避者です。" },
        { label: "Ｂ：リスク中立者", content: "無差別曲線は、リスクと無関係に、より高いリターンを選好する投資家を表しているので、この投資家は、リスク中立者です。" },
        { label: "Ｃ：リスク愛好者", content: "無差別曲線は、同一のリターンならば、リスクのより大きいものを選好する投資家を表しているので、この投資家は、リスク愛好者です。以上から、選択肢アが適切であり、これが正解です。" }
      ]
    }
  },
  {
    id: 5,
    title: "問題 5 ポートフォリオのリスク低減効果",
    year: "スマート問題集 2-8",
    question: "ポートフォリオのリスク低減効果に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n（　Ａ　）とは、複数の資産を組み合わせてつくられた資産全体のことをいう。マコービッツは個々の証券の（　Ｂ　）とその組み合わせである（　Ａ　）の（　Ｂ　）を区別して調べることにより、（　Ａ　）を組むことによって（　Ｂ　）の（　Ｃ　）が可能になることを提唱した。個別の証券に集中して投資する（　Ｂ　）よりも、資産が（　Ｃ　）化された（　Ａ　）のほうが（　Ｂ　）は小さくなることを、（　Ａ　）の（　Ｄ　）という。",
    options: [
      { key: "ア", text: "Ａ：ポートフォリオ　Ｂ：リスク　Ｃ：分散　Ｄ：リスク低減効果" },
      { key: "イ", text: "Ａ：ポートフォリオ　Ｂ：リターン　Ｃ：集中　Ｄ：ポートフォリオ効果" },
      { key: "ウ", text: "Ａ：投資家の選好　Ｂ：リターン　Ｃ：分散　Ｄ：リスク低減効果" },
      { key: "エ", text: "Ａ：投資家の選好　Ｂ：リスク　Ｃ：集中　Ｄ：ポートフォリオ効果" }
    ],
    answer: "ア",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：本問では、ポートフォリオのリスク低減効果について問われています。ポートフォリオとは、様々な投資を組み合わせたもののことをいいます。\n2つの株式XとYについてポートフォリオを組む際の、ポートフォリオの期待収益率は、次のように計算されます。\nポートフォリオの期待収益率 ＝ [株式Xの期待収益率] × [株式Xの組み入れ比率] ＋ [株式Yの期待収益率] × [株式Yの組み入れ比率]\n個別の証券に集中して投資するリスクよりも、資産が分散化されたポートフォリオのほうがリスクは小さくなることを、ポートフォリオのリスク低減効果（分散投資によるリスク低減効果）といいます。",
      details: [
        { label: "Ａ：ポートフォリオ", content: "ポートフォリオとは、複数の資産を組み合わせてつくられた資産全体のことをいいます。資本市場においては、様々な投資を組み合わせたもののことです。" },
        { label: "Ｂ：リスク、Ｃ：分散", content: "H.マコービッツは、個々の証券のリスクとその組み合わせであるポートフォリオのリスクを区別し、ポートフォリオを組むことによってリスクの分散が可能になることを提唱しました。" },
        { label: "Ｄ：リスク低減効果", content: "個別の証券に集中して投資するリスクよりも、資産が分散化されたポートフォリオのほうがリスクは小さくなることを、ポートフォリオのリスク低減効果（分散投資によるリスク低減効果）といいます。さらに、H.マコービッツは、リターンとリスクを分布の平均と分散の統計量として具体的に示し、最適なポートフォリオの選択方法を提示しました。この理論のことを、ポートフォリオ選択理論といいます。" }
      ]
    }
  },
  {
    id: 6,
    title: "問題 6 ポートフォリオのリターンとリスク",
    year: "スマート問題集 2-8",
    question: "2つの株式XとYについて、ポートフォリオの組み入れ比率を変化させて、縦軸に期待収益率を横軸に標準偏差をとった場合のリターンとリスクを考える。株式X100%（期待収益率10、標準偏差8.12）、株式Y100%（期待収益率8、標準偏差4.65）、最小リスクポートフォリオ（X:37%, Y:63%のとき期待収益率8.74、標準偏差1.02）であるとする。この記述として最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "株式Xにだけ単独に投資するというのは、ローリスク・ローリターンの投資家行動といえる。" },
      { key: "イ", text: "株式Yにだけ単独に投資するというのは、ハイリスク・ハイリターンの投資家行動といえる。" },
      { key: "ウ", text: "リスクが最も小さくなるのは、組み入れ比率が株式X37%・株式Y63％であるときである。" },
      { key: "エ", text: "組み入れ比率が株式X37%・株式Y63％であるとき以外の組み入れ比率の場合、個別の証券に集中して投資する場合に比べて、リスクは高い。" }
    ],
    answer: "ウ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、ポートフォリオのリターンとリスクについて問われています。株式Xが100%のときと、株式Yが100%のときを結んだ線よりも、ポートフォリオの標準偏差は小さくなることがわかります。標準偏差が最も小さくなるのは、株式Xが37%のときですが、それ以外の組み入れ比率のときもリスクである標準偏差は低減しています。このことから、個別の証券に集中して投資するリスクよりも、資産が分散化されたポートフォリオのほうがリスクは小さくなるというポートフォリオのリスク低減効果が働いていることが示されます。",
    explanation: [
      { choice: "ア", content: "× ： 株式Xにだけ単独に投資すると、リターンを表す期待収益率は10で最も高くなりますが、リスクを表す標準偏差も8.12で最も大きくなり、リスクが最も高くなります。これは、ハイリスク・ハイリターンの投資家行動と言えます。ローリスク・ローリターンの投資家行動ではありません。" },
      { choice: "イ", content: "× ： 株式Yにだけ単独に投資すると、リスクを表す標準偏差は4.65でリスクが最も低いわけではありませんが、リターンを表す期待収益率は8で最も低くなります。これは、ローリターンの投資家行動と言えます。ハイリスク・ハイリターンではありません。" },
      { choice: "ウ", content: "○ ： リスクを表す標準偏差が最も小さくなるのは、組み入れ比率が株式X37%・株式Y63％であるときです。これによりポートフォリオのリスク低減効果が働いていることが示されます。よって、記述は適切です。" },
      { choice: "エ", content: "× ： 組み入れ比率が株式X37%・株式Y63％であるとき以外の組み入れ比率の場合も、個別の証券に集中して投資する場合に比べて、リスクである標準偏差は低減しています。リスクが高いというわけではありません。" }
    ]
  },
  {
    id: 7,
    title: "問題 7 相関係数とリスク",
    year: "スマート問題集 2-8",
    question: "相関係数が－1、0、1の場合における、2つの株式XとYについて、ポートフォリオの組み入れ比率を変化させて、縦軸に期待収益率を横軸に標準偏差をとったポートフォリオのリターンとリスクに関する記述として、最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "相関係数が－1のとき、ポートフォリオのリスク低減効果は最も小さくなる。" },
      { key: "イ", text: "相関係数が1のとき、ポートフォリオのリスク低減効果は最も大きくなる。" },
      { key: "ウ", text: "相関係数が0のとき、ポートフォリオのリスクを低減することができない。" },
      { key: "エ", text: "相関係数が1以外のとき、ポートフォリオのリスク低減効果がある。" }
    ],
    answer: "エ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、相関係数とリスクについて問われています。ポートフォリオのリスク低減効果を説明するものに、次のものがあります。\n●共分散（2つの株式がどれぐらい一緒に動くかを表す。プラス→同じ方向、マイナス→逆の方向。数式：共分散 ＝ Σ(Xの偏差 × Yの偏差 × 確率)）\n●相関係数（2つの株式の関係の強さを表す。－1のとき：まったく反対の方向に動きリスクを最大限に低減できる。0のとき：何の関係もないがリスクの低減はできる。1のとき：まったく同じ方向に動きリスクの低減をすることができない。数式：相関係数＝共分散／(Xの標準偏差×Yの標準偏差)）",
    explanation: [
      { choice: "ア", content: "× ： 相関係数が－1のとき、ポートフォリオのリスク低減効果は最も大きくなります。株式Xの比率が減るにしたがって標準偏差が減少していき、ある点で標準偏差が0になります。効果が最も小さくなるのではありません。" },
      { choice: "イ", content: "× ： 相関係数が1のときは、ポートフォリオのリスク低減効果はゼロになります。株式Xと株式Yの点を結んだ直線になります。最も大きくなるのではありません。" },
      { choice: "ウ", content: "× ： 相関係数が0のとき、ポートフォリオのリスクを低減することができます。低減することができないというわけではありません。" },
      { choice: "エ", content: "○ ： 相関係数が1以外の頂点・曲線上の場合は、ポートフォリオのリスク低減効果があることがわかります。相関係数が1というのは全く同じ方向に動くということです。よって、逆の動きをするような株でポートフォリオを組んだ方が効果が高いということになります。よって、記述は適切です。" }
    ]
  },
  {
    id: 8,
    title: "問題 8 システマティックリスクと非システマティックリスク",
    year: "スマート問題集 2-8",
    question: "次の文章は、ポートフォリオのリスクとリターン、分散効果について述べたものである。空欄Ａ～Ｃに入る語句の組み合わせとして、最も適切なものはどれか。\n\nポートフォリオの総リスクは、（　Ａ　）と（　Ｂ　）から構成される。\n（　Ａ　）は、ポートフォリオを構成する銘柄数が多くなると減少するが（　Ｂ　）は、減少することはない。これは（　Ｂ　）が株式市場のリスクを表すためである。（　Ｃ　）は、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線です。（　Ｃ　）は、ベータの一次関数で表され、切片は安全利子率であり、傾きは市場ポートフォリオのリスクプレミアムである。",
    options: [
      { key: "ア", text: "Ａ：システマティック・リスク　　 Ｂ：アンシステマティック・リスク　　Ｃ：資本市場線" },
      { key: "イ", text: "Ａ：システマティック・リスク　　 Ｂ：アンシステマティック・リスク　　Ｃ：証券市場線" },
      { key: "ウ", text: "Ａ：アンシステマティック・リスク　　 Ｂ：システマティック・リスク　　Ｃ：証券市場線" },
      { key: "エ", text: "Ａ：アンシステマティック・リスク　　 Ｂ：システマティック・リスク　　Ｃ：資本市場線" }
    ],
    answer: "ウ",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：株式のリスクには、ポートフォリオを組むことで分散化できるリスクと分散化できないリスクがあります。分散化できるリスクをアンシステマティック・リスク、分散化できないリスクをシステマティック・リスクといい、システマティック・リスクは市場全体のリスクを意味しています。分散化によってリスクが低減される効果をポートフォリオ効果といいます。一般に、組込銘柄数が20程度になると、ほぼ、市場ポートフォリオと同様のリスク水準となるといわれています。\n証券市場線（Security Market Line、SML） とは、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線です。切片は安全利子率であり、傾きは市場ポートフォリオのリスクプレミアムです。",
      details: [
        { label: "Ａ：アンシステマティック・リスク", content: "Ａは、銘柄数が増加すると減少します。これをポートフォリオの分散効果といい、個別銘柄のリスクが分散投資によって次第に低減していきます。銘柄固有のリスクをアンシステマティック・リスクといいます。" },
        { label: "Ｂ：システマティック・リスク", content: "Ｂは、株式市場のリスクになりますので、分散投資によっても変化しません。Ｂにはシステマティック・リスクが入ります。" },
        { label: "Ｃ：証券市場線", content: "証券市場線は、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線です。従って、Ｃは証券市場線が入ります。よって、選択肢ウが正解となります。" }
      ]
    }
  },
  {
    id: 9,
    title: "問題 9 効率的フロンティア",
    year: "スマート問題集 2-8",
    question: "資本市場にたくさん存在する株式を自由に組み合わせたポートフォリオを作成し、リターンとリスクの分布を示した効率的フロンティアに関する記述として、最も不適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "効率的フロンティアとは、特定のリスクの大きさに対して、最低のリターンをあげることが期待されるポートフォリオのことをいう。" },
      { key: "イ", text: "ポートフォリオAとポートフォリオBを比較してみると、合理的な投資家は必ず効率的フロンティアの上にあるAを選ぶ。" },
      { key: "ウ", text: "ローリスク・ローリターンを好む投資家は、効率的フロンティアの左側の線上のポートフォリオを選ぶ。" },
      { key: "エ", text: "ハイリスク・ハイリターンを好む投資家は、効率的フロンティアの右側の線上のポートフォリオを選ぶ。" }
    ],
    answer: "ア",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、効率的フロンティアについて問われています。資本市場にたくさん存在する株式を自由に組み合わせたポートフォリオを作成すると、リターンとリスクの分布は特定の形状になると考えられます。投資家は、リスクをできるだけ抑えて、高いリターンを得ようとすると、特定の曲線上（効率的フロンティア）のポートフォリオを選択することになります。●効率的フロンティア：特定のリスクの大きさに対して、最高のリターンをあげることが期待されるポートフォリオ。または、期待される利益の一定の大きさに対して最もリスクの低いポートフォリオ。",
    explanation: [
      { choice: "ア", content: "× ： 効率的フロンティアとは、特定のリスクの大きさに対して、最高のリターンをあげることが期待されるポートフォリオ、または、期待される利益の一定の大きさに対して最もリスクの低いポートフォリオのことをいいます。最低のリターンをあげることが期待されるポートフォリオではありません。よって、記述は不適切解です。" },
      { choice: "イ", content: "○ ： 適切な記述です。効率的フロンティアの上にあるポートフォリオAと、標準偏差はAと同じですが、期待収益率がAよりも低いポートフォリオBを比較してみると、このBに比べ、Aは同じリスクでより高いリターンを得ることができます。よって、合理的な投資家はAを選択します。" },
      { choice: "ウ", content: "○ ： 適切な記述です。投資家は効率的フロンティアの上で、どれぐらいのリターンとリスクを好むかによって、自由に選択できます。ローリスク・ローリターンを好む投資家は、標準偏差の低く期待収益率が低い、効率的フロンティアの左側の線上を選びます。" },
      { choice: "エ", content: "○ ： 適切な記述です。ハイリスク・ハイリターンを好む投資家は、標準偏差が高く期待収益率の高い、効率的フロンティアの右側の線上を選びます。" }
    ]
  },
  {
    id: 10,
    title: "問題 10 リスクフリー資産",
    year: "スマート問題集 2-8",
    question: "株式Xと国債をポートフォリオに組み込んだ場合におけるリターンとリスクの分布（国債100%のとき期待収益率2%, 標準偏差0%、株式100%のとき期待収益率10%, 標準偏差8.12%）に関する記述として、最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "国債の期待収益率は、10％である。" },
      { key: "イ", text: "国債は、リスクフリー資産である。" },
      { key: "ウ", text: "国債を購入する比率が低くなるほど、リスクは小さくなる。" },
      { key: "エ", text: "国債をポートフォリオに入れると、株式だけのポートフォリオよりも、リスクを嫌う投資家は、よりリスクの低いポートフォリオを選択できなくなる。" }
    ],
    answer: "イ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、リスクフリー資産について問われています。国債は、景気の変動によってリターンが変わりませんので、リスクがない資産、つまりリスクフリー資産であると考えられます。株式Xと国債を組み合わせたポートフォリオを作成すると、関係は直線で表されます。",
    explanation: [
      { choice: "ア", content: "× ： 国債の期待収益率は2％です。国債だけを単独に購入した場合は、縦軸切片（直線が縦軸を切り取る値）で表され、このとき、期待収益率は2％となっています。10％ではありません。" },
      { choice: "イ", content: "○ ： 国債は、リスクフリー資産です。国債だけを単独に購入した場合は、標準偏差は0となっています。標準偏差はリスクを表すものですので、国債はリスクがゼロであることがわかります。よって、記述は適切です。" },
      { choice: "ウ", content: "× ： 国債を購入する比率が低くなるほど、標準偏差で示されるリスクは大きくなります。リスクは小さくなるのではありません。株式Xを購入する比率を増やしていくと、株式Xが100%の点まで引かれた右上がりの直線となります。" },
      { choice: "エ", content: "× ： リスクフリー資産をポートフォリオに入れると、投資家の選択の幅が広がります。リスクを嫌う投資家は、株式だけのポートフォリオよりも、よりリスクの低いポートフォリオを選択できるようになります。選択することができなくなるのではありません。" }
    ]
  },
  {
    id: 11,
    title: "問題 11 市場ポートフォリオ",
    year: "スマート問題集 2-8",
    question: "リスクフリー資産である国債と、全ての株式を自由に組み合わせた場合におけるリターンとリスクの分布を示した図に関する記述として、最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "資本市場線とは、資本市場において、リスクフリー資産だけを購入した場合を示すものである。" },
      { key: "イ", text: "A点（資本市場線上の点）とB点（効率的フロンティア上の点）を比較すると、B点の方が同じリスクで高いリターンを実現できる。" },
      { key: "ウ", text: "合理的な投資家は、必ず資本市場線の上のポートフォリオを選択する。" },
      { key: "エ", text: "市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小である。" }
    ],
    answer: "ウ",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、市場ポートフォリオについて問われています。投資家は、資本市場線と効率的フロンティアの接点において、最適なリターンとリスクを実現することができます。\n・資本市場線：リスクフリー資産と、任意の株式を自由に組み合わせた直線のうち、最大限に上に位置するもの。\n・効率的フロンティア：特定のリスクの大きさに対して最高のリターンをあげるポートフォリオの集合。\n・市場ポートフォリオ：資本市場線と効率的フロンティアの接点のこと。",
    explanation: [
      { choice: "ア", content: "× ： 国債を組み合わせることで任意の株式によるポートフォリオと、リスクフリーレートの点を結んだ直線上のポートフォリオが選択可能になります。この直線を最大限に上に引いたのが資本市場線です。リスクフリー資産だけを購入した場合を示すものではありません。" },
      { choice: "イ", content: "× ： B点は効率的フロンティアの上にあるため、株式だけによるポートフォリオとしては最適化されています。しかし国債を組み合わせたポートフォリオであるA点と比較すると、A点の方が同じリスクで、より高いリターンを実現できます。B点の方が高いリターンを実現できるのではありません。" },
      { choice: "ウ", content: "○ ： イの解説から、合理的な投資家は、必ず資本市場線の上のポートフォリオを選択することがわかります。よって、記述は適切です。" },
      { choice: "エ", content: "× ： 市場ポートフォリオとは、資本市場線と効率的フロンティアの接点のことです。市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小ではありません（最小は国債100%）。よって、不適切です。正解はウになります。" }
    ]
  },
  {
    id: 12,
    title: "問題 12 CAPM",
    year: "スマート問題集 2-8",
    question: "次の資料は、G証券に関するものである。この資料に基づいた場合、CAPMによりG証券の期待収益率を計算する数式として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n・リスクフリーレート：2％\n・β値：1.2\n・市場ポートフォリオの期待収益率：8％",
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
      summary: "ここが重要：本問では、CAPMについて問われています。資本資産評価モデル（CAPM：Capital Asset Pricing Model）とは、投資資本（証券）の期待収益率は、リスクフリーレートとリスクプレミアムを加えたものになるというモデルのことをいいます。\n〈数式〉個別株式の期待収益率 ＝ リスクフリーレート ＋ β × 市場リスクプレミアム\n※市場リスクプレミアム ＝ 市場ポートフォリオの期待収益率 － リスクフリーレート\n※β：市場ポートフォリオと比べたときの、個別株式のリスクの大きさ\nCAPMの計算は、頻出問題です。しっかりと計算することができるように練習しておきましょう。",
      steps: [
        { title: "G証券の期待収益率の算定式", formula: "個別株式の期待収益率 ＝ リスクフリーレート ＋ β値 × (市場ポートフォリオの期待収益率 － リスクフリーレート)", calc: "＝ 2％ ＋ 1.2 × (8％ － 2％)\n＝ 2％ ＋ 7.2％\n＝ 9.2％\nしたがって、CAPMによりG証券の期待収益率を計算する数式は、「2％ ＋ 1.2 × (8％ － 2％)」となります。よって、オが適切です。" }
      ]
    }
  },
  {
    id: 13,
    title: "問題 13 加重平均資本コスト",
    year: "スマート問題集 2-8",
    question: "次の資料は、H社の資金調達に関するものである。この資料に基づいた場合、H社の加重平均資本コストを計算する数式として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．H社は現在、普通株式と社債によって資金調達を行っている。\n２．資金調達の状況：\n　・社債：帳簿価額 400万円 / 時価 400万円\n　・普通株式：帳簿価額 400万円 / 時価 600万円\n３．投資家が要求している収益率：社債 3% / 普通株式 13%\n４．実効税率は40％とする。\n５．普通株式の収益率はCAPMにより算出されたものである。",
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
      summary: "ここが重要：本問では、加重平均資本コストについて問われています。加重平均資本コスト（WACC：Weighted Average Cost of Capital）とは、負債から生じるコストと資本から生じるコストを加重平均したもののことをいいます。\n〈数式〉WACC ＝ [負債／(負債＋資本)] ×（1－実効税率）× 負債利子率 ＋ [資本／(負債＋資本)] × 資本コスト\n加重平均資本コストの計算は頻出問題です。特に、負債と資本の額については、貸借対照表の簿価（帳簿価額）ではなく、時価を使用する点に注意しましょう。",
      steps: [
        { title: "1. 構成比率の計算（時価を使用）", formula: "負債の構成比率 ＝ 400／(400＋600) ＝ 0.4, 資本の構成比率 ＝ 600／(400＋600) ＝ 0.6", calc: "構成比率は、帳簿価額ではなく、時価を用います。" },
        { title: "2. 加重平均資本コストWACCの数式", formula: "WACC ＝ 負債の構成比率 × (1 － 実効税率) × 負債利子率 ＋ 資本の構成比率 × 資本コスト", calc: "＝ 0.4 × (1 － 0.4) × 3％ ＋ 0.6 × 13％\n＝ 0.72％ ＋ 7.8％ ＝ 8.52％\nしたがって、H社の加重平均資本コストを計算する数式は、「0.4 × (1 － 0.4) × 3％ ＋ 0.6 × 13％」となります。よって、エが適切です。" }
      ]
    }
  },
  {
    id: 14,
    title: "問題 14 資金調達方法",
    year: "スマート問題集 2-8",
    question: "資金調達方法に関する説明として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "内部留保と減価償却費は、内部金融に該当する。" },
      { key: "イ", text: "内部金融とは、企業外部から資金調達を行うことである。" },
      { key: "ウ", text: "直接金融とは、金融仲介機関から直接的に資金を融通することである。" },
      { key: "エ", text: "間接金融とは、金融仲介機関を経由せずに、間接的に資金を融通することである。" }
    ],
    answer: "ア",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、資金調達方法について問われています。\n資金調達を分類すると、外部金融（企業間信用[支払手形・買掛金]、間接金融[短期・長期借入]、直接金融[社債・株式]）と、内部金融（自己金融[内部留保・減価償却]）に分けられます。\n外部金融と内部金融、間接金融と直接金融、自己資本と他人資本を混同しないよう、しっかりと整理しておきましょう。",
    explanation: [
      { choice: "ア", content: "○ ： 内部金融とは、自己金融ともいわれ、企業の内部で資金の調達を行うことです。留保利益（内部留保）と減価償却費が内部金融に該当します。よって、記述は適切です。" },
      { choice: "イ", content: "× ： 企業外部から資金調達を行うものは、外部金融です。内部金融ではありません。企業間信用、借入金融、証券金融が外部金融に該当します。" },
      { choice: "ウ", content: "× ： 直接金融とは、金融仲介機関を経由せず、借り手が金融市場から直接資金を調達することです。金融仲介機関から直接的に資金を融通することではありません。証券金融（社債発行、株式発行）が直接金融に該当します。" },
      { choice: "エ", content: "× ： 間接金融とは、金融市場を経由せずに、貸し手と借り手の間を金融仲介機関（銀行、信用金庫、保険会社など）が仲介し、金融仲介機関を経由して、間接的に資金を融通することをいいます。金融仲介機関を経由せずに、間接的に資金を融通することではありません。混同しないようにしましょう。" }
    ]
  },
  {
    id: 15,
    title: "問題 15 ファイナンス・リース取引",
    year: "スマート問題集 2-8",
    question: "ファイナンス・リース取引に関する説明として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "ファイナンス・リース取引とは、リース契約に基づくリース期間の中途において当該契約を解除することができないリース取引またはこれに準ずるリース取引で、借手が、当該契約に基づき使用する物件からもたらされる経済的利益を実質的に享受することができ、かつ、当該リース物件の使用に伴って生じるコストを実質的に負担することとなるリース取引をいう。" },
      { key: "イ", text: "ファイナンス・リース取引とは、リース契約に基づくリース期間の中途において当該契約を解除することができるリース取引またはこれに準ずるリース取引で、借手が、当該契約に基づき使用する物件からもたらされる経済的利益を実質的に享受することができ、かつ、当該リース物件の使用に伴って生じるコストを実質的に負担しなくてもよいリース取引をいう。" },
      { key: "ウ", text: "ファイナンス・リース取引については、通常の賃貸借取引に係る方法に準じて会計処理を行う。" },
      { key: "エ", text: "ファイナンス・リース取引については、通常の資本取引に係る方法に準じて会計処理を行う。" }
    ],
    answer: "ア",
    explanationType: "text-choices",
    summary: "ここが重要：本問では、ファイナンス・リース取引について問われています。ファイナンス・リース取引とは、リース会社が、借り手が選択した設備などのリース物件を購入し、借り手に貸与するリース取引の一種です。ファイナンス・リース取引には、次のような特徴があります。●ノンキャンセラブル（借り手はリース期間中に途中解約できません）●フルペイアウト（リース物件の維持管理費などの使用コストを負担し、リース料をリース会社に支払う必要があります）\n貸し手のことをレッサー、借り手のことをレッシーといます。ファイナンス・リース取引については、通常の売買取引に係る方法に準じて会計処理をします。したがって、リース物件は借り手の貸借対照表で開示され、減価償却費は借り手の損益計算書に計上されます。長期借入して設備を購入した場合と同様の効果があるため、資金調達の性格が強いものであることも理解しておきましょう。",
    explanation: [
      { choice: "ア", content: "○ ： 定義の記述の通り、中途解約不能、かつ経済的利益を実質享受・コスト実質負担となる取引をいいます。よって、記述は適切です。" },
      { choice: "イ", content: "× ： ファイナンス・リース取引では、リース契約の中途解約が契約上または事実上において不可能（解約不能）です。また、コストを実質的に負担することとなります。" },
      { choice: "ウ", content: "× ： ファイナンス・リース取引については、通常の売買取引に係る方法に準じて会計処理を行います。通常の賃貸借取引に係る方法ではありません。" },
      { choice: "エ", content: "× ： ウの解説のとおり、ファイナンス・リース取引については、通常の売買取引に係る方法に準じて会計処理を行います。通常の資本取引に係る方法ではありません。" }
    ]
  },
  {
    id: 16,
    title: "問題 16 効率的市場仮説",
    year: "スマート問題集 2-8",
    question: "効率的市場仮説について述べた次の文章中の空欄Ａ～Dに入る語句の組み合わせとして、最も適切なものはどれか。\n\n（　Ａ　）では、チャート分析などテクニカル分析の有効性が否定されている。（　Ｂ　）では、株価が上昇するか下落するかは五分五分の可能性なので、株価の将来の値動きを予測することは不可能とされる。インサイダー情報を利用しても将来の株価を予測することはできないとする説は（　Ｃ　）である。一方、（　Ｄ　）ではファンダメンタル分析の有効性が否定されている。",
    options: [
      { key: "ア", text: "Ａ：ストロング・フォームの効率的市場仮説　　Ｂ：ウィーク・フォームの効率的市場仮説　　Ｃ：ランダムウォーク理論　　Ｄ：セミストロング・フォームの効率的市場仮説" },
      { key: "イ", text: "Ａ：ウィーク・フォームの効率的市場仮説　　Ｂ：ランダムウォーク理論　　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：セミストロング・フォームの効率的市場仮説" },
      { key: "ウ", text: "Ａ：ランダムウォーク理論　　Ｂ：セミストロング・フォームの効率的市場仮説　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：ウィーク・フォームの効率的市場仮説" },
      { key: "エ", text: "Ａ：ランダムウォーク理論　　Ｂ：ウィーク・フォームの効率的市場仮説　　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：セミストロング・フォームの効率的市場仮説" }
    ],
    answer: "イ",
    explanationType: "text-1",
    explanation: {
      summary: "ここが重要：「効率的市場仮説」は、株価に反映される情報のレベルにより以下の３種類に分類されます。\n・ウィーク・フォームの効率的市場仮説：現在の株価には過去の株価データの全てが反映されているため、チャート分析などテクニカル分析の有効性が否定されています。\n・セミストロング・フォームの効率的市場仮説：企業が公開している情報の全てが反映されているため、財務諸表などの情報を分析するファンダメンタル分析の有効性が否定されています。\n・ストロング・フォームの効率的市場仮説：一部の投資家だけ利用できる内部情報も反映されているため、インサイダー情報を利用しても将来の株価を予測することはできないとするものです。\n・ランダムウォーク理論：株価が上昇するか下落するかは五分五分の可能性なので、将来の値動きを予測することは不可能であるとするものです。",
      details: [
        { label: "空欄のあてはめ", content: "最も、容易に入手できる価格自体の情報（過去の株価変動情報）が役に立たないとされる（ Ａ ）にはウィーク・フォームが入ります。五分五分の可能性で予測不可能とする（ Ｂ ）にはランダムウォーク理論が入ります。インサイダー情報すら役に立たないとする（ Ｃ ）にはストロング・フォームが入ります。公開財務情報等のファンダメンタル情報がすでに織り込まれているとする（ Ｄ ）には、セミストロング・フォームが入ります。よって、選択肢イが正解となります。" }
      ]
    }
  }
];

// ==========================================
// MAIN COMPONENT
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
    console.log(`Connecting with passcode key: [${passcode}]`);
    
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
        console.log("Restored snapshot from server.", fetchedData);
      } else {
        await setDoc(docRef, fetchedData);
        console.log("Created new snapshot node on cloud.");
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
      console.error("Error retrieving dashboard baseline:", err);
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
      console.log("State written to cloud storage.", updatedData);
    } catch (err) {
      console.error("Cloud synchronization failed:", err);
    }
  };

  const startQuiz = (mode, forceStartIndex = null) => {
    console.log(`Setting up track criteria: ${mode}`);
    
    let list = [];
    if (mode === 'all') {
      list = [...quizQuestions];
    } else if (mode === 'wrong') {
      list = quizQuestions.filter(q => userData.history[q.id]?.correct === false);
    } else if (mode === 'review') {
      list = quizQuestions.filter(q => userData.reviews[q.id] === true);
    }

    if (list.length === 0) {
      alert("該当する問題がありません。別の出題モードを選択してください。");
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
      console.log("Completed targeted session sequence tracking cleanups.");
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
    console.log("Returning safely to index page node.");
    setCurrentScreen('start');
  };

  const handleResetProgress = () => {
    if (window.confirm("進行状態インデックスを破棄し、最初から開始状態へリセットしますか？")) {
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
        <p className="text-slate-600 font-medium">データを同期しています...</p>
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
              <h2 className="text-2xl font-bold text-slate-900">学習履歴同期システム</h2>
              <p className="text-slate-500 text-sm mt-2">
                独自の「合言葉」を入力して接続すると、どの端末からでも進捗を100%同期して再開できます。
              </p>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  同期用の合言葉を入力
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
                <span>学習履歴に接続する</span>
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
                        <h4 className="font-bold text-amber-900">中断したセッションを検出しました</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          前回は【問題 {resumePrompt.index + 1}】まで進んでいます。続きから学習を再開しますか？
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
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">学習の進捗状況</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-600">総問題数:</span><span className="font-bold text-slate-900">{totalQuestionsCount} 問</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">解答済み:</span><span className="font-bold text-slate-900">{answeredKeysCount} 問</span></div>
                        <div className="flex justify-between text-sm"><span className="text-indigo-600">正解率:</span><span className="font-bold text-indigo-600">{answeredKeysCount > 0 ? Math.round((correctAnswersCount / answeredKeysCount) * 100) : 0} %</span></div>
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
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">正誤バランスグラフ</h3>
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
                    <span>出題対象を選んでスタート</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => startQuiz('all')} className="group text-left border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-5 hover:bg-indigo-50/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition"><BookOpen className="w-5 h-5" /></div>
                        <h4 className="font-bold text-slate-900 text-base">すべての問題</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">全16問を順番通りに網羅して解いていきます。</p>
                      </div>
                      <div className="mt-4 text-xs font-semibold text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">開始する <ChevronRight className="w-3.5 h-3.5 ml-0.5" /></div>
                    </button>

                    <button onClick={() => startQuiz('wrong')} className="group text-left border-2 border-slate-200 hover:border-rose-500 rounded-2xl p-5 hover:bg-rose-50/30 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition"><X className="w-5 h-5" /></div>
                        <h4 className="font-bold text-slate-900 text-base">前回不正解のみ</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">間違えた問題（残り: {wrongQuestionsCount}問）の弱点克服を目指します。</p>
                      </div>
                      <div className="mt-4 text-xs font-semibold text-rose-600 flex items-center group-hover:translate-x-1 transition-transform">開始する <ChevronRight className="w-3.5 h-3.5 ml-0.5" /></div>
                    </button>

                    <button onClick={() => startQuiz('review')} className="group text-left border-2 border-slate-200 hover:border-amber-500 rounded-2xl p-5 hover:bg-amber-50/30 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition"><HelpCircle className="w-5 h-5" /></div>
                        <h4 className="font-bold text-slate-900 text-base">要復習の問題のみ</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">チェック済みの最重要項目（合計: {reviewQuestionsCount}問）を反復します。</p>
                      </div>
                      <div className="mt-4 text-xs font-semibold text-amber-600 flex items-center group-hover:translate-x-1 transition-transform">開始する <ChevronRight className="w-3.5 h-3.5 ml-0.5" /></div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-base">同期中の学習ステータス一覧</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase">
                          <th className="px-6 py-3">収録タイトル</th>
                          <th className="px-6 py-3 text-center">前回の成否</th>
                          <th className="px-6 py-3 text-center">要復習</th>
                          <th className="px-6 py-3">最終スタンプ</th>
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
                                  <span className="text-xs text-slate-400">未挑戦</span>
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
                    出題中: <span className="text-indigo-600 font-bold">{currentIdx + 1}</span> / {filteredQuestions.length} 問
                  </div>
                  <div className="w-1/2 bg-slate-200 rounded-full h-2.5 mx-4 overflow-hidden">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / filteredQuestions.length) * 100}%` }}></div>
                  </div>
                  <button onClick={handleAbortToHome} className="text-xs text-slate-500 hover:text-slate-800 font-medium transition">中断する</button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-bold">{filteredQuestions[currentIdx].year}</span>
                    <h2 className="text-lg font-bold text-slate-900">{filteredQuestions[currentIdx].title}</h2>
                  </div>

                  <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-medium">{filteredQuestions[currentIdx].question}</p>

                  {/* FORMULAS SECTION FOR QUESTION 2 (ABSOLUTE FIDELITY REPRODUCTION) */}
                  {filteredQuestions[currentIdx].hasFormulas && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 font-mono text-sm shadow-inner text-slate-700">
                      <div className="text-xs font-bold text-indigo-600 tracking-wider mb-2">【計算用資料】</div>
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
                          <tr className="bg-orange-100 text-orange-900 font-bold border-b border-slate-200">
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
                      <label htmlFor="rev-check" className="text-sm font-semibold text-slate-700 cursor-pointer">この問題を要復習リストとしてマークする</label>
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
                              <div className="font-bold text-slate-900 mb-1">選択肢 {item.choice}</div>
                              <p className="text-slate-600 whitespace-pre-wrap">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button onClick={handleNextQuestion} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow transition flex items-center justify-center space-x-2">
                      <span>{currentIdx + 1 < filteredQuestions.length ? "次の問題へ進む" : "このセッションを終了する"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}