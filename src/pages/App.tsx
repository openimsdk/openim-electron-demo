import { MinusOutlined, ExpandOutlined, CloseOutlined } from "@ant-design/icons";
import { Provider } from "react-redux";
import MyRoute from "../route";
import store from "../store";
import "./App.less";


function App() {
  return (
    <Provider store={store}>
      <MyRoute/>
    </Provider>
  );
}

export default App;
