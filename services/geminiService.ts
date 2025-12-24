
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateChristmasBlessing = async (name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一个深谙浪漫且懂代码的诗人。请为名为"${name}"的朋友写一段充满“程序员浪漫”风格的圣诞祝福。要求：
      1. 措辞要包含一些浪漫的科技隐喻（如：逻辑、粒子、编译、永恒的循环、解构等）。
      2. 语气温暖而富有格调，像是在璀璨的数字星空下低语。
      3. 必须以“—— 陈祖云”作为唯一的署名结尾。
      4. 字数控制在100字左右。
      5. 只返回祝福内容和署名。`,
      config: {
        temperature: 1.0,
        topP: 0.9,
      }
    });
    
    return response.text || `亲爱的${name}，在这个充满逻辑与温暖的夜晚，愿你的生活如优美的代码般流畅，愿所有的幸福都在你的世界里无限循环。圣诞快乐。\n\n—— 陈祖云`;
  } catch (error) {
    console.error("Error generating blessing:", error);
    return `亲爱的${name}，愿这棵魔法圣诞树带给你一整年的好运。在这串数字编织的奇迹里，祝你岁岁平安。\n\n—— 陈祖云`;
  }
};
