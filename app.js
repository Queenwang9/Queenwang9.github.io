
const SKEY='englishHomeV3State';
let state=JSON.parse(localStorage.getItem(SKEY)||'null')||{current:1,done:[],scores:{},mistakes:[],reviews:[],favorites:[]};
function save(){localStorage.setItem(SKEY,JSON.stringify(state))}
function lesson(d){return LESSONS.find(x=>x.day===d)||LESSONS[0]}
function pct(){return Math.round(state.done.length/LESSONS.length*100)}
function speak(t){if(!('speechSynthesis'in window)){toast('你的浏览器不支持朗读');return} speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}
function toast(t){let e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1800)}
function layout(content,title='英语之家'){document.getElementById('app').innerHTML=`<div class="top"><h1>${title}</h1><small>你的个人英语课程 · 自动保存进度</small></div><main class="page">${content}</main><div class="nav"><button onclick="home()"><b>⌂</b>今天</button><button onclick="course()"><b>☷</b>课程</button><button onclick="review()"><b>↻</b>复习</button><button onclick="more()"><b>⋯</b>我的</button></div>`}
function home(){
 let l=lesson(state.current), done=state.done.includes(l.day), p=Math.round((state.current-1)/LESSONS.length*100);
 layout(`<section class="hero"><span class="tag">${l.level}</span><h2>Day ${l.day} · ${l.title}</h2><p>${l.objective}</p><div class="progress"><i style="width:${p}%"></i></div><small>课程进度 ${p}% · 已完成 ${state.done.length}/${LESSONS.length} 课</small></section>
 <div class="grid"><button class="btn" onclick="startLesson(${l.day})">${done?'重新学习':'开始今天的课'}</button><button class="btn light" onclick="course()">查看完整课程地图</button></div>
 <div class="card"><h3>今天你只需要做这 11 步</h3>${l.steps.map((s,i)=>`<div class="step"><h3>${s.title}</h3><div>${s.body}</div></div>`).join('')}</div>
 <div class="card"><h3>学习规则</h3><p>不要一次把所有东西背完。每一步完成后再进入下一步；小测低于80%会提示你回到薄弱环节。完成本课后，下一课自动解锁。</p></div>`)
}
function startLesson(d){
 let l=lesson(d);
 layout(`<div class="card"><span class="tag">${l.level}</span><h2>Day ${d} · ${l.title}</h2><p>${l.objective}</p></div>
 <div class="card"><h3>① 先理解</h3><p>${l.steps[0].body}</p><p><b>本课核心：</b>${l.examples}</p></div>
 <div class="card"><h3>② 词汇与拼写</h3><p>${l.vocab}</p><button class="btn light" onclick="speak('${esc(l.vocab)}')">🔊 听发音</button><p class="muted">做法：看词 → 听 → 跟读 → 遮住词写一遍。</p></div>
 <div class="card"><h3>③ 发音</h3><p>${l.steps[2].body}</p><button class="btn" onclick="speak('${esc(l.examples)}')">🔊 朗读本课示例</button></div>
 <div class="card"><h3>④ 语法</h3><p>${l.grammar}</p></div>
 <div class="card"><h3>⑤ 听力</h3><p>先不要看下面文字。点击朗读，听1遍；再看文字听第2遍；最后关掉声音，自己复述大意。</p><button class="btn" onclick="speak('${esc(l.examples+' '+l.objective)}')">🔊 开始听力</button></div>
 <div class="card"><h3>⑥ 阅读</h3><p>${l.examples}</p><p>${l.objective}</p></div>
 <div class="card"><h3>⑦ 口语</h3><p>用本课主题说30–60秒。至少说3句。不会的词先用简单词代替，不要停下来查每一个词。</p><button class="btn light" onclick="speak('${esc(l.examples)}')">🔊 先听示范</button></div>
 <div class="card"><h3>⑧ 写作</h3><p>在纸上写3–5句与本课有关的英语。写完自己检查：主语、动词、时态、拼写。</p></div>
 <div class="card"><h3>⑨ 英语思维</h3><p>先想一个你真实想表达的中文意思，再用最简单的英语表达。禁止逐字翻译。</p></div>
 <div class="card quiz"><h3>⑩ 小测</h3><p>根据本课内容回答：<b>${quizQuestion(l)}</b></p><input id="ans" placeholder="输入你的答案"><button class="btn" onclick="checkQuiz(${d})">提交</button><p id="result"></p></div>
 <div class="card"><h3>⑪ 完成本课</h3><p>只有完成小测后再点完成。系统会把下一课解锁，并把今天加入复习队列。</p><button class="btn ok" onclick="finishLesson(${d})">${state.done.includes(d)?'已完成，进入下一课':'完成本课并解锁下一课'}</button></div>`)
}
function esc(s){return String(s).replace(/'/g,"\\'").replace(/\n/g,' ')}
function quizQuestion(l){
 if(l.day===1)return '“我很累。”用英文怎么说？';
 if(l.day===2)return '“我住在青岛。”用英文怎么说？';
 if(l.day===3)return '“她喜欢咖啡。”用英文怎么说？';
 if(l.day===4)return '“你住在青岛吗？”用英文怎么说？';
 if(l.day===5)return '“你住在哪里？”用英文怎么说？';
 if(l.day===6)return '“我是一个学生。”为什么要用 a？请写出完整句子。';
 if(l.day===7)return '“这是我的手机。”用英文怎么说？';
 if(l.day===8)return '“这里有一家商店。”用英文怎么说？';
 if(l.day===9)return '“我8点工作。”用英文怎么说？';
 if(l.day===10)return '“我会说一点英语。”用英文怎么说？';
 if(l.day===11)return '“我正在学习英语。”用英文怎么说？';
 return '请用本课主题写一句完整英文句子。';
}
const answers={1:['i am tired',"i'm tired"],2:['i live in qingdao'],3:['she likes coffee'],4:['do you live in qingdao'],5:['where do you live'],6:['i am a student',"i'm a student"],7:['this is my phone'],8:['there is a shop'],9:['i work at 8'],10:['i can speak a little english'],11:['i am learning english',"i'm learning english"]};
function checkQuiz(d){
 let v=document.getElementById('ans').value.trim().toLowerCase().replace(/[?.!]/g,'');
 let ok=answers[d]?answers[d].includes(v):v.length>=8;
 state.scores[d]=ok?100:0;if(!ok)state.mistakes.unshift({day:d,answer:v,date:Date.now()});save();
 document.getElementById('result').innerHTML=ok?'✅ 正确。可以继续。':'❌ 这次先不要硬背。回到本课的①②④再看一次，然后重新回答。';
}
function finishLesson(d){
 if(state.scores[d]!==100){toast('先通过本课小测（80%以上）');return}
 if(!state.done.includes(d))state.done.push(d);
 if(d===state.current)state.current=Math.min(d+1,LESSONS.length);
 state.reviews.push({day:d,next:Date.now()+86400000});
 save();toast('本课完成，下一课已解锁');setTimeout(home,500)
}
function course(){
 let html=`<div class="card"><h2>完整课程地图</h2><p>一次安装后，课程全部在这里。你不需要每天上传新文件。</p></div><div class="list">`;
 LESSONS.forEach(l=>{
   let unlocked=l.day<=state.current, done=state.done.includes(l.day);
   html+=`<button class="${unlocked?'':'lock'}" ${unlocked?`onclick="startLesson(${l.day})"`:''}><b>Day ${l.day} · ${l.title}</b><br><small>${l.level} · ${done?'✅ 已完成':unlocked?'▶ 可学习':'🔒 完成前一课后解锁'}</small></button>`
 });html+='</div>';layout(html,'课程地图')
}
function review(){
 let due=state.reviews.filter(x=>x.next<=Date.now());
 layout(`<div class="card"><h2>今日复习</h2><p>复习不是重新上课，而是把快要忘掉的内容主动想起来。</p><h3>待复习：${due.length} 项</h3><button class="btn" onclick="reviewNow()">开始复习</button></div><div class="card"><h3>复习节奏</h3><p>完成当天 → 次日 → 第3天 → 第7天 → 第14天 → 第30天。系统会根据你的完成时间安排。</p></div>`)
}
function reviewNow(){
 let due=state.reviews.filter(x=>x.next<=Date.now());
 if(!due.length){toast('今天暂时没有到期复习');return}
 let l=lesson(due[0].day);layout(`<div class="card"><span class="tag">${l.level}</span><h2>复习 Day ${l.day} · ${l.title}</h2><p>${l.objective}</p><button class="btn" onclick="speak('${esc(l.examples)}')">🔊 听一遍</button><hr><p><b>闭眼回忆：</b>不看资料，说出本课至少3个关键词和1个完整句子。</p><button class="btn ok" onclick="completeReview(${due[0].day})">我想起来了，完成复习</button></div>`)
}
function completeReview(d){state.reviews=state.reviews.filter(x=>x.day!==d);save();toast('复习完成');setTimeout(review,400)}
function more(){
 layout(`<div class="card"><h2>我的学习数据</h2><p>总课程：${LESSONS.length}</p><p>已完成：${state.done.length}</p><p>总进度：${pct()}%</p><p>错题记录：${state.mistakes.length}</p></div>
 <div class="card"><h3>10项能力线</h3><p>${['发音','拼写','词汇','语法','听力','口语','阅读','写作','英语思维','语用与文化'].map(x=>`<span class="tag">${x}</span>`).join('')}</p></div>
 <div class="card"><h3>外部真实资源</h3>${RESOURCES.map(r=>`<p><a href="${r.url}" target="_blank">${r.title}</a><br><small>${r.level} · ${r.desc}</small></p>`).join('')}</div>
 <div class="card"><button class="btn light" onclick="resetAll()">重置学习进度</button><p class="muted">只有你主动点这里才会清空，不会因为更新页面丢失进度。</p></div>`)
}
function resetAll(){if(confirm('确定清空全部学习进度吗？')){localStorage.removeItem(SKEY);location.reload()}}
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
home();
