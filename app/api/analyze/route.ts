const prompt = idea
? `
You are Oracle Evolution X.

Analyze the user's idea and predict real-world success.

User idea:

${idea}

Trending discussions:

${titles.join("\n")}

Return STRICT JSON ONLY:

{
 "mode":"idea",

 "name":"",

 "score":85,

 "success_probability":70,
 "time_to_first_sale":"7-14 days",

 "market_heat":"rising / stable / explosive",
 "buyer_intent":"low / medium / high",

 "why_trending":"",
 "pain_signal":"",
 "hidden_signal":"",

 "execution":{
   "day1":"",
   "week1":"",
   "first_revenue":""
 },

 "monetization":"",
 "competition":""
}
`