# Desenvolvimento

Como o portfólio é feito, como rodar e como mudar. A vitrine fica no [README.md](README.md).

## Como funciona

- **Conteúdo:** todo texto vem de [data.json](data.json). Mudar conteúdo é mudar só esse arquivo. O build valida o arquivo e para com `data.json: <caminho>: <problema>` se algo estiver errado.
- **Página:** [src/App.tsx](src/App.tsx) monta a barra de abas, o painel de abertura ([SubjectFile](src/components/SubjectFile.tsx)), as seções e o rodapé. Cada parte é um componente em [src/components/](src/components/).
- **Mover uma seção:** reordene `SECTIONS` em [src/model/sections.ts](src/model/sections.ts). A ordem na página, o número da seção e as abas seguem essa lista. Os testes `PAGE-16` e `NAV-01` em [tests/unit/sections.spec.ts](tests/unit/sections.spec.ts) fixam a ordem atual: atualize-os junto.
- **Mover um painel do topo:** os três painéis (`TestSuite`, `Profile`, `StackTables`) ficam lado a lado em [SubjectFile.tsx](src/components/SubjectFile.tsx). Troque a ordem ou leve um deles para outro lugar.
- **Visual:** componentes do design system Dossier em [src/dossier/](src/dossier/); layout da página em [src/styles/page.css](src/styles/page.css).

## Rodar localmente

Tudo roda no container `node` do [compose.yaml](compose.yaml). Nada é instalado na máquina. Rode os comandos na raiz do repositório.

### 1. Instalar dependências (só na primeira vez)

```bash
docker compose run --rm node npm ci
```

Isso cria `node_modules` dentro do repositório, pelo container.

### 2. Desenvolver com recarga automática

```bash
docker compose run --rm --service-ports node npm run dev
```

Abra http://localhost:5173. Cada arquivo salvo em `src/` ou `data.json` atualiza a página na hora. Um `data.json` inválido para o servidor com `data.json: <caminho>: <problema>`. O servidor de dev não checa tipos.

Para checar tipos enquanto edita, abra um segundo terminal:

```bash
docker compose run --rm node npx tsc --noEmit --watch
```

### 3. Gerar o build

```bash
docker compose run --rm node npm run build
```

Checa os tipos e gera `dist/`, que é o que o GitHub Pages publica.

Para gerar `dist/` de novo a cada arquivo salvo (sem checar tipos):

```bash
docker compose run --rm node npx vite build --watch
```

### 4. Ver o build no navegador

```bash
docker compose run --rm --service-ports node npx vite preview --host 0.0.0.0 --port 5173
```

Abra http://localhost:5173. O script `npm run preview` não abre do navegador: ele escuta só dentro do container (`127.0.0.1:4173`) e é o que os testes usam.

### 5. Testar

```bash
docker compose run --rm node npm test          # build e todos os testes Playwright
docker compose run --rm node npm run test:smoke  # build e só os testes @smoke
```

Pare qualquer comando com Ctrl+C. O `--rm` remove o container ao sair.

## Publicar

Cada push em `master` roda o [workflow](.github/workflows/pages.yml): `npm ci`, build, todos os testes e deploy de `dist/`. Um teste falhando bloqueia o deploy. Em Settings > Pages, a Source precisa estar em "GitHub Actions".

---
