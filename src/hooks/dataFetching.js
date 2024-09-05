import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

/**
 * @description Retrieves all workbooks.
 * @returns {Object} - Workbook data, loading and error states.
 */
export const useGetWorkbooks = () => {
  const {
    data: workbooksData,
    isFetching: workbooksLoading,
    isError: workbooksError,
  } = useQuery(
    [`workbooks`],
    ({ signal }) => axios.get('http://localhost:3001/workbooks', { signal }),
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
      select: response => {
        return response?.data || [];
      }
    });
  return {
    workbooksData,
    workbooksLoading,
    workbooksError
  };
};

/**
 * @description Retrieves a worksheet data.
 * @returns {Object} - worksheet data, loading and error states.
 */

export const useGetWorksheetData = ({
  worksheetId = ''
}) => {
  const {
    data: worksheetData,
    isFetching: worksheetLoading,
    isError: worksheetError,
    refetch: refresh
  } = useQuery(
    [worksheetId],
    ({ signal }) => axios.get(`http://localhost:3001/worksheets/${worksheetId}`, { signal }),
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
      select: response => {
        return response?.data || [];
      }
    });
  return {
    worksheetData,
    worksheetLoading,
    worksheetError,
    refresh
  };
};

export const useDeleteRow = ({
  worksheetId = ''
}) => {
  const {
    mutate: performDeleteRow,
    isLoading: deleteRowLoading,
    isError: deleteRowError
  } = useMutation(
    ({updatedWorksheet}) => {
      console.log(updatedWorksheet, "deletedata")
      return axios.patch(`http://localhost:3001/worksheets/${worksheetId}`, updatedWorksheet)}
  );

  return {
    performDeleteRow,
    deleteRowLoading,
    deleteRowError
  };
};

export const useAddRow = ({
  worksheetId = ''
}) => {
  const {
    mutate: performAddRow,
    isLoading: addRowLoading,
    isError: addRowError
  } = useMutation(
    ({updatedWorksheet}) => {
      return axios.patch(`http://localhost:3001/worksheets/${worksheetId}`, updatedWorksheet)}
  );

  return {
    performAddRow,
    addRowLoading,
    addRowError
  };
}

export const useAddColumn = ({
  worksheetId = ''
}) => {
  const {
    mutate: performAddColumn,
    isLoading: addColumnLoading,
    isError: addColumnError
  } = useMutation(
    (updatedWorksheet) => {
      return axios.patch(`http://localhost:3001/worksheets/${worksheetId}`, updatedWorksheet);
    }
  );

  return {
    performAddColumn,
    addColumnLoading,
    addColumnError
  };
}
export const useUpdateCell = ({
  worksheetId = ''
}) => {
  const {
    mutate: performUpdateCell,
    isLoading: updateCellLoading,
    isError: updateCellError
  } = useMutation(
    ({updatedWorksheet}) => {
      return axios.patch(`http://localhost:3001/worksheets/${worksheetId}`, updatedWorksheet)}
  );

  return {
    performUpdateCell,
    updateCellLoading,
    updateCellError
  };
}
