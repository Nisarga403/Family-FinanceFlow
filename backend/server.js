
require('dotenv').config();
const express = require('express');
const cors =require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');
const { GoogleGenAI, Type } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY = process.env.API_KEY;

if (!JWT_SECRET || !API_KEY) {
    console.error("FATAL ERROR: JWT_SECRET or API_KEY is not defined in the .env file.");
    process.exit(1);
}

// Initialize DB
db.initDB();

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for potential large payloads

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid or has expired.' });
        }
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const [existingUsers] = await db.pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = bcrypt.hashSync(password, 8);
        const [result] = await db.pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        const newUserId = result.insertId;
        const defaultBudgets = [
            { category: 'Groceries', amount: 15000 }, { category: 'Dining Out', amount: 5000 },
            { category: 'Shopping', amount: 8000 }, { category: 'Transportation', amount: 3000 },
            { category: 'Entertainment', amount: 4000 }, { category: 'Health', amount: 2000 },
            { category: 'Agriculture', amount: 1000 },
        ];
        const budgetPromises = defaultBudgets.map(b => db.pool.query('INSERT INTO budgets (user_id, category, amount) VALUES (?, ?, ?)', [newUserId, b.category, b.amount]));
        await Promise.all(budgetPromises);
        const token = jwt.sign({ id: newUserId, email: email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, message: 'Account created successfully!' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const [users] = await db.pool.query('SELECT id, email, password FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid password.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Signin Error:', error);
        res.status(500).json({ message: 'An error occurred during signin.' });
    }
});


// --- Data Routes (Protected) ---
app.get('/api/data', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [transactions] = await db.pool.query('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [userId]);
        const [budgets] = await db.pool.query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
        const [familyMembers] = await db.pool.query('SELECT * FROM family_members WHERE user_id = ?', [userId]);
        const [goals] = await db.pool.query('SELECT * FROM goals WHERE user_id = ?', [userId]);
        const [recurringPayments] = await db.pool.query('SELECT * FROM recurring_payments WHERE user_id = ?', [userId]);
        const [accounts] = await db.pool.query('SELECT * FROM accounts WHERE user_id = ?', [userId]);
        const [investments] = await db.pool.query('SELECT * FROM investments WHERE user_id = ?', [userId]);
        const [debts] = await db.pool.query('SELECT * FROM debts WHERE user_id = ?', [userId]);
        res.status(200).json({ transactions, budgets, familyMembers, goals, recurringPayments, accounts, investments, debts });
    } catch (error) {
        console.error('Get Data Error:', error);
        res.status(500).json({ message: 'Failed to load user data.' });
    }
});

app.put('/api/data', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { transactions, budgets, familyMembers, goals, recurringPayments, accounts, investments, debts } = req.body;
    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();
        const tables = ['transactions', 'budgets', 'family_members', 'goals', 'recurring_payments', 'accounts', 'investments', 'debts'];
        for (const table of tables) {
            await connection.query(`DELETE FROM ${table} WHERE user_id = ?`, [userId]);
        }
        if (transactions && transactions.length) {
            const values = transactions.map(t => [userId, t.description, t.amount, new Date(t.date), t.type, t.category, t.member]);
            await connection.query('INSERT INTO transactions (user_id, description, amount, date, type, category, member) VALUES ?', [values]);
        }
        if (budgets && budgets.length) {
            const values = budgets.map(b => [userId, b.category, b.amount]);
            await connection.query('INSERT INTO budgets (user_id, category, amount) VALUES ?', [values]);
        }
        if (familyMembers && familyMembers.length) {
            const values = familyMembers.map(m => [userId, m.name, m.gender]);
            await connection.query('INSERT INTO family_members (user_id, name, gender) VALUES ?', [values]);
        }
        if (goals && goals.length) {
            const values = goals.map(g => [userId, g.name, g.targetAmount, g.currentAmount]);
            await connection.query('INSERT INTO goals (user_id, name, targetAmount, currentAmount) VALUES ?', [values]);
        }
        if (recurringPayments && recurringPayments.length) {
            const values = recurringPayments.map(p => [userId, p.description, p.amount, p.dueDay]);
            await connection.query('INSERT INTO recurring_payments (user_id, description, amount, dueDay) VALUES ?', [values]);
        }
        if (accounts && accounts.length) {
            const values = accounts.map(a => [userId, a.name, a.type, a.balance]);
            await connection.query('INSERT INTO accounts (user_id, name, type, balance) VALUES ?', [values]);
        }
        if (investments && investments.length) {
            const values = investments.map(i => [userId, i.name, i.type, i.quantity, i.purchasePrice, i.currentValue]);
            await connection.query('INSERT INTO investments (user_id, name, type, quantity, purchasePrice, currentValue) VALUES ?', [values]);
        }
        if (debts && debts.length) {
            const values = debts.map(d => [userId, d.name, d.type, d.totalAmount, d.amountPaid, d.interestRate, d.minPayment]);
            await connection.query('INSERT INTO debts (user_id, name, type, totalAmount, amountPaid, interestRate, minPayment) VALUES ?', [values]);
        }
        await connection.commit();
        res.status(200).json({ message: "Data saved successfully." });
    } catch (error) {
        await connection.rollback();
        console.error('Save Data Error:', error);
        res.status(500).json({ message: 'Failed to save user data.' });
    } finally {
        connection.release();
    }
});

