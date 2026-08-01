migrate(
  (app) => {
    var subtasksCol = app.findCollectionByNameOrId('esg_action_subtasks')

    var getActionId = function (title) {
      try {
        var record = app.findFirstRecordByData('esg_actions', 'title', title)
        return record.id
      } catch (_) {
        return null
      }
    }

    var subtasksByAction = {
      'Avaliação de impacto ambiental para nova torre': [
        { title: 'Estudo preliminar de impacto ambiental', status: 'Concluída' },
        { title: 'Levantamento de fauna e flora local', status: 'Concluída' },
        { title: 'Análise de ruído ambiental', status: 'Em andamento' },
        { title: 'Relatório final de impacto ambiental', status: 'Pendente' },
      ],
      'Gestão de resíduos na construção': [
        { title: 'Classificação de resíduos sólidos', status: 'Concluída' },
        { title: 'Contrato com empresa de destinação', status: 'Concluída' },
        { title: 'Implementação de triagem na obra', status: 'Concluída' },
        { title: 'Relatório mensal de destinação', status: 'Em andamento' },
        { title: 'Auditoria de conformidade', status: 'Pendente' },
      ],
      'Programa de relacionamento com comunidades': [
        { title: 'Mapeamento de comunidades vizinhas', status: 'Concluída' },
        { title: 'Reunião de apresentação do projeto', status: 'Concluída' },
        { title: 'Canal de ouvidoria comunitária', status: 'Em andamento' },
        { title: 'Plano de investimentos sociais', status: 'Pendente' },
      ],
      'Capacitação de mão de obra local': [
        { title: 'Levantamento de perfil profissional', status: 'Concluída' },
        { title: 'Parceria com instituição de ensino', status: 'Em andamento' },
        { title: 'Primeira turma de capacitação', status: 'Pendente' },
      ],
      'Diversidade e inclusão corporativa': [
        { title: 'Diagnóstico de diversidade', status: 'Concluída' },
        { title: 'Política de inclusão aprovada', status: 'Concluída' },
        { title: 'Treinamento de lideranças', status: 'Em andamento' },
        { title: 'Programa de recrutamento inclusivo', status: 'Pendente' },
      ],
      'Auditoria de conformidade ESG': [
        { title: 'Definição de escopo da auditoria', status: 'Concluída' },
        { title: 'Seleção de empresa auditadora', status: 'Concluída' },
        { title: 'Execução da auditoria in loco', status: 'Concluída' },
        { title: 'Plano de ação corretiva', status: 'Em andamento' },
      ],
      'Relatório de sustentabilidade GRI': [
        { title: 'Definição de materialidade', status: 'Em andamento' },
        { title: 'Coleta de dados ambientais', status: 'Pendente' },
        { title: 'Coleta de dados sociais', status: 'Pendente' },
      ],
      'Gestão de riscos ESG integrada': [
        { title: 'Mapeamento de riscos ESG', status: 'Concluída' },
        { title: 'Matriz de riscos aprovada', status: 'Concluída' },
        { title: 'Plano de mitigação por risco', status: 'Concluída' },
        { title: 'Monitoramento trimestral', status: 'Concluída' },
        { title: 'Integração com gestão corporativa', status: 'Em andamento' },
      ],
    }

    Object.keys(subtasksByAction).forEach(function (actionTitle) {
      var actionId = getActionId(actionTitle)
      if (!actionId) return

      subtasksByAction[actionTitle].forEach(function (subtask) {
        var existing = app.findRecordsByFilter(
          'esg_action_subtasks',
          'action = ? && title = ?',
          '',
          1,
          0,
          [actionId, subtask.title],
        )
        if (existing.length > 0) return

        var record = new Record(subtasksCol)
        record.set('title', subtask.title)
        record.set('action', actionId)
        record.set('status', subtask.status)
        app.save(record)
      })
    })
  },
  (app) => {
    try {
      app.truncateCollection(app.findCollectionByNameOrId('esg_action_subtasks'))
    } catch (_) {}
  },
)
