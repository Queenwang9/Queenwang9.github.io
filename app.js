
const KEY='english_home_final_v1';
let S=JSON.parse(localStorage.getItem(KEY)||'{"current":1,"done":{},"scores":{},"mistakes":[],"notes":{},"review":{}}');
const $=s=>document.querySelector(s); const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
function lesson(id){return LESSONS.find(x=>x.day===id)}
function speak(text,rate=.8){if(!('speechSynthesis'in window))return; speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate;speechSynthesis.speak(u)}
function pct(){return Math.round(Object.keys(S.done).length/LESSONS.length*100)}
function nav(active){
 return `<nav class="nav">${[['today','今天'],['course','课程'],['review','复习'],['resources','资源'],['me','我的']].map(x=>`<button class="${active===x[0]?'active':''}" onclick="route('${x[0]}')">${x[1]}</button>`).join('')}</nav>`
}
function frame(body,active='today'){
 $('#app').innerHTML=`<div class="wrap"><div class="top"><div><h1>英语之家</h1><div class="muted">一次安装 · 按课程真正学会</div></div><b>${pct()}%</b></div>${body}</div>${nav(active)}`
}
function route(p){({today,course,review,resources,me}[p])()}
function today(){
 const l=lesson(S.current)||LESSONS[0];
 frame(`<div class="card"><div class="muted">${l.stage_name} · Day ${l.day}</div><h2>${l.title}</h2><p>${l.focus}</p><div class="bar"><i style="width:${pct()}%"></i></div><p class="muted">本课约 ${l.estimated_minutes} 分钟。完成后自动解锁下一课。</p><button class="btn" onclick="openLesson(${l.day})">开始今天的课</button></div>
 <div class="card"><h3>你今天不用自己决定学什么</h3><p>系统已经排好顺序：老师讲解 → 词汇/拼写 → 发音 → 语法 → 听力 → 口语 → 阅读 → 写作 → 英语思维 → 语用 → 小测 → 复习。</p></div>`)
}
function course(){
 let h='<div class="card"><h2>完整课程地图</h2><p class="muted">共 420 个学习日。未完成前一课时，下一课不会自动解锁。</p>';
 CURRICULUM.forEach(c=>{h+=`<h3>${c.stage} · ${c.name}</h3><p class="muted">Day ${c.start}–${c.end}</p><div class="grid">`;LESSONS.filter(l=>l.stage===c.stage).forEach(l=>{let lock=l.day>S.current&&!S.done[l.day];h+=`<button class="btn ${lock?'light':''}" ${lock?'disabled':''} onclick="openLesson(${l.day})">Day ${l.day}<br>${l.title}</button>`});h+='</div>'});h+='</div>';frame(h,'course')
}
function openLesson(id){
 const l=lesson(id); if(!l)return;
 let h=`<div class="card"><div class="muted">${l.stage_name} · Day ${l.day}</div><h2>${l.title}</h2><p><b>今天真正要获得的能力：</b>${l.focus}</p><p class="muted">不要为了“打勾”而学习。你要先理解，再输出。</p></div>`;
 h+=`<div class="card"><h2>一、老师带你理解</h2>`;
 l.steps.forEach(s=>h+=`<div class="step"><h3>${s[0]}</h3><p>${s[1]}</p></div>`);
 if(l.examples){h+='<h3>本课核心例句</h3>';l.examples.forEach(e=>h+=`<div class="q"><b>${e[0]}</b><div class="muted">${e[1]}</div><button class="btn light" onclick="speak('${e[0].replace(/'/g,"\\'")}')">▶ 听</button></div>`)}
 h+='</div>';
 h+=`<div class="card"><h2>二、词汇 + 拼写 + 发音</h2><p class="muted">先听声音，再看 IPA，再看中文。最后把词放回句子里。</p>`;
 l.vocabulary.forEach(v=>h+=`<div class="word"><div><span class="en">${v[0]}</span><span class="ipa">${v[1]}</span><button class="btn light" onclick="speak('${v[0].replace(/'/g,"\\'")}')">▶ 发音</button></div><div>${v[2]}</div><div>${v[3]}</div><div class="muted">${v[4]}</div></div>`);h+='</div>';
 h+=`<div class="card"><h2>三、真实听力</h2><p>${l.listening.task}</p><ol><li>第一遍：不看文字，只听。</li><li>第二遍：打开 transcript，找出没听到的部分。</li><li>第三遍：关掉文字，重新听。</li><li>最后跟读。</li></ol><p class="muted">${l.listening.method}</p>${l.listening.official_resources.map(r=>`<p><a class="resource" target="_blank" href="${r.url}">打开 ${r.name} ↗</a></p>`).join('')}</div>`;
 h+=`<div class="card"><h2>四、口语</h2>`;l.speaking.forEach(x=>h+=`<div class="q"><b>${x}</b><br><button class="btn light" onclick="speak('${x.replace(/'/g,"\\'")}')">▶ 听示范</button></div>`);h+='</div>';
 h+=`<div class="card"><h2>五、阅读</h2><p style="line-height:1.85">${l.reading.text}</p>`;l.reading.questions.forEach(q=>h+=`<div class="q">${q}</div>`);h+='</div>';
 h+=`<div class="card"><h2>六、写作</h2><p>${l.writing}</p><textarea id="note" placeholder="你可以直接写，也可以写进实体笔记本。"></textarea></div>`;
 h+=`<div class="card"><h2>七、英语思维</h2><p>${l.thinking}</p></div><div class="card"><h2>八、语用与文化</h2><p>${l.pragmatics}</p></div>`;
 h+=`<div class="card"><h2>九、小测与验收</h2>`;l.assessment.forEach((q,i)=>h+=`<div class="q"><b>${i+1}. ${q.prompt}</b><p class="muted">先自己回答，再查看参考标准：${q.answer}</p></div>`);h+=`<p class="muted">验收标准：不是“看过”，而是你能自己解释、自己造句、自己听懂、自己说出来。</p></div>`;
 h+=`<div class="card"><h2>十、完成并进入下一课</h2><p>${l.review}</p><button class="btn ok" onclick="complete(${id})">${S.done[id]?'已完成，继续复习':'完成本课并解锁下一课'}</button></div>`;
 frame(h,'course')
}
function complete(id){
 S.done[id]={completedAt:Date.now()};S.current=Math.min(Math.max(S.current,id+1),LESSONS.length);S.review[id]=Date.now();save();today()
}
function review(){
 let now=Date.now(), ids=Object.keys(S.done).map(Number).filter(id=>{let t=S.done[id].completedAt;return REVIEW_INTERVALS.some(d=>Math.floor((now-t)/86400000)===d)}).sort((a,b)=>a-b);
 frame(`<div class="card"><h2>今天复习</h2><p>系统按照 1 / 3 / 7 / 14 / 30 天安排间隔复习。错过一天不会导致课程文件变化。</p>${ids.length?ids.map(id=>`<p><button class="btn light" onclick="openLesson(${id})">复习 Day ${id} · ${lesson(id).title}</button></p>`).join(''):'<p class="muted">今天没有到期复习。</p>'}</div>`,'review')
}
function resources(){
 frame(`<div class="card"><h2>真实英语资源</h2><p>这里不是你的课程目录。主线学习永远由“今天”自动安排；这里的资源只是为了提供真人原声、视频、transcript 等真实材料。</p>${RESOURCES.map(r=>`<div class="card"><b>${r.name}</b><p class="muted">${r.kind}</p><p>${r.license}</p><a class="resource" target="_blank" href="${r.url}">打开 ↗</a></div>`).join('')}</div>`,'resources')
}
function me(){
 frame(`<div class="card"><h2>我的学习</h2><p>当前课程：Day ${S.current}</p><p>已完成：${Object.keys(S.done).length} / ${LESSONS.length}</p><p>总体进度：${pct()}%</p><p class="muted">进度保存在当前浏览器。不要清除网站数据，否则本地进度可能被删除。</p><button class="btn light" onclick="if(confirm('确定清除全部学习进度？')){localStorage.removeItem(KEY);location.reload()}">清除进度</button></div>`,'me')
}
today();
