function getTextInput(title, placeholder) {
  return new Promise((resolve) => {
    const input = document.createElement("textarea");

    input.placeholder = placeholder;
    input.style.position = "fixed";
    input.style.top = "50%";
    input.style.left = "50%";
    input.style.transform = "translate(-50%, -50%)";
    input.style.width = "500px";
    input.style.height = "200px";
    input.style.padding = "15px";
    input.style.fontSize = "16px";
    input.style.zIndex = "9999";

    const button = document.createElement("button");

    button.textContent = "Generate";
    button.style.position = "fixed";
    button.style.top = "calc(50% + 120px)";
    button.style.left = "50%";
    button.style.transform = "translateX(-50%)";
    button.style.zIndex = "10000";
    button.style.padding = "12px 20px";

    document.body.appendChild(input);
    document.body.appendChild(button);

    button.onclick = () => {
      const value = input.value;

      input.remove();
      button.remove();

      resolve(value);
    };

    input.focus();
  });
}
function startLearning() {
  const dashboard = document.getElementById("dashboard");

  if (dashboard) {
    dashboard.scrollIntoView({
      behavior: "smooth"
    });
  } else {
    alert("Dashboard section NOT FOUND");
  }
}

function scrollToFeatures() {
  const features = document.getElementById("features");

  if (features) {
    features.scrollIntoView({
      behavior: "smooth"
    });
  }
}

function showFeatureMessage(feature) {
  alert(feature + " will be available in the next stage.");
}


