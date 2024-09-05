import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Input } from 'antd';
import { useGetWorkbooks } from '../hooks/dataFetching';
import TabMenu from './Tabs';

const { Header, Sider, Content } = Layout;

const Container = () => {
  //STATE
  const [menuOpen, setMenuOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);

  //Fetch Workbook Data Query
  const {
    workbooksData,
    workbooksLoading,
    workbooksError,
  } = useGetWorkbooks();

  useEffect(() => {
    setMenuItems(workbooksData);
    //By default select the first menu item
    setSelectedMenu(workbooksData?.[0]);
  }, [workbooksData])

  /**
   * @description Filters Workbooks.
   * @returns [] - workbooks data
   */
  const handleSearch = (e) => {
    //can be optimized by using debounce
    //can also use backend search and pass searched data to api in params or payload
    const { value } = e.target;
    const filteredMenuOptions = workbooksData?.filter((item) => item?.label?.toLowerCase().includes(value.toLowerCase()));
    setMenuItems(filteredMenuOptions);
  }

  /**
   * @description Generic Error Message.
   * @returns DOM
   */
  const getErrorMessage = () => {
    return (
      <div className="error-msg">
        <ExclamationCircleOutlined />
        <div>Something went wrong!</div>
      </div>
    )
  }

  /**
   * @description Sets the current clicked Menu as Selected Menu.
   * @returns none
   */
  const handleMenuSelection = (key) => {
    setSelectedMenu(menuItems?.find((item) => item.key === parseInt(key)));
  }

  const getMenuButton = () => {
    return (
      <Button
        type="text"
        className="menu-trigger-button"
        icon={menuOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={() => setMenuOpen(!menuOpen)}
      />
    )
  }

  return (
    <Layout className="layout-container">
      {
        menuOpen && <Sider className="menu-container" width={250} theme="light">
          <div className="menu-header">
            {menuOpen && getMenuButton()}
            <div className="my-workbooks-title">My Workbooks</div>
          </div>
          <div>
            <Input
              id="menu-filter-text-box"
              className="menu-filter-search-box"
              type="text"
              size="large"
              placeholder="Search Here..."
              variant='outlined'
              onChange={handleSearch}
            />
            {
              //Show Error Message if API fails else show Menu
              workbooksError ? getErrorMessage() : <Menu
                theme="light"
                mode="inline"
                className="menu-container"
                loading={workbooksLoading}
                defaultSelectedKeys={['1']}
                items={menuItems}
                onClick={({ key }) => handleMenuSelection(key)}
              />
            }
          </div>
        </Sider>
      }
      <Layout>
        <Header className="header-container">
          {!menuOpen && getMenuButton()}
        </Header>
        <Content className="content-container">
          <TabMenu selectedMenu={selectedMenu} />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Container;