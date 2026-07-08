(function (global) {
  "use strict";

  const includesAny = (text, words) => words.some((word) => text.includes(word));
  const compact = (value, fallback = "先回到公式定义和适用条件，再决定是否套用。") => String(value || fallback).trim();
  const short = (value, max = 72) => {
    const text = compact(value).replace(/\s+/g, " ");
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  };

  function classify(card) {
    const hay = [card.subject, card.chapter, card.section, card.title, (card.tags || []).join(" "), card.interactiveType].join(" ");
    if (includesAny(hay, ["等价无穷小", "Taylor", "极限", "洛必达", "主项"])) return "limit";
    if (includesAny(hay, ["导数", "微分", "切线", "单调", "极值", "中值"])) return "derivative";
    if (includesAny(hay, ["三角", "单位圆", "积化和差", "和差化积", "万能公式"])) return "trig";
    if (includesAny(hay, ["积分", "Wallis", "Beta", "Gamma", "反常", "Riemann", "面积"])) return "integral";
    if (includesAny(hay, ["空间", "曲线", "曲面", "Green", "Gauss", "Stokes", "重积分", "多元"])) return "multivariable";
    if (includesAny(hay, ["级数", "幂级数", "Fourier", "收敛", "判别"])) return "series";
    if (includesAny(hay, ["矩阵", "行列式", "特征值", "二次型", "正定", "向量组", "秩", "线性方程组"])) return "linear";
    if (includesAny(hay, ["概率", "分布", "期望", "方差", "Bayes", "卷积", "独立", "检验", "估计", "CLT"])) return "probability";
    return "general";
  }

  const profiles = {
    limit: {
      proofTitle: "证明路线：局部主项与误差阶",
      proofSteps: [
        "先明确趋近点和变量替换条件，确认函数在该点附近有定义。",
        "把复杂表达式化成等价无穷小、Taylor 主项或标准极限。",
        "若出现加减，必须先检查主项是否抵消；抵消后继续展开下一阶。",
        "最后把余项写成更高阶小量或有界量，说明商的极限为什么成立。"
      ],
      trigger: "0/0、∞/∞、差值趋零、主项抵消、局部近似",
      examSteps: ["定型", "找主项", "查抵消", "算常数", "补条件"],
      exampleProblem: "遇到含本公式的局部极限，怎样判断能不能直接替换？",
      exampleSolution: ["先看是否是乘除结构；乘除通常可直接用等价替换。", "若是加减结构，先展开到同阶主项，不能把每一项机械替换。", "保留最低非零阶后再约去公共因子，常数即为极限。"]
    },
    derivative: {
      proofTitle: "证明路线：从导数定义到局部线性化",
      proofSteps: [
        "从差商或已知基本导数出发，先确认定义域、可导性和复合关系。",
        "使用四则、复合、反函数、隐函数或参数方程求导规则拆解。",
        "把导数解释成局部线性主部，用它连接切线、单调性、极值和近似。",
        "高阶导或中值定理题要额外说明区间连续、内部可导等条件。"
      ],
      trigger: "切线斜率、单调极值、近似计算、隐函数、参数方程",
      examSteps: ["写定义域", "选求导规则", "化简导数", "代入点或判符号", "回到题意"],
      exampleProblem: "题目让求切线或判断单调时如何使用本公式？",
      exampleSolution: ["先用本卡公式得到导数或微分。", "切线题代入点得到斜率；单调题研究导数符号。", "如果涉及极值，补充驻点和不可导点的比较。"]
    },
    trig: {
      proofTitle: "证明路线：和差角公式统一生成",
      proofSteps: [
        "把目标角拆成 A±B、2A、A/2 或 t=tan(x/2) 的形式。",
        "从 sin(A±B)、cos(A±B) 出发，通过相加、相减或配方得到目标式。",
        "若公式涉及平方或乘积，优先考虑降幂、积化和差、和差化积。",
        "最后检查角度单位、象限符号和系数 1/2，避免符号错误。"
      ],
      trigger: "三角乘积、三角和差、角度组合、振幅相位、降幂",
      examSteps: ["看角度关系", "选和差/倍半/万能公式", "统一频率或相位", "化简系数", "检查象限"],
      exampleProblem: "看到三角乘积或和差，怎么决定变形方向？",
      exampleSolution: ["乘积难积分时用积化和差，把乘法变成可积分的和。", "和差难比较时用和差化积，把零点和符号暴露出来。", "线性组合 a sin x+b cos x 优先化成 R sin(x+φ)。"]
    },
    integral: {
      proofTitle: "证明路线：换元、分部、对称与递推",
      proofSteps: [
        "先识别被积函数结构：复合函数、乘积、根式、三角幂、奇偶性或奇点。",
        "复合结构优先换元；乘积结构考虑分部；对称区间考虑配对。",
        "高次幂或参数族积分常用递推，反常积分必须先判断收敛。",
        "计算结束后把上下限、常数因子和积分常数补回。"
      ],
      trigger: "换元、分部、对称区间、三角幂、反常积分、面积体积",
      examSteps: ["判结构", "选方法", "处理边界", "计算主积分", "验收敛/常数"],
      exampleProblem: "遇到含本公式的积分题，第一步该看什么？",
      exampleSolution: ["先判断是定积分还是不定积分；定积分优先看区间对称和换元。", "若是高次三角幂，优先想 Wallis、降幂或 Beta/Gamma。", "反常积分不要先算值，先写收敛判别。"]
    },
    multivariable: {
      proofTitle: "证明路线：区域、方向与守恒量",
      proofSteps: [
        "先画出区域、曲线或曲面，确定变量范围与方向约定。",
        "多元微分题用梯度、Hessian 或隐函数关系组织计算。",
        "重积分和曲线曲面积分题先选坐标系，再写 Jacobian 或方向余弦。",
        "Green/Gauss/Stokes 题要检查区域光滑性、方向和边界是否闭合。"
      ],
      trigger: "区域积分、方向、法向量、边界、通量、环流、极值",
      examSteps: ["画区域", "定方向", "选坐标", "写积分元", "检查边界"],
      exampleProblem: "曲线/曲面积分为什么容易错方向？",
      exampleSolution: ["先把题目指定方向翻译成参数增大方向或外法向。", "再把积分公式中的符号与方向对应起来。", "若能用 Green/Gauss/Stokes，转换后仍要保留正确边界方向。"]
    },
    series: {
      proofTitle: "证明路线：尾项速度与端点检查",
      proofSteps: [
        "先判断是正项、交错、任意项、幂级数还是 Fourier 级数。",
        "正项优先比较、比值、根值；交错先看单调趋零；任意项考虑绝对收敛。",
        "幂级数先求收敛半径，端点必须代回原级数分别检查。",
        "函数项级数还要区分逐点、一致、绝对一致等层级。"
      ],
      trigger: "敛散性、收敛半径、端点、逐项求导积分、Fourier 系数",
      examSteps: ["分类", "选判别法", "算半径/尾项", "查端点", "写结论区间"],
      exampleProblem: "幂级数题为什么不能只写收敛半径？",
      exampleSolution: ["比值或根值只给出开区间。", "两个端点代回后可能一个收敛一个发散。", "最终答案必须写成完整收敛域。"]
    },
    linear: {
      proofTitle: "证明路线：变换类型与不变量",
      proofSteps: [
        "先判断题目允许的变换：初等变换、相似变换、合同变换或正交变换。",
        "对应抓住不变量：秩、行列式、特征值、迹、惯性指数或内积。",
        "把对象化到阶梯形、对角形、标准形或正交基下再计算。",
        "最后把标准形结论翻译回原矩阵、向量组或方程组。"
      ],
      trigger: "秩、解空间、特征值、相似对角化、二次型、正定",
      examSteps: ["判变换", "抓不变量", "化标准形", "读结论", "回代验证"],
      exampleProblem: "线代题中为什么不能混用相似和合同，如何从题意判断该抓哪类不变量？",
      exampleSolution: ["相似保持特征值，常用于矩阵对角化。", "合同保持二次型惯性指数，常用于正定和标准形。", "题目问二次型时优先想合同，问线性变换时优先想相似。"]
    },
    probability: {
      proofTitle: "证明路线：事件分解、密度区域与条件化",
      proofSteps: [
        "离散题先写事件分解；连续题先画密度支持区域和积分边界。",
        "条件概率先锁定分母事件，Bayes/全概率要说明完备事件组。",
        "数字特征题从定义出发，再用线性性、独立性或协方差公式化简。",
        "统计推断题写清样本、统计量、分布、拒绝域或置信区间含义。"
      ],
      trigger: "条件概率、独立性、联合密度、卷积、期望方差、估计检验",
      examSteps: ["写事件/密度", "画区域", "条件化", "积分或求和", "解释结论"],
      exampleProblem: "概率题最先写什么，才能避免套错公式？",
      exampleSolution: ["先写清随机变量和事件，不要直接套结果。", "连续型先画区域，二维分布题尤其要先定积分边界。", "若用了独立性，必须在解答中明确说明。"]
    },
    general: {
      proofTitle: "证明路线：定义、条件、变形",
      proofSteps: [
        "先写出公式成立的对象、定义域和必要条件。",
        "从定义或教材标准公式出发，用代数变形把题目化成已知形式。",
        "中途每一步只使用允许的恒等变形、极限、求导、积分或线性变换。",
        "最后补充边界、符号、常数、单位或特殊情形。"
      ],
      trigger: "题目结构与本卡标题、标签或条件明显对应",
      examSteps: ["对照条件", "写标准式", "代入化简", "检查边界", "写结论"],
      exampleProblem: "什么时候可以把本公式作为考场主方法？",
      exampleSolution: ["题目关键词匹配本卡触发条件。", "变量范围和适用条件全部满足。", "使用后能明显减少计算量，并且结论可回代检查。"]
    }
  };

  function buildStudyLayer(card) {
    const kind = classify(card);
    const profile = profiles[kind] || profiles.general;
    const title = compact(card.title, "本公式");
    const rawProof = compact(card.miniProof, "从定义或标准公式出发，通过等价变形得到。");
    const rawExample = compact(card.example, "先判断条件，再代入公式并检查结果。");
    const rawUse = compact(card.howToUse, profile.trigger);
    const rawMistake = compact(card.mistakes, "条件不满足时不要硬套。");

    return {
      kind,
      proofTitle: profile.proofTitle,
      proofCore: `本卡“${title}”的已有来源是：${short(rawProof, 110)}。考场证明不需要写成教材长证明，但必须交代“从哪里来、用了什么条件、为什么能化简”。`,
      proofSteps: profile.proofSteps,
      usageTitle: "使用场景：什么时候想到它",
      triggers: [profile.trigger, rawUse].filter(Boolean),
      examSteps: profile.examSteps,
      exampleTitle: "例题拆解：把小例子写成步骤",
      exampleProblem: `${profile.exampleProblem}（本卡例子：${short(rawExample, 96)}）`,
      exampleSolution: profile.exampleSolution,
      checklistTitle: "检查清单：写完后必须确认",
      checklist: [
        `条件：${short(card.conditions, 92)}`,
        `易错：${short(rawMistake, 92)}`,
        "结论：把符号、区间、常数、维数或概率范围补完整。"
      ]
    };
  }

  const api = { classify, buildStudyLayer };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.FORMULA_STUDY_LAYER = api;
})(typeof window !== "undefined" ? window : globalThis);
