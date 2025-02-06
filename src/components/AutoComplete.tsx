
import { useState } from 'react';
import { Combobox, TextInput, useCombobox } from '@mantine/core';

type data = Record<string, string>

interface Props {
    data: Array<data>;
    placeholder: string;
    label: string;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean;
    rightSection?: React.ReactNode;
    getSelectedValue?: (val: string) => void;
}

export default function AutoComplete(props: Props) {
    const { placeholder, label, data, handleChange, required, rightSection, getSelectedValue } = props;

    const combobox = useCombobox();
    const [value, setValue] = useState('');
    const shouldFilterOptions = !data?.some((item) => item?.name === value);
    const filteredOptions = shouldFilterOptions
        ? data.filter((item) => item?.name.toLowerCase().includes(value.toLowerCase().trim()))
        : data;

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item?.name} key={item?.id}>
            {item?.name}
        </Combobox.Option>
    ));
    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                setValue(optionValue)
                getSelectedValue && getSelectedValue(optionValue)
                combobox.closeDropdown();
            }}
            store={combobox}
            withinPortal={false}
        >
            <Combobox.Target>
                <TextInput
                    label={label}
                    placeholder={placeholder || ""}
                    value={value}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        combobox.openDropdown();
                        combobox.updateSelectedOptionIndex();
                        handleChange && handleChange(event);
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    required={required}
                    rightSection={rightSection}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}