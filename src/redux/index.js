import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { UPDATE_DATA } from "./updateTypes";

// 定义初始状态
const initialState = {
  data: [],
};

// 创建根级 reducer
const rootReducer = (state = initialState, action) => {
  // 定义你的 reducer 逻辑
  switch (action.type) {
    case UPDATE_DATA:
      return { ...state, data: [...action.payload] };
    default:
      return state;
  }
};

// 配置 Redux Persist
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建 Redux 存储
const store = configureStore({
  reducer: persistedReducer,
});

// 初始化 Redux Persist
const persistor = persistStore(store);

export { store, persistor };
