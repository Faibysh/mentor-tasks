export function createBoxes(e){const o=document.getElementById("boxes"),t=o.children,n=t.length;if(e>n)for(let t=n;t<e;t++){const e=document.createElement("div");e.style.width=30+10*t+"px",e.style.height=30+10*t+"px",e.style.backgroundColor=getRandomColor(),o.appendChild(e)}else if(e<n)for(let r=n-1;r>=e;r--)o.removeChild(t[r]);else for(let e=0;e<n;e++)t[e].style.backgroundColor=getRandomColor();document.querySelector(".js-input").value=""}export function destroyBoxes(){document.getElementById("boxes").innerHTML=""}function getRandomColor(){return`rgb(${Math.floor(256*Math.random())}, ${Math.floor(256*Math.random())}, ${Math.floor(256*Math.random())})`}