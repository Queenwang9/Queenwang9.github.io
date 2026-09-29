const app=document.getElementById("app");
const KEY="englishHomeProgress";
let state=JSON.parse(localStorage.getItem(KEY)||'{"completedDays":[1],"favorites":[],"mistakes":[],"quiz":{}}');
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function speak(t){if("speechSynthesis"in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.82;speechSynthesis.speak(u)}}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function layout(body,active="home"){app.innerHTML=`<div class="app"><div class="top"><div class="brand">英语之家</div><div class="sub">从零基础走到 Advanced English</div></div><main class="content">${body}</main><nav class="nav"><div class="navin">${["home","today","practice","me"].map(x=>`<button class="${active===x?"active":""}" onclick="route('${x}')">${({home:"首页",today:"今日",practice:"练习",me:"我的"})[x]}</button>`).join("")}</div></nav></div>`}
function card(title,body){return `<section class="card"><h2>${title}</h2>${body}</section>`}
function home(){
 const done=state.completedDays.length; const pct=Math.min(100,Math.round(done/10*100));
 layout(`<div class="card hero"><div class="kicker">ENGLISH HOME</div><h1>今天也学一点英语</h1><p class="muted">目标：理解英语，而不是只背答案。</p><div class="progress"><i style="width:${pct}%"></i></div><p class="small muted">课程进度 ${pct}% · 已完成 ${state.completedDays.length} 天</p><button class="btn" onclick="route('today')">开始今天的学习</button></div>
 ${card("10 条能力线",`<div class="grid">${[
 ["pronunciation","发音","听清、读准、音标"],
 ["spelling","拼写","把声音变成正确拼写"],
 ["vocabulary","词汇","词义、搭配、用法"],
 ["grammar","语法","理解句子为什么这样写"],
 ["listening","听力","听懂真实英语"],
 ["speaking","口语","开口组织句子"],
 ["reading","阅读","理解句子和文章"],
 ["writing","写作","自己表达"],
 ["thinking","英语思维","从中文意思到英语结构"],
 ["pragmatics","语用与文化","知道什么场景怎么说"]
 ].map(a=>`<button class="ability" onclick="route('${a[0]}')"><b>${a[1]}</b><span>${a[2]}</span></button>`).join("")}</div>`)}
 ${card("课程路线",`<p><b>Pre-A1 → A1 → A2 → B1 → B2 → C1 → C2</b></p><p class="muted">之后进入 IELTS，再继续 Advanced English。IELTS 是测量工具，不是终点。</p>`)}
 ${card("今天先做什么",`<div class="row"><button class="btn" onclick="route('day2')">Day 2</button><button class="btn secondary" onclick="route('vocabulary')">今日词汇</button><button class="btn secondary" onclick="route('grammar')">今日语法</button></div>`)}
 `,"home")
}
function back(){return `<button class="btn ghost back" onclick="route('home')">← 返回首页</button>`}
function today(){layout(`${back()}<div class="card hero"><div class="kicker">DAY 2</div><h1>一般现在时 + do/does</h1><p class="muted">今天重点：普通动词、do/does、否定句、发音和拼写。</p><button class="btn" onclick="route('day2')">进入 Day 2</button></div>
${card("建议顺序",`<p>① 语法 → ② 词汇 → ③ 发音 → ④ 听力 → ⑤ 口语 → ⑥ 阅读 → ⑦ 写作 → ⑧ 英语思维 → ⑨ 语用 → ⑩ 练习</p>`)}
${card("学习原则",`<p>不用把每一道题都抄进本子。重要规则、错题原因和今天的新词，再整理进纸质笔记。</p>`)}`,"today")}
function day2(){const d=COURSE.days.find(x=>x.id===2);layout(`${back()}<div class="card"><div class="kicker">${d.level}</div><h1>${d.title}</h1><p>${d.desc}</p></div>${d.lessons.map((x,i)=>card(`${i+1}. ${x.title}`,`<p>${x.body}</p>`)).join("")}
${card("马上测一下",`<p>先不要看答案。</p><button class="btn" onclick="route('grammar')">进入语法练习</button>`)}
${card("完成 Day 2",`<p class="muted">完成主要内容后点击。</p><button class="btn" onclick="completeDay(2)">标记 Day 2 已完成</button>`)}`,"today")}
function day1(){layout(`${back()}${card("Day 1｜BE 动词基础",COURSE.days[0].lessons.map((x,i)=>`<h3>${i+1}. ${x.title}</h3><p>${x.body}</p>`).join(""))}${card("Day 1 结果",`<p class="check">你已经完成 Day 1 测验：6/6。</p>`)} )`,"today")}
function completeDay(n){if(!state.completedDays.includes(n))state.completedDays.push(n);save();alert("已保存：Day "+n+" 完成");route("today")}
function grammar(){let q=GRAMMAR.quiz;layout(`${back()}<div class="card"><div class="kicker">GRAMMAR</div><h1>基础语法</h1><p>先理解规则，再做题。答错时重点看“为什么”。</p></div>${GRAMMAR.topics.map(t=>card(t.title,`<p>${t.explain}</p>${t.examples.map(e=>`<div class="example">${e}<br><button class="btn secondary small" onclick="speak('${e.replace(/'/g,"\\'")}')">🔊 听一下</button></div>`).join("")}`)).join("")}${card("3 题小测",q.map((x,i)=>`<div id="g${i}" class="card" style="box-shadow:none;margin:0 0 8px;padding:12px"><b>${i+1}. ${x.q}</b>${x.opts.map((o,j)=>`<button class="answer" onclick="answerGrammar(${i},${j},this)">${o}</button>`).join("")}<div class="small muted" id="ge${i}"></div></div>`).join(""))}`,"practice")}
function answerGrammar(i,j,el){let q=GRAMMAR.quiz[i];document.querySelectorAll("#g"+i+" .answer").forEach(x=>x.disabled=true);if(j===q.a){el.classList.add("correct");document.getElementById("ge"+i).innerHTML='<span class="check">正确。'+esc(q.e)+'</span>'}else{el.classList.add("wrong");document.getElementById("ge"+i).innerHTML='<span class="cross">不对。'+esc(q.e)+'</span>';state.mistakes.push({type:"grammar",q:q.q});save()}}
function pronunciation(){layout(`${back()}<div class="card"><div class="kicker">PRONUNCIATION</div><h1>发音与 IPA</h1><p>IPA 是“标音工具”。你不会读 IPA 没关系：先点 🔊 听，再观察普通英语单词。</p></div>${PRONUNCIATION.items.map(x=>card(`<span class="word">${x.word}</span><div class="ipa">${x.ipa}</div>`,`<p>${x.note}</p><div class="example">${x.example}</div><button class="btn" onclick="speak('${x.word}')">🔊 听单词</button> <button class="btn secondary" onclick="speak('${x.example.replace(/'/g,"\\'")}')">🔊 听例句</button>`)).join("")}`)}
function spelling(){layout(`${back()}<div class="card"><div class="kicker">SPELLING</div><h1>拼写训练</h1><p>拼写是独立能力：听到、想到和正确写出来不是同一件事。</p></div>${SPELLING.items.map((x,i)=>`<section class="card"><h3>${i+1}. ${x.q}</h3><input id="sp${i}" placeholder="输入英文拼写"><p class="small muted">${x.hint}</p><button class="btn" onclick="checkSpell(${i})">检查</button><div id="spe${i}"></div></section>`).join("")}`)}
function checkSpell(i){let x=SPELLING.items[i],v=document.getElementById("sp"+i).value.trim().toLowerCase(),e=document.getElementById("spe"+i);e.innerHTML=v===x.answer?'<p class="check">正确 ✓</p>':`<p class="cross">还不对。正确拼写：${x.answer}</p>`}
function vocabulary(){layout(`${back()}<div class="card"><div class="kicker">VOCABULARY</div><h1>今日词汇</h1><p>每个词都同时看：意思、发音、拼写、例句和用法。</p></div>${VOCAB.map((x,i)=>`<section class="card"><div class="word">${x.word}</div><div class="ipa">${x.ipa}</div><p><b>${x.cn}</b></p><button class="btn" onclick="speak('${x.word}')">🔊 发音</button> <button class="btn secondary" onclick="toggleFav('${esc(x.word)}')">☆ 收藏</button><div class="example">${x.example}</div><p class="small muted">${x.use}</p></section>`).join("")}`)}
function toggleFav(w){if(state.favorites.includes(w))state.favorites=state.favorites.filter(x=>x!==w);else state.favorites.push(w);save();alert("已保存")}
function listening(){layout(`${back()}<div class="card"><div class="kicker">LISTENING</div><h1>听力</h1><p>先听句子，再回答问题。可以重复播放。</p></div>${LISTENING.map((x,i)=>`<section class="card"><button class="btn" onclick="speak('${x.text}')">🔊 播放</button><p class="muted">第 ${i+1} 题</p><h3>${x.q}</h3>${x.opts.map((o,j)=>`<button class="answer" onclick="checkGeneric(${i},${j},${x.a},this,'l${i}')">${o}</button>`).join("")}<div id="l${i}"></div></section>`).join("")}`)}
function speaking(){layout(`${back()}<div class="card"><div class="kicker">SPEAKING</div><h1>口语 / 跟读</h1><p>点播放 → 听 → 自己跟读。手机浏览器的语音合成先作为基础工具。</p></div>${SPEAKING.map((x,i)=>card(`<span class="word">${x.text}</span>`,`<button class="btn" onclick="speak('${x.text}')">🔊 听</button><p>${x.tip}</p>`)).join("")}`)}
function reading(){let r=READING[0];layout(`${back()}<div class="card"><div class="kicker">READING</div><h1>${r.title}</h1><p class="big" style="font-size:20px;line-height:1.8">${r.text}</p></div>${r.qs.map((x,i)=>`<section class="card"><h3>${x.q}</h3>${x.opts.map((o,j)=>`<button class="answer" onclick="checkGeneric(${i},${j},${x.a},this,'r${i}')">${o}</button>`).join("")}<div id="r${i}"></div></section>`).join("")}`)}
function writing(){layout(`${back()}<div class="card"><div class="kicker">WRITING</div><h1>写作</h1><p>先自己写，再对照。不要一开始就依赖翻译器。</p></div>${WRITING.map((x,i)=>`<section class="card"><h3>${x.prompt}</h3><textarea id="w${i}" placeholder="在这里写英文……"></textarea><button class="btn" onclick="checkWriting(${i})">检查</button><div id="we${i}"></div></section>`).join("")}`)}
function checkWriting(i){let x=WRITING[i],v=document.getElementById("w"+i).value.trim().replace(/[.!?]+$/,"").toLowerCase(),a=x.answer.replace(/[.!?]+$/,"").toLowerCase();document.getElementById("we"+i).innerHTML=v===a?'<p class="check">正确 ✓</p>':`<p class="cross">可以对照：${x.answer}</p><p class="small muted">${x.tip}</p>`}
function thinking(){layout(`${back()}<div class="card"><div class="kicker">ENGLISH THINKING</div><h1>英语思维</h1><p>重点不是“中文逐字翻译”，而是找到英语自己的结构。</p></div>${THINKING.map(x=>card(x.cn,`<p><b>正确：</b>${x.correct}</p><p class="cross">常见错误：${x.wrong.join(" / ")}</p><p>${x.why}</p>`)).join("")}`)}
function pragmatics(){layout(`${back()}<div class="card"><div class="kicker">PRAGMATICS & CULTURE</div><h1>语用与文化</h1><p>同一个意思，在不同场景要选择自然、合适的表达。</p></div>${PRAGMATICS.map(x=>card(x.situation,`<div class="example"><b>${x.natural}</b><br><button class="btn secondary" onclick="speak('${x.natural}')">🔊 听</button></div><p>${x.note}</p>`)).join("")}`)}
function checkGeneric(i,j,a,el,id){document.querySelectorAll("#"+id.replace(/\d+$/,"")+" .answer").forEach(()=>{});let box=document.getElementById(id);if(j===a){el.classList.add("correct");box.innerHTML='<p class="check">正确 ✓</p>'}else{el.classList.add("wrong");box.innerHTML='<p class="cross">再听一次，再想一遍。</p>'}}
function practice(){layout(`${back()}${card("综合练习",`<p>目前可以直接进入：</p><div class="row"><button class="btn" onclick="route('grammar')">语法</button><button class="btn" onclick="route('spelling')">拼写</button><button class="btn" onclick="route('listening')">听力</button><button class="btn" onclick="route('reading')">阅读</button><button class="btn" onclick="route('writing')">写作</button><button class="btn" onclick="route('thinking')">英语思维</button></div>`)}${card("错题记录",state.mistakes.length?`<p>已记录 ${state.mistakes.length} 个需要复习的题目。</p>`:"<p class='muted'>暂时没有错题。")}`,"practice")}
function me(){layout(`${back()}${card("我的学习",`<p>已完成课程日：${state.completedDays.join("、")}</p><p>收藏词汇：${state.favorites.length} 个</p><p>错题：${state.mistakes.length} 个</p>`)}${card("每日总结模板",`<p class="muted">今天新学：</p><p>① 语法：一般现在时、do/does</p><p>② 词汇：name / live / like / want / busy / tired</p><p>③ 发音：/aɪ/、/ɪ/、/iː/ 等</p><p>④ 句型：I live in Qingdao. / I want to learn English.</p><p>⑤ 今天最容易错的地方：________________</p>`)}${card("复习原则",`<p>当天学 → 次日复习 → 3天后 → 7天后 → 14天后。后续版本再把间隔复习自动化。</p>`)}`,"me")}
function route(x){({home,today,day1,day2,practice,me,grammar,pronunciation,spelling,vocabulary,listening,speaking,reading,writing,thinking,pragmatics}[x]||home)()}
route("home");
