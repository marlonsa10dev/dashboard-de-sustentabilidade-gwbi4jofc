onRecordCreate((e) => {
  const likelihood = e.record.getInt('likelihood')
  const impact = e.record.getInt('impact')
  const score = likelihood * impact
  var level = 'Baixo'
  if (score > 14) level = 'Crítico'
  else if (score > 9) level = 'Alto'
  else if (score > 4) level = 'Médio'
  e.record.set('score', score)
  e.record.set('level', level)
  e.next()
}, 'esg_risks')
