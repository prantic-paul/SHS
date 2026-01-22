#!/usr/bin/env python3
"""Script to enhance README.md with ToC, Mermaid diagrams, and other improvements"""

# Read the current README
with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Add Table of Contents after the title section
toc = """## 📑 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Services Documentation](#-services-documentation)
- [Installation](#-installation)
- [Run Locally](#-run-locally)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Support](#-support)

---

"""

# Insert ToC after the title and tagline
lines = content.split('\n')
insert_pos = 0
for i, line in enumerate(lines):
    if line.startswith('---') and i > 5:  # Find first separator after title
        insert_pos = i + 1
        break

if insert_pos > 0:
    lines.insert(insert_pos, toc)
    content = '\n'.join(lines)

# Step 2: Replace ASCII architecture with Mermaid diagrams
old_architecture = """## 🏗️ System Architecture

The SHS platform follows a microservices architecture with three main services:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                      React Frontend (Vite)                       │  │
│  │  - Patient Dashboard    - Doctor Dashboard    - Admin Panel     │  │
│  │  - Authentication       - Appointment Booking - Blog System     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   │ HTTP/REST API
                                   │
┌──────────────────────────────────┴───────────────────────────────────────┐
│                           Application Layer                              │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                Django Backend (REST API)                        │   │
│  │  - User Management      - Appointment System                    │   │
│  │  - Doctor Verification  - Blog & Content Management            │   │
│  │  - Authentication (JWT) - API Gateway                           │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│         ┌─────────────────────────┬──────────────────────────┐         │
│         │                         │                           │         │
│         ▼                         ▼                           ▼         │
│  ┌─────────────┐          ┌─────────────┐           ┌──────────────┐  │
│  │ AI Service  │          │ ML Service  │           │   Database   │  │
│  │  (FastAPI)  │          │  (FastAPI)  │           │ (PostgreSQL) │  │
│  │             │          │             │           │              │  │
│  │ - Gemini AI │          │ - Disease   │           │ - User Data  │  │
│  │ - RAG       │          │   Predict   │           │ - Appts      │  │
│  │ - Pinecone  │          │ - Random    │           │ - Doctors    │  │
│  │   Vector DB │          │   Forest    │           │ - Blogs      │  │
│  └─────────────┘          └─────────────┘           └──────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Data Flow:
1. User interacts with React frontend
2. Frontend sends requests to Django backend
3. Backend processes requests and:
   - Handles authentication and authorization
   - Manages database operations
   - Routes AI queries to AI Service (Gemini + Pinecone)
   - Routes disease predictions to ML Service
4. Services return responses back through the chain
```"""

new_architecture = """## 🏗️ System Architecture

### Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        React["React Frontend<br/>(Vite + Tailwind)"]
    end
    
    subgraph Application["⚙️ Application Layer"]
        Django["Django Backend<br/>(DRF + JWT)"]
        AI["AI Service<br/>(FastAPI)"]
        ML["ML Service<br/>(FastAPI)"]
    end
    
    subgraph AIComponents["🤖 AI/ML Components"]
        Gemini["Google Gemini API"]
        Pinecone["Pinecone Vector DB"]
        Models["ML Models<br/>(Random Forest)"]
    end
    
    subgraph Data["💾 Data Layer"]
        DB["PostgreSQL Database"]
    end
    
    React -->|REST API| Django
    Django -->|AI Queries| AI
    Django -->|Predictions| ML
    AI -->|LLM Requests| Gemini
    AI -->|Vector Search| Pinecone
    ML -->|Training/Inference| Models
    Django -->|CRUD| DB
    AI -->|Store Embeddings| Pinecone
    
    style React fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style Django fill:#0c4b33,stroke:#333,stroke-width:2px,color:#fff
    style AI fill:#009688,stroke:#333,stroke-width:2px,color:#fff
    style ML fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    style DB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style Gemini fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
    style Pinecone fill:#00c9a7,stroke:#333,stroke-width:2px,color:#fff
    style Models fill:#ff9800,stroke:#333,stroke-width:2px,color:#fff
```

### Architecture Overview

| Layer | Components | Responsibilities |
|-------|-----------|------------------|
| **Client** | React Frontend | User interface, authentication, appointment booking, AI chat |
| **Application** | Django Backend | API gateway, business logic, authentication, data management |
| **AI/ML** | AI Service, ML Service | Medical chatbot (RAG), disease prediction, doctor recommendations |
| **AI Components** | Gemini, Pinecone, ML Models | Language model, vector storage, prediction models |
| **Data** | PostgreSQL | Persistent storage for users, doctors, appointments, blogs |

### Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Frontend
    participant Backend as Django Backend
    participant AI as AI Service
    participant ML as ML Service
    participant DB as Database
    
    User->>Frontend: Access Platform
    Frontend->>Backend: Authentication Request
    Backend->>DB: Validate Credentials
    DB-->>Backend: User Data
    Backend-->>Frontend: JWT Token
    
    User->>Frontend: Book Appointment
    Frontend->>Backend: Create Appointment
    Backend->>DB: Store Appointment
    DB-->>Backend: Confirmation
    Backend-->>Frontend: Success Response
    
    User->>Frontend: Ask Medical Question
    Frontend->>Backend: Forward Query
    Backend->>AI: Process with RAG
    AI->>AI: Gemini + Pinecone Search
    AI-->>Backend: AI Response
    Backend-->>Frontend: Medical Advice
    
    User->>Frontend: Predict Disease
    Frontend->>Backend: Submit Symptoms
    Backend->>ML: Disease Prediction
    ML->>ML: Random Forest Model
    ML-->>Backend: Prediction + Doctors
    Backend-->>Frontend: Results
```"""

