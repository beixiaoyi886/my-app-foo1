import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默认使用 localStorage

// 创建根级 reducer
const rootReducer = (state, action) => {
  // 定义你的 reducer 逻辑
};

// 配置 Redux Persist
const persistConfig = {
  key: "root", // 根键名
  storage, // 存储引擎
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建 Redux 存储
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
