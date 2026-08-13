import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : null;

async function sendMessage(chatId:number|string,text:string,replyMarkup?:unknown){
 if(!API) throw new Error('TELEGRAM_BOT_TOKEN is not configured');
 await fetch(`${API}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chatId,text,parse_mode:'HTML',reply_markup:replyMarkup})});
}

export async function POST(request:Request){
 if(!BOT_TOKEN) return NextResponse.json({error:'Bot is not configured'},{status:503});
 try{
  const update=await request.json(); const message=update?.message; if(!message?.chat?.id) return NextResponse.json({ok:true});
  const chatId=message.chat.id; const text=String(message.text||'').trim();
  if(text.startsWith('/start')){
   await sendMessage(chatId,'<b>Assalomu alaykum! Imkon</b> — sizga mos ish, stajirovka, grant va bepul kurslarni topishga yordam beradi.\n\nBoshlash uchun yo‘nalishingizni tanlang.',{inline_keyboard:[[{text:'💼 Ish',callback_data:'type:Ish'},{text:'🎓 Stajirovka',callback_data:'type:Stajirovka'}],[{text:'💰 Grant',callback_data:'type:Grant'},{text:'📚 Kurs',callback_data:'type:Kurs'}]]});
  } else if(text==='/help') await sendMessage(chatId,'Imkon botida /start buyrug‘i bilan boshlang.');
  else await sendMessage(chatId,'Men sizga mos imkoniyatlarni topishga yordam beraman. /start ni bosing.');
  return NextResponse.json({ok:true});
 }catch(error){console.error(error);return NextResponse.json({error:'Webhook error'},{status:500});}
}
