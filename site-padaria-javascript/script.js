// Personalize os dados da padaria nesta área.
const STORE={whatsapp:""}; // Ex.: "5511999999999" (somente números)
const products=[
{id:1,name:"Pão francês",cat:"Pães",price:.90,unit:"unidade",tag:"MAIS PEDIDO",desc:"Casquinha crocante e miolo macio.",img:"photo-1585478259715-876acc5be8eb"},
{id:2,name:"Pão artesanal",cat:"Pães",price:18.90,unit:"unidade",tag:"ARTESANAL",desc:"Fermentação lenta e sabor especial.",img:"photo-1589367920969-ab8e050bbb04"},
{id:3,name:"Pão de queijo",cat:"Salgados",price:3.50,unit:"unidade",tag:"CASEIRO",desc:"Douradinho por fora, macio por dentro.",img:"photo-1528207776546-365bb710ee93"},
{id:4,name:"Croissant",cat:"Salgados",price:8.50,unit:"unidade",tag:"FOLHADO",desc:"Massa amanteigada e leve.",img:"photo-1555507036-ab1f4038808a"},
{id:5,name:"Bolo de cenoura",cat:"Bolos",price:32,unit:"unidade",tag:"FAVORITO",desc:"Com cobertura cremosa de chocolate.",img:"photo-1578985545062-69928b1d9587"},
{id:6,name:"Bolo de chocolate",cat:"Bolos",price:38,unit:"unidade",tag:"ESPECIAL",desc:"Massa fofinha com muito chocolate.",img:"photo-1606890737304-57a1ca8a5b62"},
{id:7,name:"Sonho de creme",cat:"Doces",price:7,unit:"unidade",tag:"DOCINHO",desc:"Recheio de creme e açúcar delicado.",img:"photo-1509365465985-25d11c17e812"},
{id:8,name:"Cookie de chocolate",cat:"Doces",price:6.5,unit:"unidade",tag:"FEITO HOJE",desc:"Borda crocante e centro macio.",img:"photo-1499636136210-6f4ee915583e"},
{id:9,name:"Café coado",cat:"Bebidas",price:5,unit:"xícara",tag:"NA HORA",desc:"Café fresquinho passado na hora.",img:"photo-1495474472287-4d71bcdd2085"},
{id:10,name:"Cappuccino",cat:"Bebidas",price:9,unit:"xícara",tag:"CREMOSO",desc:"Café, leite vaporizado e canela.",img:"photo-1570968915860-54d5c301fa9f"},
{id:11,name:"Empada de frango",cat:"Salgados",price:7.5,unit:"unidade",tag:"SALGADO",desc:"Massa delicada e recheio cremoso.",img:"photo-1608039829572-78524f79c4c7"},
{id:12,name:"Torta de morango",cat:"Doces",price:12,unit:"fatia",tag:"DELICADA",desc:"Creme suave e morangos frescos.",img:"photo-1488477181946-6428a0291777"}];
const $=s=>document.querySelector(s),money=n=>Number(n).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let category="Todos",cart=JSON.parse(localStorage.getItem("paoAfetoCart")||"[]"),toastTimer;
function renderProducts(){let q=$("#search").value.toLowerCase();let list=products.filter(p=>(category==="Todos"||p.cat===category)&&(p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)));$("#products").innerHTML=list.map(p=>`<article class="card"><div class="photo" style="background-image:url('https://images.unsplash.com/${p.img}?auto=format&fit=crop&w=700&q=80')"><span class="tag">${p.tag}</span></div><div class="info"><h3>${p.name}</h3><p>${p.desc}</p><div class="buy"><b>${money(p.price)} <small>/ ${p.unit}</small></b><button class="add" data-add="${p.id}">+</button></div></div></article>`).join("");$("#empty").classList.toggle("hidden",list.length>0)}
function details(){return cart.map(i=>({...products.find(p=>p.id===i.id),qty:i.qty})).filter(p=>p.id)}
function total(){return details().reduce((s,p)=>s+p.price*p.qty,0)}
function save(){localStorage.setItem("paoAfetoCart",JSON.stringify(cart));renderCart()}
function renderCart(){let d=details();$("#cartCount").textContent=d.reduce((s,p)=>s+p.qty,0);$("#total").textContent=money(total());$("#modalTotal").textContent=money(total());$("#cartItems").innerHTML=d.length?d.map(p=>`<div class="cartRow"><div><strong>${p.name}</strong><small>${money(p.price)} / ${p.unit}</small></div><div class="qty"><button data-id="${p.id}" data-delta="-1">−</button><b>${p.qty}</b><button data-id="${p.id}" data-delta="1">+</button></div></div>`).join(""):'<p class="empty">Sua sacola está vazia. Escolha algumas delícias!</p>';$("#checkout").disabled=!d.length;$("#checkout").style.opacity=d.length?1:.5}
function toast(msg){let t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}
function openCart(){$("#drawer").classList.add("open");$("#overlay").classList.remove("hidden")}
function closeCart(){$("#drawer").classList.remove("open");$("#overlay").classList.add("hidden")}
$("#filters").addEventListener("click",e=>{let b=e.target.closest("[data-cat]");if(!b)return;category=b.dataset.cat;document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
$("#search").addEventListener("input",renderProducts);
$("#products").addEventListener("click",e=>{let b=e.target.closest("[data-add]");if(!b)return;let id=Number(b.dataset.add),item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();toast("Produto adicionado à sacola!")});
$("#cartItems").addEventListener("click",e=>{let b=e.target.closest("[data-id]");if(!b)return;let item=cart.find(x=>x.id===Number(b.dataset.id));item.qty+=Number(b.dataset.delta);cart=cart.filter(x=>x.qty>0);save()});
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;
$("#checkout").onclick=()=>{if(cart.length){closeCart();$("#modal").classList.remove("hidden")}};
$("#closeModal").onclick=()=>$("#modal").classList.add("hidden");
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")$("#modal").classList.add("hidden")});
$("#menuToggle").onclick=()=>$("#nav").classList.toggle("show");
$("#nav").addEventListener("click",e=>{if(e.target.tagName==="A")$("#nav").classList.remove("show")});
$("#orderForm").addEventListener("submit",e=>{e.preventDefault();let f=new FormData(e.currentTarget),lines=details().map(p=>`${p.qty}x ${p.name} — ${money(p.price*p.qty)}`);let msg=[`PEDIDO - Pão & Afeto`,`Cliente: ${f.get("name")}`,`Telefone: ${f.get("phone")}`,`Recebimento: ${f.get("delivery")}`,"",...lines,"",`TOTAL: ${money(total())}`,`Observações: ${f.get("notes")||"Nenhuma"}`].join("\n");if(STORE.whatsapp){window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank","noopener")}else{let blob=new Blob([msg],{type:"text/plain"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="pedido-padaria.txt";a.click();URL.revokeObjectURL(a.href);toast("Resumo do pedido baixado. Configure o WhatsApp no script.js.")}$("#modal").classList.add("hidden");e.currentTarget.reset();cart=[];save()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();$("#modal").classList.add("hidden")}});
$("#year").textContent=new Date().getFullYear();renderProducts();renderCart();