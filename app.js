const KEY="queenwang9_english_v1";
const initial={day1:{done:true,score:6,total:6},day2:{done:false,score:0,total:3},errors:[],savedWords:[],lastPage:"home"};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||initial;
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function el(tag,cls,html){const x=document.createElement(tag);if(cls)x.className=cls;if(html!==undefined)x.innerHTML=html;return x}
function speak(text){if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=.82;speechSynthesis.speak(u)}}
function pct(a,b){return b?Math.round(a/b*100):0}
function header(title,sub=""){return `<div class="top"><div class="eyebrow">王玉英语学习系统</div><div class="title">${title}</div><div class="sub">${sub}</div></div>`}
function nav(active){return `<div class="nav"><div class="navin">
<button class="${active==="home"?"active":""}" onclick="go('home')"><span>⌂</span>首页</button>
<button class="${active==="courses"?"active":""}" onclick="go('courses')"><span>▣</span>课程</button>
<button class="${active==="practice"?"active":""}" onclick="go('practice')"><span>✓</span>练习</button>
<button class="${active==="review"?"active":""}" onclick="go('review')"><span>↻</span>复习</button>
<button class="${active==="me"?"active":""}" onclick="go('me')"><span>◎</span>我的</button>
</div></div>`}
function render(html,active){document.getElementById("app").innerHTML=`<div class="app">${html}${nav(active)}</div>`;window.scrollTo(0,0)}
function go(page){state.lastPage=page;save();if(page==="home")home();if(page==="courses")courses();if(page==="practice")practice();if(page==="review")review();if(page==="me")me()}
function home(){
 const d=state.day1.done?1:0, d2=state.day2.done?1:0, total=d+d2, progress=total/2*100;
 render(header("今天学英语","主线课程从零基础开始，逐步走向 A1 → A2 → B1 → B2 → C1 → C2 → IELTS → Advanced English")+`
 <div class="content">
 <div class="card hero"><div class="eyebrow">今日学习</div><h2 style="margin:7px 0">Day ${state.day2.done? "—":"2"}</h2><div class="sub">一般现在时 + do / does + 发音入门</div><div class="progress"><div style="width:${state.day2.done?100:0}%"></div></div><div class="row"><span>${state.day2.done?"今日已完成":"下一课待学习"}</span><button class="btn secondary" onclick="startDay2()">开始</button></div></div>
 <div class="card"><div class="row"><b>Day 1 学习记录</b><span class="pill">6/6 · 100%</span></div><p class="muted">BE 动词：am / is / are，已完成。</p></div>
 <div class="card"><b>10 条能力线</b><div class="grid" style="margin-top:12px">${["发音","拼写","词汇","语法","听力","口语","阅读","写作","英语思维","语用与文化"].map(x=>`<div class="tile"><b>${x}</b><span class="muted">持续训练</span></div>`).join("")}</div></div>
 <div class="card"><b>学习进度</b><div class="progress"><div style="width:${progress}%"></div></div><div class="muted">基础课程完成度：${Math.round(progress)}%</div></div>
 </div>`,"home")
}
function courses(){
 render(header("课程","从零基础逐层推进，不跳级硬背。")+`<div class="content">
 <div class="card"><span class="pill">当前阶段</span><h2>Zero → A1 基础</h2><p class="muted">重点：句子结构、BE、一般现在时、发音、拼写、核心词汇。</p></div>
 ${["Day 1 · BE 动词基础","Day 2 · 一般现在时 + do/does + 发音"].map((x,i)=>`<div class="card"><div class="row"><b>${x}</b><span class="pill">${i===0?"已完成":"下一课"}</span></div><p class="muted">${i===0?"6/6，100%":"3 个课堂练习 + 发音与拼写训练"}</p><button class="btn ${i===0?"secondary":""}" onclick="${i===0?"showDay1()":"startDay2()"}">${i===0?"查看":"开始"}</button></div>`).join("")}
 <div class="card"><b>后续路线</b><p class="muted">A1 → A2 → B1 → B2 → C1 → C2 → IELTS → IELTS 8/8.5/9 → Advanced English</p></div>
 </div>`,"courses")
}
function showDay1(){
 render(header("Day 1","BE 动词基础 · 已完成 6/6"),`home`)
}
function startDay2(){
 const L=DAY2.lessons;
 render(header("Day 2","一般现在时 + do / does + 发音入门")+`<div class="content">
 ${L.map(x=>`<div class="card"><b>${x.title}</b><p>${x.text}</p></div>`).join("")}
 <div class="card"><b>今天的 5 个核心词</b>${DAY2.vocab.map(v=>`<p><b>${v[0]}</b> — ${v[1]}<br><span class="muted">${v[2]}</span> <button class="btn secondary small" onclick="speak('${v[2].replace(/'/g,"\\'")}')">🔊 听</button></p>`).join("")}</div>
 <button class="btn full" onclick="day2Quiz()">开始课堂练习</button>
 </div>`,"courses")
}
function day2Quiz(){
 state.qIndex=0;state.qCorrect=0;state.qDone=false;quizPage()
}
function quizPage(){
 const i=state.qIndex,q=DAY2.quiz[i];
 if(i>=DAY2.quiz.length){finishDay2();return}
 render(header("Day 2 · 课堂练习",`第 ${i+1} / ${DAY2.quiz.length} 题`)+`<div class="content"><div class="card"><b>${q.q}</b><div id="opts">${q.options.map((o,j)=>`<button class="option" onclick="answer(${j})">${o}</button>`).join("")}</div><div id="fb"></div></div></div>`,"practice")
}
function answer(j){
 const i=state.qIndex,q=DAY2.quiz[i],opts=[...document.querySelectorAll(".option")];
 opts.forEach(x=>x.disabled=true);opts[j].classList.add(j===q.answer?"correct":"wrong");if(j===q.answer)state.qCorrect++;
 if(j!==q.answer){state.errors.push({q:q.q,wrong:q.options[j],correct:q.options[q.answer],why:q.why})}
 document.getElementById("fb").innerHTML=`<div class="feedback"><b>${j===q.answer?"正确":"需要复习"}</b><br>${q.why}</div><button class="btn full" style="margin-top:10px" onclick="nextQ()">${i===DAY2.quiz.length-1?"查看结果":"下一题"}</button>`;
 save()
}
function nextQ(){state.qIndex++;save();quizPage()}
function finishDay2(){
 const score=state.qCorrect,total=DAY2.quiz.length;
 state.day2={done:score===total,score,total};save();
 render(header("Day 2 · 练习结果","本次课堂练习已完成")+`<div class="content"><div class="card center"><div style="font-size:44px;font-weight:800">${score}/${total}</div><p class="${score===total?"success":"warning"}">${score===total?"全部正确":"有题目需要进入错题复习"}</p><p class="muted">系统已经记录你的练习结果。</p><button class="btn full" onclick="go('home')">回到首页</button></div></div>`,"practice")
}
function practice(){
 render(header("练习","课堂练习、发音、拼写和综合复习会逐步加入。")+`<div class="content">
 <div class="card"><b>Day 2 课堂练习</b><p class="muted">一般现在时 + do / does</p><button class="btn" onclick="day2Quiz()">开始</button></div>
 <div class="card"><b>发音训练</b><p class="muted">先从 /iː/、/ɪ/、/æ/、/ʌ/ 开始。</p><button class="btn secondary" onclick="pronunciation()">进入</button></div>
 <div class="card"><b>拼写训练</b><p class="muted">后续加入听音拼写、字母组合、易错拼写。</p></div>
 </div>`,"practice")
}
function pronunciation(){
 render(header("发音中心","音标不是孤立背诵，而是把符号、声音、单词和口腔动作连起来。")+`<div class="content">
 ${PRONUNCIATION.map(p=>`<div class="card"><div class="word">${p.symbol}</div><div class="ipa">${p.name}</div><p>${p.tip}</p><div>${p.examples.map(e=>`<button class="option" onclick="speak('${e[0]}')"><b>${e[0]}</b> — ${e[1]}　🔊</button>`).join("")}</div></div>`).join("")}
 </div>`,"practice")
}
function review(){
 render(header("复习","错题会进入复习区；后续会接入间隔重复算法。")+`<div class="content">
 <div class="card"><div class="row"><b>待复习错题</b><span class="pill">${state.errors.length}</span></div>${state.errors.length?`<ol class="list">${state.errors.map(e=>`<li style="margin:10px 0"><b>${e.q}</b><br>你的答案：${e.wrong}<br>正确答案：${e.correct}<br><span class="muted">${e.why}</span></li>`).join("")}</ol>`:`<p class="success">目前没有错题。</p>`}</div>
 <div class="card"><b>间隔复习计划</b><p class="muted">V1 先保存错题；后续版本会按遗忘曲线自动安排：当天 → 次日 → 3天 → 7天 → 14天……</p></div>
 </div>`,"review")
}
function me(){
 render(header("我的学习","数据保存在当前浏览器中。")+`<div class="content">
 <div class="card"><b>学习记录</b><p>Day 1：${state.day1.score}/${state.day1.total}</p><p>Day 2：${state.day2.score}/${state.day2.total}</p><p>错题：${state.errors.length}</p></div>
 <div class="card"><b>每日总结</b><p class="muted">今天记住这 3 件事：① do/does 是一般现在时的重要工具；② does 后面的实义动词用原形；③ 发音训练从实际声音入手，不是死背音标。</p></div>
 <div class="card"><b>长期目标</b><p class="muted">从零基础建立完整英语能力体系，之后进入 IELTS 与 Advanced English。IELTS 分数是测量工具，不是学习终点。</p></div>
 </div>`,"me")
}
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
go("home");