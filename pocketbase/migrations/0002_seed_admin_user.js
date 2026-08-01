migrate(
  (app) => {
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'marlonsa@hotmail.com')
      return
    } catch (_) {}

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const record = new Record(users)
    record.setEmail('marlonsa@hotmail.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Admin Sustentabilidade')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'marlonsa@hotmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
