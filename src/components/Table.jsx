import React, { useMemo, useState, useEffect, useCallback } from 'react';
import ReactDOMServer from 'react-dom/server';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { Button, Space, Input, Dropdown } from 'antd';
import { LoadingOutlined, DeleteOutlined, PlusCircleOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { useGetWorksheetData, useDeleteRow, useAddRow,useAddColumn } from '../hooks/dataFetching';
import { useQueryClient } from '@tanstack/react-query';
import ColumnDrawer from './ColumnDrawer';
import RowModal from './RowModal';

// Register the ClientSideRowModelModule with the grid because we are using the Client-side Row Model
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Table = ({ worksheet }) => {
  // STATE
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const queryClient = useQueryClient();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  // Mutations
  const { performDeleteRow, deleteRowLoading, deleteRowError } = useDeleteRow({
    worksheetId: worksheet.worksheetId
  });

  const { performAddRow, addRowLoading, addRowError } = useAddRow({
    worksheetId: worksheet.worksheetId
  });

  const { performAddColumn, addColumnLoading, addColumnError } = useAddColumn({
    worksheetId: worksheet.worksheetId
  });

  const columnFormatter = (columns) => {
    const columnsFormat = columns?.map(column => ({
      field: column.field,
      headerName: column.name,
      editable: true,
      cellEditor: 'customTextboxEditor',
    }));
    columnsFormat?.unshift({
      headerCheckboxSelection: true, // Shows the checkbox in the header to select/deselect all rows
      checkboxSelection: true, // Adds checkbox to each row in this column
      width: 50 // Optional: Adjusts the width of the checkbox column
    });
    return columnsFormat;
  };

  // Fetching Data Query
  const {
    worksheetData,
    worksheetLoading,
    worksheetError,
    refresh
  } = useGetWorksheetData({
    worksheetId: worksheet?.worksheetId
  });

  useEffect(() => {
    setRowData(worksheetData?.rows?.data);
    setColumns(columnFormatter(worksheetData?.columns));
  }, [worksheetData]);

  useEffect(() => {
    if (gridApi) {
      // Show the loading overlay
      worksheetLoading && gridApi.showLoadingOverlay();
      !worksheetLoading && gridApi.hideOverlay();
    }
  }, [gridApi, worksheetLoading]);

  // Settings to be applied to all columns
  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: false,
      filter: false,  // Disable filter globally
      suppressMenu: true, // Remove filter menu
      editable: true,
      cellEditor: 'customTextboxEditor', // Use the custom editor for all columns
    };
  }, []);

  // Filtering the table data on Search
  const onFilterTextBoxChanged = useCallback(
    ({ target: { value } }) => setQuickFilterText(value),
    []
  );

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const handleDelete = () => {
    const selectedData = gridApi.getSelectedRows();
    // Get the id/ids of the selected data
    const selectedDataIds = selectedData.map(data => data.id);
    if (selectedDataIds.length) {
      const updatedWorksheet = {
        ...worksheetData,
        rows: {
          ...worksheetData.rows,
          data: worksheetData.rows.data.filter(row => !selectedDataIds.includes(row.id))
        }
      };
      performDeleteRow({ updatedWorksheet }, {
        onSuccess: () => {
          console.log("Success");
        },
        onError: (error) => {
          console.log("Error", error);
        },
        onSettled: () => {
          queryClient.invalidateQueries('worksheetData');
        }
      });
    }
  };

  const addNewRow = () => {
    // Base on the columns create a new row
    const newRow = { product_id: '', name: '', category: '', price: 0, stock_quantity: 0, supplier: '', rating: 0 };
    const updatedWorksheet = {
      ...worksheetData,
      rows: {
        ...worksheetData.rows,
        data: [...worksheetData.rows.data, newRow]
      }
    };
    if (newRow) {
      performAddRow({ updatedWorksheet }, {
        onSuccess: () => {
          console.log("Success");
        },
        onError: (error) => {
          console.log("Error", error);
        },
        onSettled: () => {
          queryClient.invalidateQueries('worksheetData');
        }
      });
    }
  };

  const handleRowCountSubmit = (values) => {
    const rowsCount = values.rowsCount;
    const newRows = Array.from({ length: rowsCount }, () => ({
      product_id: '', name: '', category: '', price: 0, stock_quantity: 0, supplier: '', rating: 0
    }));
    const updatedWorksheet = {
      ...worksheetData,
      rows: {
        ...worksheetData.rows,
        data: [...worksheetData.rows.data, ...newRows]
      }
    };
    if (newRows) {
      performAddRow({ updatedWorksheet }, {
        onSuccess: () => {
          console.log("Success");
        },
        onError: (error) => {
          console.log("Error", error);
        },
        onSettled: () => {
          queryClient.invalidateQueries('worksheetData');
        }
      });
    }
  };

  const handleColumnSubmit = (columnData) => {
    console.log('Column Data:', columnData); // Debugging
    if (!Array.isArray(columnData)) {
        console.error('columnData is not an array:', columnData); // Debugging
        return;
    }

    const newColumns = columnData.map(column => ({
        name: column.headerName,
        field: column.field,
        // editable: true,
        // cellEditor: 'customTextboxEditor',
    }));

    console.log('New Columns:', newColumns); // Debugging

    const updatedWorksheet = {
        ...worksheetData,
        columns: [...(worksheetData.columns || []), ...newColumns],
        selectedColumns: [...(worksheetData.selectedColumns || []), ...newColumns],
    };

    console.log('Updated Worksheet:', updatedWorksheet); // Debugging

    if (newColumns.length > 0) {
        performAddColumn(updatedWorksheet, {
            onSuccess: () => {
                console.log("Success");
            },
            onError: (error) => {
                console.log("Error", error);
            },
            onSettled: () => {
                queryClient.invalidateQueries('worksheetData');
            }
        });
    }
};

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const items = [
    {
      label: 'Add Row',
      key: '1',
      icon: <PlusCircleOutlined />,
      onClick: addNewRow
    },
    {
      key: '2',
      label: 'Add Rows',
      icon: <PlusCircleOutlined />,
      onClick: showModal
    },
    {
      key: '3',
      label: 'Add Columns',
      icon: <PlusCircleOutlined />,
      onClick: showDrawer
    },
    {
      key: '4',
      label: 'Delete',
      onClick: handleDelete,
      icon: <DeleteOutlined />,
    }
  ];

  const paginationPageSizeSelector = useMemo(() => {
    return [10, 20, 50];
  }, []);

  return (
    <div className={"ag-theme-quartz table-container"} style={{ height: 650 }}>
      <div className="actions-menu">
        <div className="action-menu-item actions-dropdown">
          <Dropdown menu={{ items }}>
            <Button size="large">
              <Space>
                Actions
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        <Input
          className="action-menu-item search-box"
          type="text"
          size="large"
          id="filter-text-box"
          placeholder="Search Here..."
          variant='outlined'
          onChange={onFilterTextBoxChanged}
          style={{ width: 200, marginBottom: 10 }}
        />
      </div>
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={paginationPageSizeSelector}
        onGridReady={onGridReady}
        rowSelection="multiple"
        quickFilterText={quickFilterText}
        overlayLoadingTemplate={ReactDOMServer.renderToString(
          <LoadingOutlined spin style={{ fontSize: '24px' }} />
        )}
        style={{zIndex: 10}}
      />
      <ColumnDrawer open={openDrawer} onClose={onClose} handleSubmit={handleColumnSubmit} />
      <RowModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleRowCountSubmit={handleRowCountSubmit} />
    </div>
  );
};

export default Table;