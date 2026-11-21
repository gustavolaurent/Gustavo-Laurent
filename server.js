import express from "express";
import path from "node:path";
import {fileURLToPath} from "node:url";

const app=express();
const root=path.dirname(fileURLToPath(import.meta.url));
const port=process.env.PORT||10000;
const ERP_BASE=String(process.env.ERP_BASE_URL||"https://treinta-gestion-integral-sn9h.onrender.com").replace(/\/$/,"");
app.disable("x-powered-by");
app.use(express.json({limit:"8mb"}));
app.use(express.static(path.join(root,"dist"),{index:false, maxAge:"1h"}));

const cookieName="treinta_erp_session";
const cookieOptions={httpOnly:true,secure:true,sameSite:"strict",path:"/api",maxAge:10*60*60*1000};
const safeUser=u=>({id:u.id,username:u.username,name:u.name,role:u.role,store:u.store||null,advisor:u.advisor||null});
app.get("/api/health",(req,res)=>res.json({ok:true,service:"treinta-asistencia-movil"}));

app.post("/api/auth/login",async(req,res)=>{
 try{
  const dni=String(req.body?.dni||"").replace(/\D/g,"");
  const password=String(req.body?.password||"");
  if(!/^\d{8}$/.test(dni)||!password)return res.status(400).json({error:"Ingresa tu DNI de 8 dígitos y contraseña."});
  const upstream=await fetch(ERP_BASE+"/api/mobile/login",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({dni,password}),signal:AbortSignal.timeout(15000)});
  const data=await upstream.json().catch(()=>({}));
  if(!upstream.ok)return res.status(upstream.status===401?401:502).json({error:data.error||"No se pudo validar el acceso en TREINTA."});
  if(!data.token||!data.user)return res.status(502).json({error:"El ERP no devolvió una sesión válida."});
  res.cookie(cookieName,data.token,cookieOptions);
  res.set("Cache-Control","no-store").json({user:safeUser(data.user)});
 }catch(e){console.error("mobile-login",e.message);res.status(502).json({error:"No se pudo conectar con el ERP. Intenta nuevamente."});}
});

app.post("/api/auth/logout",(req,res)=>{res.clearCookie(cookieName,{httpOnly:true,secure:true,sameSite:"strict",path:"/api"});res.status(204).end();});

const readRoutes=new Set([
 "/api/me",
 "/api/my-permissions",
 "/api/attendance-permissions",
 "/api/attendance-employees",
 "/api/attendance",
 "/api/attendance-schedules",
 "/api/mobile/coverage",
 "/api/mobile/me",
 "/api/mobile/marks",
 "/api/mobile/admin/links"
]);
app.get("/api/auth/session",async(req,res)=>{
 const token=req.cookies?.[cookieName]||parseCookies(req.headers.cookie)[cookieName];
 if(!token)return res.status(401).json({error:"Sesión no iniciada."});
 try{
  const upstream=await fetch(ERP_BASE+"/api/me",{headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:AbortSignal.timeout(12000)});
  const data=await upstream.json().catch(()=>({}));
  if(!upstream.ok){res.clearCookie(cookieName,{httpOnly:true,secure:true,sameSite:"strict",path:"/api"});return res.status(401).json({error:"La sesión del ERP venció."});}
  res.set("Cache-Control","no-store").json({user:safeUser(data.user)});
 }catch(e){res.status(502).json({error:"No se pudo validar la sesión con el ERP."});}
});
function parseCookies(raw=""){return Object.fromEntries(raw.split(";").map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.indexOf("=");return [decodeURIComponent(x.slice(0,i)),decodeURIComponent(x.slice(i+1))]}));}

app.all("/api/erp/*",async(req,res)=>{
 const target="/api/"+req.params[0];
 const allowed=readRoutes.has(target)||(target==="/api/mobile/marks"&&["GET","POST"].includes(req.method))||(target==="/api/mobile/admin/links"&&req.method==="GET")||(target.startsWith("/api/mobile/admin/links/")&&Number.isInteger(Number(target.split("/").pop()))&&req.method==="PUT");
 if(!allowed)return res.status(404).json({error:"Ruta no disponible desde la app móvil."});
 const token=parseCookies(req.headers.cookie)[cookieName];
 if(!token)return res.status(401).json({error:"Inicia sesión nuevamente."});
 try{
  const url=new URL(ERP_BASE+target);
  for(const [k,v] of Object.entries(req.query))if(typeof v==="string")url.searchParams.set(k,v);
  const upstream=await fetch(url,{method:req.method,headers:{Authorization:"Bearer "+token,Accept:"application/json",...(req.method!=="GET"?{"Content-Type":"application/json"}:{})},...(req.method!=="GET"?{body:JSON.stringify(req.body||{})}:{}),signal:AbortSignal.timeout(25000)});
  const body=await upstream.text();
  res.status(upstream.status).set("Cache-Control","private, no-store").type(upstream.headers.get("content-type")||"application/json").send(body);
 }catch(e){console.error("erp-proxy",target,e.message);res.status(502).json({error:"No se pudo consultar TREINTA."});}
});

app.get("*",(req,res)=>res.sendFile(path.join(root,"dist","index.html")));
app.listen(port,"0.0.0.0",()=>console.log("TREINTA Asistencia móvil escuchando en "+port));
