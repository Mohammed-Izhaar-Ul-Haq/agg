import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import Table from './Table';

const TabMenu = ({ selectedMenu }) => {
  //STATE
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState([]);

  //Construct TabItems format for Tabs Component
  const tabItems = selectedMenu?.worksheetIds?.map(worksheet => {
    return {
      label: worksheet.worksheetName,
      key: worksheet.worksheetId,
      children: <Table worksheet={worksheet} />
    }
  });

  useEffect(() => {
    setTabs(tabItems);
    //By default select the first tab
    setActiveTab(tabItems?.[0]?.key);
  }, [selectedMenu])

  /**
   * @description Handles Tab Change
   * @returns none
   */
  const onChange = (newActiveKey) => {
    setActiveTab(newActiveKey);
  };

  return (
    <Tabs
      tabPosition='bottom'
      type="editable-card"
      onChange={onChange}
      activeKey={activeTab}
      items={tabs}
      style={{ height: 'calc(90vh - 120px)', zIndex: 0 }}
      />
  );
};

export default TabMenu;