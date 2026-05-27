# User Interviews

Three informal interviews conducted via WhatsApp on 2026-05-26, each approximately 10 minutes. All users are students in my college network.

---

## Interview 1 — Shaikh Afaq Ahmed

**Name:** Shaikh Afaq Ahmed
**Role:** College student
**Company Stage:** Individual / personal use

**Background:**
Afaq is a college student who uses AI tools occasionally for general tasks. I reached out over WhatsApp and asked him a few questions about his AI tool usage.

**Direct Quotes:**
- "Jayda nai yaro, kabhi kabhi" (Not much, only sometimes)
- "Gareeb hu" (I'm broke — when asked if he'd pay for a subscription)
- "Nai yaro" (when asked if he'd ever consider a paid plan)

**Most Surprising Thing:**
Afaq didn't know what plan he was on at all — he just said "Normal" when I asked if he was on paid or free. He had no idea there were different tiers. This was unexpected because even casual users I assumed would know whether they were paying or not. He genuinely had zero visibility into his own usage.

**What It Changed About My Design:**
This made me realize the plan confusion problem is real even among light users. I added clearer plan labels and short descriptions in the audit form so users don't have to guess what plan they're on — they can just read the description and recognize their situation.

---

## Interview 2 — Noman Ahmed.

**Name:** Noman Ahmed
**Role:** College student
**Company Stage:** Individual / personal use

**Background:**
Noman uses both ChatGPT and Gemini for everyday tasks. He reached out when I asked in a group, and we chatted over WhatsApp.

**Direct Quotes:**
- "Chatgpt ya gemini" (when asked which AI he uses most)
- "Wo gemini jio users ku thode months ka premium diyaa naa" (Gemini gave Jio users a few months of premium for free)
- "Free me hojata bahot sa kaam" (Most work gets done in the free version)
- "Hmm dekhna abhi toh nahi" (when asked if he'd consider paying — "I'll see, not right now")

**Most Surprising Thing:**
He got Gemini Premium for free through a Jio telecom promotion and didn't even seek it out — it just appeared. He didn't know the actual value of what he was using. This was surprising because it means some users are on "paid-equivalent" plans without realizing it, which completely changes how they perceive value.

**What It Changed About My Design:**
I added a note in the audit results to flag when a user might be on a promotional plan — so the audit doesn't recommend "upgrade to Gemini Pro" to someone who's already on it for free through a carrier deal.

---

## Interview 3 — Mohammed Khaled

**Name:** Mohammed Khaled
**Role:** College student
**Company Stage:** Individual / daily academic use

**Background:**
Khaled uses AI tools daily for studying — both ChatGPT and Gemini regularly. He's on free plans for both but actively thinking about going Pro in the future.

**Direct Quotes:**
- "I use both ChatGPT and Gemini almost every day for studying"
- "Both are free right now but I'm thinking about getting Pro someday"
- "I don't really know which one is better value if I had to pay"

**Most Surprising Thing:**
Khaled uses two tools simultaneously for the same use case — studying — without any clear reason for using both. He couldn't explain why he uses one over the other on a given day. It was just habit. This was surprising because I assumed people would pick one tool and stick with it, but Khaled showed that tool fragmentation happens even at the individual level.

**What It Changed About My Design:**
This pushed me to add a "primary use case" field in the audit form and include a recommendation for users who are running redundant tools. The audit engine now flags overlapping tools with similar capabilities and suggests consolidating to one.