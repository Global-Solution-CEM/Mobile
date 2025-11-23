# Scripts do Projeto

## Atualizar Hash do Commit

O hash do commit é usado na tela "Sobre o App" para identificar a versão do código.

### Método 1: Script Automático (Recomendado)

Execute o script npm que atualiza automaticamente:

```bash
npm run update:commit
```

Este comando:
- Obtém o hash do commit atual do Git
- Atualiza automaticamente o arquivo `utils/buildInfo.js`

### Método 2: Script Node.js Direto

```bash
node scripts/update-commit-hash.js
```

### Método 3: Atualização Manual

1. Obtenha o hash do commit atual:
   ```bash
   git rev-parse HEAD
   ```

2. Abra o arquivo `utils/buildInfo.js`

3. Substitua o valor de `COMMIT_HASH` pelo hash obtido:
   ```javascript
   export const COMMIT_HASH = 'seu-hash-aqui';
   ```

### Quando Atualizar?

- Antes de fazer um build de produção
- Após cada commit importante
- Quando quiser que a tela "Sobre" mostre o commit correto

### Nota

O script funciona apenas em repositórios Git. Se você não estiver em um repositório Git, o hash será mantido como está ou você pode atualizá-lo manualmente.

