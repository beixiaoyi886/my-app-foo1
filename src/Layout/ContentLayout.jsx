import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 根据数据生成路由配置
const generateRoutes = (data, parentPath = "") => {
  return data.map((item) => {
    const path = `${parentPath}/${item.key}`;
    if (item.children && item.children.length > 0) {
      return (
        <Route key={item.key} path={path}>
          {generateRoutes(item.children, path)}
        </Route>
      );
    } else {
      return (
        <Route key={item.key} path={path} element={<h1>{item.name}</h1>} />
      );
    }
  });
};

export default function Content(props) {
  return (
    <div>
      <Routes>
        {/* 生成路由配置 */}
        {generateRoutes(props.menuData)}
      </Routes>
      {props.children}
    </div>
  );
}
