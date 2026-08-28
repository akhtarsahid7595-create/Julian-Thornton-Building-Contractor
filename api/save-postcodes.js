// api/save-postcodes.js

export default async function handler(req, res) {
    // Enable CORS for frontend interaction
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { password, postcodes } = req.body;

        // 1. Authenticate Request
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword || password !== adminPassword) {
            return res.status(401).json({ error: 'Unauthorized: Invalid password.' });
        }

        // 2. Validate Input
        if (!Array.isArray(postcodes)) {
            return res.status(400).json({ error: 'Invalid input: postcodes must be an array.' });
        }

        // Validate each item structure
        for (const item of postcodes) {
            if (typeof item.text !== 'string' || typeof item.url !== 'string') {
                return res.status(400).json({ error: 'Invalid input structure: items must have text and url.' });
            }
        }

        // 3. GitHub API Config
        const token = process.env.GITHUB_PAT;
        const repo = process.env.GITHUB_REPO; // e.g. "username/repo"
        const filePath = 'postcodes.json';

        if (!token || !repo) {
            return res.status(500).json({ error: 'Server configuration error: GITHUB_PAT or GITHUB_REPO not set.' });
        }

        // Headers for GitHub API
        const githubHeaders = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Vercel-Serverless-Function'
        };

        // 4. Retrieve Current File Details (to get its SHA)
        const getUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
        const getRes = await fetch(getUrl, { headers: githubHeaders });

        let sha = null;
        if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
        } else if (getRes.status !== 404) {
            const errData = await getRes.json().catch(() => ({}));
            return res.status(500).json({ error: errData.message || 'Failed to fetch current postcodes metadata from GitHub.' });
        }

        // 5. Commit & Push Updated File to GitHub
        const updatedContent = JSON.stringify(postcodes, null, 2);
        const base64Content = Buffer.from(updatedContent).toString('base64');

        const putBody = {
            message: 'chore: update postcodes.json via admin panel',
            content: base64Content,
            branch: 'main'
        };

        if (sha) {
            putBody.sha = sha;
        }

        const putRes = await fetch(getUrl, {
            method: 'PUT',
            headers: {
                ...githubHeaders,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(putBody)
        });

        if (!putRes.ok) {
            const errData = await putRes.json().catch(() => ({}));
            return res.status(500).json({ error: errData.message || 'Failed to commit changes to GitHub.' });
        }

        return res.status(200).json({ success: true, message: 'Postcodes updated successfully!' });
    } catch (error) {
        console.error('Error saving postcodes:', error);
        return res.status(500).json({ error: error.message });
    }
}
