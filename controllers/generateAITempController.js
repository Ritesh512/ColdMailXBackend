import fetch from "node-fetch";

export const generateTemplate = async (req, res) => {
  try {
    let { jobDescription, resumeText } = req.body;
    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        error: "Job description is required",
      });
    }

    // ✅ Truncate resume to safe size (10k chars ≈ ~2k tokens)
    if (resumeText && resumeText.length > 10000) {
      console.warn("Resume too long, truncating to 10k chars.");
      resumeText = resumeText.slice(0, 10000);
    }

    // ✅ Build user content
    let userPrompt = `Job Description:\n${jobDescription}\n\n`;
    if (resumeText && resumeText.trim()) {
      userPrompt += `Candidate Resume:\n${resumeText}\n\nGenerate the cold email template.`;
    } else {
      userPrompt += "Generate the cold email template (resume not provided).";
    }

    // ✅ Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",  // llama-3.3-70b-versatile 
        // 30  -- request per min
        // 1K  -- request per day
        // 30K  -- token per min
        // 500K  -- token per day
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that generates professional cold email templates for job applications. " +
              "Always use placeholders: {{hrName}}, {{jobId}}, {{companyName}}, {{resumeLink}}, {{userEmail}}, {{userName}}. " +
              "If resume is provided, extract 2–3 most relevant skills/achievements and include them naturally. " +
              "If resume is not provided, just generate a generic but professional email. " +
              "Do not include explanations, only the subject and email body.",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // ✅ Handle API errors gracefully
    if (data.error) {
      let errorMessage = data.error.message || "Unknown error from AI service";
      if (errorMessage.includes("quota")) {
        errorMessage =
          "You have exceeded your current API quota. Please check your Groq plan and billing.";
      } else if (errorMessage.includes("context_length")) {
        errorMessage =
          "The input is too large for the AI model. Please shorten the job description or resume.";
      }
      return res.status(400).json({ success: false, error: errorMessage });
    }

    const raw = data.choices?.[0]?.message?.content || "";
    if (!raw) {
      return res.status(500).json({
        success: false,
        error: "AI returned empty template",
      });
    }

    // ✅ Extract subject
    const subjectMatch = raw.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : "Job Application";

    // ✅ Extract body
    let body = raw.replace(/Subject:.*\n?/i, "").trim();
    body = body.replace(/^Here is.*template.*\n?/i, "").trim();
    body = body.replace(/\r\n/g, "\n");

    // ✅ Extract placeholders
    const placeholderRegex = /\{\{(.*?)\}\}/g;
    const placeholders = [];
    let match;
    while ((match = placeholderRegex.exec(body)) !== null) {
      const key = match[1].trim();
      if (!placeholders.includes(key)) placeholders.push(key);
    }

    // ✅ Final structured response
    const formattedTemplate = {
      name: "generated_template",
      subject,
      body,
      placeholders,
    };

    res.json({ success: true, template: formattedTemplate });
  } catch (err) {
    console.error("Template generation error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error while generating template",
    });
  }
};
