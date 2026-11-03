# Sajha Kaam Hackathon Kit: start here

| Folder / file | What it is |
|---|---|
| `sajha-kaam/` | The app: `backend/` (FastAPI) and `mobile/` (Expo, Mauri "deep" v2 design) |
| `sajha-kaam/docs/AI_AND_DESIGN_RESEARCH.md` | Research: how to add AI that feels necessary, what to avoid, design rules, roadmap |
| `sajha-kaam/docs/BRAND.md` | Mauri, colour, fonts, icons, motion, layout rules |
| `sajha-kaam/docs/screens/` | Screenshots of the running app (English + Nepali) |
| `sajha-kaam/CHANGES_MAURI.md` | Everything changed in the Mauri and v2 updates |
| `Sajha_Kaam/` | Strategy, pitch, architecture, prompts, diagrams, prototype |
| `sajha-kaam-slides/` | Remotion pitch video (`out/sajha-kaam.mp4`) |
| `command.md` | Step-by-step PowerShell commands |
| `requirements.txt` | Backend Python packages |

## Run it (Windows PowerShell)

```powershell
pip install -r requirements.txt
.\sajha-kaam\backend\start.ps1          # API on http://localhost:8000 (demo mode)

cd sajha-kaam\mobile
npm install                              # needed: fonts and icons changed
npm run check
npx expo start -c
```

Set `EXPO_PUBLIC_API_URL` in `sajha-kaam/mobile/.env` (see `.env.example`) to your laptop's address so a phone can reach the API.
