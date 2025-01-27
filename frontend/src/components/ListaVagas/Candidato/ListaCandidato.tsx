import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { saveDenuncia } from "../../../service/curriculo";
import { useStore } from "../../../hooks/stores";

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
}

export const Lista = observer((props: ListaProps) => {
  const navigate = useNavigate();
  const { listagem, idCurriculo } = props;
  const { loginStore } = useStore();


  // Estado para controlar a exibição do modal e a opção selecionada
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedVagaId, setSelectedVagaId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const handleDenunciaClick = (vagaId: string) => {
    setSelectedVagaId(vagaId); // Define a vaga selecionada
    setModalOpen(true); // Abre o modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Fecha o modal
    setSelectedOption(null); // Reseta a seleção
    setSelectedVagaId(null); // Reseta a vaga selecionada
  };


  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleSubmitDenuncia = async () => {
    if (selectedOption && selectedVagaId) {
      try {
        const tipoDenuncia = ["Conteúdo ofensivo", "Conteúdo sexual", "Informação falsa", "Discriminação ou ódio", "Outro motivo"].indexOf(selectedOption) + 1;
        await saveDenuncia(
          idCurriculo,
          selectedVagaId,
          Number(idCurriculo),
          'Candidato',
          Number(selectedVagaId),
          tipoDenuncia,
          loginStore.token
        );

        showToast('Denúncia realizada com sucesso!');
        setModalOpen(false);
      } catch (error) {
        showToast('Erro ao denunciar. Tente novamente.');
      }
    } else {
      alert("Por favor, selecione uma opção de denúncia.");
    }
  };

  return (
    <div>
      {listagem.map((e) => (
        <div key={e.id} className="container mx-auto max-w-lg bg-white rounded border mt-4">
          {/* Renderização da vaga */}
          <div className="flex px-5 pt-5">
            {/* Exibição do logo da empresa */}
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
                  Visualizar Vaga
                </button>

                {/* Ícone de Denúncia */}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Escolha o tipo de denúncia:</h2>
            <form>
              {["Conteúdo ofensivo", "Conteúdo sexual", "Informação falsa", "Discriminação ou ódio", "Outro motivo"].map((option) => (
                <div key={option} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="denuncia"
                      value={option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                </div>
              ))}
            </form>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleSubmitDenuncia}
              >
                Denunciar
              </button>
            </div>
          </div>
        </div>
      )}

      {toastVisible && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-3 bg-green-500 text-white rounded-md shadow-lg">
            {toastMessage}
          </div>
        )}
    </div>
  );
});