// --- AI Routes (Protected) ---
const aiRouter = express.Router();
aiRouter.use(authenticateToken);

const AI_API_KEY_ERROR_MESSAGE = "An unexpected error occurred while communicating with the AI. Please check the backend server logs for more details and ensure your Google Gemini API key is correctly configured in the .env file.";
const AI_EMPTY_RESPONSE_MESSAGE = "The AI responded, but the message was empty. This can happen due to the AI's safety filters. Please try rephrasing your request.";

const handleAiError = (res, error, featureName) => {
    console.error(`AI ${featureName} Error:`, error.message); // Log the full error for debugging
    let userMessage = AI_API_KEY_ERROR_MESSAGE; // Default message

    // Check for specific API key invalid error from Gemini SDK
    if (error.message && error.message.toLowerCase().includes('api key not valid')) {
        const keySnippet = API_KEY.length > 4 ? '...' + API_KEY.substring(API_KEY.length - 4) : '...';
        userMessage = `The AI service rejected your API key (ending in ${keySnippet}). The key appears to be invalid or expired.

**How to Fix:**
1. Go to Google AI Studio to create a new, valid API key.
2. Paste the new key into your \`backend/.env\` file.
3. **Important:** Restart the backend server to apply the change.`;
    } else if (error.message && error.message.toLowerCase().includes('fetch')) {
         userMessage = `The backend server failed to connect to Google's AI services. This could be a network issue or a temporary Google-side problem. Please check your internet connection and try again later.`;
    } else if (error.message && error.message.toLowerCase().includes('billing')) {
        userMessage = `Your Google Cloud project associated with this API key does not have billing enabled, or the billing account is invalid. Please check your Google Cloud Console settings.`;
    }

    res.status(500).json({ message: userMessage });
}

aiRouter.post('/financial-tip', async (req, res) => {
    const { transactions } = req.body;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo);

    if (recentExpenses.length < 3) {
        return res.json({ tip: "👋 Keep adding expenses to your tracker. Once I have a little more data on your spending, I can provide a personalized financial tip!" });
    }

    const spendingSummary = recentExpenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});
    const formattedSummary = Object.entries(spendingSummary).map(([cat, amt]) => `- ${cat}: ₹${amt.toFixed(2)}`).join('\n');
    const prompt = `You are a friendly financial coach. Based on the user's recent spending in Indian Rupees (₹), provide one specific, practical, and encouraging tip under 60 words.\n\nSpending:\n${formattedSummary}`;

    try {
        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        const tip = response.text;
        if (!tip) {
            console.error("AI Tip Error: Gemini API returned an empty text response.");
            return res.status(500).json({ message: AI_EMPTY_RESPONSE_MESSAGE });
        }
        res.json({ tip });
    } catch (error) {
        handleAiError(res, error, "Financial Tip");
    }
});

