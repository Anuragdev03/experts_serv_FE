import { MultiSelect as MultiSelector } from '@mantine/core';

interface Props {
    label: string;
    placeholder: string;
    data: Array<string>;
    handleChange: (value: string[]) => void
    value?: string[];
}

function MultiSelect(props:Props) {
    const { label, placeholder, data, handleChange, value} = props;
  return (
    <MultiSelector
      label={label}
      placeholder={placeholder}
      data={data}
      searchable
      nothingFoundMessage="Nothing found..."
      onChange={handleChange}
      value={value}
    />
  );
}

export default MultiSelect