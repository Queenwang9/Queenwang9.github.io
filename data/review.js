
window.REVIEW_INTERVALS=[1,3,7,14,30];
window.reviewDue=function(record,now=Date.now()){
 if(!record||!record.completedAt)return false;
 const d=Math.floor((now-record.completedAt)/86400000);
 return window.REVIEW_INTERVALS.includes(d);
};
