import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { saveDenuncia } from "../../../service/curriculo";
import { useStore } from "../../../hooks/stores";
import { Box, Snackbar, Alert } from "@mui/material";
interface ListaProps {
  listagem: {
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
  }[];
  idCurriculo: string;
  candidaturas?: boolean;
}

export const Lista = observer((props: ListaProps) => {
  const navigate = useNavigate();
  const { listagem, idCurriculo } = props;
  const { loginStore, snackbarStore } = useStore();


  // Estado para controlar a exibição do modal e a opção selecionada
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedVagaId, setSelectedVagaId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const [titulo, setTitulo] = useState<string>('');
  const [conteudo, setConteudo] = useState<string>('');

  const handleDenunciaClick = (vagaId: string) => {
    setSelectedVagaId(vagaId); // Define a vaga selecionada
    setModalOpen(true); // Abre o modal
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTitulo('');
    setConteudo('');
    setSelectedVagaId(null);
  };


    const handleSubmitDenuncia = async () => {
      if (selectedVagaId && titulo && conteudo) {  // Verifique se os dados estão completos
        try {
          const body = {
            denunciante_id: Number(idCurriculo),
            denunciante_tipo: 'Candidato',
            denunciado_id: Number(selectedVagaId),
            titulo,
            conteudo
          };
          console.log('Requisição para salvar denúncia:', body);

          await saveDenuncia(
            idCurriculo,
            selectedVagaId,
            Number(idCurriculo),
            'Candidato',
            Number(selectedVagaId),
            titulo,
            conteudo,
            loginStore.token
          );

         snackbarStore.setSeverity('success');
         snackbarStore.setMessage('Denúncia realizada com sucesso');
         snackbarStore.setOpenSnackbar(true);
         setModalOpen(false);
        } catch (error) {
          snackbarStore.setSeverity('error');
          snackbarStore.setMessage('Erro ao enviar denúncia. Tente novamente.');
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
        <div key={e.id} className="container mx-auto max-w-lg bg-white rounded border mt-4">
          <div className="flex px-5 pt-5">
            {e.Empresa.logo == null ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 text-background1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
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
            {e.descricao.length < 250 ? e.descricao : e.descricao.substring(0, 50) + " ..."}
          </div>

          <hr />
          <div className="bg-stone-50">
            <div className="p-5 mx-2 flex justify-between items-center">
              <p className="text-slate-400">{e.periodo}</p>
              <p className="text-background1 font-bold">
                {e.salario !== null ? "R$ " + e.salario?.toString().replace(".", ",") : "Faixa de salário indisponível"}
              </p>

              <div className="flex gap-4">
                <button
                  className="bg-background1 text-white py-2.5 px-6 rounded text-sm flex items-center"
                  onClick={() =>
                    navigate("/candidato/vagas/" + e.id, {
                      state: { status: e.status || undefined, isCandidacy: e.status !== undefined },
                    })
                  }
                >
                {props.candidaturas ? "Visualizar" : "Candidatar-se"}
                </button>

                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDenunciaClick(e.id)} // Passa a vaga selecionada
                  title="Denunciar vaga"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 4.5v5.25m0 2.25h.007v.008H12v-.008z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Estamos aqui para ouví-lo. Denuncie!</h2>
            <div className="mt-4">
              <label className="text-gray-500 text-sm ml-2">Título da denúncia</label>
              <textarea
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                rows={1}
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-500 text-sm ml-2">Conteúdo da denúncia</label>
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
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
                      onClick={handleSubmitDenuncia}
                      className="bg-background1 text-white py-2.5 px-6 rounded text-sm flex items-center"
                    >
                      Denunciar
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
