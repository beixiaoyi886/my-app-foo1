import { UPDATE_DATA } from "./updateTypes";
// 定义动作创建函数
export const updateData = (newData) => ({
  type: UPDATE_DATA,
  payload: [...newData],
});
