import React from 'react';
import Select from 'react-select';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const DocumentSelect = ({ documents, value, onChange }) => {
  const groupedOptions = documents.reduce((groups, item) => {
    const group = groups.find(group => group.label === item.documento);
    if (group) {
      group.options.push({
        ...item,
        value: `${item.documento}-${item.item}`,
        label: `Item: ${item.item} (${item.produto?.codigo}) ${item.produto?.descricao}`,
      });
    } else {
      groups.push({
        label: item.documento,
        options: [{
          ...item,
          value: `${item.documento}-${item.item}`,
          label: `Item: ${item.item} (${item.produto?.codigo}) ${item.produto?.descricao}`,
        }]
      });
    }
    return groups;
  }, []);

  return (
    <Select
      options={groupedOptions}
      value={groupedOptions
        .flatMap(group => group.options)
        .find(option => option.value === value?.value)}
      onChange={onChange}
      formatGroupLabel={formatGroupLabel}
      styles={{
        control: (base) => ({ ...base, maxWidth: '1010px' }),
        valueContainer: (base) => ({
          ...base,
          height: 'auto',
          maxHeight: '65px',
          overflowY: 'auto',
        }),
      }}
    />
  );
};

export default DocumentSelect;
