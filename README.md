# Coldmailx  

Coldmailx is a **cold emailing automation platform** designed for job seekers. It helps you streamline outreach to recruiters and HR professionals by automating repetitive tasks such as uploading HR contacts, creating personalized templates, and running campaigns.  

---

## 🚀 Features  

- **HR Management**  
  - Add HR contacts manually.  
  - Bulk upload via CSV (fields: email, name, title, number, etc.).  

- **Custom Templates**  
  - Create reusable templates with placeholders like `{{resumeUrl}}`, `{{jobId}}`, etc.  
  - Placeholders are dynamically replaced during email sending.  
  - Integrated with **LLMs (via GROQ)** to auto-generate professional cold email templates based on your resume and job description.  

- **Campaigns**  
  - Create campaigns by selecting companies and HR contacts.  
  - Attach templates with placeholders.  
  - Preview emails before sending.  
  - Launch the campaign in one click.  

- **Email Sending**  
  - Uses **Nodemailer** under the hood.  
  - Requires your **email + app password** (not the actual password).  

- **Modern Tech Stack**  
  - **Frontend:** React.js + Tailwind CSS (responsive & mobile-friendly).  
  - **Backend:** Node.js + Express.js.  
  - **Database:** MongoDB.  
  - **Email:** Nodemailer.  
  - **AI Integration:** GROQ for template generation.  
  - **Deployment:** Vercel.  

---

## 📸 Gallery  

A quick look at Coldmailx in action:  

<div align="center">  
  <table>  
    <tr>  
      <td><img src="images/dashboard.png" width="250"/></td>  
      <td><img src="images/hr-upload.png" width="250"/></td>  
      <td><img src="images/template-creation.png" width="250"/></td>  
    </tr>  
    <tr>  
      <td><img src="images/campaign-preview.png" width="250"/></td>  
      <td><img src="images/email-sent.png" width="250"/></td>  
      <td><img src="images/mobile-view.png" width="250"/></td>  
    </tr>  
  </table>  
</div>  

*(Add your screenshots in the `/images` folder and update the paths above.)*  

---

## ⚙️ Installation  

Clone the repo and install dependencies:  

```bash
git clone https://github.com/your-username/coldmailx.git
cd coldmailx
```

## Backend Setup

```bash
cd backend
npm install
```

## Start backend:
```bash
npm start
```
 
## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```


## 📧 Email Setup
```bash
Go to your email provider (e.g., Gmail).

Enable App Passwords and generate one.

Use that app password in the .env file instead of your real password.

```

## 🤖 AI Integration
```bash
Coldmailx leverages GROQ-powered LLMs to generate professional cold emails.
Simply provide:

Your resume

The job description

The system will suggest tailored email templates ready for use in campaigns.
```

## 📱 Responsiveness
```bash
Fully responsive UI using Tailwind CSS.

Optimized for desktop, tablet, and mobile screens.
```

## 📌 Roadmap
```bash
 Analytics for campaigns (open rate, reply tracking).

 Scheduling campaigns.

 Advanced AI suggestions for personalization.
```

## 🛠️ Tech Stack
```bash
Frontend: React, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Email: Nodemailer

AI: GROQ

Hosting: Vercel
```

## 🤝 Contributing
```bash
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.
```