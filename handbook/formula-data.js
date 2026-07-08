const raw = String.raw;

const repairInlineLatex = (value) => {
  const text = String(value ?? "")
    .replace(/\u000crac/g, "\\frac")
    .replace(/\u0008ar/g, "\\bar")
    .replace(/\u0009heta/g, "\\theta")
    .replace(/\u0009an/g, "\\tan")
    .replace(/\u0009o/g, "\\to")
    .replace(/\u0009ext/g, "\\text")
    .replace(/\u000barphi/g, "\\varphi")
    .replace(/\u000bec/g, "\\vec")
    .replace(/\u000dight/g, "\\right");

  const repairMath = (math) => math.replace(
    /(?<![\\A-Za-z])(operatorname|arcsin|arccos|arctan|arccot|sinh|cosh|tanh|sech|csch|iiint|iint|oint|sqrt|frac|binom|cdots|cdot|Rightarrow|Leftarrow|Leftrightarrow|Delta|Omega|alpha|beta|gamma|lambda|sigma|theta|varphi|varepsilon|pi|infty|sin|cos|tan|cot|sec|csc|ln|log|exp|lim|sum|prod|int|le|ge|ne|to|sim|pm|mp|times|perp|partial|nabla|bar|hat|tilde|overline|text|begin|end)(?=[A-Za-z0-9_\s^({|,\\/+*=-]|$)/g,
    "\\$1"
  );

  return text.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `\\(${repairMath(math)}\\)`)
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `\\[${repairMath(math)}\\]`);
};

window.FORMULA_SOURCE_REFERENCES = [
  {
    title: "高等数学（第七版）上下册·同济大学数学系·高等教育出版社",
    usage: "用于对齐高等数学章节结构。",
    url: "https://abook.hep.com.cn/39663/"
  },
  {
    title: "工程数学 线性代数 第七版·同济大学数学系·高等教育出版社",
    usage: "用于对齐线性代数章节结构。",
    url: "https://www.hep.com.cn/book/show/ea81ec46-0250-40bc-846c-9b9f5f3f62ae"
  },
  {
    title: "概率论与数理统计 第五版·高等教育出版社",
    usage: "用于对齐概率统计常见章节与公式范围。",
    url: "https://abook.hep.com.cn/12349710"
  },
  {
    title: "全国硕士研究生招生考试数学考试大纲·高等教育出版社",
    usage: "用于核对考研数学一范围；年份变化以当年正式大纲为准。",
    url: "https://xuanshu.hep.com.cn/front/book/findBookDetails?bookId=5f0752d5b0b2bda7c523ccdf"
  },
  {
    title: "Wikipedia: List of trigonometric identities",
    usage: "用于交叉核对三角恒等式、诱导公式、和差化积与积化和差。",
    url: "https://en.wikipedia.org/wiki/List_of_trigonometric_identities"
  },
  {
    title: "Wikipedia: Taylor series",
    usage: "用于交叉核对常见函数 Maclaurin 展开与主项法。",
    url: "https://en.wikipedia.org/wiki/Taylor_series"
  },
  {
    title: "Wikipedia: Small-angle approximation",
    usage: "用于交叉核对小角近似、误差阶和弧度制限制。",
    url: "https://en.wikipedia.org/wiki/Small-angle_approximation"
  },
  {
    title: "Wikipedia: Hyperbolic functions",
    usage: "用于交叉核对双曲函数定义、恒等式与三角类比。",
    url: "https://en.wikipedia.org/wiki/Hyperbolic_functions"
  },
  {
    title: "DLMF §4.21 Trigonometric Identities",
    usage: "用于交叉核对三角恒等式、平方乘积公式与倍角公式。",
    url: "https://dlmf.nist.gov/4.21"
  },
  {
    title: "DLMF §5.12 Beta Function",
    usage: "用于交叉核对 Beta/Gamma 关系与相关积分形式。",
    url: "https://dlmf.nist.gov/5.12"
  },
  {
    title: "NIST/SEMATECH e-Handbook: Gallery of Distributions",
    usage: "用于交叉核对常见概率分布名称与统计分布范围。",
    url: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda366.htm"
  }
];

const C = (id, subject, chapter, section, title, latex, importance, tags, conditions, intuition, howToUse, miniProof, example, mistakes, interactiveType = "none", relatedFormulas = []) => ({
  id, subject, chapter, section, title: repairInlineLatex(title), latex, importance, tags,
  conditions: repairInlineLatex(conditions),
  intuition: repairInlineLatex(intuition),
  howToUse: repairInlineLatex(howToUse),
  miniProof: repairInlineLatex(miniProof),
  example: repairInlineLatex(example),
  mistakes: repairInlineLatex(mistakes),
  interactiveType, relatedFormulas
});

window.FORMULA_CARDS = [
  C("pre-algebra-identities", "前置基础", "0. 前置基础", "代数", "常用代数恒等式", raw`
(a\pm b)^2=a^2\pm2ab+b^2,\quad a^2-b^2=(a-b)(a+b)
\\
a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2),\quad
a^n-b^n=(a-b)\sum_{k=0}^{n-1}a^{n-1-k}b^k
`, "必背", ["代数", "基础", "因式分解"], "多项式化简、极限有理化、积分拆项都经常用。", "它们是把复杂式子变成可约、可消、可比较主项的工具。", "遇到根式差、幂差、分式复杂项，先想能否拆因式或有理化。", "直接展开左右两边即可验证；幂差可用等比数列求和理解。", "求 \\(\\lim_{x\\to1}\\frac{x^3-1}{x-1}\\)，拆成 \\((x-1)(x^2+x+1)\\)，极限为 3。", "不要只会展开，不会反向因式分解；考研题更常需要“拆”。"),

  C("pre-sum-series", "前置基础", "0. 前置基础", "数列求和", "常见求和公式", raw`
\sum_{k=1}^{n}k=\frac{n(n+1)}2,\quad
\sum_{k=1}^{n}k^2=\frac{n(n+1)(2n+1)}6,\quad
\sum_{k=1}^{n}k^3=\left[\frac{n(n+1)}2\right]^2
\\
\sum_{k=0}^{n}q^k=\frac{1-q^{n+1}}{1-q},\quad
\sum_{k=0}^{\infty}q^k=\frac1{1-q}\ (|q|<1)
`, "必背", ["数列", "级数", "基础"], "数列极限、级数、概率期望都会用。", "求和公式是把离散累加变成闭式表达，方便再取极限。", "看到 \\(\\sum k,\\sum k^2\\) 或等比结构，先套公式再化简。", "等差求和可首尾配对；等比求和可用 \\((1-q)S\\) 错位相减。", "\\(\\frac1{n^3}\\sum_{k=1}^{n}k^2\\to \\frac13\\)。", "等比无穷和必须有 \\(|q|<1\\)。"),

  C("pre-trig-core", "前置基础", "0. 前置基础", "三角函数", "三角函数核心公式", raw`
\sin^2x+\cos^2x=1,\quad 1+\tan^2x=\sec^2x
\\
\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta
\\
\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta
\\
\tan(\alpha\pm\beta)=\frac{\tan\alpha\pm\tan\beta}{1\mp\tan\alpha\tan\beta}
`, "必背", ["三角", "基础", "和差角"], "三角极限、积分、Fourier 和空间几何都需要。", "和差角公式本质上是单位圆旋转后的坐标变换。", "遇到 \\(x\\pm a\\)、\\(2x\\)、三角乘积，先把角度统一。", "可由旋转矩阵或欧拉公式 \\(e^{ix}=\\cos x+i\\sin x\\) 推出。", "\\(\\sin(x+\\pi/2)=\\cos x\\)。", "符号最容易错，尤其 \\(\\cos(\\alpha+\\beta)\\) 是减号。", "unit-circle"),

  C("pre-trig-product-sum", "前置基础", "0. 前置基础", "三角变形", "积化和差与和差化积", raw`
\sin A\cos B=\frac12[\sin(A+B)+\sin(A-B)]
\\
\cos A\cos B=\frac12[\cos(A+B)+\cos(A-B)]
\\
\sin A\sin B=\frac12[\cos(A-B)-\cos(A+B)]
\\
\sin A+\sin B=2\sin\frac{A+B}{2}\cos\frac{A-B}{2}
\\
\cos A+\cos B=2\cos\frac{A+B}{2}\cos\frac{A-B}{2}
`, "常用", ["三角", "积化和差", "和差化积", "Fourier"], "三角积分、Fourier 级数、波形叠加题常用。", "乘积变和差可以降低积分难度；和差变乘积可以看零点和振幅。", "三角函数相乘积分时优先积化和差；三角函数相加求零点时优先和差化积。", "由和差角公式相加相减得到。", "\\(\\int\\sin3x\\cos xdx=\\frac12\\int(\\sin4x+\\sin2x)dx\\)。", "别把 \\(\\sin A\\sin B\\) 的两个 cos 顺序写反。", "trig-transform-lab"),

  C("pre-trig-universal", "前置基础", "0. 前置基础", "三角代换", "万能公式", raw`
t=\tan\frac{x}{2},\quad
\sin x=\frac{2t}{1+t^2},\quad
\cos x=\frac{1-t^2}{1+t^2},\quad
dx=\frac{2}{1+t^2}dt
`, "技巧", ["三角", "积分", "万能代换", "冷门技巧"], "三角有理式积分，如 \\(R(\\sin x,\\cos x)\\)。", "把三角函数全部变成有理函数，牺牲复杂度换来统一套路。", "看到三角有理式不好直接凑微分时使用。", "由半角正切和 \\(\\sin x=2\\sin(x/2)\\cos(x/2)\\) 推出。", "\\(\\int \\frac{dx}{1+\\sin x}\\) 可用万能代换化为有理式积分。", "会让式子变长；能用简单恒等变形时不要先上万能代换。"),

  C("pre-inequalities", "前置基础", "0. 前置基础", "不等式", "常用不等式", raw`
|a+b|\le |a|+|b|,\quad
\frac{a+b}{2}\ge\sqrt{ab}\ (a,b\ge0)
\\
\left(\sum a_i^2\right)\left(\sum b_i^2\right)\ge\left(\sum a_ib_i\right)^2
\\
\ln(1+x)<x\ (x>-1,x\ne0)
`, "常用", ["不等式", "证明", "极限"], "证明题、估值、夹逼和概率不等式都用。", "不等式是把不好算的对象夹在好算对象之间。", "看到证明大小关系、收敛估计、误差估计，先找常用不等式。", "均值不等式可由 \\((\\sqrt a-\\sqrt b)^2\\ge0\\) 得到。", "证明 \\(\\ln(1+x)<x\\) 可设 \\(f=x-\\ln(1+x)\\)，导数为 \\(x/(1+x)\\)。", "注意条件；比如均值不等式要求非负。"),

  C("calc1-equivalent-infinitesimal", "高等数学", "第1章 函数与极限", "等价无穷小", "常用等价无穷小全表", raw`
x\to0:\quad
\sin x\sim x,\quad \tan x\sim x,\quad \arcsin x\sim x,\quad \arctan x\sim x
\\
1-\cos x\sim \frac{x^2}{2},\quad
e^x-1\sim x,\quad
\ln(1+x)\sim x
\\
a^x-1\sim x\ln a,\quad
(1+x)^\alpha-1\sim \alpha x
\\
\sqrt{1+x}-1\sim \frac{x}{2}
`, "必背", ["极限", "等价无穷小", "高数上"], "只在同一极限过程下，且主要用于乘除结构。", "等价无穷小就是“在极限眼里长得一样”的小量。", "先识别小量，再替换乘除主因子；加减结构要用 Taylor 找主项。", "例如 \\(\\sin x/x\\to1\\)，所以 \\(\\sin x\\) 与 \\(x\\) 比值趋于 1。", "\\(\\lim_{x\\to0}\\frac{1-\cos x}{x^2}=1/2\\)。", "加减中乱替换最危险，如 \\(\\sin x-x\\) 不能直接替换成 0。", "equivalent-compare", ["calc1-taylor-principal"]),

  C("calc1-important-limits", "高等数学", "第1章 函数与极限", "重要极限", "两个重要极限与指数型极限", raw`
\lim_{x\to0}\frac{\sin x}{x}=1,\quad
\lim_{x\to\infty}\left(1+\frac1x\right)^x=e
\\
\lim_{x\to0}(1+x)^{1/x}=e,\quad
\lim_{x\to0}\frac{e^x-1}{x}=1,\quad
\lim_{x\to0}\frac{\ln(1+x)}x=1
`, "必背", ["极限", "重要极限"], "三角小角、指数对数小量题。", "这几个极限是等价无穷小和指数型极限的源头。", "遇到 \\(1^\\infty\\) 型，常取对数转成 \\(e^{\\lim v\\ln u}\\)。", "由几何夹逼可证 \\(\\sin x/x\\to1\\)，自然常数定义给出第二个。", "\\((1+2x)^{1/x}\\to e^2\\)。", "底数要趋于 1，指数要趋于无穷，才是标准 \\(1^\\infty\\)。", "limit-slider"),

  C("calc1-taylor-principal", "高等数学", "第1章 函数与极限", "Taylor主项", "极限中的 Taylor 主项法", raw`
e^x=1+x+\frac{x^2}{2}+\frac{x^3}{6}+o(x^3)
\\
\sin x=x-\frac{x^3}{6}+o(x^3),\quad
\cos x=1-\frac{x^2}{2}+\frac{x^4}{24}+o(x^4)
\\
\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}+o(x^3)
`, "技巧", ["极限", "Taylor", "主项"], "用于加减抵消、等价无穷小不够用的题。", "Taylor 主项法就是把函数拆成“最先不为 0 的幂次”。", "先展开到抵消后第一个非零项，再比较同阶。", "Taylor 公式给出局部多项式近似；极限只关心最低非零阶。", "\\(\\sin x-x\\sim -x^3/6\\)。", "展开阶数不够会误判 0；展开太多则浪费时间。", "taylor-order-lab", ["calc3-taylor"]),

  C("calc2-derivative-table", "高等数学", "第2章 导数与微分", "导数表", "基本导数公式表", raw`
(x^\alpha)'=\alpha x^{\alpha-1},\quad
(e^x)'=e^x,\quad
(a^x)'=a^x\ln a
\\
(\ln x)'=\frac1x,\quad
(\sin x)'=\cos x,\quad
(\cos x)'=-\sin x
\\
(\tan x)'=\sec^2x,\quad
(\arcsin x)'=\frac1{\sqrt{1-x^2}},\quad
(\arctan x)'=\frac1{1+x^2}
`, "必背", ["导数", "基础"], "用于所有求导题、导数应用、积分反查和微分方程。尤其适合先识别外层基本函数，再用四则、复合、反函数和隐函数求导法则组合。", "导数表是微分计算的乘法表：基本函数的变化率背熟后，复杂函数只是在外层函数和内层函数之间传递变化率。", "先判断是否是基本函数，再看是否有复合层。形如 \\(f(g(x))\\) 必须乘 \\(g'(x)\\)；指数对数题先化简底数和定义域，反三角函数注意对应根式分母。", "由导数定义和反函数求导可推出多数公式。", "\\((\\ln(1+x^2))'=2x/(1+x^2)\\)。", "最常错的是链式法则漏乘内层导数、\\((\\ln|x|)'=1/x\\) 的定义域、\\(\\arccos x\\) 导数带负号，以及 \\(a^x\\) 要多乘 \\(\\ln a\\)。", "tangent-line"),

  C("calc2-rules", "高等数学", "第2章 导数与微分", "求导法则", "复合、隐函数、参数方程求导", raw`
(fg)'=f'g+fg',\quad
\left(\frac fg\right)'=\frac{f'g-fg'}{g^2}
\\
(f(g(x)))'=f'(g(x))g'(x)
\\
F(x,y)=0\Rightarrow y'=-\frac{F_x}{F_y}
\\
\frac{dy}{dx}=\frac{dy/dt}{dx/dt}
`, "必背", ["导数", "隐函数", "参数方程"], "复合函数、隐函数、参数曲线切线。", "核心思想：所有变量变化都要沿着依赖关系传递。", "先画依赖链；隐函数对 x 求导时别忘 y 是函数。", "隐函数公式由全微分 \\(F_xdx+F_ydy=0\\) 得到。", "若 \\(x=t^2,y=t^3\\)，则 \\(dy/dx=3t^2/(2t)=3t/2\\)。", "参数方程二阶导必须再除以 \\(dx/dt\\)。", "tangent-line"),

  C("calc2-high-order", "高等数学", "第2章 导数与微分", "高阶导", "常见高阶导公式", raw`
(e^{ax})^{(n)}=a^ne^{ax}
\\
(\sin ax)^{(n)}=a^n\sin\left(ax+\frac{n\pi}{2}\right)
\\
(\ln x)^{(n)}=(-1)^{n-1}\frac{(n-1)!}{x^n}
\\
(uv)^{(n)}=\sum_{k=0}^{n}C_n^ku^{(k)}v^{(n-k)}
`, "常用", ["导数", "高阶导", "Leibniz"], "高阶导计算、Taylor 展开。", "高阶导常靠周期规律和 Leibniz 公式降维。", "指数三角先找周期，乘积高阶用 Leibniz。", "Leibniz 公式就是乘积求导法则重复 n 次后的组合结果。", "\\((x^2e^x)^{(n)}=e^x[x^2+2nx+n(n-1)]\\)。", "组合数下标和零阶导项容易漏。"),

  C("calc3-mvt", "高等数学", "第3章 微分中值定理与导数应用", "中值定理", "三大微分中值定理", raw`
Rolle:\ f(a)=f(b)\Rightarrow \exists \xi:\ f'(\xi)=0
\\
Lagrange:\ \exists \xi:\ f'(\xi)=\frac{f(b)-f(a)}{b-a}
\\
Cauchy:\ \exists \xi:\frac{f'(\xi)}{g'(\xi)}=\frac{f(b)-f(a)}{g(b)-g(a)}
`, "必背", ["中值定理", "证明"], "证明存在性、不等式和单调性。", "中值定理把区间整体变化压缩到某一点的导数。", "证明题先检查连续、可导、端点条件，再构造辅助函数。", "Rolle 是 Lagrange 的特殊形式；Cauchy 是两个函数同步比较。", "证明 \\(e^b-e^a=e^\\xi(b-a)\\)。", "定理条件漏检会直接失分。"),

  C("calc3-lhopital", "高等数学", "第3章 微分中值定理与导数应用", "洛必达", "洛必达法则", raw`
\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}
\quad \text{适用于 } \frac00,\frac{\infty}{\infty}\text{ 型并满足条件}
`, "常用", ["极限", "洛必达"], "未定式极限。", "洛必达是用导数比较两个函数趋近 0 或无穷的速度。", "先确认未定式，再求导；非商式先转商式。", "可由 Cauchy 中值定理证明。", "\\(\\lim_{x\\to0}\\frac{e^x-1}{x}=\\lim e^x/1=1\\)。", "不是未定式不能用；反复求导会越算越复杂时应换 Taylor。"),

  C("calc3-taylor", "高等数学", "第3章 微分中值定理与导数应用", "Taylor", "Taylor 公式", raw`
f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k+R_n(x)
\\
\text{Peano余项：}\quad R_n=o((x-x_0)^n)
`, "必背", ["Taylor", "极限", "近似"], "极限、近似、证明不等式。", "Taylor 是用多项式替代局部函数。", "极限用 Peano，估计误差用 Lagrange 余项。", "逐次匹配函数在 \\(x_0\\) 处的函数值和各阶导数。", "\\(e^{0.01}\\approx1+0.01+0.00005\\)。", "展开中心不能弄错；\\(x\\to0\\) 才用 Maclaurin。", "taylor-plot"),

  C("calc3-monotone-convex", "高等数学", "第3章 微分中值定理与导数应用", "导数应用", "单调、凹凸、极值判别", raw`
f'(x)>0\Rightarrow f\text{增},\quad f'(x)<0\Rightarrow f\text{减}
\\
f''(x)>0\Rightarrow \text{凹向上},\quad f''(x)<0\Rightarrow \text{凹向下}
\\
f'(x_0)=0,\ f''(x_0)>0\Rightarrow x_0\text{极小}
`, "必背", ["导数应用", "极值", "凹凸"], "用于函数单调区间、极值最值、凹凸性、拐点和不等式证明。闭区间最值题必须同时检查端点、驻点和不可导点。", "一阶导数给出函数向上或向下走的方向，二阶导数给出斜率是在变大还是变小；极值通常发生在变化方向可能切换的点。", "先找定义域，再找驻点和不可导点，最后看端点。", "若 \\(f'(x)>0\\)，由拉格朗日中值定理，任意 \\(x_1<x_2\\) 有 \\(f(x_2)-f(x_1)=f'(\\xi)(x_2-x_1)>0\\)，故函数递增。二阶导数判凹凸则是把同样思想用于 \\(f'\\) 的单调性。", "\\(x^2\\) 在 0 处 \\(f'=0,f''=2>0\\)，极小。", "极值点可能不可导，例如尖点；驻点也不一定是极值点。拐点要求凹凸性改变，不是简单看二阶导数等于 0。闭区间最值不要漏端点。"),

  C("calc4-basic-integrals", "高等数学", "第4章 不定积分", "积分表", "基本不定积分表", raw`
\int x^\alpha dx=\frac{x^{\alpha+1}}{\alpha+1}+C,\quad
\int\frac{dx}{x}=\ln|x|+C
\\
\int e^x dx=e^x+C,\quad
\int \sin xdx=-\cos x+C,\quad
\int\cos xdx=\sin x+C
\\
\int\frac{dx}{1+x^2}=\arctan x+C,\quad
\int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C
`, "必背", ["积分", "不定积分"], "用于不定积分、定积分、微分方程和反查导数。套表前要先确认被积函数是否能通过常数倍、线性换元或简单拆项化成基本表形式。", "积分表是导数表反过来。", "先看能否直接套表，再考虑换元或分部。", "基本积分表本质上是导数表的反向使用：若 \\(F'(x)=f(x)\\)，则 \\(\\int f(x)dx=F(x)+C\\)。复合形式还要乘内层导数，缺少内层导数时通常通过换元补齐。", "\\(\\int 2x/(1+x^2)dx=\\ln(1+x^2)+C\\)。", "不定积分必须写 \\(+C\\)。\\(\\int dx/x=\\ln|x|+C\\) 适用于正负区间，不能写成 \\(\\ln x\\) 后忽略定义域。反三角积分要检查分母形式和常数系数。"),

  C("calc4-methods", "高等数学", "第4章 不定积分", "积分方法", "换元与分部积分", raw`
\int f(\varphi(x))\varphi'(x)dx=\int f(u)du
\\
\int u\,dv=uv-\int v\,du
`, "必背", ["积分", "换元", "分部"], "绝大多数不定积分。", "换元处理复合，分部处理乘积。", "看到内层导数在旁边用换元；看到一乘一导用分部。", "换元来自链式法则；分部来自乘积求导。", "\\(\\int xe^x dx=xe^x-\\int e^xdx=(x-1)e^x+C\\)。", "分部选 \\(u\\) 要越求导越简单。", "integral-method-picker"),

  C("calc4-euler-substitution", "高等数学", "第4章 不定积分", "冷门技巧", "Euler 代换", raw`
\sqrt{ax^2+bx+c}\text{ 型积分，可令 }
\sqrt{ax^2+bx+c}=\sqrt a\,x+t
\text{ 等方式有理化}
`, "拓展", ["积分", "Euler代换", "冷门技巧"], "含二次根式且普通三角/双曲代换不顺时。", "Euler 代换的目标是把根式变成有理式。", "考研中会认即可；优先尝试配方、三角代换、分部。", "把根式设成线性表达，平方后可解出 x 与 t 的有理关系。", "\\(\\int R(x,\\sqrt{x^2+1})dx\\) 可令 \\(\\sqrt{x^2+1}=x+t\\)。", "代换类型多，盲用会变复杂；只作为备选武器。"),

  C("calc5-definite-properties", "高等数学", "第5章 定积分", "定积分性质", "定积分基础性质与变上限", raw`
\int_a^b f(x)dx=F(b)-F(a)
\\
\frac{d}{dx}\int_a^x f(t)dt=f(x)
\\
\frac{d}{dx}\int_{\alpha(x)}^{\beta(x)}f(t)dt=f(\beta)\beta'-f(\alpha)\alpha'
`, "必背", ["定积分", "变上限"], "定积分计算、函数构造、证明。", "定积分把局部函数累积成整体，变上限再对累积求导会回到原函数。", "遇到积分定义的新函数，优先求导降维。", "微积分基本定理说明求导与积分互逆。", "\\(F(x)=\\int_0^{x^2}\\sin tdt\\Rightarrow F'=2x\\sin x^2\\)。", "复合上限别漏乘导数。", "riemann-sum"),

  C("calc5-symmetry-pairing", "高等数学", "第5章 定积分", "技巧", "定积分对称与区间配对", raw`
\int_{-a}^{a}f(x)dx=0\ (f\text{奇})
\\
\int_{-a}^{a}f(x)dx=2\int_0^a f(x)dx\ (f\text{偶})
\\
\int_0^a f(x)dx=\int_0^a f(a-x)dx
\\
f(x)+f(a-x)=C\Rightarrow \int_0^a f(x)dx=\frac{aC}{2}
`, "技巧", ["定积分", "对称", "区间配对"], "选择填空里的定积分快速计算。", "配对就是把区间左右两端的信息合起来看。", "看到 \\(0\\) 到 \\(a\\)、\\(-a\\) 到 \\(a\\) 或 \\(f(x)+f(a-x)\\) 先想对称。", "令 \\(u=a-x\\) 即可得到配对公式。", "\\(\\int_0^{\\pi/2}\\frac{dx}{1+\\tan x}=\\pi/4\\)。", "函数必须在对应区间可积；别把非对称区间硬套奇偶性。"),

  C("calc5-improper-gamma-beta", "高等数学", "第5章 定积分", "反常积分", "反常积分、Gamma 与 Beta", raw`
\int_1^\infty\frac{dx}{x^p}\text{收敛}\iff p>1,\quad
\int_0^1\frac{dx}{x^p}\text{收敛}\iff p<1
\\
\Gamma(\alpha)=\int_0^\infty x^{\alpha-1}e^{-x}dx,\quad
\Gamma(\alpha+1)=\alpha\Gamma(\alpha)
\\
B(p,q)=\frac{\Gamma(p)\Gamma(q)}{\Gamma(p+q)}
`, "技巧", ["反常积分", "Gamma", "Beta", "冷门技巧"], "反常积分判敛、高次积分和概率分布。", "Gamma 是阶乘的连续化，Beta 是两段幂函数积分的统一写法。", "考研中先掌握 p 积分判别；Beta/Gamma 用于高次幂积分和冷门技巧。", "Gamma 递推由分部积分得到。", "\\(\\Gamma(4)=3!=6\\)。", "参数必须满足收敛条件，如 \\(\\alpha>0\\)。"),

  C("calc6-applications", "高等数学", "第6章 定积分应用", "几何物理应用", "面积、体积、弧长公式", raw`
A=\int_a^b|f(x)-g(x)|dx,\quad
V=\int_a^b A(x)dx
\\
V=\pi\int_a^b(R^2-r^2)dx,\quad
s=\int_a^b\sqrt{1+(y')^2}dx
\\
A_{\text{polar}}=\frac12\int_\alpha^\beta r^2(\theta)d\theta
`, "常用", ["定积分应用", "面积", "体积"], "几何应用题。", "所有应用题都是“微元累加”。", "先画图，确定微元方向，再写被积表达。", "由微元面积/体积求和取极限得到。", "绕 x 轴旋转 \\(y=x,0<x<1\\)，体积 \\(\\pi\\int_0^1x^2dx=\\pi/3\\)。", "上下函数、旋转轴和半径最容易看错。", "riemann-sum"),

  C("calc7-ode-first-order", "高等数学", "第7章 微分方程", "一阶方程", "一阶微分方程通法", raw`
\frac{dy}{dx}=f(x)g(y)\Rightarrow \int\frac{dy}{g(y)}=\int f(x)dx
\\
y'+P(x)y=Q(x)\Rightarrow
y=e^{-\int Pdx}\left[\int Qe^{\int Pdx}dx+C\right]
\\
y'+P(x)y=Q(x)y^n,\ z=y^{1-n}
`, "必背", ["微分方程", "一阶线性"], "一阶 ODE 求通解、特解。", "先识别类型，再套对应模板。", "可分离就分离；线性方程直接积分因子；Bernoulli 先换元。", "一阶线性公式来自乘以积分因子 \\(e^{\\int Pdx}\\)。", "\\(y'+y=e^x\\Rightarrow y=Ce^{-x}+e^x/2\\)。", "别把齐次方程 \\(y'=F(y/x)\\) 和线性齐次混淆。"),

  C("calc7-ode-second-order", "高等数学", "第7章 微分方程", "高阶线性", "常系数线性微分方程", raw`
y''+py'+qy=f(x),\quad r^2+pr+q=0
\\
r_1\ne r_2:\ y=C_1e^{r_1x}+C_2e^{r_2x}
\\
r_1=r_2=r:\ y=(C_1+C_2x)e^{rx}
\\
r=\alpha\pm i\beta:\ y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)
`, "必背", ["微分方程", "特征方程"], "常系数二阶方程。", "特征方程把求函数变成求代数根。", "先解齐次，再找非齐次特解，最后叠加。", "因为 \\(e^{rx}\\) 代入后能提出公共因子。", "\\(y''-y=0\\Rightarrow r=\\pm1,y=C_1e^x+C_2e^{-x}\\)。", "非齐次特解若与齐次重复，要乘 \\(x^k\\)。"),

  C("calc8-vector-geometry", "高等数学", "第8章 向量代数与空间解析几何", "空间几何", "向量、平面、直线公式", raw`
\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta,\quad
\vec a\times\vec b=
\begin{vmatrix} \vec i&\vec j&\vec k\\a_1&a_2&a_3\\b_1&b_2&b_3 \end{vmatrix}
\\
A(x-x_0)+B(y-y_0)+C(z-z_0)=0
\\
\frac{x-x_0}{l}=\frac{y-y_0}{m}=\frac{z-z_0}{n}
`, "必背", ["空间几何", "向量"], "空间直线、平面、距离夹角。", "空间题的核心是找方向向量和法向量。", "先确定点，再确定向量，最后写方程。", "点积来自投影，叉积方向垂直且模长为平行四边形面积。", "过点 \\((1,0,0)\\) 法向量 \\((1,2,3)\\) 的平面为 \\((x-1)+2y+3z=0\\)。", "方向向量和法向量别混。"),

  C("calc9-multivariable-derivative", "高等数学", "第9章 多元函数微分法及应用", "多元微分", "偏导、全微分、梯度", raw`
dz=f_xdx+f_ydy,\quad
\frac{\partial z}{\partial u}=f_xx_u+f_yy_u
\\
\nabla f=(f_x,f_y,f_z),\quad
\frac{\partial f}{\partial l}=\nabla f\cdot \vec e
\\
F(x,y,z)=0\Rightarrow z_x=-\frac{F_x}{F_z},\ z_y=-\frac{F_y}{F_z}
`, "必背", ["多元微分", "梯度", "方向导数"], "多元求导、切平面、方向导数。", "梯度指向函数增大最快的方向。", "先求偏导，再按链式结构乘对应导数。", "全微分把多方向的小变化线性叠加。", "\\(f=x^2+y^2\\)，在 \\((1,1)\\) 梯度为 \\((2,2)\\)。", "偏导时只让一个变量变，其余暂作常量。"),

  C("calc9-lagrange", "高等数学", "第9章 多元函数微分法及应用", "条件极值", "Lagrange 乘子法", raw`
\nabla f=\lambda\nabla g,\quad g(x,y,z)=0
\\
\nabla f=\lambda\nabla g+\mu\nabla h
`, "常用", ["多元微分", "极值", "Lagrange"], "条件极值、几何最值。", "在约束曲面上取极值时，目标函数梯度与约束法向同方向。", "写目标函数和约束，列梯度方程，联立求候选点。", "极值点处沿约束可行方向的一阶变化为 0。", "求 \\(x^2+y^2\\) 在 \\(x+y=1\\) 上最小，得 \\(x=y=1/2\\)。", "别忘代回约束；多个候选点要比较。"),

  C("calc10-multiple-integrals", "高等数学", "第10章 重积分", "重积分", "重积分换元与坐标公式", raw`
\iint_D f(x,y)dxdy,\quad x=r\cos\theta,\ y=r\sin\theta,\ dxdy=rdrd\theta
\\
dV=rdrd\theta dz\quad(\text{柱坐标})
\\
dV=\rho^2\sin\varphi\,d\rho d\varphi d\theta\quad(\text{球坐标})
\\
dxdy=\left|\frac{\partial(x,y)}{\partial(u,v)}\right|dudv
`, "必背", ["重积分", "换元", "Jacobi"], "二重、三重积分计算。", "换坐标的本质是面积/体积微元被拉伸，Jacobi 描述拉伸倍率。", "先画区域，再选坐标系；圆形用极坐标，球体用球坐标。", "极坐标微元来自小扇形面积近似 \\(rdrd\\theta\\)。", "\\(\\iint_{x^2+y^2\\le1}1dxdy=\\int_0^{2\\pi}\\int_0^1rdrd\\theta=\\pi\\)。", "最常漏乘极坐标的 \\(r\\)。"),

  C("calc11-vector-calculus", "高等数学", "第11章 曲线积分与曲面积分", "三大公式", "Green、Gauss、Stokes 公式", raw`
\oint_L Pdx+Qdy=\iint_D(Q_x-P_y)dxdy
\\
\iint_{\partial\Omega}\vec F\cdot\vec n\,dS=\iiint_\Omega \nabla\cdot\vec F\,dV
\\
\oint_{\partial\Sigma}\vec F\cdot d\vec r=\iint_\Sigma(\nabla\times\vec F)\cdot\vec n\,dS
`, "必背", ["曲线积分", "曲面积分", "Green", "Gauss", "Stokes"], "线积分、通量、环流计算。", "三大公式都在做一件事：把边界上的累积转成区域内部的变化。", "先判断积分类型和方向，再看是否满足公式条件。", "Green 是二维 Stokes；Gauss 是通量和散度的关系。", "\\(\\oint_L -ydx+xdy=2A\\)，所以面积 \\(A=\\frac12\\oint xdy-ydx\\)。", "方向/取向是第一易错点。"),

  C("calc12-series-tests", "高等数学", "第12章 无穷级数", "级数判别", "常数项级数判别法", raw`
\sum\frac1{n^p}\text{收敛}\iff p>1
\\
\rho=\lim\left|\frac{u_{n+1}}{u_n}\right|:\ \rho<1\text{收敛},\ \rho>1\text{发散}
\\
\rho=\lim\sqrt[n]{|u_n|}:\ \rho<1\text{收敛},\ \rho>1\text{发散}
\\
u_n\downarrow0\Rightarrow \sum(-1)^{n-1}u_n\text{收敛}
`, "必背", ["级数", "判别法"], "用于常数项级数敛散判断，尤其正项级数、交错级数、任意项级数和含阶乘、幂、指数、对数的级数。第一步要先看通项是否趋于 0。", "级数是否收敛取决于尾项衰减得够不够快；比较判别把它和熟悉的 p 级数、几何级数比较，比值和根值判别则自动识别阶乘型或指数型衰减。", "先做必要条件 \\(a_n\\to0\\)。正项级数看结构：阶乘/连乘优先比值，\\(n\\) 次方或指数幂优先根值，有理式优先比较或极限比较；交错级数检查单调趋零；任意项先判绝对收敛。", "若 \\(\\lim a_{n+1}/a_n=q<1\\)，则从某项后 \\(a_{n+1}\\le r a_n\\,(q<r<1)\\)，尾部被几何级数控制而收敛；若极限大于 1，通项不趋零或尾项不衰减，级数发散。根值判别同理比较 \\(a_n\\) 与 \\(r^n\\)。", "\\(\\sum n/2^n\\) 用比值判别收敛。", "比值或根值极限等于 1 时判别法失效，要改用比较、Raabe、积分判别、Leibniz 或展开主项。不要忘记交错级数“条件收敛”和“绝对收敛”是两个层级。"),

  C("calc12-power-fourier", "高等数学", "第12章 无穷级数", "幂级数与Fourier", "幂级数展开与 Fourier 系数", raw`
\frac1{1-x}=\sum_{n=0}^{\infty}x^n,\ |x|<1
\\
e^x=\sum_{n=0}^{\infty}\frac{x^n}{n!},\quad
\sin x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n+1}}{(2n+1)!}
\\
f(x)\sim\frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx)
`, "常用", ["幂级数", "Fourier"], "求展开、求和、Fourier 系数。", "幂级数是函数的无限多项式表示，Fourier 是函数的三角波分解。", "幂级数先求半径再验端点；Fourier 先看奇偶性。", "由 Taylor 展开和三角函数正交性得到。", "\\(\\sum x^n/n=-\\ln(1-x)\\)。", "收敛区间端点必须单独检查。"),

  C("linear1-determinant", "线性代数", "第1章 行列式", "行列式", "行列式性质与展开", raw`
|A^T|=|A|,\quad |AB|=|A||B|,\quad |A^{-1}|=\frac1{|A|}
\\
|A|=\sum_{j=1}^{n}a_{ij}A_{ij}
\\
\text{三角矩阵： }|A|=\prod_{i=1}^{n}a_{ii}
`, "必背", ["行列式", "线代"], "用于行列式计算、可逆性判断、线性方程组唯一解、特征多项式、二次型和线性变换面积体积解释。适合先用性质化简，再选展开行列。", "行列式衡量线性变换对面积/体积的缩放。", "优先做行列初等变换：倍加不变、交换变号、提公因子要记录系数；尽量化成上三角或制造一行/列多个零，再按该行/列展开。参数题要保留导致行列式为零的特殊值。", "行列式按行列展开来自多重线性和交错性。", "例如把 \\(\\begin{vmatrix}1&2&3\\\\0&4&5\\\\0&0&6\\end{vmatrix}\\) 看成上三角行列式，值为 \\(1\\cdot4\\cdot6=24\\)。若中途交换两行一次，最后结果还要乘 \\(-1\\)。", "最常见错误是把“某行乘以 \\(k\\) 加到另一行”误认为行列式也乘 \\(k\\)。只有单独把某行乘 \\(k\\) 才会使行列式乘 \\(k\\)；两行成比例则行列式为 0。"),

  C("linear2-matrix-rank", "线性代数", "第2章 矩阵及其运算", "矩阵", "矩阵运算、逆与秩", raw`
(AB)^T=B^TA^T,\quad (AB)^{-1}=B^{-1}A^{-1}
\\
A^{-1}=\frac1{|A|}A^*,\quad AA^*=|A|E
\\
r(AB)\le \min(r(A),r(B))
`, "必背", ["矩阵", "逆矩阵", "秩"], "用于矩阵运算、矩阵方程、逆矩阵、分块矩阵、秩不等式和线性变换复合。需要先确认矩阵阶数相容以及是否存在逆矩阵。", "矩阵乘法代表复合变换，所以顺序不能换。", "解矩阵方程时先看未知矩阵位置：\\(AX=B\\) 左乘 \\(A^{-1}\\)，\\(XA=B\\) 右乘 \\(A^{-1}\\)。秩题优先用初等变换、满秩分解或不等式 \\(r(AB)\\le\\min(r(A),r(B))\\)。", "伴随矩阵满足 \\(A A^*=A^*A=|A|E\\)。当 \\(|A|\\ne0\\) 时，两边除以 \\(|A|\\) 得 \\(A^{-1}=A^*/|A|\\)。这也说明可逆等价于行列式非零、满秩。", "若 \\(AX=B\\)，则 \\(X=A^{-1}B\\)。", "一般 \\(AB\\ne BA\\)，所以移项时不能像普通代数一样乱除。若 \\(A,B\\) 可逆，则 \\((AB)^{-1}=B^{-1}A^{-1}\\)，顺序必须反过来；秩相等也不代表矩阵相等。", "matrix-transform"),

  C("linear3-systems", "线性代数", "第3章 初等变换与线性方程组", "方程组", "秩与线性方程组解结构", raw`
Ax=0:\quad
\text{只有零解}\iff r(A)=n,\quad
\text{有非零解}\iff r(A)<n
\\
Ax=b:\quad
\text{有解}\iff r(A)=r(A|b)
\\
\text{唯一解}\iff r(A)=r(A|b)=n,\quad
\text{无穷多解}\iff r(A)=r(A|b)<n
`, "必背", ["方程组", "秩", "基础解系"], "用于齐次/非齐次线性方程组解的存在性、唯一性、自由变量个数和参数取值讨论。核心对象是系数矩阵 \\(A\\) 与增广矩阵 \\((A|b)\\) 的秩。", "秩告诉你独立方程有多少个，自由变量有多少个。", "先对增广矩阵做初等行变换化阶梯形，分别读出 \\(r(A)\\) 和 \\(r(A|b)\\)。若二者不等则无解；若相等且等于未知数个数则唯一解；若相等但小于未知数个数则无穷多解。", "初等行变换对应对方程做等价变形：交换方程、方程乘非零常数、一个方程加另一个方程的倍数都不改变解集。因此阶梯形方程组与原方程组同解。", "3 个未知数，秩为 2 的齐次方程有 1 个自由变量。", "齐次方程一定有零解，只需看自由变量判断是否有非零解；非齐次方程可能无解，必须比较 \\(r(A)\\) 与 \\(r(A|b)\\)。参数题不要只代一个值，要讨论使主元消失的全部临界值。"),

  C("linear4-vector-group", "线性代数", "第4章 向量组线性相关性", "向量组", "线性相关、秩、基", raw`
\sum_{i=1}^{m}k_i\alpha_i=0
\\
\text{线性无关}\iff k_1=\cdots=k_m=0
\\
m>n\text{ 个 }n\text{维向量必线性相关}
`, "必背", ["向量组", "线性相关", "基"], "用于判断向量组线性相关性、求极大线性无关组、求向量组秩、判断是否构成基，以及讨论解空间维数。考研中常和齐次方程组、矩阵秩、坐标表示一起出现。", "线性相关就是有一个向量能被其他向量凑出来。", "把向量按列排成矩阵，先初等行变换化为阶梯形；主元列对应原向量组的一个极大无关组，非主元列可由主元列线性表示；秩就是主元个数。", "设 \\(k_1\\alpha_1+\\cdots+k_s\\alpha_s=0\\)。若只有零解，则没有向量能由其余向量线性表示，向量组无关；若存在非零解，则至少一个向量可移项表示为其余向量的线性组合。矩阵化后就是齐次方程 \\(Ax=0\\) 的解结构。", "在 \\(\\mathbb R^2\\) 中任取三个向量 \\(\\alpha_1,\\alpha_2,\\alpha_3\\)，矩阵最多只有 2 个主元，所以 \\(Ax=0\\) 至少有 1 个自由变量，存在非零解，故三向量必线性相关。", "不要把“某个向量能由向量组表示”和“向量组线性相关”混为一谈；相关讨论的是组内向量之间是否有非平凡零组合。求极大无关组时，行变换后要回到原矩阵的主元列，不能直接拿化简后的列向量当答案。"),

  C("linear5-eigen-quadratic", "线性代数", "第5章 相似矩阵及二次型", "特征值与二次型", "特征值、对角化、正定", raw`
|A-\lambda E|=0,\quad (A-\lambda E)x=0
\\
B=P^{-1}AP,\quad A=P\Lambda P^{-1}
\\
f=x^TAx,\quad A\text{正定}\iff x^TAx>0\ (x\ne0)
\\
A\text{正定}\iff \lambda_i>0\iff \text{顺序主子式全}>0
`, "必背", ["特征值", "对角化", "二次型", "正定"], "相似对角化、二次型化简、正定判别。", "特征向量是被矩阵拉伸但不改变方向的向量。", "先求特征值，再求特征向量；正定优先用主子式或特征值。", "对角化就是换一组由特征向量构成的坐标轴。", "\\(\\left(\\begin{array}{cc}2&0\\\\0&3\\end{array}\\right)\\) 正定，因为特征值 2,3 都正。", "代数重数不等于几何重数时可能不能对角化。", "matrix-eigen-lab"),

  C("linear6-transform", "线性代数", "第6章 线性空间与线性变换【拓展】", "线性空间", "基、坐标、线性变换", raw`
\alpha=x_1e_1+\cdots+x_ne_n
\\
T(\alpha+\beta)=T\alpha+T\beta,\quad T(k\alpha)=kT\alpha
\\
\dim\ker T+\dim\operatorname{Im}T=\dim V
`, "了解", ["线性空间", "线性变换", "拓展"], "理解矩阵、坐标变换和线性映射。", "矩阵是线性变换在某组基下的坐标表达。", "先判断是否封闭，再谈空间；先选基，再写坐标。", "秩-零度公式说明“被压成 0 的维度”和“留下的维度”相加等于总维度。", "二维投影到 x 轴：像空间维数 1，核空间维数 1。", "基变换矩阵方向很容易反。"),

  C("prob1-probability", "概率论", "第1章 随机事件与概率", "概率公式", "条件概率、全概率、Bayes", raw`
P(A\cup B)=P(A)+P(B)-P(AB)
\\
P(A|B)=\frac{P(AB)}{P(B)},\quad
P(AB)=P(A)P(B|A)
\\
P(A)=\sum_iP(B_i)P(A|B_i)
\\
P(B_i|A)=\frac{P(B_i)P(A|B_i)}{\sum_jP(B_j)P(A|B_j)}
`, "必背", ["概率", "条件概率", "Bayes"], "用于事件概率、条件概率、全概率公式、Bayes 公式和独立性判断。特别适合“先分情况再汇总”或“已知结果反推原因”的题。", "全概率是分情况求总概率，Bayes 是由结果反推原因。", "条件概率先找分母事件；树图能画就画。", "由条件概率 \\(P(A|B)=P(AB)/P(B)\\) 得 \\(P(AB)=P(A|B)P(B)\\)。若 \\(B_i\\) 构成完备事件组，则 \\(A=\\bigcup_i AB_i\\) 且互斥，所以 \\(P(A)=\\sum_iP(A|B_i)P(B_i)\\)。Bayes 公式再把 \\(P(B_j|A)=P(AB_j)/P(A)\\) 代入即可。", "检测阳性后患病概率通常用 Bayes，而不是直接看检测准确率。", "互斥表示不能同时发生，独立表示一个事件发生不改变另一个事件概率，二者不是一回事。用 Bayes 时分母必须是全概率，不能只拿某一个原因的概率作分母。"),

  C("prob2-distributions", "概率论", "第2章 随机变量及其分布", "常见分布", "常见分布公式表", raw`
B(n,p):\ P(X=k)=C_n^kp^k(1-p)^{n-k},\ E=np,\ D=np(1-p)
\\
P(\lambda):\ P(X=k)=e^{-\lambda}\frac{\lambda^k}{k!},\ E=D=\lambda
\\
U(a,b):\ f(x)=\frac1{b-a},\ E=\frac{a+b}{2},\ D=\frac{(b-a)^2}{12}
\\
N(\mu,\sigma^2):\ f(x)=\frac1{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}
`, "必背", ["概率分布", "二项", "泊松", "正态"], "用于随机变量建模、概率计算和常见分布识别。先判断变量是离散还是连续，再根据试验结构选择二项、泊松、几何、正态、指数等分布。", "分布是随机变量取值规律的说明书：离散型给每个点的概率，连续型给密度并通过区间积分得到概率。", "先识别关键词：固定次数独立成功失败用二项，稀有事件计数用泊松，等待时间常用指数，误差和样本均值近似常用正态。再写参数含义和取值范围。", "二项来自 n 次独立 Bernoulli；泊松可看成稀有事件近似。", "十次投篮命中次数可建模为 \\(B(10,p)\\)。", "二项分布要求次数固定且每次成功概率相同；泊松近似要求事件稀有且总体次数大。连续型不能算点概率，正态分布题通常要先标准化。", "distribution-plot"),

  C("prob3-joint-convolution", "概率论", "第3章 多维随机变量", "二维分布", "联合、边缘、条件、卷积", raw`
f_X(x)=\int_{-\infty}^{\infty}f(x,y)dy,\quad
f_{Y|X}(y|x)=\frac{f(x,y)}{f_X(x)}
\\
X,Y\text{独立}\iff f(x,y)=f_X(x)f_Y(y)
\\
f_{X+Y}(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)dx
`, "必背", ["二维分布", "卷积", "独立性"], "二维随机变量、和的分布。", "边缘分布就是把另一个变量“积分掉”；卷积就是所有和为 z 的组合概率累加。", "先画区域，再求边缘；和的分布优先卷积。", "卷积来自 \\(P(z<X+Y<z+dz)\\) 对所有拆分方式求和。", "两个独立均匀 \\(U(0,1)\\) 的和是三角形密度。", "边缘积分上下限由区域决定，不能机械写无穷。", "distribution-plot"),

  C("prob4-expectation-variance", "概率论", "第4章 数字特征", "数字特征", "期望、方差、协方差", raw`
E(X)=\sum x_ip_i\quad\text{或}\quad E(X)=\int_{-\infty}^{\infty}xf(x)dx
\\
D(X)=E(X^2)-[E(X)]^2
\\
\operatorname{Cov}(X,Y)=E(XY)-EXEY
\\
D(X+Y)=D(X)+D(Y)+2\operatorname{Cov}(X,Y)
`, "必背", ["期望", "方差", "协方差"], "数字特征计算。", "期望是平均位置，方差是波动大小，协方差是一起变的趋势。", "先用线性性拆期望，再用 \\(E(X^2)-E^2X\\) 算方差。", "方差公式由平方展开得到。", "若独立，\\(D(X+Y)=D(X)+D(Y)\\)。", "不相关不一定独立；独立才保证协方差为 0。"),

  C("prob5-clt", "概率论", "第5章 大数定律与中心极限定理", "极限定理", "大数定律与中心极限定理", raw`
P(|X-\mu|\ge \varepsilon)\le \frac{\sigma^2}{\varepsilon^2}
\\
\bar X \xrightarrow{P}\mu
\\
\frac{\sum_{i=1}^{n}X_i-n\mu}{\sigma\sqrt n}\Rightarrow N(0,1)
\\
\frac{X-np}{\sqrt{np(1-p)}}\approx N(0,1)
`, "必背", ["大数定律", "中心极限定理", "正态近似"], "样本均值、二项正态近似。", "大数定律说平均会稳定，中心极限定理说大量小随机量的和会像正态。", "看到 n 大、求和/均值概率，先标准化。", "标准化把均值移到 0、方差缩到 1。", "\\(B(100,0.5)\\) 可用正态近似。", "二项正态近似常要连续性修正。", "clt-demo"),

  C("prob6-sampling", "概率论", "第6章 数理统计基本概念", "抽样分布", "正态总体抽样分布", raw`
\bar X\sim N\left(\mu,\frac{\sigma^2}{n}\right)
\\
\frac{(n-1)S^2}{\sigma^2}\sim\chi^2(n-1)
\\
\frac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)
\\
\frac{X/m}{Y/n}\sim F(m,n)
`, "必背", ["抽样分布", "统计量", "t分布"], "区间估计、假设检验。", "抽样分布是统计推断的桥梁。", "正态总体下，均值走 Z/t，方差走 \\(\\chi^2\\)，方差比走 F。", "由标准正态平方和定义 \\(\\chi^2\\)，再构造 t 和 F。", "未知方差估计均值时用 t 分布。", "自由度最容易写错，样本方差通常是 n-1。"),

  C("prob7-estimation", "概率论", "第7章 参数估计", "参数估计", "矩估计、极大似然、置信区间", raw`
\text{矩估计：样本矩}=\text{总体矩}
\\
L(\theta)=\prod_{i=1}^{n}f(x_i;\theta),\quad \frac{d}{d\theta}\ln L(\theta)=0
\\
\bar X\pm z_{\alpha/2}\frac{\sigma}{\sqrt n},\quad
\bar X\pm t_{\alpha/2}(n-1)\frac{S}{\sqrt n}
`, "常用", ["参数估计", "MLE", "置信区间"], "用于根据样本估计总体未知参数，包括矩估计、极大似然估计、估计量性质和置信区间。做题前要分清参数、统计量、估计值和样本容量。", "矩估计是让样本矩模拟总体矩，极大似然是选择最能解释当前样本的参数；置信区间则给出一套随机区间构造方法，使长期覆盖率达到指定置信水平。", "矩估计先写总体矩；MLE 先写似然再取对数求导。", "MLE 选择让当前样本出现概率最大的参数。", "若总体正态且 \\(\\sigma^2\\) 未知，则 \\((\\bar X-\\mu)/(S/\\sqrt n)\\sim t(n-1)\\)，所以 \\(\\mu\\) 的 \\(1-\\alpha\\) 置信区间为 \\(\\bar X\\pm t_{\\alpha/2}(n-1)S/\\sqrt n\\)。", "MLE 求导前通常先取对数；参数范围不能忘，端点也可能取最大值。置信度不是“参数落入区间的概率”，频率学派下参数固定，随机的是区间。"),

  C("prob8-testing", "概率论", "第8章 假设检验", "假设检验", "常见检验统计量", raw`
Z=\frac{\bar X-\mu_0}{\sigma/\sqrt n},\quad
T=\frac{\bar X-\mu_0}{S/\sqrt n}\sim t(n-1)
\\
\chi^2=\frac{(n-1)S^2}{\sigma_0^2},\quad
F=\frac{S_1^2}{S_2^2}
`, "常用", ["假设检验", "统计推断"], "用于单总体均值、双总体均值、方差、比例等参数的显著性检验。使用前要确认总体分布、样本量、方差是否已知、单侧还是双侧、显著性水平 \\(\\alpha\\)。", "假设检验就是看样本结果是否离原假设太远。", "四步：写假设、选统计量、定拒绝域、下结论。", "检验统计量的构造原则是：在 \\(H_0\\) 成立时，它的分布完全已知或近似已知。若样本结果落入小概率区域，就认为“在原假设下太反常”，从而拒绝 \\(H_0\\)。", "例如总体正态、\\(\\sigma^2\\) 未知，检验 \\(H_0:\\mu=\\mu_0\\)。统计量 \\(T=(\\bar X-\\mu_0)/(S/\\sqrt n)\\sim t(n-1)\\)。若双侧检验且 \\(|T|>t_{\\alpha/2}(n-1)\\)，拒绝 \\(H_0\\)。", "先根据备择假设确定拒绝域方向：\\(H_1:\\mu>\\mu_0\\) 看右尾，\\(H_1:\\mu<\\mu_0\\) 看左尾，\\(H_1:\\mu\\ne\\mu_0\\) 才看双尾。不要把“接受 \\(H_0\\)”写成“证明 \\(H_0\\) 正确”，检验只能说证据不足以拒绝。", "probability-distribution-lab"),

  C("pre-exp-log", "前置基础", "0. 前置基础", "指数对数", "指数对数与幂函数速查", raw`
a^x=e^{x\ln a}\ (a>0),\quad \log_a x=\frac{\ln x}{\ln a}
\\
\ln xy=\ln x+\ln y,\quad \ln x^\alpha=\alpha\ln x
\\
(1+x)^\alpha=1+\alpha x+\frac{\alpha(\alpha-1)}2x^2+o(x^2)
`, "必背", ["指数", "对数", "幂函数", "Taylor"], "极限、求导、概率密度变换里非常常见。", "指数对数互为逆运算，复杂幂指式常用取对数降维。", "遇到变量在指数上，先取对数；遇到 \\((1+x)^\\alpha\\) 近 1，想二项式展开。", "由 \\(a^x=e^{x\\ln a}\\) 和 Taylor 展开得到。", "\\((1+3x)^{2/x}=\\exp\\{\\frac2x\ln(1+3x)\\}\\to e^6\\)。", "取对数前要保证底数为正；复合极限不能只看外层。"),

  C("pre-trig-double-half", "前置基础", "0. 前置基础", "三角全表", "倍角、半角、降幂与辅助角", raw`
\sin2x=2\sin x\cos x,\quad \cos2x=\cos^2x-\sin^2x=1-2\sin^2x=2\cos^2x-1
\\
\sin^2x=\frac{1-\cos2x}{2},\quad \cos^2x=\frac{1+\cos2x}{2}
\\
\tan2x=\frac{2\tan x}{1-\tan^2x}
\\
a\sin x+b\cos x=\sqrt{a^2+b^2}\sin(x+\varphi),\quad \tan\varphi=\frac{b}{a}
`, "必背", ["三角", "倍角", "半角", "降幂", "辅助角"], "三角极限、三角积分、最值和 Fourier 都会用。", "倍角/降幂是在角度与次数之间换挡；辅助角把两个波合成一个波。", "高次三角积分先降幂；\\(a\\sin x+b\\cos x\\) 求最值先辅助角。", "倍角由和角公式取 \\(A=B=x\\)；降幂由 \\(\\cos2x\\) 反解。", "\\(3\sin x+4\cos x=5\sin(x+\varphi)\\)，最大值为 5。", "辅助角象限要由 \\(a,b\\) 同时确定，不能只看 \\(\\tan\\varphi\\)。", "unit-circle"),

  C("pre-inverse-trig", "前置基础", "0. 前置基础", "反三角函数", "反三角函数常用关系", raw`
\arcsin x+\arccos x=\frac{\pi}{2}\quad(-1\le x\le1)
\\
\arctan x+\arctan\frac1x=
\begin{cases}
\frac{\pi}{2},&x>0\\
-\frac{\pi}{2},&x<0
\end{cases}
\\
\arctan x\sim x\quad(x\to0)
`, "常用", ["反三角", "极限", "积分"], "反三角求导、积分结果化简和极限。", "反三角函数是把角度从函数值里解出来，主值区间决定符号。", "出现 \\(1+x^2\\)、\\(\\sqrt{1-x^2}\\) 的积分结果常含反三角。", "由正弦余弦互余角关系和反函数定义得到。", "\\(\\int\\frac{dx}{1+x^2}=\\arctan x+C\\)。", "反三角函数有主值范围，不能随意加减 \\(\\pi\\)。"),

  C("calc1-sequence-limits", "高等数学", "第1章 函数与极限", "数列极限", "数列极限常用夹逼与 Stolz 思想", raw`
a_n\le b_n\le c_n,\quad a_n,c_n\to A\Rightarrow b_n\to A
\\
\frac{a_1+\cdots+a_n}{n}\to A\quad(a_n\to A)
\\
\text{若 }b_n\uparrow\infty,\quad
\lim\frac{a_n-a_{n-1}}{b_n-b_{n-1}}=L\Rightarrow \lim\frac{a_n}{b_n}=L
`, "技巧", ["数列极限", "夹逼", "Stolz"], "数列平均、递推估计、求和型极限。", "数列题常把复杂项夹住，或把累计量变成差分量。", "看到 \\(\\sum\\) 与 \\(n^p\\) 比值，可尝试 Stolz/积分比较/已知求和。", "夹逼来自极限保序；Stolz 是离散版洛必达思想。", "\\(\\frac1n\\sum_{k=1}^n\\frac{k}{n}\\to\\int_0^1x\\,dx=1/2\\)。", "Stolz 要求分母单调趋于无穷，别把它当普通洛必达乱用。"),

  C("calc1-squeeze-template", "高等数学", "第1章 函数与极限", "数列极限", "夹逼准则与常用上下界", raw`
0\le f(x)\le g(x),\quad g(x)\to0\Rightarrow f(x)\to0
\\
|f(x)|\le g(x),\quad g(x)\to0\Rightarrow f(x)\to0
\\
\sin x\le x\le \tan x\quad(0<x<\frac{\pi}{2})
`, "必背", ["极限", "夹逼", "估计"], "极限估值、证明收敛、三角小角。", "夹逼不是硬算，而是把目标压进一个已知收敛的盒子里。", "遇到震荡、绝对值、三角小角和带根式估计时先想夹逼。", "由单调有界或极限保序得到。", "\\(0\\le 1-\\cos x\\le x^2/2\\) 可直接夹出二阶小量。", "上下界必须都能趋同一个极限，否则夹逼没法收口。", "limit-slider"),

  C("calc1-limit-method-selection", "高等数学", "第1章 函数与极限", "方法选择", "洛必达、等价无穷小与 Taylor 的选型", raw`
\frac{0}{0},\ \frac{\infty}{\infty}\Rightarrow \text{先看能否直接化简，再考虑洛必达}
\\
\text{乘除型小量：优先等价无穷小}
\\
\text{加减抵消型：优先 Taylor 主项}
\\
\text{多次重复洛必达时，先问自己能不能一眼展开}
`, "必背", ["极限", "洛必达", "Taylor", "等价无穷小"], "考场极限方法选择。", "方法不是越高级越好，而是越贴合结构越好。", "乘除结构先等价，抵消结构先展开，分式未定式再考虑洛必达。", "洛必达本质上是比较函数变化率，Taylor 本质上是比较主项。", "\\(\\frac{\\sin x-x}{x^3}\\) 用 Taylor，比反复洛必达更稳。", "别把所有极限都往洛必达上推，很多题展开更快更准。", "limit-slider"),

  C("calc2-differential-approx", "高等数学", "第2章 导数与微分", "微分近似", "微分、线性近似与误差", raw`
dy=f'(x)dx,\quad
f(x+\Delta x)=f(x)+f'(x)\Delta x+o(\Delta x)
\\
\Delta y=f(x+\Delta x)-f(x),\quad \Delta y-dy=o(\Delta x)
`, "常用", ["微分", "近似", "误差"], "近似计算、证明局部线性化、误差估计。", "可微意味着函数在很小范围内像一条直线。", "看到“小增量”“近似值”，用 \\(f(a+h)\approx f(a)+f'(a)h\\)。", "Taylor 公式保留一次项就是微分近似。", "\\(\\sqrt{4.04}\\approx2+\frac1{4}\cdot0.04=2.01\\)。", "微分近似只适合小增量；增量大时误差可能明显。", "tangent-line"),

  C("calc2-inverse-derivative", "高等数学", "第2章 导数与微分", "反函数求导", "反函数与反三角求导", raw`
(f^{-1})'(y)=\frac1{f'(x)}\quad(y=f(x),\ f'(x)\ne0)
\\
(\arcsin x)'=\frac1{\sqrt{1-x^2}},\quad
(\arccos x)'=-\frac1{\sqrt{1-x^2}}
\\
(\arctan x)'=\frac1{1+x^2}
`, "必背", ["导数", "反函数", "反三角"], "反三角导数、隐函数和参数方程求导。", "反函数求导就是把斜率倒过来。", "遇到 \\(y=f^{-1}(x)\\)，先写 \\(x=f(y)\\) 再对 x 求导。", "由 \\(f(f^{-1}(y))=y\\) 两边求导得到。", "若 \\(y=\arcsin x\\)，则 \\(x=\sin y\\)，\\(dy/dx=1/\\cos y=1/\\sqrt{1-x^2}\\)。", "根号符号由反三角主值区间决定。"),

  C("calc3-asymptote-curvature", "高等数学", "第3章 微分中值定理与导数应用", "曲线性态", "渐近线、曲率与曲率半径", raw`
\text{水平渐近线：}\lim_{x\to\infty}f(x)=b
\\
\text{斜渐近线：}a=\lim_{x\to\infty}\frac{f(x)}x,\quad b=\lim_{x\to\infty}[f(x)-ax]
\\
\kappa=\frac{|y''|}{(1+y'^2)^{3/2}},\quad \rho=\frac1{\kappa}
`, "常用", ["导数应用", "渐近线", "曲率"], "函数图形综合、曲线弯曲程度。", "渐近线描述远处贴近哪条线，曲率描述局部弯得多厉害。", "作图题按定义域、单调、极值、凹凸、渐近线顺序查。", "斜渐近线来自 \\(f(x)=ax+b+o(1)\\)。", "\\(y=\\sqrt{x^2+1}\\) 有斜渐近线 \\(y=x\\)（\\(x\\to+\\infty\\)）。", "左右无穷处的斜渐近线可能不同，要分开算。"),

  C("calc4-partial-fractions", "高等数学", "第4章 不定积分", "有理函数积分", "有理函数部分分式分解", raw`
\frac{P(x)}{Q(x)}=\text{多项式}+\sum\frac{A}{x-a}+\sum\frac{B}{(x-a)^k}
\\
\frac{Mx+N}{x^2+px+q}\quad(\Delta<0)
`, "常用", ["积分", "有理函数", "部分分式"], "有理函数积分、Laplace 反变换式结构识别。", "部分分式就是把复杂分母拆成基本积木。", "先长除化真分式，再按分母因式类型设分子。", "多项式整除和待定系数保证恒等分解。", "\\(\\frac1{x^2-1}=\\frac12\\left(\\frac1{x-1}-\\frac1{x+1}\\right)\\)。", "不可约二次因式的分子要设一次式，不要只设常数。"),

  C("calc4-trig-integrals", "高等数学", "第4章 不定积分", "三角积分", "三角积分套路表", raw`
\int\sin^m x\cos^n x\,dx:
\\
\text{奇次留一个凑微分；偶次用降幂}
\\
\int\tan^m x\sec^n x\,dx:
\text{偶 sec 留 }\sec^2x,\ \text{奇 sec tan 留 }\sec x\tan x
`, "技巧", ["积分", "三角积分", "降幂"], "三角函数高次幂积分。", "三角积分的核心是“留一个导数，剩下统一变量”。", "看到奇次幂先留一个；全偶次优先降幂。", "来自 \\(d\\sin x=\\cos xdx\\)、\\(d\\tan x=\\sec^2xdx\\) 与恒等式。", "\\(\\int\sin^3x\cos^2xdx\\)，留 \\(\\sin xdx\\)，把 \\(\\sin^2x=1-\cos^2x\\)。", "不要在偶次幂题里硬凑微分，通常会绕远。"),

  C("calc5-integral-mvt", "高等数学", "第5章 定积分", "积分中值", "积分中值定理与平均值", raw`
\int_a^b f(x)\,dx=f(\xi)(b-a)\quad(f\text{连续})
\\
\int_a^b f(x)g(x)\,dx=f(\xi)\int_a^b g(x)\,dx\quad(g\ge0,\ f\text{连续})
\\
\bar f=\frac1{b-a}\int_a^b f(x)\,dx
`, "常用", ["定积分", "中值定理", "平均值"], "证明存在性、估计积分范围。", "积分中值定理说连续函数在区间上的平均高度等于某一点高度。", "看到证明存在 \\(\\xi\\) 使积分等于某形式，先想积分中值。", "由连续函数介值性和积分夹逼 \\(m(b-a)\le\int f\le M(b-a)\\) 得到。", "\\(\\int_0^1 e^x dx=e^\\xi\\)，其中 \\(0<\\xi<1\\)。", "第二中值形式要求权函数不变号或满足相应单调条件。", "riemann-sum"),

  C("calc5-improper-tests", "高等数学", "第5章 定积分", "反常积分判敛", "反常积分比较、p 判别与绝对收敛", raw`
\int_1^\infty \frac{dx}{x^p}\text{ 收敛}\iff p>1
\\
\int_0^1 \frac{dx}{x^p}\text{ 收敛}\iff p<1
\\
0\le f\le g,\ \int g\text{收敛}\Rightarrow \int f\text{收敛}
\\
\int |f|\text{收敛}\Rightarrow \int f\text{收敛}
`, "必背", ["反常积分", "判敛", "p积分"], "反常积分敛散性、级数比较迁移。", "反常积分先看奇点在哪里，再和 p 型标准样本比较。", "无穷远看衰减速度；有限奇点看爆炸阶数。", "p 判别由直接积分 \\(x^{-p}\\) 得到。", "\\(\\int_0^1\\frac{\ln x}{\sqrt x}dx\\) 收敛，因为对数弱于幂。", "不要只看函数趋于 0；趋于 0 不保证无穷积分收敛。"),

  C("calc6-centroid-work", "高等数学", "第6章 定积分应用", "物理应用", "质心、功、水压力", raw`
\bar x=\frac1A\int_a^b x[f(x)-g(x)]dx,\quad
\bar y=\frac1{2A}\int_a^b[f^2(x)-g^2(x)]dx
\\
W=\int_a^b F(x)\,dx,\quad
F_{\text{液}}=\rho g\int h(y)w(y)\,dy
`, "了解", ["定积分应用", "质心", "功", "水压力"], "应用题、几何物理背景题。", "定积分应用都是把“微小量”累加起来。", "先取微元：薄片面积、微小功、微小压力，再积分。", "质心公式来自一阶矩除以总量。", "弹簧功 \\(W=\\int_0^a kx\,dx=ka^2/2\\)。", "物理量维度要一致，水压力深度方向别取反。"),

  C("calc7-ode-special", "高等数学", "第7章 微分方程", "特殊方程", "Bernoulli、可降阶与欧拉方程", raw`
y'+P(x)y=Q(x)y^n\quad(n\ne0,1),\ z=y^{1-n}
\\
y''=f(x,y'):\ p=y'\Rightarrow p'=f(x,p)
\\
x^2y''+axy'+by=0,\ y=x^r
`, "技巧", ["微分方程", "Bernoulli", "可降阶", "Euler方程"], "非标准但可套路化的微分方程。", "这些题的共同点是通过换元降阶或变成线性方程。", "识别幂次非线性想 Bernoulli；缺 y 或缺 x 时想降阶。", "Bernoulli 两边除以 \\(y^n\\)，令 \\(z=y^{1-n}\\) 即线性化。", "\\(y'+y=xy^2\\) 令 \\(z=1/y\\)，得到 \\(z'-z=-x\\)。", "换元后别忘了把最终答案换回原变量。"),

  C("calc8-distance-angle", "高等数学", "第8章 向量代数与空间解析几何", "距离夹角", "空间距离与夹角公式", raw`
d(P,\pi)=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}
\\
d(P,L)=\frac{|(P-P_0)\times s|}{|s|}
\\
\cos\angle(\pi_1,\pi_2)=\frac{|n_1\cdot n_2|}{|n_1||n_2|}
\\
d(L_1,L_2)=\frac{|(P_2-P_1)\cdot(s_1\times s_2)|}{|s_1\times s_2|}
`, "必背", ["空间几何", "距离", "夹角"], "空间解析几何综合题。", "空间几何大多是在法向量、方向向量和投影之间切换。", "面看法向量，线看方向向量；距离先判断点线面类型。", "点到平面距离来自向法向量投影；异面直线距离来自混合积体积。", "两平面垂直等价于 \\(n_1\\cdot n_2=0\\)。", "夹角题要分清线线、线面、面面，取补角规则不同。"),

  C("calc9-hessian-extreme", "高等数学", "第9章 多元函数微分法及应用", "多元极值", "Hessian 二阶判别法", raw`
A=f_{xx}(x_0,y_0),\quad B=f_{xy}(x_0,y_0),\quad C=f_{yy}(x_0,y_0)
\\
\Delta=AC-B^2
\\
\Delta>0,A>0:\text{极小};\quad \Delta>0,A<0:\text{极大};\quad \Delta<0:\text{鞍点}
`, "必背", ["多元微分", "Hessian", "极值"], "二元函数无约束极值。", "Hessian 判别的是临界点附近像碗、山顶还是马鞍。", "先解 \\(f_x=f_y=0\\)，再代入二阶偏导判别。", "Taylor 二阶项的二次型正负决定局部形状。", "\\(f=x^2+y^2\\) 在原点 \\(A=C=2,B=0\\)，极小。", "\\(\\Delta=0\\) 时判别失效，需要换方法。", "matrix-transform"),

  C("calc10-coordinate-systems", "高等数学", "第10章 重积分", "坐标系", "极、柱、球坐标换元", raw`
\text{极坐标： }x=r\cos\theta,\ y=r\sin\theta,\ dA=r\,drd\theta
\\
\text{柱坐标： }x=r\cos\theta,\ y=r\sin\theta,\ z=z,\ dV=r\,drd\theta dz
\\
\text{球坐标： }x=\rho\sin\varphi\cos\theta,\ y=\rho\sin\varphi\sin\theta,\ z=\rho\cos\varphi,\ dV=\rho^2\sin\varphi\,d\rho d\varphi d\theta
`, "必背", ["重积分", "极坐标", "柱坐标", "球坐标", "Jacobi"], "圆域、球域、旋转体区域积分。", "坐标换元就是选更贴合区域形状的尺子，Jacobi 是尺子的面积/体积缩放。", "圆用极坐标，柱面对称用柱坐标，球面对称用球坐标。", "Jacobi 行列式给出微元缩放因子。", "\\(\\iint_{x^2+y^2\le1}(x^2+y^2)dA=\\int_0^{2\\pi}\\int_0^1 r^2 r\,drd\\theta=\\pi/2\\)。", "球坐标角度定义要统一，别漏 \\(\\sin\\varphi\\)。"),

  C("calc11-line-surface-types", "高等数学", "第11章 曲线积分与曲面积分", "积分类型", "第一/第二型曲线曲面积分速辨", raw`
\int_L f\,ds,\quad \int_L Pdx+Qdy+Rdz
\\
\iint_\Sigma f\,dS,\quad \iint_\Sigma Pdydz+Qdzdx+Rdxdy
\\
dS=\sqrt{1+z_x^2+z_y^2}\,dxdy
`, "必背", ["曲线积分", "曲面积分", "第一型", "第二型"], "线面积分计算和三大公式前置识别。", "第一型是按长度/面积加权，第二型是沿方向或通量加权。", "无方向通常第一型，有 \\(dx,dy,dydz\\) 等通常第二型。", "参数化后第一型乘速度长度，第二型代入微分方向。", "\\(z=f(x,y)\\) 上第一型曲面积分常化为 \\(\\iint_D f\\sqrt{1+z_x^2+z_y^2}dxdy\\)。", "第二型最怕方向错，必须看正向、外侧、上侧等描述。"),

  C("calc12-radius-abel", "高等数学", "第12章 无穷级数", "幂级数", "收敛半径、端点与 Abel 定理", raw`
\sum a_n(x-x_0)^n,\quad
R=\frac1{\limsup\sqrt[n]{|a_n|}}
\\
\text{若 }\lim\left|\frac{a_{n+1}}{a_n}\right|=\rho,\quad R=\frac1{\rho}
\\
\text{幂级数在收敛区间内可逐项求导/积分}
`, "必背", ["幂级数", "收敛半径", "Abel"], "幂级数展开、求和函数、端点判别。", "收敛半径只管离中心多远，端点要单独审判。", "先求 R，再逐个检查两个端点。", "根值/比值判别给出关于 \\(|x-x_0|\\) 的不等式。", "\\(\\sum x^n/n\\) 的 R=1，端点 x=1 发散，x=-1 收敛。", "端点不能由半径直接决定，必须代回原级数。"),

  C("linear1-adjugate-cramer", "线性代数", "第1章 行列式", "伴随与 Cramer", "伴随矩阵、逆矩阵与 Cramer 法则", raw`
A A^*=A^*A=|A|E
\\
|A|\ne0\Rightarrow A^{-1}=\frac{A^*}{|A|}
\\
A x=b,\ |A|\ne0\Rightarrow x_i=\frac{|A_i(b)|}{|A|}
`, "必背", ["行列式", "伴随矩阵", "Cramer", "逆矩阵"], "求逆、解小型线性方程组、证明题。", "伴随矩阵把行列式展开信息打包成矩阵。", "二三阶矩阵可用伴随求逆；理论题常用 \\(AA^*=|A|E\\)。", "伴随矩阵的元素是代数余子式转置，乘回去只剩行列式。", "若 \\(|A|=2\\)，则 \\(|A^{-1}|=1/2\\)。", "Cramer 只适用于方阵且 \\(|A|\ne0\\)，大规模计算不推荐。"),

  C("linear2-rank-inequalities", "线性代数", "第2章 矩阵及其运算", "秩公式", "秩的不等式与分块公式", raw`
r(A+B)\le r(A)+r(B)
\\
r(AB)\le \min\{r(A),r(B)\}
\\
r(A)+r(B)-n\le r(AB)\quad(A_{m\times n},B_{n\times s})
\\
r\left(\begin{array}{cc}A&0\\0&B\end{array}\right)=r(A)+r(B)
`, "常用", ["矩阵", "秩", "不等式"], "秩证明、线性方程组解空间维数。", "秩是线性信息量，乘法不会凭空增加信息。", "证明秩关系时想列空间包含、初等变换或 Sylvester 不等式。", "由线性映射像空间维数和核空间关系可解释。", "若 A 可逆，则 \\(r(AB)=r(B)\\)。", "矩阵尺寸要匹配；不要把所有不等式都当等式。"),

  C("linear3-solution-criteria", "线性代数", "第3章 初等变换与线性方程组", "解的判定", "齐次/非齐次方程组完整判定", raw`
Ax=0:\quad \text{非零解}\iff r(A)<n,\quad \dim N(A)=n-r(A)
\\
Ax=b:\quad \text{有解}\iff r(A)=r(A,b)
\\
\text{唯一解}\iff r(A)=r(A,b)=n,\quad
\text{无穷多解}\iff r(A)=r(A,b)<n
`, "必背", ["方程组", "秩", "基础解系"], "线性方程组大题核心。", "秩决定约束数量，自由变量数量就是解空间自由度。", "先增广矩阵化阶梯形，再看主元列和自由变量。", "Rouché-Capelli 定理把方程组相容性转化为秩相等。", "三元齐次方程组秩为 2，则基础解系含 1 个向量。", "非齐次有解时通解=一个特解+对应齐次通解。"),

  C("linear4-orthogonal-projection", "线性代数", "第4章 向量组线性相关性", "正交化", "Gram-Schmidt 与正交投影", raw`
\beta_k=\alpha_k-\sum_{i=1}^{k-1}\frac{(\alpha_k,\beta_i)}{(\beta_i,\beta_i)}\beta_i
\\
\operatorname{proj}_{u}v=\frac{v\cdot u}{u\cdot u}u
\\
Q^TQ=E,\quad \|Qx\|=\|x\|
`, "常用", ["向量组", "正交化", "投影", "正交矩阵"], "正交基、最小二乘、正交对角化。", "正交化就是不断减去已有方向上的影子。", "要求标准正交基时先正交化再单位化。", "投影公式来自把误差向量设为与方向向量垂直。", "\\((1,1),(1,0)\\) 正交化后第二个向量减去在第一个上的投影。", "Gram-Schmidt 顺序会影响中间结果，但张成空间不变。"),

  C("linear5-inertia-canonical", "线性代数", "第5章 相似矩阵及二次型", "二次型", "合同标准形、惯性定理与正定判别全表", raw`
f=x^TAx\overset{\text{合同}}{\longrightarrow} d_1y_1^2+\cdots+d_ny_n^2
\\
\text{正惯性指数、负惯性指数在合同变换下不变}
\\
A\succ0\iff \lambda_i>0\iff \Delta_k>0\ (k=1,\dots,n)
\\
A\succeq0\iff \lambda_i\ge0\iff \text{所有主子式}\ge0
`, "必背", ["二次型", "合同", "惯性定理", "正定"], "二次型化标准形、正定/半正定判别。", "二次型分类本质是看不同方向上平方项的正负号。", "实对称矩阵优先正交对角化；正定用顺序主子式最快。", "合同变换对应可逆线性换元，不改变正负平方项个数。", "\\(x^2+2y^2-3z^2\\) 的正惯性指数为 2，负惯性指数为 1。", "正定看顺序主子式；半正定要看所有主子式，不能只看顺序。", "matrix-transform"),

  C("linear5-spectral", "线性代数", "第5章 相似矩阵及二次型", "正交对角化", "实对称矩阵谱定理", raw`
A=A^T\Rightarrow \exists Q^TQ=E,\quad Q^TAQ=\Lambda
\\
\lambda_i\ne\lambda_j\Rightarrow \xi_i\perp\xi_j
\\
A^k=Q\Lambda^kQ^T
`, "常用", ["特征值", "实对称矩阵", "正交对角化"], "二次型、矩阵高次幂、正定判别。", "实对称矩阵有一组互相垂直的特征方向。", "遇到实对称矩阵，先求特征值，再把特征向量正交单位化。", "谱定理保证不同特征值特征向量正交，同一特征空间可正交化。", "正交矩阵对角化后，二次型直接变成 \\(\\lambda_i y_i^2\\)。", "普通矩阵不一定能正交对角化，别把谱定理泛化。", "matrix-transform"),

  C("prob1-independent-events", "概率论", "第1章 随机事件与概率", "独立性", "事件独立、互斥与 Bernoulli 概型", raw`
A,B\text{独立}\iff P(AB)=P(A)P(B)
\\
A,B\text{互斥}\iff AB=\varnothing
\\
P(\text{n 次独立重复中恰 k 次成功})=\binom nk p^k(1-p)^{n-k}
`, "必背", ["概率", "独立性", "互斥", "Bernoulli"], "古典概型、二项分布基础。", "独立是不互相影响，互斥是不能同时发生；这俩不是一回事。", "看到重复试验、每次成功概率相同，直接想 Bernoulli/二项。", "独立定义就是联合概率可拆成乘积。", "投 10 次硬币恰 3 次正面概率为 \\(\\binom{10}{3}2^{-10}\\)。", "互斥且概率都非零时不独立，因为交集概率为 0。"),

  C("prob2-transform-density", "概率论", "第2章 随机变量及其分布", "变量变换", "一维随机变量函数分布", raw`
Y=g(X),\quad F_Y(y)=P(g(X)\le y)
\\
\text{若 }g\text{单调可导},\quad f_Y(y)=f_X(g^{-1}(y))\left|\frac{d}{dy}g^{-1}(y)\right|
\\
F_X(x)=\int_{-\infty}^{x}f_X(t)dt
`, "必背", ["随机变量", "密度变换", "分布函数"], "函数分布、概率密度换元。", "求函数分布先回到事件，再把事件翻译成 X 的范围。", "单调时可直接用密度换元；非单调时分段求和。", "密度公式就是积分换元里的 Jacobi 绝对值。", "若 \\(Y=X^2\\)，要分 \\(X=\\pm\\sqrt y\\) 两支。", "非单调函数不能只取一个反函数分支。", "distribution-plot"),

  C("prob3-independence-moments", "概率论", "第3章 多维随机变量", "独立与相关", "随机变量独立、协方差与相关系数", raw`
X,Y\text{独立}\iff f_{X,Y}(x,y)=f_X(x)f_Y(y)
\\
\operatorname{Cov}(X,Y)=E(XY)-EX\,EY
\\
\rho_{XY}=\frac{\operatorname{Cov}(X,Y)}{\sqrt{DX}\sqrt{DY}},\quad |\rho|\le1
`, "必背", ["二维分布", "独立性", "协方差", "相关系数"], "二维分布、数字特征、线性相关判断。", "协方差看同涨同跌，相关系数是标准化后的协方差。", "判断独立先看联合密度能否拆成边缘乘积且区域也能拆。", "Cauchy-Schwarz 不等式推出 \\(|\\rho|\le1\\)。", "独立则协方差为 0；反过来一般不成立。", "联合密度拆式子不够，还要注意支持区域是否矩形。"),

  C("prob4-generating-functions", "概率论", "第4章 数字特征", "矩与母函数", "矩母函数与常见期望技巧", raw`
M_X(t)=E(e^{tX}),\quad M_X^{(k)}(0)=E(X^k)
\\
X,Y\text{独立}\Rightarrow M_{X+Y}(t)=M_X(t)M_Y(t)
\\
D(X)=E(X^2)-(EX)^2,\quad E[g(X)]=\sum g(x_i)p_i\ \text{或}\ \int g(x)f(x)dx
`, "了解", ["期望", "方差", "矩母函数", "独立和"], "求矩、独立和分布、检验计算结果。", "矩母函数把所有矩藏在一个函数的导数里。", "独立和的分布难卷积时，可以用母函数辅助识别。", "指数展开 \\(e^{tX}=\\sum t^kX^k/k!\\)，求期望后系数就是矩。", "Poisson 的矩母函数为 \\(e^{\\lambda(e^t-1)}\\)，独立和仍是 Poisson。", "矩母函数不一定处处存在，考研中多作辅助理解。"),

  C("prob5-chebyshev-markov", "概率论", "第5章 大数定律与中心极限定理", "概率不等式", "Markov 与 Chebyshev 不等式", raw`
X\ge0:\quad P(X\ge a)\le \frac{EX}{a}
\\
P(|X-EX|\ge \varepsilon)\le \frac{DX}{\varepsilon^2}
\\
P(|\bar X-\mu|\ge\varepsilon)\le \frac{\sigma^2}{n\varepsilon^2}
`, "常用", ["概率不等式", "Chebyshev", "大数定律"], "估计尾概率、证明大数定律。", "概率不等式用有限的均值/方差信息给出粗但稳的上界。", "不知道具体分布但知道方差时，用 Chebyshev。", "Markov 对非负随机变量积分尾部；Chebyshev 对 \\((X-EX)^2\\) 用 Markov。", "若 \\(DX=4\\)，则 \\(P(|X-EX|\ge4)\le1/4\\)。", "界通常很粗，不能当精确概率。", "clt-demo"),

  C("prob6-order-statistics", "概率论", "第6章 数理统计基本概念", "次序统计量", "次序统计量与经验分布", raw`
X_{(1)}\le\cdots\le X_{(n)}
\\
F_{X_{(k)}}(x)=\sum_{j=k}^{n}\binom nj [F(x)]^j[1-F(x)]^{n-j}
\\
f_{X_{(k)}}(x)=\frac{n!}{(k-1)!(n-k)!}[F(x)]^{k-1}[1-F(x)]^{n-k}f(x)
`, "了解", ["数理统计", "次序统计量", "分布函数"], "最大值、最小值、中位数分布。", "第 k 小不超过 x，等价于至少 k 个样本不超过 x。", "最大最小题优先用分布函数：最大全不超过，最小至少一个。", "由二项分布计数“落在 x 左边的样本个数”得到。", "\\(P(X_{(n)}\le x)=F^n(x)\\)。", "连续型公式要乘密度；离散型不直接套密度公式。"),

  C("prob7-estimator-properties", "概率论", "第7章 参数估计", "估计量评价", "无偏性、有效性、一致性", raw`
E(\hat\theta)=\theta\Rightarrow \hat\theta\text{无偏}
\\
D(\hat\theta_1)<D(\hat\theta_2)\Rightarrow \hat\theta_1\text{更有效}
\\
\hat\theta_n\xrightarrow{P}\theta\Rightarrow \hat\theta_n\text{一致}
`, "常用", ["参数估计", "无偏性", "一致性"], "估计量评价、选择题。", "估计量好不好，先看平均是否偏，再看波动是否小，最后看样本变大是否靠近真值。", "给出估计量时，先算期望和方差。", "一致性常由 Chebyshev 或大数定律推出。", "\\(\\bar X\\) 是 \\(\\mu\\) 的无偏且一致估计。", "无偏不代表每次估得准；有效性通常在同类无偏估计中比较。"),

  C("prob8-pvalue-errors", "概率论", "第8章 假设检验", "检验概念", "p 值、两类错误与功效", raw`
\alpha=P(\text{拒绝 }H_0|H_0\text{真})
\\
\beta=P(\text{接受 }H_0|H_1\text{真}),\quad 1-\beta=\text{功效}
\\
p\text{-value}=P_{H_0}(\text{比样本更极端})
`, "了解", ["假设检验", "p值", "两类错误"], "理解假设检验结论、选择题。", "显著性水平控制误杀原假设的概率，p 值衡量样本对原假设有多不友好。", "p 值小于 \\(\\alpha\\) 就拒绝 \\(H_0\\)。", "检验统计量在 \\(H_0\\) 下的尾概率就是 p 值。", "p=0.03，在 \\(\\alpha=0.05\\) 时拒绝，在 \\(\\alpha=0.01\\) 时不拒绝。", "不拒绝 \\(H_0\\) 不等于证明 \\(H_0\\) 为真。"),

  C("pre-complex-euler", "前置基础", "0. 前置基础", "复数与 Euler", "Euler 公式与复数三角", raw`
e^{ix}=\cos x+i\sin x,\quad
\cos x=\frac{e^{ix}+e^{-ix}}2,\quad
\sin x=\frac{e^{ix}-e^{-ix}}{2i}
\\
z=re^{i\theta},\quad z^n=r^ne^{in\theta}
`, "了解", ["复数", "Euler公式", "三角", "Fourier"], "三角恒等式、Fourier 展开、周期函数理解。", "Euler 公式把旋转、三角函数和指数函数接到一起。", "遇到三角乘积、和差角、Fourier 系数时，可以用复指数统一处理。", "由 \\(e^x\\)、\\(\\sin x\\)、\\(\\cos x\\) 的 Taylor 展开比较实虚部得到。", "\\(\\cos3x\\) 可由 \\((\\cos x+i\\sin x)^3\\) 取实部得到。", "考研大题通常不用复数写完整证明，但它适合快速理解和验算。"),

  C("pre-hyperbolic", "前置基础", "0. 前置基础", "双曲函数", "双曲函数与双曲代换", raw`
\sinh x=\frac{e^x-e^{-x}}2,\quad
\cosh x=\frac{e^x+e^{-x}}2,\quad
\cosh^2x-\sinh^2x=1
\\
(\sinh x)'=\cosh x,\quad (\cosh x)'=\sinh x
\\
\sqrt{x^2+a^2}: x=a\sinh t,\quad
\sqrt{x^2-a^2}: x=a\cosh t
`, "拓展", ["双曲函数", "积分", "代换"], "根式积分、曲线参数化和反常积分拓展。", "双曲函数是指数函数组成的“类三角函数”，适合处理 \\(x^2\pm a^2\\)。", "根式含 \\(x^2+a^2\\) 且三角代换很绕时，可以考虑双曲代换。", "恒等式由指数定义直接代入相消得到。", "\\(x=a\sinh t\\) 时 \\(\\sqrt{x^2+a^2}=a\cosh t\\)。", "考研不强制掌握；能用三角代换时优先三角代换，更容易写给阅卷人看。"),

  C("pre-binomial-multinomial", "前置基础", "0. 前置基础", "组合恒等式", "二项式、多项式与常用组合恒等式", raw`
(a+b)^n=\sum_{k=0}^{n}\binom nk a^{n-k}b^k
\\
\sum_{k=0}^{n}\binom nk=2^n,\quad
\sum_{k=0}^{n}k\binom nk=n2^{n-1}
\\
\binom nk=\binom n{n-k},\quad
\binom nk=\binom{n-1}{k}+\binom{n-1}{k-1}
`, "必背", ["组合", "二项式", "概率"], "概率分布、二项分布期望、排列组合题。", "二项式系数是在数“选哪些位置贡献 b”。", "看到 \\(B(n,p)\\)、组合求和、二项展开，优先把组合式改成二项式结构。", "Pascal 恒等式来自按是否选定某个元素分类。", "\\(\\sum k\\binom nk\\) 可理解为先选一个被标记元素，再选其余元素。", "组合恒等式常有取值范围，\\(k<0\\) 或 \\(k>n\\) 时项应视为 0。"),

  C("calc1-continuity-theorems", "高等数学", "第1章 函数与极限", "连续性", "连续函数零点、介值与最值定理", raw`
f\in C[a,b]\Rightarrow f\text{在 }[a,b]\text{有最大最小值}
\\
f(a)f(b)<0\Rightarrow \exists\xi\in(a,b),\ f(\xi)=0
\\
f\in C[a,b]\Rightarrow f\text{取到 }f(a),f(b)\text{之间所有值}
`, "必背", ["连续", "零点", "介值定理", "证明"], "证明存在根、证明方程有解、区间函数性质题。", "连续函数不能从一个值跳到另一个值，中间值都必须经过。", "看到“至少存在一点”“方程有根”，先构造连续函数并找异号端点。", "介值定理可由实数完备性证明；考研一般会用即可。", "证明 \\(x=\cos x\\) 有根，可令 \\(f(x)=x-\cos x\\)，在 0 与 1 异号。", "定理要求闭区间连续；开区间或间断点不能直接套。"),

  C("calc1-asymptotic-order", "高等数学", "第1章 函数与极限", "无穷小阶", "无穷小阶、同阶与高阶低阶", raw`
\alpha=o(\beta)\iff \lim\frac{\alpha}{\beta}=0
\\
\alpha\sim\beta\iff \lim\frac{\alpha}{\beta}=1
\\
\alpha=O(\beta)\iff \left|\frac{\alpha}{\beta}\right|\le M
\\
\alpha,\beta\text{同阶}\iff 0<\left|\lim\frac{\alpha}{\beta}\right|<\infty
`, "必背", ["极限", "无穷小", "阶"], "比较主项、判断等价无穷小能否替换。", "阶的语言是在说谁比谁小得更快。", "极限式里有加减抵消时，先找最低非零阶。", "定义都来自商的极限；商趋 1 就是等价。", "\\(x^2=o(x)\\ (x\\to0)\\)，但 \\(x=o(x^2)\\) 不成立。", "阶比较必须说明极限过程，例如 \\(x\\to0\\) 或 \\(x\\to\infty\\)。"),

  C("calc1-monotone-bounded", "高等数学", "第1章 函数与极限", "数列收敛", "单调有界准则与递推数列", raw`
a_n\uparrow,\ a_n\le M\Rightarrow a_n\text{收敛}
\\
a_n\downarrow,\ a_n\ge m\Rightarrow a_n\text{收敛}
\\
\text{递推 }a_{n+1}=f(a_n):\quad \lim a_n=A\Rightarrow A=f(A)
`, "常用", ["数列极限", "单调有界", "递推"], "递推数列、存在极限证明。", "只要一个数列一直往一个方向走且不越界，它就会靠近某个数。", "递推题先猜界，再证单调，最后令极限满足不动点方程。", "这是实数完备性的直接体现。", "\\(a_{n+1}=\\sqrt{2+a_n}\\) 若收敛，极限满足 \\(A=\\sqrt{2+A}\\)。", "不能先假设有极限就直接求；要先证明收敛性或题目已给。"),

  C("calc2-log-derivative", "高等数学", "第2章 导数与微分", "对数求导", "对数求导法与幂指函数求导", raw`
y=u(x)^{v(x)},\quad \ln y=v(x)\ln u(x)
\\
\frac{y'}{y}=v'\ln u+v\frac{u'}u
\\
\left[u(x)^{v(x)}\right]'=u^v\left(v'\ln u+v\frac{u'}u\right)
`, "必背", ["导数", "对数求导", "幂指函数"], "底数和指数都含变量的求导。", "对数求导把“指数上的变量”拉下来，乘除幂也会变成加减。", "看到 \\(x^x\\)、\\((\sin x)^x\\)、多因子乘积，优先对数求导。", "两边取对数后用复合函数求导。", "\\((x^x)'=x^x(\\ln x+1)\\)。", "底数要为正；若底数可能为负，不能随便取实对数。"),

  C("calc2-leibniz-higher", "高等数学", "第2章 导数与微分", "高阶导", "Leibniz 高阶乘积求导公式", raw`
(uv)^{(n)}=\sum_{k=0}^{n}\binom nk u^{(k)}v^{(n-k)}
\\
(x^m f)^{(n)}=\sum_{k=0}^{\min(m,n)}\binom nk (x^m)^{(k)}f^{(n-k)}
`, "技巧", ["高阶导", "Leibniz", "导数"], "高阶导计算、Taylor 系数。", "Leibniz 公式就是乘积求导法则的二项式版本。", "一边是多项式、一边是指数/三角时，用 Leibniz 可快速截断。", "对乘积求导反复展开，组合数记录每次导到哪一边。", "\\((x^2e^x)^{(n)}=x^2e^x+2nx e^x+n(n-1)e^x\\)。", "注意求导阶数超过多项式次数后，对应项为 0。"),

  C("calc2-curvature-parametric", "高等数学", "第2章 导数与微分", "参数曲线", "参数方程斜率与曲率", raw`
x=x(t),\ y=y(t),\quad
\frac{dy}{dx}=\frac{y'(t)}{x'(t)}
\\
\frac{d^2y}{dx^2}=\frac{x'y''-y'x''}{(x')^3}
\\
\kappa=\frac{|x'y''-y'x''|}{[(x')^2+(y')^2]^{3/2}}
`, "常用", ["参数方程", "导数", "曲率"], "参数曲线切线、凹凸和曲率。", "参数 t 是隐藏的钟表，斜率要用 y 变化速度除以 x 变化速度。", "参数方程求切线先算 \\(dy/dx\\)，二阶导不要直接对 t 再导一次。", "把 \\(d/dx=(1/x')d/dt\\) 代入即可。", "摆线、椭圆参数式求切线都用这个套路。", "\\(x'(t)=0\\) 处公式可能失效，要单独讨论竖直切线。", "tangent-line"),

  C("calc3-rolle-root-count", "高等数学", "第3章 微分中值定理与导数应用", "根的个数", "Rolle 定理与根的个数估计", raw`
f(a)=f(b),\ f\in C[a,b]\cap D(a,b)
\Rightarrow \exists\xi,\ f'(\xi)=0
\\
f\text{有 }n\text{个不同零点}\Rightarrow f'\text{至少有 }n-1\text{个零点}
\\
f'\text{最多 }m\text{个零点}\Rightarrow f\text{最多 }m+1\text{个零点}
`, "技巧", ["Rolle", "根的个数", "证明"], "证明方程根数、排除多根。", "函数每两次穿过同一高度，中间必有一个水平切线。", "根数题常反证：假设根太多，则导数根也太多，与已知矛盾。", "Rolle 定理在相邻零点之间逐段使用。", "若 \\(f'\\) 恒正，则 \\(f\\) 至多一个零点。", "必须保证连续可导条件，端点和重根要仔细处理。"),

  C("calc3-inequality-taylor", "高等数学", "第3章 微分中值定理与导数应用", "不等式证明", "Taylor/凸性证明常用不等式", raw`
e^x\ge 1+x
\\
\ln(1+x)\le x\quad(x>-1)
\\
\sin x\le x\quad(x\ge0),\quad
1-\frac{x^2}{2}\le\cos x\le1
\\
\text{凸函数： }f(y)\ge f(x)+f'(x)(y-x)
`, "常用", ["不等式", "Taylor", "凸性"], "证明题、极限估计、夹逼。", "很多基础不等式就是函数图像在切线的一侧。", "遇到指数对数三角不等式，先设函数求导或用 Taylor 余项符号。", "凸函数位于任意切线之上；Taylor 公式给出误差阶数。", "证明 \\(e^x\\ge1+x\\) 可设 \\(f=e^x-1-x\\)，最小值在 0。", "不等式方向常依赖区间，例如 \\(\\sin x\le x\\) 需说明 \\(x\\ge0\\)。"),

  C("calc4-special-integral-table", "高等数学", "第4章 不定积分", "积分全表", "根式与反三角常用积分表", raw`
\int\frac{dx}{a^2+x^2}=\frac1a\arctan\frac{x}{a}+C
\\
\int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac{x}{a}+C
\\
\int\frac{dx}{x^2-a^2}=\frac1{2a}\ln\left|\frac{x-a}{x+a}\right|+C
\\
\int\frac{dx}{\sqrt{x^2\pm a^2}}=\ln|x+\sqrt{x^2\pm a^2}|+C
`, "必背", ["积分", "积分表", "反三角", "根式"], "不定积分、换元后基本型识别。", "复杂积分常常只是换元后落到几种标准形。", "看到 \\(a^2+x^2\\) 想 arctan；看到 \\(a^2-x^2\\) 根式想 arcsin。", "由三角代换或直接对右端求导验证。", "\\(\\int dx/\\sqrt{9-x^2}=\\arcsin(x/3)+C\\)。", "参数 \\(a>0\\) 时公式最直接；符号和绝对值不要漏。"),

  C("calc4-sec-csc-integrals", "高等数学", "第4章 不定积分", "三角积分表", "sec、tan、csc、cot 积分表", raw`
\int\tan x\,dx=-\ln|\cos x|+C
\\
\int\cot x\,dx=\ln|\sin x|+C
\\
\int\sec x\,dx=\ln|\sec x+\tan x|+C
\\
\int\csc x\,dx=\ln|\csc x-\cot x|+C
\\
\int\sec^2x\,dx=\tan x+C,\quad \int\csc^2x\,dx=-\cot x+C
`, "必背", ["积分", "三角积分", "sec", "csc"], "三角积分和换元后的标准结果。", "sec/csc 的一次积分是最容易忘的两个冷门基础公式。", "出现 \\(1/\\cos x\\)、\\(1/\\sin x\\) 不好凑时，先想这两个结果。", "\\(\\int\\sec xdx\\) 可分子分母乘 \\(\\sec x+\tan x\\) 凑微分。", "\\(\\int\\tan xdx=-\\ln|\\cos x|+C\\)。", "对数里的绝对值不能漏；不同教材等价写法可能差常数。"),

  C("calc4-reduction-formulas", "高等数学", "第4章 不定积分", "递推积分", "常用递推积分公式", raw`
\int\sin^n xdx=-\frac{\sin^{n-1}x\cos x}{n}+\frac{n-1}{n}\int\sin^{n-2}xdx
\\
\int\cos^n xdx=\frac{\cos^{n-1}x\sin x}{n}+\frac{n-1}{n}\int\cos^{n-2}xdx
\\
\int x^ne^{ax}dx=\frac{x^ne^{ax}}a-\frac{n}{a}\int x^{n-1}e^{ax}dx
`, "技巧", ["积分", "递推", "分部积分"], "高次三角积分、多项式乘指数积分。", "递推公式把高次数一步步降到低次数。", "看到高次幂且重复结构明显时，用分部积分建立 \\(I_n\\) 递推。", "对其中一个因子分部积分，再用恒等式把原积分带回来。", "\\(\\int\\sin^4xdx\\) 可递推到 \\(\\int\\sin^2xdx\\)。", "不定积分递推会有边界项；定积分递推常更干净。"),

  C("calc4-rationalizing-substitution", "高等数学", "第4章 不定积分", "代换技巧", "根式有理化代换速查", raw`
\sqrt{a^2-x^2}:\ x=a\sin t
\\
\sqrt{a^2+x^2}:\ x=a\tan t\ \text{或}\ x=a\sinh t
\\
\sqrt{x^2-a^2}:\ x=a\sec t\ \text{或}\ x=a\cosh t
\\
\sqrt{\frac{x-a}{b-x}}=t\Rightarrow x=\frac{a+bt^2}{1+t^2}
`, "常用", ["积分", "三角代换", "根式", "有理化"], "根式积分和定积分换元。", "根式代换的目标是把根号变成一个平方关系。", "先看根号里面是 \\(a^2-x^2\\)、\\(a^2+x^2\\) 还是 \\(x^2-a^2\\)。", "三角恒等式和双曲恒等式把根式化为单项。", "\\(\\sqrt{1-x^2}\\) 令 \\(x=\\sin t\\)，根号变 \\(\\cos t\\)。", "定积分换元要同步改上下限，且注意三角函数正负区间。"),

  C("calc5-special-definite-integrals", "高等数学", "第5章 定积分", "常用定积分", "特殊区间定积分速查", raw`
\int_0^{\pi/2}\sin x\,dx=1,\quad
\int_0^{\pi/2}\cos x\,dx=1
\\
\int_0^{\pi/2}\sin^2x\,dx=\int_0^{\pi/2}\cos^2x\,dx=\frac{\pi}{4}
\\
\int_0^{\pi}\sin nx\,dx=\frac{1-(-1)^n}{n}
\\
\int_0^{2\pi}\sin nx\,dx=\int_0^{2\pi}\cos nx\,dx=0\quad(n\in\mathbb N)
`, "常用", ["定积分", "三角积分", "周期性"], "选择填空和 Fourier 系数。", "特殊区间的对称性会让大量三角积分直接归零或变半。", "遇到 \\([0,\\pi/2]\\)、\\([0,\\pi]\\)、\\([0,2\\pi]\\) 先想对称和周期。", "由原函数计算或周期函数面积抵消得到。", "\\(\\int_0^{2\\pi}\\cos 5x dx=0\\)。", "非整数频率或区间不完整时不能直接归零。"),

  C("calc5-parameter-integral", "高等数学", "第5章 定积分", "含参积分", "含参积分求导法", raw`
F(a)=\int_{\alpha}^{\beta}f(x,a)\,dx,\quad
F'(a)=\int_{\alpha}^{\beta}\frac{\partial f}{\partial a}(x,a)\,dx
\\
F(a)=\int_{\alpha(a)}^{\beta(a)}f(x,a)\,dx
\\
F'(a)=f(\beta(a),a)\beta'(a)-f(\alpha(a),a)\alpha'(a)+\int_{\alpha(a)}^{\beta(a)}f_a(x,a)\,dx
`, "技巧", ["定积分", "含参积分", "Feynman技巧"], "含参数定积分、反常积分技巧题。", "把难算的积分看成一个函数，先求导让它变简单。", "遇到 \\(\\ln\\)、参数幂、分母含参数时，可设含参函数再求导。", "这是变上限积分求导和偏导交换积分号的结合。", "设 \\(F(a)=\\int_0^1\\frac{x^a-1}{\ln x}dx\\)，则 \\(F'(a)=1/(a+1)\\)。", "交换求导与积分需要连续性/一致收敛等条件；考研中要说明条件良好。"),

  C("calc5-gaussian-integral", "高等数学", "第5章 定积分", "反常积分", "Gaussian 积分与正态归一化", raw`
\int_{-\infty}^{\infty}e^{-x^2}\,dx=\sqrt{\pi}
\\
\int_{-\infty}^{\infty}e^{-ax^2}\,dx=\sqrt{\frac{\pi}{a}}\quad(a>0)
\\
\int_0^{\infty}e^{-ax^2}\,dx=\frac12\sqrt{\frac{\pi}{a}}
`, "了解", ["反常积分", "Gaussian", "正态分布"], "正态分布密度归一化、概率论公式理解。", "高斯积分是正态分布面积为 1 的根。", "概率题看到正态密度常数，可用它检查归一化。", "平方后转为二重积分，再用极坐标计算。", "\\(\\int_{-\\infty}^{\\infty}e^{-x^2/2}dx=\\sqrt{2\\pi}\\)。", "这是反常积分结果，普通换元不能直接给出原函数。"),

  C("calc6-surface-area", "高等数学", "第6章 定积分应用", "面积体积", "旋转曲面面积公式", raw`
S_x=2\pi\int_a^b |y|\sqrt{1+(y')^2}\,dx
\\
S_y=2\pi\int_a^b |x|\sqrt{1+(y')^2}\,dx
\\
\text{参数式： }S=2\pi\int_{\alpha}^{\beta} r(t)\sqrt{(x')^2+(y')^2}\,dt
`, "常用", ["定积分应用", "旋转曲面", "弧长"], "旋转曲面面积题。", "曲面面积是把每一小段弧长旋转成窄圆台的面积。", "绕 x 轴用半径 \\(|y|\\)，绕 y 轴用半径 \\(|x|\\)。", "微元近似为 \\(dS=2\\pi r\,ds\\)。", "半圆绕 x 轴得到球面面积时可验证 \\(4\\pi R^2\\)。", "半径必须取非负，曲线跨轴时要分段。", "riemann-sum"),

  C("calc7-exact-equation", "高等数学", "第7章 微分方程", "全微分方程", "全微分方程与积分因子", raw`
M(x,y)dx+N(x,y)dy=0
\\
\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}\Rightarrow
\exists u,\ du=Mdx+Ndy,\quad u(x,y)=C
\\
\frac{M_y-N_x}{N}=f(x)\Rightarrow \mu(x)=e^{\int f(x)dx}
`, "了解", ["微分方程", "全微分", "积分因子"], "特殊一阶方程、选择填空识别。", "全微分方程就是某个势函数的等值线。", "看到 \\(Mdx+Ndy=0\\)，先验 \\(M_y=N_x\\)；不满足再看积分因子。", "若 \\(du=u_xdx+u_ydy\\)，则混合偏导相等。", "\\((2xy)dx+x^2dy=0\\) 是 \\(d(x^2y)=0\\)，故 \\(x^2y=C\\)。", "积分因子条件有多种，不要看错是只含 x 还是只含 y。"),

  C("calc8-common-surfaces", "高等数学", "第8章 向量代数与空间解析几何", "空间曲面", "常见二次曲面标准方程", raw`
\frac{x^2}{a^2}+\frac{y^2}{b^2}+\frac{z^2}{c^2}=1\quad\text{椭球面}
\\
\frac{x^2}{a^2}+\frac{y^2}{b^2}-\frac{z^2}{c^2}=1\quad\text{单叶双曲面}
\\
z=\frac{x^2}{a^2}+\frac{y^2}{b^2}\quad\text{椭圆抛物面}
\\
z^2=x^2+y^2\quad\text{圆锥面}
`, "常用", ["空间几何", "二次曲面", "曲面"], "空间解析几何、重积分区域识别。", "二次曲面是三维区域的地图，认形状能快速选坐标系。", "看到平方项符号和常数项，先判椭球、双曲面、抛物面或锥面。", "通过固定一个变量看截线形状可识别曲面。", "\\(x^2+y^2=z^2\\) 的水平截面是圆，故为圆锥面。", "平移后的二次曲面要先配方再识别。"),

  C("calc9-chain-jacobian", "高等数学", "第9章 多元函数微分法及应用", "链式法则", "多元链式法则与 Jacobi 矩阵", raw`
z=f(u,v),\quad u=u(x,y),\ v=v(x,y)
\\
\frac{\partial z}{\partial x}=f_u u_x+f_v v_x,\quad
\frac{\partial z}{\partial y}=f_u u_y+f_v v_y
\\
J=\frac{\partial(u,v)}{\partial(x,y)}
=\begin{vmatrix}u_x&u_y\\v_x&v_y\end{vmatrix}
`, "必背", ["多元微分", "链式法则", "Jacobi"], "复合函数偏导、重积分换元前置。", "多元链式法则就是沿所有中间变量路径把变化传下去。", "画变量依赖图，每条路径的导数相乘，所有路径相加。", "全微分形式 \\(dz=f_udu+f_vdv\\) 代入 \\(du,dv\\) 得到。", "若 \\(z=f(x+y,xy)\\)，则 \\(z_x=f_u+yf_v\\)。", "偏导时哪些变量固定要说清；变量名重复最容易错。"),

  C("calc9-implicit-partials", "高等数学", "第9章 多元函数微分法及应用", "隐函数", "多元隐函数求偏导", raw`
F(x,y,z)=0,\quad F_z\ne0
\\
\frac{\partial z}{\partial x}=-\frac{F_x}{F_z},\quad
\frac{\partial z}{\partial y}=-\frac{F_y}{F_z}
\\
F(x,y,u,v)=0,\ G(x,y,u,v)=0:
\quad \left(\begin{array}{c}u_x\\v_x\end{array}\right)
=-\left(\begin{array}{cc}F_u&F_v\\G_u&G_v\end{array}\right)^{-1}
\left(\begin{array}{c}F_x\\G_x\end{array}\right)
`, "常用", ["多元微分", "隐函数", "偏导"], "隐函数偏导、方程组确定函数。", "隐函数求导就是对约束方程两边求偏导，然后解未知偏导。", "看到 \\(F(x,y,z)=0\\) 且要 \\(z_x,z_y\\)，直接套 \\(-F_x/F_z\\)。", "由 \\(F_x+F_z z_x=0\\) 得到。", "若 \\(x^2+y^2+z^2=1\\)，则 \\(z_x=-x/z\\)。", "分母偏导不能为 0；方程组情形要检查 Jacobi 行列式非零。"),

  C("calc9-tangent-plane", "高等数学", "第9章 多元函数微分法及应用", "切平面", "曲面切平面与法线", raw`
z=f(x,y):\quad
z-z_0=f_x(x_0,y_0)(x-x_0)+f_y(x_0,y_0)(y-y_0)
\\
F(x,y,z)=0:\quad
F_x(x-x_0)+F_y(y-y_0)+F_z(z-z_0)=0
\\
\text{法线： }\frac{x-x_0}{F_x}=\frac{y-y_0}{F_y}=\frac{z-z_0}{F_z}
`, "必背", ["多元微分", "切平面", "法线", "梯度"], "空间曲面切平面、方向导数。", "梯度方向是曲面的法向量，切平面垂直于它。", "显函数用偏导，隐式曲面用 \\(\\nabla F\\)。", "线性化公式给出切平面，梯度垂直等值面。", "球面 \\(x^2+y^2+z^2=R^2\\) 在 \\(P\\) 点法向量就是 \\(P\\)。", "点必须在曲面上；法线分母为 0 时要改用参数形式。"),

  C("calc10-order-switching", "高等数学", "第10章 重积分", "积分次序", "二重积分换序与区域投影", raw`
\iint_D f(x,y)\,dA
=\int_a^b\int_{\varphi_1(x)}^{\varphi_2(x)}f(x,y)\,dy\,dx
\\
=\int_c^d\int_{\psi_1(y)}^{\psi_2(y)}f(x,y)\,dx\,dy
\\
\text{换序核心：先画 }D,\text{再按新外层变量投影}
`, "必背", ["重积分", "换序", "区域"], "二重积分计算、含变限积分化简。", "换序不是代数操作，而是重新扫描同一块区域。", "遇到内层积分难算、积分限复杂时，先画区域再换序。", "Fubini 定理保证适当条件下迭代积分等于区域积分。", "\\(0<x<1, x<y<1\\) 换序为 \\(0<y<1,0<x<y\\)。", "不画图直接换上下限很容易漏区域或反向。"),

  C("calc10-symmetry-odd-even", "高等数学", "第10章 重积分", "对称性", "重积分对称性与奇偶性", raw`
D\text{关于 }y\text{轴对称},\ f(-x,y)=-f(x,y)\Rightarrow \iint_D f\,dA=0
\\
D\text{关于 }y\text{轴对称},\ f(-x,y)=f(x,y)\Rightarrow
\iint_D f\,dA=2\iint_{D_+}f\,dA
\\
\text{三重积分同理：区域对称 + 被积函数奇偶}
`, "技巧", ["重积分", "对称性", "奇偶"], "重积分快速化简、选择填空。", "对称区域上，奇函数贡献左右抵消，偶函数贡献可翻倍。", "计算前先看区域是否关于坐标轴/平面对称，再看被积函数奇偶。", "变量替换 \\(x\mapsto -x\\) 后积分值相反或相同。", "球域上 \\(\\iiint xyz\,dV=0\\)。", "区域必须真的对称；被积函数含多个变量时要按对应变量判断。"),

  C("calc11-potential-path-independent", "高等数学", "第11章 曲线积分与曲面积分", "路径无关", "路径无关、势函数与保守场", raw`
\int_L Pdx+Qdy\text{路径无关}\iff P_y=Q_x\quad(D\text{单连通})
\\
\exists u:\ du=Pdx+Qdy,\quad \int_A^B Pdx+Qdy=u(B)-u(A)
\\
\mathbb R^3:\quad \nabla\times \mathbf F=0\Rightarrow \mathbf F=\nabla u
`, "必背", ["曲线积分", "路径无关", "势函数", "保守场"], "第二型曲线积分、Green 公式应用。", "保守场里做功只看起点终点，不看走哪条路。", "看到第二型线积分且区域单连通，先查 \\(P_y=Q_x\\)。", "若 \\(P=u_x,Q=u_y\\)，混合偏导相等；反向在单连通区域成立。", "\\(P=2xy,Q=x^2\\) 时势函数 \\(u=x^2y\\)。", "区域有洞时 \\(P_y=Q_x\\) 不一定保证路径无关。"),

  C("calc11-div-curl", "高等数学", "第11章 曲线积分与曲面积分", "向量场", "梯度、散度、旋度速查", raw`
\nabla f=(f_x,f_y,f_z)
\\
\operatorname{div}\mathbf F=\nabla\cdot\mathbf F=P_x+Q_y+R_z
\\
\operatorname{curl}\mathbf F=\nabla\times\mathbf F
=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\\partial_x&\partial_y&\partial_z\\P&Q&R\end{vmatrix}
\\
\nabla\cdot(\nabla\times\mathbf F)=0,\quad \nabla\times(\nabla f)=0
`, "常用", ["梯度", "散度", "旋度", "Gauss", "Stokes"], "三大公式、向量场理解。", "梯度指最快上升，散度看源汇，旋度看局部旋转。", "Gauss 看散度，Stokes 看旋度，方向和边界要先确认。", "由向量微分算子形式直接展开得到。", "若 \\(\\mathbf F=(x,y,z)\\)，散度为 3。", "旋度行列式符号容易错，尤其 j 分量。"),

  C("calc12-taylor-series-table", "高等数学", "第12章 无穷级数", "Taylor 展开表", "常用 Taylor/Maclaurin 展开全表", raw`
e^x=\sum_{n=0}^{\infty}\frac{x^n}{n!}
\\
\sin x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n+1}}{(2n+1)!},\quad
\cos x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n}}{(2n)!}
\\
\ln(1+x)=\sum_{n=1}^{\infty}(-1)^{n-1}\frac{x^n}{n}\quad(-1<x\le1)
\\
(1+x)^\alpha=\sum_{n=0}^{\infty}\binom{\alpha}{n}x^n\quad(|x|<1)
\\
\arctan x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n+1}}{2n+1}\quad(|x|\le1)
`, "必背", ["Taylor", "幂级数", "展开表"], "极限、级数求和、近似计算。", "这些展开是把常见函数翻译成幂级数词典。", "遇到极限主项、幂级数求和，先匹配标准展开。", "由 Taylor 公式在 0 点展开并判定收敛区间。", "\\(\\sum(-1)^n/(2n+1)=\\arctan1=\\pi/4\\)。", "每个展开都有收敛区间，端点要单独检查。", "taylor-plot"),

  C("calc12-fourier-parity", "高等数学", "第12章 无穷级数", "Fourier 级数", "Fourier 奇偶展开与常用系数", raw`
f(x)\sim \frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx)
\\
a_n=\frac1{\pi}\int_{-\pi}^{\pi}f(x)\cos nx\,dx,\quad
b_n=\frac1{\pi}\int_{-\pi}^{\pi}f(x)\sin nx\,dx
\\
f\text{偶}\Rightarrow b_n=0,\quad
f\text{奇}\Rightarrow a_n=0
\\
\text{半区间正弦展开： }b_n=\frac{2}{l}\int_0^l f(x)\sin\frac{n\pi x}{l}dx
`, "常用", ["Fourier", "奇偶性", "级数"], "Fourier 系数计算、周期延拓。", "Fourier 是把周期函数拆成不同频率的正弦余弦波。", "先判断奇偶性，可直接砍掉一半系数。", "正交性 \\(\\int \sin mx\sin nx=0\\) 让各频率互不干扰。", "偶函数在 \\([-\\pi,\\pi]\\) 上只需算 cos 系数。", "间断点处 Fourier 级数收敛到左右极限平均值。", "unit-circle"),

  C("calc12-parseval", "高等数学", "第12章 无穷级数", "Fourier 技巧", "Parseval 等式与平方和", raw`
\frac1{\pi}\int_{-\pi}^{\pi}f^2(x)\,dx
=\frac{a_0^2}{2}+\sum_{n=1}^{\infty}(a_n^2+b_n^2)
\\
\sum_{n=1}^{\infty}\frac1{n^2}=\frac{\pi^2}{6},\quad
\sum_{n=1}^{\infty}\frac1{(2n-1)^2}=\frac{\pi^2}{8}
`, "拓展", ["Parseval", "Fourier", "级数求和", "冷门技巧"], "特殊数项级数求和、Fourier 拓展。", "Parseval 说函数能量等于各频率能量之和。", "遇到平方倒数和，可联想到 Fourier/Parseval，但考研一般作为拓展。", "由三角函数系正交性和均方收敛得到。", "用 \\(f(x)=x\\) 的 Fourier 展开可推出 \\(\\sum1/n^2=\\pi^2/6\\)。", "这不是常规考研主法；大题使用要确保题目允许 Fourier 背景。"),

  C("linear1-vandermonde", "线性代数", "第1章 行列式", "特殊行列式", "Vandermonde 行列式", raw`
\begin{vmatrix}
1&1&\cdots&1\\
x_1&x_2&\cdots&x_n\\
\vdots&\vdots&&\vdots\\
x_1^{n-1}&x_2^{n-1}&\cdots&x_n^{n-1}
\end{vmatrix}
=\prod_{1\le j<i\le n}(x_i-x_j)
`, "技巧", ["行列式", "Vandermonde", "特殊行列式"], "特殊行列式计算、插值相关题。", "Vandermonde 行列式衡量这些点是否彼此不同。", "行列式各列是 \\(1,x_i,\dots,x_i^{n-1}\\) 时直接想它。", "两列相等时行列式为 0，所以含所有 \\((x_i-x_j)\\) 因子，再比较最高项系数。", "三阶结果为 \\((x_2-x_1)(x_3-x_1)(x_3-x_2)\\)。", "注意行/列排列会影响符号。"),

  C("linear1-laplace-expansion", "线性代数", "第1章 行列式", "展开定理", "Laplace 展开与代数余子式恒等式", raw`
|A|=\sum_{j=1}^{n}a_{ij}A_{ij}=\sum_{i=1}^{n}a_{ij}A_{ij}
\\
\sum_{j=1}^{n}a_{kj}A_{ij}=0\quad(k\ne i)
\\
\sum_{j=1}^{n}a_{ij}A_{ij}=|A|
`, "必背", ["行列式", "代数余子式", "Laplace"], "行列式证明、伴随矩阵推导。", "按一行展开时，同一行元素和对应余子式配对才给原行列式。", "遇到代数余子式求和，先判断元素与余子式是否同一行/列。", "把某一行替换成另一行后行列式有两行相同，故为 0。", "\\(\\sum_j a_{2j}A_{1j}=0\\)，因为相当于把第 1 行换成第 2 行展开。", "余子式下标和展开方向最容易错。"),

  C("linear2-block-inverse", "线性代数", "第2章 矩阵及其运算", "分块矩阵", "分块逆矩阵与 Schur 补", raw`
\left(\begin{array}{cc}A&B\\0&D\end{array}\right)^{-1}
=\left(\begin{array}{cc}A^{-1}&-A^{-1}BD^{-1}\\0&D^{-1}\end{array}\right)
\\
\left(\begin{array}{cc}A&B\\C&D\end{array}\right)^{-1}
\text{可由 }S=D-CA^{-1}B\text{ 分块消元得到}
`, "了解", ["分块矩阵", "逆矩阵", "Schur补"], "分块矩阵求逆、理论题。", "分块求逆就是把普通高斯消元升级成按块消元。", "块上三角且对角块可逆时，可直接套第一式。", "令乘积等于单位块矩阵，逐块解出未知块。", "\\(\\left(\\begin{array}{cc}A&B\\\\0&D\\end{array}\\right)\\) 可逆当且仅当 A、D 都可逆。", "矩阵块不能交换，公式顺序不能随手调。"),

  C("linear2-trace-eigen", "线性代数", "第2章 矩阵及其运算", "迹与特征值", "迹、行列式与特征值关系", raw`
\operatorname{tr}(A)=\sum_i a_{ii},\quad
\operatorname{tr}(AB)=\operatorname{tr}(BA)
\\
\lambda_1+\cdots+\lambda_n=\operatorname{tr}(A),\quad
\lambda_1\cdots\lambda_n=|A|
\\
\operatorname{tr}(P^{-1}AP)=\operatorname{tr}(A)
`, "常用", ["矩阵", "迹", "特征值", "行列式"], "特征值计算检验、相似矩阵性质。", "迹是特征值总和，行列式是特征值乘积。", "求完特征值后用迹和行列式验算，能抓很多计算错。", "特征多项式最高几项系数给出特征值和积。", "二阶矩阵特征值和等于主对角线和。", "迹乘法只可循环换位，不能随便认为 \\(ABC=ACB\\)。"),

  C("linear2-sherman-morrison", "线性代数", "第2章 矩阵及其运算", "秩一修正", "矩阵行列式引理与 Sherman-Morrison", raw`
|A+uv^T|=|A|\left(1+v^TA^{-1}u\right)
\\
(A+uv^T)^{-1}=A^{-1}-\frac{A^{-1}uv^TA^{-1}}{1+v^TA^{-1}u}
`, "拓展", ["矩阵", "秩一修正", "行列式引理", "冷门技巧"], "秩一扰动、特殊矩阵行列式和逆。", "秩一修正就是只沿一个方向改动矩阵。", "看到 \\(A+uv^T\\) 或全 1 矩阵扰动，可考虑该公式。", "由分块行列式或 Woodbury 公式的特例得到。", "\\(|I+uv^T|=1+v^Tu\\)。", "要求 A 可逆且分母不为 0；考研中多作选择填空技巧。"),

  C("linear3-fundamental-subspaces", "线性代数", "第3章 初等变换与线性方程组", "四个子空间", "列空间、零空间与维数公式", raw`
R(A)=\{Ax:x\in\mathbb R^n\},\quad N(A)=\{x:Ax=0\}
\\
\dim R(A)=r(A),\quad \dim N(A)=n-r(A)
\\
R(A)^\perp=N(A^T)
`, "了解", ["方程组", "秩", "零空间", "列空间"], "线性方程组解空间、最小二乘理解。", "矩阵把输入空间压到列空间，丢掉的方向就是零空间。", "齐次解维数直接用 \\(n-r(A)\\)。", "秩-零化度定理来自主元变量与自由变量的分解。", "若 A 为 \\(3\\times5\\) 且秩 2，则 \\(Ax=0\\) 基础解系有 3 个向量。", "不要把行数 m 和未知量个数 n 混淆。"),

  C("linear4-basis-change", "线性代数", "第4章 向量组线性相关性", "坐标变换", "基变换与坐标变换公式", raw`
(\alpha_1,\dots,\alpha_n)=(\beta_1,\dots,\beta_n)P
\\
x_{\beta}=P x_{\alpha}
\\
A_{\beta}=P A_{\alpha}P^{-1}\quad\text{或按约定写 }P^{-1}AP
`, "了解", ["基", "坐标", "相似矩阵", "线性变换"], "线性变换在不同基下的矩阵、相似理解。", "换基不会改变线性变换本身，只改变坐标描述。", "先明确 P 的列是新基在旧基下的坐标，再决定坐标变换方向。", "由同一个向量在两组基下展开相等得到。", "若 \\(B=AP\\)，则同一向量坐标满足 \\([v]_B=P^{-1}[v]_A\\)（按此约定）。", "不同教材 P 的定义可能相反，必须先看约定。"),

  C("linear5-jordan-minimal", "线性代数", "第5章 相似矩阵及二次型", "最小多项式", "最小多项式与高次幂降阶", raw`
m_A(A)=0,\quad m_A(\lambda)\mid p_A(\lambda)
\\
A\text{可对角化}\iff m_A(\lambda)\text{无重根}
\\
p_A(A)=0\quad\text{是 Cayley-Hamilton 的特例应用}
`, "拓展", ["最小多项式", "Cayley-Hamilton", "矩阵高次幂"], "矩阵高次幂、对角化拓展理解。", "最小多项式是让矩阵归零的最低次数多项式。", "考研不常直接考，但高次幂降阶和对角化判断背后是它。", "最小多项式整除特征多项式，且必须覆盖每个特征方向的信息。", "若 \\(A^2=A\\)，则 \\(A^n=A\\ (n\\ge1)\\)。", "不要求常规大题使用；知道它能帮助理解 Cayley-Hamilton。"),

  C("linear5-svd-rank", "线性代数", "第5章 相似矩阵及二次型", "奇异值", "奇异值与秩的几何理解", raw`
A^TA\succeq0,\quad \sigma_i=\sqrt{\lambda_i(A^TA)}
\\
r(A)=\#\{\sigma_i>0\}
\\
\|Ax\|^2=x^TA^TAx
`, "拓展", ["奇异值", "秩", "正定", "二次型"], "矩阵几何、最小二乘拓展。", "奇异值描述矩阵把空间沿正交方向拉伸了多少。", "看到 \\(A^TA\\) 正定/半正定、最小二乘，可用奇异值理解。", "\\(A^TA\\) 总是半正定，因为 \\(x^TA^TAx=\\|Ax\\|^2\\ge0\\)。", "\\(A^TA\\) 可逆等价于 A 列满秩。", "奇异值不是数学一常规硬考点，主要用于理解。", "matrix-transform"),

  C("prob1-counting-models", "概率论", "第1章 随机事件与概率", "古典概型", "排列组合概率模型速查", raw`
A_n^k=\frac{n!}{(n-k)!},\quad C_n^k=\binom nk=\frac{n!}{k!(n-k)!}
\\
P(A)=\frac{|A|}{|\Omega|}
\\
\text{有序用排列，无序用组合；放回/不放回决定是否独立}
`, "必背", ["概率", "古典概型", "排列组合"], "古典概型、抽球、分组、排队问题。", "古典概型的核心是把样本点数清楚。", "先判断等可能样本空间，再决定有序无序、放回不放回。", "概率定义为有利样本数除以总样本数。", "从 10 个中无序取 3 个共有 \\(\\binom{10}{3}\\) 种。", "样本空间口径要统一，分子分母不能一个有序一个无序。"),

  C("prob2-more-distributions", "概率论", "第2章 随机变量及其分布", "分布扩展表", "几何、超几何、Gamma、Beta 分布", raw`
P(X=k)=(1-p)^{k-1}p\quad(k=1,2,\dots),\ E X=\frac1p
\\
P(X=k)=\frac{\binom{M}{k}\binom{N-M}{n-k}}{\binom Nn}\quad\text{超几何}
\\
f_{\Gamma(\alpha,\lambda)}(x)=\frac{\lambda^\alpha}{\Gamma(\alpha)}x^{\alpha-1}e^{-\lambda x}
\\
f_{\operatorname{Beta}(a,b)}(x)=\frac{x^{a-1}(1-x)^{b-1}}{B(a,b)}
`, "常用", ["概率分布", "几何分布", "超几何", "Gamma", "Beta"], "常见分布识别、概率模型选择。", "分布名称就是抽样机制的压缩标签。", "等第一次成功想几何；不放回抽样想超几何；等待时间和想 Gamma。", "各分布由对应随机试验机制计数或密度归一化得到。", "不放回抽球中抽到 k 个次品常用超几何分布。", "几何分布有两种记号：从 0 开始或从 1 开始，期望不同。", "distribution-plot"),

  C("prob2-normal-transform", "概率论", "第2章 随机变量及其分布", "正态变换", "正态分布标准化与线性变换", raw`
X\sim N(\mu,\sigma^2)\Rightarrow Z=\frac{X-\mu}{\sigma}\sim N(0,1)
\\
aX+b\sim N(a\mu+b,a^2\sigma^2)
\\
X_i\text{独立正态}\Rightarrow \sum a_iX_i\sim N\left(\sum a_i\mu_i,\sum a_i^2\sigma_i^2\right)
`, "必背", ["正态分布", "标准化", "线性变换"], "正态概率、抽样分布、CLT。", "正态族在线性变换下仍保持钟形，只改变中心和尺度。", "所有正态概率先标准化成 \\(\\Phi\\)。", "由密度换元和独立正态的矩母函数可证明。", "\\(X\\sim N(3,4)\\)，则 \\((X-3)/2\\sim N(0,1)\\)。", "方差乘的是 \\(a^2\\)，不是 \\(a\\)。", "distribution-plot"),

  C("prob3-bivariate-transform", "概率论", "第3章 多维随机变量", "二维变换", "二维随机变量变换与 Jacobi", raw`
U=g_1(X,Y),\quad V=g_2(X,Y)
\\
f_{U,V}(u,v)=f_{X,Y}(x(u,v),y(u,v))
\left|\frac{\partial(x,y)}{\partial(u,v)}\right|
\\
f_U(u)=\int_{-\infty}^{\infty}f_{U,V}(u,v)\,dv
`, "常用", ["二维分布", "变量变换", "Jacobi"], "二维函数分布、和商积的分布。", "二维变换就是把平面坐标网换一套，Jacobi 负责面积缩放。", "求 \\(X+Y\\)、\\(X/Y\\) 等分布时，补一个变量构成可逆变换。", "二维积分换元给出密度变换公式。", "求 \\(Z=X+Y\\) 可令 \\(U=X+Y,V=Y\\)，再对 V 积分。", "必须检查变换一一对应或分区一一对应。", "distribution-plot"),

  C("prob4-linear-combination-moments", "概率论", "第4章 数字特征", "线性组合", "线性组合的期望、方差、协方差", raw`
E\left(\sum a_iX_i\right)=\sum a_iEX_i
\\
D\left(\sum a_iX_i\right)=\sum a_i^2DX_i+2\sum_{i<j}a_ia_j\operatorname{Cov}(X_i,X_j)
\\
X_i\text{两两不相关}\Rightarrow D\left(\sum a_iX_i\right)=\sum a_i^2DX_i
`, "必背", ["期望", "方差", "协方差", "线性组合"], "用于随机变量线性组合、样本均值、统计量方差、协方差和相关系数计算。是否独立或不相关会直接决定方差公式能否简化。", "期望永远线性，方差只有在不相关时才简单相加。", "计算和的方差先写协方差项，不要默认独立。", "期望线性性由求和或积分的线性性得到，不要求独立。方差由 \\(D(X+Y)=E[(X+Y-E X-E Y)^2]\\) 展开，得到 \\(DX+DY+2Cov(X,Y)\\)，多个变量时同理出现所有协方差项。", "\\(D(X-Y)=DX+DY-2Cov(X,Y)\\)。", "期望线性永远成立，但方差线性一般不成立。独立可以推出协方差为 0；协方差为 0 通常不能推出独立，除非有额外条件如联合正态。"),

  C("prob4-conditional-expectation", "概率论", "第4章 数字特征", "条件期望", "条件期望公式表", raw`
E(X|Y=y)=\sum_x xP(X=x|Y=y)
\quad\text{或}\quad
\int x f_{X|Y}(x|y)dx
\\
E[g(Y)X]=E[g(Y)E(X|Y)]
\\
E(X)=E(E(X|Y))
`, "常用", ["条件期望", "全期望", "数字特征"], "分层模型、随机环境、先验后验问题。", "条件期望是知道一部分信息后，对剩下随机性的平均。", "看到“先选盒子/环境/参数，再抽样”，先按条件算期望。", "由联合分布分解为条件分布与边缘分布得到。", "先随机选盒子，再抽球，红球数期望可先按盒子求。", "条件期望本身是 Y 的函数，别把它当常数。"),

  C("prob6-chi-square-t-f", "概率论", "第6章 数理统计基本概念", "三大抽样分布", "χ²、t、F 分布构造关系", raw`
X_i\sim N(0,1),\quad \sum_{i=1}^{n}X_i^2\sim\chi^2(n)
\\
T=\frac{X}{\sqrt{Y/n}}\sim t(n)\quad(X\sim N(0,1),Y\sim\chi^2(n),X\perp Y)
\\
F=\frac{X/m}{Y/n}\sim F(m,n)
\\
T^2\sim F(1,n)
`, "必背", ["抽样分布", "卡方分布", "t分布", "F分布"], "置信区间、假设检验统计量来源。", "三大抽样分布都是标准正态和平方和搭出来的。", "均值未知方差未知用 t；方差用 χ²；方差比用 F。", "定义式直接给出构造关系。", "若 \\(T\\sim t(n)\\)，则 \\(T^2\\sim F(1,n)\\)。", "独立性条件很重要，尤其样本均值和样本方差的独立只在正态总体下成立。"),

  C("prob7-confidence-intervals", "概率论", "第7章 参数估计", "置信区间", "常见置信区间公式表", raw`
\mu,\sigma^2\text{已知： }\bar X\pm z_{\alpha/2}\frac{\sigma}{\sqrt n}
\\
\mu,\sigma^2\text{未知： }\bar X\pm t_{\alpha/2}(n-1)\frac{S}{\sqrt n}
\\
\sigma^2\text{区间： }
\left(\frac{(n-1)S^2}{\chi^2_{\alpha/2}(n-1)},
\frac{(n-1)S^2}{\chi^2_{1-\alpha/2}(n-1)}\right)
`, "必背", ["置信区间", "参数估计", "正态总体"], "统计推断大题。", "置信区间是把枢轴量不等式反解成参数范围。", "先判断总体是否正态、方差是否已知，再选 Z/t/χ²。", "由统计量的抽样分布和双侧分位点构造。", "方差未知估计均值，用 t 分布而不是标准正态。", "χ² 分布不对称，方差区间上下端分位点顺序别写反。"),

  C("prob8-two-sample-tests", "概率论", "第8章 假设检验", "两样本检验", "两正态总体均值与方差检验", raw`
Z=\frac{\bar X-\bar Y-(\mu_1-\mu_2)_0}{\sqrt{\sigma_1^2/n_1+\sigma_2^2/n_2}}
\\
T=\frac{\bar X-\bar Y-(\mu_1-\mu_2)_0}{S_p\sqrt{1/n_1+1/n_2}},\quad
S_p^2=\frac{(n_1-1)S_1^2+(n_2-1)S_2^2}{n_1+n_2-2}
\\
F=\frac{S_1^2}{S_2^2}
`, "了解", ["假设检验", "两样本", "t检验", "F检验"], "两总体均值差、方差比检验。", "两样本检验是在比较两个总体的中心或波动是否有显著差异。", "方差已知用 Z；方差未知但相等用合并方差 t；方差比用 F。", "由差的均值方差和正态抽样分布构造统计量。", "比较两台机器平均误差是否相同可用两样本均值检验。", "等方差假设不满足时，合并方差 t 公式不宜直接套。"),

  C("cold-stirling", "冷门技巧", "冷门但高收益技巧库", "极限", "Stirling 公式", raw`
n!\sim \sqrt{2\pi n}\left(\frac ne\right)^n
\\
\ln n!=n\ln n-n+\frac12\ln(2\pi n)+o(1)
`, "拓展", ["Stirling", "极限", "阶乘", "冷门技巧"], "含阶乘极限、组合数渐近估计。", "Stirling 公式把阶乘这种离散爆炸量翻译成指数函数。", "看到 \\(n!\\)、\\(\\binom{2n}{n}\\) 的极限估计，可想到它。", "可由 Euler-Maclaurin 求和或 Laplace 方法得到。", "\\(\\binom{2n}{n}\\sim 4^n/\\sqrt{\\pi n}\\)。", "这是拓展技巧，常规考研优先用比值、夹逼和对数化。"),

  C("cold-abel-summation", "冷门技巧", "冷门但高收益技巧库", "级数", "Abel 变换与 Abel 判别", raw`
\sum_{k=1}^{n}a_kb_k=A_nb_{n+1}+\sum_{k=1}^{n}A_k(b_k-b_{k+1}),\quad A_k=\sum_{i=1}^{k}a_i
\\
\sum a_n\text{收敛},\ b_n\text{单调有界}\Rightarrow \sum a_nb_n\text{收敛}
`, "拓展", ["Abel", "级数", "冷门技巧", "Dirichlet"], "乘积型级数、带振荡项级数判敛。", "Abel 变换是离散版分部积分。", "看到“部分和 × 单调项”的结构，想 Dirichlet/Abel。", "把 \\(a_k=A_k-A_{k-1}\\) 代入并错位整理。", "\\(\\sum (-1)^n/n^p\\) 可用 Abel/Dirichlet 思想理解。", "条件比普通比较判别细，不能忽略单调有界或收敛条件。"),

  C("cold-laplace-method", "冷门技巧", "冷门但高收益技巧库", "积分", "Laplace 方法直觉版", raw`
\int_a^b e^{n f(x)}g(x)\,dx
\text{ 的主贡献来自 }f(x)\text{最大点附近}
\\
f'(x_0)=0,\ f''(x_0)<0:\quad
f(x)\approx f(x_0)+\frac12f''(x_0)(x-x_0)^2
`, "拓展", ["Laplace方法", "反常积分", "冷门技巧"], "大参数积分、概率渐近理解。", "大指数会把最大点附近放大成主要贡献。", "看到 \\(n\\to\\infty\\) 的积分且含 \\(e^{nf(x)}\\)，可用它判断主项位置。", "由 Taylor 二次近似和 Gaussian 积分得到主项。", "\\(\\int_0^1 x^n dx\\) 的贡献集中在 x=1 附近。", "考研数学一通常不直接要求公式，更多用于直觉和拓展。"),

  C("pre-root-rationalization", "前置基础", "0. 前置基础", "根式化简", "根式有理化与共轭公式", raw`
\sqrt A-\sqrt B=\frac{A-B}{\sqrt A+\sqrt B}
\\
\sqrt[3]A-\sqrt[3]B=\frac{A-B}{\sqrt[3]{A^2}+\sqrt[3]{AB}+\sqrt[3]{B^2}}
\\
\sqrt{1+x}=1+\frac{x}{2}-\frac{x^2}{8}+o(x^2)
`, "必背", ["根式", "有理化", "极限"], "根式极限、代数化简、等价无穷小。", "有理化是在把难消的根号差变成好消的代数差。", "看到根号相减、立方根相减，先乘共轭或用幂差公式。", "平方差和立方差恒等式直接给出。", "\\(\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1}{x}=1/2\\)。", "分母共轭不能写错；高阶极限需 Taylor 而不只是一次有理化。"),

  C("pre-absolute-piecewise", "前置基础", "0. 前置基础", "绝对值", "绝对值、符号函数与分段处理", raw`
|x|=\begin{cases}x,&x\ge0\\-x,&x<0\end{cases}
\\
|x|=\sqrt{x^2},\quad |ab|=|a||b|
\\
\frac{d}{dx}|x|=\operatorname{sgn}x\quad(x\ne0)
`, "常用", ["绝对值", "分段", "导数"], "分段函数、极限、积分、概率密度。", "绝对值题的核心是先按零点切区间。", "看到 \\(|f(x)|\\)，先找 \\(f(x)=0\\) 的分界点。", "定义式按正负号拆开即可。", "\\(\\int_{-1}^{2}|x|dx=\\int_{-1}^{0}(-x)dx+\\int_0^2xdx\\)。", "在尖点处通常不可导，别直接套链式法则。"),

  C("pre-common-geometry", "前置基础", "0. 前置基础", "平面解析几何", "平面解析几何常用公式", raw`
d(P,L):\ Ax+By+C=0,\quad d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}
\\
\text{圆： }(x-a)^2+(y-b)^2=R^2
\\
\text{椭圆： }\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,\quad
\text{双曲线： }\frac{x^2}{a^2}-\frac{y^2}{b^2}=1
`, "常用", ["解析几何", "曲线", "积分应用"], "用于定积分应用、重积分区域刻画、极坐标换元、解析几何和空间曲线曲面前置。重点是把文字图形转成方程、不等式和积分边界。", "几何公式帮你快速把图形翻译成积分区域。", "先画草图，再标关键点和交点；圆锥曲线写标准式，直线用点斜式或一般式，极坐标题先判断 \\(r\\) 的取值范围和角度区间，最后再写积分上下限。", "点到直线 \\(Ax+By+C=0\\) 的距离可看成点到直线任一点向量在法向量 \\((A,B)\\) 上的投影长度，因此为 \\(|Ax_0+By_0+C|/\\sqrt{A^2+B^2}\\)。", "圆 \\((x-a)^2+(y-b)^2=R^2\\)。若求上半圆面积边界，可写 \\(y=b+\\sqrt{R^2-(x-a)^2}\\)，并配合 \\(x\\in[a-R,a+R]\\)。", "椭圆 \\(x^2/a^2+y^2/b^2=1\\) 中较大的半轴决定长轴方向；极坐标中面积元是 \\(rdrd\\theta\\)，不要漏掉 \\(r\\)。求交点时要回代检查是否在原区间内。"),

  C("calc1-cauchy-criterion", "高等数学", "第1章 函数与极限", "收敛准则", "Cauchy 收敛准则与夹逼模板", raw`
\{a_n\}\text{收敛}\iff
\forall\varepsilon>0,\exists N,\ m,n>N\Rightarrow |a_m-a_n|<\varepsilon
\\
|a_n-A|\le b_n,\quad b_n\to0\Rightarrow a_n\to A
`, "了解", ["数列极限", "Cauchy准则", "证明"], "理论证明、收敛性判断。", "Cauchy 准则不用提前知道极限是谁，只看后面的项彼此是否靠近。", "证明收敛但难猜极限时，可考虑 Cauchy 思想。", "实数完备性保证 Cauchy 数列必收敛。", "\\(\\sum 1/n^2\\) 的部分和可用尾和估计证明收敛。", "考研常用夹逼和单调有界，Cauchy 更多是理解工具。"),

  C("calc1-infinite-large-small", "高等数学", "第1章 函数与极限", "无穷大量", "无穷大量与无穷小互倒", raw`
\alpha(x)\to0,\ \alpha(x)\ne0\Rightarrow \frac1{\alpha(x)}\to\infty
\\
X(x)\to\infty\Rightarrow \frac1{X(x)}\to0
\\
\alpha\text{无穷小},\ \beta\text{有界}\Rightarrow \alpha\beta\text{无穷小}
`, "必背", ["极限", "无穷小", "无穷大"], "极限性质、证明和估计。", "无穷小和无穷大量是互相倒过来的两种极端。", "乘积极限中一个因子趋 0、另一个有界，可直接判无穷小。", "由极限定义和倒数关系得到。", "\\(x\sin(1/x)\\to0\\ (x\\to0)\\)，因为 \\(\\sin(1/x)\\) 有界。", "0 乘无穷型不能直接说 0，要看无穷因子的增长速度。"),

  C("calc1-one-sided-limits", "高等数学", "第1章 函数与极限", "单侧极限", "单侧极限与间断点分类", raw`
\lim_{x\to x_0}f(x)=A\iff
\lim_{x\to x_0^-}f(x)=\lim_{x\to x_0^+}f(x)=A
\\
\text{第一类间断：左右极限存在；可去或跳跃}
\\
\text{第二类间断：至少一侧极限不存在或为无穷}
`, "必背", ["极限", "连续", "间断点"], "分段函数、绝对值函数、间断点判断。", "双侧极限存在等价于左右从两边看见同一个数。", "分段点、绝对值点、取整函数点先算左右极限。", "由极限定义按邻域左右两侧拆分得到。", "\\(f(x)=|x|/x\\) 在 0 左右极限分别为 -1 与 1，极限不存在。", "函数值本身不决定极限；可去间断可以重新定义补上。"),

  C("calc2-differentiability-continuity", "高等数学", "第2章 导数与微分", "可导关系", "可导、可微、连续关系", raw`
f\text{可导}\Rightarrow f\text{连续}
\\
f\text{连续}\not\Rightarrow f\text{可导}
\\
\text{一元：可导}\iff\text{可微},\quad
\Delta y=f'(x_0)\Delta x+o(\Delta x)
`, "必背", ["导数", "连续", "可微"], "用于概念判断、反例构造、分段函数在分界点的连续和可导判断，也常用于选择题排除错误命题。", "可导比连续更强，因为它要求局部不只是不断，还要像直线。", "判断可导先看连续，再看左右导数是否相等。", "若 \\(f\\) 在 \\(x_0\\) 可导，则 \\(f(x)-f(x_0)=\\frac{f(x)-f(x_0)}{x-x_0}(x-x_0)\\)。当 \\(x\\to x_0\\) 时，差商趋于有限导数，而 \\(x-x_0\\to0\\)，故函数增量趋于 0，即连续。", "\\(|x|\\) 在 0 连续但不可导。", "单变量中“可导 ⇒ 连续”，但“连续 ⇒ 可导”不成立；多元函数中偏导存在也不等于可微。分段函数判断可导时必须比较左右导数，不要只算形式导数。"),

  C("calc2-one-sided-derivative", "高等数学", "第2章 导数与微分", "左右导数", "左右导数与尖点判别", raw`
f'_+(x_0)=\lim_{h\to0^+}\frac{f(x_0+h)-f(x_0)}h
\\
f'_-(x_0)=\lim_{h\to0^-}\frac{f(x_0+h)-f(x_0)}h
\\
f'(x_0)\text{存在}\iff f'_+(x_0)=f'_-(x_0)
`, "常用", ["导数", "左右导数", "分段函数"], "分段函数可导性、绝对值尖点。", "尖点和分段点要从左右两边看斜率是否同一条。", "遇到分段点，先连续，再算左右导数。", "导数极限存在等价于左右极限相等。", "\\(|x|\\) 在 0 的左右导数分别为 -1 与 1。", "左右导数相等前必须函数在该点有定义且连续。"),

  C("calc2-elasticity-relative-change", "高等数学", "第2章 导数与微分", "相对变化率", "相对变化率与弹性", raw`
\frac{dy}{y}\approx \frac{f'(x)}{f(x)}dx
\\
E_x=\frac{dy/y}{dx/x}=\frac{x f'(x)}{f(x)}
\\
(\ln |f(x)|)'=\frac{f'(x)}{f(x)}
`, "了解", ["导数", "微分", "相对变化率"], "近似计算、经济应用、误差估计。", "相对变化率看的是百分比变化，不是绝对变化。", "误差传播和指数/乘积结构时，先取对数微分。", "由微分除以函数值或对数求导得到。", "圆面积 \\(A=\\pi r^2\\)，半径相对误差约放大成面积相对误差的 2 倍。", "函数值接近 0 时相对误差可能失真。"),

  C("calc3-newton-method", "高等数学", "第3章 微分中值定理与导数应用", "近似求根", "Newton 迭代公式", raw`
x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}
\\
\text{几何意义：用切线与 x 轴交点近似根}
`, "了解", ["导数应用", "近似求根", "Newton"], "数值求根、切线理解。", "Newton 法不断用局部切线替代曲线来找根。", "选择填空或理解题中看到切线迭代可识别。", "切线方程 \\(y=f(x_n)+f'(x_n)(x-x_n)\\)，令 y=0 得公式。", "求 \\(\\sqrt a\\) 可令 \\(f(x)=x^2-a\\)，得 \\(x_{n+1}=(x_n+a/x_n)/2\\)。", "初值不好或导数接近 0 时可能不收敛。", "tangent-line"),

  C("calc3-maximum-minimum-closed", "高等数学", "第3章 微分中值定理与导数应用", "最值流程", "闭区间最值计算模板", raw`
f\in C[a,b]\Rightarrow \max/\min\text{在端点或驻点取得}
\\
f'(x)=0\text{或 }f'(x)\text{不存在的内点为候选点}
\\
\text{比较 }f(a),f(b),f(x_i)
`, "必背", ["导数应用", "最值", "闭区间"], "函数最值、应用题。", "闭区间最值题不要只盯驻点，端点也可能赢。", "先找定义域和端点，再找内部候选点，最后代值比较。", "极值必要条件加连续函数最值定理给出候选集合。", "\\(f(x)=x^3\\) 在 \\([-1,1]\\) 最大最小都在端点。", "不可导点也是候选点，尤其绝对值和分段函数。"),

  C("calc3-concavity-inflection", "高等数学", "第3章 微分中值定理与导数应用", "拐点", "凹凸性与拐点判别", raw`
f''(x)>0\Rightarrow f\text{凹向上},\quad
f''(x)<0\Rightarrow f\text{凹向下}
\\
f''\text{在 }x_0\text{左右变号}\Rightarrow x_0\text{为拐点}
\\
f''(x_0)=0\text{不一定是拐点}
`, "必背", ["导数应用", "凹凸", "拐点"], "曲线作图、极值和不等式。", "凹凸看斜率是在增加还是减少。", "找拐点先解 \\(f''=0\\) 或不存在，再看二阶导是否变号。", "二阶导符号决定切线斜率单调性。", "\\(f=x^4\\) 在 0 处 \\(f''=0\\)，但不是拐点。", "只看 \\(f''=0\\) 不够，必须检查左右凹凸变化。"),

  C("calc4-integral-by-parts-table", "高等数学", "第4章 不定积分", "分部选择", "分部积分选 u 优先级", raw`
\int u\,dv=uv-\int v\,du
\\
\text{常用优先级：反三角、对数、幂、指数、三角}
\\
\int P_n(x)e^{ax}\,dx,\ \int P_n(x)\sin ax\,dx
\text{常用表格分部}
`, "技巧", ["积分", "分部积分", "表格法"], "乘积型不定积分。", "分部积分的目标是让 u 求导后更简单，让 dv 容易积分。", "看到对数/反三角乘多项式，通常让对数/反三角当 u。", "由乘积求导公式积分得到。", "\\(\\int x\ln xdx\\) 取 \\(u=\\ln x,dv=xdx\\)。", "选错 u 会越积越复杂；分部后别漏常数。"),

  C("calc4-integrals-with-log", "高等数学", "第4章 不定积分", "对数积分", "含对数积分常用套路", raw`
\int \ln x\,dx=x\ln x-x+C
\\
\int x^a\ln x\,dx=\frac{x^{a+1}}{a+1}\ln x-\frac{x^{a+1}}{(a+1)^2}+C\quad(a\ne-1)
\\
\int \frac{\ln x}{x}dx=\frac12(\ln x)^2+C
`, "常用", ["积分", "对数", "分部积分"], "对数乘幂、反常积分。", "对数积分多数靠分部，把 ln 求导成 1/x。", "看到 \\(\\ln x\\) 单独或乘幂，优先分部。", "令 \\(u=\\ln x\\)，\\(dv=x^adx\\) 即得。", "\\(\\int_1^e\ln xdx=1\\)。", "定义域通常要求 x>0；含 \\(\\ln|x|\\) 时注意区间。"),

  C("calc4-integrals-with-arctan", "高等数学", "第4章 不定积分", "反三角积分", "含反三角积分常用套路", raw`
\int \arctan x\,dx=x\arctan x-\frac12\ln(1+x^2)+C
\\
\int \arcsin x\,dx=x\arcsin x+\sqrt{1-x^2}+C
\\
\int \arccos x\,dx=x\arccos x-\sqrt{1-x^2}+C
`, "了解", ["积分", "反三角", "分部积分"], "反三角函数积分、分部积分训练。", "反三角函数求导后会变成标准根式或有理式。", "看到反三角函数作为被积函数，通常让它做 u。", "分部积分取 \\(u=\\arctan x\\)，\\(dv=dx\\)。", "\\(\\int_0^1\\arctan xdx=\\pi/4-\\ln2/2\\)。", "反三角主值区间会影响根式符号。"),

  C("calc5-mean-value-estimate", "高等数学", "第5章 定积分", "积分估值", "积分估值与单调函数界", raw`
m(b-a)\le \int_a^b f(x)dx\le M(b-a)
\\
f\text{递增}\Rightarrow
(b-a)f(a)\le\int_a^b f(x)dx\le(b-a)f(b)
\\
\left|\int_a^b f(x)dx\right|\le\int_a^b |f(x)|dx
`, "常用", ["定积分", "估值", "不等式"], "积分不等式、证明题。", "积分估值就是用矩形面积夹住曲线面积。", "证明积分大小关系时，先用函数上下界或绝对值不等式。", "由定积分保序性直接得到。", "若 \\(0\le f\le1\\)，则 \\(0\le\int_0^2f\le2\\)。", "被积函数不恒非负时，面积直觉要改成带符号积分。"),

  C("calc5-periodic-integral", "高等数学", "第5章 定积分", "周期函数积分", "周期函数定积分公式", raw`
f(x+T)=f(x)\Rightarrow
\int_a^{a+T}f(x)dx=\int_0^T f(x)dx
\\
\int_a^{a+nT}f(x)dx=n\int_0^T f(x)dx
\\
\int_0^{2\pi}f(\sin x,\cos x)dx
\text{常用对称和平移}
`, "常用", ["定积分", "周期函数", "对称性"], "三角定积分、Fourier。", "周期函数一个完整周期的积分与起点无关。", "看到完整周期区间，优先平移到最方便的区间。", "换元 \\(u=x-a\\) 并利用周期性得到。", "\\(\\int_3^{3+2\\pi}\sin xdx=0\\)。", "区间长度不是整数个周期时不能直接乘周期积分。"),

  C("calc5-even-odd-integral", "高等数学", "第5章 定积分", "奇偶函数积分", "奇偶函数定积分", raw`
f(-x)=f(x)\Rightarrow \int_{-a}^{a}f(x)dx=2\int_0^a f(x)dx
\\
f(-x)=-f(x)\Rightarrow \int_{-a}^{a}f(x)dx=0
\\
\int_{-a}^{a}f(x)g(x)dx\text{看乘积奇偶性}
`, "必背", ["定积分", "奇偶性", "对称"], "对称区间积分、概率密度。", "对称区间上，奇函数左右抵消，偶函数左右相同。", "计算前先判断被积函数整体奇偶性。", "用换元 \\(x=-t\\) 可证明。", "\\(\\int_{-1}^1x^3\cos xdx=0\\)。", "区间必须关于 0 对称；平移对称要先换中心。"),

  C("calc6-parametric-area-length", "高等数学", "第6章 定积分应用", "参数曲线应用", "参数曲线面积与弧长", raw`
A=\int_{\alpha}^{\beta}y(t)x'(t)\,dt
\quad\text{或}\quad
A=-\int_{\alpha}^{\beta}x(t)y'(t)\,dt
\\
s=\int_{\alpha}^{\beta}\sqrt{(x'(t))^2+(y'(t))^2}\,dt
\\
A_{\text{polar}}=\frac12\int_{\alpha}^{\beta}r^2(\theta)d\theta
`, "必背", ["定积分应用", "参数方程", "极坐标", "弧长"], "摆线、星形线、极坐标面积。", "参数式先把曲线运动起来，再累加扫过的面积或弧长。", "参数曲线用 \\(dx=x'(t)dt\\)，极坐标面积用小扇形。", "面积公式来自 \\(A=\int ydx\\)，弧长来自微元距离。", "极坐标心形线面积直接用 \\(\\frac12\\int r^2d\\theta\\)。", "面积方向可能为负，实际面积要按区域分段或取绝对值。"),

  C("calc6-pappus", "高等数学", "第6章 定积分应用", "几何技巧", "Pappus 质心定理", raw`
V=A\cdot 2\pi d
\\
S=L\cdot 2\pi d
\\
d=\text{质心到旋转轴距离}
`, "拓展", ["定积分应用", "质心", "旋转体", "冷门技巧"], "旋转体体积/曲面面积快速计算。", "图形绕外部轴旋转，体积等于面积乘质心走过的路程。", "选择填空遇到已知质心的旋转体可秒用。", "可看作所有面积微元旋转产生体积后积分。", "半圆绕直径外平行轴旋转可用面积和质心距离快速算体积。", "旋转轴不能穿过图形内部的复杂情况要谨慎。"),

  C("calc7-linear-system-ode", "高等数学", "第7章 微分方程", "方程组", "线性微分方程组矩阵解", raw`
\mathbf x'=A\mathbf x,\quad \mathbf x(t)=e^{At}\mathbf x(0)
\\
A=P\Lambda P^{-1}\Rightarrow e^{At}=Pe^{\Lambda t}P^{-1}
\\
\lambda_i\text{给出指数增长/衰减模式}
`, "了解", ["微分方程", "矩阵指数", "线代联系"], "线代与微分方程联系、拓展理解。", "常系数线性系统可以沿特征向量方向拆成多个一阶方程。", "遇到二维线性系统，可用特征值判断稳定性。", "矩阵指数由幂级数定义，对角化后逐个指数化。", "\\(x'=2x,y'=-y\\) 的解分别为 \\(Ce^{2t},De^{-t}\\)。", "考研数学一一般不要求完整矩阵指数法，作为理解工具。"),

  C("calc7-undetermined-coefficients", "高等数学", "第7章 微分方程", "非齐次特解", "待定系数法特解模板", raw`
y''+py'+qy=f(x)
\\
f(x)=P_m(x)e^{\alpha x}\Rightarrow y^*=x^kQ_m(x)e^{\alpha x}
\\
f(x)=e^{\alpha x}[P_m(x)\cos\beta x+Q_m(x)\sin\beta x]
\Rightarrow y^*=x^ke^{\alpha x}[R_m\cos\beta x+S_m\sin\beta x]
`, "必背", ["微分方程", "非齐次", "待定系数"], "常系数非齐次线性方程。", "特解长得像右端，若撞上齐次解就乘 x 躲开。", "先看右端类型，再看对应复根是否是特征根，决定乘 \\(x^k\\)。", "线性算子作用在指数三角多项式族内仍封闭。", "\\(y''-y=e^x\\) 中 \\(e^x\\) 撞上齐次解，所以特解设 \\(Axe^x\\)。", "重复次数 k 由特征根重数决定，不是随便乘一个 x。"),

  C("calc8-plane-line-relations", "高等数学", "第8章 向量代数与空间解析几何", "位置关系", "空间直线平面位置关系", raw`
L:\ \frac{x-x_0}{s_1}=\frac{y-y_0}{s_2}=\frac{z-z_0}{s_3},\quad
\pi:\ n\cdot(r-r_0)=0
\\
L\parallel\pi\iff s\cdot n=0
\\
L\perp\pi\iff s\parallel n
\\
\pi_1\parallel\pi_2\iff n_1\parallel n_2,\quad
\pi_1\perp\pi_2\iff n_1\cdot n_2=0
`, "必背", ["空间几何", "直线", "平面", "位置关系"], "空间解析几何综合题。", "线看方向向量，面看法向量，位置关系都变成向量关系。", "先写出方向向量和法向量，再判断平行、垂直、夹角。", "方向向量与法向量垂直说明直线方向躺在平面里。", "若直线方向 \\((1,2,3)\\) 与平面法向量点乘为 0，则直线平行于平面或在平面内。", "平行不代表在平面内，还要检查点是否满足平面方程。"),

  C("calc8-projection-vector", "高等数学", "第8章 向量代数与空间解析几何", "投影", "向量投影与方向余弦", raw`
\operatorname{proj}_{b}a=\frac{a\cdot b}{|b|^2}b
\\
\text{数量投影： }\frac{a\cdot b}{|b|}
\\
\cos\alpha=\frac{a_1}{|a|},\quad \cos\beta=\frac{a_2}{|a|},\quad \cos\gamma=\frac{a_3}{|a|}
`, "常用", ["空间几何", "投影", "方向余弦"], "距离、夹角、物理应用。", "投影就是一个向量在另一个方向上的影子。", "点到线面距离、功的计算常用投影。", "点积定义给出数量投影，再乘单位方向得到向量投影。", "\\((3,4)\\) 在 x 轴方向的投影长度为 3。", "向量投影和数量投影不同，一个是向量一个是数。"),

  C("calc9-directional-derivative", "高等数学", "第9章 多元函数微分法及应用", "方向导数", "方向导数、梯度与最大变化率", raw`
D_{\mathbf u}f(x_0,y_0)=\nabla f(x_0,y_0)\cdot \mathbf u,\quad |\mathbf u|=1
\\
\max_{|\mathbf u|=1}D_{\mathbf u}f=|\nabla f|
\\
\text{最大方向： }\mathbf u=\frac{\nabla f}{|\nabla f|}
`, "必背", ["多元微分", "方向导数", "梯度"], "方向导数、最速上升方向。", "梯度是让函数上升最快的方向。", "方向导数题先确认方向向量是否单位化。", "由全微分 \\(df=\nabla f\cdot d\mathbf r\\) 和 Cauchy 不等式得到。", "\\(f=x^2+y^2\\) 在 \\((1,0)\\) 的最大方向为 x 正方向。", "方向向量没单位化会把方向导数放大。"),

  C("calc9-second-order-taylor", "高等数学", "第9章 多元函数微分法及应用", "二阶 Taylor", "二元函数二阶 Taylor 公式", raw`
f(x_0+h,y_0+k)=f_0+f_xh+f_yk
\\
\quad+\frac12(f_{xx}h^2+2f_{xy}hk+f_{yy}k^2)+o(h^2+k^2)
`, "常用", ["多元微分", "Taylor", "Hessian"], "多元极值、近似计算。", "二元 Taylor 把曲面在一点附近展开成切平面加二次弯曲项。", "极值判别和近似计算都可从二阶 Taylor 理解。", "把一元 Taylor 推广到两个自变量，二阶项由 Hessian 给出。", "\\(e^{x+y}\\approx1+x+y+(x+y)^2/2\\)。", "混合项系数是 \\(2f_{xy}hk\\) 再乘 \\(1/2\\)，容易漏 2。"),

  C("calc10-triple-integral-types", "高等数学", "第10章 重积分", "三重积分", "三重积分区域类型与换序", raw`
\iiint_\Omega f(x,y,z)dV
=\iint_D\left[\int_{z_1(x,y)}^{z_2(x,y)}f\,dz\right]dxdy
\\
\Omega:\ z_1(x,y)\le z\le z_2(x,y),\ (x,y)\in D
\\
\text{先投影，再写上下盖}
`, "必背", ["三重积分", "投影", "换序"], "空间区域积分、体积和质量。", "三重积分就是把空间区域按某个方向切成薄片。", "写积分限先选投影平面，再找上下曲面。", "Fubini 定理把区域积分化成逐层积分。", "球体可投影到 xy 圆盘，上下盖 \\(z=\pm\\sqrt{R^2-x^2-y^2}\\)。", "空间区域不画图很容易写错投影。"),

  C("calc10-center-of-mass", "高等数学", "第10章 重积分", "质心", "重积分质心与转动惯量", raw`
\bar x=\frac1M\iiint_\Omega x\rho dV,\quad
\bar y=\frac1M\iiint_\Omega y\rho dV,\quad
\bar z=\frac1M\iiint_\Omega z\rho dV
\\
M=\iiint_\Omega \rho dV
\\
I_z=\iiint_\Omega (x^2+y^2)\rho dV
`, "了解", ["重积分", "质心", "转动惯量"], "用于重积分的物理应用：薄片质量、质心、转动惯量、引力类题。要求先明确积分区域、密度函数 \\(\\rho\\)、质量元，以及转轴或参考点。", "质心是按质量加权的平均位置。", "对称区域均匀密度时，质心坐标可先由对称性判断。", "一阶矩除以总质量给质心，二阶矩给转动惯量。", "均匀薄片 \\(D\\) 的质心满足 \\(\\bar x=M_y/M,\\bar y=M_x/M\\)，其中 \\(M=\\iint_D \\rho dA\\)。若 \\(D\\) 关于 \\(y\\) 轴对称且密度也对称，则 \\(\\bar x=0\\)，只需计算 \\(\\bar y\\)。", "对称性必须同时满足“区域对称”和“密度对称”。转动惯量的被积函数是距离平方乘密度，别把 \\(I_x\\) 和 \\(I_y\\) 的距离写反：绕 \\(x\\) 轴用 \\(y^2\\)，绕 \\(y\\) 轴用 \\(x^2\\)。"),

  C("calc11-param-line-surface", "高等数学", "第11章 曲线积分与曲面积分", "参数化", "曲线曲面参数化计算模板", raw`
r=r(t):\quad ds=|r'(t)|dt
\\
\int_L Pdx+Qdy+Rdz=\int_\alpha^\beta \mathbf F(r(t))\cdot r'(t)dt
\\
r=r(u,v):\quad dS=|r_u\times r_v|dudv
\\
\iint_\Sigma \mathbf F\cdot n\,dS=\iint_D \mathbf F(r(u,v))\cdot(r_u\times r_v)dudv
`, "必背", ["曲线积分", "曲面积分", "参数化"], "第一/第二型曲线曲面积分通算。", "参数化就是把曲线曲面变成一个变量或两个变量的运动。", "复杂线面积分先参数化，方向由参数增大方向或叉乘方向决定。", "微元长度和面积分别由速度长度、叉乘面积给出。", "圆 \\(r=(\cos t,\sin t)\\)，\\(ds=dt\\)。", "第二型积分方向不能丢，叉乘顺序会改符号。"),

  C("calc11-green-area", "高等数学", "第11章 曲线积分与曲面积分", "Green 应用", "Green 公式面积计算", raw`
A=\iint_D1\,dxdy
\\
A=\frac12\oint_{\partial D}x\,dy-y\,dx
\\
A=\oint_{\partial D}x\,dy=-\oint_{\partial D}y\,dx
\quad(\partial D\text{取正向})
`, "技巧", ["Green", "面积", "曲线积分"], "参数曲线围成面积、选择填空。", "面积也能用边界绕一圈算出来。", "看到封闭曲线参数式求面积，可直接用 Green 面积公式。", "令 \\(P=-y/2,Q=x/2\\)，则 \\(Q_x-P_y=1\\)。", "椭圆 \\(x=a\cos t,y=b\sin t\\) 面积为 \\(\\pi ab\\)。", "曲线方向若是顺时针，积分会取负。"),

  C("calc11-gauss-common", "高等数学", "第11章 曲线积分与曲面积分", "Gauss 应用", "Gauss 公式常用通量模板", raw`
\iint_{\partial\Omega}\mathbf F\cdot n\,dS
=\iiint_\Omega \nabla\cdot\mathbf F\,dV
\\
\mathbf F=(x,y,z)\Rightarrow \nabla\cdot\mathbf F=3
\\
\iint_{\partial\Omega}(x\,dydz+y\,dzdx+z\,dxdy)=3V
`, "常用", ["Gauss", "通量", "曲面积分"], "封闭曲面通量、体积计算。", "闭曲面通量可以变成体内源强总和。", "封闭曲面且第二型曲面积分复杂时，优先看散度。", "Gauss 公式把边界通量与区域内散度联系起来。", "球面外侧上 \\((x,y,z)\\) 的通量为 \\(3\\cdot\\frac43\\pi R^3\\)。", "曲面必须封闭；不封闭要补面再减。"),

  C("calc11-stokes-circulation", "高等数学", "第11章 曲线积分与曲面积分", "Stokes 应用", "Stokes 公式环流模板", raw`
\oint_{\partial\Sigma}\mathbf F\cdot d\mathbf r
=\iint_\Sigma(\nabla\times\mathbf F)\cdot n\,dS
\\
\text{边界方向与法向满足右手定则}
`, "了解", ["Stokes", "旋度", "曲线积分"], "空间曲线积分转曲面积分。", "Stokes 把沿边界绕一圈的环流变成曲面上的旋度通量。", "空间闭合曲线积分难算时，找一张方便曲面套 Stokes。", "它是 Green 公式在三维中的推广。", "边界是圆时可取圆盘作为曲面简化。", "方向必须按右手定则配套，否则差一个负号。"),

  C("calc12-series-remainder", "高等数学", "第12章 无穷级数", "余项估计", "交错级数与 Taylor 余项估计", raw`
\sum(-1)^{n-1}a_n,\ a_n\downarrow0
\Rightarrow |R_n|\le a_{n+1}
\\
e^x=\sum_{k=0}^{n}\frac{x^k}{k!}+R_n,\quad
R_n=\frac{e^\xi x^{n+1}}{(n+1)!}
\\
\sin x=x-\frac{x^3}{3!}+\cdots+R_n
`, "常用", ["级数", "余项", "误差估计"], "近似计算、选择填空估误差。", "余项估计告诉你截断级数后最多错多少。", "交错级数近似时，误差不超过下一项。", "Leibniz 判别的单调趋零结构给出余项界。", "\\(\\ln2=1-1/2+1/3-\cdots\\)，取到 \\(1/n\\) 误差不超过 \\(1/(n+1)\\)。", "交错余项界要求项单调趋零。"),

  C("calc12-uniform-convergence-lite", "高等数学", "第12章 无穷级数", "函数项级数", "一致收敛 M 判别法", raw`
|u_n(x)|\le M_n,\quad \sum M_n\text{收敛}
\Rightarrow \sum u_n(x)\text{一致收敛}
\\
\sum u_n(x)\text{一致收敛且 }u_n\text{连续}\Rightarrow \sum u_n\text{连续}
`, "了解", ["函数项级数", "一致收敛", "M判别"], "函数项级数理论、拓展题。", "一致收敛意味着收敛速度对所有 x 都足够统一。", "遇到函数项级数要交换极限、积分、连续性时，想一致收敛条件。", "Weierstrass M 判别用一个收敛正项级数统一压住所有函数项。", "\\(\\sum x^n/n^2\\) 在 \\([-1,1]\\) 上由 \\(1/n^2\\) 控制一致收敛。", "数学一常规计算不深考一致收敛，标为了解即可。"),

  C("linear1-row-column-operations", "线性代数", "第1章 行列式", "行列式计算", "行列式行列变换规则", raw`
R_i\leftrightarrow R_j\Rightarrow |A|\text{变号}
\\
R_i\gets kR_i\Rightarrow |A|\text{乘 }k
\\
R_i\gets R_i+kR_j\Rightarrow |A|\text{不变}
\\
|AB|=|A||B|,\quad |A^T|=|A|
`, "必背", ["行列式", "初等变换", "计算"], "用于行列式快速计算、化三角、证明行列式性质和参数行列式讨论。行变换与列变换都可用，但每一步对行列式数值的影响必须记账。", "行列式计算靠把矩阵化成三角，同时记录变换对值的影响。", "优先用倍加变换造零，因为它不改变行列式。", "行列式多重线性和交错性给出三条规则。", "例如把某一行加上另一行的 \\(k\\) 倍，行列式不变；交换两行一次，行列式变号；某行整体乘 \\(k\\)，行列式也乘 \\(k\\)。计算时可先用倍加造零，再按零多的行列展开。", "不要把矩阵初等变换和行列式变换混成一套规则：倍加不改变行列式，但倍乘会改变行列式。若既做行变换又做列变换，符号和因子更要逐步记录。"),

  C("linear2-elementary-matrices", "线性代数", "第2章 矩阵及其运算", "初等矩阵", "初等矩阵与初等变换", raw`
P A:\text{对 }A\text{作行变换}
\\
A P:\text{对 }A\text{作列变换}
\\
A\text{可逆}\iff A\text{可由初等矩阵乘积表示}
`, "必背", ["矩阵", "初等矩阵", "逆矩阵"], "求逆、矩阵等价、秩。", "初等矩阵就是把一次初等变换做成一个矩阵。", "左乘改行，右乘改列；求逆时对 \\((A|E)\\) 同步行变换。", "初等变换等价于乘可逆初等矩阵。", "\\((A|E)\\to(E|A^{-1})\\) 可求逆矩阵。", "左右乘不要混，尤其列变换对应右乘。"),

  C("linear2-special-matrices", "线性代数", "第2章 矩阵及其运算", "特殊矩阵", "幂等、幂零、对合矩阵", raw`
A^2=A\Rightarrow A^n=A\ (n\ge1),\quad \lambda\in\{0,1\}
\\
A^k=0\Rightarrow \lambda=0,\quad |E-A|=1\text{若 }A\text{幂零}
\\
A^2=E\Rightarrow A^{-1}=A,\quad \lambda\in\{1,-1\}
`, "技巧", ["矩阵", "幂等", "幂零", "特征值"], "矩阵高次幂、特征值选择填空。", "特殊矩阵的代数关系会强迫特征值只能取少数几个值。", "看到 \\(A^2=A\\)、\\(A^k=0\\)、\\(A^2=E\\) 先套特征值关系。", "若 \\(A\\xi=\\lambda\\xi\\)，代入矩阵多项式即可得到 \\(p(\\lambda)=0\\)。", "投影矩阵常满足 \\(P^2=P\\)。", "特征值受限不代表矩阵一定可对角化，需看重数和特征向量。"),

  C("linear3-least-squares", "线性代数", "第3章 初等变换与线性方程组", "最小二乘", "最小二乘正规方程", raw`
\min_x\|Ax-b\|^2
\\
A^TAx=A^Tb
\\
A\text{列满秩}\Rightarrow x=(A^TA)^{-1}A^Tb
`, "了解", ["方程组", "最小二乘", "投影"], "超定方程组、统计回归理解。", "最小二乘是在列空间里找离 b 最近的投影点。", "方程组无精确解但要最佳近似时，想正规方程。", "误差 \\(b-Ax\\) 与列空间正交，故 \\(A^T(b-Ax)=0\\)。", "线性回归参数估计就是最小二乘。", "若 A 列不满秩，解可能不唯一。"),

  C("linear4-linear-dependence-tricks", "线性代数", "第4章 向量组线性相关性", "相关性技巧", "向量组线性相关判别技巧", raw`
m>n\Rightarrow \mathbb R^n\text{中 }m\text{个向量必相关}
\\
\alpha_1,\dots,\alpha_s\text{无关，加入 }\beta\text{后相关}
\Rightarrow \beta\text{可由 }\alpha_i\text{线性表示}
\\
r(\alpha_1,\dots,\alpha_s)=s\iff\text{线性无关}
`, "必背", ["向量组", "线性相关", "秩"], "用于快速判断向量组线性相关性、选择填空和证明题。尤其适合向量个数与维数比较、秩判断、含零向量或成比例向量的场景。", "向量数量超过空间维数时，必然有人是多余的。", "判断相关性优先看向量个数、秩和能否线性表示。", "向量组的秩等于其极大线性无关组所含向量个数。若向量个数大于秩，就存在非平凡线性组合为零，因此相关；若向量个数等于秩，则无关。", "在三维空间中 4 个向量必线性相关，因为 \\(r\\le3<4\\)。若一个向量组含零向量，则取零向量系数为 1、其他系数为 0，就得到非平凡零组合，所以必相关。", "相关并不表示每个向量都能由其他向量表示，零系数情况要小心。"),

  C("linear4-subspace-criteria", "线性代数", "第4章 向量组线性相关性", "子空间", "子空间判别与生成空间", raw`
W\le V\iff
\alpha,\beta\in W,\ k,l\in\mathbb R\Rightarrow k\alpha+l\beta\in W
\\
\operatorname{span}\{\alpha_1,\dots,\alpha_s\}
=\left\{\sum k_i\alpha_i\right\}
\\
\dim(U+W)=\dim U+\dim W-\dim(U\cap W)
`, "了解", ["线性空间", "子空间", "维数"], "用于判断集合是否为子空间、理解生成空间、列空间、零空间和解空间。常见于线代概念题和证明题。", "子空间不是普通“几何图形”，而是对加法和数乘封闭的向量集合；只要能任意线性组合后仍留在集合内，它才像一个小型线性空间。", "看到集合是否为线性空间，只需查零向量和线性组合封闭。", "生成空间定义就是所有线性组合构成的集合。", "过原点的平面是 \\(\\mathbb R^3\\) 的子空间。", "必须包含零向量且对任意线性组合封闭；不过原点的直线或平面不是子空间。非齐次方程组的解集一般不是子空间，但齐次方程组的解集一定是子空间。"),

  C("linear5-eigenvalue-tricks", "线性代数", "第5章 相似矩阵及二次型", "特征值技巧", "特征值常用变换公式", raw`
A\xi=\lambda\xi\Rightarrow
A^k\xi=\lambda^k\xi,\quad f(A)\xi=f(\lambda)\xi
\\
A\text{可逆}\Rightarrow A^{-1}\xi=\lambda^{-1}\xi
\\
(A+cE)\xi=(\lambda+c)\xi
\\
|A|=\prod\lambda_i,\quad \operatorname{tr}A=\sum\lambda_i
`, "必背", ["特征值", "矩阵多项式", "技巧"], "特征值选择填空、矩阵高次幂。", "同一个特征向量经过矩阵多项式作用仍在同一方向上。", "看到 \\(A^2,A^{-1},A+cE,f(A)\\) 的特征值，直接改 \\(\\lambda\\)。", "由特征方程反复作用即可。", "若 A 特征值为 2，则 \\(A^2+E\\) 对应特征值为 5。", "这些公式针对同一特征向量；不同矩阵相加一般不能直接加特征值。"),

  C("linear5-diagonalizable-criteria", "线性代数", "第5章 相似矩阵及二次型", "对角化判别", "可对角化判别全表", raw`
A\sim\Lambda\iff \exists n\text{个线性无关特征向量}
\\
n\text{个互异特征值}\Rightarrow A\text{可对角化}
\\
\forall\lambda_i:\quad
\text{几何重数}=\text{代数重数}\Rightarrow A\text{可对角化}
\\
A=A^T\Rightarrow A\text{正交对角化}
`, "必背", ["对角化", "特征向量", "实对称矩阵"], "相似对角化、矩阵高次幂。", "对角化的本质是找到足够多特征方向当坐标轴。", "先看特征值是否互异；有重根再查特征向量个数。", "相似变换矩阵 P 的列就是一组线性无关特征向量。", "二阶矩阵两个不同特征值必可对角化。", "重特征值不代表不能对角化，要看几何重数。", "matrix-transform"),

  C("linear6-equivalence-similarity-congruence", "线性代数", "第6章 线性空间与线性变换【拓展】", "三种关系", "等价、相似、合同对比", raw`
B=PAQ\quad(P,Q\text{可逆})\Rightarrow A,B\text{等价，秩相同}
\\
B=P^{-1}AP\Rightarrow A,B\text{相似，特征值相同}
\\
B=C^TAC\Rightarrow A,B\text{合同，二次型惯性指数相同}
`, "必背", ["矩阵等价", "相似", "合同", "二次型"], "线代概念辨析、选择填空。", "三种关系保留的信息不同：等价保秩，相似保特征，合同保二次型正负性。", "看到题目问不变量，先判断是哪种关系。", "三种变换分别对应行列变换、换基、二次型变量替换。", "相似矩阵行列式和迹相同。", "合同不一定相似，相似也不一定合同。"),

  C("prob1-inclusion-exclusion", "概率论", "第1章 随机事件与概率", "容斥公式", "容斥原理与加法公式", raw`
P(A\cup B)=P(A)+P(B)-P(AB)
\\
P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(AB)-P(AC)-P(BC)+P(ABC)
\\
P(A^c)=1-P(A)
`, "必背", ["概率", "容斥", "事件"], "事件概率计算、至少一个发生。", "容斥是在避免重复计算交集。", "看到“至少一个”“至少两个”，优先转补集或容斥。", "集合计数的容斥原理直接对应概率测度。", "至少一个发生：\\(P(A\\cup B)=P(A)+P(B)-P(AB)\\)。", "事件独立与互斥不要混，交集项不能随便删。"),

  C("prob1-conditional-independence", "概率论", "第1章 随机事件与概率", "条件独立", "条件概率乘法链式公式", raw`
P(ABC)=P(A)P(B|A)P(C|AB)
\\
P(A_1\cdots A_n)=P(A_1)\prod_{k=2}^{n}P(A_k|A_1\cdots A_{k-1})
\\
A,B\text{在 }C\text{下条件独立}\iff P(AB|C)=P(A|C)P(B|C)
`, "常用", ["条件概率", "乘法公式", "条件独立"], "分步试验、贝叶斯网络直觉。", "链式公式把一个复杂联合事件拆成按时间顺序发生的条件概率。", "抽球不放回、连续决策、分步事件用链式公式。", "由条件概率定义反复变形得到。", "三次不放回抽到指定颜色可逐步乘条件概率。", "条件独立不是无条件独立，条件改变后关系可能改变。"),

  C("prob2-density-cdf-properties", "概率论", "第2章 随机变量及其分布", "分布函数", "分布函数与密度性质", raw`
F(x)=P(X\le x),\quad F(-\infty)=0,\ F(+\infty)=1
\\
F(x)\text{单调不减且右连续}
\\
P(a<X\le b)=F(b)-F(a)
\\
f(x)\ge0,\quad \int_{-\infty}^{\infty}f(x)dx=1
`, "必背", ["分布函数", "密度", "随机变量"], "用于由分布函数求概率、由密度求分布、判断随机变量类型，以及处理连续型和离散型端点概率差异。", "分布函数 (F(x)) 是从左到右累积到 (x) 的概率；密度函数不是概率本身，而是概率在小区间内的分布强度。", "求区间概率优先用分布函数差；连续型再用密度积分。", "单调性来自事件包含：若 \\(x_1<x_2\\)，则 \\(\\{X\\le x_1\\}\\subset\\{X\\le x_2\\}\\)。右连续性来自概率测度的连续性。连续型中 \\(P(a<X\\le b)=F(b)-F(a)=\\int_a^b f(x)dx\\)。", "连续型 \\(P(X=a)=0\\)，所以开闭端点通常无影响。", "连续型随机变量单点概率为 0，开闭端点通常无影响；离散型端点质量不能忽略。密度函数可以大于 1，但积分总面积必须为 1。"),

  C("prob2-min-max-distribution", "概率论", "第2章 随机变量及其分布", "最大最小", "最大值最小值分布（分布函数法）", raw`
M=\max(X_1,\dots,X_n):\quad F_M(x)=F^n(x)
\\
m=\min(X_1,\dots,X_n):\quad P(m>x)=[1-F(x)]^n
\\
F_m(x)=1-[1-F(x)]^n
`, "常用", ["随机变量", "最大值", "最小值", "独立同分布"], "样本极值、寿命问题（侧重分布函数CDF写法）。", "最大值不超过 x 等价于所有样本都不超过 x。", "极值分布优先从分布函数或生存函数写事件；密度法见第3章。", "独立性让联合概率拆成乘积。", "n 个独立均匀 \\(U(0,1)\\) 的最大值分布为 \\(x^n\\)。", "要求独立同分布；若不同分布要写成各自分布函数乘积。"),

  C("prob3-conditional-density", "概率论", "第3章 多维随机变量", "条件分布", "条件密度与条件分布", raw`
f_{X|Y}(x|y)=\frac{f_{X,Y}(x,y)}{f_Y(y)}\quad(f_Y(y)>0)
\\
P(X\in A|Y=y)=\int_A f_{X|Y}(x|y)dx
\\
X,Y\text{独立}\Rightarrow f_{X|Y}(x|y)=f_X(x)
`, "必背", ["二维分布", "条件密度", "独立性"], "二维连续型随机变量、条件期望。", "条件密度是在固定 Y 的情况下重新归一化 X 的分布。", "先求边缘 \\(f_Y(y)\\)，再用联合除以边缘。", "条件概率密度来自联合密度在截线上的归一化。", "若联合密度在三角区域上常数，条件密度区间会随 y 变化。", "条件密度只在 \\(f_Y(y)>0\\) 的点有意义。"),

  C("prob3-sum-difference-distribution", "概率论", "第3章 多维随机变量", "和差分布", "和差商积的分布套路", raw`
Z=X+Y:\quad f_Z(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)dx
\\
Z=X-Y:\quad f_Z(z)=\int f_X(x)f_Y(x-z)dx
\\
Z=XY:\quad f_Z(z)=\int f_X(x)f_Y(z/x)\frac{1}{|x|}dx
\\
Z=X/Y:\quad f_Z(z)=\int |y|f_X(zy)f_Y(y)dy
`, "技巧", ["二维分布", "卷积", "变量变换"], "独立随机变量函数分布。", "和差商积都可通过补一个变量做二维变换。", "和的分布用卷积，积商分布注意 Jacobi 绝对值。", "令新变量与辅助变量构成一一变换，套二维密度变换。", "两个独立指数变量之和是 Gamma 型密度。", "积分范围由原变量支持集决定，不能机械写全实轴。", "distribution-plot"),

  C("prob4-common-moments-table", "概率论", "第4章 数字特征", "常见分布矩", "常见分布期望方差表", raw`
B(n,p):\ E=np,\ D=np(1-p)
\\
P(\lambda):\ E=D=\lambda
\\
U(a,b):\ E=\frac{a+b}{2},\ D=\frac{(b-a)^2}{12}
\\
N(\mu,\sigma^2):\ E=\mu,\ D=\sigma^2
\\
Exp(\lambda):\ E=\frac1\lambda,\ D=\frac1{\lambda^2}
`, "必背", ["期望", "方差", "常见分布"], "概率计算、统计推断。", "常见分布的均值方差是概率题的乘法口诀表。", "识别分布后先写期望方差，很多题就降维了。", "由定义求和/积分或矩母函数求导可得。", "泊松分布均值和方差都等于 \\(\\lambda\\)。", "指数分布参数约定可能不同，先确认 \\(\\lambda\\) 是率参数。"),

  C("prob4-correlation-independence", "概率论", "第4章 数字特征", "相关与独立", "不相关、独立与正态特例", raw`
X,Y\text{独立}\Rightarrow \operatorname{Cov}(X,Y)=0
\\
\operatorname{Cov}(X,Y)=0\not\Rightarrow X,Y\text{独立}
\\
(X,Y)\text{二维正态时： }\rho=0\iff X,Y\text{独立}
`, "常用", ["协方差", "相关系数", "独立性", "正态分布"], "概念判断、选择题。", "不相关只说明线性关系消失，独立说明所有关系都消失。", "一般题不能用协方差为 0 推独立，除非二维正态等特殊条件。", "独立时 \\(E(XY)=EXEY\\)，故协方差为 0。", "令 X 对称取 -1,0,1，Y=X^2，可出现不相关但不独立。", "看到二维正态才能放心用 \\(\\rho=0\\iff独立\\)。"),

  C("prob5-convergence-types", "概率论", "第5章 大数定律与中心极限定理", "收敛类型", "依概率收敛与分布收敛", raw`
X_n\xrightarrow{P}X\iff
\forall\varepsilon>0,\ P(|X_n-X|>\varepsilon)\to0
\\
X_n\xrightarrow{d}X\iff F_n(x)\to F(x)\quad(F\text{连续点})
\\
X_n\xrightarrow{P}X\Rightarrow X_n\xrightarrow{d}X
`, "了解", ["依概率收敛", "分布收敛", "极限定理"], "大数定律、中心极限定理概念题。", "依概率收敛是随机变量本身越来越靠近，分布收敛只是分布形状靠近。", "大数定律给依概率收敛，中心极限定理给分布收敛。", "定义直接比较概率或分布函数。", "\\(\\bar X\\xrightarrow{P}\\mu\\) 是大数定律形式。", "分布收敛不一定推出依概率收敛。"),

  C("prob5-de-moivre-laplace", "概率论", "第5章 大数定律与中心极限定理", "二项正态近似", "De Moivre-Laplace 局部与积分近似", raw`
X\sim B(n,p),\quad
\frac{X-np}{\sqrt{np(1-p)}}\approx N(0,1)
\\
P(a\le X\le b)\approx
\Phi\left(\frac{b+0.5-np}{\sqrt{npq}}\right)
-\Phi\left(\frac{a-0.5-np}{\sqrt{npq}}\right)
`, "常用", ["二项分布", "正态近似", "连续性修正"], "二项大样本概率近似。", "二项分布在 n 大时会长得像正态钟形。", "看到 n 大、p 不极端的二项概率，标准化并做连续性修正。", "中心极限定理用于 Bernoulli 和得到该近似。", "\\(B(100,0.5)\\) 求 \\(40\le X\le60\\) 可用正态近似。", "连续性修正是离散到连续的关键，不要漏。", "clt-demo"),

  C("prob6-unbiased-sample-variance", "概率论", "第6章 数理统计基本概念", "样本方差", "样本方差无偏性", raw`
S^2=\frac1{n-1}\sum_{i=1}^{n}(X_i-\bar X)^2
\\
E(S^2)=\sigma^2
\\
\sum(X_i-\bar X)^2=\sum X_i^2-n\bar X^2
`, "必背", ["数理统计", "样本方差", "无偏性"], "抽样分布、参数估计。", "样本方差除以 n-1 是为了补偿用样本均值带来的自由度损失。", "统计推断中看到 \\(S^2\\)，默认是无偏样本方差。", "平方和分解和期望计算可推出无偏性。", "正态总体下 \\((n-1)S^2/\\sigma^2\\sim\\chi^2(n-1)\\)。", "有些教材用 \\(1/n\\) 定义样本二阶中心矩，和 \\(S^2\\) 要区分。"),

  C("prob7-mle-common", "概率论", "第7章 参数估计", "极大似然", "常见分布 MLE 速查（基础版）", raw`
Bernoulli(p):\quad \hat p=\bar X
\\
Poisson(\lambda):\quad \hat\lambda=\bar X
\\
N(\mu,\sigma^2):\quad \hat\mu=\bar X,\quad
\hat\sigma^2_{\text{MLE}}=\frac1n\sum(X_i-\bar X)^2
\\
Exp(\lambda):\quad \hat\lambda=\frac1{\bar X}
`, "常用", ["极大似然", "参数估计", "MLE", "基础版"], "参数估计大题验算；基础四分布（Bernoulli/Poisson/正态/指数）的MLE结论。", "MLE 让已观测样本出现的概率最大。", "先写似然，再取对数求导；常见结果可用于验算。", "对数似然求导令零得到。", "泊松样本的极大似然估计为样本均值。", "正态方差的 MLE 除以 n，不是无偏估计的 n-1。"),

  C("prob7-method-of-moments-common", "概率论", "第7章 参数估计", "矩估计", "常见矩估计模板", raw`
E_\theta X=\mu(\theta),\quad \bar X=\mu(\theta)
\\
E_\theta X^2=m_2(\theta),\quad \frac1n\sum X_i^2=m_2(\theta)
\\
\text{参数个数 = 需要匹配的矩个数}
`, "常用", ["矩估计", "参数估计"], "参数估计计算题。", "矩估计就是让样本矩模仿总体矩。", "一个参数用一阶矩，两个参数通常用一阶和二阶原点矩。", "大数定律说明样本矩会靠近总体矩。", "均匀分布 \\(U(0,\theta)\\) 中 \\(EX=\\theta/2\\)，矩估计 \\(\\hat\theta=2\\bar X\\)。", "矩估计不一定唯一，也不一定比 MLE 更优。"),

  C("prob8-rejection-regions", "概率论", "第8章 假设检验", "拒绝域", "单侧双侧拒绝域速查", raw`
H_1:\mu>\mu_0\Rightarrow Z>z_\alpha
\\
H_1:\mu<\mu_0\Rightarrow Z<-z_\alpha
\\
H_1:\mu\ne\mu_0\Rightarrow |Z|>z_{\alpha/2}
\\
\text{t 检验同理换 }t_\alpha(n-1)
`, "必背", ["假设检验", "拒绝域", "单侧检验", "双侧检验"], "假设检验步骤题。", "备择假设指向哪边，拒绝域就放在哪边。", "先看备择假设是大于、小于还是不等，再选单侧/双侧分位点。", "显著性水平是拒绝域在原假设下的尾概率。", "\\(H_1:\mu>\mu_0\\) 时样本均值太大才拒绝。", "双侧检验要把 \\(\\alpha\\) 分到两边。"),

  C("prob8-variance-test", "概率论", "第8章 假设检验", "方差检验", "正态总体方差检验", raw`
H_0:\sigma^2=\sigma_0^2,\quad
\chi^2=\frac{(n-1)S^2}{\sigma_0^2}\sim\chi^2(n-1)
\\
H_1:\sigma^2>\sigma_0^2\Rightarrow \chi^2>\chi^2_{\alpha}(n-1)
\\
H_1:\sigma^2\ne\sigma_0^2\Rightarrow
\chi^2<\chi^2_{1-\alpha/2}\text{ 或 }\chi^2>\chi^2_{\alpha/2}
`, "常用", ["假设检验", "方差检验", "卡方分布"], "单总体正态方差检验。", "方差检验看样本波动是否大到不像原假设。", "正态总体方差检验用卡方统计量。", "由正态总体抽样分布 \\((n-1)S^2/\\sigma^2\\sim\\chi^2\\) 得到。", "检验机器精度是否低于标准可转化为方差是否过大。", "卡方分布不对称，左右分位点不要照搬正态。"),

  C("cold-jensen", "冷门技巧", "冷门但高收益技巧库", "不等式", "Jensen 不等式", raw`
f\text{凸}\Rightarrow
f\left(\sum \lambda_i x_i\right)\le \sum \lambda_i f(x_i),
\quad \lambda_i\ge0,\ \sum\lambda_i=1
\\
f(EX)\le E[f(X)]
`, "拓展", ["Jensen", "凸函数", "不等式", "冷门技巧"], "不等式、期望估计、选择填空。", "凸函数的平均点函数值不超过函数值平均。", "看到凸函数、加权平均、期望中的函数，可想到 Jensen。", "由凸函数图像在弦下方或切线性质推广得到。", "\\(E(X^2)\ge(EX)^2\\) 是 Jensen 的特例。", "必须判断凸凹方向；凹函数不等号反向。"),

  C("cold-toeplitz", "冷门技巧", "冷门但高收益技巧库", "数列极限", "Toeplitz 定理与加权平均", raw`
a_n\to A,\quad p_{n,k}\ge0,\quad \sum_{k=1}^{n}p_{n,k}=1
\\
\max_{1\le k\le n}p_{n,k}\to0
\Rightarrow \sum_{k=1}^{n}p_{n,k}a_k\to A
\\
\frac{a_1+\cdots+a_n}{n}\to A
`, "拓展", ["Toeplitz", "数列极限", "Cesaro", "冷门技巧"], "数列平均、加权平均极限。", "Toeplitz 定理说稳定序列的温和加权平均仍稳定到同一极限。", "看到平均值极限、加权和极限，可用它理解。", "把前面有限项和后面尾项分开估计即可证明。", "若 \\(a_n\\to A\\)，则 Cesaro 平均也趋于 A。", "权重条件必须满足，不能对任意权重乱用。"),

  C("cold-euler-maclaurin-lite", "冷门技巧", "冷门但高收益技巧库", "求和估计", "Euler-Maclaurin 直觉版", raw`
\sum_{k=1}^{n}f(k)\approx \int_1^n f(x)dx+\frac{f(1)+f(n)}2
\\
1+\frac12+\cdots+\frac1n=\ln n+\gamma+o(1)
`, "拓展", ["Euler-Maclaurin", "求和估计", "冷门技巧"], "数列求和渐近、调和级数估计。", "求和可以看成积分加端点修正。", "看到大 n 求和但没有闭式时，可用积分比较或这个直觉。", "梯形近似加高阶修正项得到 Euler-Maclaurin。", "\\(\\sum_{k=1}^{n}k^p\\) 主项约为 \\(n^{p+1}/(p+1)\\)。", "考研大题优先写积分比较，不必硬背完整公式。"),

  C("cold-beta-gamma", "冷门技巧", "冷门但高收益技巧库", "积分", "Beta/Gamma 快速识别", raw`
\Gamma\left(\frac12\right)=\sqrt{\pi},\quad \Gamma(n+1)=n!
\\
B(p,q)=2\int_0^{\pi/2}\sin^{2p-1}x\cos^{2q-1}x\,dx
\\
\int_0^\infty \frac{x^{p-1}}{1+x}\,dx=\frac{\pi}{\sin \pi p}\quad(0<p<1)
`, "拓展", ["Beta", "Gamma", "冷门技巧", "积分"], "高次三角积分、反常积分、概率密度归一化。", "Beta/Gamma 是把一大类高次幂积分压成参数函数。", "选择填空可快速识别；大题优先写常规换元/分部，更稳。", "Beta 与 Gamma 的关系可由二重积分换元得到。", "\\(\\int_0^{\\pi/2}\\sin^3x\cos^2xdx=\\frac12B(2,3/2)\\)。", "参数收敛条件必须检查；不会推时不要硬写冷门结论。"),

  C("cold-cauchy-condensation", "冷门技巧", "冷门但高收益技巧库", "级数", "Cauchy 凝聚判别与 Leibniz 判别", raw`
a_n\downarrow0,\ a_n\ge0:\quad
\sum_{n=1}^{\infty}a_n\text{收敛}\iff \sum_{k=0}^{\infty}2^k a_{2^k}\text{收敛}
\\
a_n\downarrow0\Rightarrow \sum(-1)^{n-1}a_n\text{收敛},\quad |R_n|\le a_{n+1}
`, "技巧", ["Cauchy凝聚", "Leibniz", "级数", "冷门技巧"], "含 \\(1/(n\ln n)\\)、交错级数的判敛。", "凝聚判别把慢变正项级数抽样放大；Leibniz 处理单调趋零交错项。", "看到 \\(n\\ln n\\)、\\(n(\ln n)^p\\) 想凝聚；看到 \\((-1)^n\\) 想 Leibniz。", "按二倍区间分组比较可得凝聚判别。", "\\(\\sum\\frac1{n\ln n}\\) 凝聚为 \\(\\sum1/k\\)，发散。", "凝聚要求正项单调递减；交错级数要检查单调趋零。"),

  C("cold-schur-complement", "冷门技巧", "冷门但高收益技巧库", "线代", "分块行列式与 Schur 补", raw`
\begin{vmatrix}A&B\\0&D\end{vmatrix}=|A||D|
\\
\begin{vmatrix}A&B\\C&D\end{vmatrix}=|A|\cdot|D-CA^{-1}B|\quad(A\text{可逆})
`, "了解", ["分块矩阵", "Schur补", "行列式", "冷门技巧"], "分块矩阵行列式、参数矩阵计算。", "Schur 补就是用块消元把左下角消成 0。", "看见块矩阵且某块可逆时，可尝试分块初等变换。", "分块高斯消元不改变或可控改变行列式。", "\\(\\begin{vmatrix}E&B\\\\C&D\\end{vmatrix}=|D-CB|\\)。", "块矩阵乘法不能交换，公式条件和顺序不能乱。"),

  C("cold-wallis", "冷门技巧", "冷门但高收益技巧库", "积分", "华里士公式（Wallis）", raw`
I_n=\int_0^{\pi/2}\sin^n x\,dx=\int_0^{\pi/2}\cos^n x\,dx
\\
I_n=\frac{n-1}{n}I_{n-2}
\\
I_{2m}=\frac{(2m-1)!!}{(2m)!!}\frac{\pi}{2},\quad
I_{2m+1}=\frac{(2m)!!}{(2m+1)!!}
`, "技巧", ["华里士", "Wallis", "积分", "冷门技巧"], "高次三角积分，尤其 \\(0\\) 到 \\(\\pi/2\\)。", "华里士公式就是高次三角积分的递推压缩器。", "看到 \\(\\sin^n x\\)、\\(\\cos^n x\\) 在 \\([0,\\pi/2]\\) 上积分，直接想它。", "对 \\(I_n=\\int\\sin^{n-1}x\\sin xdx\\) 分部，可得到 \\(I_n=(n-1)I_{n-2}/n\\)。", "\\(\\int_0^{\\pi/2}\\sin^5xdx=\\frac{4!!}{5!!}=\\frac{8}{15}\\)。", "区间不是 \\([0,\\pi/2]\\) 时不要硬套；先用对称性变换。", "wallis-recursion", ["calc5-improper-gamma-beta"]),

  C("cold-frullani", "冷门技巧", "冷门但高收益技巧库", "积分", "Frullani 型积分", raw`
\int_0^\infty \frac{f(ax)-f(bx)}{x}\,dx=[f(0)-f(\infty)]\ln\frac{b}{a}
`, "了解", ["Frullani", "反常积分", "冷门技巧"], "特殊反常积分，函数在 0 与无穷处有极限。", "它把两个尺度下的函数差异压缩成一个对数。", "只在题型结构非常明显时使用；考研以识别为主。", "可通过换元和积分区间差分直观理解。", "\\(\\int_0^\infty\\frac{e^{-ax}-e^{-bx}}{x}dx=\\ln\\frac{b}{a}\\)。", "适用条件较细，不能随便套。"),

  C("cold-raabe-dirichlet", "冷门技巧", "冷门但高收益技巧库", "级数", "Raabe 与 Dirichlet 判别", raw`
\rho=\lim_{n\to\infty}n\left(\frac{u_n}{u_{n+1}}-1\right)
\\
\rho>1\Rightarrow \sum u_n\text{收敛},\quad \rho<1\Rightarrow \sum u_n\text{发散}
\\
\sum a_nb_n:\quad \sum a_n\text{部分和有界},\ b_n\downarrow0\Rightarrow \sum a_nb_n\text{收敛}
`, "拓展", ["Raabe", "Dirichlet", "级数", "冷门技巧"], "比值判别失效或带振荡项的级数。", "Raabe 是比值判别的二阶加强版；Dirichlet 处理“有界振荡×趋零”。", "比值极限等于 1 时考虑 Raabe；含 \\(\\sin n\\)、\\((-1)^n\\) 的结构考虑 Dirichlet。", "Raabe 与 p 级数比较；Dirichlet 用分部求和思想。", "\\(\\sum \\frac{\\sin nx}{n}\\) 常用 Dirichlet 思想。", "考研一般不要求复杂证明，知道触发场景即可。"),

  C("cold-cayley-hamilton", "冷门技巧", "冷门但高收益技巧库", "线代", "Cayley-Hamilton 定理", raw`
\text{若 }p(\lambda)=|\lambda E-A|,\quad \text{则 }p(A)=0
`, "技巧", ["Cayley-Hamilton", "矩阵", "冷门技巧"], "求矩阵高次幂、矩阵多项式。", "矩阵满足自己的特征多项式，所以高次幂能降阶。", "看到 \\(A^n\\)、矩阵多项式，先找特征多项式。", "定理来自伴随矩阵恒等式或相似标准形。", "若 \\(A^2-3A+2E=0\\)，则 \\(A^2=3A-2E\\)。", "注意特征多项式符号约定，代入前统一写法。"),

  C("cold-total-expectation", "冷门技巧", "冷门但高收益技巧库", "概率", "全期望与全方差", raw`
E(X)=E[E(X|Y)]
\\
D(X)=E[D(X|Y)]+D(E[X|Y])
`, "技巧", ["全期望", "全方差", "概率", "冷门技巧"], "分层随机过程、先抽环境再抽样本的题。", "全期望就是先按条件算平均，再对条件本身取平均。", "看到“先随机选一种情况，再在该情况下抽样”，优先想全期望。", "由条件分布对联合分布分解求和/积分得到。", "先随机选盒子，再抽球，抽到红球数的期望可先按盒子条件算。", "条件变量和目标变量不要混。"),

  C("pre-factorization-complete-square", "前置基础", "0. 前置基础", "代数", "配方、十字相乘与高次因式拆分", raw`
ax^2+bx+c=a\left(x+\frac{b}{2a}\right)^2+\frac{4ac-b^2}{4a}
\\
x^2-(a+b)x+ab=(x-a)(x-b)
\\
x^n-y^n=(x-y)(x^{n-1}+x^{n-2}y+\cdots+y^{n-1})
`, "必背", ["代数", "因式分解", "配方"], "极限化简、求根、二次型配方、积分部分分式前置。", "配方是在把二次表达式翻译成顶点与平方项，因式分解是在找可消掉的结构。", "看到二次式、根式、分母可分解时，先配方或拆因式。", "平方项展开并合并同类项即可验证。", "\\(x^2+4x+5=(x+2)^2+1\\)，根式积分常先这样处理。", "配方时常数项最容易漏；因式分解前先确认最高次系数。"),

  C("pre-partial-fraction-basic", "前置基础", "0. 前置基础", "分式", "基础部分分式与裂项公式", raw`
\frac1{k(k+1)}=\frac1k-\frac1{k+1}
\\
\frac1{(x-a)(x-b)}=\frac1{a-b}\left(\frac1{x-a}-\frac1{x-b}\right)
\\
\frac{x}{(x-a)(x-b)}=\frac{a}{a-b}\frac1{x-a}-\frac{b}{a-b}\frac1{x-b}
`, "常用", ["分式", "裂项", "数列求和", "积分"], "数列求和、部分分式积分、概率求和。", "裂项就是让相邻项互相抵消，复杂分式拆成简单分式。", "看到相邻因子乘积、二次分母已分解，优先考虑拆分。", "通分后比较分子系数即可确定常数。", "\\(\\sum_{k=1}^{n}1/[k(k+1)]=1-1/(n+1)\\)。", "分母根相同或不可约二次因式时，分子形式要相应升级。"),

  C("pre-telescoping-sum", "前置基础", "0. 前置基础", "数列求和", "错位相减、裂项相消与等差乘等比", raw`
\sum_{k=1}^{n}kq^{k}
=\frac{q-(n+1)q^{n+1}+nq^{n+2}}{(1-q)^2}\quad(q\ne1)
\\
\sum_{k=1}^{n}[a_k-a_{k+1}]=a_1-a_{n+1}
\\
\sum_{k=1}^{n}(2k-1)=n^2
`, "常用", ["数列", "求和", "错位相减", "裂项"], "数列极限、幂级数求和、概率分布期望。", "求和技巧的核心是制造大量抵消，或者把多项式权重转成等比结构。", "等差乘等比用错位相减；分式相邻因子用裂项；奇数和直接平方。", "错位相减来自 \\(S-qS\\) 对齐；裂项来自相邻差。", "\\(\\sum_{k=1}^{n}k2^{-k}\\) 可套等差乘等比公式。", "错位相减公式要求 \\(q\\ne1\\)，无穷和还要 \\(|q|<1\\)。"),

  C("pre-trig-values", "前置基础", "0. 前置基础", "三角函数", "常用特殊角三角函数值", raw`
\begin{array}{c|ccccc}
x&0&\pi/6&\pi/4&\pi/3&\pi/2\\
\hline
\sin x&0&1/2&\sqrt2/2&\sqrt3/2&1\\
\cos x&1&\sqrt3/2&\sqrt2/2&1/2&0\\
\tan x&0&\sqrt3/3&1&\sqrt3&\text{不存在}
\end{array}
`, "必背", ["三角", "特殊角", "基础"], "三角极限、积分、空间角度、概率正态分位以外的基础计算。", "特殊角是单位圆上最常见的坐标点，能减少考场查表。", "三角题先把角化到特殊角和象限，再确定符号。", "由 30-60-90 和等腰直角三角形边长比得到。", "\\(\\sin(5\\pi/6)=1/2\\)，因为参考角是 \\(\\pi/6\\) 且第二象限正。", "别把角度制和弧度制混用；\\(\\tan\\pi/2\\) 不存在。", "unit-circle"),

  C("pre-trig-parity-period", "前置基础", "0. 前置基础", "三角函数", "三角函数奇偶性、周期性与象限符号", raw`
\sin(-x)=-\sin x,\quad \cos(-x)=\cos x,\quad \tan(-x)=-\tan x
\\
\sin(x+2\pi)=\sin x,\quad \cos(x+2\pi)=\cos x,\quad \tan(x+\pi)=\tan x
\\
\text{一全正，二正弦，三正切，四余弦}
`, "必背", ["三角", "奇偶性", "周期", "象限"], "三角化简、定积分对称、Fourier 奇偶判断。", "周期负责把角拉回熟悉范围，奇偶和象限负责确定符号。", "化简三角值时先减周期，再看参考角和象限。", "由单位圆坐标 \\((\\cos x,\\sin x)\\) 的对称性得到。", "\\(\\cos(13\\pi/6)=\\cos(\\pi/6)=\\sqrt3/2\\)。", "正切周期是 \\(\\pi\\) 不是 \\(2\\pi\\)；符号别只看参考角。", "unit-circle"),

  C("pre-trig-induction", "前置基础", "0. 前置基础", "诱导公式", "诱导公式全表速记", raw`
\sin(\pi-x)=\sin x,\quad \sin(\pi+x)=-\sin x,\quad \sin(2\pi-x)=-\sin x
\\
\cos(\pi-x)=-\cos x,\quad \cos(\pi+x)=-\cos x,\quad \cos(2\pi-x)=\cos x
\\
\sin\left(\frac{\pi}{2}\pm x\right)=\cos x,\quad
\cos\left(\frac{\pi}{2}-x\right)=\sin x,\quad
\cos\left(\frac{\pi}{2}+x\right)=-\sin x
`, "必背", ["三角", "诱导公式", "基础"], "三角化简、特殊角计算、三角积分换元。", "诱导公式就是把任意角通过对称和旋转拉回第一象限附近。", "先判函数名是否互换，再判象限符号。", "单位圆绕坐标轴和原点对称即可得到全部诱导公式。", "\\(\\sin(\\pi+x)=-\\sin x\\)，\\(\\cos(\\pi/2+x)=-\\sin x\\)。", "口诀“奇变偶不变，符号看象限”里的奇偶指 \\(\\pi/2\\) 的奇偶倍。", "unit-circle"),

  C("pre-trig-quotient-reciprocal", "前置基础", "0. 前置基础", "三角函数", "商数关系、倒数关系与平方关系", raw`
\tan x=\frac{\sin x}{\cos x},\quad \cot x=\frac{\cos x}{\sin x}
\\
\sec x=\frac1{\cos x},\quad \csc x=\frac1{\sin x}
\\
1+\tan^2x=\sec^2x,\quad 1+\cot^2x=\csc^2x
`, "必背", ["三角", "同角关系", "sec", "csc"], "三角积分、三角代换、化简证明。", "同角关系把所有三角函数统一到 \\(\\sin\\) 与 \\(\\cos\\)。", "复杂三角式优先化成 \\(\\sin,\\cos\\)，有 \\(\\tan\\) 高次时再用平方关系。", "由 \\(\\sin^2x+\\cos^2x=1\\) 分别除以 \\(\\cos^2x\\) 或 \\(\\sin^2x\\)。", "\\(\\sec^2x-\\tan^2x=1\\)。", "使用 \\(\\tan,\\sec\\) 时要注意 \\(\\cos x\\ne0\\)。"),

  C("pre-trig-sum-difference-full", "前置基础", "0. 前置基础", "和差角", "和差角公式完整表", raw`
\sin(A\pm B)=\sin A\cos B\pm\cos A\sin B
\\
\cos(A\pm B)=\cos A\cos B\mp\sin A\sin B
\\
\tan(A\pm B)=\frac{\tan A\pm\tan B}{1\mp\tan A\tan B}
`, "必背", ["三角", "和差角", "基础"], "三角恒等变形、倍角半角、和差化积推导。", "和差角公式描述两个旋转叠加后的坐标变化。", "看到 \\(A\\pm B\\)、特殊角拆分、相位平移，直接套和差角。", "可由旋转矩阵相乘或 Euler 公式取实部虚部得到。", "\\(\\sin(x+\\pi/3)=\\frac12\\sin x+\\frac{\\sqrt3}{2}\\cos x\\)。", "余弦公式符号与正弦相反；正切公式分母也会变号。", "unit-circle"),

  C("pre-trig-triple-angle", "前置基础", "0. 前置基础", "倍角公式", "三倍角与降次变形", raw`
\sin3x=3\sin x-4\sin^3x
\\
\cos3x=4\cos^3x-3\cos x
\\
\tan3x=\frac{3\tan x-\tan^3x}{1-3\tan^2x}
`, "常用", ["三角", "三倍角", "技巧"], "三角方程、三角积分、特殊恒等变形。", "三倍角把三次幂和三倍频联系起来，可在高次三角式里降维。", "看到 \\(4u^3-3u\\)、\\(3u-4u^3\\) 立刻联想 \\(\\cos3x\\)、\\(\\sin3x\\)。", "由和角公式把 \\(2x+x\\) 展开并代入倍角公式。", "\\(4\\cos^3x-3\\cos x=\\cos3x\\)。", "三倍角不是数学一高频硬背项，但选择填空很省时间。", "unit-circle"),

  C("pre-trig-power-reduction-full", "前置基础", "0. 前置基础", "降幂公式", "降幂、升幂与半角公式全表", raw`
\sin^2x=\frac{1-\cos2x}{2},\quad \cos^2x=\frac{1+\cos2x}{2}
\\
\sin^4x=\frac{3-4\cos2x+\cos4x}{8},\quad
\cos^4x=\frac{3+4\cos2x+\cos4x}{8}
\\
\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}},\quad
\cos\frac{x}{2}=\pm\sqrt{\frac{1+\cos x}{2}}
`, "必背", ["三角", "降幂", "半角", "积分"], "高次三角积分、Fourier 系数、定积分速算。", "降幂把“幂次难题”变成“频率问题”，积分会立刻简单很多。", "偶次三角积分先降幂；半角符号由角所在区间确定。", "由 \\(\\cos2x=1-2\sin^2x=2\cos^2x-1\\) 反解。", "\\(\\int_0^{2\\pi}\\sin^2xdx=\\int_0^{2\\pi}(1-\cos2x)/2dx=\\pi\\)。", "半角公式的正负号不能省，必须看 \\(x/2\\) 的象限。"),

  C("pre-trig-product-to-sum-full", "前置基础", "0. 前置基础", "积化和差", "积化和差完整表", raw`
\sin A\sin B=\frac12[\cos(A-B)-\cos(A+B)]
\\
\cos A\cos B=\frac12[\cos(A-B)+\cos(A+B)]
\\
\sin A\cos B=\frac12[\sin(A+B)+\sin(A-B)]
\\
\cos A\sin B=\frac12[\sin(A+B)-\sin(A-B)]
`, "必背", ["三角", "积化和差", "Fourier", "积分"], "三角乘积积分、Fourier 正交性、波形叠加。", "乘积变和差后，每项都变成单个三角函数，积分和求周期更容易。", "看到 \\(\\sin mx\\cos nx\\)、\\(\\cos mx\\cos nx\\) 优先积化和差。", "把和差角公式相加或相减即可得到。", "\\(\\sin3x\\sin x=\\frac12(\\cos2x-\\cos4x)\\)。", "\\(\\sin A\\sin B\\) 的两个余弦顺序最容易写反。", "unit-circle"),

  C("pre-trig-sum-to-product-full", "前置基础", "0. 前置基础", "和差化积", "和差化积完整表", raw`
\sin A+\sin B=2\sin\frac{A+B}{2}\cos\frac{A-B}{2}
\\
\sin A-\sin B=2\cos\frac{A+B}{2}\sin\frac{A-B}{2}
\\
\cos A+\cos B=2\cos\frac{A+B}{2}\cos\frac{A-B}{2}
\\
\cos A-\cos B=-2\sin\frac{A+B}{2}\sin\frac{A-B}{2}
`, "必背", ["三角", "和差化积", "零点", "技巧"], "三角方程、求零点、波形叠加与简化。", "和差化积把“两个波相加”变成平均频率与拍频的乘积。", "三角函数相加求零点、求最大最小或比较大小时优先考虑。", "令 \\(A=u+v,B=u-v\\)，再由和角公式相加相减。", "\\(\\cos3x+\cos x=2\\cos2x\\cos x\\)。", "\\(\\cos A-\cos B\\) 前面的负号很容易漏。", "unit-circle"),

  C("pre-trig-auxiliary-angle-detailed", "前置基础", "0. 前置基础", "辅助角", "辅助角公式与最大值", raw`
a\sin x+b\cos x=R\sin(x+\varphi)
\\
R=\sqrt{a^2+b^2},\quad \cos\varphi=\frac{a}{R},\quad \sin\varphi=\frac{b}{R}
\\
|a\sin x+b\cos x|\le \sqrt{a^2+b^2}
`, "必背", ["三角", "辅助角", "最值"], "三角最值、三角方程、导数应用。", "辅助角就是把同频率的正弦波和余弦波合成一个有相位偏移的波。", "看到 \\(a\\sin x+b\\cos x\\) 求最值或解方程，先合成。", "把右端展开后比较 \\(\\sin x\\)、\\(\\cos x\\) 系数。", "\\(3\\sin x+4\\cos x\\) 的最大值是 5。", "只用 \\(\\tan\\varphi=b/a\\) 会丢象限，最好同时看 \\(\\sin\\varphi,\\cos\\varphi\\)。", "unit-circle"),

  C("pre-inverse-trig-addition", "前置基础", "0. 前置基础", "反三角函数", "反正切加减公式与主值陷阱", raw`
\arctan x+\arctan y=
\arctan\frac{x+y}{1-xy}\quad(xy<1)
\\
\arctan x-\arctan y=
\arctan\frac{x-y}{1+xy}
\\
\arctan x+\arctan\frac1x=
\begin{cases}\pi/2,&x>0\\-\pi/2,&x<0\end{cases}
`, "常用", ["反三角", "arctan", "主值"], "极限、积分结果化简、反三角函数恒等变形。", "反三角公式最麻烦的不是代数，而是主值区间。", "看到多个 arctan 相加减，先用正切和差公式，再检查结果象限。", "对等式两边取正切可得代数形式，主值由区间修正。", "\\(\\arctan1+\\arctan2=\\pi-\\arctan3\\)，不能直接写 \\(\\arctan(-3)\\)。", "当 \\(xy>1\\) 时需要补 \\(\\pi\\) 或 \\(-\\pi\\)，不能机械套。"),

  C("pre-trig-half-angle-detail", "前置基础", "0. 前置基础", "半角公式", "半角公式、正负号与切半角", raw`
\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}},\quad
\cos\frac{x}{2}=\pm\sqrt{\frac{1+\cos x}{2}}
\\
\tan\frac{x}{2}=\frac{\sin x}{1+\cos x}=\frac{1-\cos x}{\sin x}
\\
\tan\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{1+\cos x}}
`, "必背", ["三角", "半角", "降幂", "辅助角"], "降幂、根式化简、三角积分与有理化换元。", "半角把整角信息压缩成根式或有理式，是很多高次三角题的出口。", "看到 \\(1\\pm\\cos x\\)、\\(\\tan\\frac{x}{2}\\) 就先想半角变形。", "由 \\(1-\\cos x=2\\sin^2\\frac{x}{2}\\)、\\(1+\\cos x=2\\cos^2\\frac{x}{2}\\) 反解。", "\\(1-\cos3x=2\\sin^2\\frac{3x}{2}\\)，\\(\\tan\\frac{x}{2}=\\frac{\\sin x}{1+\\cos x}\\)。", "半角正负号要看 \\(x/2\\) 所在象限，不能默认取正。", "unit-circle"),

  C("pre-trig-special-angle-extended", "前置基础", "0. 前置基础", "特殊角", "特殊角进阶精确值", raw`
\sin\frac{\pi}{12}=\frac{\sqrt6-\sqrt2}{4},\quad
\cos\frac{\pi}{12}=\frac{\sqrt6+\sqrt2}{4},\quad
\tan\frac{\pi}{12}=2-\sqrt3
\\
\sin\frac{5\pi}{12}=\frac{\sqrt6+\sqrt2}{4},\quad
\cos\frac{5\pi}{12}=\frac{\sqrt6-\sqrt2}{4},\quad
\tan\frac{5\pi}{12}=2+\sqrt3
\\
\sin\frac{\pi}{10}=\frac{\sqrt5-1}{4},\quad
\cos\frac{\pi}{5}=\frac{\sqrt5+1}{4}
`, "常用", ["三角", "特殊角", "精确值"], "15°、75°、18°、36° 这类组合角的精确计算。", "很多考试题不直接考标准角，而是考由标准角拼出来的精确值。", "看到 45°±30°、18°、36°、15°，优先用和差角或半角公式。", "由和差角公式和半角公式可逐步推出。", "\\(\\cos\\frac{\\pi}{12}=\\cos(\\frac{\\pi}{4}-\\frac{\\pi}{6})\\)。", "别把 15° 的值和 75° 的值对调；角度制与弧度制要统一。", "unit-circle"),

  C("pre-inverse-trig-symmetry", "前置基础", "0. 前置基础", "反三角函数", "反三角函数主值与对称性", raw`
\arcsin(-x)=-\arcsin x,\quad
\arccos(-x)=\pi-\arccos x,\quad
\arctan(-x)=-\arctan x
\\
\arcsin x\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right],\quad
\arccos x\in[0,\pi],\quad
\arctan x\in\left(-\frac{\pi}{2},\frac{\pi}{2}\right)
\\
\sin(\arcsin x)=x,\quad \cos(\arccos x)=x,\quad \tan(\arctan x)=x
`, "常用", ["反三角", "主值", "对称性"], "反三角函数的主值处理、积分与极限变形。", "反三角函数最容易错在“原函数值”和“主值”混在一起。", "遇到负号、补角、反三角复合时先看主值区间。", "由单调性和主值区间直接推出。", "\\(\\arccos(-\\tfrac12)=\\tfrac{2\\pi}{3}\\)，不是 \\(-\\tfrac{2\\pi}{3}\\)。", "arccos 不是奇函数；负号处理不能照搬 arctan。", "unit-circle"),

  C("pre-trig-equations-general", "前置基础", "0. 前置基础", "三角方程", "基本三角方程通解", raw`
\sin x=a\Rightarrow x=n\pi+(-1)^n\arcsin a\quad(|a|\le1)
\\
\cos x=a\Rightarrow x=2k\pi\pm\arccos a\quad(|a|\le1)
\\
\tan x=a\Rightarrow x=k\pi+\arctan a
\\
\sin x=\sin\alpha\Rightarrow x=k\pi+(-1)^k\alpha
`, "常用", ["三角", "三角方程", "通解"], "三角方程、参数讨论、选择填空。", "三角方程通解本质是周期性加对称性。", "先把方程化成单个三角函数，再写周期通解。", "由单位圆上一条水平线或竖直线与圆的交点得到。", "\\(\\sin x=1/2\\Rightarrow x=k\\pi+(-1)^k\\pi/6\\)。", "别漏周期；\\(\\sin\\) 与 \\(\\cos\\) 的两支解写法不同。", "unit-circle"),

  C("pre-trig-period-composition", "前置基础", "0. 前置基础", "周期", "三角复合函数周期速查", raw`
\sin(\omega x+\varphi),\ \cos(\omega x+\varphi):\quad T=\frac{2\pi}{|\omega|}
\\
\tan(\omega x+\varphi),\ \cot(\omega x+\varphi):\quad T=\frac{\pi}{|\omega|}
\\
f(x),g(x)\text{ 周期分别为 }T_1,T_2,\quad
\frac{T_1}{T_2}\in\mathbb Q\Rightarrow \text{存在公共周期}
`, "常用", ["三角", "周期", "复合函数"], "三角函数图像、Fourier、定积分周期性。", "周期就是函数重复一次所需的最短水平位移。", "先看基本函数周期，再除以内层自变量系数。", "令内层角增加一个基本周期即可求出外层重复。", "\\(\\sin3x\\) 的周期是 \\(2\\pi/3\\)，\\(\\tan2x\\) 的周期是 \\(\\pi/2\\)。", "和差组合不一定有周期；两个周期比为无理数时通常无公共周期。", "unit-circle"),

  C("calc1-equiv-sin-tan", "高等数学", "第1章 函数与极限", "等价无穷小", "三角基础等价无穷小", raw`
x\to0:\quad \sin x\sim x,\quad \tan x\sim x,\quad
\arcsin x\sim x,\quad \arctan x\sim x
\\
\frac{\sin ax}{\sin bx}\to\frac{a}{b},\quad
\frac{\tan ax}{bx}\to\frac{a}{b}
`, "必背", ["极限", "等价无穷小", "三角"], "三角小角极限、乘除型极限。", "小角下弧长、弦长、切线段长度一阶相同。", "乘除结构中先把所有小角三角函数换成角本身。", "由重要极限 \\(\\sin x/x\\to1\\) 和反函数局部近似得到。", "\\(\\lim_{x\\to0}\\sin3x/\\tan5x=3/5\\)。", "加减结构不能随便等价替换，抵消后要看更高阶。", "limit-slider"),

  C("calc1-equivalent-operations", "高等数学", "第1章 函数与极限", "等价无穷小", "等价无穷小的运算规则", raw`
\alpha\sim\alpha',\ \beta\sim\beta'\Rightarrow \alpha\beta\sim\alpha'\beta',\quad
\frac{\alpha}{\beta}\sim\frac{\alpha'}{\beta'}\ (\beta,\beta'\ne0)
\\
\alpha\sim\beta\Rightarrow \frac{\alpha}{\beta}\to1
\\
\alpha+\beta\text{ 一般不能直接逐项等价替换，先看是否有主项抵消}
`, "常用", ["极限", "等价无穷小", "运算规则"], "等价无穷小的乘除操作、主项判断。", "等价关系最实用的地方是乘除，不是加减。", "乘除结构直接用等价；加减结构先找最低阶主项。", "由比值极限的乘法和除法性质得到。", "\\(\\sin x\\cdot\\ln(1+x)\sim x^2\\)。", "把加法也机械等价替换，最容易错。", "limit-slider"),

  C("calc1-rational-expansion", "高等数学", "第1章 函数与极限", "高阶等价", "分式与根式的常用展开", raw`
\frac{1}{1+x}=1-x+x^2-x^3+o(x^3)
\\
\frac{1}{1-x}=1+x+x^2+x^3+o(x^3)
\\
\frac{1}{(1+x)^m}=1-mx+\frac{m(m+1)}{2}x^2-\frac{m(m+1)(m+2)}{6}x^3+o(x^3)
\\
\frac{1}{\sqrt{1+x}}=1-\frac{x}{2}+\frac{3x^2}{8}-\frac{5x^3}{16}+o(x^3)
`, "常用", ["极限", "Taylor", "分式", "根式"], "分式极限、根式极限和高阶抵消。", "很多看起来复杂的分式，在 0 附近都能按幂级数展开。", "看到 \\(1/(1\\pm x)\\)、\\(1/(1+x)^m\\) 直接写展开。", "由二项式展开 \\((1+x)^{-m}\\) 和 Taylor 公式得到。", "\\(\\frac1{1+x}-1\\sim -x\\)，\\(\\frac1{\\sqrt{1+x}}\\sim1-\\frac x2\\)。", "展开只在 \\(x\\to0\\) 附近有效，别把它当全局公式。", "taylor-plot"),

  C("calc1-taylor-common-table", "高等数学", "第1章 函数与极限", "Taylor展开", "常用泰勒展开速查表", raw`
e^x=1+x+\frac{x^2}{2}+\frac{x^3}{6}+\frac{x^4}{24}+\frac{x^5}{120}+o(x^5)
\\
\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\frac{x^4}{4}+\frac{x^5}{5}+o(x^5)
\\
\sin x=x-\frac{x^3}{6}+\frac{x^5}{120}+o(x^5),\quad
\cos x=1-\frac{x^2}{2}+\frac{x^4}{24}+o(x^4)
\\
\tan x=x+\frac{x^3}{3}+\frac{2x^5}{15}+o(x^5)
\\
\arcsin x=x+\frac{x^3}{6}+\frac{3x^5}{40}+o(x^5),\quad
\arctan x=x-\frac{x^3}{3}+\frac{x^5}{5}+o(x^5)
`, "必背", ["极限", "Taylor", "展开"], "加减抵消、局部近似、积分与求极限。", "泰勒表是判断“哪个幂次先活下来”的最快工具。", "一旦等价无穷小不够，就直接上泰勒表找主项。", "由 Maclaurin 展开在 0 附近逐项展开得到。", "\\(\\sin x-x\\sim -x^3/6\\)，\\(\\tan x-x\\sim x^3/3\\)。", "阶数不够会把答案算成 0；要保证覆盖抵消后的首项。", "taylor-plot"),

  C("calc1-equiv-cos", "高等数学", "第1章 函数与极限", "等价无穷小", "余弦型等价与半角技巧", raw`
x\to0:\quad 1-\cos x\sim \frac{x^2}{2}
\\
\cos x-1\sim-\frac{x^2}{2}
\\
1-\cos ax=2\sin^2\frac{ax}{2}\sim\frac{a^2x^2}{2}
`, "必背", ["极限", "等价无穷小", "余弦"], "余弦差、根式有理化、三角极限。", "余弦靠近 1 的速度是二阶，不是一阶。", "看到 \\(1-\cos\\) 优先半角化成 \\(2\sin^2\\)。", "半角公式加 \\(\\sin u\sim u\\) 即可证明。", "\\(\\lim_{x\\to0}(1-\cos3x)/x^2=9/2\\)。", "\\(1-\cos x\\) 是二阶小量，和 \\(x\\) 同时出现时别误判阶数。", "limit-slider"),

  C("calc1-equiv-log-exp", "高等数学", "第1章 函数与极限", "等价无穷小", "指数对数型等价无穷小", raw`
x\to0:\quad e^x-1\sim x,\quad a^x-1\sim x\ln a\ (a>0)
\\
\ln(1+x)\sim x,\quad \ln(1+ax)\sim ax
\\
e^{f(x)}-1\sim f(x)\quad(f(x)\to0)
`, "必背", ["极限", "指数", "对数", "等价无穷小"], "指数对数极限、\\(1^\infty\\) 型转化。", "指数和对数在 0 附近都像一条斜率为 1 的直线。", "先确认内部趋于 0，再把指数对数换成主部。", "由 \\(e^x\\)、\\(\\ln(1+x)\\) 在 0 处 Taylor 展开得到。", "\\(\\lim_{x\\to0}(2^x-1)/x=\\ln2\\)。", "\\(\\ln(1+x)\\) 要求 \\(1+x>0\\)，复合时先看定义域。", "limit-slider"),

  C("calc1-equiv-power-root", "高等数学", "第1章 函数与极限", "等价无穷小", "幂函数与根式型等价无穷小", raw`
x\to0:\quad (1+x)^\alpha-1\sim \alpha x
\\
\sqrt{1+x}-1\sim\frac{x}{2},\quad
\sqrt[n]{1+x}-1\sim\frac{x}{n}
\\
(1+u)^\alpha-(1+v)^\alpha\sim \alpha(u-v)\quad(u,v\to0)
`, "必背", ["极限", "根式", "幂函数", "等价无穷小"], "根式极限、幂函数差、参数极限。", "幂函数在 1 附近的变化率就是指数 \\(\\alpha\\)。", "根式差先看能否有理化，也可直接用幂函数等价。", "由二项式或 Taylor 展开 \\((1+x)^\\alpha=1+\\alpha x+o(x)\\)。", "\\(\\lim_{x\\to0}(\\sqrt[3]{1+2x}-1)/x=2/3\\)。", "\\(\\alpha\\) 为实数时要注意底数为正，尤其偶次根。"),

  C("calc1-high-order-trig-equivalents", "高等数学", "第1章 函数与极限", "高阶等价", "常用高阶三角等价", raw`
x-\sin x\sim\frac{x^3}{6},\quad
\tan x-x\sim\frac{x^3}{3}
\\
\arcsin x-x\sim\frac{x^3}{6},\quad
x-\arctan x\sim\frac{x^3}{3}
\\
\sin x-x\cos x\sim\frac{x^3}{3}
`, "技巧", ["极限", "Taylor", "高阶等价", "三角"], "加减抵消型三角极限。", "一阶项抵消以后，真正决定极限的是第一个没被抵消的高阶项。", "看到 \\(\\sin x-x\\)、\\(\\tan x-x\\) 直接展开到三阶。", "由 \\(\\sin x,\\tan x,\\arcsin x,\\arctan x\\) 的 Taylor 展开得到。", "\\(\\lim_{x\\to0}(x-\sin x)/x^3=1/6\\)。", "符号最容易错：\\(\\sin x-x\\sim -x^3/6\\)。", "taylor-plot"),

  C("calc1-high-order-log-exp", "高等数学", "第1章 函数与极限", "高阶等价", "指数对数高阶展开常用差", raw`
e^x-1-x\sim\frac{x^2}{2}
\\
\ln(1+x)-x\sim-\frac{x^2}{2}
\\
(1+x)^\alpha-1-\alpha x\sim\frac{\alpha(\alpha-1)}2x^2
\\
x-\ln(1+x)\sim\frac{x^2}{2}
`, "技巧", ["极限", "Taylor", "指数", "对数"], "加减抵消型指数对数极限。", "指数对数的二阶项一正一负，是很多抵消题的关键。", "一阶等价算出 0 时，不要停，继续展开到二阶或三阶。", "由 Maclaurin 展开逐项相减得到。", "\\(\\lim_{x\\to0}(e^x-1-x)/x^2=1/2\\)。", "展开阶数要覆盖抵消后的第一非零项。", "taylor-plot"),

  C("calc1-one-infinity-general", "高等数学", "第1章 函数与极限", "重要极限", "\\(1^\\infty\\) 型通用公式", raw`
u(x)\to0,\ v(x)\to\infty:\quad
\lim[1+u(x)]^{v(x)}=e^{\lim u(x)v(x)}
\\
\lim f(x)^{g(x)}=
\exp\left(\lim g(x)\ln f(x)\right)
\\
\ln(1+u)\sim u
`, "必背", ["极限", "重要极限", "指数型"], "\\(1^\\infty\\)、\\(0^0\\)、\\(\\infty^0\\) 型极限。", "指数型极限要先取对数，把幂放下来。", "底数趋 1 时先设 \\(u=底数-1\\)，再算 \\(uv\\)。", "由 \\([1+u]^v=\\exp(v\ln(1+u))\\) 和 \\(\\ln(1+u)\sim u\\) 得到。", "\\((1+3x)^{2/x}\\to e^6\\)。", "必须先保证底数在邻域内为正，否则实对数不可用。", "limit-slider"),

  C("calc1-growth-hierarchy", "高等数学", "第1章 函数与极限", "无穷大阶", "无穷远处常用增长阶", raw`
x\to\infty:\quad
(\ln x)^a=o(x^b)\quad(a>0,b>0)
\\
x^b=o(e^{cx})\quad(b>0,c>0)
\\
a^x=o(b^x)\quad(1<a<b)
\\
\ln n=o(n^\alpha),\quad n^\alpha=o(a^n)\quad(\alpha>0,a>1)
`, "必背", ["极限", "无穷大", "增长阶"], "无穷远极限、级数判别、复杂极限比较。", "对数最慢，幂函数居中，指数最快。", "看到 \\(\\infty/\\infty\\) 且含 \\(\\ln x,x^a,e^x\\)，先按增长阶判断。", "反复洛必达或取对数都能证明这些层级。", "\\(\\lim_{x\\to\\infty}\\ln^3x/x^{0.1}=0\\)。", "这些是正向无穷远比较；底数、指数符号和定义域要先确认。"),

  C("calc1-infinity-equivalents", "高等数学", "第1章 函数与极限", "无穷远等价", "无穷远常用等价变形", raw`
x\to\infty:\quad
\ln(x+a)\sim\ln x,\quad
(x+a)^\alpha\sim x^\alpha
\\
\sqrt{x^2+ax+b}\sim |x|
\\
\sqrt{x^2+ax+b}-x\to \frac{a}{2}\quad(x\to+\infty)
\\
\ln\left(1+\frac{a}{x}\right)\sim\frac{a}{x}
`, "常用", ["极限", "无穷远", "等价无穷大"], "无穷远极限、根式有理化、对数极限。", "无穷远等价就是抓最高阶，低阶项只修正细节。", "多项式/根式看最高次；对数里可把常数扰动当小量。", "把 \\(1/x\\) 视为趋零小量或直接提最高阶即可。", "\\(\\sqrt{x^2+3x}-x\\to3/2\\)。", "\\(x\\to-\\infty\\) 时 \\(\\sqrt{x^2}\\sim|x|=-x\\)，符号很关键。"),

  C("calc1-stolz-cesaro", "高等数学", "第1章 函数与极限", "数列极限", "Stolz-Cesaro 公式", raw`
b_n\uparrow\infty,\quad
\lim_{n\to\infty}\frac{a_n-a_{n-1}}{b_n-b_{n-1}}=L
\Rightarrow
\lim_{n\to\infty}\frac{a_n}{b_n}=L
\\
\frac{a_1+\cdots+a_n}{n}\to A\quad(a_n\to A)
`, "技巧", ["数列极限", "Stolz", "Cesaro", "冷门技巧"], "求和比值型数列极限、平均值极限。", "Stolz 是离散版洛必达，比较累积量的增量。", "看到 \\(\\sum a_k/n^p\\)、分子分母都趋无穷的数列，可考虑差分。", "把 \\(a_n,b_n\\) 看成离散累积函数，差分相当于导数。", "\\(\\lim n^{-2}\\sum_{k=1}^{n}k=1/2\\)。", "要求分母单调趋无穷；不要把它当作任意数列版洛必达。"),

  C("calc2-derivative-power-log", "高等数学", "第2章 导数与微分", "导数表", "幂、指数、对数导数全表", raw`
(x^\alpha)'=\alpha x^{\alpha-1}
\\
(a^x)'=a^x\ln a,\quad (e^{kx})'=ke^{kx}
\\
(\log_a x)'=\frac1{x\ln a},\quad (\ln|x|)'=\frac1x\ (x\ne0)
\\
[u(x)]^\alpha{}'=\alpha u^{\alpha-1}u'
`, "必背", ["导数", "导数表", "指数", "对数"], "所有求导、单调极值、积分反查。", "这张表是导数计算的乘法口诀。", "先识别外层函数，再乘以内层导数。", "由导数定义和链式法则得到复合形式。", "\\((\\ln(1+x^2))'=2x/(1+x^2)\\)。", "\\(\\ln x\\) 与 \\(\\ln|x|\\) 定义域不同，别漏绝对值。", "tangent-line"),

  C("calc2-derivative-trig-complete", "高等数学", "第2章 导数与微分", "导数表", "三角函数导数完整表", raw`
(\sin x)'=\cos x,\quad(\cos x)'=-\sin x
\\
(\tan x)'=\sec^2x,\quad(\cot x)'=-\csc^2x
\\
(\sec x)'=\sec x\tan x,\quad(\csc x)'=-\csc x\cot x
\\
(\sin u)'=\cos u\cdot u'
`, "必背", ["导数", "三角", "sec", "csc"], "三角求导、三角积分反查、曲线斜率。", "三角导数的符号有规律：余弦、余切、余割导数带负号。", "复杂三角求导先看复合层数，再套链式法则。", "可由和角公式和导数定义推出。", "\\((\\sec 2x)'=2\\sec2x\\tan2x\\)。", "最常错的是 \\(\\cot\\)、\\(\\csc\\) 的负号。", "tangent-line"),

  C("calc2-derivative-inverse-trig-complete", "高等数学", "第2章 导数与微分", "导数表", "反三角函数导数完整表", raw`
(\arcsin x)'=\frac1{\sqrt{1-x^2}},\quad
(\arccos x)'=-\frac1{\sqrt{1-x^2}}
\\
(\arctan x)'=\frac1{1+x^2},\quad
(\operatorname{arccot}x)'=-\frac1{1+x^2}
\\
(\arcsin u)'=\frac{u'}{\sqrt{1-u^2}}
`, "必背", ["导数", "反三角", "arcsin", "arctan"], "反三角求导、积分反查、隐函数。", "反三角导数来自反函数求导，根号符号由主值区间保证。", "看到 \\(1/(1+x^2)\\) 想 arctan，看到 \\(1/\\sqrt{1-x^2}\\) 想 arcsin。", "令 \\(y=\arcsin x\\)，则 \\(x=\sin y\\)，倒数求导。", "\\((\\arctan x^2)'=2x/(1+x^4)\\)。", "arccos 和 arccot 带负号；复合函数别漏 \\(u'\\)。"),

  C("calc2-hyperbolic-derivatives", "高等数学", "第2章 导数与微分", "拓展导数", "双曲函数导数与反双曲识别", raw`
(\sinh x)'=\cosh x,\quad(\cosh x)'=\sinh x
\\
(\tanh x)'=\operatorname{sech}^2x
\\
\operatorname{arsinh}x=\ln(x+\sqrt{x^2+1})
`, "拓展", ["导数", "双曲函数", "拓展"], "根式积分、反常积分拓展理解。", "双曲函数是指数函数组成的类三角函数，适合处理 \\(x^2\pm a^2\\)。", "考研中多作为理解工具，常规解法仍优先三角代换或配方。", "由 \\(\\sinh,\cosh\\) 的指数定义直接求导。", "\\((\\cosh 2x)'=2\\sinh2x\\)。", "不是常规硬考点，不要在大题里强行引入陌生记号。"),

  C("calc2-inverse-hyperbolic-table", "高等数学", "第2章 导数与微分", "拓展导数", "反双曲函数与根式积分识别", raw`
\operatorname{arsinh}x=\ln(x+\sqrt{x^2+1}),\quad
(\operatorname{arsinh}x)'=\frac1{\sqrt{x^2+1}}
\\
\operatorname{artanh}x=\frac12\ln\frac{1+x}{1-x},\quad
(\operatorname{artanh}x)'=\frac1{1-x^2}\quad(|x|<1)
\\
\operatorname{arcosh}x=\ln(x+\sqrt{x^2-1}),\quad
(\operatorname{arcosh}x)'=\frac1{\sqrt{x^2-1}}\quad(x>1)
`, "拓展", ["导数", "双曲函数", "反双曲", "根式"], "根式积分、反常积分、冷门识别。", "反双曲函数是根式型积分的另一种原函数写法。", "看到 \\(1/\\sqrt{x^2+a^2}\\)、\\(1/(1-x^2)\\) 可联想，但考场仍可写对数形式。", "对右端对数表达式求导即可验证。", "\\(\\int dx/\\sqrt{x^2+1}=\\operatorname{arsinh}x+C=\\ln|x+\\sqrt{x^2+1}|+C\\)。", "不是数学一主流记号；大题里最好同时写成对数，避免阅卷歧义。"),

  C("calc2-logarithmic-differentiation-table", "高等数学", "第2章 导数与微分", "对数求导", "对数求导与幂指函数模板", raw`
y=u(x)^{v(x)}\quad(u>0)
\\
\ln y=v\ln u,\quad
\frac{y'}{y}=v'\ln u+v\frac{u'}{u}
\\
\bigl[u(x)^{v(x)}\bigr]'=u^v\left(v'\ln u+v\frac{u'}{u}\right)
`, "必背", ["导数", "对数求导", "幂指函数"], "变量在底数和指数中同时出现的求导。", "对数求导就是先把指数搬下来，把乘除幂变成加减乘。", "看到 \\(x^x\\)、\\((\sin x)^x\\)、连乘连除，优先取对数。", "两边取对数后用链式法则和乘积求导。", "\\((x^x)'=x^x(\\ln x+1)\\)。", "底数必须为正；取对数后别忘了最后乘回 \\(y\\)。"),

  C("calc2-tangent-normal", "高等数学", "第2章 导数与微分", "切线法线", "切线、法线与线性近似", raw`
y-y_0=f'(x_0)(x-x_0)
\\
y-y_0=-\frac1{f'(x_0)}(x-x_0)\quad(f'(x_0)\ne0)
\\
f(x_0+\Delta x)\approx f(x_0)+f'(x_0)\Delta x
`, "必背", ["导数", "切线", "法线", "线性近似"], "切线方程、近似计算、导数几何意义。", "导数就是曲线在该点最贴近的直线斜率。", "求切线先求点和斜率；求法线斜率取负倒数。", "由可导定义 \\(\\Delta y=f'(x_0)\Delta x+o(\Delta x)\\) 得到。", "\\(y=x^2\\) 在 1 处切线为 \\(y-1=2(x-1)\\)。", "竖直切线时斜率不存在，不能套普通点斜式。", "tangent-line"),

  C("calc2-parametric-polar-derivative", "高等数学", "第2章 导数与微分", "参数极坐标求导", "参数方程与极坐标求导公式", raw`
x=x(t),\ y=y(t):\quad \frac{dy}{dx}=\frac{y'}{x'}
\\
r=r(\theta):\quad
\frac{dy}{dx}=\frac{r'\sin\theta+r\cos\theta}{r'\cos\theta-r\sin\theta}
\\
\frac{d^2y}{dx^2}=\frac{d}{dt}\left(\frac{dy}{dx}\right)\bigg/\frac{dx}{dt}
`, "常用", ["导数", "参数方程", "极坐标"], "参数曲线切线、极坐标曲线切线。", "参数不是 x，要求对 x 的变化率必须除以 \\(dx/dt\\)。", "先求 \\(dx/dt,dy/dt\\)，再比值；二阶导再除一次 \\(dx/dt\\)。", "由链式法则 \\(dy/dt=(dy/dx)(dx/dt)\\) 得到。", "圆 \\(x=\cos t,y=\sin t\\) 的斜率为 \\(-\\cot t\\)。", "\\(dx/dt=0\\) 处要单独讨论竖直切线。", "tangent-line"),

  C("calc4-exponential-log-integrals", "高等数学", "第4章 不定积分", "积分表", "指数对数积分全表", raw`
\int e^{ax}\,dx=\frac1a e^{ax}+C\quad(a\ne0)
\\
\int a^x\,dx=\frac{a^x}{\ln a}+C\quad(a>0,a\ne1)
\\
\int \ln x\,dx=x\ln x-x+C
\\
\int \frac{dx}{x\ln x}=\ln|\ln x|+C
`, "必背", ["积分", "指数", "对数", "积分表"], "不定积分、微分方程、概率密度积分。", "指数积分保持指数形状，对数积分通常靠分部。", "指数看内层系数；对数单独出现时优先分部积分。", "对右端求导即可验证，\\(\\int\\ln xdx\\) 由分部积分得到。", "\\(\\int 3e^{2x}dx=\\frac32e^{2x}+C\\)。", "对数积分要注意定义域，\\(\\ln|x|\\) 和 \\(\\ln x\\) 不要混。"),

  C("calc4-integration-by-parts-choice", "高等数学", "第4章 不定积分", "分部积分", "分部积分选取顺序表", raw`
\int u\,dv=uv-\int v\,du
\\
\text{常用选 }u\text{ 顺序：反三角/对数 }>\text{ 幂函数 }>\text{ 三角/指数}
\\
\int x^m e^{ax}dx,\ \int x^m\sin ax\,dx:\quad u=x^m
\\
\int \ln x\,dx:\quad u=\ln x,\ dv=dx
`, "必背", ["积分", "分部积分", "技巧"], "乘积型积分、对数积分、反三角积分。", "分部积分的核心是让 \\(u\\) 越求导越简单。", "看到“一个难求原函数的因子 × 一个好积分因子”，优先考虑分部。", "由乘积求导 \\((uv)'=u'v+uv'\\) 移项积分得到。", "\\(\\int x e^x dx=xe^x-e^x+C\\)。", "选错 \\(u\\) 会越积越复杂；三角指数循环分部要联立求解。", "riemann-sum"),

  C("calc4-substitution-recognition", "高等数学", "第4章 不定积分", "凑微分", "常见凑微分识别表", raw`
\int f'(x)\varphi(f(x))dx=\int \varphi(u)du
\\
\int \frac{f'(x)}{f(x)}dx=\ln|f(x)|+C
\\
\int f'(x)e^{f(x)}dx=e^{f(x)}+C
\\
\int \frac{f'(x)}{1+f^2(x)}dx=\arctan f(x)+C
\\
\int \frac{f'(x)}{\sqrt{1-f^2(x)}}dx=\arcsin f(x)+C
`, "必背", ["积分", "换元", "凑微分"], "不定积分第一反应模板。", "凑微分就是把内层函数和它的导数配成一个变量。", "先找内层 \\(f(x)\\)，再检查旁边有没有 \\(f'(x)dx\\)。", "来自链式法则反过来使用。", "\\(\\int 2x/(1+x^4)dx=\\arctan(x^2)+C\\)。", "差一个常数可以补，差一个变量结构就不能硬凑。"),

  C("calc4-trig-basic-integrals-full", "高等数学", "第4章 不定积分", "积分表", "三角函数基础积分全表", raw`
\int\sin ax\,dx=-\frac1a\cos ax+C,\quad
\int\cos ax\,dx=\frac1a\sin ax+C
\\
\int\tan x\,dx=-\ln|\cos x|+C,\quad
\int\cot x\,dx=\ln|\sin x|+C
\\
\int\sec^2x\,dx=\tan x+C,\quad
\int\csc^2x\,dx=-\cot x+C
`, "必背", ["积分", "三角", "积分表"], "三角积分、Fourier 系数、换元积分。", "三角积分多数就是三角导数表反过来。", "先看是否差一个内层导数，再决定是否换元。", "对原函数求导即可验证。", "\\(\\int\\cos3xdx=\\sin3x/3+C\\)。", "含 \\(ax\\) 时别漏除以 \\(a\\)。"),

  C("calc4-sec-csc-basic-integrals", "高等数学", "第4章 不定积分", "三角积分", "sec、csc 与正切余切积分表", raw`
\int \sec x\,dx=\ln|\sec x+\tan x|+C
\\
\int \csc x\,dx=\ln|\csc x-\cot x|+C
\\
\int \sec x\tan x\,dx=\sec x+C,\quad
\int \csc x\cot x\,dx=-\csc x+C
\\
\int \tan x\,dx=\ln|\sec x|+C,\quad
\int \cot x\,dx=\ln|\sin x|+C
`, "常用", ["积分", "三角积分", "sec", "csc"], "三角有理式积分、换元积分。", "sec/csc 的积分看似冷门，但在三角代换回代时经常出现。", "根式三角代换后出现 \\(\\sec x\\) 或 \\(\\csc x\\)，优先套表。", "\\(\\int\\sec xdx\\) 可上下同乘 \\(\\sec x+\tan x\\) 凑分子导数。", "\\(\\int\\sec xdx=\\ln|\\sec x+\tan x|+C\\)。", "\\(\\int\\csc xdx\\) 的符号和 \\(\\sec x\\) 不一样，别记反。"),

  C("calc4-trig-rational-methods", "高等数学", "第4章 不定积分", "三角有理式", "三角有理式积分三种路线", raw`
R(\sin x,\cos x)
\\
\text{路线1：恒等变形/降幂/积化和差}
\\
\text{路线2：令 }t=\tan x\text{ 或 }t=\sin x,\cos x\text{ 凑微分}
\\
\text{路线3：万能代换 }t=\tan\frac{x}{2}
`, "技巧", ["积分", "三角积分", "万能代换", "三角有理式"], "三角有理式不定积分。", "三角有理式不要上来就万能代换，先看能不能短打。", "简单题先恒等变形；有明显 \\(\\sec^2x\\) 或 \\(\\sin xdx\\) 再换元；最后才万能代换。", "三条路线分别来自三角恒等式、链式法则和半角正切有理化。", "\\(\\int dx/(1+\cos x)\\) 可先半角化为 \\(\\frac12\\int\\sec^2(x/2)dx\\)。", "万能代换很稳但常变长，选择填空不一定最快。"),

  C("calc4-inverse-trig-kernel-integrals", "高等数学", "第4章 不定积分", "积分表", "反三角核积分全表", raw`
\int\frac{dx}{x^2+a^2}=\frac1a\arctan\frac{x}{a}+C
\\
\int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac{x}{a}+C
\\
\int\frac{dx}{a^2-x^2}=\frac1{2a}\ln\left|\frac{a+x}{a-x}\right|+C
\\
\int\frac{dx}{\sqrt{x^2+a^2}}=\ln|x+\sqrt{x^2+a^2}|+C
`, "必背", ["积分", "反三角", "根式", "积分表"], "根式积分、有理函数积分、定积分换元。", "分母形状决定原函数是 arctan、arcsin 还是 log。", "先配成标准型 \\(a^2\\pm x^2\\)，再套表。", "由三角代换或对右端求导验证。", "\\(\\int dx/(4+x^2)=\\frac12\\arctan(x/2)+C\\)。", "参数 \\(a\\) 通常取正；对数绝对值不能漏。"),

  C("calc4-rational-common-integrals", "高等数学", "第4章 不定积分", "有理积分", "有理函数常用积分模板", raw`
\int\frac{f'(x)}{f(x)}dx=\ln|f(x)|+C
\\
\int\frac{dx}{(x-a)^k}=\frac{(x-a)^{1-k}}{1-k}+C\quad(k\ne1)
\\
\int\frac{Mx+N}{x^2+px+q}dx
\text{ 先拆成分母导数项与标准二次项}
`, "常用", ["积分", "有理函数", "部分分式"], "有理函数积分、凑微分、部分分式。", "有理积分不是硬算，而是把分子拆成分母导数和剩余常数。", "二次分母不可分解时先配方，分子凑导数。", "分母导数项积分为对数，剩余标准项给 arctan。", "\\(\\int 2x/(x^2+1)dx=\ln(x^2+1)+C\\)。", "真分式前要先做多项式除法，不然部分分式会漏多项式项。"),

  C("calc4-trig-substitution-table", "高等数学", "第4章 不定积分", "三角代换", "根式三角代换速查表", raw`
\sqrt{a^2-x^2}:\quad x=a\sin t
\\
\sqrt{a^2+x^2}:\quad x=a\tan t
\\
\sqrt{x^2-a^2}:\quad x=a\sec t
\\
\text{配方后先平移，再按标准型代换}
`, "必背", ["积分", "三角代换", "根式"], "根式积分、反三角原函数、定积分。", "三角代换是在用三角恒等式消掉根号。", "先判断根号里是差平方、和平方还是反差平方。", "由 \\(1-\sin^2t=\cos^2t\\)、\\(1+\tan^2t=\sec^2t\\) 等恒等式得到。", "\\(\\sqrt{1-x^2}\\) 令 \\(x=\sin t\\)，根号变 \\(|\\cos t|\\)。", "定积分代换要同时换上下限，还要处理根号正负。"),

  C("calc4-odd-even-power-trig-integrals", "高等数学", "第4章 不定积分", "三角积分", "三角幂积分奇偶套路", raw`
\int\sin^m x\cos^n xdx
\\
m\text{ 为奇数：留 }\sin xdx,\quad n\text{ 为奇数：留 }\cos xdx
\\
m,n\text{ 都为偶数：用 }\sin^2x=\frac{1-\cos2x}{2},\ 
\cos^2x=\frac{1+\cos2x}{2}
`, "技巧", ["积分", "三角积分", "降幂"], "高次三角函数不定积分和定积分。", "奇次留一个凑微分，偶次降幂变低频。", "先看 \\(\\sin,\\cos\\) 的幂次奇偶，再选换元或降幂。", "来自 \\(d\\sin x=\\cos xdx\\)、\\(d\\cos x=-\sin xdx\\) 与降幂公式。", "\\(\\int\\sin^3x\\cos^2xdx\\) 留 \\(\\sin xdx\\)，把 \\(\\sin^2x\\) 化成 \\(1-\cos^2x\\)。", "两个幂次全偶时硬凑微分往往更复杂。"),

  C("calc5-newton-leibniz-substitution", "高等数学", "第5章 定积分", "定积分计算", "Newton-Leibniz 与定积分换元", raw`
\int_a^b f(x)dx=F(b)-F(a)
\\
\int_a^b f(\varphi(t))\varphi'(t)dt
=\int_{\varphi(a)}^{\varphi(b)}f(u)du
\\
\int_a^b f(x)dx=-\int_b^a f(x)dx
`, "必背", ["定积分", "换元", "Newton-Leibniz"], "定积分计算、变上限函数、面积。", "定积分换元不仅换被积函数，也必须换上下限。", "有原函数直接 Newton-Leibniz；复合结构明显时换元并改限。", "微积分基本定理说明积分与求导互逆。", "\\(\\int_0^1 2x e^{x^2}dx=\\int_0^1 e^u du=e-1\\)。", "定积分换元后不要再把旧变量上下限带回去。", "riemann-sum"),

  C("calc5-wallis-definite-integrals", "高等数学", "第5章 定积分", "三角定积分", "Wallis 相关三角定积分速查", raw`
\int_0^{\pi/2}\sin^{2m}x\,dx
=\frac{(2m-1)!!}{(2m)!!}\frac{\pi}{2}
\\
\int_0^{\pi/2}\sin^{2m+1}x\,dx
=\frac{(2m)!!}{(2m+1)!!}
\\
\int_0^\pi \sin^n x\,dx=2\int_0^{\pi/2}\sin^n x\,dx
`, "技巧", ["定积分", "Wallis", "三角积分", "华里士"], "高次正弦余弦定积分、选择填空提速。", "这张是华里士公式在定积分中的考场版。", "区间为 \\([0,\\pi/2]\\) 或能对称变过去时优先套。", "由分部积分递推 \\(I_n=(n-1)I_{n-2}/n\\) 得到。", "\\(\\int_0^{\\pi}\\sin^4xdx=2\\cdot(3!!/4!!)\\pi/2=3\\pi/8\\)。", "注意奇偶次公式不同；区间不是标准区间先做变换。", "wallis-recursion"),

  C("calc5-definite-even-odd-periodic", "高等数学", "第5章 定积分", "对称周期", "定积分奇偶性、周期性与平移公式", raw`
\int_{-a}^{a}f(x)dx=
\begin{cases}
0,&f\text{ 为奇函数}\\
2\int_0^a f(x)dx,&f\text{ 为偶函数}
\end{cases}
\\
f(x+T)=f(x)\Rightarrow \int_a^{a+T}f(x)dx=\int_0^T f(x)dx
\\
\int_0^{nT}f(x)dx=n\int_0^T f(x)dx
`, "必背", ["定积分", "对称", "周期", "三角积分"], "三角定积分、选择填空、Fourier 系数。", "奇偶性负责砍半或归零，周期性负责把区间挪到最舒服的位置。", "遇到对称区间先看奇偶；遇到完整周期先平移。", "由换元 \\(x=-t\\) 和 \\(x=u+a\\) 可推出。", "\\(\\int_{-\\pi}^{\\pi}x\\cos xdx=0\\)。", "非对称区间不能硬套奇偶性；周期公式要求完整周期。", "riemann-sum"),

  C("calc5-definite-pairing-advanced", "高等数学", "第5章 定积分", "区间配对", "定积分区间配对高频模板", raw`
\int_0^a f(x)dx=\int_0^a f(a-x)dx
\\
\int_0^a f(x)dx=\frac12\int_0^a\bigl[f(x)+f(a-x)\bigr]dx
\\
f(x)+f(a-x)=C\Rightarrow \int_0^a f(x)dx=\frac{aC}{2}
\\
\int_0^{\pi/2}f(\sin x,\cos x)dx
=\int_0^{\pi/2}f(\cos x,\sin x)dx
`, "技巧", ["定积分", "区间配对", "三角积分"], "选择填空里的定积分快算。", "配对就是把区间左端和右端的函数值拉到一起看。", "看到 \\(0\\) 到 \\(a\\)、\\(0\\) 到 \\(\\pi/2\\) 或 \\(f(x)+f(a-x)\\)，优先配对。", "令 \\(u=a-x\\) 或 \\(u=\\pi/2-x\\) 即可得到。", "\\(\\int_0^{\\pi/2}\\frac{dx}{1+\\tan x}=\\pi/4\\)。", "只有被积函数和区间能配成互补时才好用。"),

  C("calc10-jacobian-common-maps", "高等数学", "第10章 重积分", "坐标变换", "常用二重积分变换 Jacobi 表", raw`
x=r\cos\theta,\ y=r\sin\theta:\quad J=r
\\
x=au,\ y=bv:\quad J=|ab|
\\
x=\frac{u+v}{2},\ y=\frac{u-v}{2}:\quad |J|=\frac12
\\
dA=\left|\frac{\partial(x,y)}{\partial(u,v)}\right|dudv
`, "常用", ["重积分", "Jacobi", "换元"], "二重积分换元、椭圆区域积分、变量旋转。", "Jacobi 是坐标网格面积被拉伸的倍率。", "圆域用极坐标，椭圆域先缩放成单位圆。", "由二元函数换元公式和面积微元变换得到。", "\\(x=au,y=bv\\) 把椭圆变圆，面积微元变为 \\(|ab|dudv\\)。", "最常漏的是极坐标的 \\(r\\) 和绝对值。"),

  C("calc11-green-area-expanded", "高等数学", "第11章 曲线积分与曲面积分", "Green公式", "Green 公式面积公式", raw`
\oint_L Pdx+Qdy=\iint_D(Q_x-P_y)dA
\\
A=\iint_D1dA=\frac12\oint_L xdy-ydx
\\
A=\oint_L x\,dy=-\oint_L y\,dx\quad(L\text{正向})
`, "技巧", ["Green", "面积", "曲线积分", "Green 公式面积"], "平面闭曲线面积、参数曲线面积。", "Green 公式把边界绕一圈的信息转成区域面积。", "闭曲线面积题，尤其参数曲线，优先想 \\(\\frac12\\oint xdy-ydx\\)。", "在 Green 公式中取 \\(P=-y/2,Q=x/2\\) 即得。", "椭圆 \\(x=a\cos t,y=b\sin t\\) 面积为 \\(\\pi ab\\)。", "曲线方向必须为正向，反向会差一个负号。"),

  C("calc11-surface-orientation-flux", "高等数学", "第11章 曲线积分与曲面积分", "曲面积分", "曲面取向与通量计算模板", raw`
\iint_\Sigma P\,dydz+Q\,dzdx+R\,dxdy
=\iint_\Sigma \mathbf F\cdot\mathbf n\,dS
\\
z=z(x,y),\ \text{上侧：}\quad
\mathbf n\,dS=(-z_x,-z_y,1)dxdy
\\
\iint_{\partial\Omega}\mathbf F\cdot\mathbf n\,dS
=\iiint_\Omega \operatorname{div}\mathbf F\,dV
`, "必背", ["曲面积分", "通量", "Gauss", "取向"], "第二型曲面积分、Gauss 公式。", "第二型曲面积分本质是向量场穿过曲面的通量。", "先确定取向，再把 \\(\\mathbf n dS\\) 投影到坐标面。", "参数化曲面的叉乘给出有向面积元。", "上侧曲面 \\(z=x^2+y^2\\) 的有向面积元为 \\((-2x,-2y,1)dxdy\\)。", "取向错会整体变号；闭曲面默认外侧。"),

  C("calc12-geometric-derived-series", "高等数学", "第12章 无穷级数", "幂级数求和", "几何级数派生求和公式", raw`
\sum_{n=0}^{\infty}x^n=\frac1{1-x}\quad(|x|<1)
\\
\sum_{n=1}^{\infty}nx^{n-1}=\frac1{(1-x)^2}
\\
\sum_{n=1}^{\infty}nx^n=\frac{x}{(1-x)^2}
\\
\sum_{n=1}^{\infty}\frac{x^n}{n}=-\ln(1-x)
`, "必背", ["幂级数", "求和", "几何级数"], "幂级数求和、概率母函数、期望计算。", "很多幂级数求和都是几何级数求导或积分。", "先把目标级数改造成 \\(\\sum x^n\\)，再逐项求导/积分。", "在收敛区间内幂级数可逐项求导和积分。", "\\(\\sum_{n=1}^{\\infty}n/2^n=2\\)。", "逐项操作只在收敛区间内部稳妥，端点要单独检查。"),

  C("calc12-common-numeric-series", "高等数学", "第12章 无穷级数", "常数项级数", "常见数项级数结论速查", raw`
\sum_{n=1}^{\infty}\frac1{n^p}\text{收敛}\iff p>1
\\
\sum_{n=1}^{\infty}q^n\text{收敛}\iff |q|<1
\\
\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{n}=\ln2
\\
\sum_{n=1}^{\infty}\frac1{n(n+1)}=1
`, "必背", ["级数", "p级数", "几何级数", "常用结论"], "级数判敛、快速对比、选择填空。", "常见级数是判别法里的标尺。", "正项级数先和 p 级数、几何级数比较。", "p 级数由积分判别得到，几何级数由等比求和得到。", "\\(\\sum 1/(n^2+n)\\) 裂项后和为 1。", "别把调和级数 \\(\\sum1/n\\) 误认为收敛。"),

  C("calc12-comparison-integral-tests", "高等数学", "第12章 无穷级数", "判别法", "比较判别、极限比较与积分判别", raw`
0\le u_n\le v_n,\quad \sum v_n\text{收敛}\Rightarrow \sum u_n\text{收敛}
\\
\lim\frac{u_n}{v_n}=c,\quad0<c<\infty\Rightarrow \sum u_n,\sum v_n\text{同敛散}
\\
f(x)\downarrow,\ f(x)\ge0:\quad
\sum_{n=1}^{\infty}f(n)\text{ 与 }\int_1^\infty f(x)dx\text{同敛散}
`, "必背", ["级数", "比较判别", "积分判别"], "正项级数判敛。", "正项级数判敛就是比较尾项衰减速度。", "有标准等价时用极限比较；像 \\(1/(n\ln n)\\) 时用积分判别。", "单调正函数的矩形面积与曲线面积可以互相夹住。", "\\(\\sum1/[n(\\ln n)^2]\\) 用积分判别收敛。", "极限比较的常数必须是正有限数；积分判别要单调非负。"),

  C("calc12-ratio-root-tests", "高等数学", "第12章 无穷级数", "判别法", "比值判别与根值判别", raw`
\rho=\lim_{n\to\infty}\left|\frac{u_{n+1}}{u_n}\right|
\\
\rho<1\Rightarrow \sum u_n\text{绝对收敛},\quad
\rho>1\Rightarrow \sum u_n\text{发散}
\\
\rho=\lim_{n\to\infty}\sqrt[n]{|u_n|}
\quad\text{根值判别同理}
\\
\rho=1\Rightarrow \text{判别失效}
`, "必背", ["级数", "比值判别", "根值判别", "绝对收敛"], "含阶乘、指数、n 次幂的级数判敛。", "比值看相邻项衰减倍率，根值看第 n 项的平均倍率。", "有 \\(n!\\)、\\(a^n\\)、\\(n^n\\) 时优先比值或根值。", "和几何级数比较得到临界倍率 1。", "\\(\\sum n!/n^n\\) 用比值判别可快速判断收敛。", "\\(\\rho=1\\) 完全无结论，要改用比较、积分或交错判别。"),

  C("calc12-alternating-absolute-conditional", "高等数学", "第12章 无穷级数", "判别法", "交错级数、绝对收敛与条件收敛", raw`
u_n\downarrow0,\ u_n\ge0\Rightarrow
\sum_{n=1}^{\infty}(-1)^{n-1}u_n\text{收敛}
\\
\sum |u_n|\text{收敛}\Rightarrow \sum u_n\text{绝对收敛}
\\
\sum u_n\text{收敛但}\sum|u_n|\text{发散}\Rightarrow \text{条件收敛}
\\
|R_n|\le u_{n+1}\quad\text{交错级数余项估计}
`, "必背", ["级数", "交错级数", "绝对收敛", "条件收敛"], "交错级数判敛、误差估计。", "交错级数靠正负抵消收敛，但绝对收敛才是真稳定。", "看到 \\((-1)^n\\) 先看正项是否单调趋零，再查绝对收敛。", "Leibniz 判别来自部分和在两个夹逼序列间摆动并收敛。", "\\(\\sum(-1)^{n-1}/n\\) 条件收敛。", "正项必须趋零且最终单调；绝对收敛和条件收敛不要混。"),

  C("calc12-power-series-endpoints", "高等数学", "第12章 无穷级数", "幂级数", "幂级数收敛半径与端点检查", raw`
\sum a_n(x-x_0)^n,\quad
R=\frac1{\limsup\sqrt[n]{|a_n|}}
\\
\text{若 }\lim\left|\frac{a_n}{a_{n+1}}\right|=R,\quad |x-x_0|<R\text{ 收敛}
\\
|x-x_0|>R\text{ 发散}
\\
x=x_0\pm R\text{ 端点必须单独代回判别}
`, "必背", ["幂级数", "收敛半径", "端点"], "幂级数收敛域、函数展开。", "半径管中间，端点另外判；端点是幂级数最爱挖坑的地方。", "先用比值/根值求半径，再把两个端点代回原级数。", "由根值判别作用在 \\(|a_n||x-x_0|^n\\) 上得到。", "\\(\\sum x^n/n\\) 半径为 1，端点 \\(x=1\\) 发散，\\(x=-1\\) 收敛。", "不要把开区间结论直接带到端点。"),

  C("linear1-row-column-ops", "线性代数", "第1章 行列式", "行列式性质", "行列式行列初等变换规则", raw`
R_i\leftrightarrow R_j:\quad |A|\mapsto-|A|
\\
R_i\leftarrow kR_i:\quad |A|\mapsto k|A|
\\
R_i\leftarrow R_i+kR_j:\quad |A|\text{不变}
\\
|A^T|=|A|
`, "必背", ["行列式", "初等变换", "行变换"], "行列式计算、化三角、证明题。", "行列式对行列变换很敏感，但倍加不改变体积。", "算行列式优先用倍加造零，再展开或化三角。", "交换改变方向，数乘改变尺度，倍加相当于剪切不改体积。", "上三角行列式等于主对角线乘积。", "行列式行变换规则和矩阵方程行变换不是一回事，数乘行会改变行列式。"),

  C("linear1-special-determinants", "线性代数", "第1章 行列式", "特殊行列式", "特殊行列式速查", raw`
\begin{vmatrix}a&b\\c&d\end{vmatrix}=ad-bc
\\
\begin{vmatrix}
a&b&b\\b&a&b\\b&b&a
\end{vmatrix}=(a-b)^2(a+2b)
\\
\left|\operatorname{diag}(d_1,\dots,d_n)\right|=\prod_{i=1}^{n}d_i
`, "常用", ["行列式", "特殊行列式", "技巧"], "二三阶行列式、对称常数矩阵、选择填空。", "特殊结构行列式不要硬展开，要抓公共模式。", "常数对角加常数非对角型可用特征值或行列变换。", "第二式可由特征值 \\(a+2b,a-b,a-b\\) 得到。", "\\(a=2,b=1\\) 时行列式为 4。", "特殊公式要先确认矩阵结构完全一致。"),

  C("linear2-invertible-equivalents", "线性代数", "第2章 矩阵及其运算", "可逆矩阵", "矩阵可逆等价条件全表", raw`
A\text{可逆}\iff |A|\ne0\iff r(A)=n
\\
\iff Ax=0\text{只有零解}\iff Ax=b\text{对任意 }b\text{有唯一解}
\\
\iff A\text{的列向量线性无关}\iff 0\text{不是 }A\text{的特征值}
`, "必背", ["矩阵", "可逆", "秩", "特征值"], "矩阵可逆判断、线性方程组、特征值。", "可逆意味着这个线性变换没有压扁任何方向。", "可逆题可以在行列式、秩、方程组、特征值之间切换。", "这些条件都等价于线性变换核空间只有零向量。", "\\(A\\) 有特征值 0，则 \\(|A|=0\\)，不可逆。", "只对方阵谈可逆；非方阵只能谈左逆、右逆或秩。", "matrix-transform"),

  C("linear3-general-solution-structure", "线性代数", "第3章 初等变换与线性方程组", "通解结构", "齐次与非齐次通解结构", raw`
Ax=0:\quad x=k_1\xi_1+\cdots+k_{n-r}\xi_{n-r}
\\
Ax=b:\quad x=\eta+k_1\xi_1+\cdots+k_{n-r}\xi_{n-r}
\\
\dim N(A)=n-r(A)
`, "必背", ["方程组", "通解", "基础解系"], "线性方程组大题、参数解。", "非齐次通解就是一个特解加上齐次解空间。", "先化阶梯形求特解，再给自由变量构造基础解系。", "两个非齐次解相减满足齐次方程。", "若三元方程组秩为 1，则齐次基础解系含 2 个向量。", "非齐次无解时不能写通解；必须先检查增广矩阵秩。"),

  C("linear4-rank-dimension-relations", "线性代数", "第4章 向量组线性相关性", "秩与维数", "向量组秩、极大无关组与维数", raw`
r(\alpha_1,\dots,\alpha_m)=\text{极大线性无关组所含向量个数}
\\
\dim(\operatorname{span}\{\alpha_i\})=r(\alpha_1,\dots,\alpha_m)
\\
\alpha\text{可由向量组线性表示}\iff r(\alpha_1,\dots,\alpha_m,\alpha)=r(\alpha_1,\dots,\alpha_m)
`, "必背", ["向量组", "秩", "维数", "线性表示"], "向量组判定、极大无关组、线性表示。", "秩就是这组向量真正提供的独立方向数。", "要判断能否表示，把目标向量并入后看秩是否增加。", "如果新向量在原张成空间内，不会增加维数。", "二维平面中任意三个向量必线性相关。", "矩阵行秩、列秩相等，但具体行向量空间和列向量空间不是同一空间。"),

  C("linear5-diagonalization-criteria", "线性代数", "第5章 相似矩阵及二次型", "对角化", "相似对角化判别全表", raw`
A\text{可对角化}\iff \sum_i \dim N(A-\lambda_iE)=n
\\
\lambda_i\text{互异 }(i=1,\dots,n)\Rightarrow A\text{可对角化}
\\
A=A^T\Rightarrow A\text{可正交对角化}
\\
P^{-1}AP=\Lambda
`, "必背", ["特征值", "对角化", "相似矩阵"], "矩阵高次幂、二次型、理论判断。", "对角化就是找到足够多方向不变的坐标轴。", "先求特征值，再比较每个特征值的线性无关特征向量个数。", "特征向量构成基时，矩阵在这组基下就是对角矩阵。", "二阶矩阵有两个不同特征值时一定可对角化。", "代数重数不等于几何重数时会卡住，不能只看特征值个数。", "matrix-transform"),

  C("linear5-quadratic-form-methods", "线性代数", "第5章 相似矩阵及二次型", "二次型", "二次型化标准形三法", raw`
f=x^TAx,\quad A=A^T
\\
\text{配方法：逐步消去交叉项}
\\
\text{正交变换：}Q^TAQ=\Lambda
\\
\text{初等变换法：合同变换 }C^TAC
`, "常用", ["二次型", "合同", "正交对角化", "配方法"], "二次型化标准形、正定判别。", "二次型化简的目标是消掉交叉项，只留下平方项。", "数字简单用配方；实对称矩阵且要正交变换用特征值法。", "合同变换对应可逆线性换元，不改变正负惯性指数。", "\\(x^2+2xy+y^2=(x+y)^2\\)。", "相似变换和合同变换不是一回事；二次型用合同。", "matrix-transform"),

  C("prob1-set-operations", "概率论", "第1章 随机事件与概率", "事件运算", "事件运算与概率加法公式", raw`
\overline{A\cup B}=\bar A\bar B,\quad \overline{AB}=\bar A\cup\bar B
\\
P(A\cup B)=P(A)+P(B)-P(AB)
\\
P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(AB)-P(AC)-P(BC)+P(ABC)
\\
P(\bar A)=1-P(A)
`, "必背", ["概率", "事件运算", "加法公式"], "事件概率、容斥、独立互斥判断。", "事件运算先画集合图，概率加法就是避免重复计数。", "多个事件“至少一个发生”优先用并集或对立事件。", "由集合容斥原理得到概率形式。", "至少一次成功概率为 \\(1-P(\\text{全失败})\\)。", "互斥才有 \\(P(A\\cup B)=P(A)+P(B)\\)，一般情况要减交集。"),

  C("prob1-classical-geometric-probability", "概率论", "第1章 随机事件与概率", "古典概型", "古典概型与几何概型", raw`
P(A)=\frac{\text{有利基本事件数}}{\text{基本事件总数}}
\\
P(A)=\frac{\text{有利区域长度/面积/体积}}{\text{样本空间长度/面积/体积}}
\\
\text{等可能性是使用前提}
`, "必背", ["概率", "古典概型", "几何概型"], "排列组合概率、随机点落区间区域。", "古典概型数点，几何概型量区域。", "先确认样本点等可能，再决定是计数还是求面积。", "概率公理在等可能有限样本空间或均匀几何区域上的直接应用。", "随机点落在单位正方形内 \\(x+y<1\\) 的概率是 \\(1/2\\)。", "分子分母的样本空间口径必须一致，不能一个有序一个无序。"),

  C("prob2-cdf-pdf-properties-full", "概率论", "第2章 随机变量及其分布", "分布函数", "分布函数、密度与概率计算", raw`
F(x)=P(X\le x)
\\
P(a<X\le b)=F(b)-F(a)
\\
f(x)=F'(x),\quad F(x)=\int_{-\infty}^{x}f(t)dt
\\
\int_{-\infty}^{\infty}f(x)dx=1,\quad f(x)\ge0
`, "必背", ["随机变量", "分布函数", "密度"], "连续型随机变量概率、密度求解。", "分布函数是从左到右累计概率，密度是累计速度。", "连续型算区间概率时用积分或分布函数差。", "密度是分布函数的导数，分布函数是密度的积分。", "若 \\(X\\sim U(0,1)\\)，则 \\(P(0.2<X<0.5)=0.3\\)。", "连续型单点概率为 0，但分布函数可能在离散点跳跃。", "distribution-plot"),

  C("prob2-discrete-expectation-shortcuts", "概率论", "第2章 随机变量及其分布", "离散分布技巧", "离散型期望常用求和技巧", raw`
E X=\sum_k kP(X=k)
\\
E X=\sum_{k=1}^{\infty}P(X\ge k)\quad(X\in\mathbb N)
\\
E[X(X-1)]=\sum_k k(k-1)P(X=k)
\\
D X=E[X(X-1)]+EX-(EX)^2
`, "常用", ["期望", "离散型", "求和技巧"], "离散分布期望方差、尾和公式。", "尾和公式把取值贡献拆成一层层“至少达到”。", "非负整数型随机变量求期望困难时，可尝试尾和。", "把 \\(k=\\sum_{j=1}^{k}1\\) 代入并交换求和顺序得到。", "几何分布可用尾和快速求 \\(EX=1/p\\)。", "尾和公式要求非负整数型或先做相应平移。"),

  C("prob3-min-max-distributions", "概率论", "第3章 多维随机变量", "最大最小", "独立样本最大最小分布", raw`
M=\max(X_1,\dots,X_n):\quad F_M(x)=\prod_{i=1}^{n}F_i(x)
\\
m=\min(X_1,\dots,X_n):\quad
P(m>x)=\prod_{i=1}^{n}[1-F_i(x)]
\\
\text{i.i.d. 时 }F_M(x)=F^n(x),\quad F_m(x)=1-[1-F(x)]^n
`, "常用", ["多维随机变量", "最大值", "最小值", "独立"], "次序统计量、寿命问题、样本极值。", "最大值不超过 x 等于所有变量都不超过 x；最小值大于 x 等于所有变量都大于 x。", "求极值分布先写成所有样本同时满足的事件。", "独立性让联合概率拆成边缘概率乘积。", "三个独立 \\(U(0,1)\\) 最大值分布为 \\(x^3\\)。", "没有独立性不能直接乘；连续离散混合时要回到事件定义。", "distribution-plot"),

  C("prob4-covariance-properties", "概率论", "第4章 数字特征", "协方差", "协方差性质全表", raw`
\operatorname{Cov}(X,Y)=E(XY)-EXEY
\\
\operatorname{Cov}(aX+b,cY+d)=ac\,\operatorname{Cov}(X,Y)
\\
D(X\pm Y)=DX+DY\pm2\operatorname{Cov}(X,Y)
\\
X\perp Y\Rightarrow \operatorname{Cov}(X,Y)=0
`, "必背", ["协方差", "方差", "相关系数"], "二维随机变量数字特征、线性组合方差。", "协方差衡量两个变量是否一起偏离各自平均值。", "算和差方差时先写协方差项，不要默认独立。", "由方差定义展开平方得到。", "\\(D(X-Y)=DX+DY-2Cov(X,Y)\\)。", "不相关不一定独立；独立才一定不相关。"),

  C("prob5-lln-forms", "概率论", "第5章 大数定律与中心极限定理", "大数定律", "大数定律常用形式", raw`
\bar X_n=\frac1n\sum_{i=1}^{n}X_i
\\
\bar X_n\xrightarrow{P}\mu
\\
P(|\bar X_n-\mu|<\varepsilon)\to1
\\
\frac1n\sum_{i=1}^{n}g(X_i)\xrightarrow{P}E[g(X)]
`, "必背", ["大数定律", "依概率收敛", "样本均值"], "样本均值稳定性、频率估计概率。", "大数定律说大量重复试验的平均会稳定到理论平均。", "看到样本平均、频率、经验均值，优先想大数定律。", "Chebyshev 不等式可证明方差有限情形。", "抛硬币正面频率依概率收敛到 \\(p\\)。", "大数定律给稳定性，不给精确误差分布；误差分布看 CLT。", "clt-demo"),

  C("prob6-sample-mean-variance-properties", "概率论", "第6章 数理统计基本概念", "统计量", "样本均值与样本方差性质", raw`
\bar X=\frac1n\sum_{i=1}^{n}X_i,\quad
S^2=\frac1{n-1}\sum_{i=1}^{n}(X_i-\bar X)^2
\\
E\bar X=\mu,\quad D\bar X=\frac{\sigma^2}{n}
\\
ES^2=\sigma^2
\\
\sum_{i=1}^{n}(X_i-\bar X)^2=\sum X_i^2-n\bar X^2
`, "必背", ["样本均值", "样本方差", "统计量"], "参数估计、抽样分布、假设检验。", "样本均值估中心，样本方差用 \\(n-1\\) 修正偏差。", "计算样本方差时常用平方和公式提速。", "展开平方并用 \\(\\sum(X_i-\bar X)=0\\) 得到化简式。", "样本量越大，\\(D\\bar X=\\sigma^2/n\\) 越小。", "样本方差分母是 \\(n-1\\)，不是 \\(n\\)，除非题目另有定义。"),

  C("prob7-mle-common-models", "概率论", "第7章 参数估计", "极大似然", "常见分布 MLE 速查（扩展版含均匀）", raw`
X_i\sim B(1,p):\quad \hat p=\bar X
\\
X_i\sim P(\lambda):\quad \hat\lambda=\bar X
\\
X_i\sim N(\mu,\sigma^2):\quad
\hat\mu=\bar X,\quad \hat\sigma^2=\frac1n\sum(X_i-\bar X)^2
\\
X_i\sim U(0,\theta):\quad \hat\theta=\max X_i
`, "常用", ["MLE", "参数估计", "常见分布", "扩展版"], "极大似然估计计算题；扩展版含均匀分布（边界型MLE）。", "MLE 选择让当前样本出现概率最大的参数。", "均匀分布边界型不能对数求导，要从支撑集约束分析；其余与基础版相同。", "对数似然求导为零给内部最大点，边界型由支持集决定。", "Poisson 样本的 MLE 是样本均值。", "正态方差的 MLE 分母是 \\(n\\)，无偏样本方差分母是 \\(n-1\\)。"),

  C("prob8-test-workflow-summary", "概率论", "第8章 假设检验", "检验流程", "假设检验四步法与统计量选择", raw`
1.\ H_0,H_1
\\
2.\ \text{选统计量 }Z,T,\chi^2,F
\\
3.\ \text{按 }\alpha\text{ 确定拒绝域}
\\
4.\ \text{代入样本值并下结论}
\\
p\le\alpha\Rightarrow \text{拒绝 }H_0
`, "必背", ["假设检验", "拒绝域", "p值"], "假设检验大题完整步骤。", "假设检验是把样本结果放到原假设世界里，看它是否太极端。", "先看总体类型和未知参数，再决定统计量。", "统计量在 \\(H_0\\) 成立时服从已知分布，因此可划定尾部拒绝域。", "若 p 值 0.03，显著性水平 0.05 下拒绝，0.01 下不拒绝。", "不能把“不拒绝”写成“接受且证明为真”。"),

  C("cold-bertrand-test", "冷门技巧", "冷门但高收益技巧库", "级数", "Bertrand 判别与对数级数标尺", raw`
\sum_{n=2}^{\infty}\frac1{n(\ln n)^p}\text{收敛}\iff p>1
\\
\sum_{n=3}^{\infty}\frac1{n\ln n(\ln\ln n)^p}\text{收敛}\iff p>1
`, "拓展", ["Bertrand", "级数", "对数级数", "冷门技巧"], "比 p 级数更慢的正项级数判敛。", "对数级数是 p 级数边界上的第二把尺。", "看到 \\(n\\ln n\\)、\\(n\\ln n\\ln\\ln n\\) 分母结构时联想它。", "用积分判别，令 \\(u=\ln x\\) 逐层换元。", "\\(\\sum1/[n(\\ln n)^2]\\) 收敛，\\(\\sum1/(n\ln n)\\) 发散。", "下标要从使对数有意义处开始；这是拓展技巧，大题优先写积分判别。"),

  C("cold-differentiation-under-integral", "冷门技巧", "冷门但高收益技巧库", "积分", "含参数积分求导技巧（Feynman 技巧）", raw`
F(a)=\int_{\alpha}^{\beta}f(x,a)dx
\\
F'(a)=\int_{\alpha}^{\beta}f_a(x,a)dx
\\
F(a)=\int_{\alpha(a)}^{\beta(a)}f(x,a)dx
\Rightarrow
F'=f(\beta,a)\beta'-f(\alpha,a)\alpha'+\int_{\alpha}^{\beta}f_a(x,a)dx
`, "技巧", ["含参数积分", "Feynman技巧", "积分", "冷门技巧"], "含 \\(\\ln\\)、参数幂、分母参数的定积分。", "把难积分升级成一个函数，求导后它可能变简单。", "看到 \\(\\ln x\\)、\\(x^a\\)、\\(1/(x+a)\\) 等参数结构时考虑。", "由积分上限函数求导和偏导与积分交换得到。", "设 \\(F(a)=\\int_0^1(x^a-1)/\ln xdx\\)，则 \\(F'(a)=1/(a+1)\\)。", "交换求导和积分需要连续性或一致收敛等条件，考场要简单说明。")

  ,
  C("pre-sum-power-faulhaber", "前置基础", "0. 前置基础", "数列求和", "高次幂求和与渐近阶", raw`
\sum_{k=1}^{n}k^4=\frac{n(n+1)(2n+1)(3n^2+3n-1)}{30}
\\
\sum_{k=1}^{n}k^5=\frac{n^2(n+1)^2(2n^2+2n-1)}{12}
\\
\sum_{k=1}^{n}k^p\sim \frac{n^{p+1}}{p+1}\quad(p>-1)
`, "常用", ["数列", "求和", "渐近", "Faulhaber"], "数列极限、Riemann 和、级数比较里经常需要最高阶。", "高次幂求和不一定要全背，考场最重要的是知道主项阶数。", "遇到 \\(\\sum k^p/n^{p+1}\\) 先抽主项；若需要精确值再套四次、五次公式。", "可由差分 \\((k+1)^{m+1}-k^{m+1}\\) 反解，主项也可由积分比较得到。", "\\(n^{-6}\\sum_{k=1}^{n}k^5\\to1/6\\)。", "渐近式只给极限主项，不适合要求精确整数值的题。"),

  C("pre-harmonic-sum-estimates", "前置基础", "0. 前置基础", "数列估计", "调和数与倒数平方估计", raw`
H_n=\sum_{k=1}^{n}\frac1k=\ln n+\gamma+o(1)
\\
\ln(n+1)<H_n<1+\ln n
\\
\sum_{k=1}^{n}\frac1{k^2}\uparrow \frac{\pi^2}{6},\quad
\sum_{k=n+1}^{\infty}\frac1{k^2}<\frac1n
`, "技巧", ["调和数", "估计", "级数", "夹逼"], "含 \\(1/k\\)、\\(1/k^2\\) 的数列极限和误差估计。", "调和和长得像对数，平方倒数的尾巴大约像 \\(1/n\\)。", "看到 \\(\sum 1/k\\) 想 \\(\ln n\\)；看到平方倒数尾和想积分估计。", "由 \\(\int_k^{k+1}1/x\,dx\\) 与矩形面积比较可得调和估计。", "\\(H_{2n}-H_n\to\ln2\\)。", "不要把 \\(H_n\\) 当成收敛数列；它发散但速度很慢。"),

  C("pre-inequality-core-expanded", "前置基础", "0. 前置基础", "不等式", "Bernoulli、Young、Hölder 速查", raw`
(1+x)^\alpha\ge 1+\alpha x\quad(\alpha\ge1,\ x>-1)
\\
ab\le \frac{a^p}{p}+\frac{b^q}{q}\quad(a,b\ge0,\ p,q>1,\ \frac1p+\frac1q=1)
\\
\sum |a_ib_i|\le
\left(\sum |a_i|^p\right)^{1/p}
\left(\sum |b_i|^q\right)^{1/q}
`, "常用", ["不等式", "Bernoulli", "Young", "Hölder"], "证明估计、级数收敛、概率矩估计。", "它们都是把乘积或幂函数压成更容易控制的和。", "看到乘积不好估，想 Young/Hölder；看到 \\((1+x)^n\\) 下界，想 Bernoulli。", "Young 可由凸函数切线或加权均值不等式推出，Hölder 是 Cauchy 的推广。", "\\(2ab\le a^2+b^2\\) 是 Young 在 \\(p=q=2\\) 的特例。", "Hölder 指数必须共轭；Bernoulli 的指数和 \\(x\\) 条件别漏。"),

  C("pre-trig-inequalities", "前置基础", "0. 前置基础", "三角估计", "三角函数常用夹逼不等式", raw`
0<x<\frac{\pi}{2}:\quad \sin x<x<\tan x
\\
|\sin x|\le |x|,\quad
1-\cos x=2\sin^2\frac{x}{2}\le \frac{x^2}{2}
\\
\frac{2}{\pi}x\le \sin x\le x\quad(0\le x\le\frac{\pi}{2})
`, "必背", ["三角", "夹逼", "极限", "不等式"], "证明基本极限、估计三角误差、夹逼极限。", "单位圆告诉你弦长、弧长、切线段的大小关系。", "看到 \\(\\sin x/x\\)、\\(1-\cos x\\) 或三角误差，优先用这张表夹。", "由单位圆面积比较可得 \\(\sin x<x<\tan x\\)，再推出基本极限。", "\\(0\le(1-\cos x)/x\le x/2\to0\\)。", "这些不等式常有区间限制；推广到负数时要注意奇偶性和绝对值。"),

  C("calc1-little-o-rules", "高等数学", "第1章 函数与极限", "无穷小阶", "o、O、等价的运算规则", raw`
o(\alpha)+o(\alpha)=o(\alpha),\quad
O(\alpha)+O(\alpha)=O(\alpha)
\\
o(\alpha)\cdot O(\beta)=o(\alpha\beta)
\\
f\sim g\Rightarrow f-g=o(g)
\\
f=g+o(g)\Rightarrow f\sim g
`, "必背", ["极限", "无穷小", "小o", "大O"], "Taylor 主项、等价替换、证明渐近式。", "小 \\(o\\) 是“可忽略项”，大 \\(O\\) 是“同一量级以内”。", "做主项分析时先保留最低非零阶，其余写成 \\(o\\) 项。", "把定义代入商的极限即可验证这些运算。", "\\(\\sin x=x+o(x)\\)，所以 \\(\\sin x-x=o(x)\\)。", "加减法中若主项抵消，必须继续找下一阶，不能机械替换。"),

  C("calc1-principal-part-subtraction", "高等数学", "第1章 函数与极限", "主项法", "加减抵消时的主项原则", raw`
f=a_mx^m+a_{m+1}x^{m+1}+o(x^{m+1})
\\
g=a_mx^m+b_{m+1}x^{m+1}+o(x^{m+1})
\\
f-g=(a_{m+1}-b_{m+1})x^{m+1}+o(x^{m+1})
`, "技巧", ["极限", "Taylor", "主项", "抵消"], "处理 \\(0/0\\) 中最常见的加减消主项。", "等价替换遇到减法会失灵，Taylor 是把被消掉的项继续往后追。", "分子有 \\(1-\cos x\\)、\\(e^x-1-x\\)、\\(\\ln(1+x)-x\\) 时立刻展开到下一阶。", "把两式都写到相同阶，首个不同系数就是差的主项。", "\\(e^x-1-x\sim x^2/2\\)。", "只展开到没被抵消的第一项；过度展开浪费时间。"),

  C("calc2-parametric-curvature-speed", "高等数学", "第2章 导数与微分", "参数曲线", "参数曲线导数、弧长与曲率", raw`
\frac{dy}{dx}=\frac{y'(t)}{x'(t)}
\\
\frac{d^2y}{dx^2}=\frac{x'(t)y''(t)-y'(t)x''(t)}{[x'(t)]^3}
\\
ds=\sqrt{[x'(t)]^2+[y'(t)]^2}\,dt
\\
\kappa=\frac{|x'y''-y'x''|}{\left((x')^2+(y')^2\right)^{3/2}}
`, "常用", ["参数方程", "导数", "弧长", "曲率"], "参数方程切线、凹凸、弧长应用。", "参数 \\(t\\) 只是中介，真正斜率仍是纵向变化除以横向变化。", "先算 \\(x',y'\\)，再代入；二阶导别直接对 \\(t\\) 求两次。", "由链式法则 \\(dy/dt=(dy/dx)(dx/dt)\\) 得一阶导，再对 \\(x\\) 求导得二阶导。", "\\(x=t^2,y=t^3\\) 时 \\(dy/dx=3t/2\\)。", "必须要求 \\(x'(t)\ne0\\) 才能直接用 \\(dy/dx\\)。"),

  C("calc3-convex-concave-criteria", "高等数学", "第3章 微分中值定理与导数应用", "凸性", "凸函数、切线与 Jensen 公式", raw`
f''(x)\ge0\Rightarrow f\text{ 凸}
\\
f(tx+(1-t)y)\le tf(x)+(1-t)f(y)
\\
f(x)\ge f(x_0)+f'(x_0)(x-x_0)
\\
f(E X)\le E f(X)
`, "常用", ["凸函数", "Jensen", "不等式", "导数应用"], "证明不等式、最值、概率期望估计。", "凸函数图像在弦下方、在切线上方。", "看到 \\(\ln\\)、\\(e^x\\)、幂函数不等式，先判断凸凹再用切线或 Jensen。", "二阶导非负表示导数递增，斜率递增推出图像凸。", "由 \\(e^x\\ge1+x\\) 可迅速证明许多指数不等式。", "Jensen 的方向取决于凸凹；凹函数不等号反向。"),

  C("calc3-newton-method-expanded", "高等数学", "第3章 微分中值定理与导数应用", "零点近似", "Newton 迭代公式扩展", raw`
x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}
\\
f(x)=0,\quad f'(x_n)\ne0
`, "了解", ["Newton", "零点", "近似", "导数应用"], "零点近似、递推数列局部收敛理解。", "用当前点的切线代替曲线，切线与 \\(x\\) 轴交点就是下一次猜测。", "遇到求方程近似根或构造收敛迭代时可识别。", "切线方程 \\(y=f(x_n)+f'(x_n)(x-x_n)\\)，令 \\(y=0\\) 得公式。", "求 \\(\\sqrt a\\) 可用 \\(x_{n+1}=(x_n+a/x_n)/2\\)。", "Newton 法不保证全局收敛，考研大题不能不证收敛就直接用。"),

  C("calc4-rational-function-integration", "高等数学", "第4章 不定积分", "有理函数", "有理函数积分拆分总表", raw`
\frac{P(x)}{Q(x)}=S(x)+\frac{R(x)}{Q(x)},\quad \deg R<\deg Q
\\
\frac{A}{x-a},\quad \frac{A}{(x-a)^k},\quad
\frac{Mx+N}{x^2+px+q}
\\
\int\frac{dx}{(x-a)^k}=
\begin{cases}
\ln|x-a|+C,&k=1\\
-\frac1{(k-1)(x-a)^{k-1}}+C,&k>1
\end{cases}
`, "必背", ["积分", "有理函数", "部分分式"], "有理函数不定积分、反常积分拆项。", "有理函数积分的核心是先做除法，再拆成一次因式和不可约二次因式。", "分母可因式分解时先部分分式；不可约二次配方后出 \\(\\arctan\\)。", "多项式除法和待定系数保证拆分存在且唯一。", "\\(1/(x^2-1)=\\frac12[1/(x-1)-1/(x+1)]\\)。", "真分式才能直接部分分式；若分子次数不低于分母，先除。"),

  C("calc4-reduction-formulas-expanded", "高等数学", "第4章 不定积分", "递推积分", "常用递推积分公式扩展", raw`
\int \sin^n x\,dx=-\frac{\sin^{n-1}x\cos x}{n}
\frac{n-1}{n}\int\sin^{n-2}x\,dx
\\
\int \cos^n x\,dx=\frac{\cos^{n-1}x\sin x}{n}
\frac{n-1}{n}\int\cos^{n-2}x\,dx
\\
I_n=\int x^ne^{ax}dx=\frac{x^ne^{ax}}{a}-\frac{n}{a}I_{n-1}
`, "技巧", ["积分", "递推", "降幂", "分部积分"], "高次三角积分、多项式乘指数积分。", "递推公式是把难的高次积分降到低次积分。", "看到高次幂或 \\(x^n e^{ax}\\)，先想分部一次降阶。", "对三角幂令一部分为 \\(dv\\)，分部后用 \\(\sin^2+\cos^2=1\\) 回代。", "\\(\\int\sin^3x dx=-\\cos x+\cos^3x/3+C\\)。", "不定积分递推有边界项；不要和 Wallis 定积分递推混淆。"),

  C("calc5-average-value", "高等数学", "第5章 定积分", "平均值", "函数平均值与积分中值", raw`
\bar f=\frac1{b-a}\int_a^b f(x)dx
\\
f\text{连续}\Rightarrow \exists \xi\in(a,b):
\int_a^b f(x)dx=f(\xi)(b-a)
\\
\int_a^b f(x)g(x)dx=f(\xi)\int_a^b g(x)dx\quad(g\ge0)
`, "常用", ["定积分", "平均值", "积分中值定理"], "估值、证明存在性、物理平均量。", "定积分除以区间长度就是函数在区间上的平均高度。", "看到“存在 \\(\\xi\\)”且含积分，优先想积分中值定理。", "连续函数在闭区间取最大最小，积分被夹住，再用介值定理。", "\\(\\int_0^1 e^x dx=e^\\xi\\)，其中 \\(0<\\xi<1\\)。", "第二积分中值定理需要权函数不变号，别漏条件。"),

  C("calc5-beta-integral-trig", "高等数学", "第5章 定积分", "特殊定积分", "三角幂积分与 Beta 关系", raw`
\int_0^{\pi/2}\sin^{m}x\cos^{n}x\,dx
=\frac12B\left(\frac{m+1}{2},\frac{n+1}{2}\right)
\\
=\frac{\Gamma\left(\frac{m+1}{2}\right)\Gamma\left(\frac{n+1}{2}\right)}
{2\Gamma\left(\frac{m+n+2}{2}\right)}
`, "技巧", ["定积分", "Beta", "Gamma", "三角积分"], "高次三角定积分、概率密度归一化。", "Beta 函数把三角幂积分压成 Gamma 比值。", "选择填空识别三角幂积分可直接套，解答题可写换元来源。", "令 \\(t=\sin^2x\\)，则 \\(dt=2\sin x\cos xdx\\)，化为 Beta 积分。", "\\(\\int_0^{\pi/2}\sin^2x\,dx=\\pi/4\\)。", "这是技巧公式；若题目不允许特殊函数，可退回 Wallis 递推。"),

  C("calc6-arc-differential-forms", "高等数学", "第6章 定积分应用", "弧长", "弧长微元全表", raw`
y=f(x):\quad ds=\sqrt{1+[f'(x)]^2}\,dx
\\
x=x(t),y=y(t):\quad ds=\sqrt{[x'(t)]^2+[y'(t)]^2}\,dt
\\
r=r(\theta):\quad ds=\sqrt{r^2+\left(\frac{dr}{d\theta}\right)^2}\,d\theta
`, "必背", ["弧长", "定积分应用", "参数方程", "极坐标"], "曲线弧长、旋转曲面面积的基础微元。", "弧长微元就是小直角三角形的斜边。", "先判断曲线表示形式，再选对应微元。", "由 \\(ds^2=dx^2+dy^2\\) 除以参数微分平方开根得到。", "极坐标圆 \\(r=a\\) 的弧长为 \\(\\int_0^{2\pi}a\,d\theta=2\pi a\\)。", "极坐标弧长不是 \\(r\,d\theta\\)，除非 \\(r\\) 为常数或近似处理。"),

  C("calc6-volume-shell-washer", "高等数学", "第6章 定积分应用", "旋转体体积", "垫片法与柱壳法", raw`
V=\pi\int_a^b\left(R^2(x)-r^2(x)\right)dx
\\
V=2\pi\int_a^b x f(x)\,dx\quad(\text{绕 }y\text{轴，柱壳})
\\
V=2\pi\int_c^d y g(y)\,dy\quad(\text{绕 }x\text{轴，柱壳})
`, "必背", ["体积", "旋转体", "垫片法", "柱壳法"], "定积分应用大题中的旋转体体积。", "垫片看截面面积，柱壳看薄壳周长乘高。", "垂直旋转轴切片多用垫片，平行旋转轴切片多用柱壳。", "把微元体积写成截面积乘厚度或周长乘高乘厚度。", "区域 \\(0\le y\le x,0\le x\le1\\) 绕 \\(y\\) 轴：\\(V=2\pi\int_0^1x^2dx=2\pi/3\\)。", "半径一定是到旋转轴的距离，不一定就是 \\(x\\) 或 \\(y\\)。"),

  C("calc6-polar-area", "高等数学", "第6章 定积分应用", "极坐标面积", "极坐标面积公式", raw`
A=\frac12\int_{\alpha}^{\beta}r^2(\theta)\,d\theta
\\
A=\frac12\int_{\alpha}^{\beta}\left(r_1^2-r_2^2\right)d\theta
`, "必背", ["极坐标", "面积", "定积分应用"], "玫瑰线、心形线、摆线相关面积。", "极坐标小扇形面积近似为 \\(\\frac12r^2d\theta\\)。", "先画角度范围，再判断是否有内外曲线。", "由扇形面积 \\(\\frac12r^2\Delta\theta\\) 求和取极限得到。", "圆 \\(r=a\\) 面积 \\(\\frac12\int_0^{2\pi}a^2d\theta=\pi a^2\\)。", "最容易错在重复计算花瓣，要先确认一瓣对应的角区间。"),

  C("calc7-separable-homogeneous-ode", "高等数学", "第7章 微分方程", "一阶方程", "可分离与齐次一阶方程", raw`
\frac{dy}{dx}=X(x)Y(y)
\Rightarrow \int\frac{dy}{Y(y)}=\int X(x)dx+C
\\
\frac{dy}{dx}=F\left(\frac{y}{x}\right),\quad y=vx
\\
\frac{dy}{dx}=v+x\frac{dv}{dx}
`, "必背", ["微分方程", "可分离", "齐次方程"], "一阶微分方程最常见两类。", "可分离是把 \\(x\\) 和 \\(y\\) 分到等号两边；齐次方程用比例 \\(y/x\\) 降维。", "看到右端能写成 \\(X(x)Y(y)\\) 就分离；只含 \\(y/x\\) 就令 \\(y=vx\\)。", "链式法则给出 \\(dy/dx=v+xdv/dx\\)，代入后变成可分离。", "\\(y'=y/x\\) 得 \\(dy/y=dx/x\\)，故 \\(y=Cx\\)。", "分离时不要除以可能为零的解；常值解要单独补回。"),

  C("calc7-linear-first-order-ode", "高等数学", "第7章 微分方程", "一阶线性", "一阶线性方程通解", raw`
y'+P(x)y=Q(x)
\\
y=e^{-\int Pdx}\left[\int Q(x)e^{\int Pdx}dx+C\right]
\\
\mu(x)=e^{\int Pdx}
`, "必背", ["微分方程", "一阶线性", "积分因子"], "一阶线性微分方程、Bernoulli 方程化线性。", "积分因子把左边凑成一个乘积的导数。", "先化成 \\(y'+Py=Q\\)，再套积分因子。", "乘以 \\(\mu=e^{\int Pdx}\\) 后有 \\((\mu y)'=\mu Q\\)。", "\\(y'+y=e^x\\) 得 \\(y=e^{-x}(e^{2x}/2+C)\\)。", "标准形中 \\(y'\\) 的系数必须是 1。"),

  C("calc7-characteristic-repeated-complex", "高等数学", "第7章 微分方程", "常系数方程", "特征根重根与复根模板", raw`
r^2+pr+q=0
\\
r_1\ne r_2:\ y=C_1e^{r_1x}+C_2e^{r_2x}
\\
r_1=r_2=r:\ y=(C_1+C_2x)e^{rx}
\\
r=\alpha\pm i\beta:\ y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)
`, "必背", ["微分方程", "常系数", "特征方程"], "二阶常系数齐次方程。", "指数函数求导仍是指数，所以常系数方程会变成代数方程。", "写特征方程、解根、按根型套模板。", "令 \\(y=e^{rx}\\)，代入得到特征多项式。", "\\(y''+y=0\\) 的通解为 \\(C_1\cos x+C_2\sin x\\)。", "复根模板中 \\(\\beta\\) 是虚部正数，别把 \\(i\\) 写进最终实解。"),

  C("calc8-sphere-plane-line", "高等数学", "第8章 向量代数与空间解析几何", "空间几何", "球面、平面、直线常用方程", raw`
(x-a)^2+(y-b)^2+(z-c)^2=R^2
\\
Ax+By+Cz+D=0
\\
\frac{x-x_0}{l}=\frac{y-y_0}{m}=\frac{z-z_0}{n}
\\
\begin{cases}
x=x_0+lt\\
y=y_0+mt\\
z=z_0+nt
\end{cases}
`, "必背", ["空间解析几何", "球面", "平面", "直线"], "空间几何建模、距离夹角、曲面积分参数化。", "空间对象先找一个点和一个方向或法向量。", "直线用点向式或参数式，平面用法向量，球面用球心半径。", "由向量投影和点法式 \\(\vec n\cdot(\vec r-\vec r_0)=0\\) 得平面方程。", "过点 \\((1,0,0)\\) 法向量 \\((1,2,3)\\) 的平面为 \\(x+2y+3z-1=0\\)。", "直线方向向量不能全零；平面法向量不能为零向量。"),

  C("calc8-distance-formulas-expanded", "高等数学", "第8章 向量代数与空间解析几何", "距离", "点线面距离公式", raw`
d(P,\Pi)=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}
\\
d(P,L)=\frac{|(\vec{P_0P})\times\vec s|}{|\vec s|}
\\
d(L_1,L_2)=\frac{|(\vec{P_1P_2},\vec s_1,\vec s_2)|}{|\vec s_1\times\vec s_2|}
`, "常用", ["空间解析几何", "距离", "叉乘", "混合积"], "空间几何选择填空、曲面积分前置建模。", "距离本质是把连接向量投影到法向或公垂线方向。", "点到面用代入；点到线用平行四边形面积除底；异面直线用混合积除底面积。", "面积公式 \\(|a\times b|\\) 和体积公式 \\(|(a,b,c)|\\) 直接推出。", "点 \\((1,2,3)\\) 到 \\(x+y+z=0\\) 距离为 \\(6/\sqrt3=2\sqrt3\\)。", "两直线平行时异面直线公式分母为零，要改用点到线距离。"),

  C("calc9-implicit-function-theorem-lite", "高等数学", "第9章 多元函数微分法及应用", "隐函数", "隐函数存在与求导条件", raw`
F(x,y)=0,\quad F_y(x_0,y_0)\ne0
\Rightarrow y=y(x)
\\
\frac{dy}{dx}=-\frac{F_x}{F_y}
\\
F(x,y,z)=0,\quad z=z(x,y):
\quad z_x=-\frac{F_x}{F_z},\ z_y=-\frac{F_y}{F_z}
`, "必背", ["隐函数", "偏导", "多元微分"], "隐函数求导、切平面、极值约束。", "隐函数求导就是把等式两边全微分，再解出目标微分。", "看到 \\(F=0\\) 且要求导，先确认对目标变量的偏导不为零。", "由全微分 \\(F_xdx+F_ydy=0\\) 或 \\(F_xdx+F_ydy+F_zdz=0\\) 得公式。", "\\(x^2+y^2=1\\) 中 \\(dy/dx=-x/y\\)。", "分母偏导为零时公式不能直接用，可能不存在单值隐函数。"),

  C("calc9-second-derivative-test-two-var", "高等数学", "第9章 多元函数微分法及应用", "多元极值", "二元极值判别式", raw`
f_x=f_y=0,\quad
A=f_{xx},\ B=f_{xy},\ C=f_{yy}
\\
\Delta=AC-B^2
\\
\Delta>0,A>0\Rightarrow \text{极小}
\\
\Delta>0,A<0\Rightarrow \text{极大},\quad
\Delta<0\Rightarrow \text{鞍点}
`, "必背", ["多元极值", "Hessian", "二阶判别"], "二元函数无条件极值。", "二阶项决定驻点附近像碗、倒碗还是马鞍。", "先求驻点，再算 Hessian 判别式。", "二阶 Taylor 展开中二次型正定给极小，负定给极大，不定给鞍点。", "\\(x^2+y^2\\) 在原点 \\(\\Delta=4>0,A=2>0\\)，极小。", "\\(\\Delta=0\\) 时判别失效，需要另行分析。"),

  C("calc10-polar-region-types", "高等数学", "第10章 重积分", "二重积分", "极坐标区域类型", raw`
D:\alpha\le\theta\le\beta,\quad r_1(\theta)\le r\le r_2(\theta)
\\
\iint_D f(x,y)d\sigma
=\int_{\alpha}^{\beta}\int_{r_1}^{r_2}
f(r\cos\theta,r\sin\theta)r\,dr\,d\theta
\\
x^2+y^2=r^2,\quad d\sigma=r\,dr\,d\theta
`, "必背", ["重积分", "极坐标", "换元", "区域"], "圆、扇形、环形区域重积分。", "极坐标把圆形边界变成常数或简单半径。", "看到 \\(x^2+y^2\\)、圆、扇形，优先考虑极坐标。", "Jacobi 行列式 \\(|\partial(x,y)/\partial(r,\theta)|=r\\)。", "单位圆面积 \\(\\int_0^{2\pi}\int_0^1 r\,dr\,d\theta=\pi\\)。", "最常漏掉的是面积微元中的 \\(r\\)。"),

  C("calc10-spherical-cylindrical", "高等数学", "第10章 重积分", "三重积分", "柱坐标与球坐标公式", raw`
\text{柱坐标: }x=r\cos\theta,\ y=r\sin\theta,\ z=z,\quad dV=r\,dr\,d\theta\,dz
\\
\text{球坐标: }x=\rho\sin\varphi\cos\theta,\ y=\rho\sin\varphi\sin\theta,\ z=\rho\cos\varphi
\\
dV=\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta
`, "必背", ["三重积分", "柱坐标", "球坐标", "Jacobi"], "球体、圆柱、圆锥区域的三重积分。", "柱坐标适合绕轴对称，球坐标适合球面对称。", "看到 \\(x^2+y^2\\) 用柱坐标；看到 \\(x^2+y^2+z^2\\) 用球坐标。", "由坐标变换 Jacobi 行列式得到体积微元。", "半径为 \\(a\\) 的球体体积为 \\(\int_{0}^{2\pi}\int_{0}^{\pi}\int_{0}^{a}\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta=4\pi a^3/3\\)。", "球坐标中 \\(\varphi\\) 通常是与正 \\(z\\) 轴夹角，不是平面极角。"),

  C("calc10-gaussian-double-integral", "高等数学", "第10章 重积分", "特殊积分", "二维 Gaussian 积分", raw`
\int_{-\infty}^{\infty}e^{-x^2}dx=\sqrt{\pi}
\\
\iint_{\mathbb R^2}e^{-(x^2+y^2)}dxdy=\pi
\\
\int_{-\infty}^{\infty}e^{-ax^2}dx=\sqrt{\frac{\pi}{a}}\quad(a>0)
`, "技巧", ["Gaussian", "重积分", "极坐标", "反常积分"], "正态分布、反常积分、极坐标技巧。", "一维高斯积分平方后变成二维圆对称积分。", "看到 \\(e^{-x^2}\\) 的全区间积分，想平方再极坐标。", "令 \\(I^2=\iint e^{-(x^2+y^2)}dxdy\\)，极坐标化为 \\(2\pi\int_0^\infty e^{-r^2}rdr\\)。", "\\(\\int_{-\infty}^{\infty}e^{-2x^2}dx=\\sqrt{\pi/2}\\)。", "半区间是全区间一半；带线性项先配方。"),

  C("calc11-line-integral-work-template", "高等数学", "第11章 曲线积分与曲面积分", "曲线积分", "第二型曲线积分做功模板", raw`
\int_L Pdx+Qdy+Rdz
\\
\vec r=\vec r(t),\ a\le t\le b
\\
\int_a^b
\left[P(\vec r(t))x'(t)+Q(\vec r(t))y'(t)+R(\vec r(t))z'(t)\right]dt
`, "必背", ["曲线积分", "第二型", "参数化", "做功"], "力场做功、环流、路径无关判断。", "第二型曲线积分就是向量场沿切向位移的累加。", "先参数化曲线，再把 \\(dx,dy,dz\\) 换成导数乘 \\(dt\\)。", "由 \\(d\vec r=(x',y',z')dt\\)，积分为 \\(\int \vec F\cdot d\vec r\\)。", "\\(P=y,Q=x\\) 沿 \\(y=x,0\le x\le1\\) 积分为 \\(\int_0^1(2t)dt=1\\)。", "第二型积分与方向有关，反向积分变号。"),

  C("calc11-surface-integral-template", "高等数学", "第11章 曲线积分与曲面积分", "曲面积分", "曲面积分参数化模板", raw`
\iint_\Sigma f\,dS
=\iint_D f(\vec r(u,v))|\vec r_u\times\vec r_v|\,dudv
\\
\iint_\Sigma \vec F\cdot \vec n\,dS
=\iint_D \vec F(\vec r(u,v))\cdot(\vec r_u\times\vec r_v)\,dudv
\\
z=z(x,y):\quad dS=\sqrt{1+z_x^2+z_y^2}\,dxdy
`, "必背", ["曲面积分", "参数化", "通量", "面积元"], "第一型曲面积分、通量积分。", "第一型乘面积伸缩，第二型还要看取向。", "能写参数化就用 \\(r_u\times r_v\\)；图形曲面可直接用 \\(dS\\)。", "参数小块面积由两个切向量叉乘长度给出。", "平面 \\(z=0\\) 上 \\(dS=dxdy\\)。", "通量积分符号取决于法向，换取向会变号。"),

  C("linear3-rref-rank-pivot", "线性代数", "第3章 初等变换与线性方程组", "阶梯形", "行最简形、主元与自由变量", raw`
r(A)=\text{非零行数}=\text{主元个数}
\\
n-r(A)=\text{自由变量个数}
\\
Ax=0\text{基础解系含 }n-r(A)\text{ 个向量}
`, "必背", ["线性方程组", "秩", "主元", "自由变量"], "解方程组、求基础解系、判断参数。", "主元变量被方程控制，自由变量负责生成全部解。", "先化行阶梯形，数主元，非主元设参数。", "行初等变换不改变方程组解集，因此阶梯形保留解结构。", "若 \\(A\\) 为 \\(3\times5\\) 且秩 3，齐次解空间维数为 2。", "非齐次方程组的自由变量个数仍看系数矩阵秩，不看增广矩阵秩。"),

  C("linear3-cramer-rule", "线性代数", "第3章 初等变换与线性方程组", "Cramer法则", "Cramer 法则", raw`
Ax=b,\quad |A|\ne0
\\
x_i=\frac{|A_i|}{|A|}
\\
A_i:\ A\text{第 }i\text{ 列替换为 }b
`, "常用", ["Cramer", "线性方程组", "行列式"], "小阶线性方程组、理论证明、选择填空。", "Cramer 法则用体积比例直接读出唯一解。", "二三阶且要求显式解时可用；大题计算通常高斯消元更稳。", "由伴随矩阵公式 \\(A^{-1}=\operatorname{adj}A/|A|\\) 推出。", "二元方程组中 \\(x=D_x/D,y=D_y/D\\)。", "必须 \\(|A|\ne0\\)；否则不能用 Cramer 直接判断无解或多解。"),

  C("linear4-rank-inequalities", "线性代数", "第4章 向量组线性相关性", "秩不等式", "矩阵秩常用不等式", raw`
r(A+B)\le r(A)+r(B)
\\
r(AB)\le \min\{r(A),r(B)\}
\\
r(A)+r(B)-n\le r(AB)\quad(A_{m\times n},B_{n\times s})
\\
r(A^TA)=r(A)
`, "必背", ["秩", "矩阵", "不等式", "Sylvester"], "证明秩关系、选择填空、方程组维数。", "秩表示像空间维数，乘法不会创造超过任一因子的维数。", "看到矩阵乘积秩、和的秩，优先套不等式夹住。", "由列空间包含关系和线性映射维数公式可证明。", "若 \\(A\\) 可逆，则 \\(r(AB)=r(B)\\)。", "Sylvester 不等式中间维数是相乘的公共维数 \\(n\\)。"),

  C("linear4-dimension-formula", "线性代数", "第4章 向量组线性相关性", "维数公式", "子空间和与交维数公式", raw`
\dim(U+V)=\dim U+\dim V-\dim(U\cap V)
\\
U+V=\{u+v:u\in U,\ v\in V\}
\\
U\oplus V\iff U\cap V=\{0\}
`, "常用", ["维数", "子空间", "线性空间", "直和"], "线性空间拓展题、秩与解空间关系。", "两个空间相加时，交集部分被数了两遍，需要减掉一次。", "遇到两个解空间、生成空间的维数关系时想到它。", "把 \\(U,V\\) 的基合并，重复的方向正对应交空间维数。", "平面中两条不同直线过原点，和空间维数 \\(1+1-0=2\\)。", "直和不仅要求维数相加，还要求交集只有零向量。"),

  C("linear5-eigenvalue-quick-properties", "线性代数", "第5章 相似矩阵及二次型", "特征值", "特征值速算性质", raw`
\sum_{i=1}^{n}\lambda_i=\operatorname{tr}(A)
\\
\prod_{i=1}^{n}\lambda_i=|A|
\\
A\text{可逆}\Rightarrow \lambda(A^{-1})=\frac1{\lambda(A)}
\\
\lambda(kA+bE)=k\lambda(A)+b
`, "必背", ["特征值", "迹", "行列式", "相似"], "选择填空、矩阵多项式、快速验算。", "特征值把矩阵很多整体信息压缩成数。", "先看迹和行列式验算特征值；矩阵多项式可直接作用到特征值。", "特征多项式最高次以下系数给迹，常数项给行列式。", "若 \\(A\\) 特征值为 1,2，则 \\(2A+3E\\) 特征值为 5,7。", "迹和行列式只能校验总和与乘积，不能唯一确定全部特征值。"),

  C("linear5-minimal-polynomial-lite", "线性代数", "第5章 相似矩阵及二次型", "矩阵多项式", "最小多项式识别版", raw`
m_A(A)=0,\quad m_A(x)\mid f_A(x)
\\
A\text{可对角化}\iff m_A(x)\text{无重根}
\\
f(A)=0\Rightarrow m_A(x)\mid f(x)
`, "了解", ["最小多项式", "对角化", "Cayley-Hamilton", "矩阵多项式"], "矩阵高次幂、对角化理论题。", "最小多项式是能把矩阵代进去变成零的最低阶压缩器。", "遇到 \\(A^2-3A+2E=0\\) 这类关系，可用它限制特征值和降幂。", "Cayley-Hamilton 保证特征多项式能令矩阵为零，最小多项式整除它。", "若 \\(A^2=E\\)，则最小多项式整除 \\((x-1)(x+1)\\)，通常可对角化。", "考研常规题不必深挖 Jordan；把它当降幂工具即可。"),

  C("linear6-linear-map-matrix", "线性代数", "第6章 线性空间与线性变换【拓展】", "线性变换", "线性变换矩阵表示", raw`
T(\alpha_j)=\sum_{i=1}^{n}a_{ij}\alpha_i
\\
[T(x)]_{\mathcal B}=A[x]_{\mathcal B}
\\
A_{\mathcal C}=P^{-1}A_{\mathcal B}P
`, "了解", ["线性变换", "矩阵表示", "基变换", "相似"], "理解相似矩阵、不同基下同一线性变换。", "矩阵是线性变换在某组基下的坐标记录。", "换基问题先写过渡矩阵，再用 \\(P^{-1}AP\\)。", "同一向量换坐标、同一变换换表示都会产生相似关系。", "旋转变换在标准正交基下矩阵为 \\(\\left(\\begin{array}{cc}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{array}\\right)\\)。", "相似不是随便左右乘；左右两边必须是互逆的换基矩阵。"),

  C("prob1-inclusion-exclusion-expanded", "概率论", "第1章 随机事件与概率", "事件运算", "容斥公式扩展", raw`
P(A\cup B)=P(A)+P(B)-P(AB)
\\
P(A\cup B\cup C)=P(A)+P(B)+P(C)
-P(AB)-P(AC)-P(BC)+P(ABC)
\\
P\left(\bigcup_{i=1}^{n}A_i\right)\le\sum_{i=1}^{n}P(A_i)
`, "必背", ["概率", "容斥", "事件运算"], "事件概率、至少一个发生、抽屉类计数。", "容斥是在修正重复计算的面积。", "看到“至少一个”“并事件”，先容斥；复杂时先画 Venn 图。", "两个事件相加时交集被算两次，减一次；三个事件再按奇加偶减。", "三人至少一人中奖概率可用总和减交集。", "互斥才可直接相加；独立不等于互斥。"),

  C("prob2-transform-distribution", "概率论", "第2章 随机变量及其分布", "变量变换", "一维随机变量函数分布", raw`
Y=g(X),\quad F_Y(y)=P(g(X)\le y)
\\
g\text{单调可导}:\quad
f_Y(y)=f_X(g^{-1}(y))\left|\frac{d}{dy}g^{-1}(y)\right|
\\
Y=aX+b:\quad f_Y(y)=\frac1{|a|}f_X\left(\frac{y-b}{a}\right)
`, "必背", ["随机变量", "分布函数", "密度变换"], "函数分布、正态标准化、指数变换。", "变量变换要保证概率质量守恒。", "先用分布函数法最稳；单调可导时再用密度公式提速。", "由 \\(P(y<Y<y+dy)=P(x<X<x+dx)\\) 得密度乘 Jacobi。", "若 \\(Y=2X+1\\)，则 \\(f_Y(y)=\\frac12f_X((y-1)/2)\\)。", "非单调函数要分段求和，不能直接套单调公式。"),

  C("prob3-min-max-distribution", "概率论", "第3章 多维随机变量", "次序统计", "最大值最小值分布（含密度公式版）", raw`
M_n=\max(X_1,\dots,X_n),\quad
F_{M_n}(x)=[F(x)]^n
\\
m_n=\min(X_1,\dots,X_n),\quad
F_{m_n}(x)=1-[1-F(x)]^n
\\
f_{M_n}(x)=n[F(x)]^{n-1}f(x)
`, "常用", ["最大值", "最小值", "独立同分布", "分布函数", "密度公式版"], "次序统计量、寿命模型（扩展版含密度 f，与第2章版互补）。", "最大值不超过 \\(x\\) 等价于每个样本都不超过 \\(x\\)；密度公式是CDF求导得到。", "需要求极值的密度函数时用此版；只需CDF见第2章版。", "由 \\(P(M_n\\le x)=\\prod P(X_i\\le x)\\) 得最大值公式；对 CDF 求导得密度。", "均匀 \\(U(0,1)\\) 最大值密度为 \\(nx^{n-1}\\)。", "公式默认独立同分布；非同分布时要写成各自分布函数乘积。"),

  C("prob3-conditional-density-expanded", "概率论", "第3章 多维随机变量", "条件分布", "条件分布与条件密度扩展", raw`
P(X=x_i\mid Y=y_j)=\frac{p_{ij}}{p_{\cdot j}}
\\
f_{X\mid Y}(x\mid y)=\frac{f_{X,Y}(x,y)}{f_Y(y)}
\\
E(X\mid Y=y)=\int_{-\infty}^{\infty}x f_{X\mid Y}(x\mid y)dx
`, "必背", ["条件分布", "联合密度", "条件期望"], "二维随机变量、全期望、Bayes 连续型。", "条件分布就是在给定切片上重新归一化。", "连续型先求边缘密度，再用联合除以边缘。", "由条件概率定义 \\(P(A|B)=P(AB)/P(B)\\) 推广到密度。", "若联合密度在三角形区域上，给定 \\(Y=y\\) 后只在对应横截面归一。", "要求 \\(f_Y(y)>0\\)；不要把条件密度当联合密度。"),

  C("prob4-covariance-correlation-properties", "概率论", "第4章 数字特征", "协方差", "协方差与相关系数性质", raw`
\operatorname{Cov}(X,Y)=E(XY)-EXEY
\\
D(X+Y)=DX+DY+2\operatorname{Cov}(X,Y)
\\
\rho_{XY}=\frac{\operatorname{Cov}(X,Y)}{\sqrt{DXDY}},\quad |\rho_{XY}|\le1
\\
X,Y\text{独立}\Rightarrow \operatorname{Cov}(X,Y)=0
`, "必背", ["协方差", "相关系数", "方差", "独立"], "数字特征、二维分布、正态相关。", "协方差衡量两个变量同向变化的线性趋势。", "算和的方差一定先问是否独立；不独立就要加协方差。", "展开 \\(E[(X-EX)(Y-EY)]\\) 得第一式，Cauchy 不等式给 \\(|\rho|\le1\\)。", "若独立，\\(D(X+Y)=DX+DY\\)。", "不相关不一定独立；但二维正态中不相关可推出独立。"),

  C("prob5-chebyshev-markov-expanded", "概率论", "第5章 大数定律与中心极限定理", "概率不等式", "Markov 与 Chebyshev 不等式扩展", raw`
X\ge0:\quad P(X\ge a)\le \frac{EX}{a}\quad(a>0)
\\
P(|X-EX|\ge\varepsilon)\le\frac{DX}{\varepsilon^2}
\\
P(|\bar X-\mu|\ge\varepsilon)\le\frac{\sigma^2}{n\varepsilon^2}
`, "必背", ["概率不等式", "Chebyshev", "Markov", "大数定律"], "估计尾概率、证明依概率收敛。", "只知道期望或方差时，用粗但稳的不等式控制尾部。", "看到“证明依概率收敛”且有方差，直接 Chebyshev。", "Markov 对非负变量积分尾部；Chebyshev 是对 \\((X-EX)^2\\) 用 Markov。", "若 \\(D\bar X=\sigma^2/n\\)，则样本均值偏离概率趋零。", "Chebyshev 给的是上界，通常不精确；要求精确概率时要用分布。"),

  C("prob5-clt-standardization", "概率论", "第5章 大数定律与中心极限定理", "中心极限定理", "CLT 标准化模板", raw`
\frac{\sum_{i=1}^{n}X_i-n\mu}{\sigma\sqrt n}\Rightarrow N(0,1)
\\
\frac{\bar X-\mu}{\sigma/\sqrt n}\Rightarrow N(0,1)
\\
P(a<\sum X_i<b)\approx
\Phi\left(\frac{b-n\mu}{\sigma\sqrt n}\right)-
\Phi\left(\frac{a-n\mu}{\sigma\sqrt n}\right)
`, "必背", ["中心极限定理", "标准化", "正态近似"], "大样本概率近似、二项分布近似。", "很多独立小随机量相加后，中心化再缩放会像正态。", "先找单个变量均值方差，再给和或均值标准化。", "独立同分布且方差有限时由 CLT 得弱收敛。", "二项 \\(B(n,p)\\) 可令 \\(\\mu=p,\\sigma^2=p(1-p)\\) 近似。", "离散分布用正态近似时常需连续性校正。"),

  C("prob6-normal-sampling-distribution-expanded", "概率论", "第6章 数理统计基本概念", "抽样分布", "正态总体抽样分布全表", raw`
\bar X\sim N\left(\mu,\frac{\sigma^2}{n}\right)
\\
\frac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)
\\
\frac{(n-1)S^2}{\sigma^2}\sim \chi^2(n-1)
\\
\frac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)
`, "必背", ["抽样分布", "正态总体", "t分布", "χ²"], "置信区间、假设检验的核心底座。", "正态总体下，样本均值管中心，样本方差管波动，二者还能独立。", "题目写正态总体时，先判断 \\(\\sigma\\) 已知还是未知，再选 \\(Z\\) 或 \\(t\\)。", "由正态样本正交分解可得到 \\(\chi^2\\) 和 \\(t\\) 统计量。", "\\(\\sigma\\) 未知检验均值用 \\(t=(\bar X-\mu_0)/(S/\sqrt n)\\)。", "这些精确分布依赖正态总体；非正态大样本通常只能近似。"),

  C("prob6-order-stat-density", "概率论", "第6章 数理统计基本概念", "次序统计量", "次序统计量密度公式", raw`
X_{(k)}:\quad
f_{(k)}(x)=\frac{n!}{(k-1)!(n-k)!}
[F(x)]^{k-1}[1-F(x)]^{n-k}f(x)
\\
F_{(n)}(x)=[F(x)]^n,\quad
F_{(1)}(x)=1-[1-F(x)]^n
`, "了解", ["次序统计量", "最大值", "最小值", "密度"], "样本最大最小、估计量分布。", "第 \\(k\\) 小落在 \\(x\\) 附近，左边要有 \\(k-1\\) 个，右边要有 \\(n-k\\) 个。", "最大最小优先用分布函数法；中间次序量再用密度公式。", "组合数选择左右样本，再乘对应概率和 \\(f(x)dx\\)。", "均匀 \\(0,1\\) 的最大值密度为 \\(nx^{n-1}\\)。", "公式默认连续型独立同分布。"),

  C("prob7-bias-mse-crlb", "概率论", "第7章 参数估计", "估计量评价", "偏差、均方误差与 Cramér-Rao 下界", raw`
\operatorname{Bias}(\hat\theta)=E\hat\theta-\theta
\\
\operatorname{MSE}(\hat\theta)=E(\hat\theta-\theta)^2
=D\hat\theta+\operatorname{Bias}^2(\hat\theta)
\\
D\hat\theta\ge \frac1{nI(\theta)}\quad(\text{无偏估计})
`, "了解", ["参数估计", "MSE", "无偏", "Cramér-Rao"], "估计量优劣比较、理论选择填空。", "MSE 同时惩罚波动和系统偏差。", "比较估计量时先算偏差，再算方差或 MSE。", "展开平方 \\((\hat\theta-\theta)=(\hat\theta-E\hat\theta)+(E\hat\theta-\theta)\\) 得分解。", "无偏估计时 MSE 就是方差。", "Cramér-Rao 下界有正则条件，考研通常会给可用背景。"),

  C("prob7-bayesian-estimation-lite", "概率论", "第7章 参数估计", "Bayes估计", "Bayes 估计基础模板", raw`
\pi(\theta\mid x)=\frac{L(\theta;x)\pi(\theta)}
{\int L(u;x)\pi(u)du}
\\
\hat\theta_B=E(\theta\mid X=x)\quad(\text{平方损失})
\\
\hat\theta_{\text{MAP}}=\arg\max_\theta \pi(\theta\mid x)
`, "拓展", ["Bayes估计", "后验分布", "参数估计"], "拓展理解、与 Bayes 公式贯通。", "先验乘似然再归一化，就是参数的后验分布。", "若题目出现先验分布、后验分布，按 Bayes 公式写。", "把离散 Bayes 公式中的事件概率替换为参数密度和似然。", "Beta 先验配 Bernoulli 样本会得到 Beta 后验。", "常规考研数学一参数估计以矩估计和 MLE 为主，Bayes 多作拓展。"),

  C("prob8-common-test-statistics", "概率论", "第8章 假设检验", "检验统计量", "常见单样本检验统计量表", raw`
\sigma\text{已知}:\quad Z=\frac{\bar X-\mu_0}{\sigma/\sqrt n}
\\
\sigma\text{未知且正态}:\quad T=\frac{\bar X-\mu_0}{S/\sqrt n}\sim t(n-1)
\\
\sigma^2\text{检验}:\quad
\chi^2=\frac{(n-1)S^2}{\sigma_0^2}\sim\chi^2(n-1)
`, "必背", ["假设检验", "Z检验", "t检验", "χ²检验"], "单正态总体均值、方差假设检验。", "统计量选择只看总体是否正态、方差是否已知、检验对象是谁。", "先写 \\(H_0\\)，再选统计量，最后根据单双侧查拒绝域。", "在原假设成立时，标准化后的统计量服从标准分布。", "\\(H_0:\mu=\mu_0\\)、\\(\\sigma\\) 未知时用 \\(t\\) 检验。", "不要把 \\(S^2\\) 和 \\(\sigma^2\\) 混用；统计量分母要按原假设值写。"),

  C("prob8-goodness-fit-chi-square", "概率论", "第8章 假设检验", "拟合优度", "χ² 拟合优度检验", raw`
\chi^2=\sum_{i=1}^{k}\frac{(O_i-E_i)^2}{E_i}
\\
\chi^2\sim\chi^2(k-1-m)
\\
E_i=np_i
`, "了解", ["假设检验", "拟合优度", "χ²", "频数"], "分类数据拟合检验、拓展题。", "观察频数和理论频数差得越远，统计量越大。", "看到多类别频数表和给定理论比例，可用拟合优度检验。", "大样本下 Pearson 统计量近似服从 \\(\chi^2\\) 分布。", "掷骰子 6 类且无估计参数，自由度为 5。", "期望频数太小近似会差；若估计了 \\(m\\) 个参数，自由度要减 \\(m\\)。"),

  C("calc1-equivalent-infinitesimal-expanded-table", "高等数学", "第1章 函数与极限", "等价无穷小", "等价无穷小扩展查表", raw`
x\to0:\quad
\sin ax\sim ax,\quad \tan ax\sim ax,\quad \arcsin ax\sim ax,\quad \arctan ax\sim ax
\\
1-\cos ax\sim \frac{a^2x^2}{2},\quad
\sec ax-1\sim \frac{a^2x^2}{2}
\\
e^{ax}-1\sim ax,\quad a^x-1\sim x\ln a,\quad
\ln(1+ax)\sim ax
\\
(1+ax)^{\alpha}-1\sim \alpha ax,\quad
\sqrt[n]{1+ax}-1\sim \frac{ax}{n}
`, "必背", ["极限", "等价无穷小", "基础公式", "小角近似"], "小角、指数对数、根式极限的快速查表。", "这一张把常见 \\(x\\) 换成 \\(ax\\)，避免考场临时漏系数。", "先确认括号内整体趋于 0，再把 \\(u=ax\\) 套基础等价。", "由基础等价在 \\(u\\to0\\) 下代入 \\(u=ax\\) 得到。", "\\(\\lim_{x\\to0}\\frac{1-\cos3x}{x^2}=9/2\\)。", "系数 \\(a\\) 的平方常在余弦类公式里漏掉。", "limit-slider"),

  C("calc1-equivalent-infinitesimal-difference-table", "高等数学", "第1章 函数与极限", "等价无穷小", "常见差值等价无穷小", raw`
e^x-1-x\sim\frac{x^2}{2},\quad
\ln(1+x)-x\sim-\frac{x^2}{2}
\\
x-\ln(1+x)\sim\frac{x^2}{2},\quad
\ln(1+x)-x+\frac{x^2}{2}\sim\frac{x^3}{3}
\\
\sqrt{1+x}-1-\frac{x}{2}\sim-\frac{x^2}{8}
\\
(1+x)^\alpha-1-\alpha x\sim\frac{\alpha(\alpha-1)}{2}x^2
`, "必背", ["极限", "高阶等价", "Taylor", "差值"], "加减抵消型极限，尤其等价替换不能直接做的题。", "差值等价就是“主项被减掉后，下一项接管”。", "看到 \\(e^x-1-x\\)、\\(\\ln(1+x)-x\\)、根式减线性项，直接查二阶主项。", "由 Maclaurin 展开保留到第一个非零余项得到。", "\\(\\lim_{x\to0}\\frac{x-\ln(1+x)}{x^2}=1/2\\)。", "加减题不要只用一阶等价，否则会把有效主项消成 0。", "taylor-plot"),

  C("calc1-trig-small-angle-error-orders", "高等数学", "第1章 函数与极限", "小角近似", "小角近似误差阶", raw`
\sin x=x+O(x^3),\quad
\tan x=x+O(x^3),\quad
\arcsin x=x+O(x^3)
\\
\cos x=1-\frac{x^2}{2}+O(x^4),\quad
1-\cos x=O(x^2)
\\
\frac{\sin x}{x}=1-\frac{x^2}{6}+O(x^4)
\\
\frac{\tan x}{x}=1+\frac{x^2}{3}+O(x^4)
`, "常用", ["极限", "小角近似", "误差阶", "三角"], "判断近似精度、物理小角近似、极限阶比较。", "小角近似不仅要知道像谁，还要知道误差有多小。", "题目问近似误差或阶数时，用 \\(O\\) 阶而不是只写 \\(\\sim\\)。", "由三角函数 Maclaurin 展开直接截断得到。", "\\(\\sin x/x-1\sim -x^2/6\\)。", "小角近似默认弧度制；角度制直接套会错。", "limit-slider"),

  C("calc1-maclaurin-series-master-table", "高等数学", "第1章 函数与极限", "Taylor公式", "Maclaurin 展开总表", raw`
e^x=\sum_{n=0}^{\infty}\frac{x^n}{n!}
\\
\sin x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n+1}}{(2n+1)!},\quad
\cos x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n}}{(2n)!}
\\
\ln(1+x)=\sum_{n=1}^{\infty}(-1)^{n-1}\frac{x^n}{n}\quad(|x|<1)
\\
(1+x)^\alpha=\sum_{n=0}^{\infty}\binom{\alpha}{n}x^n\quad(|x|<1)
`, "必背", ["Taylor", "Maclaurin", "极限", "幂级数"], "极限主项、幂级数、近似计算的核心表。", "Maclaurin 展开是把函数在 0 附近翻译成幂函数词典。", "极限题只取够用的前几项；幂级数题要额外写收敛区间。", "Taylor 公式在 \\(0\\) 点展开，系数为各阶导数除以阶乘。", "\\(e^{x^2}=1+x^2+x^4/2+\cdots\\)。", "展开变量可以是复合小量，如 \\(u=x^2\\)，但要注意阶数。", "taylor-plot"),

  C("calc1-inverse-trig-maclaurin-table", "高等数学", "第1章 函数与极限", "Taylor公式", "反三角函数展开表", raw`
\arctan x=x-\frac{x^3}{3}+\frac{x^5}{5}+O(x^7)
\\
\arcsin x=x+\frac{x^3}{6}+\frac{3x^5}{40}+O(x^7)
\\
\arccos x=\frac{\pi}{2}-x-\frac{x^3}{6}-\frac{3x^5}{40}+O(x^7)
\\
\frac1{\sqrt{1-x^2}}=1+\frac{x^2}{2}+\frac{3x^4}{8}+O(x^6)
`, "常用", ["Taylor", "反三角", "高阶等价", "极限"], "反三角加减抵消、高阶等价和积分反查。", "反三角展开常从导数展开再积分得到。", "看到 \\(\\arctan x-x\\)、\\(\\arcsin x-x\\) 直接用三阶项。", "由 \\((\\arctan x)'=1/(1+x^2)\\)、\\((\\arcsin x)'=1/\sqrt{1-x^2}\\) 展开后逐项积分。", "\\(\\arcsin x-\arctan x\sim x^3/2\\)。", "\\(\\arccos x\\) 在 0 附近有常数 \\(\\pi/2\\)，别当无穷小。", "taylor-plot"),

  C("calc1-common-composite-equivalents", "高等数学", "第1章 函数与极限", "复合等价", "常见复合小量等价模板", raw`
u(x)\to0:\quad \sin u\sim u,\quad \ln(1+u)\sim u,\quad e^u-1\sim u
\\
1-\cos u\sim\frac{u^2}{2},\quad
(1+u)^\alpha-1\sim \alpha u
\\
u\sim v\Rightarrow \sin u\sim\sin v,\quad
1-\cos u\sim1-\cos v\quad(u,v\to0)
`, "必背", ["极限", "复合函数", "等价无穷小", "主项"], "复杂括号内部不是单纯 \\(x\\) 的极限。", "复合等价的核心是先给里面的小量起名。", "先设 \\(u=g(x)\\)，证明 \\(u\to0\\)，再对 \\(u\\) 用表。", "等价无穷小对连续可展开函数的主项保持有效。", "\\(1-\cos(x^2)\sim x^4/2\\)。", "必须确认内层趋零；内层不趋零不能套小量表。", "limit-slider"),

  C("calc1-equivalent-replacement-danger-zones", "高等数学", "第1章 函数与极限", "等价替换", "等价替换禁区与安全区", raw`
f\sim g,\ h\sim k\Rightarrow fh\sim gk,\quad \frac{f}{h}\sim\frac{g}{k}
\\
f\sim g,\ h\sim k\not\Rightarrow f-h\sim g-k
\\
f-g=o(g)\quad\text{若 }f\sim g
\\
\frac{f-h}{u}\text{ 型先找 }f,h\text{ 的共同展开阶数}
`, "必背", ["极限", "等价替换", "易错点", "Taylor"], "防止等价无穷小最常见误用。", "乘除安全，加减危险；因为加减可能把主项抵消掉。", "看到加号减号，先判断主项会不会抵消；会抵消就改用 Taylor。", "乘除由商极限相乘得到，加减反例可取 \\(f=\sin x,g=x\\)。", "\\((\sin x-x)/x^3\\) 不能把 \\(\\sin x\\) 替成 \\(x\\)。", "等价替换不是代数恒等变形，不能不看结构就替换。", "taylor-plot"),

  C("pre-trig-induced-formulas-complete", "前置基础", "0. 前置基础", "诱导公式", "三角诱导公式完整表", raw`
\sin(\pi-x)=\sin x,\quad \cos(\pi-x)=-\cos x,\quad \tan(\pi-x)=-\tan x
\\
\sin(\pi+x)=-\sin x,\quad \cos(\pi+x)=-\cos x,\quad \tan(\pi+x)=\tan x
\\
\sin(2\pi-x)=-\sin x,\quad \cos(2\pi-x)=\cos x,\quad \tan(2\pi-x)=-\tan x
\\
\sin\left(\frac{\pi}{2}\pm x\right)=\cos x,\quad
\cos\left(\frac{\pi}{2}-x\right)=\sin x,\quad
\cos\left(\frac{\pi}{2}+x\right)=-\sin x
`, "必背", ["三角", "诱导公式", "象限", "基础公式"], "化简三角函数、统一角度、解三角方程。", "诱导公式就是把任意角拉回第一象限附近，再看符号。", "先定函数名是否互换，再定象限符号：奇变偶不变，符号看象限。", "由单位圆上对称点坐标直接得到。", "\\(\\cos(3\pi/2-x)=-\sin x\\)。", "口诀不能替代判断，尤其 \\(\\pi/2\\pm x\\) 会发生正余弦互换。", "unit-circle"),

  C("pre-trig-reciprocal-quotient-identities", "前置基础", "0. 前置基础", "基本关系", "倒数、商数与平方关系全表", raw`
\tan x=\frac{\sin x}{\cos x},\quad \cot x=\frac{\cos x}{\sin x}
\\
\sec x=\frac1{\cos x},\quad \csc x=\frac1{\sin x}
\\
1+\tan^2x=\sec^2x,\quad 1+\cot^2x=\csc^2x
\\
\tan x\cot x=1,\quad \sec^2x-\tan^2x=1,\quad \csc^2x-\cot^2x=1
`, "必背", ["三角", "基本关系", "sec", "csc"], "三角化简、积分、导数表的基础。", "所有三角函数都能由 \\(\\sin\\) 和 \\(\\cos\\) 拼出来。", "遇到 \\(\\sec,\csc,\tan,\cot\\) 混杂时，先统一成 \\(\\sin,\cos\\) 或套平方关系。", "由定义和 \\(\\sin^2x+\cos^2x=1\\) 两边除以 \\(\\cos^2x\\) 或 \\(\\sin^2x\\) 得到。", "\\(\\sec^2x-1=\tan^2x\\)。", "分母为 0 的点函数无定义，变形时不能忽略定义域。", "unit-circle"),

  C("pre-trig-double-triple-angle-complete", "前置基础", "0. 前置基础", "倍角公式", "二倍角、三倍角完整表", raw`
\sin2x=2\sin x\cos x
\\
\cos2x=\cos^2x-\sin^2x=1-2\sin^2x=2\cos^2x-1
\\
\tan2x=\frac{2\tan x}{1-\tan^2x}
\\
\sin3x=3\sin x-4\sin^3x,\quad
\cos3x=4\cos^3x-3\cos x
\\
\tan3x=\frac{3\tan x-\tan^3x}{1-3\tan^2x}
`, "必背", ["三角", "倍角", "三倍角", "降幂"], "三角化简、方程、积分降幂、特殊角计算。", "倍角公式负责把角度加倍，降幂公式负责把次数降下来。", "看到 \\(2x,3x\\) 或三次三角函数，先找倍角/三倍角。", "由和角公式令两角相等，三倍角由 \\(2x+x\\) 推出。", "\\(\\sin^3x=(3\sin x-\sin3x)/4\\)。", "\\(\\tan2x\\) 分母为零时公式不能用，但原角仍可能有意义。", "unit-circle"),

  C("pre-trig-power-reduction-expanded", "前置基础", "0. 前置基础", "降幂公式", "常用三角降幂与升幂公式", raw`
\sin^2x=\frac{1-\cos2x}{2},\quad
\cos^2x=\frac{1+\cos2x}{2}
\\
\sin^3x=\frac{3\sin x-\sin3x}{4},\quad
\cos^3x=\frac{3\cos x+\cos3x}{4}
\\
\sin^4x=\frac{3-4\cos2x+\cos4x}{8},\quad
\cos^4x=\frac{3+4\cos2x+\cos4x}{8}
\\
\sin^2x\cos^2x=\frac{1-\cos4x}{8}
`, "常用", ["三角", "降幂", "积分", "Fourier"], "高次三角积分、Fourier 系数、周期平均。", "降幂把难积分的高次幂变成低频余弦和常数。", "偶次幂积分先降幂，奇次幂积分先考虑凑微分。", "由二倍角和三倍角反解得到，四次公式由平方降幂再展开。", "\\(\\int_0^{2\pi}\sin^4x\,dx=3\pi/4\\)。", "四次公式符号容易错，\\(\\sin^4\\) 的 \\(\\cos2x\\) 项是负号。", "unit-circle"),

  C("pre-trig-product-to-sum-complete", "前置基础", "0. 前置基础", "积化和差", "积化和差完整表（应用版）", raw`
\sin A\sin B=\frac12[\cos(A-B)-\cos(A+B)]
\\
\cos A\cos B=\frac12[\cos(A-B)+\cos(A+B)]
\\
\sin A\cos B=\frac12[\sin(A+B)+\sin(A-B)]
\\
\cos A\sin B=\frac12[\sin(A+B)-\sin(A-B)]
`, "必背", ["三角", "积化和差", "积分", "Fourier", "应用版"], "三角乘积积分、Fourier 正交性、波形相乘（侧重积分应用场景）。", "两个波相乘会分解成和频与差频，积分更容易处理。", "不同频率三角函数相乘积分时优先用此表；与基础版的差别在于例子侧重不同频率场景。", "由和差角公式相加相减得到。", "\\(\\cos5x\\sin2x=[\\sin7x-\\sin3x]/2\\)，直接积分各项。", "\\(\\cos A\\sin B\\) 的第二项是减 \\(\\sin(A-B)\\)，别和 \\(\\sin A\\cos B\\) 混。", "unit-circle"),

  C("pre-trig-sum-to-product-complete", "前置基础", "0. 前置基础", "和差化积", "和差化积完整表（应用版）", raw`
\sin A+\sin B=2\sin\frac{A+B}{2}\cos\frac{A-B}{2}
\\
\sin A-\sin B=2\cos\frac{A+B}{2}\sin\frac{A-B}{2}
\\
\cos A+\cos B=2\cos\frac{A+B}{2}\cos\frac{A-B}{2}
\\
\cos A-\cos B=-2\sin\frac{A+B}{2}\sin\frac{A-B}{2}
`, "必背", ["三角", "和差化积", "零点", "化简", "应用版"], "三角方程求零点、化简与估计（侧重零点和方程求解）。", "和差化积把相加的波变成平均频率与差频的乘积，方便找零点。", "三角相加等于 0 时，化成乘积立刻看出零点；与基础版差别在于侧重方程和零点场景。", "令 \\(u=(A+B)/2,v=(A-B)/2\\)，用和角公式相加相减。", "\\(\\cos3x-\\cos x=-2\\sin2x\\sin x=0\\) 的解集可直接列出。", "\\(\\cos A-\\cos B\\) 前面有负号，是最常见漏点。", "unit-circle"),

  C("pre-trig-special-angle-master-table", "前置基础", "0. 前置基础", "特殊角", "常用特殊角完整表", raw`
\begin{array}{c|ccccc}
x&0&\frac{\pi}{6}&\frac{\pi}{4}&\frac{\pi}{3}&\frac{\pi}{2}\\
\hline
\sin x&0&\frac12&\frac{\sqrt2}{2}&\frac{\sqrt3}{2}&1\\
\cos x&1&\frac{\sqrt3}{2}&\frac{\sqrt2}{2}&\frac12&0\\
\tan x&0&\frac{\sqrt3}{3}&1&\sqrt3&\text{不存在}
\end{array}
\\
15^\circ=\frac{\pi}{12},\quad 75^\circ=\frac{5\pi}{12},\quad
18^\circ=\frac{\pi}{10},\quad36^\circ=\frac{\pi}{5}
`, "必背", ["三角", "特殊角", "基础公式", "速查"], "三角化简、选择填空、单位圆读值。", "特殊角是三角计算的乘法口诀表。", "先把角化到第一象限，再按象限补符号。", "30°、45°、60° 来自标准直角三角形和单位圆。", "\\(\\sin(7\pi/6)=-1/2\\)。", "\\(\\tan(\\pi/2)\\) 不存在，不要写成 0 或无穷当作普通数。", "unit-circle"),

  C("pre-trig-phase-shift-auxiliary-expanded", "前置基础", "0. 前置基础", "辅助角", "辅助角公式多种写法", raw`
a\sin x+b\cos x=R\sin(x+\varphi)
\\
R=\sqrt{a^2+b^2},\quad \cos\varphi=\frac{a}{R},\quad \sin\varphi=\frac{b}{R}
\\
a\sin x+b\cos x=R\cos(x-\theta)
\\
\cos\theta=\frac{b}{R},\quad \sin\theta=\frac{a}{R}
\\
\max(a\sin x+b\cos x)=R,\quad \min=-R
`, "必背", ["三角", "辅助角", "最值", "相位"], "三角最值、合振幅、方程求解。", "辅助角就是把同频正弦和余弦合成一个相位移动的波。", "求最值直接取振幅 \\(R\\)；求方程先合并成单个三角函数。", "展开 \\(R\sin(x+\varphi)\)，比较 \\(\\sin x,\\cos x\\) 系数。", "\\(3\sin x+4\cos x=5\sin(x+\varphi)\\)，最大值为 5。", "\\(\\varphi\\) 的象限由 \\(a,b\\) 共同决定，不能只看 \\(\\tan\varphi=b/a\\)。", "unit-circle"),

  C("pre-trig-inverse-relations-expanded", "前置基础", "0. 前置基础", "反三角函数", "反三角互化与主值关系", raw`
\arcsin x+\arccos x=\frac{\pi}{2}\quad(-1\le x\le1)
\\
\arctan x+\arctan\frac1x=
\begin{cases}
\frac{\pi}{2},&x>0\\
-\frac{\pi}{2},&x<0
\end{cases}
\\
\arctan x\pm\arctan y=
\arctan\frac{x\pm y}{1\mp xy}\quad(\text{需按象限修正})
\\
\sin(\arccos x)=\sqrt{1-x^2},\quad
\cos(\arcsin x)=\sqrt{1-x^2}
`, "常用", ["反三角", "主值", "三角", "化简"], "反三角化简、积分结果整理、方程求角。", "反三角函数最麻烦的不是公式，而是主值区间。", "先写出角所在区间，再判断根号正负和反正切象限修正。", "由 \\(\\sin,\cos,\tan\\) 的互逆关系和主值区间得到。", "\\(\\sin(\\arctan x)=x/\sqrt{1+x^2}\\)。", "反正切加法公式必须检查 \\(1-xy\\) 和象限，否则可能差 \\(\\pi\\)。", "unit-circle"),

  C("pre-hyperbolic-identity-expanded", "前置基础", "0. 前置基础", "双曲函数", "双曲函数恒等式扩展表", raw`
\sinh x=\frac{e^x-e^{-x}}{2},\quad \cosh x=\frac{e^x+e^{-x}}{2},\quad
\tanh x=\frac{\sinh x}{\cosh x}
\\
\cosh^2x-\sinh^2x=1,\quad 1-\tanh^2x=\operatorname{sech}^2x
\\
\sinh(x\pm y)=\sinh x\cosh y\pm\cosh x\sinh y
\\
\cosh(x\pm y)=\cosh x\cosh y\pm\sinh x\sinh y
\\
\sinh2x=2\sinh x\cosh x,\quad \cosh2x=\cosh^2x+\sinh^2x
`, "了解", ["双曲函数", "恒等式", "指数", "根式代换"], "根式积分、微分方程、指数函数结构理解。", "双曲函数像三角函数，但基本恒等式是差平方等于 1。", "看到 \\(x^2+a^2\\)、\\(x^2-a^2\\) 的根式，可把它作为拓展代换思路。", "由指数定义直接展开并合并同类项。", "\\(\\cosh^2x-\sinh^2x=1\\) 可消根号。", "双曲函数不是考研常规必用工具，大题优先使用教材通法。"),

  C("calc1-hyperbolic-small-equivalents", "高等数学", "第1章 函数与极限", "双曲函数", "双曲函数小量等价与展开", raw`
x\to0:\quad \sinh x\sim x,\quad \tanh x\sim x,\quad
\cosh x-1\sim\frac{x^2}{2}
\\
\sinh x=x+\frac{x^3}{6}+O(x^5)
\\
\cosh x=1+\frac{x^2}{2}+\frac{x^4}{24}+O(x^6)
\\
\tanh x=x-\frac{x^3}{3}+O(x^5)
`, "了解", ["双曲函数", "等价无穷小", "Taylor", "拓展"], "双曲函数极限和与三角函数类比理解。", "双曲函数的小量主项和三角很像，但三阶项符号可能不同。", "出现 \\(\\sinh,\cosh,\tanh\\) 的极限时可直接套表。", "由指数函数展开代入定义得到。", "\\((\\cosh x-1)/x^2\\to1/2\\)。", "注意 \\(\\tanh x-x\sim -x^3/3\\)，而 \\(\\tan x-x\sim x^3/3\\)。", "taylor-plot"),

  C("calc1-general-power-difference-equivalents", "高等数学", "第1章 函数与极限", "幂差等价", "幂函数差值通用等价", raw`
u,v\to0:\quad (1+u)^\alpha-(1+v)^\alpha\sim \alpha(u-v)
\\
a^u-a^v\sim (u-v)\ln a\quad(a>0,a\ne1)
\\
\ln(1+u)-\ln(1+v)\sim u-v
\\
\sqrt[n]{1+u}-\sqrt[n]{1+v}\sim \frac{u-v}{n}
`, "必背", ["极限", "等价无穷小", "幂函数", "差值"], "两个相似复合小量相减，尤其根式差、指数差、对数差。", "很多差值不是分别等价后相减，而是看外函数在 1 或 0 附近的导数。", "看到两个同型函数相减，先把它写成 \\(F(u)-F(v)\\)，用 \\(F'(0)(u-v)\\)。", "由一元函数 Taylor 公式 \\(F(u)-F(v)=F'(0)(u-v)+o(u-v)\\) 理解。", "\\((1+x^2)^3-(1+\sin x^2)^3\sim3(x^2-\sin x^2)\\)。", "需要 \\(u-v\\) 是第一非零主项；若 \\(u-v\\) 也抵消，要继续展开。", "taylor-plot"),

  C("calc1-root-rationalization-equivalents", "高等数学", "第1章 函数与极限", "根式主项", "根式有理化等价模板", raw`
\sqrt{a+u}-\sqrt{a+v}\sim \frac{u-v}{2\sqrt a}\quad(a>0,\ u,v\to0)
\\
\sqrt[m]{a+u}-\sqrt[m]{a+v}\sim
\frac{u-v}{m a^{(m-1)/m}}\quad(a>0)
\\
\sqrt{x^2+ax+b}-x\sim \frac{a}{2}\quad(x\to+\infty)
\\
\sqrt{x^2+a}-x\sim \frac{a}{2x}\quad(x\to+\infty)
`, "常用", ["极限", "根式", "有理化", "无穷远"], "根式差极限、有理化、无穷远主项。", "根式差本质是平方差，主项来自根函数导数。", "有限点根式差用导数模板；无穷远根式差先提出 \\(x\\) 或有理化。", "由 \\(\sqrt A-\sqrt B=(A-B)/(\sqrt A+\sqrt B)\\) 得第一式。", "\\(\\lim_{x\to\infty}x(\\sqrt{x^2+1}-x)=1/2\\)。", "无穷远时要注意 \\(x\to+\infty\\) 还是 \\(-\infty\\)，\\(\\sqrt{x^2}=|x|\\)。"),

  C("calc1-log-exp-limit-templates", "高等数学", "第1章 函数与极限", "指数对数极限", "指数对数极限模板", raw`
u\to0:\quad \ln(1+u)=u-\frac{u^2}{2}+O(u^3)
\\
e^u=1+u+\frac{u^2}{2}+O(u^3)
\\
[1+u(x)]^{v(x)}=\exp\{v(x)\ln[1+u(x)]\}
\\
u\to0,\ v\to\infty,\ vu\to L\Rightarrow [1+u]^v\to e^L
`, "必背", ["极限", "指数", "对数", "1的无穷型"], "指数型极限、幂指函数极限、复合极限。", "指数型极限的钥匙是取对数，把幂变乘法。", "遇到 \\(1^\infty\\)、\\(0^0\\)、\\(\\infty^0\\)，先取对数再还原。", "由 \\(\ln(1+u)\\sim u\\) 和指数函数连续性得到模板。", "\\((1+3x)^{2/x}\to e^6\\)。", "取对数要求底数为正；题中底数可能变号时要先说明邻域。", "limit-slider"),

  C("calc1-stirling-equivalent-basic", "高等数学", "第1章 函数与极限", "数列等价", "Stirling 公式基础版", raw`
n!\sim \sqrt{2\pi n}\left(\frac{n}{e}\right)^n
\\
\ln(n!)=n\ln n-n+O(\ln n)
\\
\frac{n!}{n^n}\sim \sqrt{2\pi n}e^{-n}
`, "拓展", ["数列极限", "Stirling", "等价", "阶乘"], "阶乘数列极限、概率组合估计、冷门提速。", "Stirling 把阶乘翻译成指数和幂函数，方便比较增长阶。", "看到阶乘和 \\(n^n,e^n\\) 混合比较时可识别。", "可由 Euler-Maclaurin 求和或 Laplace 方法推出，考研中多作为拓展工具。", "\\(\\sqrt[n]{n!}/n\to e^{-1}\\)。", "大题若没学过不建议直接引用，可用夹逼或 Stolz 替代。"),

  C("calc1-discrete-continuous-equivalent-sums", "高等数学", "第1章 函数与极限", "求和等价", "常用求和等价与积分估计", raw`
\sum_{k=1}^{n}k^p\sim\frac{n^{p+1}}{p+1}\quad(p>-1)
\\
\sum_{k=1}^{n}\frac1k\sim \ln n
\\
\sum_{k=1}^{n}\frac1{\sqrt k}\sim2\sqrt n
\\
\sum_{k=1}^{n}\ln k=\ln(n!)\sim n\ln n
`, "常用", ["数列极限", "求和", "等价", "积分估计"], "数列极限、Riemann 和、级数前置。", "离散求和常可以用面积近似，最高阶由积分给出。", "看到 \\(\\sum f(k)\\) 且只问主项，先用 \\(\int f(x)dx\\) 估阶。", "单调函数可用左右矩形面积夹住求和。", "\\(\\frac1{\sqrt n}\\sum_{k=1}^{n}1/\sqrt k\to2\\)。", "积分估计给主项，不给精确常数项；需要精确式时另用求和公式。"),

  C("pre-trig-general-solution-master", "前置基础", "0. 前置基础", "三角方程", "三角方程通解总表", raw`
\sin x=\sin\alpha\Rightarrow x=k\pi+(-1)^k\alpha
\\
\cos x=\cos\alpha\Rightarrow x=2k\pi\pm\alpha
\\
\tan x=\tan\alpha\Rightarrow x=k\pi+\alpha
\\
\sin x=0\Rightarrow x=k\pi,\quad
\cos x=0\Rightarrow x=\frac{\pi}{2}+k\pi
`, "必背", ["三角", "三角方程", "通解", "基础公式"], "三角方程、周期解、选择填空。", "三角方程不是只找一个角，而是找所有同值角。", "先求一个主值角，再按函数周期和对称性写通解。", "由单位圆上同一纵坐标、横坐标或斜率对应的角得到。", "\\(\\sin x=1/2\\Rightarrow x=k\pi+(-1)^k\\pi/6\\)。", "不要漏周期参数 \\(k\\in\\mathbb Z\\)，也不要把正弦和余弦通解混用。", "unit-circle"),

  C("pre-trig-orthogonality-integrals", "前置基础", "0. 前置基础", "三角正交", "三角函数正交积分公式", raw`
\int_{-\pi}^{\pi}\sin mx\sin nx\,dx=
\begin{cases}
0,&m\ne n\\
\pi,&m=n\ne0
\end{cases}
\\
\int_{-\pi}^{\pi}\cos mx\cos nx\,dx=
\begin{cases}
0,&m\ne n\\
2\pi,&m=n=0\\
\pi,&m=n\ne0
\end{cases}
\\
\int_{-\pi}^{\pi}\sin mx\cos nx\,dx=0
`, "常用", ["三角", "正交", "Fourier", "积分"], "Fourier 级数、三角积分、正交性理解。", "不同频率的正弦余弦在完整周期上互相抵消。", "看到完整对称周期上的三角乘积积分，先用正交性秒算。", "由积化和差把乘积变成整周期正弦/余弦积分得到。", "\\(\\int_{-\pi}^{\pi}\cos3x\cos5x\,dx=0\\)。", "区间必须是完整周期或等价周期区间；非完整区间不能直接套。", "unit-circle"),

  C("pre-trig-period-parity-shift-table", "前置基础", "0. 前置基础", "周期奇偶", "三角周期、奇偶与平移", raw`
\sin(-x)=-\sin x,\quad \cos(-x)=\cos x,\quad \tan(-x)=-\tan x
\\
\sin(x+2k\pi)=\sin x,\quad \cos(x+2k\pi)=\cos x
\\
\tan(x+k\pi)=\tan x,\quad \cot(x+k\pi)=\cot x
\\
|\sin x|,\ |\cos x|\text{ 的周期为 }\pi,\quad
\sin^2x,\cos^2x\text{ 的周期为 }\pi
`, "必背", ["三角", "周期", "奇偶", "基础公式"], "化简、定积分对称、三角方程。", "周期负责把角搬回熟悉区间，奇偶负责判断符号和积分抵消。", "定积分前先看区间是否对称或长度为周期整数倍。", "由单位圆坐标随角旋转重复和关于坐标轴对称得到。", "\\(\\int_{-\pi}^{\pi}\sin^3x\,dx=0\\)。", "函数组合后的周期可能变短，例如平方和绝对值。", "unit-circle"),

  C("pre-trig-amplitude-frequency-period", "前置基础", "0. 前置基础", "三角图像", "振幅、频率、相位与周期", raw`
y=A\sin(\omega x+\varphi)+b
\\
\text{振幅}=|A|,\quad \text{周期}=\frac{2\pi}{|\omega|}
\\
\text{相位平移}=-\frac{\varphi}{\omega}
\\
y=A\tan(\omega x+\varphi)+b:\quad T=\frac{\pi}{|\omega|}
`, "常用", ["三角", "图像", "周期", "相位"], "三角函数图像、最值、建模题。", "三角图像由竖直缩放、水平压缩和平移组成。", "看到 \\(\\sin(\\omega x+\varphi)\\) 先读周期和相位。", "令 \\(\omega x+\varphi\\) 增加一个基本周期即可求 \\(x\\) 的周期。", "\\(y=2\sin(3x-\pi)\\) 周期为 \\(2\pi/3\\)。", "相位平移要除以 \\(\\omega\\)，不能只看 \\(\\varphi\\)。", "unit-circle"),

  C("pre-trig-universal-substitution-expanded", "前置基础", "0. 前置基础", "万能代换", "万能代换扩展公式", raw`
t=\tan\frac{x}{2}
\\
\sin x=\frac{2t}{1+t^2},\quad
\cos x=\frac{1-t^2}{1+t^2},\quad
\tan x=\frac{2t}{1-t^2}
\\
dx=\frac{2}{1+t^2}dt
\\
\tan\frac{x}{2}=\frac{\sin x}{1+\cos x}=\frac{1-\cos x}{\sin x}
`, "技巧", ["三角", "万能代换", "积分", "有理化"], "三角有理式积分、半角化简。", "万能代换把单位圆参数化成一条有理曲线。", "三角有理式用普通恒等式很乱时再上万能代换。", "由半角公式和 \\(\tan(x/2)=t\\) 推出。", "\\(\\int dx/(1+\sin x)\\) 可化为 \\(\\int 2dt/(t+1)^2\\)。", "万能代换常让式子变长；选择填空优先找更短恒等变形。"),

  C("pre-trig-linear-combination-zero-method", "前置基础", "0. 前置基础", "辅助角", "三角线性组合方程模板", raw`
a\sin x+b\cos x=c
\\
R=\sqrt{a^2+b^2},\quad a\sin x+b\cos x=R\sin(x+\varphi)
\\
\text{有解}\iff |c|\le R
\\
\sin(x+\varphi)=\frac{c}{R}
`, "常用", ["三角", "辅助角", "三角方程", "最值"], "三角方程、最值范围、参数讨论。", "线性组合方程先合成单个正弦，范围立刻清楚。", "先算振幅 \\(R\\)，判断 \\(|c|\le R\\)，再写通解。", "由辅助角公式把左边化成 \\(R\\sin(x+\varphi)\\)。", "\\(3\sin x+4\cos x=6\\) 无解，因为最大值为 5。", "只写 \\(\tan\varphi=b/a\\) 不够，要确定 \\(\\varphi\\) 象限。", "unit-circle"),

  C("pre-trig-area-identities", "前置基础", "0. 前置基础", "几何三角", "三角形面积与正弦余弦定理", raw`
S_{\triangle ABC}=\frac12bc\sin A
\\
a^2=b^2+c^2-2bc\cos A
\\
\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}=2R
\\
r=\frac{S}{s},\quad s=\frac{a+b+c}{2}
`, "常用", ["三角", "几何", "正弦定理", "余弦定理"], "解析几何、向量夹角、空间几何前置。", "三角函数把边长和角度互相翻译。", "遇到边角混合，先看是两边夹角用余弦，还是面积用正弦。", "面积公式来自底乘高，余弦定理由向量点积推出。", "两向量夹角也满足 \\(a\cdot b=|a||b|\cos\theta\\)。", "几何公式里的角必须对应正确的对边和夹边。"),

  C("pre-trig-complex-euler-identities", "前置基础", "0. 前置基础", "Euler公式", "Euler 公式与三角恒等式", raw`
e^{ix}=\cos x+i\sin x
\\
\cos x=\frac{e^{ix}+e^{-ix}}{2},\quad
\sin x=\frac{e^{ix}-e^{-ix}}{2i}
\\
e^{i(x+y)}=e^{ix}e^{iy}
\\
(\cos x+i\sin x)^n=\cos nx+i\sin nx
`, "了解", ["三角", "Euler公式", "复数", "De Moivre"], "理解和差角、倍角、Fourier 与复数表示。", "Euler 公式把三角函数变成指数函数的影子。", "推导公式或处理复指数形式 Fourier 时用。", "由复指数 Taylor 展开分离实部虚部得到。", "取实部可得 \\(\\cos(x+y)\\) 公式。", "基础计算不必强行用复数，但它能统一解释很多三角公式。"),

  C("calc1-first-nonzero-derivative-equivalent", "高等数学", "第1章 函数与极限", "Taylor主项", "首个非零导数主项公式", raw`
f(a)=f'(a)=\cdots=f^{(m-1)}(a)=0,\quad f^{(m)}(a)\ne0
\\
f(x)\sim \frac{f^{(m)}(a)}{m!}(x-a)^m\quad(x\to a)
\\
f(x)-f(a)\sim f'(a)(x-a)\quad(f'(a)\ne0)
`, "必背", ["极限", "Taylor", "主项", "等价无穷小"], "所有复杂局部等价的总原则。", "函数在一点附近像它第一项不为零的 Taylor 项。", "找等价时先看函数值，再看一阶、二阶导，直到首个不为零。", "Taylor 公式带 Peano 余项直接给出。", "\\(1-\cos x\\) 在 0 处首个非零导数是二阶，所以 \\(1-\cos x\sim x^2/2\\)。", "若首个非零项阶数没找对，极限会差一个数量级。", "taylor-plot"),

  C("calc1-log-ratio-equivalents", "高等数学", "第1章 函数与极限", "对数等价", "对数比值与反双边等价", raw`
\ln(1+x)\sim x,\quad \ln(1-x)\sim -x
\\
\ln\frac{1+x}{1-x}\sim 2x
\\
\frac{1+x}{1-x}-1\sim2x
\\
\ln(1+x)-\ln(1-x)=2x+\frac{2x^3}{3}+O(x^5)
`, "常用", ["极限", "对数", "等价无穷小", "Taylor"], "含对称分式、反双曲正切、概率 logit 结构。", "对称的 \\(1+x\\) 与 \\(1-x\\) 常把一阶项加倍。", "看到 \\(\\ln\\frac{1+x}{1-x}\\) 不要拆很久，直接记主项 \\(2x\\)。", "由 \\(\ln(1+x)\\) 与 \\(\ln(1-x)\\) 展开相减得到。", "\\(\\lim_{x\to0}\\ln\\frac{1+2x}{1-2x}/x=4\\)。", "要求 \\(|x|<1\\) 且分母不为 0；复合时先确认内部趋零。", "taylor-plot"),

  C("calc1-endpoint-inverse-trig-equivalents", "高等数学", "第1章 函数与极限", "端点等价", "反三角端点等价", raw`
x\to0^+:\quad \arccos(1-x)\sim\sqrt{2x}
\\
\frac{\pi}{2}-\arcsin(1-x)\sim\sqrt{2x}
\\
x\to0^+:\quad \arcsin(-1+x)+\frac{\pi}{2}\sim\sqrt{2x}
\\
\tan\left(\frac{\pi}{2}-x\right)\sim\frac1x,\quad
\cot x\sim\frac1x
`, "技巧", ["极限", "反三角", "端点", "等价无穷小"], "反三角在端点附近、竖直渐近线附近的极限。", "靠近反三角端点时不是线性小量，而是平方根小量。", "看到 \\(\\arccos(1-x)\\)、\\(\\arcsin(1-x)\\) 这种端点形式，直接转平方根。", "令 \\(y=\arccos(1-x)\\)，则 \\(1-\cos y=x\sim y^2/2\\)。", "\\(\\lim_{x\to0^+}\\arccos(1-3x)/\\sqrt{x}=\\sqrt6\\)。", "端点等价通常是单侧极限，要确认 \\(x>0\\)。", "unit-circle"),

  C("pre-trig-quadrant-reference-angle-table", "前置基础", "0. 前置基础", "象限符号", "象限符号与参考角表", raw`
\begin{array}{c|cccc}
\text{象限}&I&II&III&IV\\
\hline
\sin&+&+&-&-\\
\cos&+&-&-&+\\
\tan&+&-&+&-
\end{array}
\\
\theta_{\text{ref}}=
\begin{cases}
\theta,&I\\
\pi-\theta,&II\\
\theta-\pi,&III\\
2\pi-\theta,&IV
\end{cases}
`, "必背", ["三角", "象限", "参考角", "诱导公式"], "特殊角求值、诱导公式、三角方程。", "参考角负责大小，象限负责正负号。", "先把角化到 \\([0,2\pi)\\)，再找参考角和符号。", "由单位圆坐标的横纵坐标符号得到。", "\\(\\sin(7\pi/6)=-\\sin(\pi/6)=-1/2\\)。", "不要只背口诀不判断象限，尤其角不是标准形式时。", "unit-circle"),

  C("pre-trig-finite-sum-formulas", "前置基础", "0. 前置基础", "三角求和", "有限三角求和公式", raw`
\sum_{k=1}^{n}\sin kx=
\frac{\sin\frac{nx}{2}\sin\frac{(n+1)x}{2}}{\sin\frac{x}{2}}
\\
\sum_{k=1}^{n}\cos kx=
\frac{\sin\frac{nx}{2}\cos\frac{(n+1)x}{2}}{\sin\frac{x}{2}}
\\
\sum_{k=0}^{n-1}e^{ikx}=
\frac{1-e^{inx}}{1-e^{ix}}
`, "技巧", ["三角", "求和", "Fourier", "等比数列"], "三角级数、周期信号、选择填空提速。", "三角求和本质是复指数等比数列取实部虚部。", "看到 \\(\\sum\sin kx\\)、\\(\\sum\cos kx\\)，先用复指数等比或直接套公式。", "由 \\(e^{ikx}\\) 等比求和，再取虚部/实部得到。", "\\(\\sum_{k=1}^{n}\cos kx\\) 当 \\(x\\notin2\pi\mathbb Z\\) 可直接套表。", "分母 \\(\\sin(x/2)=0\\) 时要单独处理，此时每项可能相同。"),

  C("pre-trig-chebyshev-n-angle", "前置基础", "0. 前置基础", "n倍角", "Chebyshev 与 n 倍角递推", raw`
\cos nx=T_n(\cos x)
\\
T_0(t)=1,\quad T_1(t)=t,\quad T_{n+1}(t)=2tT_n(t)-T_{n-1}(t)
\\
\cos2x=2\cos^2x-1,\quad
\cos3x=4\cos^3x-3\cos x
\\
\sin nx=\sin x\,U_{n-1}(\cos x)
`, "了解", ["三角", "n倍角", "Chebyshev", "递推"], "高次倍角、三角多项式、冷门选择填空。", "Chebyshev 多项式把 \\(n\\) 倍角变成 \\(\\cos x\\) 的多项式。", "遇到 \\(\\cos nx\\) 想写成 \\(\\cos x\\) 多项式时用递推。", "由 \\(\cos((n+1)x)+\cos((n-1)x)=2\cos x\cos nx\\) 得递推。", "\\(\\cos3x=4c^3-3c\\)，其中 \\(c=\cos x\\)。", "这是拓展工具，常规三角题二倍角三倍角已足够。", "unit-circle"),

  C("pre-trig-rationalization-identities", "前置基础", "0. 前置基础", "三角有理化", "三角有理化常用恒等式", raw`
(1-\sin x)(1+\sin x)=\cos^2x
\\
(1-\cos x)(1+\cos x)=\sin^2x
\\
(\sec x+\tan x)(\sec x-\tan x)=1
\\
(\csc x+\cot x)(\csc x-\cot x)=1
\\
\frac{1-\cos x}{\sin x}=\frac{\sin x}{1+\cos x}=\tan\frac{x}{2}
`, "必背", ["三角", "有理化", "半角", "积分"], "三角分式化简、积分、极限有理化。", "三角有理化和根式有理化一样，是利用平方差消掉麻烦项。", "看到 \\(1\pm\sin x\\)、\\(1\pm\cos x\\)、\\(\\sec x\pm\tan x\\) 先想配对相乘。", "由平方关系和半角公式直接推出。", "\\(1/(\\sec x+\tan x)=\\sec x-\tan x\\)。", "乘共轭时要保证不在原式无定义点操作。"),

  C("pre-inverse-trig-domain-range-table", "前置基础", "0. 前置基础", "反三角函数", "反三角函数定义域值域表", raw`
\arcsin x:\ [-1,1]\to\left[-\frac{\pi}{2},\frac{\pi}{2}\right]
\\
\arccos x:\ [-1,1]\to[0,\pi]
\\
\arctan x:\ \mathbb R\to\left(-\frac{\pi}{2},\frac{\pi}{2}\right)
\\
\operatorname{arccot} x:\ \mathbb R\to(0,\pi)\quad(\text{常用约定})
`, "必背", ["反三角", "定义域", "值域", "主值"], "反三角化简、方程、积分结果判断。", "反三角函数是多值三角关系的人为单值化，所以主值区间最重要。", "反三角套三角函数前先判断结果角落在哪个区间。", "限制三角函数在单调区间上取反函数得到。", "\\(\\arcsin(\\sin 5\pi/6)=\\pi/6\\)，不是 \\(5\pi/6\\)。", "不同教材对 \\(\\arccot\\) 值域约定可能不同，做题按题目或教材约定。", "unit-circle"),

  C("calc1-trig-ratio-refined-equivalents", "高等数学", "第1章 函数与极限", "三角比值", "三角比值精细等价", raw`
1-\frac{\sin x}{x}\sim\frac{x^2}{6}
\\
\frac{x}{\sin x}-1\sim\frac{x^2}{6}
\\
\frac{\tan x}{x}-1\sim\frac{x^2}{3}
\\
x\cot x-1\sim-\frac{x^2}{3}
\\
\sec x-1\sim\frac{x^2}{2}
`, "常用", ["极限", "三角", "高阶等价", "比值"], "三角比值减 1、加减抵消型极限。", "当基本极限只告诉你趋于 1 时，这张表告诉你离 1 有多远。", "看到 \\(\\sin x/x-1\\)、\\(x/\sin x-1\\)、\\(\\tan x/x-1\\) 直接查二阶项。", "由 \\(\sin x\\)、\\(\\tan x\\)、\\(\\cos x\\) 的 Taylor 展开除法得到。", "\\(\\lim_{x\to0}(x/\sin x-1)/x^2=1/6\\)。", "符号要小心：\\(x\cot x-1\\) 是负的二阶主项。", "limit-slider"),

  C("calc1-infinity-root-difference-templates", "高等数学", "第1章 函数与极限", "无穷远等价", "无穷远根式差模板", raw`
x\to+\infty:\quad
\sqrt{x^2+ax+b}=x+\frac{a}{2}+O\left(\frac1x\right)
\\
\sqrt{x^2+a}-\sqrt{x^2+b}\sim\frac{a-b}{2x}
\\
\sqrt{x^2+ax+b}-x\sim\frac{a}{2}
\\
\sqrt[n]{x^n+a}-x\sim\frac{a}{n x^{n-1}}\quad(x\to+\infty)
`, "常用", ["极限", "无穷远", "根式", "有理化"], "无穷远根式差、分母有理化题。", "无穷远根式差不是看谁最大，而是看最大项抵消后的下一项。", "先提 \\(x\\)，或用共轭有理化，再找下一阶。", "由二项展开 \\((1+u)^\alpha=1+\alpha u+\cdots\\) 得到。", "\\(x(\\sqrt{x^2+3}-\\sqrt{x^2+1})\to1\\)。", "若 \\(x\to-\infty\\)，\\(\\sqrt{x^2}=|x|=-x\\)，公式要改。"),

  C("calc1-infinity-log-power-differences", "高等数学", "第1章 函数与极限", "无穷远等价", "无穷远对数幂差等价", raw`
x\to\infty:\quad
\ln(x+a)-\ln x\sim\frac{a}{x}
\\
\ln(x+a)-\ln(x+b)\sim\frac{a-b}{x}
\\
(x+a)^\alpha-x^\alpha\sim \alpha a x^{\alpha-1}
\\
\frac{(x+a)^\alpha}{x^\alpha}=1+\frac{\alpha a}{x}+O\left(\frac1{x^2}\right)
`, "常用", ["极限", "无穷远", "对数", "幂函数"], "无穷远差值、增长阶比较、数列极限。", "无穷远差值常把变量倒过来变成 0 附近展开。", "先提出 \\(x\\)，把 \\(x+a=x(1+a/x)\\)，再对 \\(a/x\\) 展开。", "由 \\(\ln(1+u)\\) 和 \\((1+u)^\alpha\\) 在 \\(u=0\\) 的展开得到。", "\\(x[\\ln(x+2)-\\ln(x-1)]\to3\\)。", "只写 \\(\\ln(x+a)\sim\ln x\\) 不够处理差值，差值要用下一阶。"),

  C("calc1-exponential-small-parameter-templates", "高等数学", "第1章 函数与极限", "指数小量", "指数小参数等价模板", raw`
a_n\to0,\ b_n\to\infty:\quad
(1+a_n)^{b_n}=\exp\left(b_n a_n-\frac{b_n a_n^2}{2}+O(b_n a_n^3)\right)
\\
b_n a_n\to L\Rightarrow (1+a_n)^{b_n}\to e^L
\\
e^{u_n}-e^{v_n}\sim u_n-v_n\quad(u_n,v_n\to0)
\\
a^{u_n}-a^{v_n}\sim (u_n-v_n)\ln a
`, "技巧", ["极限", "指数", "1的无穷型", "等价"], "精细指数极限、数列极限、幂指函数极限。", "指数题的第二阶常常藏在对数展开里。", "若只求极限，看 \\(b_na_n\\)；若一阶抵消，再看 \\(b_na_n^2\\)。", "取对数后用 \\(\ln(1+a)=a-a^2/2+\cdots\\)。", "\\((1+1/n)^n\to e\\)，而 \\((1+1/n)^n/e\\) 的偏差要看二阶。", "底数必须最终为正；高阶模板不要在条件不足时硬套。", "limit-slider"),

  C("calc1-trig-composite-difference-equivalents", "高等数学", "第1章 函数与极限", "三角差值", "三角复合差值等价", raw`
u,v\to0:\quad \sin u-\sin v\sim u-v
\\
\tan u-\tan v\sim u-v
\\
\cos u-\cos v\sim -\frac{u^2-v^2}{2}
\\
\arcsin u-\arcsin v\sim u-v,\quad
\arctan u-\arctan v\sim u-v
`, "必背", ["极限", "三角", "复合小量", "差值"], "两个三角复合小量相减的极限。", "正弦、正切在 0 附近斜率为 1；余弦在 0 附近一阶斜率为 0，要看平方差。", "看到 \\(\\sin f-\sin g\\) 先转 \\(f-g\\)，看到 \\(\\cos f-\cos g\\) 看 \\(g^2-f^2\\)。", "由和差化积或 Taylor 展开得到。", "\\(\\cos x-\cos2x\sim3x^2/2\\)。", "余弦差别误写成 \\(u-v\\)，它是一阶消失的二阶小量。", "taylor-plot"),

  C("calc1-sec-csc-cot-equivalents", "高等数学", "第1章 函数与极限", "三角等价", "sec、csc、cot 小量等价", raw`
x\to0:\quad \sec x-1\sim\frac{x^2}{2}
\\
\csc x-\frac1x\sim\frac{x}{6}
\\
\cot x-\frac1x\sim-\frac{x}{3}
\\
\frac1{\sin x}-\frac1x\sim\frac{x}{6},\quad
\frac1{\tan x}-\frac1x\sim-\frac{x}{3}
`, "常用", ["极限", "三角", "倒数", "高阶等价"], "含倒数三角函数的加减抵消极限。", "取倒数会把一阶小量放大，所以要格外注意主项。", "看到 \\(\\csc x-1/x\\)、\\(\\cot x-1/x\\) 直接用表。", "由 \\(\sin x=x-x^3/6+\cdots\\)、\\(\\tan x=x+x^3/3+\cdots\\) 作倒数展开。", "\\(\\lim_{x\to0}(\\cot x-1/x)/x=-1/3\\)。", "这些式子有奇点，讨论的是去掉主奇异项后的剩余主项。", "limit-slider"),

  C("pre-trig-cofunction-identities-expanded", "前置基础", "0. 前置基础", "余函数关系", "余函数与互余角公式", raw`
\sin\left(\frac{\pi}{2}-x\right)=\cos x,\quad
\cos\left(\frac{\pi}{2}-x\right)=\sin x
\\
\tan\left(\frac{\pi}{2}-x\right)=\cot x,\quad
\cot\left(\frac{\pi}{2}-x\right)=\tan x
\\
\sec\left(\frac{\pi}{2}-x\right)=\csc x,\quad
\csc\left(\frac{\pi}{2}-x\right)=\sec x
`, "必背", ["三角", "余函数", "诱导公式", "互余角"], "诱导公式、反三角化简、积分换元。", "互余角会让正弦和余弦、正切和余切互换。", "角里出现 \\(\\pi/2-x\\) 时先用余函数公式化简。", "由单位圆中互余角的直角三角形关系得到。", "\\(\\sec(\\pi/2-x)=\\csc x\\)。", "若是 \\(\\pi/2+x\\)，除了互换还要看象限符号。", "unit-circle"),

  C("pre-trig-period-integral-average", "前置基础", "0. 前置基础", "周期平均", "三角周期平均值公式", raw`
\frac1{2\pi}\int_0^{2\pi}\sin^2x\,dx=\frac12,\quad
\frac1{2\pi}\int_0^{2\pi}\cos^2x\,dx=\frac12
\\
\frac1{2\pi}\int_0^{2\pi}\sin x\,dx=0,\quad
\frac1{2\pi}\int_0^{2\pi}\cos x\,dx=0
\\
\frac1{2\pi}\int_0^{2\pi}\sin^{2m+1}x\,dx=0,\quad
\int_0^{2\pi}\sin^2x\cos^2x\,dx=\frac{\pi}{4}
`, "常用", ["三角", "周期平均", "积分", "定积分"], "三角定积分、物理平均功率、Fourier 前置。", "完整周期上的奇振荡平均为 0，平方平均为一半。", "看到完整周期积分，优先用周期平均和奇偶抵消。", "由降幂公式和周期积分得到。", "\\(\\int_0^{2\pi}(3+2\sin x+\cos^2x)dx=7\pi\\)。", "区间长度不是完整周期时不能直接套平均值。", "unit-circle"),

  C("pre-trig-tangent-half-angle-geometry", "前置基础", "0. 前置基础", "切半角", "切半角与弦切关系", raw`
\tan\frac{x}{2}=\frac{\sin x}{1+\cos x}=\frac{1-\cos x}{\sin x}
\\
\sin x=\frac{2\tan(x/2)}{1+\tan^2(x/2)}
\\
1-\cos x=2\sin^2\frac{x}{2},\quad
1+\cos x=2\cos^2\frac{x}{2}
\\
\frac{\sin x}{x}\to1,\quad \frac{2\sin(x/2)}{x}\to1
`, "必背", ["三角", "切半角", "半角", "极限"], "三角极限、有理化、万能代换。", "半角公式把弦长、角度和切线斜率连在一起。", "看到 \\(1-\cos x\\) 或 \\(1+\cos x\\) 的分式，优先半角化。", "由二倍角反解和 \\(\\sin x=2\sin(x/2)\cos(x/2)\\) 得到。", "\\((1-\cos x)/\\sin x=\\tan(x/2)\\sim x/2\\)。", "切半角在 \\(x=\pi+2k\pi\\) 附近会发散，注意定义域。", "unit-circle"),

  C("pre-trig-cyclic-angle-transform", "前置基础", "0. 前置基础", "角度统一", "三角角度统一技巧", raw`
\sin x=\cos\left(\frac{\pi}{2}-x\right)
\\
\cos x=\sin\left(\frac{\pi}{2}-x\right)
\\
\sin x=\sin(\pi-x),\quad
\cos x=-\cos(\pi-x)
\\
\tan x=-\tan(\pi-x)
`, "常用", ["三角", "诱导公式", "角度统一", "化简"], "复杂三角式化为同一角、特殊角计算。", "角度统一就是把不同角换成同一个参考角，符号另算。", "看到 \\(x,\\pi-x,\\pi/2-x\\) 混在一起时先统一角。", "由诱导公式和单位圆对称性得到。", "\\(\\sin x+\cos(\\pi/2+x)=0\\)。", "统一角度后仍要保留符号，别只替换函数名。", "unit-circle"),

  C("calc1-trig-log-composite-equivalents", "高等数学", "第1章 函数与极限", "三角对数", "三角与对数复合等价", raw`
x\to0:\quad \ln(\cos x)\sim-\frac{x^2}{2}
\\
\ln\frac{\sin x}{x}\sim-\frac{x^2}{6}
\\
\ln\frac{\tan x}{x}\sim\frac{x^2}{3}
\\
\ln(1+\sin x)\sim x,\quad
\ln(1-\sin x)\sim -x
`, "技巧", ["极限", "三角", "对数", "高阶等价"], "三角比值取对数、乘方型极限。", "对接近 1 的三角比值取对数，会把乘方问题降成加减主项。", "看到 \\((\\sin x/x)^{1/x^2}\\)、\\((\\cos x)^{1/x^2}\\) 先取对数。", "由 \\(\ln(1+u)\sim u\\) 和三角比值精细等价得到。", "\\((\\cos x)^{1/x^2}\to e^{-1/2}\\)。", "对数内必须为正；小邻域内通常成立，但要心里确认。", "limit-slider"),

  C("calc1-trig-power-limit-templates", "高等数学", "第1章 函数与极限", "三角幂极限", "三角函数幂指极限模板", raw`
\left(\frac{\sin x}{x}\right)^{1/x^2}\to e^{-1/6}
\\
\left(\frac{\tan x}{x}\right)^{1/x^2}\to e^{1/3}
\\
(\cos x)^{1/x^2}\to e^{-1/2}
\\
\left(\frac{x}{\sin x}\right)^{1/x^2}\to e^{1/6}
`, "技巧", ["极限", "三角", "幂指函数", "1的无穷型"], "三角型 \\(1^\infty\\) 极限。", "这类题表面是幂，核心是底数离 1 的二阶距离。", "先取对数，再用 \\(\ln(1+u)\sim u\\) 和三角比值精细等价。", "例如 \\(\ln[(\\sin x/x)^{1/x^2}]=(1/x^2)\ln(\\sin x/x)\\to-1/6\\)。", "\\((x/\\tan x)^{1/x^2}\to e^{-1/3}\\)。", "指数如果不是 \\(1/x^2\\)，要重新乘对应阶数，不能死背结果。", "limit-slider"),

  C("calc1-absolute-value-equivalent-templates", "高等数学", "第1章 函数与极限", "绝对值等价", "含绝对值小量等价模板", raw`
|x|\to0,\quad |x|^\alpha\text{ 的阶数为 }\alpha
\\
\sqrt{x^2}=|x|
\\
\sqrt{x^2+x^4}=|x|\sqrt{1+x^2}\sim |x|
\\
\frac{x}{|x|}=
\begin{cases}
1,&x\to0^+\\
-1,&x\to0^-
\end{cases}
`, "常用", ["极限", "绝对值", "单侧极限", "等价"], "含 \\(|x|\\)、根式平方、分段极限。", "绝对值会把左右方向信息保留下来，所以经常需要分单侧。", "看到 \\(\sqrt{x^2}\\) 必须改成 \\(|x|\\)，再判断左右极限。", "绝对值定义直接给出左右两侧表达。", "\\(\\lim_{x\to0}x/|x|\\) 不存在。", "不要把 \\(\\sqrt{x^2}\\) 直接写成 \\(x\\)，这是极限大坑。"),

  C("calc1-piecewise-equivalent-and-one-sided", "高等数学", "第1章 函数与极限", "单侧极限", "分段函数等价与左右极限", raw`
\lim_{x\to a}f(x)=A\iff
\lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)=A
\\
f(x)\sim g(x)\ (x\to a^+),\quad
f(x)\sim h(x)\ (x\to a^-)
\\
g,h\text{ 主项不同}\Rightarrow \text{双侧极限需分开判断}
`, "必背", ["极限", "单侧极限", "分段函数", "等价"], "绝对值、分段函数、取整函数附近极限。", "双侧极限是左右两个小世界同时同意。", "有 \\(|x-a|\\)、分段定义、根式符号时优先拆左右。", "双侧极限定义要求左右极限都存在且相等。", "\\(|x|/x\\) 左右极限分别为 -1 和 1。", "只算一侧就下双侧结论，会直接翻车。"),

  C("pre-trig-sum-product-zero-triggers", "前置基础", "0. 前置基础", "三角零点", "和差化积看零点触发器", raw`
\sin A+\sin B=0
\Rightarrow 2\sin\frac{A+B}{2}\cos\frac{A-B}{2}=0
\\
\cos A+\cos B=0
\Rightarrow 2\cos\frac{A+B}{2}\cos\frac{A-B}{2}=0
\\
\cos A-\cos B=0
\Rightarrow -2\sin\frac{A+B}{2}\sin\frac{A-B}{2}=0
`, "常用", ["三角", "零点", "和差化积", "三角方程"], "三角方程、证明等式、找交点。", "和差化积把“两个波相加为零”变成几个简单因子为零。", "看到两个同类三角函数相加减等于 0，优先和差化积。", "由和差化积公式直接得到因子分解。", "\\(\\cos3x-\cos x=0\\Rightarrow \sin2x\sin x=0\\)。", "因子为零要分别写全解，别漏其中一支。", "unit-circle"),

  C("pre-trig-auxiliary-angle-inequality-range", "前置基础", "0. 前置基础", "三角范围", "辅助角求范围与不等式", raw`
R=\sqrt{a^2+b^2}
\\
-R\le a\sin x+b\cos x\le R
\\
a\sin x+b\cos x+c\ge0\ \forall x
\iff c\ge R
\\
a\sin x+b\cos x+c\le0\ \forall x
\iff c\le -R
`, "常用", ["三角", "辅助角", "范围", "不等式"], "三角不等式、参数取值、恒成立问题。", "同频正余弦线性组合的全部波动都被振幅 \\(R\\) 控制。", "恒成立题先求左边三角部分最大最小，再解参数。", "由辅助角公式化成 \\(R\sin(x+\varphi)\\) 得范围。", "若 \\(3\sin x+4\cos x+c\ge0\\) 恒成立，则 \\(c\ge5\\)。", "只有同一个角频率时才能直接合并；不同频率不能这样做。", "unit-circle"),

  C("pre-inverse-trig-hyperbolic-relations", "前置基础", "0. 前置基础", "反双曲函数", "反双曲函数对数表达", raw`
\operatorname{arsinh}x=\ln\left(x+\sqrt{x^2+1}\right)
\\
\operatorname{arcosh}x=\ln\left(x+\sqrt{x^2-1}\right)\quad(x\ge1)
\\
\operatorname{artanh}x=\frac12\ln\frac{1+x}{1-x}\quad(|x|<1)
\\
\operatorname{arcoth}x=\frac12\ln\frac{x+1}{x-1}\quad(|x|>1)
`, "了解", ["双曲函数", "反双曲", "对数", "根式积分"], "根式积分识别、对数化简、拓展公式。", "反双曲函数本质上是带根号的对数。", "看到 \\(\ln(x+\sqrt{x^2+1})\\) 可识别为 \\(\\operatorname{arsinh}x\\)。", "由双曲函数定义解指数方程得到。", "\\(\\int dx/\\sqrt{x^2+1}=\\operatorname{arsinh}x+C\\)。", "反双曲不是常规必背硬点，优先掌握识别和对数表达。"),

  C("calc1-inverse-hyperbolic-equivalents", "高等数学", "第1章 函数与极限", "反双曲等价", "反双曲函数小量等价", raw`
x\to0:\quad \operatorname{arsinh}x\sim x,\quad
\operatorname{artanh}x\sim x
\\
\operatorname{arsinh}x=x-\frac{x^3}{6}+O(x^5)
\\
\operatorname{artanh}x=x+\frac{x^3}{3}+O(x^5)
\\
\operatorname{arcosh}(1+x)\sim\sqrt{2x}\quad(x\to0^+)
`, "了解", ["极限", "反双曲", "等价无穷小", "Taylor"], "拓展极限、根式对数结构识别。", "反双曲小量和反三角小量长得像，但三阶符号不同。", "出现反双曲记号或对应对数根式时可套。", "由对数表达或导数展开积分得到。", "\\(\\operatorname{artanh}x-\operatorname{arsinh}x\sim x^3/2\\)。", "\\(\\operatorname{arcosh}(1+x)\\) 是单侧平方根主项。", "taylor-plot"),

  C("calc1-floor-fractional-basic-limits", "高等数学", "第1章 函数与极限", "取整函数", "取整与小数部分基础极限", raw`
[x]\le x<[x]+1
\\
0\le \{x\}=x-[x]<1
\\
\frac{[x]}{x}\to1\quad(x\to\infty)
\\
\frac{\{x\}}{x}\to0\quad(x\to\infty)
`, "了解", ["极限", "取整函数", "夹逼", "数列"], "含取整函数的基础极限和夹逼题。", "取整函数误差永远小于 1，所以在无穷远相比 \\(x\\) 可忽略。", "看到 \\([x]\\) 与 \\(x\\to\infty\\)，先用 \\([x]\le x<[x]+1\\) 夹逼。", "由取整函数定义直接得到不等式。", "\\([n\alpha]/n\to\alpha\\)。", "在有限点附近取整函数不连续，不能随便用连续函数极限法。"),

  C("pre-trig-exsec-versine-rare-identities", "前置基础", "0. 前置基础", "冷门三角", "正矢、余矢与历史三角函数", raw`
\operatorname{versin}x=1-\cos x=2\sin^2\frac{x}{2}
\\
\operatorname{coversin}x=1-\sin x
\\
\operatorname{exsec}x=\sec x-1\sim\frac{x^2}{2}
\\
\operatorname{hav}x=\frac{1-\cos x}{2}=\sin^2\frac{x}{2}
`, "拓展", ["三角", "冷门技巧", "半角", "小角近似"], "偶尔在资料或几何推导里遇到的冷门记号。", "这些冷门函数多数只是常见三角组合换了名字。", "看到 versin、hav、exsec 不要慌，翻译回 \\(1-\cos x\\)、\\(\\sec x-1\\)。", "由定义和半角公式得到。", "小角下 \\(\\operatorname{versin}x\sim x^2/2\\)。", "考研不会硬考这些名称，了解是为了读资料和识别结构。"),

  C("calc1-parameterized-small-angle-table", "高等数学", "第1章 函数与极限", "参数小角", "带参数小角等价总表", raw`
u(x)\to0:\quad \sin(au)\sim au,\quad \tan(au)\sim au
\\
1-\cos(au)\sim\frac{a^2u^2}{2}
\\
\sin(au)-\sin(bu)\sim(a-b)u
\\
\cos(au)-\cos(bu)\sim-\frac{a^2-b^2}{2}u^2
\\
\tan(au)-\tan(bu)\sim(a-b)u
`, "必背", ["极限", "三角", "参数", "等价无穷小"], "带参数三角极限、参数讨论、选择填空。", "参数只是在小量前乘了倍率，但余弦类会让倍率平方出现。", "先设共同小量 \\(u\\)，再对 \\(au,bu\\) 展开。", "由三角 Taylor 展开代入 \\(au\\)、\\(bu\\) 得到。", "\\(\\lim_{x\to0}\\frac{\\cos2x-\cos5x}{x^2}=21/2\\)。", "余弦差符号和平方差最容易错。", "limit-slider"),

  C("calc1-sine-cosine-product-equivalents", "高等数学", "第1章 函数与极限", "三角乘积", "三角乘积小量等价", raw`
x\to0:\quad \sin ax\sin bx\sim abx^2
\\
\tan ax\sin bx\sim abx^2
\\
(1-\cos ax)(1-\cos bx)\sim \frac{a^2b^2x^4}{4}
\\
\sin ax(1-\cos bx)\sim \frac{ab^2x^3}{2}
`, "常用", ["极限", "三角", "乘积", "等价无穷小"], "三角乘积型极限、阶数判断。", "乘积的阶数就是各因子阶数相加。", "先分别找每个因子的最低阶，再相乘。", "由基本等价 \\(\\sin ax\sim ax\\)、\\(1-\cos bx\sim b^2x^2/2\\) 得到。", "\\(\\sin2x(1-\cos3x)\sim9x^3\\)。", "如果是加减混合，不能直接逐因子乘，要先处理抵消。", "limit-slider"),

  C("calc1-arbitrary-point-equivalent-template", "高等数学", "第1章 函数与极限", "任意点主项", "任意点附近函数差等价", raw`
x\to a:\quad f(x)-f(a)\sim f'(a)(x-a)\quad(f'(a)\ne0)
\\
\sin x-\sin a\sim \cos a\,(x-a)\quad(\cos a\ne0)
\\
\cos x-\cos a\sim-\sin a\,(x-a)\quad(\sin a\ne0)
\\
\ln x-\ln a\sim\frac{x-a}{a}\quad(a>0)
`, "必背", ["极限", "任意点", "导数", "等价无穷小"], "不是趋于 0 点的局部等价。", "任何可导函数在普通点附近都像切线。", "看到 \\(x\to a\\) 且是函数值差，优先用导数主项。", "由 Taylor 一阶展开得到。", "\\(\\sin x-1\\) 在 \\(x\to\\pi/2\\) 一阶导为 0，要看二阶。", "若 \\(f'(a)=0\\)，一阶公式失效，要找更高阶。", "tangent-line"),

  C("calc1-arbitrary-point-second-order-template", "高等数学", "第1章 函数与极限", "任意点主项", "驻点附近二阶等价", raw`
f'(a)=0,\quad f''(a)\ne0
\Rightarrow f(x)-f(a)\sim\frac{f''(a)}{2}(x-a)^2
\\
\sin x-1\sim-\frac12\left(x-\frac{\pi}{2}\right)^2\quad(x\to\frac{\pi}{2})
\\
\cos x+1\sim\frac12(x-\pi)^2\quad(x\to\pi)
\\
\cos x-1\sim-\frac{x^2}{2}\quad(x\to0)
`, "常用", ["极限", "Taylor", "驻点", "二阶等价"], "在极值点附近的一阶抵消极限。", "驻点附近函数变化通常从二阶开始。", "若函数差的一阶导数为 0，立刻看二阶导。", "Taylor 展开到二阶且二阶导不为 0。", "\\(\\lim_{x\to\pi}\\frac{\\cos x+1}{(x-\pi)^2}=1/2\\)。", "别把任意点都平移成 0 后忘了展开中心。", "taylor-plot"),

  C("pre-trig-dirichlet-kernel-basic", "前置基础", "0. 前置基础", "三角核", "Dirichlet 核与余弦和", raw`
1+2\sum_{k=1}^{n}\cos kx=
\frac{\sin\left(n+\frac12\right)x}{\sin\frac{x}{2}}
\\
\sum_{k=-n}^{n}e^{ikx}=
\frac{\sin\left(n+\frac12\right)x}{\sin\frac{x}{2}}
\\
\sum_{k=1}^{n}\cos kx=
\frac12\left[\frac{\sin\left(n+\frac12\right)x}{\sin\frac{x}{2}}-1\right]
`, "拓展", ["三角", "Dirichlet核", "Fourier", "求和"], "Fourier 部分和、三角求和、冷门技巧。", "Dirichlet 核是有限个频率叠加后的总波形。", "遇到对称的 \\(-n\\) 到 \\(n\\) 复指数和，直接想到它。", "由有限等比数列求和再化简正弦形式。", "\\(D_n(0)=2n+1\\) 要用极限理解。", "分母 \\(\\sin(x/2)=0\\) 时需单独取极限。", "unit-circle"),

  C("pre-trig-fejer-kernel-lite", "前置基础", "0. 前置基础", "三角核", "Fejér 核直觉公式", raw`
F_n(x)=\frac1n\left(\frac{\sin(nx/2)}{\sin(x/2)}\right)^2
\\
F_n(x)\ge0
\\
\frac1{2\pi}\int_{-\pi}^{\pi}F_n(x)\,dx=1
`, "拓展", ["三角", "Fejer核", "Fourier", "正核"], "Fourier 平均、正核直觉、拓展理解。", "Fejér 核像一个越来越尖的平均权重，且非负。", "主要用于理解 Fourier Cesàro 平均，不是常规计算必背。", "由 Dirichlet 核的算术平均得到平方形式。", "\\(F_n(0)=n\\) 用极限看。", "这是拓展内容，考研常规题掌握正交积分即可。"),

  C("pre-trig-weierstrass-substitution-domain", "前置基础", "0. 前置基础", "万能代换", "万能代换区间与反代换", raw`
t=\tan\frac{x}{2},\quad x=2\arctan t
\\
x\in(-\pi,\pi)\Rightarrow t\in\mathbb R
\\
\cos x=\frac{1-t^2}{1+t^2},\quad
\sin x=\frac{2t}{1+t^2}
\\
x=\pi\text{ 对应 }t=\infty
`, "技巧", ["三角", "万能代换", "定义域", "积分"], "定积分万能代换时的上下限处理。", "万能代换把去掉一个点的圆映到整条实线。", "定积分用万能代换时，必须同时换上下限并注意跨过 \\(\pi\\) 的点。", "由 \\(x=2\\arctan t\\) 和半角关系得到。", "\\(x:0\to\pi/2\\) 对应 \\(t:0\to1\\)。", "跨越 \\(x=\pi\\) 时 \\(t\\) 会过无穷，最好分段。"),

  C("pre-trig-law-of-tangents", "前置基础", "0. 前置基础", "几何三角", "正切定理与半角边角关系", raw`
\frac{a-b}{a+b}=
\frac{\tan\frac{A-B}{2}}{\tan\frac{A+B}{2}}
\\
\tan\frac{A}{2}=\frac{r}{s-a}
\\
\sin^2\frac{A}{2}=\frac{(s-b)(s-c)}{bc},\quad
\cos^2\frac{A}{2}=\frac{s(s-a)}{bc}
`, "了解", ["三角", "几何", "半角", "正切定理"], "几何三角、边角转换、冷门选择填空。", "半角公式也能把三角形边长和角度连起来。", "遇到三角形边角混合且出现半角时可识别。", "由正弦定理、余弦定理和半角公式推出。", "内切圆半径满足 \\(S=rs\\)，可得 \\(\\tan(A/2)=r/(s-a)\\)。", "这是拓展几何公式，常规解析几何优先用正余弦定理。"),

  C("calc1-common-zero-over-zero-factor-table", "高等数学", "第1章 函数与极限", "0/0因子", "常见 0/0 因子快速拆解", raw`
x^n-a^n=(x-a)\sum_{k=0}^{n-1}x^{n-1-k}a^k
\\
\sin x-\sin a=2\cos\frac{x+a}{2}\sin\frac{x-a}{2}
\\
\cos x-\cos a=-2\sin\frac{x+a}{2}\sin\frac{x-a}{2}
\\
\ln x-\ln a=\ln\left(1+\frac{x-a}{a}\right)
`, "必背", ["极限", "0/0", "因式分解", "三角"], "不用洛必达也能快速拆的基础极限。", "0/0 极限的第一反应应该是拆出共同小因子。", "看到 \\(x\to a\\) 的差值，先想能否拆出 \\(x-a\\)。", "代数幂差、三角和差化积、对数差都能显式拆出小量。", "\\(\\lim_{x\to a}\\frac{\\sin x-\sin a}{x-a}=\\cos a\\)。", "拆因子前要确认分母对应的小量是什么。"),

  C("calc1-equivalent-continuous-function-closure", "高等数学", "第1章 函数与极限", "等价闭包", "等价无穷小的函数闭包规则", raw`
u\sim v,\ u,v\to0,\ f'(0)\ne0
\Rightarrow f(u)\sim f(v)
\\
f(u)\sim f'(0)u,\quad f(v)\sim f'(0)v
\\
u\sim v\Rightarrow e^u-1\sim e^v-1,\quad \ln(1+u)\sim\ln(1+v)
\\
u\sim v\Rightarrow \sin u\sim\sin v,\quad \tan u\sim\tan v
`, "常用", ["极限", "等价无穷小", "复合函数", "闭包"], "复杂复合等价、替换合法性判断。", "当外层函数在 0 处有非零斜率时，等价关系可以穿过外层函数。", "遇到 \\(f(u)/f(v)\\)，先看 \\(u\sim v\\) 且 \\(f'(0)\ne0\\)。", "由 Taylor 一阶主项 \\(f(u)=f'(0)u+o(u)\\) 得到。", "若 \\(u\sim v\\)，则 \\(\\ln(1+u)/\\ln(1+v)\to1\\)。", "若 \\(f'(0)=0\\)，如 \\(1-\cos u\\)，要看更高阶，不能直接套。"),

  C("calc1-equivalent-power-closure", "高等数学", "第1章 函数与极限", "等价闭包", "等价无穷小的幂次闭包", raw`
u\sim v,\quad \alpha>0
\Rightarrow |u|^\alpha\sim |v|^\alpha
\\
u\sim v,\ u,v>0
\Rightarrow u^\alpha\sim v^\alpha\quad(\alpha\in\mathbb R)
\\
u\sim v,\quad \frac1u\sim\frac1v\quad(u,v\ne0)
\\
u-v=o(v)
`, "常用", ["极限", "等价无穷小", "幂函数", "阶"], "根式、幂函数、倒数小量的等价替换。", "等价代表相对误差趋零，所以取固定幂仍保持相对误差趋零。", "根式和负幂要先看正负与定义域。", "由 \\(u/v\to1\\)，再取幂或倒数连续性得到。", "\\(\\sqrt{1-\cos x}\sim |x|/\sqrt2\\)。", "非整数幂通常要求底数为正；双侧极限里要小心符号。"),

  C("calc1-asymptotic-scale-common-list", "高等数学", "第1章 函数与极限", "尺度序列", "常见无穷小尺度链", raw`
x\to0^+:\quad
e^{-1/x}\ll x^m\ll x^a|\ln x|^b\ll x^c\quad(0<c<a,\ m>0)
\\
x^p=o(x^q)\quad(p>q,\ x\to0)
\\
|\ln x|^b=o(x^{-a})\quad(a>0)
\\
e^{-1/x}=o(x^m)\quad(m>0)
`, "拓展", ["极限", "无穷小阶", "尺度", "冷门技巧"], "比较极快小量、含 \\(e^{-1/x}\\) 的极限。", "指数型小量比任何幂次都小，对数比任何负幂都慢。", "看到 \\(e^{-1/x}\\)、\\(|\\ln x|\\)、幂函数混合，先排尺度。", "可令 \\(t=1/x\\to\infty\\)，转成指数、幂、对数增长阶比较。", "\\(e^{-1/x}/x^{100}\to0\\)。", "这是拓展尺度链；常规题可用洛必达或换元证明。"),

  C("pre-trig-pythagorean-transform-table", "前置基础", "0. 前置基础", "平方关系", "平方关系变形查表", raw`
\sin^2x=1-\cos^2x,\quad \cos^2x=1-\sin^2x
\\
\tan^2x=\sec^2x-1,\quad \cot^2x=\csc^2x-1
\\
\sec^2x=1+\tan^2x,\quad \csc^2x=1+\cot^2x
\\
\sin^2x-\cos^2x=-\cos2x,\quad
\cos^2x-\sin^2x=\cos2x
`, "必背", ["三角", "平方关系", "化简", "积分"], "三角化简、积分换元、恒等证明。", "平方关系是三角化简的地基，很多复杂式子都靠它换形。", "看到平方、倒数平方、\\(\\sec^2\\) 或 \\(\\csc^2\\)，先查这张表。", "由单位圆恒等式两边除以 \\(\\sin^2x\\) 或 \\(\\cos^2x\\) 得到。", "\\(\\sec^2x-\tan^2x=1\\)。", "变形前要注意分母不能为零。", "unit-circle"),

  C("pre-trig-symmetric-polynomial-substitution", "前置基础", "0. 前置基础", "三角代数化", "sin+cos 对称代换", raw`
s=\sin x+\cos x
\\
s^2=1+\sin2x
\\
\sin x\cos x=\frac{s^2-1}{2}
\\
\sin^2x+\cos^2x=1
\\
\sin^3x+\cos^3x=s\left(1-\frac{s^2-1}{2}\right)
`, "技巧", ["三角", "对称式", "代数化", "最值"], "含 \\(\\sin x+\cos x\\) 的对称式化简和最值。", "把 \\(\\sin x,\cos x\\) 的对称表达看成两个变量的对称多项式。", "题中反复出现 \\(\\sin x+\cos x\\) 时，设 \\(s\\) 降低复杂度。", "由 \\((\\sin x+\cos x)^2=1+2\sin x\cos x\\) 得到。", "若 \\(s=\\sin x+\cos x\\)，则 \\(s\in[-\sqrt2,\sqrt2]\\)。", "设元后别忘了 \\(s\\) 的取值范围。"),

  C("pre-trig-tan-plus-cot-table", "前置基础", "0. 前置基础", "正切余切", "tan 与 cot 组合公式", raw`
\tan x+\cot x=\frac1{\sin x\cos x}=\frac{2}{\sin2x}
\\
\tan x-\cot x=\frac{\sin^2x-\cos^2x}{\sin x\cos x}=-2\cot2x
\\
\tan x+\tan y=\frac{\sin(x+y)}{\cos x\cos y}
\\
\tan x-\tan y=\frac{\sin(x-y)}{\cos x\cos y}
`, "常用", ["三角", "tan", "cot", "化简"], "正切余切混合化简、三角方程。", "正切余切组合通常可以变成二倍角或和差角。", "看到 \\(\\tan x+\cot x\\) 不要通分太久，直接转 \\(2/\sin2x\\)。", "由商数关系和二倍角公式得到。", "\\(\\tan x+\cot x\\ge2\\) 在第一象限可由 \\(2/\sin2x\\) 看出。", "公式要求 \\(\\sin x\\cos x\ne0\\)。", "unit-circle"),

  C("pre-trig-cosine-sine-shift-product", "前置基础", "0. 前置基础", "移相乘积", "移相乘积与平方差公式", raw`
\sin(x+a)\sin(x-a)=\sin^2x-\sin^2a
\\
\cos(x+a)\cos(x-a)=\cos^2x-\sin^2a
\\
\sin(x+a)\cos(x-a)=\frac12[\sin2x+\sin2a]
\\
\cos(x+a)\sin(x-a)=\frac12[\sin2x-\sin2a]
`, "技巧", ["三角", "积化和差", "移相", "化简"], "对称移相角 \\(x\\pm a\\) 的乘积化简。", "对称移相乘积常直接掉成平方差或二倍角。", "看到 \\((x+a),(x-a)\\) 成对出现时优先套这张表。", "由积化和差公式代入 \\(A=x+a,B=x-a\\) 得到。", "\\(\\sin(x+\pi/6)\sin(x-\pi/6)=\\sin^2x-1/4\\)。", "符号依赖是正弦还是余弦，别把 \\(\\sin^2a\\) 写成 \\(\\cos^2a\\)。", "unit-circle"),

  C("calc1-limit-normalization-strategy", "高等数学", "第1章 函数与极限", "极限规范化", "极限变量规范化套路", raw`
x\to a:\quad h=x-a,\ h\to0
\\
f(x)-f(a)=f(a+h)-f(a)
\\
x\to\infty:\quad t=\frac1x,\ t\to0^+
\\
\ln(x+a)-\ln x=\ln\left(1+\frac{a}{x}\right)
`, "必背", ["极限", "变量替换", "规范化", "主项"], "把任意点或无穷远极限转成 0 附近展开。", "多数极限都可以先规范化成“一个小量趋于 0”。", "任意点令 \\(h=x-a\\)，无穷远令 \\(t=1/x\\)，再用小量表。", "变量替换保持极限过程，只是换了更适合展开的坐标。", "\\(x\to\infty\\) 时 \\((x+1)^\alpha-x^\alpha=x^\alpha[(1+1/x)^\alpha-1]\\)。", "替换后要同步改写所有变量和方向。"),

  C("calc1-increment-differential-equivalents", "高等数学", "第1章 函数与极限", "增量等价", "函数增量与微分等价", raw`
\Delta y=f(x+\Delta x)-f(x)
\\
f\text{在 }x\text{ 可导}\Rightarrow
\Delta y\sim f'(x)\Delta x\quad(f'(x)\ne0,\ \Delta x\to0)
\\
\Delta y=f'(x)\Delta x+o(\Delta x)
\\
dy=f'(x)dx
`, "必背", ["极限", "微分", "增量", "等价"], "局部线性化、近似计算、任意点极限。", "可导就是函数增量和微分在一阶上等价。", "看到 \\(f(x+h)-f(x)\\) 且 \\(h\to0\\)，优先写导数主项。", "由导数定义 \\([f(x+h)-f(x)]/h\to f'(x)\\) 得到。", "\\(\\sqrt{4+h}-2\sim h/4\\)。", "若 \\(f'(x)=0\\)，一阶等价消失，要看二阶。", "tangent-line"),

  C("calc1-inverse-function-equivalent-template", "高等数学", "第1章 函数与极限", "反函数等价", "反函数局部等价模板", raw`
y=f(x),\quad f(a)=b,\quad f'(a)\ne0
\\
f^{-1}(y)-a\sim \frac{y-b}{f'(a)}\quad(y\to b)
\\
\arcsin x\sim x,\quad \arctan x\sim x
\\
\arccos(1-u)\sim\sqrt{2u}\quad(u\to0^+)
`, "常用", ["极限", "反函数", "等价", "反三角"], "反函数、反三角局部极限。", "反函数的局部变化率是原函数变化率的倒数。", "看到反函数在某点附近，先找原函数对应点和导数。", "由反函数求导公式或一阶 Taylor 反解得到。", "\\(\\ln(1+x)\\) 的反函数 \\(e^y-1\sim y\\)。", "若原函数导数为 0，反函数可能出现平方根主项。"),

  C("calc1-composition-order-bookkeeping", "高等数学", "第1章 函数与极限", "阶数记账", "复合小量阶数记账表", raw`
u=O(x^p),\quad v=O(x^q)
\\
uv=O(x^{p+q}),\quad u+v=O(x^{\min(p,q)})
\\
u=o(x^p),\ v=O(x^q)\Rightarrow uv=o(x^{p+q})
\\
f(u)=O(u^m)\Rightarrow f(u(x))=O(x^{pm})
`, "常用", ["极限", "阶数", "O记号", "复合函数"], "判断展开到几阶、避免过度计算。", "阶数记账像会计：乘法加阶，加法取较低阶。", "Taylor 展开前先估算需要到几阶，减少盲目展开。", "由 \\(O,o\\) 定义和乘法比较得到。", "若 \\(u=x^2+o(x^2)\\)，则 \\(1-\cos u=O(x^4)\\)。", "加法若同阶可能抵消，取 \\(\\min\\) 只是上界，主项要看系数。"),

  C("pre-trig-fourth-sixth-power-averages", "前置基础", "0. 前置基础", "三角幂平均", "四次六次三角幂平均", raw`
\int_0^{2\pi}\sin^4x\,dx=\int_0^{2\pi}\cos^4x\,dx=\frac{3\pi}{4}
\\
\int_0^{2\pi}\sin^6x\,dx=\int_0^{2\pi}\cos^6x\,dx=\frac{5\pi}{8}
\\
\frac1{2\pi}\int_0^{2\pi}\sin^{2m}x\,dx=
\frac{(2m)!}{2^{2m}(m!)^2}
\\
\int_0^{2\pi}\sin^{2m+1}x\,dx=0
`, "常用", ["三角", "幂平均", "定积分", "Wallis"], "高次三角定积分、平均值、选择填空。", "偶次幂有正平均，奇次幂完整周期抵消为 0。", "完整周期上高次幂积分可直接查或用 Wallis。", "由降幂公式或 Wallis 公式得到。", "\\(\\int_0^{2\pi}\\sin^4x dx=3\pi/4\\)。", "区间不是完整周期时不能直接套平均值。", "unit-circle"),

  C("pre-trig-mixed-even-power-averages", "前置基础", "0. 前置基础", "混合幂积分", "sin/cos 混合偶次平均", raw`
\int_0^{2\pi}\sin^2x\cos^2x\,dx=\frac{\pi}{4}
\\
\int_0^{2\pi}\sin^4x\cos^2x\,dx=\frac{\pi}{8}
\\
\int_0^{2\pi}\sin^2x\cos^4x\,dx=\frac{\pi}{8}
\\
\int_0^{2\pi}\sin^{2m+1}x\cos^n x\,dx=0\quad(n\text{ 为偶数时完整周期})
`, "技巧", ["三角", "混合幂", "定积分", "周期"], "混合三角幂积分、概率/物理平均。", "完整周期上只要有无法配平的奇对称，就会抵消。", "先看奇偶抵消，再对偶次幂用降幂或 Beta/Wallis。", "由降幂公式或 \\(\\sin^2x\cos^2x=(1-\cos4x)/8\\) 得到。", "\\(\\int_0^{2\pi}\\sin^2x\cos^2x dx=\\pi/4\\)。", "奇偶抵消要结合积分区间对称性，不是任意区间都成立。", "unit-circle"),

  C("pre-trig-half-angle-all-tan-forms", "前置基础", "0. 前置基础", "半角公式", "半角正切全形态", raw`
\tan\frac{x}{2}=\frac{\sin x}{1+\cos x}
=\frac{1-\cos x}{\sin x}
\\
\cot\frac{x}{2}=\frac{\sin x}{1-\cos x}
=\frac{1+\cos x}{\sin x}
\\
\sin x=\frac{2t}{1+t^2},\quad
\cos x=\frac{1-t^2}{1+t^2},\quad t=\tan\frac{x}{2}
\\
\tan x=\frac{2t}{1-t^2}
`, "必背", ["三角", "半角", "万能代换", "有理化"], "半角化简、三角有理式、极限。", "切半角公式是连接半角、万能代换和有理化的桥。", "看到 \\(1\pm\cos x\\) 与 \\(\\sin x\\) 互相除，直接切半角。", "由半角公式和二倍角公式推出。", "\\((1-\cos x)/\\sin x=\\tan(x/2)\\sim x/2\\)。", "分母为 0 的点要单独看；万能代换跨 \\(\\pi\\) 要分段。", "unit-circle"),

  C("pre-trig-inverse-composition-table", "前置基础", "0. 前置基础", "反三角复合", "三角与反三角复合表", raw`
\sin(\arctan x)=\frac{x}{\sqrt{1+x^2}},\quad
\cos(\arctan x)=\frac1{\sqrt{1+x^2}}
\\
\tan(\arcsin x)=\frac{x}{\sqrt{1-x^2}}
\\
\tan(\arccos x)=\frac{\sqrt{1-x^2}}{x}
\\
\sin(2\arctan x)=\frac{2x}{1+x^2},\quad
\cos(2\arctan x)=\frac{1-x^2}{1+x^2}
`, "常用", ["反三角", "复合函数", "三角", "万能代换"], "反三角化简、积分结果转化、万能代换理解。", "把反三角看成一个角，再画直角三角形读边长。", "出现 \\(\\sin(\\arctan x)\\)、\\(\\tan(\\arcsin x)\\) 直接查表。", "令 \\(\\theta=\arctan x\\)，则直角边比为 \\(x:1\\)。", "\\(\\cos(2\\arctan x)=(1-x^2)/(1+x^2)\\)。", "\\(\\tan(\\arccos x)\\) 要注意 \\(x=0\\) 无定义。", "unit-circle"),

  C("calc1-oscillatory-bounded-small-product", "高等数学", "第1章 函数与极限", "振荡有界", "振荡有界乘小量模板", raw`
g(x)\text{有界},\quad f(x)\to0
\Rightarrow f(x)g(x)\to0
\\
|\sin\frac1x|\le1,\quad |\cos\frac1x|\le1
\\
x^\alpha\sin\frac1{x^\beta}\to0\quad(\alpha>0)
\\
\frac{\sin(1/x)}{1/x}\not\to1\quad(x\to0)
`, "必背", ["极限", "夹逼", "振荡", "有界"], "含 \\(\\sin(1/x)\\)、\\(\\cos(1/x)\\) 的极限。", "再疯狂振荡，只要被趋零因子压住，乘积就趋零。", "看到 \\(x^a\\sin(1/x^b)\\) 先用有界夹逼。", "由 \\(|f(x)g(x)|\le M|f(x)|\\to0\\) 得到。", "\\(x\cos(1/x^2)\to0\\)。", "\\(\\sin u/u\\to1\\) 要求 \\(u\to0\\)，而 \\(1/x\\to\infty\\) 不能套。", "limit-slider"),

  C("pre-inverse-trig-addition-subtraction", "前置基础", "0. 前置基础", "反三角加减", "反三角加减公式与象限修正", raw`
\arctan x+\arctan y=
\arctan\frac{x+y}{1-xy}\quad(xy<1)
\\
\arctan x+\arctan y=
\arctan\frac{x+y}{1-xy}+\pi\quad(x>0,y>0,xy>1)
\\
\arctan x-\arctan y=
\arctan\frac{x-y}{1+xy}
\\
\arcsin x+\arcsin y=
\arcsin\left(x\sqrt{1-y^2}+y\sqrt{1-x^2}\right)
`, "技巧", ["反三角", "加法公式", "象限", "考研技巧"], "反三角化简、极限、积分结果整理。", "反三角加减最怕少一个 \\(\\pi\\)，本质是主值区间修正。", "先用正切加法化成一个角，再看结果应该落在哪个象限。考研选择填空可先代特殊值验象限。", "令 \\(A=\arctan x,B=\arctan y\\)，对 \\(A\pm B\\) 取正切得到。", "\\(\\arctan1+\arctan2=\\arctan(-3)+\\pi\\)。", "公式不是无条件恒等式；反正切主值范围会导致差 \\(\\pi\\)。", "unit-circle"),

  C("pre-trig-substitution-boundary-table", "前置基础", "0. 前置基础", "三角代换", "三角代换与取值边界表", raw`
\sqrt{a^2-x^2}:\quad x=a\sin t,\quad t\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]
\\
\sqrt{a^2+x^2}:\quad x=a\tan t,\quad t\in\left(-\frac{\pi}{2},\frac{\pi}{2}\right)
\\
\sqrt{x^2-a^2}:\quad x=a\sec t,\quad t\in\left[0,\frac{\pi}{2}\right)\cup\left(\frac{\pi}{2},\pi\right]
\\
\sqrt{a^2-x^2}=a\cos t\quad(x=a\sin t,\ \cos t\ge0)
`, "必背", ["三角代换", "根式", "积分", "定义域"], "根式积分、定积分换元、极限中的根式化简。", "三角代换的成败一半在代换，一半在区间选对。", "看到 \\(a^2-x^2\\) 选正弦，\\(a^2+x^2\\) 选正切，\\(x^2-a^2\\) 选正割；定积分必须同步换上下限。", "由 \\(1-\sin^2t=\cos^2t\\)、\\(1+\tan^2t=\sec^2t\\) 得到。", "\\(\\sqrt{1-x^2}\\) 令 \\(x=\sin t\\)，若 \\(t\in[-\pi/2,\pi/2]\\)，根式就是 \\(\\cos t\\)。", "不限定区间会出现 \\(|\\cos t|\\)、\\(|\\tan t|\\) 这类符号坑。"),

  C("pre-trig-solution-strategy-cheatsheet", "前置基础", "0. 前置基础", "三角解题思路", "三角题解题思路速查", raw`
\text{乘积积分}\Rightarrow \text{积化和差}
\\
\text{相加求零点}\Rightarrow \text{和差化积}
\\
\text{线性组合最值}\Rightarrow a\sin x+b\cos x=R\sin(x+\varphi)
\\
\text{偶次幂积分}\Rightarrow \text{降幂}
\\
\text{三角有理式}\Rightarrow t=\tan\frac{x}{2}
`, "必背", ["三角", "解题思路", "考研技巧", "速查"], "考研数学一三角化简、积分、极限前置判断。", "三角题不是硬算，先识别题型触发器，公式自然出来。", "先看结构：乘积、和差、线性组合、偶次幂、有理式分别对应不同套路。", "这些套路都来自和差角公式、降幂公式和半角代换。", "\\(\\int\sin3x\cos5x dx\\) 先积化和差；\\(3\sin x+4\cos x\\) 先辅助角。", "不要一上来万能代换，它稳但常常最长。", "unit-circle"),

  C("calc1-limit-solution-strategy-cheatsheet", "高等数学", "第1章 函数与极限", "极限解题思路", "极限题解题思路速查", raw`
0/0:\quad \text{先因式分解/等价/Taylor，再考虑洛必达}
\\
\infty-\infty:\quad \text{通分、有理化、提主项}
\\
1^\infty:\quad \text{取对数}
\\
\text{加减抵消}:\quad \text{Taylor 找首个非零项}
\\
\text{振荡乘小量}:\quad \text{夹逼}
`, "必背", ["极限", "解题思路", "考研技巧", "方法选择"], "考研数学一极限题的第一反应表。", "极限题先分类，别急着算；分类对了，公式只剩代入。", "先判断型别：0/0、无穷差、幂指、加减抵消、振荡，再选对应工具。", "各方法本质都是把复杂式子转成可比较主项。", "\\(\\sqrt{x^2+x}-x\\) 属于 \\(\infty-\infty\\)，先有理化或提 \\(x\\)。", "洛必达不是万能首选；加减抵消和含参数题 Taylor 往往更快。", "limit-slider"),

  C("appendix-common-numerical-values", "附录速查", "A. 常用数值附录", "常数近似", "考研常用常数数值", raw`
\pi\approx3.1415926,\quad e\approx2.7182818,\quad
\sqrt2\approx1.4142136
\\
\sqrt3\approx1.7320508,\quad
\sqrt5\approx2.2360679
\\
\ln2\approx0.693147,\quad
\ln3\approx1.098612
\\
\frac1{\sqrt{2\pi}}\approx0.398942,\quad
\sqrt{2\pi}\approx2.506628
`, "常用", ["附录", "常用数值", "常数", "速查"], "选择填空估算、概率正态密度、数值 sanity check。", "常用数值不是为了死算，而是为了快速判断答案量级。", "选择填空估算、概率密度、近似比较时查；大题通常保留精确形式。", "这些是标准数学常数的小数近似。", "\\(1/\\sqrt{2\\pi}\\) 是标准正态密度在 0 处的值。", "除非题目要求近似，否则最终答案优先保留根号、\\(\\pi\\)、\\(e\\)。"),

  C("appendix-common-angle-values", "附录速查", "A. 常用数值附录", "角度数值", "常用角度弧度与三角值", raw`
30^\circ=\frac{\pi}{6},\quad45^\circ=\frac{\pi}{4},\quad60^\circ=\frac{\pi}{3}
\\
90^\circ=\frac{\pi}{2},\quad180^\circ=\pi,\quad360^\circ=2\pi
\\
\sin15^\circ=\frac{\sqrt6-\sqrt2}{4},\quad
\cos15^\circ=\frac{\sqrt6+\sqrt2}{4}
\\
\tan15^\circ=2-\sqrt3,\quad \tan75^\circ=2+\sqrt3
`, "必背", ["附录", "三角", "常用数值", "特殊角"], "三角选择填空、单位圆、特殊角精确值。", "角度和弧度换算是三角题入口，特殊角是快速计算钥匙。", "遇到 15°、75°、30°、45°、60° 优先转精确值，不要用小数硬算。", "由和差角公式和标准角值得到。", "\\(75^\circ=45^\circ+30^\circ\\)，所以 \\(\\tan75^\circ=2+\sqrt3\\)。", "考研一般使用弧度制；题目写角度时再换算。", "unit-circle"),

  C("appendix-common-normal-quantiles", "附录速查", "A. 常用数值附录", "概率数值", "常用正态分位数", raw`
z_{0.10}=1.2816,\quad z_{0.05}=1.6449,\quad z_{0.025}=1.9600
\\
z_{0.01}=2.3263,\quad z_{0.005}=2.5758
\\
\Phi(1.96)\approx0.975,\quad \Phi(1.645)\approx0.95
\\
\Phi(-x)=1-\Phi(x)
`, "常用", ["附录", "概率", "正态分布", "常用数值"], "概率统计置信区间、假设检验。", "正态分位数是统计题查表的压缩版。", "置信区间和检验题看到 95%、90%、99% 时快速查对应分位点。", "由标准正态分布表给出。", "双侧 95% 置信区间常用 \\(1.96\\)。", "不同教材记号可能用上侧分位数，先确认 \\(z_\\alpha\\) 的定义。", "distribution-plot")

,

  C("calc1-equivalent-replacement-workflow", "高等数学", "第1章 函数与极限", "等价替换", "等价无穷小替换决策流程", raw`
\text{乘除整体： }f\sim g\Rightarrow fh\sim gh,\quad \frac{f}{h}\sim\frac{g}{h}\ (h\ne0)
\\
\text{加减抵消： }f-g\text{ 要看首个非零 Taylor 项}
\\
u(x)\to0:\quad \sin u\sim u,\quad \ln(1+u)\sim u,\quad e^u-1\sim u
\\
u\sim v,\ u,v\text{同号}\Rightarrow u^\alpha\sim v^\alpha
`, "必背", ["极限", "等价无穷小", "解题思路", "考研技巧"], "只用于乘除因子整体替换；加减抵消必须先判断是否同阶抵消。", "等价替换是主项替换：乘除看主项够用，加减会把主项抵掉就必须看下一项。", "乘除型先换等价；加减型先 Taylor 到首个不抵消项；复合函数先令内层小量 u。", "若 \\(f\\sim g\\)，则 \\(f/g\\to1\\)，所以乘除不改极限；但 \\(f-h\\) 与 \\(g-h\\) 可能主项相消。", "\\(\\frac{\\sin x\\ln(1+x)}{x^2}\\to1\\)；但 \\(\\sin x-x\\) 不能替成 0，要用 \\(-x^3/6\\)。", "最常见错误：在加减式里直接把 \\(\\sin x\\) 换成 x，导致把真正主项删没了。", "limit-slider"),

  C("calc1-taylor-order-selection-workflow", "高等数学", "第1章 函数与极限", "Taylor", "Taylor 展开阶数选择技巧", raw`
f(x)=a_mx^m+a_{m+1}x^{m+1}+O(x^{m+2}),\quad a_m\ne0
\\
\frac{f(x)}{x^k}:\quad \text{至少展开到 }x^k\text{ 或首个非零项}
\\
e^x=1+x+\frac{x^2}{2}+\frac{x^3}{6}+\frac{x^4}{24}+O(x^5)
\\
\sin x=x-\frac{x^3}{6}+\frac{x^5}{120}+O(x^7)
\\
\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}+O(x^4)
`, "必背", ["极限", "Taylor", "主项法", "解题思路"], "适合加减抵消、含参数极限、需要精确到某阶的题。", "Taylor 阶数不是越高越好，而是展开到第一个不被抵消的非零项。", "先估最低阶；若主项抵消就多展开两阶；分母是 \\(x^m\\) 时通常展开到 \\(x^m\\) 或更高一阶。", "Taylor 公式把函数局部表示为幂级数，极限只由最低非零幂控制。", "\\(\\lim_{x\\to0}\\frac{\\sin x-x}{x^3}=-1/6\\)，只需展开到三阶。", "不要无脑写很多项；项越多越容易算错，目标是找到首个非零项。", "taylor-plot"),

  C("calc1-limit-common-traps", "高等数学", "第1章 函数与极限", "极限易错", "极限常见坑速查", raw`
\sqrt{x^2}=|x|
\\
\frac{\sin u}{u}\to1\text{ 要求 }u\to0
\\
\text{洛必达： }0/0\text{ 或 }\infty/\infty\text{ 且可导}
\\
1^\infty:\quad u(x)^{v(x)}=\exp\{v(x)\ln u(x)\}
\\
\infty-\infty:\quad \text{通分、有理化、提主项}
`, "必背", ["极限", "易错点", "绝对值", "洛必达", "考研技巧"], "极限综合题、选择填空陷阱题。", "极限错题常不是不会算，而是把条件、方向、定义域忘了。", "先查趋近方向和定义域；根式先想绝对值；洛必达前确认 0/0 或无穷比无穷且可导。", "这些坑都来自基本定义：根号是非负主值，等价公式有趋近条件，洛必达有适用条件。", "\\(\\sqrt{x^2}/x\\) 在 \\(x\\to0^+\\) 为 1，在 \\(x\\to0^-\\) 为 -1，两侧极限不存在。", "尤其别把 \\(\\sin u/u\\to1\\) 用在 \\(u\\to\\infty\\)；别把 \\(0\\cdot\\infty\\) 当 0。", "limit-slider"),

  C("calc2-curvature-formulas", "高等数学", "第2章 导数与微分", "曲率", "平面曲线曲率公式", raw`
y=f(x):\quad \kappa=\frac{|y''|}{(1+y'^2)^{3/2}}
\\
x=x(t),\ y=y(t):\quad
\kappa=\frac{|x'y''-y'x''|}{(x'^2+y'^2)^{3/2}}
\\
\rho=\frac1\kappa
`, "常用", ["导数应用", "曲率", "参数方程"], "导数应用、曲线弯曲程度、选择填空。", "曲率衡量切线方向变化有多快。", "显函数用第一式；参数式曲线用第二式；圆的曲率应为 \\(1/R\\) 可作检查。", "弧长参数下曲率是单位切向量对弧长的变化率。", "圆 \\(x=R\\cos t,y=R\\sin t\\)，代入得 \\(\\kappa=1/R\\)。", "分母不能为 0；尖点处曲率公式常失效。", "tangent-line"),

  C("calc3-asymptote-convexity-table", "高等数学", "第3章 微分中值定理与导数应用", "曲线性态", "渐近线、单调凹凸与拐点速查", raw`
f'(x)>0\Rightarrow f\text{递增},\quad f'(x)<0\Rightarrow f\text{递减}
\\
f''(x)>0\Rightarrow \text{凹向上},\quad f''(x)<0\Rightarrow \text{凹向下}
\\
\text{水平渐近线： }\lim_{x\to\infty}f(x)=b
\\
\text{斜渐近线： }k=\lim_{x\to\infty}\frac{f(x)}x,\quad
b=\lim_{x\to\infty}(f(x)-kx)
`, "必背", ["导数应用", "单调性", "凹凸性", "渐近线"], "函数图像题、证明不等式、选择填空。", "一阶导看升降，二阶导看弯曲，无穷远极限看渐近线。", "先找定义域，再求一阶导、二阶导、无穷远极限，最后综合画草图。", "导数符号给局部变化方向；渐近线来自函数与直线差趋零。", "\\(y=x+1+1/x\\) 有斜渐近线 \\(y=x+1\\)。", "拐点要求凹凸性改变，不是仅仅 \\(f''=0\\)。"),

  C("calc4-rational-integral-decomposition", "高等数学", "第4章 不定积分", "有理函数积分", "有理函数部分分式积分模板", raw`
\frac{P(x)}{Q(x)}=S(x)+\sum\frac{A_i}{x-a_i}
\ +\sum\frac{B_i}{(x-a_i)^2}+\cdots
\\
\quad+\sum\frac{M_ix+N_i}{x^2+p_ix+q_i}+\cdots
\\
\int\frac{dx}{x-a}=\ln|x-a|+C
\\
\int\frac{dx}{(x-a)^k}=-\frac1{(k-1)(x-a)^{k-1}}+C
`, "必背", ["积分", "有理函数", "部分分式", "不定积分"], "有理函数积分、三角万能代换后的积分。", "有理函数积分的核心是拆成线性因子和不可约二次因子的基本块。", "先长除，再因式分解分母，再设部分分式，最后套 \\(\\ln\\) 与 \\(\\arctan\\) 基本型。", "部分分式分解来自代数恒等式比较系数。", "\\(\\int dx/(x^2-1)=\\frac12\\ln|(x-1)/(x+1)|+C\\)。", "分母有重根时每阶都要设项；不可约二次因子分子要设一次式。"),

  C("calc5-definite-integral-symmetry-master", "高等数学", "第5章 定积分", "对称性", "定积分对称性总表", raw`
\int_{-a}^{a}f(x)dx=0\quad(f\text{奇})
\\
\int_{-a}^{a}f(x)dx=2\int_0^a f(x)dx\quad(f\text{偶})
\\
\int_a^b f(x)dx=\int_a^b f(a+b-x)dx
\\
\int_a^b f(x)dx=\frac12\int_a^b[f(x)+f(a+b-x)]dx
\\
f(x+T)=f(x)\Rightarrow \int_a^{a+T}f=\int_0^T f
`, "必背", ["定积分", "对称性", "奇偶性", "周期"], "定积分计算、选择填空、简化区间。", "定积分对称性是在区间上做配对：左右配、首尾配、周期配。", "先看区间是否关于 0、a 或周期对称，再做 \\(x\\mapsto -x\\)、\\(x\\mapsto a+b-x\\) 替换。", "由定积分换元公式直接得到。", "\\(\\int_0^\\pi x\\sin xdx=\\pi\\int_0^\\pi\\sin xdx/2=\\pi\\)。", "函数必须在对应区间可积；不要把奇偶性用于非对称区间。", "riemann-sum"),

  C("calc5-integral-inequality-estimates", "高等数学", "第5章 定积分", "积分估计", "定积分估值不等式模板", raw`
m\le f(x)\le M\Rightarrow m(b-a)\le\int_a^bf\le M(b-a)
\\
\left|\int_a^bf\right|\le\int_a^b|f|
\\
\left(\int_a^bfg\right)^2\le\int_a^bf^2\int_a^bg^2
\\
f\text{单调增}:\quad (b-a)f(a)\le\int_a^bf\le(b-a)f(b)
`, "常用", ["定积分", "不等式", "估值", "证明"], "积分不等式证明、误差估计、夹逼。", "积分估值就是把函数夹住，再把夹住的函数积分。", "若函数单调，用端点夹；若有平方积，用 Cauchy-Schwarz；若有凸凹，再想 Jensen 或 Hermite-Hadamard。", "由积分保序性和 Cauchy-Schwarz 不等式得到。", "若 \\(0\\le f\\le1\\)，则 \\(0\\le\\int_a^b f\\le b-a\\)。", "估值前要确认函数在区间上的符号、单调或界。"),

  C("calc7-first-order-ode-templates", "高等数学", "第7章 微分方程", "一阶方程", "一阶微分方程类型速查", raw`
\frac{dy}{dx}=X(x)Y(y)\Rightarrow \int\frac{dy}{Y(y)}=\int X(x)dx
\\
y'+P(x)y=Q(x):\quad
y=e^{-\int Pdx}\left(\int Qe^{\int Pdx}dx+C\right)
\\
y'=F\left(\frac yx\right):\quad y=vx
\\
y'+Py=Qy^n:\quad z=y^{1-n}
`, "必背", ["微分方程", "一阶方程", "变量分离", "齐次方程"], "微分方程大题入门识别。", "一阶方程先分类，分类对了就是换元或积分因子。", "可分离直接分；齐次令 \\(y=vx\\)；线性用积分因子；Bernoulli 令 \\(z=y^{1-n}\\)。", "各公式由代换后化为可分离或线性方程。", "\\(y'+y=e^x\\)，积分因子 \\(e^x\\)，得 \\((e^xy)'=e^{2x}\\)。", "判断齐次方程看 \\(dy/dx=F(y/x)\\)，不是看有没有常数项。"),

  C("calc8-space-plane-line-distance-table", "高等数学", "第8章 向量代数与空间解析几何", "空间距离", "空间直线平面距离夹角表", raw`
d(P,\pi):\quad \frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}
\\
\cos\angle(l_1,l_2)=\frac{|s_1\cdot s_2|}{|s_1||s_2|}
\\
\cos\angle(\pi_1,\pi_2)=\frac{|n_1\cdot n_2|}{|n_1||n_2|}
\\
\sin\angle(l,\pi)=\frac{|s\cdot n|}{|s||n|}
\\
d(l_1,l_2)=\frac{|(P_2-P_1)\cdot(s_1\times s_2)|}{|s_1\times s_2|}
`, "必背", ["空间几何", "距离", "夹角", "直线平面"], "空间解析几何、曲面积分参数化前置。", "空间几何题就是点、方向向量、法向量之间的投影和叉积。", "距离看投影；夹角看点积；异面直线距离看混合积。", "点到平面距离来自向法向量投影；异面距离来自平行六面体体积除底面积。", "点 \\((1,2,3)\\) 到平面 \\(x+y+z=0\\) 距离为 \\(6/\\sqrt3=2\\sqrt3\\)。", "直线夹角与平面夹角常互余，公式别套反。"),

  C("calc9-lagrange-multiplier-templates", "高等数学", "第9章 多元函数微分法及应用", "条件极值", "Lagrange 乘数法模板", raw`
\nabla f=\lambda\nabla g
\\
\nabla f=\lambda\nabla g+\mu\nabla h
\\
F(x,y,z)=f(x,y,z)-\lambda(g(x,y,z)-c)
\\
\frac{\partial F}{\partial x}=\frac{\partial F}{\partial y}
=\frac{\partial F}{\partial z}
=\frac{\partial F}{\partial\lambda}=0
`, "必背", ["多元微分", "条件极值", "Lagrange", "极值"], "多元函数条件极值、几何最值。", "约束极值时，目标函数的梯度要落在约束法向量张成的方向里。", "一个约束写 \\(\\nabla f=\\lambda\\nabla g\\)；多个约束加多个乘子；最后连同约束一起解。", "极值点处沿约束曲面的任意切向变化都不改变一阶值，因此梯度垂直于切空间。", "求 \\(x^2+y^2\\) 在 \\(x+y=1\\) 上最小，解 \\((2x,2y)=\\lambda(1,1)\\)，得 \\(x=y=1/2\\)。", "约束梯度为零或边界点要单独处理，不能只解乘子方程。"),

  C("calc10-domain-transform-templates", "高等数学", "第10章 重积分", "区域变换", "重积分区域变换与常用替换", raw`
x=r\cos\theta,\quad y=r\sin\theta,\quad dA=rdrd\theta
\\
x=ar\cos\theta,\quad y=br\sin\theta,\quad dA=abrdrd\theta
\\
(u,v)=T(x,y):\quad dxdy=\left|\frac{\partial(x,y)}{\partial(u,v)}\right|dudv
\\
\text{线性变换 }(x,y)^T=A(u,v)^T:\quad dA_{xy}=|A|dA_{uv}
`, "必背", ["重积分", "换元", "极坐标", "Jacobi"], "二重三重积分、区域化简。", "重积分换元的关键是区域简单化，代价是乘 Jacobi 绝对值。", "圆盘用极坐标；椭圆用缩放极坐标；三角形或平行四边形用线性变换。", "面积元在换元下按 Jacobi 行列式绝对值缩放。", "椭圆 \\(x^2/a^2+y^2/b^2\\le1\\) 令 \\(x=ar\\cos\\theta,y=br\\sin\\theta\\)，Jacobi 为 \\(abr\\)。", "Jacobi 要取绝对值；换元后上下限要描述新区域。"),

  C("calc11-green-gauss-stokes-route-map", "高等数学", "第11章 曲线积分与曲面积分", "场论路线", "Green/Gauss/Stokes 选择路线图", raw`
\text{平面闭曲线： }\oint_C Pdx+Qdy=\iint_D(Q_x-P_y)dA
\\
\text{闭曲面通量： }\iint_{\partial\Omega}\mathbf F\cdot\mathbf n\,dS
=\iiint_\Omega\nabla\cdot\mathbf F\,dV
\\
\text{空间闭曲线： }\oint_{\partial\Sigma}\mathbf F\cdot d\mathbf r
=\iint_\Sigma(\nabla\times\mathbf F)\cdot\mathbf n\,dS
\\
\text{不闭合：先补边，再减去补边贡献}
`, "必背", ["曲线积分", "曲面积分", "Green", "Gauss", "Stokes", "解题思路"], "第二型曲线/曲面积分、向量场积分大题。", "三大公式都是把边界上的积分和区域内部的导数联系起来。", "平面闭曲线用 Green；闭曲面通量用 Gauss；空间闭曲线环流用 Stokes；不闭合先补边界。", "本质来自微元求和时内部边界抵消，只剩外边界。", "\\(\\oint_C -y dx+x dy=2A\\)，可直接用 Green 得面积。", "方向最容易错：Green 要正向，Gauss 要外法向，Stokes 要右手定则。"),

  C("calc12-series-convergence-master", "高等数学", "第12章 无穷级数", "判敛", "正项级数判敛路线总表", raw`
\sum a_n:\quad \lim a_n\ne0\Rightarrow\text{发散}
\\
\sum\frac1{n^p}:\quad p>1\text{收敛},\quad p\le1\text{发散}
\\
\lim\frac{a_{n+1}}{a_n}=q<1\Rightarrow\text{收敛},\quad q>1\Rightarrow\text{发散}
\\
\lim\sqrt[n]{a_n}=q<1\Rightarrow\text{收敛},\quad q>1\Rightarrow\text{发散}
\\
0\le a_n\le b_n,\quad \sum b_n\text{收敛}\Rightarrow\sum a_n\text{收敛}
`, "必背", ["级数", "判敛", "比较判别", "比值判别", "根值判别"], "无穷级数判敛、选择填空。", "判敛就是把通项和你认识的标准级数比较。", "先看通项是否趋零；阶乘指数用比值/根值；幂对数用比较/积分；含 \\(1/n^p\\) 直接 p 级数。", "比较判别来自部分和单调有界；比值根值反映指数级衰减。", "\\(\\sum n^2/2^n\\) 用比值判别收敛。", "比值极限等于 1 时无结论，要换比较、积分或 Raabe。"),

  C("linear2-matrix-identity-master", "线性代数", "第2章 矩阵及其运算", "矩阵恒等式", "常用矩阵恒等式速查", raw`
(AB)^T=B^TA^T,\quad (AB)^{-1}=B^{-1}A^{-1}
\\
(A^T)^{-1}=(A^{-1})^T,\quad |AB|=|A||B|
\\
AA^*=A^*A=|A|E
\\
(A^{-1})^*=\frac{A}{|A|}\quad(A\text{可逆})
\\
\operatorname{tr}(AB)=\operatorname{tr}(BA)
`, "常用", ["矩阵", "逆矩阵", "迹", "转置", "伴随矩阵"], "矩阵化简、证明、选择填空。", "矩阵恒等式最怕顺序错，非交换是第一原则。", "转置逆矩阵按反序；伴随矩阵先想到 \\(A A^*=|A|E\\)；迹可循环移位。", "由矩阵乘法定义、逆矩阵定义和行列式性质推出。", "若 A 可逆，则 \\((AB)^{-1}=B^{-1}A^{-1}\\)。", "只有迹里能循环换位，普通矩阵乘积不能随便交换。"),

  C("linear3-solution-structure-master", "线性代数", "第3章 初等变换与线性方程组", "解结构", "线性方程组解结构总表", raw`
Ax=0:\quad \dim\mathcal N(A)=n-r(A)
\\
Ax=b\text{有解}\iff r(A)=r(A,b)
\\
\text{唯一解}\iff r(A)=r(A,b)=n
\\
\text{无穷多解}\iff r(A)=r(A,b)<n
\\
\text{非齐次通解： }x=x_0+c_1\xi_1+\cdots+c_{n-r}\xi_{n-r}
`, "必背", ["方程组", "秩", "基础解系", "通解"], "线性方程组大题、含参讨论。", "方程组的解由一个特解加上齐次解空间组成。", "先增广矩阵行化简；比较 \\(r(A)\\) 与 \\(r(A,b)\\)；有解时写特解加基础解系。", "若 \\(Ax=b\\)，两个解之差满足齐次方程，所以全部解是仿射空间。", "非齐次有唯一解当 \\(r(A)=r(A,b)=n\\)。", "别把非齐次方程的解集说成线性空间；它一般不含零向量。"),

  C("linear5-eigenvalue-shortcuts", "线性代数", "第5章 相似矩阵及二次型", "特征值技巧", "特征值快捷性质表", raw`
A\alpha=\lambda\alpha\Rightarrow A^k\alpha=\lambda^k\alpha
\\
f(A)\alpha=f(\lambda)\alpha
\\
A\text{可逆}\Rightarrow A^{-1}\alpha=\lambda^{-1}\alpha
\\
|A|=\prod\lambda_i,\quad \operatorname{tr}A=\sum\lambda_i
\\
|A-aE|=\prod(\lambda_i-a)
`, "必背", ["特征值", "相似", "矩阵多项式", "行列式"], "特征值选择填空、矩阵高次幂、正定判断。", "特征值会随着矩阵多项式按同一个函数变化。", "A 有特征值 \\(\\lambda\\) 时，\\(f(A)\\) 对应特征值 \\(f(\\lambda)\\)；可逆时 \\(A^{-1}\\) 对应 \\(1/\\lambda\\)。", "若 \\(A\\alpha=\\lambda\\alpha\\)，则 \\(f(A)\\alpha=f(\\lambda)\\alpha\\)。", "A 特征值为 2、3，则 \\(A^2-2A\\) 特征值为 0、3。", "特征值映射保留对应特征向量，但重数和对角化仍需单独判断。", "matrix-transform"),

  C("prob2-distribution-expectation-variance-table", "概率论", "第2章 随机变量及其分布", "分布矩表", "常见分布期望方差总表", raw`
B(n,p):\quad EX=np,\quad DX=np(1-p)
\\
P(\lambda):\quad EX=DX=\lambda
\\
G(p)\ (1\text{起点}):\quad EX=\frac1p,\quad DX=\frac{1-p}{p^2}
\\
U(a,b):\quad EX=\frac{a+b}{2},\quad DX=\frac{(b-a)^2}{12}
\\
N(\mu,\sigma^2):\quad EX=\mu,\quad DX=\sigma^2
\\
E(\lambda):\quad EX=\frac1\lambda,\quad DX=\frac1{\lambda^2}
`, "必背", ["概率分布", "期望", "方差", "二项分布", "正态分布"], "概率大题、参数估计、检验前置。", "每个分布至少要会认形状、参数含义、期望方差。", "看到分布名先写参数范围，再写期望方差；正态线性变换仍正态。", "期望方差可由母函数、积分或独立和性质推出。", "\\(X\\sim B(n,p)\\)，则标准化 \\((X-np)/\\sqrt{np(1-p)}\\) 常用于近似。", "几何分布有从 0 或从 1 开始两种定义，期望方差要配套。", "distribution-plot"),

  C("prob3-two-dimensional-transform-jacobian", "概率论", "第3章 多维随机变量", "变量变换", "二维随机变量变换 Jacobi 模板", raw`
u=u(x,y),\quad v=v(x,y)
\\
f_{U,V}(u,v)=f_{X,Y}(x(u,v),y(u,v))
\left|\frac{\partial(x,y)}{\partial(u,v)}\right|
\\
Z=X+Y:\quad f_Z(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)dx
\\
\text{独立时： }f_{X,Y}=f_Xf_Y
`, "常用", ["二维随机变量", "密度变换", "Jacobi", "卷积"], "连续型二维变量函数分布、和商积变换。", "概率密度换元和重积分换元同源：区域变了，密度乘 Jacobi。", "设 \\((u,v)=T(x,y)\\) 可逆，先求反变换，再乘反变换 Jacobi 绝对值。", "概率守恒要求 \\(f_{U,V}dudv=f_{X,Y}dxdy\\)。", "令 \\(U=X+Y,V=Y\\)，反变换 \\(X=U-V,Y=V\\)，Jacobi 为 1，得到卷积。", "变换不是一一对应时要分片求和；区域限制别漏。"),

  C("prob6-statistic-distribution-route", "概率论", "第6章 数理统计基本概念", "统计量分布", "统计量分布选择路线", raw`
\sigma\text{已知： }Z=\frac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)
\\
\sigma\text{未知正态： }T=\frac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)
\\
\frac{(n-1)S^2}{\sigma^2}\sim\chi^2(n-1)
\\
\frac{S_1^2/\sigma_1^2}{S_2^2/\sigma_2^2}\sim F(n_1-1,n_2-1)
`, "必背", ["数理统计", "抽样分布", "正态总体", "卡方", "t分布", "F分布"], "参数估计和假设检验的分布选择。", "统计题先问：总体是否正态、方差是否已知、样本量多大。", "正态总体均值且方差已知用 Z；方差未知用 t；方差用 \\(\\chi^2\\)；两方差比用 F。", "这些分布来自标准正态样本均值与样本方差的独立性。", "单正态总体 \\(\\sigma\\) 未知时，\\((\\bar X-\\mu)/(S/\\sqrt n)\\sim t(n-1)\\)。", "自由度最容易错：单样本方差是 n-1，两样本合并方差是 \\(n_1+n_2-2\\)。", "distribution-plot"),

  C("prob8-hypothesis-test-route-map", "概率论", "第8章 假设检验", "检验路线", "假设检验解题路线图", raw`
H_0:\theta=\theta_0,\quad H_1:\theta\ne\theta_0
\\
\alpha=P(\text{拒绝 }H_0\mid H_0\text{真})
\\
\beta=P(\text{接受 }H_0\mid H_1\text{真})
\\
\text{双侧： }|Z|>z_{\alpha/2}
\\
\text{右侧： }Z>z_\alpha,\quad \text{左侧： }Z<-z_\alpha
`, "必背", ["假设检验", "拒绝域", "p值", "显著性水平"], "假设检验大题。", "假设检验是在控制一类错误概率下决定是否拒绝原假设。", "先写 \\(H_0,H_1\\)，选统计量，确定拒绝域，代样本值，给结论。", "拒绝域由 \\(H_0\\) 下统计量分布和显著性水平确定。", "双侧 Z 检验在 \\(\\alpha=0.05\\) 时拒绝域常为 \\(|Z|>1.96\\)。", "不能说“接受 \\(H_0\\) 为真”，更稳说“没有充分理由拒绝 \\(H_0\\)”。"),

  C("appendix-common-log-exp-values", "附录速查", "A. 常用数值附录", "对数指数数值", "常用对数指数近似", raw`
e^{-1}\approx0.367879,\quad e^2\approx7.38906,\quad e^3\approx20.0855
\\
\ln2\approx0.693147,\quad \ln3\approx1.098612,\quad \ln5\approx1.609438
\\
\log_{10}2\approx0.3010,\quad \log_{10}3\approx0.4771
\\
e^{0.1}\approx1.10517,\quad e^{0.01}\approx1.01005
`, "常用", ["附录", "常用数值", "对数", "指数", "速查"], "选择填空估算、数量级判断。", "这些数值是估算答案大小的锚点，不是为了替代精确计算。", "选择题比较大小时可用；大题最终答案优先保留 \\(e\\)、\\(\\ln\\)。", "标准数学常数的小数近似。", "\\(e^{-1}\\approx0.368\\)，可快速判断指数衰减量级。", "小数只用于估算；精确题不要把近似写成最终答案。"),

  C("appendix-common-series-values", "附录速查", "A. 常用数值附录", "级数极限数值", "常见级数与极限数值", raw`
\sum_{n=1}^{\infty}\frac1{n^2}=\frac{\pi^2}{6},\quad
\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{n}=\ln2
\\
\sum_{n=0}^{\infty}q^n=\frac1{1-q}\quad(|q|<1)
\\
\sum_{n=1}^{\infty}\frac1{2^n}=1,\quad \lim_{n\to\infty}\sqrt[n]{n}=1
\\
\lim_{n\to\infty}\left(1+\frac an\right)^n=e^a
`, "常用", ["附录", "级数", "极限", "常用数值"], "选择填空、级数 sanity check。", "少数经典级数值能让你快速识别答案。", "看到平方倒数、几何级数、交错调和先联想标准值。", "来自 Fourier、Taylor、几何级数或经典 Euler 结果。", "\\(\\sum_{n=1}^{\\infty}1/2^n=1\\)。", "不是所有相似级数都有闭式；别硬套到不同下标或不同幂。"),

  C("appendix-common-factorials-combinations", "附录速查", "A. 常用数值附录", "组合数", "小阶阶乘与组合数速查", raw`
0!=1,\quad 1!=1,\quad 2!=2,\quad 3!=6,\quad 4!=24,\quad 5!=120,\quad 6!=720
\\
\binom52=10,\quad \binom63=20,\quad \binom82=28,\quad \binom83=56
\\
\binom{10}{2}=45,\quad \binom{10}{3}=120
\\
\binom nk=\binom n{n-k}
`, "常用", ["附录", "组合数", "阶乘", "概率"], "概率古典概型、二项分布、组合估算。", "小阶阶乘组合数熟一点，概率题会快很多。", "抽样计数时先定模型，再查小阶组合数避免算术拖慢。", "阶乘和组合数由排列计数定义得到。", "\\(\\binom{10}{3}=120\\)，抽样题很常见。", "组合数对称 \\(\\binom nk=\\binom n{n-k}\\)，取较小 k 算更快。")

,

  C("calc2-parametric-implicit-derivative-table", "高等数学", "第2章 导数与微分", "参数隐函数", "参数方程与隐函数求导总表", raw`
y=y(x):\quad F(x,y)=0\Rightarrow y'=-\frac{F_x}{F_y}
\\
y''=-\frac{F_{xx}+2F_{xy}y'+F_{yy}(y')^2}{F_y}
\\
x=x(t),\ y=y(t):\quad \frac{dy}{dx}=\frac{y'}{x'},\quad
\frac{d^2y}{dx^2}=\frac{x'y''-y'x''}{(x')^3}
\\
\rho=\sqrt{x^2+y^2}:\quad \frac{dy}{dx}=\frac{\rho'\sin\theta+\rho\cos\theta}{\rho'\cos\theta-\rho\sin\theta}
`, "必背", ["导数", "隐函数", "参数方程", "极坐标"], "隐函数、参数曲线、极坐标曲线斜率。", "复杂曲线不一定要解出 y，直接沿约束或参数求变化率。", "隐函数先对 x 求导；参数方程先对 t 求导再相除；二阶导要再除一次 \\(x'\\)。", "链式法则给 \\(F_x+F_y y'=0\\)；参数式中 \\(dy/dx=(dy/dt)/(dx/dt)\\)。", "圆 \\(x^2+y^2=1\\) 有 \\(y'=-x/y\\)。", "二阶参数导数最容易漏除 \\(x'\\)；要求 \\(F_y\\ne0,x'\ne0\\)。", "tangent-line"),

  C("calc3-inequality-proof-route-map", "高等数学", "第3章 微分中值定理与导数应用", "不等式证明", "导数证明不等式路线图", raw`
f(x)\ge0:\quad \text{常令 }f=\text{左边}-\text{右边}
\\
f'(x)\ge0\Rightarrow f(x)\ge f(a)
\\
f''(x)\ge0\Rightarrow f'\text{递增},\ f\text{凸}
\\
\text{含 }e^x,\ln x,\sin x:\quad \text{常用 Taylor 余项或凸性}
\\
\text{双变量不等式：固定一元或用均值定理}
`, "必背", ["导数应用", "不等式", "中值定理", "凸性"], "高数证明题、选择填空比较大小。", "导数证明不等式的核心是把大小关系转成函数单调或凸性。", "先移项造函数，再找等号点，最后用导数符号或 Taylor 余项证明。", "单调性来自一阶导符号，凸性来自二阶导符号，中值定理连接差值与导数。", "证 \\(e^x\ge1+x\\)，令 \\(f=e^x-1-x\\)，\\(f'(x)=e^x-1\\)，\\(f(0)=0\\)。", "不要只验证几个点；证明题必须覆盖整个定义区间。"),

  C("calc4-trig-integral-route-map-expanded", "高等数学", "第4章 不定积分", "三角积分路线", "三角积分路线图完整版", raw`
\int\sin^m x\cos^n xdx:
\begin{cases}
m\text{奇}:&\text{留一 }\sin x\text{，其余化 }\cos x\\
n\text{奇}:&\text{留一 }\cos x\text{，其余化 }\sin x\\
m,n\text{偶}:&\text{降幂}\\
\end{cases}
\\
\int R(\tan x)dx:\quad u=\tan x
\\
\int R(\sin x,\cos x)dx:\quad t=\tan\frac x2
\\
\int\sin ax\cos bx\,dx:\quad \text{积化和差}
`, "必背", ["积分", "三角积分", "万能代换", "降幂"], "三角不定积分、定积分、Fourier 前置。", "三角积分先识别奇偶和乘积结构，路线选对会少算很多。", "奇次留一个凑微分；偶次降幂；有理式用万能代换；不同频率乘积用积化和差。", "这些都来自 \\(\\sin^2+\cos^2=1\\)、二倍角和半角正切代换。", "\\(\\int\\sin^3x\cos^2xdx\\) 留 \\(\\sin xdx\\)，其余化 \\(1-\cos^2x\\)。", "万能代换稳但长，能用奇偶或降幂时优先简单方法。", "unit-circle"),

  C("calc4-root-substitution-route-map", "高等数学", "第4章 不定积分", "根式代换", "根式积分代换路线图", raw`
\sqrt{a^2-x^2}:\quad x=a\sin t
\\
\sqrt{a^2+x^2}:\quad x=a\tan t\quad\text{或}\quad x=a\sinh t
\\
\sqrt{x^2-a^2}:\quad x=a\sec t\quad\text{或}\quad x=a\cosh t
\\
\sqrt{ax+b}:\quad u=\sqrt{ax+b}
\\
\sqrt{\frac{ax+b}{cx+d}}:\quad u^2=\frac{ax+b}{cx+d}
`, "常用", ["积分", "根式", "三角代换", "Euler代换"], "含根式积分、反常积分化简。", "根式代换的目的，是把根号变成三角恒等式或新变量平方。", "先看根式类型：二次根式用三角/双曲，线性根式直接设根号，分式根式平方化。", "代换后根号由恒等式化为简单函数，再转成有理或三角积分。", "\\(\\sqrt{1-x^2}\\) 令 \\(x=\sin t\\)，根号变 \\(\\cos t\\)。", "定积分换元必须同步换上下限；三角代换要选好区间避免绝对值。"),

  C("calc5-improper-integral-comparison-route", "高等数学", "第5章 定积分", "反常积分", "反常积分判敛路线图", raw`
\int_1^\infty\frac{dx}{x^p}:\quad p>1\text{收敛},\ p\le1\text{发散}
\\
\int_0^1\frac{dx}{x^p}:\quad p<1\text{收敛},\ p\ge1\text{发散}
\\
0\le f\le g,\ \int g\text{收敛}\Rightarrow\int f\text{收敛}
\\
\lim\frac{f}{g}=c\in(0,\infty)\Rightarrow f,g\text{同敛散}
\\
\int_a^\infty f\text{绝对收敛}\Rightarrow \int_a^\infty f\text{收敛}
`, "必背", ["反常积分", "判敛", "比较判别", "p积分"], "反常积分判敛、级数类比。", "反常积分判敛就是在奇点或无穷远比较它像哪个 p 积分。", "先找问题点；无穷远看衰减阶，有限奇点看爆炸阶；振荡项再想 Dirichlet。", "比较判别来自积分保序，极限比较来自同阶等价。", "\\(\\int_1^\infty dx/(x\ln^2x)\\) 可令 \\(u=\ln x\\)，收敛。", "必须逐个问题点检查；只看一个端点可能漏掉另一个发散点。"),

  C("calc6-physical-application-formulas", "高等数学", "第6章 定积分应用", "物理应用", "定积分物理应用公式表", raw`
\text{变力做功： }W=\int_a^b F(x)dx
\\
\text{液体压力： }F=\rho g\int_a^b h(y)w(y)dy
\\
\text{质心： }\bar x=\frac1M\int x\,dm,\quad \bar y=\frac1M\int y\,dm
\\
\text{平面薄片： }M=\iint_D\rho(x,y)dA
\\
\text{弧长线密度： }M=\int_C\rho\,ds
`, "常用", ["定积分应用", "物理应用", "质心", "功", "压力"], "定积分应用大题、建模题。", "物理应用就是把小块贡献写出来再累加。", "先选微元：长度、面积或体积；写小量 \\(dW,dF,dm\\)，再确定积分区间。", "定积分定义就是把微小贡献求和取极限。", "弹簧力 \\(F=kx\\)，从 0 拉到 a 的功为 \\(ka^2/2\\)。", "最容易错的是单位、坐标方向和液体深度 h 的表达。"),

  C("calc9-directional-gradient-extrema", "高等数学", "第9章 多元函数微分法及应用", "方向导数", "方向导数与梯度最值", raw`
\frac{\partial f}{\partial l}=\nabla f\cdot e
\\
\max_{\|e\|=1}\frac{\partial f}{\partial l}=|\nabla f|,\quad
\min_{\|e\|=1}\frac{\partial f}{\partial l}=-|\nabla f|
\\
\text{最速上升方向： }e=\frac{\nabla f}{|\nabla f|}
\\
\nabla f\perp \text{等值面 }f(x,y,z)=c
`, "必背", ["多元微分", "方向导数", "梯度", "等值面"], "多元函数几何意义、选择填空。", "梯度不仅是偏导数组，它指向函数增长最快的方向。", "方向导数题先单位化方向向量，再与梯度点乘；问最大值直接取梯度模。", "由全微分 \\(df=\nabla f\cdot dr\\) 和 Cauchy-Schwarz 不等式得到。", "\\(f=x^2+y^2\\) 在 \\((1,2)\\) 的最速上升方向为 \\((1,2)/\\sqrt5\\)。", "方向向量必须是单位向量；零梯度点没有唯一最速方向。"),

  C("calc10-triple-integral-coordinate-choice", "高等数学", "第10章 重积分", "三重积分坐标", "三重积分坐标选择路线", raw`
\text{柱坐标： }x=r\cos\theta,\ y=r\sin\theta,\ z=z,\quad dV=rdrd\theta dz
\\
\text{球坐标： }x=\rho\sin\varphi\cos\theta,\ y=\rho\sin\varphi\sin\theta,\ z=\rho\cos\varphi
\\
dV=\rho^2\sin\varphi\,d\rho d\varphi d\theta
\\
\text{旋转体/圆柱面：柱坐标；球/锥/距离原点：球坐标}
`, "必背", ["三重积分", "柱坐标", "球坐标", "坐标选择"], "三重积分计算、体积与质量。", "坐标系选择就是让区域边界和被积函数同时简单。", "看到 \\(x^2+y^2\\) 用柱坐标；看到 \\(x^2+y^2+z^2\\) 用球坐标；先画投影再定限。", "Jacobi 来自体积微元的缩放：柱坐标多一个 r，球坐标多 \\(\\rho^2\\sin\\varphi\\)。", "球 \\(x^2+y^2+z^2\le a^2\\) 用 \\(0\le\rho\le a\\)。", "球坐标的 \\(\\varphi\\) 通常从正 z 轴量起，别和教材其他约定混。"),

  C("calc12-alternating-and-conditional-series", "高等数学", "第12章 无穷级数", "交错级数", "交错级数与条件收敛速查", raw`
a_n\downarrow0,\ a_n\ge0\Rightarrow \sum(-1)^{n-1}a_n\text{收敛}
\\
R_n=\left|\sum_{k=n+1}^{\infty}(-1)^{k-1}a_k\right|\le a_{n+1}
\\
\sum |a_n|\text{收敛}\Rightarrow \sum a_n\text{绝对收敛}
\\
\sum a_n\text{收敛但}\sum |a_n|\text{发散}\Rightarrow \text{条件收敛}
`, "必背", ["级数", "交错级数", "Leibniz", "条件收敛"], "交错级数判敛与误差估计。", "交错级数靠正负抵消收敛，误差不超过下一项。", "先看绝对收敛；不绝对时再看交错项是否单调趋零。", "部分和奇偶子列夹逼到同一极限，余项被下一项控制。", "\\(\\sum(-1)^{n-1}/n\\) 条件收敛，余项不超过下一项。", "Leibniz 要求单调趋零；只趋零不够。"),

  C("linear1-special-determinant-expanded", "线性代数", "第1章 行列式", "特殊行列式", "常见特殊行列式扩展表", raw`
\begin{vmatrix}a&b\\c&d\end{vmatrix}=ad-bc
\\
\begin{vmatrix}a&b&b\\b&a&b\\b&b&a\end{vmatrix}=(a-b)^2(a+2b)
\\
\begin{vmatrix}1&1&1\\a&b&c\\a^2&b^2&c^2\end{vmatrix}=(b-a)(c-a)(c-b)
\\
\left|\operatorname{diag}(d_1,\dots,d_n)\right|=\prod d_i
\\
\begin{vmatrix}A&B\\0&D\end{vmatrix}=|A||D|
`, "常用", ["行列式", "特殊行列式", "Vandermonde", "分块"], "选择填空、参数行列式、结构化行列式。", "特殊行列式要靠结构识别，不要硬展开。", "常数对角加常数非对角看特征值；幂次列看 Vandermonde；分块三角直接乘。", "这些公式分别来自二三阶展开、特征值、Vandermonde 行列式和分块三角性质。", "\\(a,b,c\\) 两个相等时 Vandermonde 行列式为 0，和公式一致。", "特殊公式必须结构完全匹配；行列顺序改变会影响符号。"),

  C("linear4-linear-dependence-route-map", "线性代数", "第4章 向量组线性相关性", "相关性路线", "向量组线性相关判定路线图", raw`
\alpha_1,\dots,\alpha_s\text{相关}\iff \exists k_i\text{不全为0},\ \sum k_i\alpha_i=0
\\
s>n\Rightarrow s\text{个 }n\text{维向量必相关}
\\
r(\alpha_1,\dots,\alpha_s)<s\Rightarrow \text{相关}
\\
\text{一个向量可由其余向量线性表示}\Rightarrow\text{相关}
\\
\text{齐次方程 }Ax=0\text{有非零解}\iff A\text{列向量相关}
`, "必背", ["向量组", "线性相关", "秩", "方程组"], "向量组证明、方程组、抽象线代。", "线性相关就是存在非平凡组合把信息抵消成零。", "数字向量用行化简看秩；抽象题用定义、表示关系和维数判断。", "秩等于极大无关组个数；若向量数超过秩，就必有冗余。", "三个二维向量一定线性相关。", "零向量加入任何向量组都会相关；不要忘记“系数不全为 0”。"),

  C("linear5-positive-semidefinite-table", "线性代数", "第5章 相似矩阵及二次型", "半正定", "正定半正定判别对照表", raw`
A\succ0\iff x^TAx>0\ (x\ne0)\iff \lambda_i>0\iff \Delta_k>0
\\
A\succeq0\iff x^TAx\ge0\iff \lambda_i\ge0
\\
A\succeq0\Rightarrow |A|\ge0,\quad a_{ii}\ge0
\\
A=B^TB\Rightarrow A\succeq0
\\
A\succ0\Rightarrow A^{-1}\succ0
`, "常用", ["二次型", "正定", "半正定", "特征值"], "二次型判别、矩阵证明、选择填空。", "正定是所有方向都向上，半正定允许某些方向平。", "实对称矩阵先看特征值；正定也可用顺序主子式；半正定要看所有主子式或特征值。", "正交对角化后 \\(x^TAx\\) 变成特征值加权平方和。", "\\(A^TA\\) 总是半正定，因为 \\(x^TA^TAx=|Ax|^2\\ge0\\)。", "半正定不能只看顺序主子式非负，通常需所有主子式或特征值。", "matrix-transform"),

  C("prob1-conditional-independence-warnings", "概率论", "第1章 随机事件与概率", "条件独立", "独立、互斥与条件概率易错表", raw`
A,B\text{独立}\iff P(AB)=P(A)P(B)
\\
A,B\text{互斥}\iff AB=\varnothing
\\
P(A\mid B)=\frac{P(AB)}{P(B)}
\\
A,B\text{独立}\Rightarrow P(A\mid B)=P(A)\quad(P(B)>0)
\\
\text{互斥且 }P(A)P(B)>0\Rightarrow \text{不独立}
`, "必背", ["概率", "独立", "互斥", "条件概率", "易错点"], "事件概率选择填空、全概率 Bayes 前置。", "独立说互不影响，互斥说不能同时发生；这两个概念几乎相反。", "看到“已知 B 发生”就写条件概率；看到“互不影响”才用乘法。", "由条件概率定义可直接推出独立的等价式。", "掷骰子中 A=偶数，B=大于3，二者不互斥且可检验是否独立。", "互斥事件若概率都正，就一定不独立；别把互斥当独立。"),

  C("prob4-covariance-correlation-table", "概率论", "第4章 数字特征", "协方差相关", "协方差与相关系数公式表", raw`
\operatorname{Cov}(X,Y)=E(XY)-EXEY
\\
D(X\pm Y)=DX+DY\pm2\operatorname{Cov}(X,Y)
\\
\rho_{XY}=\frac{\operatorname{Cov}(X,Y)}{\sqrt{DX\,DY}},\quad |\rho_{XY}|\le1
\\
X,Y\text{独立}\Rightarrow \operatorname{Cov}(X,Y)=0
\\
\rho=\pm1\iff Y=aX+b\text{几乎处处成立}
`, "必背", ["数字特征", "协方差", "相关系数", "独立"], "二维随机变量数字特征、线性组合方差。", "协方差看同向变化，相关系数是标准化后的协方差。", "求线性组合方差时先写协方差项；独立时协方差为 0。", "公式由方差定义展开平方得到；相关系数界来自 Cauchy-Schwarz。", "若 \\(X,Y\\) 独立，则 \\(D(X+Y)=DX+DY\\)。", "不相关不一定独立，只有正态等特殊情形才可加强。"),

  C("prob7-confidence-interval-route-map", "概率论", "第7章 参数估计", "置信区间路线", "置信区间选公式路线图", raw`
\sigma\text{已知： }\bar X\pm z_{\alpha/2}\frac{\sigma}{\sqrt n}
\\
\sigma\text{未知正态： }\bar X\pm t_{\alpha/2}(n-1)\frac{S}{\sqrt n}
\\
\sigma^2\text{区间： }\left(\frac{(n-1)S^2}{\chi^2_{\alpha/2}},
\frac{(n-1)S^2}{\chi^2_{1-\alpha/2}}\right)
\\
\text{大样本比例： }\hat p\pm z_{\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}n}
`, "必背", ["置信区间", "参数估计", "正态总体", "比例"], "参数估计大题、统计推断。", "置信区间的核心是先找包含参数的枢轴量，再反解参数。", "先判断估计对象：均值、方差或比例；再判断方差已知与总体正态性。", "枢轴量分布不含未知参数，所以可用分位数夹住。", "95% 且 \\(\\sigma\\) 已知时，常用 \\(\\bar X\\pm1.96\sigma/\sqrt n\\)。", "卡方区间左右分位数顺序容易反；教材若用上侧分位数要换写法。", "distribution-plot"),

  C("appendix-common-greek-symbols", "附录速查", "A. 常用数值附录", "符号速查", "常见希腊字母与统计符号", raw`
\alpha:\text{显著性水平/参数},\quad \beta:\text{第二类错误/参数}
\\
\mu:\text{均值},\quad \sigma^2:\text{方差},\quad \lambda:\text{特征值/Poisson 参数}
\\
\theta:\text{参数/角度},\quad \rho:\text{相关系数/极径}
\\
\Phi:\text{标准正态分布函数},\quad \Gamma:\text{Gamma 函数}
`, "了解", ["附录", "符号", "概率", "线代"], "读题、查表、统计公式理解。", "同一个希腊字母在不同章节含义不同，读公式时先看语境。", "概率统计优先按参数解释；线代看到 \\(\\lambda\\) 多半是特征值；高数看到 \\(\\theta\\) 多半是角。", "这些是教材常见记号约定，不是数学对象的唯一命名。", "\\(\\lambda\\) 在 \\(A\alpha=\lambda\alpha\\) 中是特征值，在 Poisson 分布中是强度参数。", "不要只凭字母判断含义，一定结合章节和题目说明。")

,

  C("calc1-higher-order-equivalent-master", "高等数学", "第1章 函数与极限", "高阶等价", "高阶无穷小等价全表", raw`
e^x-1-x\sim\frac{x^2}{2},\quad e^x-1-x-\frac{x^2}{2}\sim\frac{x^3}{6}
\\
\ln(1+x)-x\sim-\frac{x^2}{2},\quad \ln(1+x)-x+\frac{x^2}{2}\sim\frac{x^3}{3}
\\
\sin x-x\sim-\frac{x^3}{6},\quad x-\arctan x\sim\frac{x^3}{3}
\\
\tan x-x\sim\frac{x^3}{3},\quad \arcsin x-x\sim\frac{x^3}{6}
\\
\cos x-1+\frac{x^2}{2}\sim\frac{x^4}{24}
`, "必背", ["极限", "等价无穷小", "Taylor", "高阶小量"], "加减抵消型极限、含参数极限、选择填空。", "一阶主项被消掉时，高阶等价就是新的主角。", "看到 \\(e^x-1-x\\)、\\(\\sin x-x\\)、\\(\\tan x-x\\) 这类差值，直接跳到对应高阶主项。", "由 Maclaurin 展开保留首个未抵消项得到。", "\\(\\lim_{x\\to0}\\frac{\\tan x-x}{x^3}=1/3\\)。", "这些公式都默认 \\(x\\to0\\) 且使用弧度制；角度制会全错。", "taylor-plot"),

  C("calc1-mixed-composite-equivalent-table", "高等数学", "第1章 函数与极限", "复合等价", "混合复合无穷小等价表", raw`
\ln(1+\sin x)\sim x
\\
e^{\tan x}-1\sim x
\\
1-\cos(\ln(1+x))\sim\frac{x^2}{2}
\\
\sqrt{1+\sin x}-1\sim\frac{x}{2}
\\
(1+\tan x)^\alpha-1\sim\alpha x
`, "常用", ["极限", "复合函数", "等价无穷小", "考研技巧"], "复合函数极限、选择填空快速识别。", "复合小量先看最内层趋不趋零，再一层层替换主项。", "先设 \\(u\\) 为内层小量；外层套标准等价；最后把 \\(u\\) 换回 x 的主项。", "若 \\(u(x)\\to0\\)，标准等价对 u 成立；再由 u 与 x 的关系合成。", "\\(1-\cos(\\ln(1+x))\\sim(\\ln(1+x))^2/2\\sim x^2/2\\)。", "内层如果不趋 0，不能套小量等价；尤其 \\(\\sin(1/x)\\) 不是小量。", "limit-slider"),

  C("calc1-infinity-equivalent-master", "高等数学", "第1章 函数与极限", "无穷远等价", "无穷远等价与主项表", raw`
x\to\infty:\quad \ln(x+a)\sim\ln x,\quad (x+a)^\alpha\sim x^\alpha
\\
\sqrt{x^2+ax+b}=x+\frac a2+O\left(\frac1x\right)\quad(x\to+\infty)
\\
\sqrt{x^2+ax+b}-x\to\frac a2
\\
\ln(x+a)-\ln x\sim\frac ax
\\
(x+a)^\alpha-x^\alpha\sim\alpha a x^{\alpha-1}
`, "必背", ["极限", "无穷远", "主项", "有理化"], "无穷远极限、根式差、对数差、幂差。", "无穷远极限先提最大尺度，再看剩下的微小修正。", "根式差先有理化或写成 \\(x\\sqrt{1+u}\\)；对数差合并成 \\(\\ln(1+a/x)\\)。", "把无穷远问题转成 \\(u=1/x\\to0\\) 后用 Taylor。", "\\(\\sqrt{x^2+4x+1}-x\\to2\\)。", "公式默认 \\(x\\to+\infty\\)；若 \\(x\\to-\infty\\)，\\(\\sqrt{x^2}=|x|=-x\\)。"),

  C("calc1-nth-root-equivalent-table", "高等数学", "第1章 函数与极限", "n次根", "n 次根与指数型数列极限", raw`
\sqrt[n]{a}\to1\quad(a>0)
\\
\sqrt[n]{n^\alpha}\to1,\quad \sqrt[n]{a^n+b^n}\to\max(a,b)\quad(a,b>0)
\\
\left(1+\frac{x_n}{n}\right)^n\to e^a\quad(x_n\to a)
\\
n\left(\sqrt[n]{a}-1\right)\to\ln a\quad(a>0)
\\
n\left(\sqrt[n]{n}-1\right)\sim\ln n
`, "常用", ["数列极限", "n次根", "指数极限", "等价"], "数列极限、选择填空、根式指数型。", "n 次根会把固定或多项式增长压到 1，指数增长留下底数。", "看到 \\(\\sqrt[n]{}\\) 先取对数；看到 \\((1+u_n)^n\\) 先看 \\(nu_n\\)。", "取对数后用 \\(e^{\ln a/n}\\) 和 \\(e^u-1\\sim u\\)。", "\\(n(\\sqrt[n]{2}-1)\\to\\ln2\\)。", "\\(a,b\\) 若有负数或符号变化，要先确认 n 次根是否有定义。"),

  C("calc1-equivalent-substitution-trigger-words", "高等数学", "第1章 函数与极限", "极限触发器", "极限题触发关键词对照表", raw`
\text{根式差}\Rightarrow\text{有理化}
\\
\text{幂指型}\Rightarrow\text{取对数}
\\
\text{加减抵消}\Rightarrow\text{Taylor 到首个非零项}
\\
\text{振荡}\cdot\text{小量}\Rightarrow\text{夹逼}
\\
\text{数列求和}\Rightarrow\text{积分估计/Riemann 和/Stolz}
`, "必背", ["极限", "解题思路", "考研技巧", "触发器"], "考研极限题第一步判断。", "极限题不是随机选工具，而是由结构触发工具。", "先识别题眼：根式、幂指、抵消、振荡、求和，再选对应套路。", "每个触发器背后都是把复杂对象改写成可比较主项。", "\\(\\sqrt{x^2+x}-x\\) 看到根式差，先有理化。", "不要一看 0/0 就洛必达；结构明显时，代数化简或 Taylor 往往更稳。", "limit-slider"),

  C("pre-trig-allied-angle-table", "前置基础", "0. 前置基础", "诱导公式", "同角、补角、余角、负角速查", raw`
\sin(-x)=-\sin x,\quad \cos(-x)=\cos x,\quad \tan(-x)=-\tan x
\\
\sin(\pi-x)=\sin x,\quad \cos(\pi-x)=-\cos x,\quad \tan(\pi-x)=-\tan x
\\
\sin(\pi+x)=-\sin x,\quad \cos(\pi+x)=-\cos x,\quad \tan(\pi+x)=\tan x
\\
\sin\left(\frac{\pi}{2}-x\right)=\cos x,\quad
\cos\left(\frac{\pi}{2}-x\right)=\sin x
\\
\tan\left(\frac{\pi}{2}-x\right)=\cot x
`, "必背", ["三角", "诱导公式", "余角", "象限"], "三角化简、特殊角、积分换元。", "诱导公式就是把角拉回熟悉区间，同时按象限改符号。", "先化到第一象限参考角，再按原角所在象限定正负。", "由单位圆坐标对称性直接得到。", "\\(\\cos(\\pi-x)=-\\cos x\\)。", "不要死背口号忘了函数奇偶性；正负号用单位圆检查最稳。", "unit-circle"),

  C("pre-trig-exact-values-18-36-72", "前置基础", "0. 前置基础", "特殊角", "18°、36°、72° 精确三角值", raw`
\sin18^\circ=\frac{\sqrt5-1}{4},\quad
\cos36^\circ=\frac{\sqrt5+1}{4}
\\
\cos72^\circ=\frac{\sqrt5-1}{4},\quad
\sin54^\circ=\frac{\sqrt5+1}{4}
\\
\sin36^\circ=\frac{\sqrt{10-2\sqrt5}}{4},\quad
\cos18^\circ=\frac{\sqrt{10+2\sqrt5}}{4}
\\
\tan36^\circ=\sqrt{5-2\sqrt5},\quad
\tan72^\circ=\sqrt{5+2\sqrt5}
`, "了解", ["三角", "特殊角", "常用数值", "冷门技巧"], "选择填空、几何三角、特殊值检验。", "18°/36° 系列来自五边形和黄金比例，冷门但偶尔能秒杀特殊角。", "选择填空出现 18、36、54、72 度时可查；大题一般不强制背。", "可由 \\(\\cos36^\circ\\) 满足黄金比例方程或五倍角公式推出。", "\\(\\sin18^\circ=(\\sqrt5-1)/4\\)。", "优先背 15、30、45、60、75 度；这组属于加分速查，不要喧宾夺主。", "unit-circle"),

  C("pre-trig-tangent-sum-product-table", "前置基础", "0. 前置基础", "正切恒等式", "tan/cot 和差积商常用表", raw`
\tan x+\tan y=\frac{\sin(x+y)}{\cos x\cos y}
\\
\tan x-\tan y=\frac{\sin(x-y)}{\cos x\cos y}
\\
\cot x+\cot y=\frac{\sin(x+y)}{\sin x\sin y}
\\
\tan x\tan y=\frac{\cos(x-y)-\cos(x+y)}{\cos(x-y)+\cos(x+y)}
\\
\tan x+\cot x=\frac{2}{\sin2x}
`, "常用", ["三角", "正切", "余切", "化简"], "三角方程、化简、积分前置。", "正切余切题常把分母统一到 sin/cos 后变成和差角。", "看到 \\(\\tan x\\pm\\tan y\\) 先转成正弦和差；看到 \\(\\tan x+\cot x\\) 直接化 \\(2/\\sin2x\\)。", "由 \\(\\tan x=\\sin x/\\cos x\\) 通分和和差角公式得到。", "\\(\\tan x+\cot x=1/(\\sin x\\cos x)=2/\\sin2x\\)。", "所有公式都要求分母不为 0；方程变形时要保留定义域限制。", "unit-circle"),

  C("pre-trig-maximum-minimum-identities", "前置基础", "0. 前置基础", "三角最值", "三角最值与范围常用模板", raw`
a\sin x+b\cos x=R\sin(x+\varphi),\quad R=\sqrt{a^2+b^2}
\\
-R\le a\sin x+b\cos x\le R
\\
\sin x+\cos x\in[-\sqrt2,\sqrt2]
\\
\sin x\cos x\in\left[-\frac12,\frac12\right]
\\
\sin^2x+\cos^2x=1,\quad \sin^2x\cos^2x\le\frac14
`, "必背", ["三角", "最值", "范围", "辅助角"], "三角函数最值、参数范围、不等式。", "三角最值本质是把线性组合看成一个投影，长度就是最大振幅。", "线性组合用辅助角；含 \\(\\sin x\cos x\\) 用 \\(\\sin2x/2\\)；含平方用基本恒等式。", "由 Cauchy-Schwarz 或辅助角公式得到最大振幅。", "\\(3\\sin x+4\\cos x\\in[-5,5]\\)。", "如果 x 有区间限制，不能直接套全局最值，需结合区间端点。", "unit-circle"),

  C("pre-trig-integral-average-more-values", "前置基础", "0. 前置基础", "三角平均", "更多三角周期平均值", raw`
\frac1{2\pi}\int_0^{2\pi}\sin^{2m}x\,dx
=\frac{(2m)!}{2^{2m}(m!)^2}
\\
\frac1{2\pi}\int_0^{2\pi}\sin^{2m+1}x\,dx=0
\\
\frac1{2\pi}\int_0^{2\pi}\sin^2x\cos^2x\,dx=\frac18
\\
\frac1{2\pi}\int_0^{2\pi}\sin^4x\,dx=\frac38
\\
\frac1{2\pi}\int_0^{2\pi}\sin^6x\,dx=\frac5{16}
`, "常用", ["三角", "定积分", "周期平均", "Wallis"], "完整周期三角幂积分、选择填空。", "周期平均值是高次三角积分的速查表。", "完整周期上先看奇偶抵消；偶次幂查平均值或用 Wallis/降幂。", "由降幂公式或 Wallis 公式得到。", "\\(\\int_0^{2\\pi}\\sin^6x dx=5\\pi/8\\)。", "区间不是完整周期时不能直接套平均值。", "wallis-recursion"),

  C("pre-trig-equation-solution-tips", "前置基础", "0. 前置基础", "三角方程", "三角方程解题技巧表", raw`
\sin x=a:\quad x=k\pi+(-1)^k\arcsin a
\\
\cos x=a:\quad x=2k\pi\pm\arccos a
\\
\tan x=a:\quad x=k\pi+\arctan a
\\
a\sin x+b\cos x=c:\quad R\sin(x+\varphi)=c,\ |c|\le R
\\
\sin A=\sin B\Rightarrow A=B+2k\pi\text{ 或 }A=\pi-B+2k\pi
`, "必背", ["三角", "三角方程", "通解", "辅助角"], "三角方程、参数范围、选择填空。", "三角方程要写全周期解，别只写主值。", "先统一函数和角；线性组合先辅助角；最后写通解并检查定义域。", "三角函数周期性和对称性给出全部解。", "\\(\\sin x=1/2\\Rightarrow x=k\\pi+(-1)^k\\pi/6\\)。", "反三角函数只给主值，不等于三角方程全部解。", "unit-circle"),

  C("pre-inverse-trig-derivative-integral-table", "前置基础", "0. 前置基础", "反三角函数", "反三角导数积分速查", raw`
(\arcsin x)'=\frac1{\sqrt{1-x^2}},\quad
(\arccos x)'=-\frac1{\sqrt{1-x^2}}
\\
(\arctan x)'=\frac1{1+x^2},\quad
(\operatorname{arccot}x)'=-\frac1{1+x^2}
\\
\int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac xa+C
\\
\int\frac{dx}{a^2+x^2}=\frac1a\arctan\frac xa+C
\\
\int\frac{dx}{x^2-a^2}=\frac1{2a}\ln\left|\frac{x-a}{x+a}\right|+C
`, "必背", ["反三角", "导数", "积分", "积分表"], "反三角求导、根式积分、积分结果识别。", "反三角函数是根式和二次分母积分的天然结果。", "看到 \\(1+x^2\\) 想 arctan；看到 \\(a^2-x^2\\) 根式想 arcsin。", "由反函数求导和三角代换推出。", "\\(\\int dx/(4+x^2)=\\frac12\\arctan(x/2)+C\\)。", "不同教材对 arccot 主值约定可能不同；积分常用 arctan 更稳。"),

  C("appendix-common-fraction-decimal-percent", "附录速查", "A. 常用数值附录", "分数小数", "常用分数小数百分数速查", raw`
\frac13=0.3333,\quad \frac23=0.6667,\quad \frac14=0.25,\quad \frac34=0.75
\\
\frac16=0.1667,\quad \frac56=0.8333,\quad \frac18=0.125,\quad \frac38=0.375
\\
\frac58=0.625,\quad \frac78=0.875,\quad \frac1{12}=0.0833
\\
\frac1{16}=0.0625,\quad \frac1{20}=0.05,\quad \frac1{25}=0.04
`, "常用", ["附录", "常用数值", "小数", "估算"], "选择填空估算、概率比例、数值检查。", "简单小数能帮你快速排除明显错误答案。", "选择题估算、概率比例、统计显著性水平换算时查；大题保留分数。", "这些是常用有理数的小数表示。", "\\(3/8=0.375\\)，常见于组合概率估算。", "近似值只用于判断量级，精确计算仍用分数。"),

  C("appendix-common-square-cube-values", "附录速查", "A. 常用数值附录", "幂表", "常用平方立方与根号近似", raw`
11^2=121,\quad 12^2=144,\quad 13^2=169,\quad 14^2=196,\quad 15^2=225
\\
2^5=32,\quad 2^{10}=1024,\quad 3^4=81,\quad 5^3=125
\\
\sqrt6\approx2.449,\quad \sqrt7\approx2.646,\quad \sqrt8\approx2.828
\\
\sqrt{10}\approx3.162,\quad \sqrt{0.5}\approx0.707
`, "常用", ["附录", "常用数值", "平方", "根号"], "选择填空估算、根式比较。", "熟悉平方和根号近似，可以让数值型选项更快落位。", "比较大小、估算标准差、概率密度量级时查；精确题仍保留根式。", "这些是整数幂与平方根的常用近似。", "\\(2^{10}=1024\\approx10^3\\)，估算指数增长很方便。", "不要把近似值带入需要精确证明的题。"),

  C("appendix-common-t-distribution-critical-lite", "附录速查", "A. 常用数值附录", "统计临界值", "常用 t 分布临界值粗表", raw`
t_{0.025}(5)\approx2.571,\quad t_{0.025}(10)\approx2.228
\\
t_{0.025}(20)\approx2.086,\quad t_{0.025}(30)\approx2.042
\\
t_{0.05}(10)\approx1.812,\quad t_{0.05}(20)\approx1.725
\\
n\to\infty:\quad t_{\alpha}(n)\to z_{\alpha}
`, "了解", ["附录", "统计", "t分布", "临界值"], "统计选择填空、置信区间量级检查。", "t 分布自由度越大越接近标准正态，小样本临界值更大。", "正式考试一般给表；这里用于量级判断和错题复盘。", "t 分布由标准正态除以独立卡方均方根得到，自由度增大时趋近正态。", "双侧 95% 且自由度 10 时，临界值约 2.228。", "不同教材使用上侧分位数记号，先确认 \\(t_\\alpha(n)\\) 含义。", "distribution-plot"),

  C("appendix-common-chi-square-critical-lite", "附录速查", "A. 常用数值附录", "统计临界值", "常用 χ² 分布临界值粗表", raw`
\chi^2_{0.025}(5)\approx12.833,\quad \chi^2_{0.975}(5)\approx0.831
\\
\chi^2_{0.025}(10)\approx20.483,\quad \chi^2_{0.975}(10)\approx3.247
\\
\chi^2_{0.05}(10)\approx18.307,\quad \chi^2_{0.95}(10)\approx3.940
\\
E(\chi^2_n)=n,\quad D(\chi^2_n)=2n
`, "了解", ["附录", "统计", "卡方分布", "临界值"], "方差区间、方差检验、量级检查。", "卡方分布是非负且右偏的，小自由度左右分位数很不对称。", "正式题若给表按表算；这里帮你判断结果是否离谱。", "卡方变量是 n 个独立标准正态平方和。", "自由度 10 的卡方均值为 10，方差为 20。", "卡方分位数上下尾记号最容易混，做题必须看表头说明。", "distribution-plot")

,

  C("pre-trig-sin-cos-polynomial-substitution", "前置基础", "0. 前置基础", "三角代数化", "sin/cos 多项式对称代换", raw`
s=\sin x+\cos x,\quad p=\sin x\cos x=\frac{s^2-1}{2}
\\
\sin^2x+\cos^2x=1
\\
\sin^3x+\cos^3x=s(1-p)=s\left(1-\frac{s^2-1}{2}\right)
\\
\sin^4x+\cos^4x=1-2p^2
\\
(\sin x-\cos x)^2=1-2p=2-s^2
`, "技巧", ["三角", "代数化", "对称式", "最值"], "三角对称式化简、最值、选择填空。", "遇到只含 \\(\\sin x+\\cos x\\) 或对称多项式时，可把三角题变代数题。", "令 \\(s=\\sin x+\cos x\\)，先求 \\(p=\\sin x\cos x\\)，再用对称多项式公式改写。", "由 \\((\\sin x+\cos x)^2=1+2\sin x\cos x\\) 得到。", "若 \\(s=1\\)，则 \\(p=0\\)，\\(\\sin^3x+\cos^3x=1\\)。", "要注意 \\(s\\in[-\\sqrt2,\sqrt2]\\)，代数变量不是任意实数。", "unit-circle"),

  C("pre-trig-tan-substitution-polynomial", "前置基础", "0. 前置基础", "tan 代换", "齐次三角式 tan 代换", raw`
\frac{a\sin^2x+b\sin x\cos x+c\cos^2x}
{d\sin^2x+e\sin x\cos x+f\cos^2x}
=\frac{at^2+bt+c}{dt^2+et+f},\quad t=\tan x
\\
\sin^2x=\frac{t^2}{1+t^2},\quad
\cos^2x=\frac1{1+t^2},\quad
\sin x\cos x=\frac{t}{1+t^2}
`, "技巧", ["三角", "tan代换", "齐次式", "选择填空"], "齐次二次三角式最值、方程、积分前置。", "齐次的 \\(\\sin,\cos\\) 式子常可除以 \\(\\cos^2x\\)，变成 tan 的有理式。", "看到每项总次数相同，且 \\(\\cos x\ne0\\) 情况可处理，就令 \\(t=\tan x\\)。", "由 \\(\sin x=t\cos x\\) 或除以 \\(\cos^2x\\) 得到。", "\\((\\sin^2x+\\sin x\cos x)/\\cos^2x=t^2+t\\)。", "别漏掉 \\(\\cos x=0\\) 的点；除以 \\(\\cos^2x\\) 前要单独检查。", "unit-circle"),

  C("pre-trig-absolute-value-periodic-integrals", "前置基础", "0. 前置基础", "绝对值三角", "含绝对值三角积分速查", raw`
\int_0^{2\pi}|\sin x|dx=4,\quad
\int_0^{2\pi}|\cos x|dx=4
\\
\int_0^{\pi}|\sin x|dx=2,\quad
\int_0^{\pi}|\cos x|dx=2
\\
\int_0^{2\pi}|\sin x\cos x|dx=2
\\
\int_0^{2\pi}|\sin nx|dx=4\quad(n\in\mathbb N)
`, "常用", ["三角", "绝对值", "定积分", "周期"], "绝对值三角定积分、选择填空。", "绝对值会破坏奇偶抵消，但周期和对称仍然能快速算。", "先找零点分段，或利用周期把一个基本弧段乘倍数。", "由 \\(|\sin x|\\) 在每个半周期面积为 2 得到。", "\\(\\int_0^{2\\pi}|\\sin3x|dx=4\\)。", "含绝对值不能直接说奇函数积分为 0；要先分段或用对称。", "unit-circle"),

  C("pre-inverse-trig-principal-value-traps", "前置基础", "0. 前置基础", "反三角主值", "反三角主值陷阱表", raw`
\arcsin(\sin x)=x\quad x\in\left[-\frac\pi2,\frac\pi2\right]
\\
\arccos(\cos x)=x\quad x\in[0,\pi]
\\
\arctan(\tan x)=x\quad x\in\left(-\frac\pi2,\frac\pi2\right)
\\
\sin(\arccos x)=\sqrt{1-x^2},\quad
\cos(\arcsin x)=\sqrt{1-x^2}
\\
\cos(\arctan x)=\frac1{\sqrt{1+x^2}}
`, "必背", ["反三角", "主值", "易错点", "三角"], "反三角化简、积分结果判断。", "反三角函数会把多值关系压回主值区间，所以不能随便抵消。", "先看外层反三角的值域，再决定 \\(\\arcsin(\sin x)\\) 是否等于 x。", "反三角函数按约定取主值，三角函数再作用时才可直接复合。", "\\(\\arcsin(\\sin(2\\pi/3))=\\pi/3\\)，不是 \\(2\\pi/3\\)。", "最常见坑：把 \\(\\arccos(\\cos x)\\) 对所有 x 都写成 x。", "unit-circle"),

  C("pre-trig-product-sum-use-cases", "前置基础", "0. 前置基础", "积化和差应用", "积化和差使用场景速查", raw`
\sin mx\sin nx=\frac12[\cos(m-n)x-\cos(m+n)x]
\\
\cos mx\cos nx=\frac12[\cos(m-n)x+\cos(m+n)x]
\\
\sin mx\cos nx=\frac12[\sin(m+n)x+\sin(m-n)x]
\\
\int_0^{2\pi}\sin mx\sin nx\,dx=0\quad(m\ne n)
\\
\int_0^{2\pi}\cos mx\cos nx\,dx=0\quad(m\ne n)
`, "必背", ["三角", "积化和差", "正交", "Fourier"], "三角积分、Fourier、正交性。", "乘积不好积分，变成和差后频率分开，完整周期上大多为 0。", "三角乘积积分优先积化和差；若区间是完整周期，马上看频率是否正交。", "由和差角公式相加相减得到。", "\\(\\int_0^{2\\pi}\\sin2x\\sin3x dx=0\\)。", "正交公式依赖区间和周期；非完整周期不能直接判 0。", "unit-circle"),

  C("calc1-trig-equivalent-trigger-table", "高等数学", "第1章 函数与极限", "三角极限触发器", "三角极限触发器速查", raw`
\sin u\sim u:\quad u\to0
\\
1-\cos u=2\sin^2\frac u2\sim\frac{u^2}{2}
\\
\tan u-u\sim\frac{u^3}{3}
\\
\sin u-\sin v=2\cos\frac{u+v}{2}\sin\frac{u-v}{2}
\\
\cos u-\cos v=-2\sin\frac{u+v}{2}\sin\frac{u-v}{2}
`, "必背", ["极限", "三角", "等价无穷小", "触发器"], "三角极限、差值极限、复合极限。", "三角极限的核心是把所有东西压成 \\(\\sin u/u\\) 或首项 Taylor。", "单个小角用等价；差值用和差化积；高阶抵消用 Taylor。", "由小角等价和和差化积公式得到。", "\\(\\sin2x-\sin x\\sim x\\)。", "必须确认 \\(u,v\\to0\\) 或差值小；否则小角等价不能乱用。", "limit-slider"),

  C("appendix-common-trig-radian-decimal-values", "附录速查", "A. 常用数值附录", "弧度小数", "常用弧度小数近似", raw`
\frac\pi6\approx0.5236,\quad \frac\pi4\approx0.7854,\quad \frac\pi3\approx1.0472
\\
\frac\pi2\approx1.5708,\quad \frac{2\pi}{3}\approx2.0944,\quad \frac{3\pi}{4}\approx2.3562
\\
\pi\approx3.1416,\quad \frac{3\pi}{2}\approx4.7124,\quad 2\pi\approx6.2832
\\
1^\circ=\frac\pi{180}\approx0.01745
`, "常用", ["附录", "三角", "弧度", "常用数值"], "三角图像、数值估算、单位换算。", "考研默认弧度制，熟悉常用弧度小数能避免图像判断错位。", "遇到图像、周期、相位平移时用；精确计算仍保留 \\(\\pi\\)。", "由 \\(\\pi\\) 的小数近似和角度换算得到。", "\\(\\pi/3\\approx1.047\\)，比 1 稍大。", "导数积分公式只在弧度制下成立，角度制不能直接套。", "unit-circle"),

  C("calc7-ode-first-order-methods", "高等数学", "第7章 微分方程", "一阶微分方程", "一阶微分方程解法总表", raw`
\textbf{1. 可分离变量：} \frac{dy}{dx}=f(x)g(y)
\\
\int\frac{dy}{g(y)}=\int f(x)\,dx+C
\\[4pt]
\textbf{2. 一阶线性：} y'+P(x)y=Q(x)
\\
y=e^{-\int P\,dx}\!\left(\int Q e^{\int P\,dx}dx+C\right)
\\[4pt]
\textbf{3. 齐次方程：} \frac{dy}{dx}=\varphi\!\left(\frac{y}{x}\right)
\\
\text{令}\ u=\frac{y}{x},\ y=ux,\ y'=u+xu'
\\[4pt]
\textbf{4. Bernoulli 方程：} y'+P(x)y=Q(x)y^n\ (n\neq0,1)
\\
\text{令}\ v=y^{1-n},\ \text{化为一阶线性}
`, "必背", ["微分方程", "一阶", "线性", "可分离", "齐次", "Bernoulli"],
  "含 y' 且未知函数是 y(x)。",
  "可分离：变量分到两侧各自积分。线性：积分因子 \\(e^{\\int P\\,dx}\\) 消去左侧。齐次：令 \\(u=y/x\\) 化简。Bernoulli：幂变换降阶。",
  "先判类型：右侧能分离→可分离；含 y 一次且无乘积→一阶线性；右侧只含 y/x→齐次；含 \\(y^n\\)→Bernoulli。",
  "线性方程两侧乘积分因子 \\(e^{\\int P\\,dx}\\)，左侧变为 \\((ye^{\\int P})^\\prime\\)，直接积分。",
  "\\(y'+2y=4x\\)：\\(P=2,Q=4x\\)，积分因子 \\(e^{2x}\\)，解得 \\(y=2x-1+Ce^{-2x}\\)。",
  "积分因子指数上是 \\(\\int P\\,dx\\)（不加 C）；齐次方程要求右侧分子分母同次；Bernoulli 中 \\(n=0,1\\) 退化为线性，不用此法。"),

  C("calc7-ode-second-order-linear", "高等数学", "第7章 微分方程", "二阶线性微分方程", "二阶常系数线性微分方程", raw`
\textbf{齐次：}\ y''+py'+qy=0
\\
\text{特征方程：}\ r^2+pr+q=0
\\
\Delta>0:\ y=C_1e^{r_1x}+C_2e^{r_2x}
\\
\Delta=0:\ y=(C_1+C_2x)e^{r_1x}
\\
\Delta<0\ (r=\alpha\pm\beta i):\ y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)
\\[6pt]
\textbf{非齐次特解（待定系数法）：}
\\
f=e^{\lambda x}P_m(x):\ y^*=x^k e^{\lambda x}Q_m(x)
\\
k=\begin{cases}0&\lambda\text{ 非特征根}\\1&\lambda\text{ 单根}\\2&\lambda\text{ 重根}\end{cases}
\\[4pt]
f=e^{\alpha x}(A\cos\beta x+B\sin\beta x):
\\
y^*=x^k e^{\alpha x}(M\cos\beta x+N\sin\beta x),\quad k=0\text{ 或 }1
`, "必背", ["微分方程", "二阶", "常系数", "特征方程", "待定系数"],
  "二阶常系数线性 ODE，考研最高频微分方程题型。",
  "齐次解由特征根决定三种形态；非齐次通解 = 齐次通解 + 特解，特解结构由右侧类型和特征根重数决定。",
  "①写特征方程→解 \\(r_1,r_2\\)→写齐次通解。②判右侧 \\(f(x)\\) 类型→写特解形式→代入定系数。③通解 = 齐次通解 + 特解。",
  "特征多项式来自将 \\(e^{rx}\\) 代入方程后提取公因子 \\(e^{rx}\\)，令括号内为零。",
  "\\(y''-3y'+2y=e^x\\)：特征根 \\(r=1,2\\)，\\(\\lambda=1\\) 为单根，令 \\(y^*=Axe^x\\)，代入得 \\(A=-1\\)，通解 \\(y=C_1e^x+C_2e^{2x}-xe^x\\)。",
  "共轭复根 \\(\\alpha\\pm\\beta i\\) 写成实数形式（不写复指数）；\\(\\lambda\\) 是特征根时特解必须乘以 \\(x^k\\) 升阶，否则代入后右侧为 0。"),

  C("calc7-ode-euler-reduction", "高等数学", "第7章 微分方程", "可降阶方程", "可降阶微分方程与 Euler 方程", raw`
\textbf{1. } y^{(n)}=f(x):\quad \text{逐次积分 }n\text{ 次}
\\[4pt]
\textbf{2. } y''=f(x,y'):\quad \text{令}\ p=y',\ p'=f(x,p)\ \text{（不含 }y\text{）}
\\[4pt]
\textbf{3. } y''=f(y,y'):\quad \text{令}\ p=y',\ y''=p\frac{dp}{dy}\ \text{（不含 }x\text{）}
\\[4pt]
\textbf{4. Euler 方程：}\ x^2y''+pxy'+qy=g(x)
\\
\text{令}\ x=e^t\ (x>0),\ \frac{d}{dx}=\frac{1}{x}\frac{d}{dt}
\\
xy'=\dot y,\quad x^2y''=\ddot y-\dot y
\\
\text{化为常系数：}\ \ddot y+(p-1)\dot y+qy=g(e^t)
`, "必背", ["微分方程", "降阶", "Euler方程", "换元"],
  "方程中缺少 y 或缺少 x；或形如 Euler 方程（各项系数含对应幂次的 x）。",
  "降阶核心：引入 \\(p=y'\\) 把二阶化一阶；Euler 方程令 \\(x=e^t\\) 变系数→常系数。",
  "看方程缺哪个变量决定降阶方式；Euler 方程识别特征：各导数项的系数是 \\(x^k\\)，恰好与导数阶 \\(k\\) 匹配。",
  "Euler 方程令 \\(t=\\ln x\\)，利用链式法则 \\(dy/dx=(1/x)\\,dy/dt\\) 逐步推出 \\(x^ky^{(k)}\\) 用 \\(t\\) 的整数阶导表示。",
  "\\(x^2y''-xy'+y=x\\)：令 \\(x=e^t\\)，\\(\\ddot y-2\\dot y+y=e^t\\)，特征根 \\(r=1\\)（重根），特解 \\(y^*=\\frac{t^2}{2}e^t=\\frac{x(\\ln x)^2}{2}\\)。",
  "降阶法 2 令 \\(p=y'\\) 后方程是关于 \\(p(x)\\) 的一阶 ODE；降阶法 3 令 \\(p=p(y)\\) 后 \\(y''=p\\,dp/dy\\)，注意自变量变为 \\(y\\)。"),

  C("calc9-multivariable-implicit-diff", "高等数学", "第9章 多元函数微分法及应用", "隐函数求导", "隐函数求偏导公式", raw`
\textbf{一个方程 } F(x,y)=0\ \Rightarrow\ \frac{dy}{dx}=-\frac{F_x}{F_y}
\\[6pt]
\textbf{一个方程 } F(x,y,z)=0\ \Rightarrow
\\
\frac{\partial z}{\partial x}=-\frac{F_x}{F_z},\quad
\frac{\partial z}{\partial y}=-\frac{F_y}{F_z}
\\[6pt]
\textbf{方程组 }\begin{cases}F(x,y,u,v)=0\\G(x,y,u,v)=0\end{cases}
\Rightarrow \frac{\partial u}{\partial x}=-\frac{1}{J}\frac{\partial(F,G)}{\partial(x,v)},\quad
J=\frac{\partial(F,G)}{\partial(u,v)}
\\[4pt]
J=\begin{vmatrix}F_u&F_v\\G_u&G_v\end{vmatrix}\neq0\ \text{（隐函数存在条件）}
`, "必背", ["多元微分", "隐函数", "偏导数", "Jacobi行列式"],
  "题目给出 \\(F(x,y,z)=0\\) 或方程组，求 \\(\\partial z/\\partial x\\) 等。",
  "公式本质是对方程两侧关于 \\(x\\) 求偏导后解出目标偏导数；负号来自把目标变量的导数移到另一侧。",
  "①判断用哪种形式（一元/二元/方程组）。②识别 \\(F_x,F_y,F_z\\)（视 \\(z\\) 为 \\(x,y\\) 的函数，对 \\(F\\) 求偏导时 \\(z\\) 视为常量→即 \\(F_x\\) 意为固定 \\(y,z\\) 对 \\(x\\) 求偏导）。③代公式。",
  "对 \\(F(x,y,z(x,y))=0\\) 两端关于 \\(x\\) 求偏导：\\(F_x+F_z z_x=0\\)，解出 \\(z_x=-F_x/F_z\\)。",
  "\\(x^2+y^2+z^2=1\\)：\\(F=x^2+y^2+z^2-1\\)，\\(F_x=2x,F_z=2z\\)，故 \\(z_x=-x/z\\)。",
  "\\(F_z\\neq0\\) 是隐函数存在定理的条件，若 \\(F_z=0\\) 则不能这样求导；方程组情形必须先计算 Jacobi 行列式确认非零。"),

  C("calc9-lagrange-multiplier", "高等数学", "第9章 多元函数微分法及应用", "条件极值", "Lagrange 乘数法", raw`
\text{在约束 }g(x,y)=0\ \text{下求 }f(x,y)\text{ 极值：}
\\[4pt]
\text{构造辅助函数 }L=f+\lambda g
\\[4pt]
\text{驻点方程：}
\begin{cases}
L_x=f_x+\lambda g_x=0\\
L_y=f_y+\lambda g_y=0\\
g(x,y)=0
\end{cases}
\\[6pt]
\text{三变量一约束：}L=f(x,y,z)+\lambda g(x,y,z)
\\
\text{解方程组 }L_x=L_y=L_z=0,\ g=0
\\[4pt]
\text{两约束：}L=f+\lambda g+\mu h,\ \text{解 }L_x=L_y=L_z=0,g=0,h=0
`, "必背", ["多元微分", "条件极值", "Lagrange乘数", "最值"],
  "在等式约束下求函数最大值/最小值，常见于几何最值（距离、面积、体积）和经济优化。",
  "Lagrange 条件：极值点处 \\(\\nabla f\\) 与 \\(\\nabla g\\) 平行（梯度共线），故 \\(\\nabla f=−\\lambda\\nabla g\\)。",
  "①写出 \\(L=f+\\lambda g\\)。②对所有变量和 \\(\\lambda\\) 求偏导令为零。③解方程组得候选点。④比较各候选点函数值（实际问题必有最值，直接比较）。",
  "极值点处等值线 \\(f=c\\) 与约束曲线 \\(g=0\\) 相切，切点处法向量平行，即 \\(\\nabla f \\parallel \\nabla g\\)。",
  "\\(xy\\) 最大值，约束 \\(x+y=2\\)：\\(L=xy+\\lambda(x+y-2)\\)，\\(y+\\lambda=0,x+\\lambda=0\\)，故 \\(x=y=1\\)，最大值为 1。",
  "Lagrange 法只给出候选点，不自动判断极大/极小——实际最值问题比较候选点函数值即可；若需判断性质须用二阶条件。"),

  C("calc12-series-convergence-tests", "高等数学", "第12章 无穷级数", "正项级数判敛", "正项级数判敛法汇总", raw`
\textbf{比较判别法：}\ 0\le a_n\le b_n
\\
\sum b_n\text{ 收敛}\Rightarrow\sum a_n\text{ 收敛};\quad
\sum a_n\text{ 发散}\Rightarrow\sum b_n\text{ 发散}
\\[4pt]
\textbf{极限比较：}\lim_{n\to\infty}\frac{a_n}{b_n}=l\in(0,+\infty)
\\
\Rightarrow\sum a_n\text{ 与 }\sum b_n\text{ 同敛散}
\\[4pt]
\textbf{比值（d'Alembert）：}\ \rho=\lim\frac{a_{n+1}}{a_n}
\\
\rho<1\text{ 收敛};\quad\rho>1\text{ 发散};\quad\rho=1\text{ 失效}
\\[4pt]
\textbf{根值（Cauchy）：}\ \rho=\lim\sqrt[n]{a_n}
\\
\rho<1\text{ 收敛};\quad\rho>1\text{ 发散};\quad\rho=1\text{ 失效}
\\[4pt]
\textbf{积分判别法：}\ f\text{ 单调递减正值},\ a_n=f(n)
\\
\sum a_n\text{ 与 }\int_1^\infty f(x)\,dx\text{ 同敛散}
\\[4pt]
\textbf{p 级数：}\sum\frac{1}{n^p}\begin{cases}\text{收敛}&p>1\\\text{发散}&p\le1\end{cases}
`, "必背", ["级数", "正项级数", "判敛", "比值法", "根值法", "比较法"],
  "各项非负的级数，是任意项级数的基础。",
  "比值/根值法适合含阶乘、指数、幂的通项；比较法把陌生级数夹在已知级数之间；积分法对含 \\(\\ln n\\) 等连续型通项有效；p 级数是最常用的对比基准。",
  "含 \\(n!\\) 或 \\(a^n\\) → 比值法。含 \\(n^n\\) 或纯幂 → 根值法。形如 \\(1/n^p\\) → 直接用 p 级数结论。其余 → 极限比较+p 级数。",
  "比值法：\\(\\sum a_n r^n\\) 与等比级数比较，\\(|r|<1\\) 时收敛（几何级数）。根值法来自 Cauchy 根式检验，\\(\\limsup\\sqrt[n]{|a_n|}<1\\) 收敛。",
  "\\(\\sum n/2^n\\)：\\(\\rho=\\lim(n+1)/2^{n+1}\\cdot2^n/n=(n+1)/(2n)\\to1/2<1\\)，收敛。",
  "比值法和根值法在 \\(\\rho=1\\) 时完全失效，不能下结论；p 级数边界 \\(p=1\\) 是调和级数，发散！"),

  C("calc12-power-series-radius", "高等数学", "第12章 无穷级数", "幂级数", "幂级数收敛半径与收敛域", raw`
\sum_{n=0}^\infty a_n(x-x_0)^n\quad\text{收敛半径 }R:
\\[4pt]
R=\frac{1}{\displaystyle\limsup_{n\to\infty}\sqrt[n]{|a_n|}}
\quad\text{（Cauchy-Hadamard）}
\\[4pt]
\text{或}\ R=\lim_{n\to\infty}\left|\frac{a_n}{a_{n+1}}\right|\quad\text{（若极限存在）}
\\[6pt]
\text{收敛域：开区间 }(x_0-R,\,x_0+R)\ \text{内绝对收敛}
\\
\text{端点 }x_0\pm R\ \text{需单独代入判断}
\\[6pt]
\text{逐项求导/积分不改变 }R,\ \text{但端点收敛性可能改变}
\\[4pt]
\sum_{n=0}^\infty\frac{x^n}{n!}=e^x,\quad
\sum_{n=0}^\infty x^n=\frac{1}{1-x}\ (|x|<1)
\\
\sum_{n=1}^\infty\frac{x^n}{n}=-\ln(1-x)\ (|x|\le1,x\ne1)
`, "必背", ["级数", "幂级数", "收敛半径", "收敛域", "逐项求导"],
  "题目含 \\(\\sum a_n x^n\\) 或 \\(\\sum a_n(x-x_0)^n\\)，求收敛域或和函数。",
  "幂级数在收敛圆盘内表现得像多项式——可逐项求导积分。收敛半径公式来自正项级数根值/比值法，半径外必发散。",
  "①用比值或根值公式算 \\(R\\)。②写开区间 \\((x_0-R,x_0+R)\\)。③逐个代入端点，用 p 级数/Leibniz 判断。④合并得收敛域（含端点则用方括号）。",
  "在 \\(|x-x_0|<R\\) 内 \\(\\sum a_n(x-x_0)^n\\) 绝对收敛，由等比级数的控制得到；端点处绝对收敛不保证。",
  "\\(\\sum n x^n\\)：\\(|a_n/a_{n+1}|=n/(n+1)\\to1\\)，\\(R=1\\)；端点 \\(x=\\pm1\\) 时通项 \\(\\to\\infty\\)，发散；收敛域 \\((-1,1)\\)。",
  "缺项幂级数（如只有偶次项 \\(\\sum a_n x^{2n}\\)）不能直接套公式，需令 \\(t=x^2\\) 先求关于 \\(t\\) 的 \\(R_t\\)，再换回 \\(x\\)；逐项求导后端点处收敛性必须重新验证。"),

  C("calc6-volume-arc-surface", "高等数学", "第6章 定积分应用", "几何应用", "旋转体体积、弧长与旋转面积", raw`
\textbf{旋转体体积（绕 x 轴）：}
\\
V_x=\pi\int_a^b[f(x)]^2\,dx
\\[4pt]
\textbf{旋转体体积（绕 y 轴，柱壳法）：}
\\
V_y=2\pi\int_a^b x|f(x)|\,dx\quad(0\le a<b)
\\[4pt]
\textbf{弧长（直角坐标）：}
\\
L=\int_a^b\sqrt{1+[f'(x)]^2}\,dx
\\[4pt]
\textbf{弧长（参数方程）：}
\\
L=\int_\alpha^\beta\sqrt{\dot x^2+\dot y^2}\,dt
\\[4pt]
\textbf{弧长（极坐标）：}
\\
L=\int_{\alpha}^{\beta}\sqrt{r^2+r'^2}\,d\theta
\\[4pt]
\textbf{旋转曲面面积（绕 x 轴）：}
\\
S=2\pi\int_a^b|f(x)|\sqrt{1+[f'(x)]^2}\,dx
`, "必背", ["定积分应用", "旋转体", "体积", "弧长", "柱壳法", "旋转面积"],
  "求曲线围成区域旋转后的体积、曲线弧长、旋转面面积。",
  "圆盘法：把旋转体切成薄圆盘，每片面积 \\(\\pi r^2\\)；柱壳法：切成薄圆柱壳，每片侧面积 \\(2\\pi r \\cdot h\\)；弧长：微元 \\(ds=\\sqrt{dx^2+dy^2}\\)。",
  "绕 x 轴→圆盘法（直接平方积分）；绕 y 轴且 y=f(x) 形式→柱壳法更省事；弧长先算 \\(f'(x)\\)，再套公式；极坐标弧长注意 \\(r'=dr/d\\theta\\)。",
  "圆盘法：\\(dV=\\pi[f(x)]^2dx\\)；柱壳法：\\(dV=2\\pi x\\cdot f(x)dx\\)（周长×高×厚度）；弧长：\\(ds=\\sqrt{1+y'^2}dx\\)。",
  "\\(y=\\sqrt{x}\\)，\\(0\\le x\\le1\\) 绕 x 轴：\\(V=\\pi\\int_0^1 x\\,dx=\\pi/2\\)；弧长：\\(y'=1/(2\\sqrt{x})\\)，\\(L=\\int_0^1\\sqrt{1+1/(4x)}\\,dx\\)。",
  "柱壳法积分上下限是 \\(x\\) 的范围（不是 \\(y\\)）；旋转面积公式中 \\(|f(x)|\\) 不能省（函数可能取负值）；弧长被积函数含根号，注意根号下不能为负，即 \\(f'\\) 必须存在。"),

  C("appendix-common-inequalities-numerical", "附录速查", "A. 常用数值附录", "常用不等式", "考研常用不等式速查", raw`
e<3,\quad 2<e<3,\quad e\approx2.718
\\
\ln2\approx0.693,\quad \ln3\approx1.099,\quad \ln10\approx2.303
\\[4pt]
x>0:\quad \ln x\le x-1\quad(\text{等号}\ x=1)
\\
x\ge0:\quad e^x\ge1+x\quad(\text{等号}\ x=0)
\\
0<x<\frac\pi2:\quad \sin x<x<\tan x
\\
0<x<1:\quad x-\frac{x^2}{2}<\ln(1+x)<x
\\[4pt]
|a+b|\le|a|+|b|,\quad \left|\int f\right|\le\int|f|
\\[4pt]
\text{均值不等式：}\ \frac{2}{\frac1a+\frac1b}\le\sqrt{ab}\le\frac{a+b}{2}\le\sqrt{\frac{a^2+b^2}{2}}
\\
(a,b>0)
\\[4pt]
\text{Young：}\ ab\le\frac{a^p}{p}+\frac{b^q}{q},\quad\frac1p+\frac1q=1,\ a,b\ge0
`, "必背", ["不等式", "均值不等式", "对数", "指数", "附录", "放缩"],
  "证明题放缩、估值、判敛时需要快速引用基本不等式。",
  "\\(\\ln x\\le x-1\\) 和 \\(e^x\\ge1+x\\) 是最高频证明工具，都来自对应函数在切点处的切线不等式。均值不等式链表明调和均值≤几何均值≤算术均值≤平方均值。",
  "放缩时先选离目标近的不等式；证明 \\(f>0\\) 时配凑成已知不等式形式；估算积分时对被积函数用 \\(e^x\\ge1+x\\) 或 \\(\\sin x<x\\) 先放缩。",
  "\\(\\ln x\\le x-1\\) 等价于 \\(\\ln x-(x-1)\\le0\\)，令 \\(h(x)=\\ln x-x+1\\)，\\(h'(x)=1/x-1=0\\) 在 \\(x=1\\) 取最大值 0，故 \\(h(x)\\le0\\)。",
  "证明 \\(\\ln(1+x)\\le x\\)：由 \\(\\ln t\\le t-1\\) 令 \\(t=1+x\\) 得 \\(\\ln(1+x)\\le x\\)（\\(x>-1\\)）。",
  "均值不等式等号条件是 \\(a=b\\)；\\(0<x<\\pi/2\\) 时 \\(\\sin x<x\\) 只在正半轴成立，注意符号；含绝对值不等式放缩后方向可能改变。")

];

window.FORMULA_GROUPS = [
  { subject: "前置基础", chapters: ["0. 前置基础"] },
  { subject: "高等数学", chapters: [
    "第1章 函数与极限", "第2章 导数与微分", "第3章 微分中值定理与导数应用",
    "第4章 不定积分", "第5章 定积分", "第6章 定积分应用", "第7章 微分方程",
    "第8章 向量代数与空间解析几何", "第9章 多元函数微分法及应用", "第10章 重积分",
    "第11章 曲线积分与曲面积分", "第12章 无穷级数"
  ] },
  { subject: "线性代数", chapters: [
    "第1章 行列式", "第2章 矩阵及其运算", "第3章 初等变换与线性方程组",
    "第4章 向量组线性相关性", "第5章 相似矩阵及二次型", "第6章 线性空间与线性变换【拓展】"
  ] },
  { subject: "概率论", chapters: [
    "第1章 随机事件与概率", "第2章 随机变量及其分布", "第3章 多维随机变量",
    "第4章 数字特征", "第5章 大数定律与中心极限定理", "第6章 数理统计基本概念",
    "第7章 参数估计", "第8章 假设检验"
  ] },
  { subject: "冷门技巧", chapters: ["冷门但高收益技巧库"] },
  { subject: "附录速查", chapters: ["A. 常用数值附录"] }
];
