const models = require('../models');
const jwt = require('jsonwebtoken');

const candidato = models.Curriculo;
const empresa = models.Empresa;
const vaga = models.Vaga;

const candidatoController = {
  cadastroCandidato: async (req, res) => {
    await candidato
      .create(req.body)
      .then(() => {
        return res.json({
          error: false,
          message: 'Candidato(a) criado(a) com sucesso.',
        });
      })
      .catch((erro) => {
        console.log(erro);
        return res.status(400).json({
          error: true,
          message: 'Falha na criação do(a) candidato(a).',
        });
      });
  },

  loginCandidato: async (req, res) => {
    const candidato = models.Curriculo;

    try {
      let usuario = await candidato.findOne({
        where: {
          email: req.body.email,
          senha: req.body.senha,
        },
      });

      if (!usuario)
        return res.json({ erro: true, mensagem: 'Email ou senha inválido' });

      const token = jwt.sign(
        { _id: usuario._id, _cpf: usuario._cpf },
        `${process.env.SECRET}`
      );

      res.json({
        id: usuario.id,
        nome: usuario.nome,
        token: token,
      });
    } catch (e) {
      res.json(e);
    }
  },
  listarVagas: async (req, res) => {
    console.log('AQUII')
    await vaga
      .findAll({
        where: { visualizar: true },
        include: [
          {
            model: empresa,
            required: true,
            attributes: ['nome', 'logo'],
          },
        ],
      })
      .then((vagas) => res.json({ vagas }))
      .catch((erro) => {
        return res.status(400).json({
          error: true,
          message: erro,
        });
      });
  },
  listarVagasTESTE: async (req, res) => {
  
    const curriculovaga = models.CurriculosVagas;

  
    await curriculovaga
      .findAll({
        where: { CurriculoId: req.params.idCurriculo },  // Filtra por CurriculoId
        include: [
          {
            model: models.Vaga,      // Inclui o modelo Vaga
            required: true, 
            include: [
              {
                model: models.Empresa,  // Inclui o modelo Empresa dentro de Vaga
                required: true,         // Garante que sempre haverá uma empresa associada
              }
            ]         // Garante que sempre haverá uma vaga associada
          }
        ]
      })
      .then((vagas) => {
        const vagasArray = vagas.map((vaga) => {
          return {
         ...vaga.toJSON(), 
        }});
        res.json(vagasArray);  // Retorna as vagas como um array
      })
      .catch((erro) => {
        return res.status(400).json({
          error: true,
          message: erro,
        });
      });
  },

  listarVagasAvaliar: async (req, res) => {
    const curriculovaga = models.CurriculosVagas;

    try {
      await curriculovaga
        .findAll({
          where: {
            CurriculoId: req.params.idCurriculo,
            status: {
              [Op.in]: ['Aceito', 'Rejeitado']
            }
          },
          include: [
            {
              model: models.Vaga,
              required: true,
              include: [
                {
                  model: models.Empresa,
                  required: true,
                }
              ]
            }
          ]
        })
        .then((vagas) => {
          const vagasArray = vagas.map((vaga) => {
            return {
              ...vaga.toJSON(),
            };
          });
          res.json(vagasArray);
        })
        .catch((erro) => {
          return res.status(400).json({
            error: true,
            message: erro,
          });
        });
    } catch (erro) {
      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor.',
      });
    }
  },

  adicionarAvaliacao: async (req, res) => {
      const { avaliador_id, avaliador_tipo, avaliado_id, nota, pros, contras } = req.body;

      if (![1, 2, 3, 4, 5].includes(nota)) {
        return res.status(400).json({ message: 'Nota deve ser entre 1 e 5.' });
      }
      if (!pros || !contras) {
        return res.status(400).json({ message: 'É necessário informar os prós e contras.' });
      }

      try {
        let avaliacao = await Avaliacao.findOne({
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
            message: 'Avaliação atualizada com sucesso.',
          });
        } else {
          await Avaliacao.create({
            avaliador_id,
            avaliador_tipo,
            avaliado_id,
            nota,
            pros,
            contras
          });

          return res.json({
            error: false,
            message: 'Avaliação registrada com sucesso.',
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: true,
          message: 'Erro ao tentar adicionar ou atualizar a avaliação.',
        });
      }
    },


  listarVagasSearch: async (req, res) => {
    const Sequelize = require('sequelize');
    const { Op } = Sequelize;

    const queryTitulo = `%${req.body.titulo}%`;
    const queryDescricao = `%${req.body.descricao}%`;
    const queryEmpresa = `%${req.body.empresa}%`;

    await vaga
      .findAll({
        where: {
          titulo: { [Op.like]: queryTitulo },
          descricao: { [Op.like]: queryDescricao },
          '$empresa.nome$': { [Op.like]: queryEmpresa },
          visualizar: true,
        },
        include: [
          {
            model: empresa,
            required: true,
            attributes: ['nome', 'logo'],
          },
        ],
      })
      .then((vagas) => res.json({ vagas }))
      .catch((erro) => {
        return res.status(400).json({
          error: true,
          message: erro,
        });
      });
  },

  exibirDadosVaga: async (req, res) => {
    await vaga
      .findOne({
        where: { id: req.params.id },
        include: [
          {
            model: empresa,
            required: true,
            attributes: ['nome', 'logo'],
          },
        ],
      })
      .then((vagas) => res.json({ vagas }))
      .catch((erro) => {
        return res.status(400).json({
          error: true,
          message: erro,
        });
      });
  },
};

module.exports = candidatoController;
