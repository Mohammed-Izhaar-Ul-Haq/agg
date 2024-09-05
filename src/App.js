import "./App.css";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import React from "react";
import Container from "./components/Container";
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Container />
  </QueryClientProvider>
);

export default App;