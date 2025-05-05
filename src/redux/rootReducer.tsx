import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import userReducer from "./slices/userSlice";
import messageReducer from  './slices/messageSlice';
import storage from "redux-persist/lib/storage";
export const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: [],
};

export const productPersistConfig = {
  key: "product",
  storage,
  keyPrefix: "redux-",
  whitelist: ["sortBy", "checkout"],
};

const rootReducer = combineReducers({
  users: userReducer,
  message:messageReducer
 
});

export default rootReducer;
