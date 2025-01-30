import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/stores';
import { saveAvaliacao } from '../../../service/curriculo';
import { useParams } from 'react-router-dom';
import { Box, Snackbar, Alert } from '@mui/material';
interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  periodo: string;
  salario: number;
  visualizar: number;
  EmpresaId: string;
  Empresa: {
    logo: string;
    nome: string;
  };
  status?: string;
}

interface ListaProps {
  listagem: Vaga[];
  idCurriculo: string;
}

export const ListaAvaliacoes = observer((props: ListaProps) => {

  const { listagem, idCurriculo } = props;
  const { loginStore, snackbarStore } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [nota, setNota] = useState<number>(0);
  const [pros, setPros] = useState<string>('');
  const [contras, setContras] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const openModal = (vaga: Vaga) => {
    setSelectedVaga(vaga);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNota(0);
    setPros('');
    setContras('');
  };

  const saveEvaluation = async () => {
    if (selectedVaga && nota > 0 && pros && contras) {
        try {
          const result = await saveAvaliacao(
            idCurriculo,
            selectedVaga.id,
            Number(idCurriculo),
            'Candidato',
            Number(selectedVaga.id),
            nota,
            pros,
            contras,
            loginStore.token
          );

          snackbarStore.setSeverity('success');
          snackbarStore.setMessage('Avaliação enviada com sucesso');
          snackbarStore.setOpenSnackbar(true);
          closeModal();
        } catch (error) {
          snackbarStore.setSeverity('error');
          snackbarStore.setMessage('Erro ao enviar avaliação. Tente novamente.');
          snackbarStore.setOpenSnackbar(true);
        }
    } else {
        snackbarStore.setSeverity('error');
        snackbarStore.setMessage('Preencha todos os campos');
        snackbarStore.setOpenSnackbar(true);
    }
  };

  return (
    <div>
      {listagem.map((e) => (
        <div
          key={e.id}
          className="container mx-auto max-w-lg bg-white rounded border mt-4"
        >
          <div className="flex px-5 pt-5">
            {e.Empresa.logo == null ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-20 text-background1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
            ) : (
              <img className="w-16" src={e.Empresa.logo} />
            )}
            <span className="pt-2 ml-4">
              <h3 className="font-bold">{e.titulo}</h3>
              <h4 className="text-sm">{e.Empresa.nome}</h4>
            </span>
          </div>
          <h3 className="mt-3 mx-6 font-bold text-[#32264D] text-[18px]">Requisitos</h3>
          <div className="mx-2 text-sm text-gray-500 mt-2 px-5 pb-5">
            {e.descricao.length < 250
              ? e.descricao
              : e.descricao.substring(0, 50) + ' ...'}
          </div>

          <hr />
          <div className="bg-stone-50">
            <div className="p-5 mx-2 flex justify-between items-center">
              <p className="text-slate-400">{e.periodo}</p>
              <p className="text-background1 font-bold">
                {e.salario !== null
                  ? 'R$ ' + e.salario?.toString().replace('.', ',')
                  : 'Faixa de salário indisponível'}
              </p>
              <button
                className="bg-background1 text-white py-2.5 px-6 rounded text-sm flex items-center"
                onClick={() => openModal(e)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="ml-2">Avaliar</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && selectedVaga && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={closeModal}>
          <div className="bg-white p-6 rounded-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg">Avaliar vaga: {selectedVaga.titulo}</h3>

            <div className="mt-4 flex justify-between">
              <label className="text-gray-500 text-sm ml-2">Nota</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNota(star)}
                    className={`text-xl ${star <= nota ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-gray-500 text-sm ml-2">Prós</label>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                rows={3}
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-500 text-sm ml-2">Contras</label>
              <textarea
                value={contras}
                onChange={(e) => setContras(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                rows={3}
              />
            </div>

            <Box className="flex justify-between mt-4">
                <Box className="flex items-center">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-background1"
                  >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  <span className="text-gray-500 text-sm ml-2">
                  Importante! <br /> Preencha todos os dados
                </span>
                </Box>
                <Box>
                  <button
                      onClick={saveEvaluation}
                      className="bg-background1 text-white py-2.5 px-6 rounded text-sm flex items-center"
                    >
                      Salvar Avaliação
                    </button>
                </Box>
              </Box>
          </div>
        </div>
      )}

      <Snackbar
          open={snackbarStore.openSnackbar}
          autoHideDuration={6000}
          onClose={() => snackbarStore.setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => snackbarStore.setOpenSnackbar(false)}
            severity={snackbarStore.severity}
            sx={{ width: '100%' }}
          >
            {snackbarStore.message}
          </Alert>
        </Snackbar>


    </div>
  );
});
