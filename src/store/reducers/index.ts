import { combineReducers } from "redux";
import { cveReducer } from "./cve";
import { friendReducer } from "./contacts";
import { userReducer } from "./user";

const rootReducer = combineReducers({
  user: userReducer,
  cve: cveReducer,
  contacts: friendReducer,
});

export default rootReducer