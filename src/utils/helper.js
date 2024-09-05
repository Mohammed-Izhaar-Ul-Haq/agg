export const getDefaultValue = (dataType) => {
    switch (dataType) {
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'date':
        return new Date().toISOString();
      default:
        return '';
    }
  };