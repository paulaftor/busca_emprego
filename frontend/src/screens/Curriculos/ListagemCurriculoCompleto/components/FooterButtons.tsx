import { Box, ButtonBase } from '@mui/material';
import React from 'react';

type Props = {
    copiarEmail: () => void;
    setOpenModal: (open: boolean) => void
    setOpenModalAvaliacao: (open: boolean) => void
    setOpenModalDenuncia: (open: boolean) => void
}

const FooterButtons = ({ copiarEmail, setOpenModal, setOpenModalAvaliacao, setOpenModalDenuncia }: Props) => {
  return (
    <Box
      bgcolor="rgb(250 250 249)"
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      padding="1rem"
    >
      {/* Botão Entrar em contato */}
      <Box
        display="flex"
        alignItems="center"
        flexDirection="row"
        gap="1rem"
      >
        <ButtonBase
          sx={{
            backgroundColor: '#5E80BB',
            color: '#FFFFFF',
            paddingBlock: '0.625rem',
            paddingInline: '1.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            ':hover': {
              backgroundColor: '#4766AC',
            },
          }}
          onClick={copiarEmail}
        >
          Entrar em contato
        </ButtonBase>
      </Box>

      {/* Botões Denunciar e Avaliar */}
      <Box display="flex" alignItems="center" gap="1rem">
        <ButtonBase
          sx={{
            backgroundColor: '#5E80BB',
            color: '#FFFFFF',
            padding: '0.625rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            ':hover': {
              backgroundColor: '#4766AC',
            },
          }}
          onClick={() => setOpenModal(true)}  // Atualizar status
        >
          Atualizar status
        </ButtonBase>

        <Box display="flex" gap="1rem">
          {/* Botão Denunciar */}
          <ButtonBase
            sx={{
              color: 'red',
              ':hover': {
                color: '#C0392B',
              },
            }}
            title="Denunciar candidato"
            onClick={() => setOpenModalDenuncia(true)}  // Denunciar
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 4.5v5.25m0 2.25h.007v.008H12v-.008z" />
            </svg>
          </ButtonBase>

          <ButtonBase
            sx={{
              color: 'gold',
              ':hover': {
                color: '#F39C12',
              },
            }}
            title="Avaliar candidato"
            onClick={() => setOpenModalAvaliacao(true)}  // Avaliar
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-5.4 3.15 1.1-6.45-4.7-4.5 6.55-.55L12 3l2.4 6.3 6.55.55-4.7 4.5 1.1 6.45L12 17.75z" />
            </svg>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
}


export default FooterButtons;
