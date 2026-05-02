# MeraDiet AI — Deploy Guide

## Aapki website live karne ke steps:

### Step 1: GitHub pe upload karo
1. github.com pe jao → New repository banao → "meradiet" naam do
2. Files upload karo (yeh saari files)

### Step 2: Vercel pe deploy karo
1. vercel.com pe jao → "Add New Project"
2. GitHub se connect karo → meradiet repo chuniye
3. Deploy dabao

### Step 3: API Key add karo (ZAROORI)
1. Vercel dashboard mein → Settings → Environment Variables
2. Yeh add karo:
   - Name: GEMINI_API_KEY
   - Value: [Aapki nayi Google AI Studio key yahan daalo]
3. Save karo → Redeploy karo

### Done! Aapki website live hai 🎉

## Folder structure:
```
meradiet/
├── public/
│   └── index.html     (poori website)
├── api/
│   └── plan.js        (AI backend)
└── vercel.json        (configuration)
```

## Important:
- API key kabhi bhi public mat karo
- Sirf Vercel Environment Variables mein daalo
- Free tier mein 100GB bandwidth milta hai
