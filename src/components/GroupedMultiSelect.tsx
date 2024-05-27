import React, { CSSProperties } from 'react';
import Select, { GroupBase, OptionProps } from 'react-select';

const groupStyles = {
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
  textAlign: 'center',
};

const localStyles: CSSProperties = {
  marginLeft: 'auto',
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  padding: '0.1em 0.3em',
  fontSize: 12,
};

const formatGroupLabel = (data: GroupBase<OptionProps>) => (
  <div style={groupStyles}>
    <span>Item: {data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

interface GroupedMultiSelectProps {
  shipmentItems: any[];
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
}

const GroupedMultiSelect: React.FC<GroupedMultiSelectProps> = ({ shipmentItems, value, onChange, placeholder }) => {
  const groupedOptions = shipmentItems.reduce((groups, item) => {
    const group = groups.find((group: { label: any; }) => group.label === item.item);
    if (group) {
      group.options.push({ 
        value: item.codigoProduto, 
        label: (
          <div style={{ display: 'flex' }}>
            <span>{`${item.codigoProduto} - ${item.descricaoProduto}`}</span>
            <span style={localStyles}>{item.local}</span>
          </div>
        )
      });
    } else {
      groups.push({ 
        label: item.item, 
        options: [{ 
          value: item.codigoProduto, 
          label: (
            <div style={{ display: 'flex' }}>
              <span>{`${item.codigoProduto} - ${item.descricaoProduto}`}</span>
              <span style={localStyles}>{item.local}</span>
            </div>
          )
        }] 
      });
    }
    return groups;
  }, []);

  return (
    <Select
      isMulti
      options={groupedOptions}
      value={value}
      onChange={onChange}
      formatGroupLabel={formatGroupLabel}
      placeholder={placeholder}
      styles={{ 
        control: (base) => ({ ...base, maxWidth: '1010px' }),
        valueContainer: (base) => ({
          ...base,
          height: 'auto',
          maxHeight: '68px', // Limita a altura máxima para o equivalente a duas linhas
          overflowY: 'auto', // Adiciona uma barra de rolagem vertical se necessário
        }),
      }}
    />
  );
};

export default GroupedMultiSelect;
