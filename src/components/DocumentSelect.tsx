'use client'
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { DataContext } from '@/context/DataProvider';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import debounce from 'lodash.debounce';

export default function DocumentSelect() {
  const { setSelectedData, setShipmentData, setSelectedDocument } = useContext(DataContext);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [shipmentItems, setShipmentItems] = useState<Item[]>([]);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [savedDocuments, setSavedDocuments] = useState<Set<string>>(new Set());

  useEffect(() => {
    axios.get<DocumentData[]>(`${process.env.NEXT_PUBLIC_API_URL}/ordens-de-producao/ofs?page=0&size=100`)
      .then(response => {
        setDocuments(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar documentos:', error);
        setErrorMessages(prev => ({ ...prev, documents: 'Erro ao carregar documentos' }));
      });
  }, []);

  const loadOptions = debounce((inputValue: string, callback: (options: any[]) => void) => {
    if (inputValue.trim() === "") {
      callback([]);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/ordens-de-producao/ofs?page=0&size=100000000`;

    axios.get(apiUrl)
      .then(response => {
        const data = response.data;
        const filteredData = data.filter((item: any) =>
          item.documento.toString().includes(inputValue) ||
          item.pessoa?.descricao?.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.produto.descricao.toLowerCase().includes(inputValue.toLowerCase())
        );

        const limitedData = filteredData.slice(0, 100);

        limitedData.sort((a: any, b: any) => a.item - b.item);

        const groupedOptions = limitedData.reduce((acc: any, item: any) => {
          const label = `OF:${item.documento} - Cliente: ${item.pessoa?.descricao}`;
          const existingGroup = acc.find((group: any) => group.label === label);

          if (existingGroup) {
            existingGroup.options.push({
              value: item,
              label: `Item:${item.item} - ${item.produto.codigo} - ${item.produto.descricao}`
            });
          } else {
            acc.push({
              label,
              options: [{
                value: item,
                label: `Item:${item.item} - ${item.produto.codigo} - ${item.produto.descricao}`
              }]
            });
          }

          return acc;
        }, []);

        callback(groupedOptions);
      })
      .catch(error => {
        console.error('Erro ao carregar opções:', error);
        callback([]);
      });
  }, 300);

  const handleDocumentSelect = (selectedOption: any) => {
    if (selectedOption) {
      const selectedDocument = selectedOption.value;
      setSelectedDocument(selectedDocument);
      setSelectedData((prevData: any) => ({ ...prevData, documentData: selectedDocument }));

      axios.get<Item[]>(`${process.env.NEXT_PUBLIC_API_URL}/itens-de-embarque?empresa=1&documento=${selectedDocument.documento}&item=${selectedDocument.item}`)
        .then(response => {
          const items = response.data.map(item => ({
            ...item,
            quantidadeEnviada: 0
          }));

          const fetchDrawingPaths = items.map(item =>
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/desenhos-produto/${item.codigoProduto}/caminho-desenho`)
              .then(response => {
                const caminhoDesenho = response.data.caminhoDesenho;
                const newItem = { ...item, caminhoDesenho: caminhoDesenho };
                return newItem;
              })
              .catch(error => {
                console.error(`Erro ao carregar caminho do desenho para o produto ${item.codigoProduto}:`, error);
                const newItem = { ...item, caminhoDesenho: '' };
                return newItem;
              })
          );

          Promise.all(fetchDrawingPaths)
            .then(itemsWithDrawingPaths => {
              const filteredItems = itemsWithDrawingPaths.filter(item => {
                if (session?.user?.role === "Exp") {
                  return item.local === "E";
                } else if (session?.user?.role === "Amp") {
                  return item.local === "A";
                }
                return false;
              });
              setShipmentItems(filteredItems);
              setShipmentData(filteredItems);
              setSelectedData((prevData: any) => ({ ...prevData, shipmentData: filteredItems }));
            });
        })
        .catch(error => {
          console.error('Erro ao carregar itens de embarque:', error);
          setErrorMessages(prev => ({ ...prev, shipmentItems: 'Erro ao carregar itens de embarque' }));
        });
    }
  };
  
  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      maxHeight: '400px',
      overflowY: 'auto',
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: '400px',
    }),
  };

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      defaultOptions
      placeholder="Selecione o documento"
      onChange={handleDocumentSelect}
      formatGroupLabel={(data) => (
        <div className="text-gray-700 text-base font">
          <strong>{data.label}</strong>
        </div>
      )}
      styles={customStyles}
          theme={(theme) => ({
      ...theme,
      borderRadius: 5,
      colors: {
        ...theme.colors,
        primary25: 'lightgray',
        primary: 'red',
      },
    })}
    />
  );
}
