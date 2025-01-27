import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Header } from '../../../components';
import { useParams } from 'react-router-dom';
import { useStore } from '../../../hooks/stores';
import { Lista } from '../../../components/ListaVagas/Candidato/ListaCandidato';


const MinhasCandidaturas = () => {
  const {curriculoStore, loginStore} = useStore()
  const {idCurriculo} = useParams()
  const [list, setList] = useState([])

  useEffect(() => {
    async function handleCandidacy() {
     const response = await curriculoStore.handleListCandidacy(idCurriculo ?? '', loginStore.token)
     setList(response.map((e: any) => {return { ...e.Vaga, status: e.status,}}))
     curriculoStore.setListCandidacy(response)
    }

    handleCandidacy()
  }, [])

  return (
    <Box bgcolor="rgb(245 245 244)">
      <Header titleHeader="Estas são as suas candidaturas..." />
      <Box minHeight="84.2vh" position="relative" bottom="30px">
          <Lista listagem={ list} idCurriculo={idCurriculo ?? ''} />
        
      </Box>

    </Box>
  )
}

export default MinhasCandidaturas;