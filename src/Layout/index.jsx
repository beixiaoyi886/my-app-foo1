import React, { useEffect, useState } from "react";
import { Menu, Input, Button } from "antd";
import ContentLayout from "./ContentLayout.jsx";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { updateData } from "../redux/updateMethods.js";
import { cloneDeep } from "lodash";
import { Link } from "react-router-dom";
async function fetchMenuItems() {
  try {
    const response = await fetch("./defaultMenuItems.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await response.json();
    // 在这里处理获取到的 JSON 数据
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const HeaderDiv = styled.div`
  width: 100%;
  min-width: 100px;
  height: 30px;
  background-color: rgb(58 57 57);
`;
const ContainerDiv = styled.div`
  display: flex;
`;
const MenuDiv = styled(Menu)`
  width: 300px;
  height: calc(100vh - 30px);
`;
const ContentDiv = styled.div`
  padding: 10px;
  flex: 1;
`;
function Layout() {
  const dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState("menu1"); // 当前选择的菜单项，默认为'menu1'
  const [editedMenuName, setEditedMenuName] = useState("");
  //使用后端存储的数据
  const [menuItems, setMenuItems] = useState([]);
  // menu的选择
  const handleMenuSelect = ({ key }) => {
    setSelectedMenu(key); // 更新当前选择的菜单项
  };
  // 输入框改变
  const handleInputChange = (e) => {
    setEditedMenuName(e.target.value);
  };
  // 更新menuItems
  function updateMenuItems(list) {
    const arr = [...list];

    // 不再使用storage，转为redux
    // sessionStorage.setItem("MENUITEMS", JSON.stringify(list));
    dispatch(updateData([...arr]));
    setMenuItems(arr);
  }
  // 按钮保存
  const handleSaveClick = () => {
    const updatedMenuName = editedMenuName.trim();
    if (updatedMenuName) {
      // 执行保存逻辑，
      function save(key, name) {
        // 临界值判断
        if (!(key && name)) {
          return;
        }
        // while遍历数据，进行更新
        const traverseTree = (data, key, value) => {
          const updateNodeValue = (data, key, value) => {
            return data.map((ma) => {
              if (ma.key === key) {
                return { ...ma, name: value };
              } else if (ma.children && ma.children.length > 0) {
                return {
                  ...ma,
                  children: updateNodeValue(ma.children, key, value),
                };
              } else {
                return ma;
              }
            });
          };
          const clonedData = cloneDeep(data);
          const updatedData = updateNodeValue(clonedData, key, value);
          updateMenuItems(updatedData);
        };
        traverseTree(menuItems, key, name);

        // setEditedMenuName(getItemByKey(selectedMenu)?.name);
      }
      save(selectedMenu, updatedMenuName);
    }
  };

  const renderMenuItems = (items, parentPath = "") => {
    return items.map((item) => {
      const path = `${parentPath}/${item.key}`;
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} title={item.name}>
            {renderMenuItems(item.children, path)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key}>
          <Link to={`${path}`}>{item.name}</Link>
        </Menu.Item>
      );
    });
  };
  // 递归获取item
  function getItemByKey(key, items = menuItems || []) {
    let result;
    items.forEach((ea) => {
      if (result) {
        // 减少不必要的执行
        return;
      }
      if (ea.key === key) {
        result = ea;
      } else if (ea.children && ea.children.length > 0) {
        result = getItemByKey(key, ea.children);
      }
    });
    return result;
  }

  useEffect(() => {
    setEditedMenuName(getItemByKey(selectedMenu)?.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu]);

  const cacheMenuItems = useSelector((state) => state.data);
  useEffect(() => {
    // 从后端获取数据初始化menuItems
    const _excu = async () => {
      const data = await fetchMenuItems();
      setMenuItems(data);
      setEditedMenuName(getItemByKey(selectedMenu, [...data])?.name);
    };
    // 不再使用storage，转为redux
    // const cacheMenuItems = JSON.parse(sessionStorage.getItem("MENUITEMS"));
    if (cacheMenuItems && cacheMenuItems.length > 0) {
      setMenuItems([...cacheMenuItems]);

      setEditedMenuName(getItemByKey(selectedMenu, [...cacheMenuItems])?.name);
    } else {
      _excu();
    }
  }, []);
  return (
    <div>
      <HeaderDiv />
      <ContainerDiv>
        <MenuDiv
          mode="inline"
          theme="dark"
          selectedKeys={[selectedMenu]}
          onSelect={handleMenuSelect}
        >
          {renderMenuItems(menuItems)}
        </MenuDiv>
        <ContentLayout menuData={menuItems}>
          <ContentDiv>
            {/* 当前菜单：{selectedMenu} */}
            <Input
              style={{ width: "200px" }}
              value={editedMenuName}
              onChange={handleInputChange}
              placeholder="输入新菜单名称"
            />
            <Button
              style={{ marginLeft: "10px" }}
              type="primary"
              onClick={handleSaveClick}
            >
              保存
            </Button>
          </ContentDiv>
        </ContentLayout>
      </ContainerDiv>
    </div>
  );
}

export default Layout;
