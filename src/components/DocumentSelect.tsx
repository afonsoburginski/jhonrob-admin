import React, { useMemo } from 'react';
import Select, { GroupBase, OptionProps } from 'react-select';

interface Document {
  documento: string;
  item: string;
  produto?: {
    codigo: string;
    descricao: string;
  };
}

interface DocumentSelectProps {
  documents: Document[];
  value: OptionProps<Document> | null;
  onChange: (value: OptionProps<Document> | null) => void;
  placeholder: string;
}

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

const formatGroupLabel = (data: GroupBase<Document>) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const DocumentSelect: React.FC<DocumentSelectProps> = ({ documents, value, onChange, placeholder }) => {
  const groupedOptions = useMemo(() => documents.reduce((groups, item) => {
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
  }, [] as GroupBase<Document>[]), [documents]);

  const selectedOption = useMemo(() => {
    return groupedOptions
      .flatMap(group => group.options)
      .find(option => option.value === value?.value);
  }, [groupedOptions, value]);

  return (
    <Select
      options={groupedOptions}
      value={selectedOption}
      onChange={onChange}
      formatGroupLabel={formatGroupLabel}
      placeholder={placeholder}
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
