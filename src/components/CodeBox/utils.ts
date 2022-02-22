
export function textSelect(element:any) {
    const start = 0;
    const end = element.value.length;
    if (element.createTextRange) {
      //IE浏览器
      var range = element.createTextRange();
      range.moveStart("character", -end);
      range.moveEnd("character", -end);
      range.moveStart("character", start);
      range.moveEnd("character", end);
      range.select();
    } else {
      element.setSelectionRange(start, end);
      element.focus();
    }
  }
  
  export function removeDefaultBehavior(event:any) {
    event = event || window.event; //用于IE
    if (event.preventDefault) event.preventDefault(); //标准技术
    if (event.returnValue) event.returnValue = false; //IE
  
    // 阻止事件冒泡
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    return false; //用于处理使用对象属性注册的处理程序
  }
  
  export function isFunction(any:any){
    return typeof any === "function";
  }