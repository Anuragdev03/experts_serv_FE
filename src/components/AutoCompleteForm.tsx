import { useState } from 'react';
import { Combobox, TextInput, useCombobox } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';

type data = Record<string, string>

interface Props {
    data: Array<data>;
    name: string;
    control: Control<any>;
    placeholder: string;
    rules?: any;
    label: string;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
}

export function AutoCompleteForm(props: Props) {
    const { control, name, placeholder, rules, label, data, handleChange, required} = props;
    const combobox = useCombobox();
    const [value, setValue] = useState('');
    const shouldFilterOptions = !data.some((item) => item?.name === value);
    const filteredOptions = shouldFilterOptions
        ? data.filter((item) => item?.name.toLowerCase().includes(value.toLowerCase().trim()))
        : data;

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item?.name} key={item?.id}>
            {item?.name}
        </Combobox.Option>
    ));

    return (
        <Controller
        name={name}
        rules={rules}
        control={control}
            render={({
                field: { value, onChange },
                fieldState: { error },
            }) => (
                <>
                    <Combobox
                        onOptionSubmit={(optionValue) => {
                            onChange(optionValue);
                            setValue(optionValue)
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
                                    onChange(event.currentTarget.value);
                                    setValue(event.currentTarget.value);
                                    combobox.openDropdown();
                                    combobox.updateSelectedOptionIndex();
                                    handleChange && handleChange(event);
                                }}
                                onClick={() => combobox.openDropdown()}
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                error={error?.message ? error?.message : ""}
                                required={required}
                            />
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>
                                {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                            </Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                </>
            )}
        />
    );
}