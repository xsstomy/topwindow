// 全局类型声明文件
// 扩展 Window 接口以包含自定义全局变量

declare global {
  interface Window {
    // Google Analytics gtag 函数
    gtag?: (command: string, targetId: string, parameters?: any) => void;
    
    // 用户ID (用于分析追踪)
    __USER_ID__?: string;
  }
}

// 导出空对象以使此文件成为模块
export {};