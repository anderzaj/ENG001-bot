# activity-bot
Un bot para acumular horas en el curso de ingles online de la UAI, ya que requieren un minimo de horas semanales

necesita un archivo "secrets.js" que exporta un objeto de la forma

```
const keys = {
  username: <tu usuario>,
  password: <tu clave>
}

module.exports = keys;
```

para ser usado en index.js para acceder a la plataforma y acumular horas
