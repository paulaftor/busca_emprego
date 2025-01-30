import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCurriculo } from '../../../service/curriculo';
import { ListarIdiomas } from '../../../components/Curriculo/ListaIdioma';
import { ListarCursos } from '../../../components/Curriculo/ListaCurso';
import { ListarExperiencias } from '../../../components/Curriculo/ListaExperiencia';
import { Typography, ButtonBase, Box, Snackbar, Alert, Select, MenuItem, FormControl } from '@mui/material';
import { useStore } from '../../../hooks/stores';
import perfilIcon from '../../../assets/icons/perfil.png';
import {Avatar} from './styles'
import { BasicModal } from '../../../components/Modal';
import FooterButtons from './components/FooterButtons';
import { Header } from './components/Header';
import { UpdateStatusModal } from './components/UpdateStatus';
import { DenunciaModal } from './components/Denuncia';
import { AvaliacaoModal } from './components/Avaliacao';

export interface Idioma {
  nome: string;
  nivel: string;
}

export interface Curso {
  curso: string;
  inicio: string;
  termino: string;
  instituicao: string;
  cidade: string;
  pais: string;
}

export interface Experiencia {
  empresa: string;
  ramo: string;
  inicio: string;
  termino: string;
  cidade: string;
  pais: string;
  cargo: string;
}

export interface Curriculo {
  id: string;
  email: string;
  perfil: string;
  nome: string;
  areaAtuacao: string;
  descricao: string;
  idiomas: Idioma[];
  cursos: Curso[];
  experiencias: Experiencia[];
}

type Params = {
  idCurriculo: string, idVaga: string
}

export function ListagemCurriculoCompleto() {
  const { snackbarStore, vagaStore, loginStore } = useStore();
  const { idCurriculo, idVaga } = useParams();
  const [openModal, setOpenModal] = useState(false)
  const [openModalDenuncia, setOpenModalDenuncia] = useState(false)
  const [openModalAvaliacao, setOpenModalAvaliacao] = useState(false)

  const [curriculo, setCurriculo] = useState<Curriculo>({
    id: '',
    email: '',
    perfil: '',
    nome: '',
    areaAtuacao: '',
    descricao: '',
    idiomas: [],
    cursos: [],
    experiencias: [],
  });

  useEffect(() => {
    async function handleCurriculos() {
      const newList = await getCurriculo(idCurriculo as any, loginStore.token);
      const idiomas = newList.Idiomas.map((item: any) => {
        return {
          nome: item.idioma,
          nivel: item.CurriculosIdiomas.nivel,
        };
      });
      const cursos = newList.Cursos.map((item: any) => {
        const inicio = item.CurriculosCursos.inicio;
        const dataInicio = inicio.split('T')[0];
        let termino = item.CurriculosCursos.termino;
        if (termino === '' || termino === null) termino = 'Atualmente';
        return {
          curso: item.curso,
          inicio: dataInicio,
          termino: termino,
          instituicao: item.Instituicaos[0].nome,
          cidade: item.Instituicaos[0].cidade,
          pais: item.Instituicaos[0].pais,
        };
      });
      const experiencias = newList.Experiencias.map((item: any) => {
        const inicio = item.CurriculosExperiencias.inicio;
        const dataInicio = inicio.split('T')[0];
        let termino = item.CurriculosExperiencias.termino;
        if (termino === '' || termino === null) termino = 'Atualmente';
        return {
          empresa: item.empresa,
          ramo: item.ramo,
          inicio: dataInicio,
          termino: termino,
          cidade: item.CurriculosExperiencias.cidade,
          pais: item.CurriculosExperiencias.pais,
          cargo: item.CurriculosExperiencias.cargo,
        };
      });
      const auxCurriculo = {
        id: newList.id,
        email: newList.email,
        perfil: newList.perfil,
        nome: newList.nome,
        areaAtuacao: newList.areaAtuacao,
        descricao: newList.descricao,
        idiomas: idiomas,
        cursos: cursos,
        experiencias: experiencias,
      };
      setCurriculo(auxCurriculo);
    }
    handleCurriculos();
  }, []);

  const copiarEmail = () => {
    navigator.clipboard.writeText(curriculo.email).then(() => {
      alert('Email copiado para a área de transferência')
      // snackbarStore.setOpenSnackbar(true);
      // snackbarStore.setSeverity('success');
      // snackbarStore.setMessage('Email copiado para a área de transferência');
    }).catch(() => {
      alert('Ocorreu um erro ao copiar o email')
      // snackbarStore.setOpenSnackbar(true);
      // snackbarStore.setSeverity('error');
      // snackbarStore.setMessage('Ocorreu um erro ao copiar o email');
    });
    console.log(curriculo.email)
  };


  return (
    <Box bgcolor="rgb(245 245 244)">
      <Box
        maxWidth="100%"
        bgcolor="#5E80BB"
        sx={{
          paddingBlock: '3.6rem',
        }}
      ></Box>
      <Box minHeight="84.2vh" position="relative" bottom="30px">
        <Box
          // key={element.id}
          marginX="auto"
          maxWidth="32rem"
          bgcolor="#FFFFFF"
          border-width="px"
          borderRadius="0.8rem"
          marginBottom="20px"
        >
         <Header curriculo={curriculo}/>
          <Box paddingX="0.3rem">
            <ListarCursos cursos={curriculo.cursos} />
          </Box>
          <Box paddingX="0.3rem">
            <ListarExperiencias experiencias={curriculo.experiencias} />
          </Box>
          <Box paddingX="0.3rem">
            <ListarIdiomas idiomas={curriculo.idiomas} />
          </Box>
          <FooterButtons setOpenModal={setOpenModal} copiarEmail={copiarEmail} setOpenModalAvaliacao={setOpenModalAvaliacao} setOpenModalDenuncia={setOpenModalDenuncia}/>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          position="relative"
          bottom="-30px"
        ></Box>
      </Box>
      <Snackbar
        open={snackbarStore.openSnackbar}
        autoHideDuration={3000}
        onClose={() =>
          snackbarStore.setOpenSnackbar(false)
        }
      >
        <Alert
          onClose={() =>
            snackbarStore.setOpenSnackbar(!snackbarStore.openSnackbar)
          }
          severity={snackbarStore.severity}
          sx={{ width: '100%' }}
        >
          {snackbarStore.message}
        </Alert>
      </Snackbar>

    <BasicModal
      children={<UpdateStatusModal setOpenModal={setOpenModal} idVaga={idVaga} idCandidato={idCurriculo} />}
      open={openModal}
      handleClose={setOpenModal}
      title="Atualizar status da candidatura"
    />

    <BasicModal
      children={<DenunciaModal setOpenModalDenuncia={setOpenModalDenuncia} idVaga={idVaga} idCandidato={idCurriculo} />}
      open={openModalDenuncia}
      handleClose={setOpenModalDenuncia}
      title="Denunciar candidato"
    />

    <BasicModal
      children={<AvaliacaoModal setOpenModalAvaliacao={setOpenModalAvaliacao} idVaga={idVaga} idCandidato={idCurriculo} />}
      open={openModalAvaliacao}
      handleClose={setOpenModalAvaliacao}
      title="Avaliar currículo"
    />

    </Box>
  );
}