async function openTool(tool) {

  // Explain Topic
  if (tool === "Explain Topic") {

    const topic = await getTextInput(
  "Explain Topic",
  "Type the topic you want me to explain...");

    if (!topic || !topic.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: topic.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      showFormattedResponse("Explanation", cleanAIResponse(data.explanation));

    } catch (error) {
      console.error("AI Error:", error);
      alert("Could not generate explanation.");
    }

    return;
  }


  // Summarize Notes
  if (tool === "Summarize Notes") {

    const notes = await getTextInput("Summarize Notes", "Paste your study notes here...");

    if (!notes || !notes.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          notes: notes.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      showFormattedResponse("Summary", cleanAIResponse(data.summary));

    } catch (error) {
      console.error("AI Error:", error);
      alert("Could not summarize notes.");
    }

    return;
  }

// Generate Quiz
if (tool === "Generate Quiz") {
  const topic = await getTextInput(
    "Generate Quiz",
    "Enter the topic for your quiz..."
  );

  if (!topic || !topic.trim()) {
    return;
  }

  try {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topic.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    showQuiz(cleanAIResponse(data.quiz));
  } catch (error) {
    console.error("AI Error:", error);
    alert("Could not generate quiz.");
  }

  return;
}

// Study Plan
if (tool === "Study Plan") {
  const details = await getTextInput(
    "Study Plan",
    "Example: DBMS exam in 10 days, 5 chapters..."
  );

  if (!details || !details.trim()) {
    return;
  }

  try {
    const response = await fetch("/api/study-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        details: details.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    showStudyPlan(cleanAIResponse(data.plan));

  } catch (error) {
    console.error("Study Plan Error:", error);
alert("Study Plan Error: " + error.message);
    alert("Could not generate study plan.");
  }

  return;
}

// Other tools are not built yet
alert(tool + " will be built in the next stage.");
}



function showStudyPlan(plan) {
  const oldPlan = document.getElementById("study-plan-result");

  if (oldPlan) {
    oldPlan.remove();
  }

  const container = document.createElement("div");
  container.id = "study-plan-result";

  container.style.cssText = `
    position: fixed;
inset: 3%;
z-index: 9999;
background: #f5f8ff;
color: #1e293b;
padding: 28px;
border-radius: 20px;
border: 1px solid #dbeafe;
box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
overflow-y: auto;
font-family: Arial, sans-serif;
line-height: 1.7;
box-sizing: border-box;
  `;

  const title = document.createElement("h2");
  title.textContent = "📚 Your Personalized Study Plan";
  title.style.color = "#4f46e5";


const content = document.createElement("div");
content.style.lineHeight = "1.8";
content.style.overflowWrap = "anywhere";
content.style.fontSize = "16px";
content.style.marginTop = "20px";


const lines = cleanAIResponse(plan)
  .split("\n")
  .filter(line => !/^\s*[-*_]{3,}\s*$/.test(line));
let dayCard = null;

lines.forEach((line) => {
  const trimmed = line.trim();

  if (!trimmed) {
  return;
}

  // Turn each schedule row into a separate card
 


const dayMatch = trimmed.match(
  /^\s*(?:[-*•]\s*)?Day\s+(\d{1,2})\s*[:.)-]?\s*(.*)$/i
);




  if (dayMatch) {
    dayCard = document.createElement("div");

    dayCard.style.cssText = `
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #4f46e5;
  border-radius: 10px;
  padding: 10px 14px;
  margin: 8px 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;
    const dayTitle = document.createElement("h3");
    dayTitle.textContent = `📅 Day ${dayMatch[1]}`;
    dayTitle.style.cssText =
      "margin: 0 0 8px; color: #4f46e5;";
    const focus = document.createElement("p");
    const activity = document.createElement("p");

    focus.textContent = "📘 " + (dayMatch[2] || "Study today's topic").replace(/\*\*/g, "").trim();
    focus.style.cssText = "margin: 4px 0; font-size: 14px; line-height: 1.5;";

    activity.textContent = "🎯 " + (dayMatch[3] || "Practice and revise").replace(/\*\*/g, "").trim();
    activity.style.cssText = "margin: 4px 0; font-size: 14px; line-height: 1.5;";

    dayCard.append(dayTitle, focus, activity);
    content.appendChild(dayCard);
    return;
  }

  // Skip Markdown table headers
if (
  (trimmed.includes("Days") &&
   trimmed.includes("Focus") &&
   trimmed.includes("Goal")) ||
  trimmed.startsWith("| Day |") ||
  trimmed.startsWith("|---")
) {
  return;
}

  const item = document.createElement("p");

  if (
  trimmed.startsWith("### ") ||
  trimmed.startsWith("## ") ||
  trimmed.startsWith("# ") ||
  (trimmed.startsWith("**") && trimmed.endsWith("**"))
) {
  item.textContent = trimmed
    .replace(/^#{1,3}\s*/, "")
    .replace(/\*\*/g, "");

  item.style.cssText = `
    font-size: 20px;
    font-weight: bold;
    color: #4f46e5;
    margin-top: 24px;
    margin-bottom: 12px;
  `;

  content.appendChild(item);
  dayCard = null;
  return;
}
  // Remove table pipes and Markdown symbols from other lines
  item.textContent = trimmed
    .replace(/\|/g, " • ")
    .replace(/\*\*/g, "")
    .replace(/^\*\s*/, "• ");

  item.style.margin = "8px 0";

  if (dayCard) {
    dayCard.appendChild(item);
  } else {
    content.appendChild(item);
  }
});


  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.cssText = `
    background: #4f46e5;
    color: white;
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
  `;

  closeButton.onclick = () => container.remove();

  container.append(title, content, closeButton);
  document.body.appendChild(container);
}




function cleanAIResponse(text) {
  return String(text || "")
    // Normalize line endings
    .replace(/\r\n?/g, "\n")

    // Remove Markdown code fences but keep the code
    .replace(/```[a-zA-Z]*\s*\n?/g, "")
    .replace(/```/g, "")

    // Remove horizontal separator lines
    .replace(/^\s*(?:---+|___+|\*\*\*+)\s*$/gm, "")

    // Remove heading markers such as ### and ##
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")

    // Convert Markdown bullets to readable bullets
    .replace(/^\s*[-*+]\s+/gm, "• ")

    // Remove bold and italic markers
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1")

    // Clean unnecessary spaces and excessive blank lines
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}





function showQuiz(quizText) {
    const questions = [];
    console.log("Quiz questions:", questions.length);
    let currentQuestion = null;

    const lines = String(quizText || "")
        .replace(/\r\n/g, "\n")
        .split("\n");

    // Parse the AI-generated quiz
    for (const rawLine of lines) {
        const text = rawLine
            .trim()
            .replace(/^[•*-]\s*/, "")
            .replace(/\*\*/g, "");

        if (!text) continue;

       const questionMatch = text.match(
    /^(?:Question\s*)?(\d{1,2})[\s.:)\-]+(.+)$/i
);

        if (questionMatch) {
            currentQuestion = {
                number: questionMatch[1],
                text: questionMatch[2].trim(),
                options: [],
                answer: "",
                explanation: "",
                selected: ""
            };

            questions.push(currentQuestion);
            continue;
        }

        if (!currentQuestion) continue;

        const answerMatch = text.match(
            /^(?:correct\s*)?answer\s*[:\-]\s*(.+)$/i
        );

        if (answerMatch) {
            currentQuestion.answer = answerMatch[1].trim();
            continue;
        }

        const explanationMatch = text.match(
            /^explanation\s*[:\-]\s*(.+)$/i
        );

        if (explanationMatch) {
            currentQuestion.explanation =
                explanationMatch[1].trim();
            continue;
        }

        const optionMatch = text.match(
            /^([A-D])[).:\-]\s*(.+)$/i
        );

        if (optionMatch) {
            currentQuestion.options.push({
                letter: optionMatch[1].toUpperCase(),
                text: optionMatch[2].trim()
            });
            continue;
        }

        if (currentQuestion.options.length === 0 &&
            !currentQuestion.answer &&
            !currentQuestion.explanation) {
            currentQuestion.text += " " + text;
        } else if (currentQuestion.explanation) {
            currentQuestion.explanation += " " + text;
        }
    }

    // Resolve answers such as "C", "C) text", or full option text.
    function getCorrectOption(question) {
        const answer = question.answer.trim();

        const letterMatch = answer.match(
            /^(?:option\s*)?([A-D])(?:[).:\s]|$)/i
        );

        if (letterMatch) {
            return letterMatch[1].toUpperCase();
        }

        const matchingOption = question.options.find(option =>
            option.text.toLowerCase() === answer.toLowerCase()
        );

        return matchingOption ? matchingOption.letter : "";
    }

    // Popup background
    const overlay = document.createElement("div");
    overlay.className = "quiz-overlay";

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(15, 20, 45, 0.72);
        backdrop-filter: blur(5px);
    `;

    const modal = document.createElement("div");
    modal.className = "quiz-modal";

    modal.style.cssText = `
        width: 100%;
        max-width: 780px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 24px;
        box-sizing: border-box;
        border-radius: 20px;
        background: #fff;
        color: #172033;
        box-shadow: 0 24px 80px rgba(0,0,0,.25);
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        line-height: 1.6;
    `;

    const header = document.createElement("div");
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding-bottom: 16px;
        margin-bottom: 20px;
        border-bottom: 1px solid #e8eaf3;
    `;

    const titleArea = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = "StudyMate AI Quiz";
    title.style.cssText =
        "margin:0;font-size:24px;font-weight:800;";

    const subtitle = document.createElement("p");
    subtitle.textContent =
        "Choose one answer for each question, then submit your quiz.";
    subtitle.style.cssText =
        "margin:6px 0 0;color:#727b90;font-size:13px;";

    titleArea.append(title, subtitle);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "✕";
    closeButton.setAttribute("aria-label", "Close quiz");
    closeButton.style.cssText = `
        border:0;border-radius:10px;padding:10px 14px;
        background:#eeedff;color:#5147e8;
        font-size:18px;cursor:pointer;
    `;

    function closeQuiz() {
        overlay.remove();
        document.removeEventListener("keydown", handleEscape);
    }

    function handleEscape(event) {
        if (event.key === "Escape") closeQuiz();
    }

    closeButton.addEventListener("click", closeQuiz);
    header.append(titleArea, closeButton);
    modal.appendChild(header);

    const content = document.createElement("div");
    const footer = document.createElement("div");
    footer.style.cssText = `
        display:flex;flex-wrap:wrap;gap:10px;
        justify-content:flex-end;
        padding-top:18px;margin-top:18px;
        border-top:1px solid #e8eaf3;
    `;

    const result = document.createElement("div");
    result.setAttribute("aria-live", "polite");

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.textContent = "Submit Quiz";

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.textContent = "Retry Quiz";
    retryButton.hidden = true;

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.textContent = "Close";

    function styleButton(button, primary = true) {
        button.style.cssText = `
            border:0;border-radius:10px;padding:12px 20px;
            background:${primary ? "#635bff" : "#eeedff"};
            color:${primary ? "#fff" : "#5147e8"};
            font-size:14px;font-weight:700;cursor:pointer;
        `;
    }

    styleButton(submitButton);
    styleButton(retryButton, false);
    styleButton(doneButton, false);

    // Show question cards without revealing answers
    function renderQuestions() {
        content.replaceChildren();
        result.replaceChildren();

        questions.forEach((question, index) => {
            const card = document.createElement("section");
            card.style.cssText = `
                margin-bottom:18px;padding:20px;
                border:1px solid #e8eaf3;
                border-radius:15px;background:#fff;
            `;

            const heading = document.createElement("h3");
            heading.textContent =
                `Question ${index + 1}: ${question.text}`;
            heading.style.cssText =
                "margin:0 0 16px;color:#3979dc;font-size:17px;";

            card.appendChild(heading);

            question.options.forEach(option => {
                const label = document.createElement("label");
                label.style.cssText = `
                    display:flex;align-items:flex-start;gap:10px;
                    margin:9px 0;padding:12px;
                    border:1px solid #edf0f7;border-radius:10px;
                    background:#fafbff;cursor:pointer;
                `;

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `quiz-question-${index}`;
                radio.value = option.letter;
                radio.checked = question.selected === option.letter;
                radio.style.cssText =
                    "margin-top:5px;flex-shrink:0;";

                radio.addEventListener("change", () => {
                    question.selected = option.letter;
                    label.style.borderColor = "#635bff";
                    label.style.background = "#f0efff";
                });

                const optionText = document.createElement("span");
                optionText.textContent =
                    `${option.letter}) ${option.text}`;

                label.append(radio, optionText);
                card.appendChild(label);
            });

            content.appendChild(card);
        });
    }

    // Evaluate only after the student submits
    function submitQuiz() {
        const unanswered = questions.filter(
            question => !question.selected
        ).length;

        if (unanswered > 0) {
            result.textContent =
                `Please answer all questions first. ${unanswered} remaining.`;
            result.style.cssText =
                "margin-top:14px;color:#b45309;font-weight:700;";
            return;
        }

        let score = 0;

        questions.forEach(question => {
            question.correctOption = getCorrectOption(question);

            if (
                question.correctOption &&
                question.selected === question.correctOption
            ) {
                score++;
            }
        });

        renderQuestions();

        const scoreHeading = document.createElement("h3");
        scoreHeading.textContent =
            `Your Score: ${score} / ${questions.length}`;
        scoreHeading.style.cssText = `
            margin:0 0 16px;padding:16px;border-radius:12px;
            background:#eaf9f2;color:#176c50;font-size:21px;
        `;

        result.appendChild(scoreHeading);

        questions.forEach((question, index) => {
            const feedback = document.createElement("div");
            const correct = Boolean(question.correctOption) &&
                question.selected === question.correctOption;

            feedback.style.cssText = `
                margin:12px 0;padding:14px;border-radius:10px;
                background:${correct ? "#eaf9f2" : "#fff1f0"};
                color:${correct ? "#176c50" : "#9f3030"};
            `;

            const answerLine = document.createElement("p");
            answerLine.style.margin = "0 0 8px";
            answerLine.textContent = question.correctOption
                ? `Question ${index + 1}: ${
                    correct ? "Correct!" : "Not quite."
                  } Correct answer: ${
                    question.correctOption
                  }) ${
                    question.options.find(
                        option => option.letter === question.correctOption
                    )?.text || ""
                  }`
                : `Question ${index + 1}: We couldn't identify the correct answer in the AI response.`;

            feedback.appendChild(answerLine);

            if (question.explanation) {
                const explanation = document.createElement("p");
                explanation.style.cssText =
                    "margin:8px 0 0;color:#75512f;";
                explanation.textContent =
                    `Explanation: ${question.explanation}`;
                feedback.appendChild(explanation);
            }

            result.appendChild(feedback);
        });

        submitButton.hidden = true;
        retryButton.hidden = false;
        subtitle.textContent = "Quiz submitted. Review your results below.";
    }

    function retryQuiz() {
        questions.forEach(question => {
            question.selected = "";
            question.correctOption = "";
        });

        submitButton.hidden = false;
        retryButton.hidden = true;
        subtitle.textContent =
            "Choose one answer for each question, then submit your quiz.";

        renderQuestions();
    }

    submitButton.addEventListener("click", submitQuiz);
    retryButton.addEventListener("click", retryQuiz);
    doneButton.addEventListener("click", closeQuiz);
    console.log("Parsed questions:", questions.length, questions);

    if (questions.length === 0) {
        const fallback = document.createElement("pre");
        fallback.textContent =
            String(quizText || "No quiz content was returned.");
        fallback.style.cssText =
            "white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;";
        content.appendChild(fallback);
        submitButton.disabled = true;
    } else {
        renderQuestions();
    }

    modal.append(content, result);
    footer.append(submitButton, retryButton, doneButton);
    modal.appendChild(footer);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeQuiz();
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.addEventListener("keydown", handleEscape);
    closeButton.focus();
}


