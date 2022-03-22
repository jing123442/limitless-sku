(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.temp = factory());
})(this, (function () { 'use strict';

  function accMul(num1, num2) {
    var m = 0,
      s1 = num1.toString(),
      s2 = num2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {}
    try {
      m += s2.split(".")[1].length;
    } catch (e) {}
    return (
      (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
      Math.pow(10, m)
    );
  }
  // 初始化画布 && 公共参数
  let unit = []; // 规格
  let skuAttr = []; // 属性
  let setting = {
    // canvas 样式配置项
    container: {
      width: null,
      height: 800,
      paddingTop: 0,
      paddingLeft: 80,
      paddingRight: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginLeft: 50,
      marginRight: 0,
      marginBottom: 0,
    },
    header: {
      width: 50,
      height: 60,
    },
    input: {
      width: 200,
      height: 40,
      padding: "",
      marginTop: 20,
      marginLeft: 20,
      borderRadius: 0,
      borderColor: "#dcdee2",
      activeBorderColor: "#57a3f3",
      textColor: "#515a6e",
      activeTextColor: "#515a6e",
    },
  };

  let skuList = []; // 规格排列组合
  let rowtd = []; // 每行表头单元格位置信息
  let unitHeaderHeight = []; // 规格每列的单元格合并高度
  let inputList = []; // 规格属性input位置信息
  let limitCanvas = null;
  let limitInput = null;
  let context = null;
  let offsetY = 0; // 滚动距离
  let domPerchLeft = 0; // 组件距离浏览器 --- left ---
  let domPerchTop = 0; // 组件距离浏览器 --- top ---
  let leftHeaderWidth = 0; // 表格左侧表头宽度 --- width ---
  let topHeaderHeight = 0; // 表头每列高度
  let listLength = 0;
  let currentNode = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  // 更改input样式
  function addStyle() {
    var inputCss = `#limitless-sku {
        position: relative;
    }  

    #realInput {
        position: absolute;
        transition: all .2s ease-in-out;
        outline: none;
        padding: 2px;
    }
    #realInput {
    width: ${setting.input.width}px; 
    height: ${setting.input.height}px; 
    border-radius: ${setting.input.borderRadius}px;
    } 
    #realInput:focus { 
        border-color:  ${setting.input.activeBorderColor}; 
    } 
    #realInput:hover { 
        border-color:  ${setting.input.activeBorderColor};
    }`;
    var style = document.createElement("style");
    if (style.styleSheet) {
      style.styleSheet.cssText = inputCss;
    } else {
      style.appendChild(document.createTextNode(inputCss));
    }
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  // 计算表头单元格高度
  function getRowHeaderUnitHeight(unit, height) {
    const heightArr = [height];
    let lastHeight = height;
    for (let i = unit.length - 1; i > 0; i--) {
      lastHeight = unit[i].length * lastHeight;
      heightArr.push(lastHeight);
    }
    return heightArr.reverse();
  }

  // 规格全排列组合
  function getAllSku(origin, index, last) {
    let arr = origin[index];
    arr.forEach((item) => {
      let current = last + item;
      if (index + 1 === origin.length) {
        skuList.push(current);
      } else {
        getAllSku(origin, index + 1, current);
      }
    });
  }
  // 左侧表头绘制信息
  function initRowHeader({ unit, unitHeaderHeight }) {
    let rowHeader = [];
    let tempNumber = 1;
    let realPosition = 0;
    const w = setting.header.width;
    unit.forEach((arr, index) => {
      realPosition = 0;
      let len = accMul(arr.length, tempNumber);
      for (let i = 0; i < len; i++) {
        let obj = {
          type: "header",
          text: arr[realPosition],
          x: index * w,
          y: i * unitHeaderHeight[index] + topHeaderHeight,
          width: w,
          height: unitHeaderHeight[index],
        };
        rowHeader.push(obj);
        realPosition++;
        if (realPosition === arr.length) {
          realPosition = 0;
        }
      }
      tempNumber = arr.length * tempNumber;
    });
    return rowHeader;
  }
  // 规格与属性组合，获取input绘制信息
  function initSku({ skuList, skuAttr, setting }) {
    skuList.length;
    let input = setting.input;
    let initArr = [];

    skuList.forEach((item, index) => {
      for (let i = 0; i < skuAttr.length; i++) {
        let obj = {
          type: "input",
          row: item,
          column: skuAttr[i],
          width: input.width,
          height: input.height,
          borderRadius: input.borderRadius,
          x: (input.width + input.marginLeft) * i + leftHeaderWidth,
          y: (input.height + input.marginTop) * index + topHeaderHeight,
          text: item + skuAttr[i],
          attr: item + skuAttr[i],
        };
        initArr.push(obj);
      }
    });
    return initArr;
  }
  // 节点绘制 input 与 header
  function draw(ctx, node, offsetY) {
    console.log(node);
    const { width, height, text, type } = node;
    const x = node.x;
    const y = offsetY + node.y;
    if (type === "input") {
      const w = setting.input.width;
      const h = setting.input.height;
      const r = setting.input.borderRadius;
      ctx.lineWidth = 1;
      ctx.strokeStyle = setting.input.borderColor;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = "textColor";
      ctx.font = "14px Arial";
      ctx.fillText(text, x, y + (2 / 3) * h);
    } else if (type === "header") {
      context.fillStyle = "#eee";
      context.strokeRect(x, y, width, height);
      context.fillStyle = "#000";
      context.fillText(text, x, y + (2 / 3) * height);
    }
  }
  // input 显示
  function showDom({ x, y, width, height, text, borderRadius }) {
    limitInput.style.top = y + offsetY + "px";
    limitInput.style.left = x + "px";
    limitInput.value = text;
  }
  // 位置判断
  function judgePisition(mx, my, node, index) {
    const { x, y, width, height, text } = node;
    if (mx > x && mx < x + width && my > y && my < my + height) {
      showDom(node);
      currentNode = node;
    }
  }
  // 开始绘制
  function pageRender() {
    for (let i = 0; i < inputList.length; i++) {
      draw(context, inputList[i], offsetY);
    }
    for (let j = 0; j < rowtd.length; j++) {
      draw(context, rowtd[j], offsetY);
    }
  }
  function onMouseWheel(ev) {
    /*当鼠标滚轮事件发生时，执行一些操作*/
    var ev = ev || window.event;
    var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
    down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
    if (down) {
      offsetY -= 30;
    } else {
      offsetY += 30;
    }
    if (offsetY > 0) {
      offsetY = 0;
      return false;
    }
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    pageRender();
    if (ev.preventDefault) {
      /*FF 和 Chrome*/
      ev.preventDefault(); // 阻止默认事件
    }
    return false;
  }

  function addEvent(obj, xEvent, fn) {
    if (obj.attachEvent) {
      obj.attachEvent("on" + xEvent, fn);
    } else {
      obj.addEventListener(xEvent, fn, false);
    }
  }

  // 初始化调用
  function initLimiteSku({ mysetting, myunit, myskuAttr }) {
    // —————————————————————————————— 标签初始化 ——————————————————————————————

    limitCanvas = document.createElement("canvas");
    limitCanvas.setAttribute("id", "limitCanvas");
    limitInput = document.createElement("input");
    limitInput.setAttribute("id", "realInput");
    let con = document.getElementById("limitless-sku");
    con.appendChild(limitCanvas);
    con.appendChild(limitInput);
    context = limitCanvas.getContext("2d");

    // —————————————————————— 合并参数 && 初始化位置信息 ——————————————————————————

    unit = myunit;
    skuAttr = myskuAttr;
    for (prop in mysetting) {
      if (setting[prop]) {
        Object.assign(setting[prop], mysetting[prop]);
      }
    }

    domPerchLeft = limitCanvas.getBoundingClientRect().left; // 组件距离浏览器 --- left ---
    domPerchTop = limitCanvas.getBoundingClientRect().top; // 组件距离浏览器 --- top ---

    addStyle();
    // —————————————————————————————  初始化表头 ——————————————————————————————

    leftHeaderWidth = unit.length * setting.header.width; // 表格左侧表头宽度 --- width ---
    unitHeaderHeight = getRowHeaderUnitHeight(unit, setting.header.height); // 表格左侧表头单元格合并后每列高度 --- height ---

    // —————————————————————————————  处理数据 ——————————————————————————————

    getAllSku(unit, 0, ""); // 获取规格全排列组合 （直接操作skuList数组,无返回值）

    rowtd = initRowHeader({ unit, unitHeaderHeight });
    inputList = initSku({ skuList, skuAttr, setting });

    // —————————————————————————————  根据内容宽度设置画布 ——————————————————————————————
    listLength =
      skuList.length * (setting.input.height + setting.input.marginTop);
    let listWidth = skuAttr.length * (setting.input.width + setting.input.marginLeft);
    canvasWidth = listWidth + leftHeaderWidth; // 不给横向虚拟滚动
    canvasHeight =
      setting.container.height === null ? listLength : setting.container.height;

    limitCanvas.width = canvasWidth;
    limitCanvas.height = canvasHeight;
    limitCanvas.style.width = canvasWidth + "px";
    limitCanvas.style.height = canvasHeight + "px";

    // —————————————————————————————  添加事件 && 渲染 ——————————————————————————————
    limitInput.addEventListener("input", function (e) {
      currentNode.text = e.target.value;
      context.clearRect(
        currentNode.x,
        currentNode.y + offsetY,
        currentNode.width,
        currentNode.height
      );
      draw(context, currentNode, offsetY);
    });

    limitCanvas.addEventListener("mousemove", (e) => {
      const mx = e.pageX;
      const my = e.pageY;
      for (let i = 0; i < inputList.length; i++) {
        judgePisition(
          mx - domPerchLeft,
          my - offsetY - domPerchTop,
          inputList[i]);
      }
    });

    pageRender();
    if (setting.container.width || setting.container.height) {
      addEvent(limitCanvas, "mousewheel", onMouseWheel);
      addEvent(limitCanvas, "DOMMouseScroll", onMouseWheel);
    }
  }

  return initLimiteSku;

}));
