import React, { useMemo } from 'react';
import Select, { GroupBase } from 'react-select';
import { CSSProperties } from 'react';

interface DocumentOption {
  documento: string;
  item: string;
  produto?: {
    codigo: string;
    descricao: string;
  };
}

interface DocumentSelectProps {
  documents: DocumentOption[];
  value: DocumentOption | null;
  onChange: (value: DocumentOption | null) => void;
  placeholder: string;
}

const groupStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const groupBadgeStyles: CSSProperties = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center' as const,
};

const formatGroupLabel = (data: GroupBase<DocumentOption>) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const DocumentSelect: React.FC<DocumentSelectProps> = ({ documents, value, onChange, placeholder }) => {
  const groupedOptions = useMemo(() => {
    return documents.reduce((groups, item) => {
      const group = groups.find(group => group.label === item.documento);
      const option = {
        ...item,
        value: `${item.documento}-${item.item}`,
        label: `Item: ${item.item} (${item.produto?.codigo}) ${item.produto?.descricao}`,
      };
      if (group) {
        group.options = [...group.options, option];
      } else {
        groups.push({
          label: item.documento,
          options: [option],
        });
      }
      return groups;
    }, [] as GroupBase<DocumentOption>[]);
  }, [documents]);

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
