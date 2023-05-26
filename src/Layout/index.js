import React, { useEffect, useState } from "react";
import { Menu, Input, Button } from "antd";
import styled from "styled-components";

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
    console.log(data);
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
    setMenuItems([...list]);
    sessionStorage.setItem("MENUITEMS", JSON.stringify(list));
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
          const stack = [...data];
          while (stack.length > 0) {
            const node = stack.pop();
            if (node?.key === key) {
              node.name = value;
            }
            if (node.children && node.children.length > 0) {
              stack.push(...node.children);
            }
          }
          updateMenuItems([...data]);
        };
        traverseTree(menuItems, key, name);

        setEditedMenuName(getItemByKey(selectedMenu)?.name);
      }
      save(selectedMenu, updatedMenuName);
    }
  };

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} title={item.name}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return <Menu.Item key={item.key}>{item.name}</Menu.Item>;
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

  useEffect(() => {
    // 从后端获取数据初始化menuItems
    const _excu = async () => {
      const data = await fetchMenuItems();
      setMenuItems(data);
    };
    const cacheMenuItems = JSON.parse(sessionStorage.getItem("MENUITEMS"));
    if (cacheMenuItems && cacheMenuItems.length > 0) {
      setMenuItems(cacheMenuItems);
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
      </ContainerDiv>
    </div>
  );
}

export default Layout;
