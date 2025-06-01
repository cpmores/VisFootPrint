export async function LLM(prompt:string) {
    const token = 'sk-cpaorlodxjvjvmqdccarywxsufnszrscbqmlruzejfeqygyb';

    const requestBody = JSON.stringify({
        model: "Qwen/QwQ-32B",
        messages: [{"role": "user", "content": prompt}],
    });
    
    try {
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: requestBody
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        return responseData.choices[0].message.content;
    } catch (error) {
        console.error('LLM请求错误:', error);
        throw error;
    }
}
