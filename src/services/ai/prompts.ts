/**
 * AI Prompt 模板
 */

/**
 * 生成问题的 Prompt
 */
export const FEYNMAN_QUESTION_PROMPT = `你是一个完全不懂技术的小白。请针对以下知识点，提出3-5个简单的问题：

知识点：{knowledge}

要求：
1. 问题要简单易懂，像小学生会问的问题
2. 不要使用专业术语
3. 问题要有层次（从基础到深入）
4. 问题要能帮助检验理解深度

请直接返回问题列表，每行一个问题，不要添加其他说明。`

/**
 * 评估回答的 Prompt
 */
export const FEYNMAN_ASSESSMENT_PROMPT = `请评估以下回答的质量：

知识点：{knowledge}
问题：{question}
回答：{answer}

请从以下维度评估（1-10分）：
1. 清晰度：是否用简单语言解释清楚
2. 逻辑性：是否有清晰的逻辑结构
3. 完整性：是否回答了问题的核心
4. 专业术语使用：是否过度使用专业术语（分数越低表示使用越少，越好）

请以 JSON 格式返回，包含以下字段：
{
  "clarity": 数字,
  "logic": 数字,
  "completeness": 数字,
  "terminology": 数字,
  "suggestions": ["建议1", "建议2", ...]
}`

