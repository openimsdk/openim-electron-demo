//@ts-nocheck
import { Component } from "react";
import { textSelect, removeDefaultBehavior, isFunction } from "./utils";
import "./index.less";

interface CodeBoxProps {
  validator?: (...args: any[]) => boolean
  length: number
  type: string
  onChange?: (value: string[]) => void
}

export default class extends Component<CodeBoxProps> {

  constructor(props) {
    super(props);
    this.state = {
      code: new Array(props.length).fill(""),
      dom: new Array(props.length)
    };
  }
  onChange(e, i) {
    const value = e.target.value.trim();

    if (isFunction(this.props.validator)) {
      if (value !== "" && !this.props.validator(value, i)) {
        textSelect(e.target);
        return;
      }
    }

    if (this.state.code[i] !== value && value) {
      this.focusOn(i + 1);
    }

    const newCode = this.state.code.map(v => v);
    newCode[i] = value;
    this.setState({ code: newCode });
    textSelect(e.target);
    if (value !== "") {
      this.focusOn(i + 1);
    }
    if (isFunction(this.props.onChange)) {
      if (newCode.every(v => v !== "")) {
        e.target.blur();
      }
      this.props.onChange(newCode);
    }
  }
  getPrevBox(i) {
    return this.state.dom[i - 1];
  }
  getNextBox(i) {
    return this.state.dom[i + 1];
  }
  focusOn(i) {
    const element = this.state.dom[i];
    if (element) {
      element.focus();
    }
  }
  onKeyDown(e, i) {
    const inputElement = e.target;
    switch (e.keyCode) {
      case 8: // 删除完之后，退回到上一个输入框
        if (e.target.value === "") {
          // 如果空的话，那么就退回到上一个输入框
          removeDefaultBehavior(e);
          this.focusOn(i - 1);
        }
        break;
      case 37: // 左
      case 38: // 上
        removeDefaultBehavior(e);
        if (this.getPrevBox(i)) {
          this.focusOn(i - 1);
        } else {
          this.focusOn(i);
        }
        break;
      case 39: // 右
      case 40: // 下
        removeDefaultBehavior(e);
        if (this.getNextBox(i)) {
          this.focusOn(i + 1);
        } else {
          this.focusOn(i);
        }
        break;
      default:
        textSelect(inputElement);
    }
  }
  componentDidCatch(error, info) {
    console.error(error);
  }
  render() {
    const codeBox = [];
    this.state.dom = [];
    const inputType = this.props.type || "input";
    for (let i = 0; i < this.props.length; i++) {
      codeBox.push(
        <div key={i} className="codebox-field-wrap" style={{marginLeft:i==0?'0':'4px'}}>
          <input
            type={inputType}
            maxLength="1"
            autoComplete="false"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={this.state.code[i]}
            ref={dom => (this.state.dom[i] = dom)}
            onFocus={e => textSelect(e.target)}
            onClick={e => textSelect(e.target)}
            onChange={e => this.onChange(e, i)}
            onKeyDown={e => this.onKeyDown(e, i)}
          />
        </div>
      );
    }
    return (
      <div className="codebox-container">
        <form>{codeBox}</form>
      </div>
    );
  }
}
