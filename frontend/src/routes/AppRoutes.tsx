import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useStore } from '../hooks/stores';

import {
  CadastroVaga,
  ListagemCurriculos,
  CadastroCurriculo,
  ListagemVagasCandidato,
  ListagemCurriculoCompleto,
} from '../screens';
import { AlterarVaga } from '../screens/Vagas/AlteraçãoVaga';
import { ExibirVaga } from '../screens/Vagas/ExibirVaga';
import { ListagemVagasEmpresa } from '../screens/Vagas/ListagemVagasEmpresa';
import MinhasCandidaturas from '../screens/Curriculos/MinhasCandidaturas';
import Avaliacoes from '../screens/Curriculos/Avaliacoes';

export function AppRoutes() {
  const { loginStore } = useStore();
  const navigate = useNavigate();
  return (
    <>
      <Sidebar typeUser={loginStore.typeUser} navigate={navigate} />
      <Routes>
        <Route path="candidato/:id/curriculo" element={<CadastroCurriculo />} />
        <Route path="candidato/vagas" element={<ListagemVagasCandidato />} />
        <Route path="candidato/vagas/:id" element={<ExibirVaga />} />
        <Route path="candidato/:idCurriculo/candidaturas" element={<MinhasCandidaturas />} />
        <Route path="candidato/:idCurriculo/avaliacoes" element={<Avaliacoes />} />
        <Route path="empresa/vaga/:idVaga/curriculos" element={<ListagemCurriculos />} />
        <Route path="empresa/curriculo/:idCurriculo/:idVaga" element={<ListagemCurriculoCompleto />} />
        <Route path="empresa/vagas/:id" element={<ListagemVagasEmpresa />} />
        <Route path="empresa/cadastro/vaga" element={<CadastroVaga />} />
        <Route path="empresa/alterar/vaga/:id" elecment={<AlterarVaga />} />
      </Routes>
    </>
  );
}
