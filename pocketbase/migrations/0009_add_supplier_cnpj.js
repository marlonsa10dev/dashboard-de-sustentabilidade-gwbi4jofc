migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('esg_suppliers')
    if (!col.fields.getByName('cnpj')) {
      col.fields.add(new TextField({ name: 'cnpj' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('esg_suppliers')
    const f = col.fields.getByName('cnpj')
    if (f) col.fields.remove(f)
    app.save(col)
  },
)
