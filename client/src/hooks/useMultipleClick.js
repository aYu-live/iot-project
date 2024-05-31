import { ref } from 'vue';

// 自定义钩子useMultipleClick
export function useMultipleClick(onComplete, clickCount = 10, timeout = 500) {
  // 定义当前点击次数
  let count = ref(0);
  // 记录上次点击时间，用于比较是否是“连续”点击
  let lastTime = 0;

  const handleClick = () => {
    const now = Date.now();
    // 判断本次点击是否是在设定的连续点击时间间隔内
    if (now - lastTime < timeout) {
      count.value++;
      if (count.value >= clickCount) {
        // 如果达到设定的点击次数，执行回调函数
        onComplete();
        // 重置点击次数
        count.value = 0;
      }
    } else {
      // 如果点击间隔太长，重置点击次数
      count.value = 1;
    }
    lastTime = now;
  };
  
  // 返回点击处理函数，以便在模板中使用
  return { handleClick };
}