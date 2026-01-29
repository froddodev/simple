# Simple bot

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=flat-square&logo=discord)](https://discord.js.org/)

</div>

Asistente modular para Discord enfocado en streaming de música de alta fidelidad y automatización de procesos mediante tareas programadas.

> [!NOTE]
> **Notas Técnicas:**
>
> - **Sin DB:** Configuración basada íntegramente en archivos locales (`responses.json`) para una implementación inmediata.
> - **Streaming Directo:** Integración con `discord-player` y `youtube` para evitar buffers innecesarios.
> - **Precisión Temporal:** El scheduler está ajustado específicamente para la zona horaria de Chile (`America/Santiago`), garantizando que los anuncios programados se ejecuten en el bloque horario correcto.

---

## Configuración y Variables de Entorno

### 1. Entorno (.env)

| Variable | Descripción               |
| :------- | :------------------------ |
| `TOKEN`  | Token del bot de Discord. |

### 2. Esquema de Programación (`responses.json`)

| Campo      | Tipo   | Descripción                                                 |
| :--------- | :----- | :---------------------------------------------------------- |
| `channel`  | String | Nombre exacto del canal de texto destino.                   |
| `hour`     | Number | Hora de ejecución (0-23).                                   |
| `minute`   | Number | Minuto de ejecución (0-59).                                 |
| `messages` | Array  | Lista de strings con los mensajes a enviar simultáneamente. |

**Ejemplo de configuración:**

```json
{
  "program": [
    {
      "channel": "general",
      "hour": 13,
      "minute": 30,
      "messages": [
        "¡Hola! Este es un mensaje programado automático.",
        "Recuerden revisar el reporte diario."
      ]
    }
  ]
}
```

---

## Ejecución Local

```bash
# Instalación
npm install

# Iniciar
npm start
```

---

> [!TIP]
> **Nota del Desarrollador:**
> Úsalo bajo tu propia responsabilidad. El código está diseñado para ser liviano y no me hago cargo de fallos en implementaciones donde se intente forzar más allá de su propósito original.