function showFormattedResponse(title, text) {
  const oldModal = document.getElementById("formatted-response-modal");

  if (oldModal) {
    oldModal.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "formatted-response-modal";

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(15, 23, 42, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  const modal = document.createElement("div");

  modal.style.cssText = `
    background: white;
    color: #1e293b;
    width: 100%;
    max-width: 850px;
    max-height: 85vh;
    overflow-y: auto;
    padding: 28px;
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
    font-family: Arial, sans-serif;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  `;

  const header = document.createElement("div");

  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
  `;

  const heading = document.createElement("h2");
  heading.textContent = title;
  heading.style.cssText = `
    color: #3157c8;
    margin: 0;
    font-size: 24px;
  `;

  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.style.cssText = `
    border: none;
    background: transparent;
    font-size: 30px;
    cursor: pointer;
    color: #475569;
  `;

  function closeModal() {
    overlay.remove();
    document.removeEventListener("keydown", handleEscape);
  }

  function handleEscape(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  closeButton.addEventListener("click", closeModal);

  header.append(heading, closeButton);

  const content = document.createElement("div");
  content.textContent = String(text || "No response was returned.");

  content.style.cssText = `
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-size: 16px;
  `;

  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.style.cssText = `
    display: block;
    margin: 24px 0 0 auto;
    padding: 10px 26px;
    border: none;
    border-radius: 8px;
    background: #3157c8;
    color: white;
    font-size: 15px;
    cursor: pointer;
  `;

  doneButton.addEventListener("click", closeModal);

  modal.append(header, content, doneButton);
  overlay.appendChild(modal);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", handleEscape);
  document.body.appendChild(overlay);
  closeButton.focus();
}
