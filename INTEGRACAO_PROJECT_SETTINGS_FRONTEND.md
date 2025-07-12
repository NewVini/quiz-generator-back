# Integração das Settings do Projeto no Frontend

## 1. Endpoint para buscar as configurações

Busque as configurações de um projeto pelo endpoint:

```
GET /project-settings?project_id={ID_DO_PROJETO}
```

> Para buscar por ID da configuração específica:
> 
> ```
> GET /project-settings/{id}
> ```

---

## 2. Exemplo de resposta

```json
[
  {
    "id": "uuid-da-setting",
    "project_id": "uuid-do-projeto",
    "primary_color": "#3b82f6",
    "secondary_color": "#ffffff",
    "background_color": "#f9f9f9",
    "font_family": "Inter",
    "logo_base64": "data:image/png;base64,iVBORw0KGgoAAA...",
    "icon_base64": "data:image/png;base64,iVBORw0KGgoAAA...",
    "extra": {
      "borderRadius": "8px"
    },
    "created_at": "2024-06-07T12:00:00.000Z",
    "updated_at": "2024-06-07T12:00:00.000Z"
  }
]
```

---

## 3. Como usar no frontend

- Chame o endpoint ao carregar o quiz ou painel do projeto.
- Aplique as configurações recebidas nos componentes:
  - `primary_color`, `secondary_color`, `background_color`: use no CSS dos botões, backgrounds, etc.
  - `font_family`: defina como fonte global ou do quiz.
  - `logo_base64`, `icon_base64`: exiba as imagens convertendo o base64 para src de `<img>`.
  - `extra`: use para configurações adicionais (ex: borda, animações, etc).

---

## 4. Exemplo de uso em React

```js
// Exemplo usando fetch
const fetchSettings = async (projectId) => {
  const res = await fetch(`/project-settings?project_id=${projectId}`);
  const [settings] = await res.json();
  // Exemplo de uso do base64:
  // <img src={settings.logo_base64} alt="Logo" />
  // <img src={settings.icon_base64} alt="Ícone" />
  // ...e assim por diante
};
```

---

## 5. Dicas

- Cacheie as configurações para não buscar toda hora.
- Permita fallback para valores padrão caso algum campo venha nulo.
- Atualize as configurações em tempo real se o usuário puder editá-las.

---

Se quiser um exemplo mais detalhado para seu framework (React, Vue, etc), só pedir! 