content = content.replace(old_architecture, new_architecture)

# Step 3: Convert Tech Stack to table
old_tech_stack = """## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool
- **Tailwind CSS** 3.4.17 - Styling
- **React Router** 7.1.1 - Routing
- **Axios** 1.7.9 - HTTP client

### Backend
- **Django** 4.2.7 - Web framework
- **Django REST Framework** 3.14.0 - API development
- **PostgreSQL** 15+ - Primary database
- **JWT** - Authentication

### AI Service
- **FastAPI** 0.108.0 - API framework
- **Google Gemini** 2.0.0 - Large Language Model
- **LangChain** 0.3.17 - LLM framework
- **Pinecone** 3.0.0 - Vector database
- **LangChain-Pinecone** 0.2.0 - Integration

### ML Service
- **FastAPI** 0.116.2 - API framework
- **scikit-learn** 1.7.2 - Machine learning
- **pandas** 2.2.3 - Data processing
- **numpy** 1.26.4 - Numerical computing

### Development Tools
- **Git** - Version control
- **VS Code** - IDE
- **Postman** - API testing
- **pgAdmin** - Database management"""

new_tech_stack = """## 🛠️ Tech Stack

<table>
<tr>
<th>Category</th>
<th>Technologies</th>
<th>Versions</th>
</tr>
<tr>
<td><b>Frontend</b></td>
<td>React, Vite, Tailwind CSS, React Router, Axios</td>
<td>19.2.0, 7.2.4, 3.4.17, 7.1.1, 1.7.9</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Django, Django REST Framework, PostgreSQL, JWT</td>
<td>4.2.7, 3.14.0, 15+, Latest</td>
</tr>
<tr>
<td><b>AI Service</b></td>
<td>FastAPI, Google Gemini, LangChain, Pinecone, LangChain-Pinecone</td>
<td>0.108.0, 2.0.0, 0.3.17, 3.0.0, 0.2.0</td>
</tr>
<tr>
<td><b>ML Service</b></td>
<td>FastAPI, scikit-learn, pandas, numpy</td>
<td>0.116.2, 1.7.2, 2.2.3, 1.26.4</td>
</tr>
<tr>
<td><b>Tools</b></td>
<td>Git, VS Code, Postman, pgAdmin</td>
<td>Version Control, IDE, API Testing, DB Management</td>
</tr>
</table>

---

## 📚 Services Documentation

Each microservice has its own detailed README with setup instructions and API documentation:

<table>
<tr>
<th>Service</th>
<th>Description</th>
<th>Documentation</th>
</tr>
<tr>
<td>🔧 <b>Backend</b></td>
<td>Django REST API - Core business logic, authentication, database management</td>
<td><a href="./backend/README.md">Backend README</a></td>
</tr>
<tr>
<td>🎨 <b>Frontend</b></td>
<td>React application - User interface, patient/doctor portals</td>
<td><a href="./frontend/README.md">Frontend README</a></td>
</tr>
<tr>
<td>🤖 <b>AI Service</b></td>
<td>FastAPI service - RAG-based medical chatbot with Gemini and Pinecone</td>
<td><a href="./ai-service/README.md">AI Service README</a></td>
</tr>
<tr>
<td>🧠 <b>ML Service</b></td>
<td>FastAPI service - Disease prediction using Random Forest models</td>
<td><a href="./disease-prediction-service/README.md">ML Service README</a></td>
</tr>
</table>

**Additional Documentation:**
- [Contributing Guidelines](./CONTRIBUTING.md)
- [System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Database Schema](./docs/architecture/DATABASE_SCHEMA.md)
- [API Design](./docs/architecture/API_DESIGN.md)
- [Complete Documentation](./docs/README.md)"""

