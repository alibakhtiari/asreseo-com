export interface TocItem {
  title: string;
  id: string;
  level: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ParsedSections {
  content: string;
  keyTakeaways: string[];
  faqs: Faq[];
}

export function parseSections(raw: string): ParsedSections {
  let content = raw;
  const kt = content.match(/## نکات کلیدی\s*\n\n([\s\S]*?)\n\n##(?!#)/);
  const keyTakeaways = kt
    ? kt[1]
        .split("\n")
        .filter((line) => line.startsWith("- "))
        .map((line) => line.substring(2).trim())
    : [];
  if (kt) {
    content = content.replace(/## نکات کلیدی\s*\n\n[\s\S]*?\n\n##(?!#)/, "##");
  }
  const faqs: Faq[] = [];
  const fm = content.match(/## سوالات متداول\s*\n\n([\s\S]*?)(?:\n##(?!#)|$)/);
  if (fm) {
    const faqContent = fm[1];
    const sections = faqContent.split(/\n(?=###\s+)/);
    for (const sec of sections) {
      const trimmed = sec.trim();
      if (!trimmed.startsWith("###")) continue;
      const firstNewline = trimmed.indexOf("\n");
      if (firstNewline !== -1) {
        const question = trimmed.slice(3, firstNewline).trim();
        const answer = trimmed.slice(firstNewline + 1).trim();
        if (question && answer) {
          faqs.push({ question, answer });
        }
      }
    }
    content = content.replace(/## \u0633\u0648\u0627\u0644\u0627\u062a \u0645\u062a\u062f\u0627\u0648\u0644\s*\n\n[\s\S]*$/, "");
  }
  return { content, keyTakeaways, faqs };
}
