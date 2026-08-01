migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('esg_checklist_items')
    if (!col.fields.getByName('evidence')) {
      col.fields.add(
        new FileField({
          name: 'evidence',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('esg_checklist_items')
    const field = col.fields.getByName('evidence')
    if (field) col.fields.remove(field)
    app.save(col)
  },
)