content = content.replace(old_tech_stack, new_tech_stack)

# Step 4: Add Contributing and License sections before Author
contributing_section = """---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or spreading the word, your help is appreciated.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/prantic-paul/SHS.git
   cd SHS
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes

### Contribution Guidelines

- **Code Quality**: Write clean, maintainable code with proper comments
- **Testing**: Test your changes thoroughly before submitting
- **Documentation**: Update documentation for any new features
- **Commit Messages**: Use conventional commit format (feat:, fix:, docs:, etc.)
- **Issue First**: For major changes, open an issue first to discuss

### Areas for Contribution

- 🐛 **Bug Fixes**: Help identify and fix bugs
- ✨ **New Features**: Implement new healthcare features
- 📝 **Documentation**: Improve docs, add tutorials, fix typos
- 🧪 **Testing**: Add unit tests, integration tests
- 🎨 **UI/UX**: Enhance user interface and experience
- 🌍 **Translations**: Add multi-language support
- ⚡ **Performance**: Optimize code and database queries

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the community

For detailed guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
MIT License

Copyright (c) 2026 Prantic Paul

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**What this means:**
- ✅ Free to use for personal and commercial projects
- ✅ Modify and distribute as needed
- ✅ Private use allowed
- ⚠️ No warranty provided
- ⚠️ Must include original license and copyright notice

---

"""

# Find the Author section and insert before it
author_pos = content.find('## 👨‍💻 Author')
if author_pos > 0:
    content = content[:author_pos] + contributing_section + content[author_pos:]

# Step 5: Enhance Author section
old_author = """## 👨‍💻 Author

**Prantic Paul**

- 📧 Email: pranticpaulshimul@gmail.com
- 📱 Phone: +880 1739509014
- 💼 LinkedIn: [Prantic Paul](https://www.linkedin.com/in/prantic-paul-80917a28a/details/skills/)
- 🐙 GitHub: [prantic-paul](https://github.com/prantic-paul)"""

new_author = """## 👨‍💻 Author

**Prantic Paul**

<table>
<tr>
<td width="30%">
<img src="https://github.com/prantic-paul.png" width="150" style="border-radius: 50%;" alt="Prantic Paul"/>
</td>
<td width="70%">
<b>Full Stack Developer | AI/ML Enthusiast</b><br/><br/>
Passionate about building intelligent healthcare solutions that make a difference.<br/><br/>

📧 <b>Email:</b> pranticpaulshimul@gmail.com<br/>
📱 <b>Phone:</b> +880 1739509014<br/>
💼 <b>LinkedIn:</b> <a href="https://www.linkedin.com/in/prantic-paul-80917a28a/">Prantic Paul</a><br/>
🐙 <b>GitHub:</b> <a href="https://github.com/prantic-paul">@prantic-paul</a><br/>
</td>
</tr>
</table>"""

content = content.replace(old_author, new_author)

# Remove duplicate License section if exists
license_header = "## 📄 License"
first_license = content.find(license_header)
if first_license >= 0:
    second_license = content.find(license_header, first_license + 1)
    if second_license >= 0:
        # Find the next section after second license
        next_section = content.find('\n## ', second_license + 1)
        if next_section > 0:
            # Remove second license section
            content = content[:second_license] + content[next_section:]

# Write the enhanced README
with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ README.md enhanced successfully!")
print("📊 Changes applied:")
print("  - Added table of contents")
print("  - Replaced ASCII architecture with Mermaid diagrams")
print("  - Converted tech stack to table format")
print("  - Added Services Documentation section")
print("  - Added Contributing section")
print("  - Added MIT License section")
print("  - Enhanced Author section")
