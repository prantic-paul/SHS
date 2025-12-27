# 🚀 Quick Start - Medical Chatbot (SIMPLIFIED!)

## ⚡ Super Simple Setup (One Command!)

### **Step 1: Run the Setup Script**
```bash
./start_chatbot.sh
```

That's it! The script will:
- ✅ Check your API keys (help you add them if missing)
- ✅ Setup both services automatically
- ✅ Install all dependencies
- ✅ Index documents if needed
- ✅ Start everything for you!

---

## 🔑 API Keys Needed

The script will help you, but here's what you need:

1. **Pinecone API Key**
   - Get it from: https://www.pinecone.io/
   - Sign up → Copy API key

2. **Google AI API Key**
   - Get it from: https://makersuite.google.com/app/apikey
   - Click "Create API Key" → Copy it

---

## ✅ Test Your Setup

After the setup script finishes, run:

```bash
./test_chatbot.sh
```

This will test everything and show you if it's working!

---

## 🎯 Your API Endpoint

Once running, your endpoint is:

```
POST http://localhost:8000/api/v1/chat/medical/
```

### Quick Test with curl:

```bash
# 1. Login (replace with your email/password)
curl -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"password"}'

# 2. Copy the "access" token from response

# 3. Chat (replace YOUR_TOKEN)
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What is diabetes?"}'
```

---

## 📱 Use in Your Code

### JavaScript/TypeScript:
```javascript
const response = await fetch('http://localhost:8000/api/v1/chat/medical/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${yourToken}`
  },
  body: JSON.stringify({
    message: "What are symptoms of diabetes?"
  })
});

const data = await response.json();
console.log(data.answer);
```

### Python:
```python
import requests

response = requests.post(
    'http://localhost:8000/api/v1/chat/medical/',
    json={"message": "What is diabetes?"},
    headers={"Authorization": f"Bearer {your_token}"}
)

print(response.json()['answer'])
```

---

## 🔧 Managing Services

### Using tmux (automatic):
```bash
# View running services
tmux attach -t medical-chatbot

# Detach (Ctrl+B then D)
# Services keep running in background

# Stop everything
tmux kill-session -t medical-chatbot
```

### Without tmux:
Services run in background. Check logs:
```bash
tail -f logs/ai-service.log
tail -f logs/backend.log
```

---

## 🆘 Troubleshooting

### "API keys not found"
→ Edit `ai-service/.env` and add your keys

### "Services not starting"
→ Make sure ports 8000 and 8001 are free
→ Check logs for errors

### "Connection refused"
→ Run `./start_chatbot.sh` to start services
→ Wait 10 seconds for services to be ready

### "Login failed"
→ Create a user first:
```bash
cd backend
source venv/bin/activate
python manage.py createsuperuser
```

---

## 📖 More Documentation

- **CHATBOT_API_READY.md** - Complete API reference
- **backend/API_DOCUMENTATION.md** - Detailed docs
- **ai-service/README.md** - AI service docs

---

## ⚡ Summary

```bash
# Setup everything (first time):
./start_chatbot.sh

# Test it:
./test_chatbot.sh

# Use it:
POST http://localhost:8000/api/v1/chat/medical/
```

**That's it!** 🎉

Your medical chatbot is ready to use in 3 commands!
