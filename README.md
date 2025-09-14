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
      <td><img width="250"  alt="landing" src="https://github.com/user-attachments/assets/8b3f91ed-b511-4e38-b588-6e5ee727d11d" /></td>  
      <td><img width="250"  alt="dashboard" src="https://github.com/user-attachments/assets/943a963d-ac5d-466f-95d6-ac9574517cce" /></td>  
      <td><img width="250"  alt="campaign" src="https://github.com/user-attachments/assets/b97a7f17-233e-49ae-a0ed-da367e4edf07" /></td>  
    </tr>  
    <tr>  
      <td><img width="250" alt="addHr" src="https://github.com/user-attachments/assets/388d86c5-958c-48d1-97f8-68cf820dfd4d" /></td>  
      <td><img width="250"alt="Template" src="https://github.com/user-attachments/assets/6be5596a-b831-404e-b20a-bae24b8d6cbb" /></td>  
      <td><img width="250" alt="campaign1" src="https://github.com/user-attachments/assets/c5a7c70b-ccfd-48b7-8d1b-6bef9d7186fd" /></td>  
    </tr>  
  </table>  
</div>  







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

Hunter: For Email Verification
```

## 🤝 Contributing
```bash
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.
```

## Contact Us

-   **Email:** [coldmailx512@gmail.com](mailto:coldmailx512@gmail.com)
-   **LinkedIn: https://www.linkedin.com/in/ritesh-prajapati-918b6a205/**
