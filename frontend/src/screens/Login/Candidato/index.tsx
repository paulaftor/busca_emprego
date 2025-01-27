import { Box, Typography, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ExitButton, InputLogin, LoginButton, RegisterButton } from './styles';
import { Close, EmailOutlined, LockOutlined } from '@mui/icons-material';
import paper from '../../../assets/images/paper.svg';
import line from '../../../assets/icons/line.svg';
import { useStore } from '../../../hooks/stores';
import { observer } from 'mobx-react-lite';
import { delay } from '../../../utils';

export const LoginCandidato = observer(() => {
  const navigate = useNavigate();
  const { loginStore } = useStore();

 const handleLogin = async () => {
   loginStore.setLoading(true);
   await delay(1000);

   const response = await loginStore.authCandidato();
   if (response.ok) {
     loginStore.getPersistedStore();
     const idCurriculo = loginStore.user.id;
     navigate(`/candidato/${idCurriculo}/vagas`);
   }
   loginStore.setLoading(false);
 };



  return (
    <Box
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      gap="5rem"
    >
      <ExitButton onClick={() => navigate('/')}>
        <Close />
      </ExitButton>
      <Box
        marginX="auto"
        sx={{
          maxWidth: { sm: 384 },
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="5rem"
      >
        <Box
          bgcolor="#00227B"
          maxWidth={221}
          maxHeight={221}
          padding={5}
          display="flex"
          borderRadius={30}
          justifyContent="center"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <img src={paper} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          textAlign="center"
          gap="0.75rem"
        >
          <Typography variant="h5" color="#FFFFFF" fontWeight="bold">
            Bem vindo (a)
          </Typography>
          <Typography variant="subtitle1" color="#FFFFFF">
            O buscaEmprego ajuda você a se conectar e compartilhar seus
            objetivos.
          </Typography>
        </Box>
      </Box>
      <Box
        bgcolor="#FFFFFF"
        height="100vh"
        width="40vw"
        sx={{
          borderTopLeftRadius: '5rem',
          borderBottomLeftRadius: '5rem',
        }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          marginBottom="2.5rem"
        >
          Faça Login
        </Typography>
        <Box sx={{ width: '55%', margin: '0 auto' }}>
          <Box position="relative">
            <EmailOutlined
              sx={{
                position: 'absolute',
                top: 8,
                left: 9,
                color: '#E7E7E7',
              }}
            />
            <InputLogin
              type="email"
              required
              placeholder="Email"
              id="email"
              value={loginStore.email}
              autoFocus
              onChange={(event) => loginStore.setEmail(event.target.value)}
            />
          </Box>

          <Box position="relative" marginTop={1}>
            <LockOutlined
              sx={{
                position: 'absolute',
                top: 8,
                left: 9,
                color: '#E7E7E7',
              }}
            />
            <InputLogin
              required
              type="password"
              placeholder="Senha"
              id="senha"
              value={loginStore.senha}
              autoFocus
              onChange={(event) => loginStore.setSenha(event.target.value)}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            marginTop="0.5rem"
            marginBottom="1rem"
          >
            {loginStore.error !== '' ? (
              <Box component="span" color="red" textAlign="left">
                {loginStore.error}
              </Box>
            ) : (
              <div></div>
            )}
            <Link
              display="inline-block"
              textAlign="right"
              color="#6F74DD"
              sx={{
                textDecoration: 'none',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
              onClick={() => navigate('/')}
            >
              Esqueceu a senha?
            </Link>
          </Box>

          <LoginButton onClick={handleLogin} type="submit">
            {loginStore.loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <Typography>Entrar</Typography>
            )}
          </LoginButton>
          <Box textAlign="center" margin="0.5rem">
            <Typography
              color="#828282"
              marginBottom="2rem"
              display="flex"
              justifyContent="center"
              gap="0.5rem"
            >
              <img src={line} />
              Ou
              <img src={line} />
            </Typography>
            <Typography color="#828282">Ainda não tem uma conta?</Typography>
          </Box>
          <RegisterButton onClick={() => navigate('/cadastro/candidato')}>
            Cadastrar
          </RegisterButton>
        </Box>
      </Box>
    </Box>
  );
});
