const models = require('../models');
const jwt = require('jsonwebtoken');

const empresa = models.Empresa;

const empresaController = {
  cadastroEmpresa: async (req, res) => {
    await empresa
      .create(req.body)
      .then(() => {
        return res.json({
          error: false,
          message: 'Empresa criada com sucesso.',
        });
      })
      .catch((erro) => {
        console.log(erro);
        return res.status(400).json({
          error: true,
          message: 'Falha na criação da empresa.',
        });
      });
  },

  loginEmpresa: async (req, res) => {
    let usuario = await empresa.findOne({
      where: {
        cnpj: req.body.cnpj,
        senha: req.body.senha,
      },
    });

    if (!usuario)
      return res.json({ erro: true, mensagem: 'Cnpj ou senha inválido' });

    const token = jwt.sign(
      { _id: usuario._id, _cnpj: usuario._cnpj },
      process.env.SECRET
    );

    res.json({
      id: usuario.id,
      token: token,
      nome: usuario.nome,
    });
  },

  avaliar: async (req, res) => {
    const { avaliador_id, avaliador_tipo, avaliado_id, nota, pros, contras } = req.body;

    if (![1, 2, 3, 4, 5].includes(nota)) {
      return res.status(400).json({ message: 'Nota deve ser entre 1 e 5.' });
    }
    if (!pros || !contras) {
      return res.status(400).json({ message: 'É necessário informar os prós e contras.' });
    }

    const avaliacoes = models.Avaliacao;

    try {
      let avaliacao = await avaliacoes.findOne({
        where: {
          avaliador_id,
          avaliador_tipo,
          avaliado_id
        }
      });

      if (avaliacao) {
        avaliacao.nota = nota;
        avaliacao.pros = pros;
        avaliacao.contras = contras;
        await avaliacao.save();

        return res.json({
          error: false,
          message: 'Avaliação do currículo atualizada com sucesso.',
        });
      } else {
        await avaliacoes.create({
          avaliador_id,
          avaliador_tipo,
          avaliado_id,
          nota,
          pros,
          contras
        });

        return res.json({
          error: false,
          message: 'Avaliação do currículo registrada com sucesso.',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Erro ao tentar adicionar ou atualizar a avaliação do currículo.',
      });
    }
  },


denunciar: async (req, res) => {
  const { denunciante_id, denunciante_tipo, denunciado_id, tipo_denuncia } = req.body;

  if (![1, 2, 3, 4, 5].includes(tipo_denuncia)) {
    return res.status(400).json({ message: 'Tipo de denúncia deve ser entre 1 e 5.' });
  }

  const denuncias = models.Denuncia;

  try {
    let denuncia = await avaliacoes.findOne({
      where: {
        denunciante_id,
        denunciante_tipo,
        denunciado_id
      }
    });

    if (denuncia) {
      denuncia.tipo_denuncia = tipo_denuncia;
      await denuncia.save();

      return res.json({
        error: false,
        message: 'Denuncia atualizada com sucesso.',
      });
    } else {
      await denuncias.create({
        denunciante_id,
        denunciante_tipo,
        denunciado_id,
        tipo_denuncia
      });

      return res.json({
        error: false,
        message: 'Denúncia registrada com sucesso.',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao tentar adicionar ou atualizar a denúncia.',
    });
  }
},

};



module.exports = empresaController;
