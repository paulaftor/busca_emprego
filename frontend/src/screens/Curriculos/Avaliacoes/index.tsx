import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Header } from '../../../components';
import { useParams } from 'react-router-dom';
import { useStore } from '../../../hooks/stores';
import { ListaAvaliacoes } from '../../../components/ListaVagas/Candidato/ListaCandidatoAvaliar';

const Avaliacoes = () => {
  const { curriculoStore, loginStore } = useStore();
  const { idCurriculo } = useParams();
  const [list, setList] = useState([]);

  useEffect(() => {
    async function handleAvaliacoes() {
      const response = await curriculoStore.handleListAvaliacoes(idCurriculo ?? '', loginStore.token);
      setList(response.map((e: any) => ({ ...e.Vaga, status: e.status })));
      curriculoStore.setListAvaliacoes(response);
    }

    handleAvaliacoes();
  }, [idCurriculo, loginStore.token, curriculoStore]);

  return (
    <Box bgcolor="rgb(245 245 244)">
      <Header titleHeader="Estas são as suas avaliações..." />
      <Box minHeight="84.2vh" position="relative" bottom="30px">
        <ListaAvaliacoes listagem={list} idCurriculo={idCurriculo || ''} />
      </Box>
    </Box>
  );
};

export default Avaliacoes;