aiRouter.post('/dream-plan', async (req, res) => {
    const { dreamDescription } = req.body;
    const planPrompt = `Based on the user's dream, create a high-level, encouraging financial plan. Currency is Indian Rupees (₹).\n\nDream: "${dreamDescription}"\n\nProvide a title, summary, estimated cost range, timeline, and 3-5 practical steps.`;
    const planSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING }, summary: { type: Type.STRING }, estimatedCost: { type: Type.STRING }, timeline: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['title', 'description'] } } }, required: ['title', 'summary', 'estimatedCost', 'timeline', 'steps'] };
    const imagePrompt = `An inspirational, vibrant, photorealistic image representing the dream of: ${dreamDescription}. Cinematic lighting, high detail.`;

    try {
        const planPromise = ai.models.generateContent({ model: "gemini-2.5-flash", contents: planPrompt, config: { responseMimeType: "application/json", responseSchema: planSchema } });
        const imagePromise = ai.models.generateImages({ model: 'imagen-3.0-generate-002', prompt: imagePrompt, config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' } });
        
        const [planResponse, imageResponse] = await Promise.all([planPromise, imagePromise]);
        
        const planText = planResponse.text;
        const imageBytes = imageResponse.generatedImages?.[0]?.image?.imageBytes;

        if (!planText || !imageBytes) {
            console.error("Dream Plan Error: AI response was incomplete.");
            return res.status(500).json({ message: AI_EMPTY_RESPONSE_MESSAGE });
        }
        
        const plan = JSON.parse(planText);
        const imageUrl = `data:image/jpeg;base64,${imageBytes}`;
        res.json({ plan, imageUrl });
    } catch (error) {
        handleAiError(res, error, "Dream Plan");
    }
});

aiRouter.post('/video-story', async (req, res) => {
    try {
        let operation = await ai.models.generateVideos({ model: 'veo-2.0-generate-001', prompt: req.body.prompt, config: { numberOfVideos: 1 } });
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
             console.error("Video Story Error: Generation operation completed but no download URI was found.");
             throw new Error("Video generation failed to produce a valid download link.");
        }
        res.json({ videoUri: downloadLink });
    } catch (error) {
        handleAiError(res, error, "Video Story");
    }
});

aiRouter.get('/video-proxy', async (req, res) => {
    try {
        const videoUri = req.query.uri;
        if (!videoUri) return res.status(400).send("Missing video URI");

        const fetch = (await import('node-fetch')).default;
        const videoResponse = await fetch(`${videoUri}&key=${API_KEY}`);
        
        if (!videoResponse.ok) throw new Error(`Google API responded with ${videoResponse.status}`);
        
        res.setHeader('Content-Type', videoResponse.headers.get('Content-Type'));
        res.setHeader('Content-Length', videoResponse.headers.get('Content-Length'));
        videoResponse.body.pipe(res);
    } catch (error) {
        console.error("Video Proxy Error:", error.message);
        res.status(500).json({ message: "Failed to proxy video from Google." });
    }
});

aiRouter.post('/chat', async (req, res) => {
    const { history } = req.body;
    if (!history || !Array.isArray(history)) {
        return res.status(400).json({ message: 'Invalid chat history provided.' });
    }

    const systemInstruction = `You are 'Family FinanceFlow Assistant', a helpful AI chatbot inside a personal finance app. All monetary values are in Indian Rupees (INR, symbol ₹). Your role is to answer user questions based *only* on the financial data provided in the initial messages.
- Today's date is ${new Date().toLocaleDateString('en-CA')}.
- Do NOT provide financial advice, investment tips, or any information outside of the provided data.
- If a question cannot be answered with the data, politely say so.
- Be friendly, conversational, and concise.`;
    
    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: { systemInstruction: systemInstruction }
        });
        const text = response.text;
        if (!text) {
             console.error("Chat Error: Gemini API returned an empty text response.");
             return res.status(500).json({ message: AI_EMPTY_RESPONSE_MESSAGE });
        }
        res.json({ text });
    } catch (error) {
        handleAiError(res, error, "Chat");
    }
});

app.use('/api/ai', aiRouter);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
