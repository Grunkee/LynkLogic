# LynkLogic

How to setup lynklogic and run the software. 
---

## Environment Requirements

Before running this project, ensure you have the following installed:
* **Node.js**: `v18.x` or higher
* **Database**: Have a supabase database running
* **Package Manager**: `npm`

---

## Setup & Installation Instructions

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Grunkee/LynkLogic.git
cd LynkLogic
\`\`\`

### 2. Environment Configuration
Replace the supabase key in the supabase_configuration.js 

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Database Setup & Seeding
Run migrations and populate the database with test data:
\`\`\`bash
npm run migrate
npm run seed
\`\`\`

### 5. Run the Application
\`\`\`bash
npm run dev
\`\`\`
The system should now be running at `localhost`.

---

