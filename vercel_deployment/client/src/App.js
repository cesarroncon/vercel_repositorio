import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataReceiver() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Função para buscar os dados do servidor
    const fetchData = async () => {
      try {
        //const response = await axios.get('http://localhost:5000/'); // Faz a solicitação GET para o servidor
        const response = await axios.get('https://vercel-repositorio-server.vercel.app/');
        setData(response.data); // Define os dados recebidos no estado
      } catch (error) {
        console.error('Erro ao buscar os dados do servidor:', error);
      }
    };

    fetchData(); // Chama a função para buscar os dados quando o componente é montado
  }, []);

  return (
    <div>
      <h2>Dados Recebidos do Servidor:</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Exibe os dados recebidos
      ) : (
        <p>Carregando...</p> // Exibe "Carregando..." enquanto aguarda os dados
      )}
    </div>
  );
}

export default DataReceiver;
